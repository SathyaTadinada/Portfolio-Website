'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './valentine-bouquet.module.css'
import { Dices, RotateCcw, Eye, EyeOff, Eraser } from 'lucide-react'

type FlowerKind = 'rose' | 'tulip' | 'daisy' | 'lily' | 'orchid' | 'sunflower'

const DEFAULT_DISPLAY_NAME = 'Your Valentine'
const DEFAULT_TAGLINE = 'a bouquet, letter by letter'

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n))
}

function normalizeName(raw: string) {
  return raw
    .replace(/[^\p{L}\s'\-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeTagline(raw: string) {
  return raw
    .replace(/[^\p{L}\p{N}\s'"\-.,!?&:;()/]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Simple seeded RNG (xorshift32)
function makeRng(seed: number) {
  let x = seed | 0
  return () => {
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    return ((x >>> 0) % 1_000_000) / 1_000_000
  }
}

function hashStringToSeed(s: string) {
  let h = 2166136261 // FNV-1a 32-bit offset basis
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619) // FNV-1a 32-bit prime
  }
  return h | 0
}

function letterToFlowerKind(letter: string): FlowerKind {
  const c = letter.toLowerCase()
  if (c >= 'a' && c <= 'd') return 'rose'
  if (c >= 'e' && c <= 'h') return 'tulip'
  if (c >= 'i' && c <= 'm') return 'daisy'
  if (c >= 'n' && c <= 'r') return 'lily'
  if (c >= 's' && c <= 'v') return 'orchid'
  return 'sunflower'
}

function pickPalette(kind: FlowerKind) {
  switch (kind) {
    case 'rose':
      return {
        petals: ['#ff4d6d', '#ff758f', '#ff8fab', '#ff2e63'],
        accent: ['#ffd6e0', '#ffe5ec'],
        center: ['#ffcad4', '#ffc2d1'],
      }
    case 'tulip':
      return {
        petals: ['#ff6b6b', '#f06595', '#cc5de8', '#845ef7'],
        accent: ['#fff0f6', '#f8f0fc'],
        center: ['#ffd8a8', '#ffe066'],
      }
    case 'daisy':
      return {
        petals: ['#ffffff', '#fff7ff', '#f8f9fa'],
        accent: ['#ffd43b', '#ffe066'],
        center: ['#ffb703', '#f59f00'],
      }
    case 'lily':
      return {
        petals: ['#ffe3e3', '#ffc9c9', '#ffd6e0', '#ffe8f0'],
        accent: ['#fff0f6', '#fff5f5'],
        center: ['#ffd8a8', '#ffa94d'],
      }
    case 'orchid':
      return {
        petals: ['#c77dff', '#9d4edd', '#e0aaff', '#b5179e'],
        accent: ['#f3d9fa', '#eebefa'],
        center: ['#ffd6a5', '#ffadad'],
      }
    case 'sunflower':
      return {
        petals: ['#ffd43b', '#ffe066', '#fab005', '#fcc419'],
        accent: ['#fff3bf', '#ffec99'],
        center: ['#6f4e37', '#5c4033', '#3f2d2b'],
      }
  }
}

function drawSoftGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  alpha = 0.25,
) {
  ctx.save()
  ctx.globalAlpha = alpha
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, color)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

function drawStem(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  thickness: number,
  color: string,
) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = thickness
  ctx.lineCap = 'round'
  ctx.beginPath()

  const cx = (x0 + x1) / 2 + (x0 - x1) * 0.08
  const cy = (y0 + y1) / 2 + (y1 - y0) * 0.12

  ctx.moveTo(x0, y0)
  ctx.quadraticCurveTo(cx, cy, x1, y1)
  ctx.stroke()
  ctx.restore()
}

function drawLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rot: number,
  fill: string,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.fillStyle = fill

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(w * 0.55, -h * 0.15, w, -h * 0.55)
  ctx.quadraticCurveTo(w * 0.6, -h * 0.9, 0, -h)
  ctx.quadraticCurveTo(-w * 0.6, -h * 0.9, -w, -h * 0.55)
  ctx.quadraticCurveTo(-w * 0.55, -h * 0.15, 0, 0)
  ctx.closePath()

  ctx.globalAlpha = 0.9
  ctx.fill()

  ctx.globalAlpha = 0.18
  ctx.strokeStyle = '#000'
  ctx.lineWidth = Math.max(1, w * 0.08)
  ctx.beginPath()
  ctx.moveTo(0, -h * 0.05)
  ctx.quadraticCurveTo(0, -h * 0.5, 0, -h * 0.9)
  ctx.stroke()

  ctx.restore()
}

