import { clamp } from "./rng";

export type FlowerKind = "rose" | "tulip" | "daisy" | "lily" | "orchid" | "sunflower";

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
  ctx.beginPath();

  const cx = (x0 + x1) / 2 + (x0 - x1) * 0.08;
  const cy = (y0 + y1) / 2 + (y1 - y0) * 0.12;

  ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo(cx, cy, x1, y1);
  ctx.stroke();
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
  ctx.fillStyle = fill;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(w * 0.55, -h * 0.15, w, -h * 0.55);
  ctx.quadraticCurveTo(w * 0.6, -h * 0.9, 0, -h);
  ctx.quadraticCurveTo(-w * 0.6, -h * 0.9, -w, -h * 0.55);
  ctx.quadraticCurveTo(-w * 0.55, -h * 0.15, 0, 0);
  ctx.closePath();

  ctx.globalAlpha = 0.9;
  ctx.fill();

  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = Math.max(1, w * 0.08);
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.05);
  ctx.quadraticCurveTo(0, -h * 0.5, 0, -h * 0.9);
  ctx.stroke();

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
  const petal = pal.petals[Math.floor(rng() * pal.petals.length)];
  const accent = pal.accent[Math.floor(rng() * pal.accent.length)];
  const center = pal.center[Math.floor(rng() * pal.center.length)];

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  drawSoftGlow(ctx, 0, 0, size * 1.2, petal, 0.16);

  const petalsCount =
    kind === "rose"
      ? 10
      : kind === "tulip"
        ? 6
        : kind === "daisy"
          ? 12
          : kind === "lily"
            ? 7
            : kind === "orchid"
              ? 6
              : 14;

  for (let i = 0; i < petalsCount; i++) {
    const a = (i / petalsCount) * Math.PI * 2;
    const rr = size * (0.55 + rng() * 0.12);
    const pw = size * (0.55 + rng() * 0.25);
    const ph = size * (0.95 + rng() * 0.35);

    ctx.save();
    ctx.rotate(a);

    ctx.fillStyle = i % 2 === 0 ? petal : accent;
    ctx.globalAlpha = 0.95;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(pw * 0.65, -ph * 0.25, pw * 0.15, -ph * 0.85);
    ctx.quadraticCurveTo(0, -ph, -pw * 0.15, -ph * 0.85);
    ctx.quadraticCurveTo(-pw * 0.65, -ph * 0.25, 0, 0);
    ctx.closePath();

    ctx.translate(0, rr * 0.25);
    ctx.fill();
    ctx.restore();
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = center;
  ctx.beginPath();
  ctx.arc(0, 0, size * (kind === "sunflower" ? 0.35 : 0.24), 0, Math.PI * 2);
  ctx.fill();

  if (kind === "sunflower" || kind === "daisy") {
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#000";
    for (let i = 0; i < 18; i++) {
      const a = rng() * Math.PI * 2;
      const r = rng() * size * 0.22;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r, Math.sin(a) * r, size * 0.03, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

export type FlowerPlacement = {
  kind: FlowerKind;
  px: number;
  py: number;
  size: number;
  rot: number;
  layer: number;
};

export function layoutFlowers(args: {
  kinds: FlowerKind[];
  rng: () => number;
  exportW: number;
}) {
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
    const py =
      topY + ring * ringGapY + (Math.cos(angle) - 1) * 40 + (rng() - 0.5) * 14;

    const size = clamp(70 - ring * 8 + rng() * 8, 38, 78);
    const rot = angle * 0.28 + (rng() - 0.5) * 0.2;

    return { kind, px, py, size, rot, layer: ring };
  });
}