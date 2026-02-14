export type Break =
  | { type: "space"; i: number; j: number }
  | { type: "dash"; i: number }
  | { type: "punct"; i: number; ch: "," | "." };

function isDash(ch: string) {
  return ch === "-" || ch === "–" || ch === "—";
}

function findBreaks(text: string): Break[] {
  const out: Break[] = [];
  const n = text.length;
  let i = 0;

  while (i < n) {
    const ch = text[i];

    if (ch === "," || ch === ".") {
      out.push({ type: "punct", i, ch });
      i++;
      continue;
    }

    if (/\s/.test(ch)) {
      const start = i;
      let j = i + 1;
      while (j < n && /\s/.test(text[j])) j++;
      out.push({ type: "space", i: start, j });
      i = j;
      continue;
    }

    if (isDash(ch)) {
      out.push({ type: "dash", i });
      i++;
      continue;
    }

    i++;
  }

  return out;
}

function splitAtBreak(text: string, br: Break) {
  if (br.type === "space") {
    const left = text.slice(0, br.i).trimEnd();
    const right = text.slice(br.j).trimStart();
    return { left, right };
  }

  if (br.type === "dash") {
    const left = text.slice(0, br.i + 1).trimEnd();
    let k = br.i + 1;
    while (k < text.length && /\s/.test(text[k])) k++;
    const right = text.slice(k).trimStart();
    return { left, right };
  }

  const left = text.slice(0, br.i + 1).trimEnd();
  let k = br.i + 1;
  while (k < text.length && /\s/.test(text[k])) k++;
  const right = text.slice(k).trimStart();
  return { left, right };
}

export function ellipsizeToWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  const ell = "…";
  let lo = 0;
  let hi = text.length;

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    const cand = text.slice(0, mid).trimEnd() + ell;
    if (ctx.measureText(cand).width <= maxWidth) lo = mid + 1;
    else hi = mid;
  }

  return text.slice(0, Math.max(0, lo - 1)).trimEnd() + ell;
}

function softBreakByChars(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
) {
  const lines: string[] = [];
  let cur = "";

  const push = (s: string) => {
    if (s.length) lines.push(s);
  };

  for (const ch of text) {
    const next = cur + ch;
    if (ctx.measureText(next).width <= maxWidth || cur.length === 0) {
      cur = next;
    } else {
      push(cur);
      cur = ch;
      if (lines.length === maxLines - 1) break;
    }
  }

  if (lines.length < maxLines) push(cur);

  if (lines.length > maxLines) lines.length = maxLines;

  if (lines.length === maxLines) {
    lines[maxLines - 1] = ellipsizeToWidth(ctx, lines[maxLines - 1], maxWidth);
  }

  return lines;
}

function bestTwoLineSplit(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const breaks = findBreaks(text);
  if (breaks.length === 0) return null;

  const priority = (br: Break) => {
    if (br.type === "punct") return br.ch === "," ? 0 : 1;
    if (br.type === "dash") return 2;
    return 3;
  };

  let best: { left: string; right: string; leftW: number; p: number } | null =
    null;

  for (const br of breaks) {
    const { left, right } = splitAtBreak(text, br);
    if (!left.length || !right.length) continue;

    const lw = ctx.measureText(left).width;
    if (lw > maxWidth) continue;

    const rw = ctx.measureText(right).width;
    if (rw > maxWidth) continue;

    const p = priority(br);

    if (!best) {
      best = { left, right, leftW: lw, p };
      continue;
    }

    if (p < best.p || (p === best.p && lw > best.leftW)) {
      best = { left, right, leftW: lw, p };
    }
  }

  return best ? [best.left, best.right] : null;
}

function fitPreferSplitTwoLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxFontPx: number,
  minFontPx: number,
  fontCss: (px: number) => string,
) {
  const hasNaturalBreak = /[\s\-–—,\.]/.test(text);

  for (let px = maxFontPx; px >= minFontPx; px--) {
    ctx.font = fontCss(px);

    if (ctx.measureText(text).width <= maxWidth) {
      return { fontPx: px, lines: [text] as string[] };
    }

    if (hasNaturalBreak) {
      const split = bestTwoLineSplit(ctx, text, maxWidth);
      if (split) return { fontPx: px, lines: split };
    }
  }

  ctx.font = fontCss(minFontPx);

  if (!hasNaturalBreak) {
    if (ctx.measureText(text).width <= maxWidth)
      return { fontPx: minFontPx, lines: [text] as string[] };
    const forced = ellipsizeToWidth(ctx, text, maxWidth);
    return { fontPx: minFontPx, lines: [forced] as string[] };
  }

  const split = bestTwoLineSplit(ctx, text, maxWidth);
  if (split) return { fontPx: minFontPx, lines: split };

  const fallback = softBreakByChars(ctx, text, maxWidth, 2);
  return { fontPx: minFontPx, lines: fallback };
}

export function fitTitleSmart(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const fontCss = (px: number) =>
    `700 ${px}px ui-serif, Georgia, "Times New Roman", Times, serif`;

  return fitPreferSplitTwoLines(ctx, text, maxWidth, 86, 44, fontCss);
}

export function fitTaglineSmart(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const fontCss = (px: number) =>
    `500 ${px}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`;

  const fitted = fitPreferSplitTwoLines(ctx, text, maxWidth, 30, 20, fontCss);

  ctx.font = fontCss(fitted.fontPx);
  if (fitted.lines.length === 2) {
    const [a, b] = fitted.lines;
    const aa =
      ctx.measureText(a).width <= maxWidth ? a : ellipsizeToWidth(ctx, a, maxWidth);
    const bb =
      ctx.measureText(b).width <= maxWidth ? b : ellipsizeToWidth(ctx, b, maxWidth);
    return { fontPx: fitted.fontPx, lines: [aa, bb] as string[] };
  }

  const one = fitted.lines[0] ?? "";
  const safe =
    ctx.measureText(one).width <= maxWidth ? one : ellipsizeToWidth(ctx, one, maxWidth);
  return { fontPx: fitted.fontPx, lines: [safe] as string[] };
}

export function drawCenteredWrappedText(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  centerX: number,
  topY: number,
  fontPx: number,
  lineHeightMult: number,
) {
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const lineH = Math.round(fontPx * lineHeightMult);

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], centerX, topY + i * lineH);
  }

  return topY + lines.length * lineH;
}