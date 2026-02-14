import { clamp } from "./rng";

export type FlowerKind = "rose" | "tulip" | "daisy" | "lily" | "orchid" | "sunflower";

export type FlowerPlacement = {
  kind: FlowerKind;
  px: number;
  py: number;
  size: number;
  rot: number;
  layer: number;
};

export function letterToFlowerKind(letter: string): FlowerKind {
  const c = letter.toLowerCase();
  if (c >= "a" && c <= "d") return "rose";
  if (c >= "e" && c <= "h") return "tulip";
  if (c >= "i" && c <= "m") return "daisy";
  if (c >= "n" && c <= "r") return "lily";
  if (c >= "s" && c <= "v") return "orchid";
  return "sunflower";
}

function pickPalette(kind: FlowerKind) {
  switch (kind) {
    case "rose":
      return {
        petals: ["#ff4d6d", "#ff758f", "#ff8fab", "#ff2e63"],
        accent: ["#ffd6e0", "#ffe5ec"],
        center: ["#ffcad4", "#ffc2d1"],
      };
    case "tulip":
      return {
        petals: ["#ff6b6b", "#f06595", "#cc5de8", "#845ef7"],
        accent: ["#fff0f6", "#f8f0fc"],
        center: ["#ffd8a8", "#ffe066"],
      };
    case "daisy":
      return {
        petals: ["#ffffff", "#fff7ff", "#f8f9fa"],
        accent: ["#ffd43b", "#ffe066"],
        center: ["#ffb703", "#f59f00"],
      };
    case "lily":
      return {
        petals: ["#ffe3e3", "#ffc9c9", "#ffd6e0", "#ffe8f0"],
        accent: ["#fff0f6", "#fff5f5"],
        center: ["#ffd8a8", "#ffa94d"],
      };
    case "orchid":
      return {
        petals: ["#c77dff", "#9d4edd", "#e0aaff", "#b5179e"],
        accent: ["#f3d9fa", "#eebefa"],
        center: ["#ffd6a5", "#ffadad"],
      };
    case "sunflower":
      return {
        petals: ["#ffd43b", "#ffe066", "#fab005", "#fcc419"],
        accent: ["#fff3bf", "#ffec99"],
        center: ["#6f4e37", "#5c4033", "#3f2d2b"],
      };
  }
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.padEnd(6, "0");
  const n = parseInt(full.slice(0, 6), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgba(hex: string, a: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function jitter(rng: () => number, amp: number) {
  return (rng() - 0.5) * 2 * amp;
}

export function drawSoftGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  alpha = 0.25,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export function drawStem(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  thickness: number,
  color: string,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.lineCap = "round";

  const cx = (x0 + x1) / 2 + (x0 - x1) * 0.08;
  const cy = (y0 + y1) / 2 + (y1 - y0) * 0.12;

  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo(cx, cy, x1, y1);
  ctx.stroke();
  ctx.restore();
}

function strokeSketch(
  ctx: CanvasRenderingContext2D,
  stroke: string,
  width: number,
  rng: () => number,
  repeats: number,
  amt: number,
) {
  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (let k = 0; k < repeats; k++) {
    ctx.save();
    ctx.globalAlpha *= 0.75;
    ctx.translate(jitter(rng, amt), jitter(rng, amt));
    ctx.rotate(jitter(rng, 0.01));
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

function fillWatercolor(ctx: CanvasRenderingContext2D, fill: string, rng: () => number, layers: number) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.globalAlpha *= 0.92;
  ctx.fill();

  for (let i = 0; i < layers; i++) {
    ctx.save();
    ctx.globalAlpha *= 0.22;
    ctx.translate(jitter(rng, 2.2), jitter(rng, 2.2));
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function addGrain(ctx: CanvasRenderingContext2D, rng: () => number, density: number, spread: number) {
  ctx.save();
  ctx.globalAlpha *= 0.10;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  const n = Math.floor(density);

  for (let i = 0; i < n; i++) {
    const a = rng() * Math.PI * 2;
    const rr = Math.sqrt(rng()) * spread;
    const x = Math.cos(a) * rr;
    const y = Math.sin(a) * rr;
    const d = 0.6 + rng() * 1.2;
    ctx.beginPath();
    ctx.arc(x, y, d, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rot: number,
  fill: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(w * 0.65, -h * 0.15, w, -h * 0.55);
  ctx.quadraticCurveTo(w * 0.55, -h * 0.95, 0, -h);
  ctx.quadraticCurveTo(-w * 0.65, -h * 0.85, -w, -h * 0.48);
  ctx.quadraticCurveTo(-w * 0.55, -h * 0.12, 0, 0);
  ctx.closePath();

  ctx.save();
  ctx.globalAlpha = 0.88;
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.clip();
  ctx.translate(0, -h * 0.45);
  ctx.globalAlpha = 0.65;
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = Math.max(1, w * 0.03);
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-w, i * (h * 0.12));
    ctx.lineTo(w, i * (h * 0.12) - h * 0.15);
    ctx.stroke();
  }
  ctx.restore();

  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.lineWidth = Math.max(1, w * 0.06);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(0, -h * 0.5, 0, -h);
  ctx.stroke();

  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = "rgba(0,0,0,0.9)";
  ctx.lineWidth = Math.max(1.2, w * 0.06);
  ctx.stroke();

  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = Math.max(1, w * 0.03);
  ctx.stroke();

  ctx.restore();
}

function pathPetal(ctx: CanvasRenderingContext2D, pw: number, ph: number, wobble: number) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(pw * (0.78 + wobble), -ph * 0.12, pw * (0.28 + wobble), -ph * 0.98, 0, -ph);
  ctx.bezierCurveTo(-pw * (0.28 - wobble), -ph * 0.98, -pw * (0.78 - wobble), -ph * 0.12, 0, 0);
  ctx.closePath();
}

function pathPetalDaisy(ctx: CanvasRenderingContext2D, pw: number, ph: number) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(pw * 0.75, -ph * 0.22, pw * 0.18, -ph);
  ctx.quadraticCurveTo(0, -ph * 1.05, -pw * 0.18, -ph);
  ctx.quadraticCurveTo(-pw * 0.75, -ph * 0.22, 0, 0);
  ctx.closePath();
}

function pathPetalTulip(ctx: CanvasRenderingContext2D, pw: number, ph: number) {
  ctx.beginPath();
  ctx.moveTo(-pw * 0.6, 0);
  ctx.bezierCurveTo(-pw * 0.4, -ph * 0.35, -pw * 0.25, -ph, 0, -ph);
  ctx.bezierCurveTo(pw * 0.25, -ph, pw * 0.4, -ph * 0.35, pw * 0.6, 0);
  ctx.quadraticCurveTo(0, -ph * 0.18, -pw * 0.6, 0);
  ctx.closePath();
}

function pathPetalOrchid(ctx: CanvasRenderingContext2D, pw: number, ph: number) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(pw * 0.95, -ph * 0.05, pw * 0.7, -ph * 0.95, 0, -ph);
  ctx.bezierCurveTo(-pw * 0.7, -ph * 0.95, -pw * 0.95, -ph * 0.05, 0, 0);
  ctx.closePath();
}

function drawPetalSketch(
  ctx: CanvasRenderingContext2D,
  kind: FlowerKind,
  pw: number,
  ph: number,
  fill: string,
  ink: string,
  rng: () => number,
) {
  const wobble = (rng() - 0.5) * 0.12;

  if (kind === "daisy") pathPetalDaisy(ctx, pw, ph);
  else if (kind === "tulip") pathPetalTulip(ctx, pw * 0.95, ph * 0.92);
  else if (kind === "orchid") pathPetalOrchid(ctx, pw * 1.05, ph * 0.95);
  else pathPetal(ctx, pw, ph, wobble);

  ctx.save();
  ctx.globalAlpha = 0.92;
  fillWatercolor(ctx, fill, rng, 2);
  ctx.restore();

  ctx.save();
  ctx.clip();

  ctx.globalAlpha = 0.10;
  ctx.fillStyle = "rgba(0,0,0,0.9)";
  for (let i = 0; i < 2; i++) {
    const ox = (rng() - 0.5) * pw * 0.18;
    const oy = -ph * (0.3 + rng() * 0.12);
    const rx = pw * (0.45 + rng() * 0.12);
    const ry = ph * (0.22 + rng() * 0.08);
    const rot = -0.55 + (rng() - 0.5) * 0.35;

    ctx.save();
    ctx.translate(ox, oy);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.globalAlpha = 0.08;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.ellipse(0, -ph * 0.62, pw * 0.26, ph * 0.18, -0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.16;
  strokeSketch(ctx, ink, Math.max(1.1, pw * 0.055), rng, 1, 0.45);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = Math.max(1, pw * 0.03);
  ctx.beginPath();
  ctx.ellipse(0, -ph * 0.55, pw * 0.28, ph * 0.32, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawCenterSketch(
  ctx: CanvasRenderingContext2D,
  kind: FlowerKind,
  size: number,
  fill: string,
  rng: () => number,
) {
  const r0 = size * (kind === "sunflower" ? 0.36 : 0.24);

  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(0, 0, r0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.clip();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "rgba(0,0,0,0.65)";
  const dots = kind === "sunflower" ? 55 : kind === "daisy" ? 35 : 26;
  for (let i = 0; i < dots; i++) {
    const a = rng() * Math.PI * 2;
    const rr = Math.sqrt(rng()) * r0 * 0.95;
    const d = size * (0.012 + rng() * 0.015);
    ctx.beginPath();
    ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr, d, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 0.10;
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.beginPath();
  ctx.ellipse(-r0 * 0.18, -r0 * 0.25, r0 * 0.3, r0 * 0.2, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.globalAlpha = 0.22;
  ctx.beginPath();
  ctx.arc(0, 0, r0, 0, Math.PI * 2);
  strokeSketch(ctx, "rgba(0,0,0,0.9)", Math.max(1, size * 0.03), rng, 2, 0.7);

  if (kind === "rose") {
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = "rgba(0,0,0,0.7)";
    ctx.lineWidth = Math.max(1, size * 0.02);
    for (let i = 0; i < 3; i++) {
      const rr = r0 * (0.35 + i * 0.18);
      ctx.beginPath();
      ctx.arc(0, 0, rr, 0.2 + rng() * 0.2, Math.PI * 1.25 + rng() * 0.2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

export function drawFlower(
  ctx: CanvasRenderingContext2D,
  kind: FlowerKind,
  x: number,
  y: number,
  size: number,
  rot: number,
  rng: () => number,
) {
  const pal = pickPalette(kind);
  const petal = pick(pal.petals, rng);
  const accent = pick(pal.accent, rng);
  const center = pick(pal.center, rng);
  const ink = "rgba(0,0,0,0.92)";

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  drawSoftGlow(ctx, 0, 0, size * 1.05, rgba(petal, 1), 0.08);

  const petalsCount =
    kind === "rose"
      ? 12
      : kind === "tulip"
        ? 7
        : kind === "daisy"
          ? 14
          : kind === "lily"
            ? 8
            : kind === "orchid"
              ? 6
              : 18;

  const basePw = size * (kind === "tulip" ? 0.7 : kind === "orchid" ? 0.82 : 0.62);
  const basePh = size * (kind === "tulip" ? 0.92 : kind === "daisy" ? 0.9 : 1.02);

  const layers = kind === "rose" ? 2 : 1;

  for (let layer = 0; layer < layers; layer++) {
    const layerT = layers === 1 ? 0 : layer / (layers - 1);
    const count = petalsCount + (layer === 0 ? 0 : kind === "rose" ? 5 : 3);

    const ringScale = 1.0 - layerT * (kind === "rose" ? 0.18 : 0.12);
    const ringLift = size * (kind === "tulip" ? 0.16 : 0.2) + layerT * size * 0.08;

    for (let i = 0; i < count; i++) {
      const a0 = (i / count) * Math.PI * 2;
      const a = a0 + jitter(rng, kind === "daisy" ? 0.03 : 0.06);

      const pw = basePw * ringScale * (0.88 + rng() * 0.22);
      const ph = basePh * ringScale * (0.88 + rng() * 0.22);

      const fill = i % 3 === 0 ? accent : petal;

      ctx.save();
      ctx.rotate(a);
      ctx.translate(jitter(rng, 1.2), ringLift * 0.10 + jitter(rng, 1.2));
      ctx.rotate(jitter(rng, 0.05) - (kind === "tulip" ? 0.2 : 0.06));
      drawPetalSketch(ctx, kind, pw, ph, fill, ink, rng);
      ctx.restore();
    }
  }

  drawCenterSketch(ctx, kind, size, center, rng);

  if (kind === "lily") {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = "rgba(0,0,0,0.75)";
    ctx.lineWidth = Math.max(1, size * 0.02);
    const st = 6;

    for (let i = 0; i < st; i++) {
      const a = (i / st) * Math.PI * 2 + jitter(rng, 0.08);
      const r1 = size * 0.10;
      const r2 = size * 0.32;

      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.stroke();

      ctx.globalAlpha = 0.45;
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * r2, Math.sin(a) * r2, size * 0.035, size * 0.025, a, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.35;
    }

    ctx.restore();
  }

  if (kind === "orchid") {
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.ellipse(0, size * 0.18, size * 0.22, size * 0.16, 0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.20;
    ctx.beginPath();
    ctx.ellipse(0, size * 0.18, size * 0.22, size * 0.16, 0.08, 0, Math.PI * 2);
    strokeSketch(ctx, "rgba(0,0,0,0.9)", Math.max(1, size * 0.03), rng, 2, 0.6);
    ctx.restore();
  }

  addGrain(ctx, rng, 24 + rng() * 18, size * 0.85);

  ctx.restore();
}

export function layoutFlowers(args: { kinds: FlowerKind[]; rng: () => number; exportW: number }) {
  const { kinds, rng, exportW } = args;

  const n = kinds.length;
  const bouquetCenterX = exportW / 2;

  const perRing = 8;
  const ringGapY = 120;
  const fanAngle = 1.25;
  const maxSpreadX = 450;
  const topY = 585;

  return kinds.map((kind, i): FlowerPlacement => {
    const ring = Math.floor(i / perRing);
    const idx = i % perRing;
    const countInRing = Math.min(perRing, n - ring * perRing);

    const t = countInRing <= 1 ? 0.5 : idx / (countInRing - 1);
    const angle = (t - 0.5) * fanAngle;

    const spread = maxSpreadX * (0.98 + ring * 0.06);

    const px = bouquetCenterX + Math.sin(angle) * spread + (rng() - 0.5) * 14;
    const py = topY + ring * ringGapY + (Math.cos(angle) - 1) * 40 + (rng() - 0.5) * 14;

    const size = clamp(70 - ring * 8 + rng() * 8, 38, 78);
    const rot = angle * 0.28 + (rng() - 0.5) * 0.2;

    return { kind, px, py, size, rot, layer: ring };
  });
}