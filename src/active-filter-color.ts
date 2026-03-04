import { oklch, formatHex, clampGamut, inGamut } from "culori";

const toHexClamped = clampGamut("rgb");

const inHue = (h: number, from: number, to: number) => {
  if (from <= to) return h >= from && h <= to;
  return h >= from || h <= to;
};

const inRgbGamut = inGamut("rgb");

function toHexByReducingChroma(color: {
  mode: "oklch";
  l: number;
  c: number;
  h: number;
}) {
  let c = Math.max(0, color.c);
  let candidate = { ...color, c };

  // если уже в gamut — отлично
  if (inRgbGamut(candidate)) return formatHex(candidate);

  // иначе уменьшаем chroma, сохраняя hue и L
  for (let i = 0; i < 40; i++) {
    c *= 0.9; // плавное снижение
    candidate = { ...candidate, c };
    if (inRgbGamut(candidate)) return formatHex(candidate);
  }

  // fallback: почти серый того же hue
  return formatHex({ ...candidate, c: 0 });
}

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

  const bgVeryLight = oklchColor.l >= 0.92;
  const activeTooGray = chroma < 0.06;

  if (bgVeryLight && activeTooGray) {
    l = Math.max(0, l - 0.09);

    const isPinkPurple = inHue(h, 300, 25);

    const boost = isPinkPurple ? 2.0 : 2.6;
    const minC = isPinkPurple ? 0.085 : 0.11;

    chroma = Math.max(chroma * boost, minC);

    const maxC = isPinkPurple ? 0.16 : 0.22;
    chroma = Math.min(chroma, maxC);
  }

  return toHexByReducingChroma({ mode: "oklch", l, c: chroma, h });
}
