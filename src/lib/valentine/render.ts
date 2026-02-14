import { makeRng, clamp } from "./rng";
import { drawCenteredWrappedText, fitTaglineSmart, fitTitleSmart } from "./textFit";
import {
  drawFlower,
  drawLeaf,
  drawSoftGlow,
  drawStem,
  layoutFlowers,
  roundRect,
  type FlowerKind,
} from "./flowers";

export type RenderBouquetArgs = {
  ctx: CanvasRenderingContext2D;
  exportW: number;
  exportH: number;
  displayName: string;
  displayTagline: string;
  seed: number;
  kinds: FlowerKind[];
  showWatermark: boolean;
};

export function renderBouquet({
  ctx,
  exportW,
  exportH,
  displayName,
  displayTagline,
  seed,
  kinds,
  showWatermark,
}: RenderBouquetArgs) {
  const rng = makeRng(seed);

  // background
  const bg = ctx.createLinearGradient(0, 0, exportW, exportH);
  bg.addColorStop(0, "#1a0b2e");
  bg.addColorStop(0.45, "#2b124c");
  bg.addColorStop(1, "#0b1026");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, exportW, exportH);

  for (let i = 0; i < 22; i++) {
    const x = rng() * exportW;
    const y = rng() * exportH * 0.65;
    const r = 80 + rng() * 180;
    const colors = ["#ff4d6d", "#c77dff", "#ffe066", "#ffd6e0", "#9d4edd"];
    drawSoftGlow(ctx, x, y, r, colors[Math.floor(rng() * colors.length)], 0.12);
  }

  // card
  const pad = 70;
  const cardX = pad;
  const cardY = 90;
  const cardW = exportW - pad * 2;
  const cardH = exportH - 160;

  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#000";
  roundRect(ctx, cardX + 10, cardY + 16, cardW, cardH, 42);
  ctx.fill();
  ctx.restore();

  ctx.save();
  const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  cardGrad.addColorStop(0, "rgba(255,255,255,0.10)");
  cardGrad.addColorStop(1, "rgba(255,255,255,0.04)");
  ctx.fillStyle = cardGrad;
  roundRect(ctx, cardX, cardY, cardW, cardH, 42);
  ctx.fill();
  ctx.restore();

  // text
  ctx.save();
  const centerX = exportW / 2;
  const textMaxWidth = exportW - 2 * (pad + 120);

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.shadowColor = "rgba(255, 117, 143, 0.45)";
  ctx.shadowBlur = 18;

  const titleFit = fitTitleSmart(ctx, displayName, textMaxWidth);
  const titleTopY = 175;
  const titleBottomY = drawCenteredWrappedText(
    ctx,
    titleFit.lines,
    centerX,
    titleTopY,
    titleFit.fontPx,
    1.08,
  );

  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.65)";

  const taglineFit = fitTaglineSmart(ctx, displayTagline, textMaxWidth * 0.92);
  drawCenteredWrappedText(ctx, taglineFit.lines, centerX, titleBottomY + 18, taglineFit.fontPx, 1.25);

  ctx.restore();

  // bouquet layout + stems/leaves
  const bouquetCenterX = exportW / 2;
  const bundleX = bouquetCenterX;
  const bundleY = 1290;

  const flowers = layoutFlowers({ kinds, rng, exportW });

  const stemColor = "rgba(122, 199, 126, 0.85)";
  const stemDark = "rgba(56, 154, 98, 0.9)";

  for (const f of flowers) {
    const stemThickness = clamp(f.size * 0.12, 6, 14);
    const endX = f.px + (rng() - 0.5) * 14;
    const endY = f.py + f.size * 0.48;

    drawStem(ctx, bundleX, bundleY, endX, endY, stemThickness + 2, stemDark);
    drawStem(ctx, bundleX, bundleY, endX, endY, stemThickness, stemColor);

    const leafCount = rng() < 0.45 ? 2 : 1;
    for (let k = 0; k < leafCount; k++) {
      const lx = bundleX + (endX - bundleX) * (0.45 + rng() * 0.35) + (rng() - 0.5) * 14;
      const ly = bundleY + (endY - bundleY) * (0.45 + rng() * 0.35) + (rng() - 0.5) * 14;

      const lw = 18 + rng() * 14;
      const lh = 40 + rng() * 22;
      const lr = (rng() - 0.5) * 1.05;
      const lf = rng() < 0.5 ? "rgba(112, 218, 158, 0.85)" : "rgba(82, 196, 130, 0.85)";
      drawLeaf(ctx, lx, ly, lw, lh, lr, lf);
    }
  }

  // wrap
  ctx.save();
  const wrapW = 480;
  const wrapH = 120;
  const wrapX = bouquetCenterX - wrapW / 2;
  const wrapY = 1220;

  ctx.globalAlpha = 0.95;
  const wrapGrad = ctx.createLinearGradient(wrapX, wrapY, wrapX + wrapW, wrapY + wrapH);
  wrapGrad.addColorStop(0, "#ff4d6d");
  wrapGrad.addColorStop(0.5, "#ff8fab");
  wrapGrad.addColorStop(1, "#c77dff");

  ctx.fillStyle = wrapGrad;
  roundRect(ctx, wrapX, wrapY, wrapW, wrapH, 48);
  ctx.fill();

  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#000";
  roundRect(ctx, wrapX, wrapY + 10, wrapW, wrapH, 48);
  ctx.fill();

  ctx.globalAlpha = 0.95;
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.ellipse(bouquetCenterX - 140, wrapY + 55, 100, 56, -0.2, 0, Math.PI * 2);
  ctx.ellipse(bouquetCenterX + 140, wrapY + 55, 100, 56, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // flowers on top
  const sorted = [...flowers].sort((a, b) => b.layer - a.layer);
  for (const f of sorted) drawFlower(ctx, f.kind, f.px, f.py, f.size, f.rot, rng);

  // vignette
  ctx.save();
  const vignette = ctx.createRadialGradient(
    exportW / 2,
    exportH * 0.45,
    exportW * 0.2,
    exportW / 2,
    exportH * 0.55,
    exportW * 0.85,
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, exportW, exportH);
  ctx.restore();

  // watermark
  if (showWatermark) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.font = `500 22px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`;
    ctx.fillText("tadinada.com/valentine", exportW / 2, exportH - 85);
    ctx.restore();
  }
}