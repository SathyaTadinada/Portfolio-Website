'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './valentine-bouquet.module.css'
import { Dices, RotateCcw, Eye, EyeOff, Eraser } from 'lucide-react'

import { hashStringToSeed, makeRng } from '@/lib/valentine/rng'
import { letterToFlowerKind, type FlowerKind } from '@/lib/valentine/flowers'
import { renderBouquet } from '@/lib/valentine/render'

const DEFAULT_DISPLAY_NAME = 'Your Valentine'
const DEFAULT_TAGLINE = 'a special bouquet for you'

const EXPORT_W = 1200
const EXPORT_H = 1500

const NAME_MAX = 32
const TAGLINE_MAX = 64

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const a = document.createElement('a')
  a.download = filename
  a.href = canvas.toDataURL('image/png')
  a.click()
}

export default function ValentineBouquet() {
  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')

  const [hint, setHint] = useState<string | null>(null)
  const [variation, setVariation] = useState(0)
  const [showWatermark, setShowWatermark] = useState(true)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const nameTrimmed = useMemo(() => name.trim(), [name])
  const taglineTrimmed = useMemo(() => tagline.trim(), [tagline])

  useEffect(() => {
    setVariation(0)
  }, [nameTrimmed])

  const bouquetSpec = useMemo(() => {
    const baseName = nameTrimmed.length ? nameTrimmed : DEFAULT_DISPLAY_NAME
    const seed = hashStringToSeed(`${baseName}#${variation}`)

    const letters = baseName.replace(/[^A-Za-z]/g, '')
    const kinds: FlowerKind[] = []

    if (letters.length) {
      for (const ch of letters) kinds.push(letterToFlowerKind(ch))
    } else {
      const rng = makeRng(seed)
      const all: FlowerKind[] = [
        'rose',
        'tulip',
        'daisy',
        'lily',
        'orchid',
        'sunflower',
      ]
      for (let i = 0; i < 14; i++) {
        kinds.push(all[Math.floor(rng() * all.length)])
      }
    }

    return { seed, kinds, baseName }
  }, [nameTrimmed, variation])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = EXPORT_W
    canvas.height = EXPORT_H

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const displayName = bouquetSpec.baseName
    const displayTagline = taglineTrimmed.length ? taglineTrimmed : DEFAULT_TAGLINE

    renderBouquet({
      ctx,
      exportW: EXPORT_W,
      exportH: EXPORT_H,
      displayName,
      displayTagline,
      seed: bouquetSpec.seed,
      kinds: bouquetSpec.kinds,
      showWatermark,
    })
  }, [bouquetSpec, taglineTrimmed, showWatermark])

  function onShuffle() {
    setVariation(Math.floor(Math.random() * 1_000_000_000))
  }

  function onResetVariant() {
    setVariation(0)
  }

  function onDownload() {
    const canvas = canvasRef.current
    if (!canvas) return

    const nm = nameTrimmed.length ? nameTrimmed : 'valentine'
    const safe = nm
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_-]+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '')

    downloadCanvas(canvas, `bouquet_${safe || 'valentine'}.png`)

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
                  <div className={styles.labelRow}>
                    <label className={styles.label}>Name</label>
                    <div
                      className={`${styles.counter} ${
                        name.length >= NAME_MAX
                          ? styles.counterMax
                          : name.length >= NAME_MAX - 4
                            ? styles.counterWarn
                            : ''
                      }`}
                      aria-live="polite"
                    >
                      {name.length}/{NAME_MAX}
                    </div>
                  </div>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onDownload()
                    }}
                    placeholder="Type a name…"
                    className={styles.input}
                    maxLength={NAME_MAX}
                  />

                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <label className={styles.label}>Tagline (optional)</label>
                      <div
                        className={`${styles.counter} ${
                          tagline.length >= TAGLINE_MAX
                            ? styles.counterMax
                            : tagline.length >= TAGLINE_MAX - 8
                              ? styles.counterWarn
                              : ''
                        }`}
                        aria-live="polite"
                      >
                        {tagline.length}/{TAGLINE_MAX}
                      </div>
                    </div>

                    <input
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onDownload()
                      }}
                      placeholder={DEFAULT_TAGLINE}
                      className={styles.input}
                      maxLength={TAGLINE_MAX}
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
                        aria-label={showWatermark ? 'Hide watermark' : 'Show watermark'}
                        aria-pressed={showWatermark}
                        title={showWatermark ? 'Hide watermark' : 'Show watermark'}
                      >
                        {showWatermark ? <Eye size={18} /> : <EyeOff size={18} />}
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
                    Shuffle rolls a new arrangement. Reset returns to the default.
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
                      {nameTrimmed ? `"${nameTrimmed}"` : '“Your Valentine”'}
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