// Design tokens for Kage mobile.
//
// Register: product (UI serves the task). Strategy: Restrained — warm-tinted
// neutral "paper" surfaces, one jade accent for primary actions + the verified
// state. Values authored in OKLCH reasoning, written as hex (React Native has no
// OKLCH). No pure #000 / #fff: every neutral is tinted toward the warm brand hue.
//
// Scene that fixed the light theme: an Indonesian adult at a venue entrance in
// daylight, on their own phone, wary of handing over a national ID number.

export const color = {
  // Surfaces (warm paper, low chroma)
  paper: "#F6F4EF", // app background
  paperSunken: "#EFEBE2", // insets, secondary panels
  surface: "#FEFDFB", // raised fields / cards (warm white, not #fff)

  // Ink (warm near-black, stepped for hierarchy)
  ink: "#1C1A17", // primary text
  inkMuted: "#57524A", // secondary text — AA on paper
  inkFaint: "#6E675C", // captions — still AA at small sizes

  // Hairlines
  line: "#E4DFD6",
  lineStrong: "#D4CDBF",

  // Accent — deep jade. Primary action + verified/success.
  accent: "#1F6E4E",
  accentPressed: "#19593F",
  accentSoft: "#E7F0EA", // tint background for success callouts
  accentInk: "#0F3D2A", // jade-dark text on accentSoft (AA)
  onAccent: "#FBFEFC", // text on accent fills

  // Danger — warm muted clay-red (not flag-bright). Reset / errors.
  danger: "#9A3B2C",
  dangerPressed: "#83301F",
  dangerSoft: "#F6EBE8",
  dangerInk: "#5E2117",
};

// Spacing scale. Vary it for rhythm; don't pad everything equally.
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  9: 56,
};

export const radius = { sm: 10, md: 14, lg: 18, pill: 999 };

// Fixed scale (product: no fluid type), ~1.2 ratio, large base for low-vision.
export const type = {
  display: { fontSize: 52, fontWeight: "800", letterSpacing: 6, color: color.accent },
  h1: { fontSize: 25, fontWeight: "700", color: color.ink, letterSpacing: -0.3 },
  h2: { fontSize: 19, fontWeight: "700", color: color.ink, letterSpacing: -0.2 },
  lead: { fontSize: 17, fontWeight: "400", color: color.inkMuted, lineHeight: 25 },
  body: { fontSize: 16, fontWeight: "400", color: color.ink, lineHeight: 24 },
  label: { fontSize: 14, fontWeight: "600", color: color.ink, letterSpacing: 0.1 },
  caption: { fontSize: 13, fontWeight: "400", color: color.inkFaint, lineHeight: 19 },
};

// Minimum touch target. WCAG / platform guidance.
export const TARGET = 52;
