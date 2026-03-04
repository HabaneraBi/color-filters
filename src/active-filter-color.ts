import { oklch, formatHex, clampGamut } from "culori";

const toHexClamped = clampGamut("rgb");

const inHue = (h: number, from: number, to: number) => {
  if (from <= to) return h >= from && h <= to;
  return h >= from || h <= to;
};

export function activeFilterColor(hex: string) {
  const oklchColor = oklch(hex);
  if (!oklchColor) return hex;

  let l = oklchColor.l;
  let chroma = oklchColor.c ?? 0;
  const h = oklchColor.h;

  if (h == null) {
    const out = toHexClamped({
      mode: "oklch",
      l: Math.min(1, l * 0.9 + 0.05),
      c: 0,
      h: 0,
    });
    return formatHex(out) ?? "";
  }

  if (inHue(h, 200, 270)) {
    l = l + (1 - l) * 0.78;
    chroma = chroma * 0.29;
  } else if (inHue(h, 345, 40)) {
    l = l * 0.69;
    chroma = chroma * 0.57;
  } else if (inHue(h, 70, 110) && l > 0.9) {
    l = l * 0.93;
    chroma = chroma * 4.56;
  } else {
    if (l > 0.85) {
      l = l * 0.93;
      chroma = chroma * 1.8;
    } else {
      l = l + (1 - l) * 0.35;
      chroma = chroma * 0.6;
    }
  }

  l = Math.min(1, Math.max(0, l));
  chroma = Math.max(0, chroma);

  const out = toHexClamped({ mode: "oklch", l, c: chroma, h });
  return formatHex(out) ?? "";
}