function drawFlower(
  ctx: CanvasRenderingContext2D,
  kind: FlowerKind,
  x: number,
  y: number,
  size: number,
  rot: number,
  rng: () => number,
) {
  const pal = pickPalette(kind)
  const petal = pal.petals[Math.floor(rng() * pal.petals.length)]
  const accent = pal.accent[Math.floor(rng() * pal.accent.length)]
  const center = pal.center[Math.floor(rng() * pal.center.length)]

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)

  drawSoftGlow(ctx, 0, 0, size * 1.2, petal, 0.16)

  const petalsCount =
    kind === 'rose'
      ? 10
      : kind === 'tulip'
        ? 6
        : kind === 'daisy'
          ? 12
          : kind === 'lily'
            ? 7
            : kind === 'orchid'
              ? 6
              : 14

  for (let i = 0; i < petalsCount; i++) {
    const a = (i / petalsCount) * Math.PI * 2
    const rr = size * (0.55 + rng() * 0.12)
    const pw = size * (0.55 + rng() * 0.25)
    const ph = size * (0.95 + rng() * 0.35)

    ctx.save()
    ctx.rotate(a)

    ctx.fillStyle = i % 2 === 0 ? petal : accent
    ctx.globalAlpha = 0.95

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(pw * 0.65, -ph * 0.25, pw * 0.15, -ph * 0.85)
    ctx.quadraticCurveTo(0, -ph, -pw * 0.15, -ph * 0.85)
    ctx.quadraticCurveTo(-pw * 0.65, -ph * 0.25, 0, 0)
    ctx.closePath()

    ctx.translate(0, rr * 0.25)
    ctx.fill()
    ctx.restore()
  }

  ctx.globalAlpha = 1
  ctx.fillStyle = center
  ctx.beginPath()
  ctx.arc(0, 0, size * (kind === 'sunflower' ? 0.35 : 0.24), 0, Math.PI * 2)
  ctx.fill()

  if (kind === 'sunflower' || kind === 'daisy') {
    ctx.globalAlpha = 0.25
    ctx.fillStyle = '#000'
    for (let i = 0; i < 18; i++) {
      const a = rng() * Math.PI * 2
      const r = rng() * size * 0.22
      ctx.beginPath()
      ctx.arc(Math.cos(a) * r, Math.sin(a) * r, size * 0.03, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.restore()
}

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const a = document.createElement('a')
  a.download = filename
  a.href = canvas.toDataURL('image/png')
  a.click()
}

export default function ValentineBouquet() {
  const [name, setName] = useState('')
  const [cleanName, setCleanName] = useState('')

  const [tagline, setTagline] = useState('')
  const [cleanTagline, setCleanTagline] = useState('')

  const [hint, setHint] = useState<string | null>(null)
  const [variation, setVariation] = useState(0)
  const [showWatermark, setShowWatermark] = useState(true)

  const EXPORT_W = 1200
  const EXPORT_H = 1500

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const normalizedName = useMemo(() => normalizeName(name), [name])
  const normalizedTagline = useMemo(() => normalizeTagline(tagline), [tagline])

  useEffect(() => {
    setCleanName(normalizedName)
    setVariation(0)
  }, [normalizedName])

  useEffect(() => {
    setCleanTagline(normalizedTagline)
  }, [normalizedTagline])

  const bouquetSpec = useMemo(() => {
    const baseName = cleanName.length ? cleanName : DEFAULT_DISPLAY_NAME

    const letters = baseName.replace(/[^A-Za-z]/g, '')
    const kinds: FlowerKind[] = []
    for (const ch of letters) kinds.push(letterToFlowerKind(ch))

    const seed = hashStringToSeed(`${baseName}#${variation}`)
    return { seed, kinds, baseName }
  }, [cleanName, variation])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = EXPORT_W
    canvas.height = EXPORT_H

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const displayName = bouquetSpec.baseName
    const displayTagline = cleanTagline.length ? cleanTagline : DEFAULT_TAGLINE

    const rng = makeRng(bouquetSpec.seed)

    const bg = ctx.createLinearGradient(0, 0, EXPORT_W, EXPORT_H)
    bg.addColorStop(0, '#1a0b2e')
    bg.addColorStop(0.45, '#2b124c')
    bg.addColorStop(1, '#0b1026')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, EXPORT_W, EXPORT_H)

    for (let i = 0; i < 22; i++) {
      const x = rng() * EXPORT_W
      const y = rng() * EXPORT_H * 0.65
      const r = 80 + rng() * 180
      const colors = ['#ff4d6d', '#c77dff', '#ffe066', '#ffd6e0', '#9d4edd']
      drawSoftGlow(
        ctx,
        x,
        y,
        r,
        colors[Math.floor(rng() * colors.length)],
        0.12,
      )
    }

    const pad = 70
    const cardX = pad
    const cardY = 90
    const cardW = EXPORT_W - pad * 2
    const cardH = EXPORT_H - 160

    ctx.save()
    ctx.globalAlpha = 0.22
    ctx.fillStyle = '#000'
    roundRect(ctx, cardX + 10, cardY + 16, cardW, cardH, 42)
    ctx.fill()
    ctx.restore()

    ctx.save()
    const cardGrad = ctx.createLinearGradient(
      cardX,
      cardY,
      cardX + cardW,
      cardY + cardH,
    )
    cardGrad.addColorStop(0, 'rgba(255,255,255,0.10)')
    cardGrad.addColorStop(1, 'rgba(255,255,255,0.04)')
    ctx.fillStyle = cardGrad
    roundRect(ctx, cardX, cardY, cardW, cardH, 42)
    ctx.fill()
    ctx.restore()

    ctx.save()
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.shadowColor = 'rgba(255, 117, 143, 0.45)'
    ctx.shadowBlur = 18
    ctx.font = `700 86px ui-serif, Georgia, "Times New Roman", Times, serif`
    ctx.fillText(displayName, EXPORT_W / 2, 230)

    ctx.shadowBlur = 0
    ctx.fillStyle = 'rgba(255,255,255,0.65)'
    ctx.font = `500 28px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`

    const maxTagChars = 44
    const tag =
      displayTagline.length > maxTagChars
        ? displayTagline.slice(0, maxTagChars - 1) + '…'
        : displayTagline

    ctx.fillText(tag, EXPORT_W / 2, 280)
    ctx.restore()

    const n = bouquetSpec.kinds.length
    const bouquetCenterX = EXPORT_W / 2
    const bundleX = bouquetCenterX
    const bundleY = 1290

    const perRing = 8
    const ringGapY = 120
    const fanAngle = 1.25
    const maxSpreadX = 450
    const topY = 585

    const flowers = bouquetSpec.kinds.map((kind, i) => {
      const ring = Math.floor(i / perRing)
      const idx = i % perRing
      const countInRing = Math.min(perRing, n - ring * perRing)

      const t = countInRing <= 1 ? 0.5 : idx / (countInRing - 1)
      const angle = (t - 0.5) * fanAngle

      const spread = maxSpreadX * (0.98 + ring * 0.06)

      const px = bouquetCenterX + Math.sin(angle) * spread + (rng() - 0.5) * 14
      const py =
        topY + ring * ringGapY + (Math.cos(angle) - 1) * 40 + (rng() - 0.5) * 14

      const size = clamp(70 - ring * 8 + rng() * 8, 38, 78)
      const rot = angle * 0.28 + (rng() - 0.5) * 0.2

      return { kind, px, py, size, rot, layer: ring }
    })

    const stemColor = 'rgba(122, 199, 126, 0.85)'
    const stemDark = 'rgba(56, 154, 98, 0.9)'

    for (const f of flowers) {
      const stemThickness = clamp(f.size * 0.12, 6, 14)
      const endX = f.px + (rng() - 0.5) * 14
      const endY = f.py + f.size * 0.48

      drawStem(ctx, bundleX, bundleY, endX, endY, stemThickness + 2, stemDark)
      drawStem(ctx, bundleX, bundleY, endX, endY, stemThickness, stemColor)

      const leafCount = rng() < 0.45 ? 2 : 1
      for (let k = 0; k < leafCount; k++) {
        const lx =
          bundleX +
          (endX - bundleX) * (0.45 + rng() * 0.35) +
          (rng() - 0.5) * 14
        const ly =
          bundleY +
          (endY - bundleY) * (0.45 + rng() * 0.35) +
          (rng() - 0.5) * 14

        const lw = 18 + rng() * 14
        const lh = 40 + rng() * 22
        const lr = (rng() - 0.5) * 1.05
        const lf =
          rng() < 0.5 ? 'rgba(112, 218, 158, 0.85)' : 'rgba(82, 196, 130, 0.85)'
        drawLeaf(ctx, lx, ly, lw, lh, lr, lf)
      }
    }

    ctx.save()
    const wrapW = 480
    const wrapH = 120
    const wrapX = bouquetCenterX - wrapW / 2
    const wrapY = 1220

    ctx.globalAlpha = 0.95
    const wrapGrad = ctx.createLinearGradient(
      wrapX,
      wrapY,
      wrapX + wrapW,
      wrapY + wrapH,
    )
    wrapGrad.addColorStop(0, '#ff4d6d')
    wrapGrad.addColorStop(0.5, '#ff8fab')
    wrapGrad.addColorStop(1, '#c77dff')

    ctx.fillStyle = wrapGrad
    roundRect(ctx, wrapX, wrapY, wrapW, wrapH, 48)
    ctx.fill()

    ctx.globalAlpha = 0.25
    ctx.fillStyle = '#000'
    roundRect(ctx, wrapX, wrapY + 10, wrapW, wrapH, 48)
    ctx.fill()

    ctx.globalAlpha = 0.95
    ctx.fillStyle = 'rgba(255,255,255,0.22)'
    ctx.beginPath()
    ctx.ellipse(bouquetCenterX - 140, wrapY + 55, 100, 56, -0.2, 0, Math.PI * 2)
    ctx.ellipse(bouquetCenterX + 140, wrapY + 55, 100, 56, 0.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    const sorted = [...flowers].sort((a, b) => b.layer - a.layer)
    for (const f of sorted)
      drawFlower(ctx, f.kind, f.px, f.py, f.size, f.rot, rng)

    ctx.save()
    const vignette = ctx.createRadialGradient(
      EXPORT_W / 2,
      EXPORT_H * 0.45,
      EXPORT_W * 0.2,
      EXPORT_W / 2,
      EXPORT_H * 0.55,
      EXPORT_W * 0.85,
    )
    vignette.addColorStop(0, 'rgba(0,0,0,0)')
    vignette.addColorStop(1, 'rgba(0,0,0,0.55)')
    ctx.fillStyle = vignette
    ctx.fillRect(0, 0, EXPORT_W, EXPORT_H)
    ctx.restore()

    if (showWatermark) {
      ctx.save()
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(255,255,255,0.45)'
      ctx.font = `500 22px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`
      ctx.fillText('tadinada.com/valentine', EXPORT_W / 2, EXPORT_H - 80)
      ctx.restore()
    }
  }, [bouquetSpec, cleanTagline, showWatermark])

  function onShuffle() {
    setVariation(Math.floor(Math.random() * 1_000_000_000))
    // No popup/hint — per your request
  }

  function onResetVariant() {
    setVariation(0)
    // No popup/hint — stays quiet
  }

  function onDownload() {
    const canvas = canvasRef.current
    if (!canvas) return

    const nm = cleanName.length ? cleanName : 'valentine'
    const safe = nm.replace(/\s+/g, '_').toLowerCase()
    downloadCanvas(canvas, `bouquet_${safe}.png`)

    setHint('Saved! Check your Downloads.')
    window.setTimeout(() => setHint(null), 2500)
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.panelOuter} sm:px-8 lg:px-8`}>
        <div className={styles.breathTop} />

        <section className={styles.sectionMask}>
          <div className={styles.blueSection}>
            <div className={styles.inner}>
              <div className={styles.headerBlock}>
                <h1 className={styles.title}>Valentine Bouquet</h1>
                <p className={styles.subtitle}>
                  Type a name. Each letter becomes a flower. Press{' '}
                  <span className={styles.kbd}>Enter</span> to download a PNG.
                </p>
              </div>

              <div className={styles.grid}>
                <div className={styles.card}>
                  <label className={styles.label}>Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onDownload()
                    }}
                    placeholder="Type a name…"
                    className={styles.input}
                    maxLength={32}
                  />

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Tagline (optional)</label>
                    <input
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onDownload()
                      }}
                      placeholder={DEFAULT_TAGLINE}
                      className={styles.input}
                      maxLength={64}
                    />
                    <div className={styles.fieldHint}>
                      Shows under the title on the exported card.
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button onClick={onDownload} className={styles.primaryBtn}>
                      Download Bouquet
                    </button>

                    <div className={styles.iconActions}>
                      <button
                        type="button"
                        onClick={onShuffle}
                        className={styles.iconBtn}
                        aria-label="Shuffle bouquet layout"
                        title="Shuffle"
                      >
                        <Dices size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={onResetVariant}
                        className={styles.iconBtn}
                        aria-label="Reset to default layout"
                        title="Reset"
                        disabled={variation === 0}
                      >
                        <RotateCcw size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowWatermark((v) => !v)}
                        className={styles.iconBtn}
                        aria-label={
                          showWatermark ? 'Hide watermark' : 'Show watermark'
                        }
                        aria-pressed={showWatermark}
                        title={
                          showWatermark ? 'Hide watermark' : 'Show watermark'
                        }
                      >
                        {showWatermark ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setName('')
                          setTagline('')
                          setVariation(0)
                          setShowWatermark(true)
                        }}
                        className={styles.iconBtn}
                        aria-label="Clear name and tagline"
                        title="Clear"
                      >
                        <Eraser size={18} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.helper}>
                    Shuffle rolls a new arrangement. Reset returns to the
                    default.
                  </div>

                  {hint && <div className={styles.hint}>{hint}</div>}

                  <div className={styles.mapping}>
                    <div className={styles.mappingTitle}>Flower mapping</div>
                    <ul className={styles.mappingList}>
                      <li>A-D: Rose</li>
                      <li>E-H: Tulip</li>
                      <li>I-M: Daisy</li>
                      <li>N-R: Lily</li>
                      <li>S-V: Orchid</li>
                      <li>W-Z: Sunflower</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className={styles.previewHeader}>
                    <div className={styles.previewTitle}>Preview</div>
                    <div className={styles.previewName}>
                      {cleanName ? `"${cleanName}"` : '“Your Valentine”'}
                    </div>
                  </div>

                  <div className={styles.canvasFrame}>
                    <canvas ref={canvasRef} className={styles.canvas} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.breathBottom} />
      </div>
    </div>
  )
}
