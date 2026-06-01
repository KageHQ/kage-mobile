// Reusable UI primitives for Kage. Replaces stock RN <Button>/<TextInput> with a
// consistent, accessible vocabulary: every control has default / pressed /
// disabled / loading states and a 52px+ touch target. No external deps.
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  Animated,
  Easing,
  Platform,
  StyleSheet,
} from "react-native";
import { color, space, radius, type, TARGET } from "../theme";

const LOGO = require("../../assets/logo.png");

// ── Text ────────────────────────────────────────────────────────────────────
export const H1 = (p) => <Text {...p} style={[type.h1, p.style]} />;
export const H2 = (p) => <Text {...p} style={[type.h2, p.style]} />;
export const Lead = (p) => <Text {...p} style={[type.lead, p.style]} />;
export const Body = (p) => <Text {...p} style={[type.body, p.style]} />;
export const Caption = (p) => <Text {...p} style={[type.caption, p.style]} />;

// ── Logo tile ─────────────────────────────────────────────────────────────────
// The logo art is dark-on-white, so it sits in a rounded white tile (reads as an
// app icon) rather than floating on warm paper. `size` is the tile edge.
export function Logo({ size = 28, style }) {
  const pad = Math.round(size * 0.16);
  return (
    <View
      style={[
        s.logoTile,
        { width: size, height: size, borderRadius: Math.round(size * 0.28), padding: pad },
        style,
      ]}
    >
      <Image source={LOGO} resizeMode="contain" style={{ flex: 1, width: "100%" }} />
    </View>
  );
}

// ── Brand mark ────────────────────────────────────────────────────────────────
export function Brandmark() {
  return (
    <View style={s.brand} accessibilityRole="header" accessibilityLabel="Kage">
      <Logo size={28} />
      <Text style={s.brandName}>Kage</Text>
    </View>
  );
}

// Vertical space the floating tab bar occupies. Screens inside the tabbed shell
// pad their scroll content by this so the last element clears the bar.
export const TAB_BAR_CLEARANCE = 112;

// ── Screen shell ──────────────────────────────────────────────────────────────
// Paper background, comfortable gutters, keyboard-aware scrolling. `floating`
// adds bottom clearance for the floating tab bar (screens inside MainShell).
export function Screen({ children, floating = false }) {
  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={s.flex}
        contentContainerStyle={[
          s.screenContent,
          floating && { paddingBottom: TAB_BAR_CLEARANCE },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
// variant: "primary" | "secondary" | "ghostDanger"
export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        s.btn,
        variant === "primary" && s.btnPrimary,
        variant === "secondary" && s.btnSecondary,
        variant === "ghostDanger" && s.btnGhostDanger,
        pressed && !isDisabled && variant === "primary" && s.btnPrimaryPressed,
        pressed && !isDisabled && variant === "secondary" && s.btnSecondaryPressed,
        pressed && !isDisabled && variant === "ghostDanger" && s.btnGhostDangerPressed,
        isDisabled && s.btnDisabled,
        style,
      ]}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? color.onAccent : color.accent}
          style={s.btnSpinner}
        />
      )}
      <Text
        style={[
          s.btnLabel,
          variant === "primary" && s.btnLabelPrimary,
          variant === "secondary" && s.btnLabelSecondary,
          variant === "ghostDanger" && s.btnLabelGhostDanger,
          isDisabled && s.btnLabelDisabled,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

// ── TextField ─────────────────────────────────────────────────────────────────
export function TextField({ label, hint, error, style, ...input }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={s.field}>
      {label ? <Text style={s.fieldLabel}>{label}</Text> : null}
      <TextInput
        {...input}
        onFocus={(e) => {
          setFocused(true);
          input.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          input.onBlur?.(e);
        }}
        placeholderTextColor={color.inkFaint}
        style={[
          s.input,
          focused && s.inputFocused,
          error && s.inputError,
          style,
        ]}
      />
      {error ? (
        <Text style={s.fieldError}>{error}</Text>
      ) : hint ? (
        <Text style={s.fieldHint}>{hint}</Text>
      ) : null}
    </View>
  );
}

// ── Callout ───────────────────────────────────────────────────────────────────
// tone: "info" | "success" | "danger". Full border + tint, never a side-stripe.
export function Callout({ tone = "info", title, children, style }) {
  return (
    <View
      style={[
        s.callout,
        tone === "info" && s.calloutInfo,
        tone === "success" && s.calloutSuccess,
        tone === "danger" && s.calloutDanger,
        style,
      ]}
    >
      {title ? (
        <Text
          style={[
            s.calloutTitle,
            tone === "success" && { color: color.accentInk },
            tone === "danger" && { color: color.dangerInk },
          ]}
        >
          {title}
        </Text>
      ) : null}
      {typeof children === "string" ? (
        <Text
          style={[
            s.calloutBody,
            tone === "success" && { color: color.accentInk },
            tone === "danger" && { color: color.dangerInk },
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ label, tone = "neutral" }) {
  return (
    <View style={[s.badge, tone === "device" && s.badgeDevice]}>
      {tone === "device" && <View style={s.badgeDeviceDot} />}
      <Text style={[s.badgeLabel, tone === "device" && s.badgeDeviceLabel]}>
        {label}
      </Text>
    </View>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
export const Divider = ({ style }) => <View style={[s.divider, style]} />;

// ── CodeDisplay ───────────────────────────────────────────────────────────────
// The proof relay code: the success moment. Big, jade, grouped, tabular.
export function CodeDisplay({ code }) {
  const grouped =
    typeof code === "string" && code.length === 6
      ? `${code.slice(0, 3)} ${code.slice(3)}`
      : String(code);
  return (
    // tabular-nums (in s.code) keeps each digit the same width so the code
    // doesn't jitter. iOS honors fontVariant; harmless no-op on Android.
    <Text
      style={s.code}
      accessibilityLabel={`Kode verifikasi ${String(code).split("").join(" ")}`}
    >
      {grouped}
    </Text>
  );
}

// ── LoadingModal ──────────────────────────────────────────────────────────────
// Blocking loading state: a dimmed backdrop with a rounded-square card that pops
// in at center (spring scale + fade). Use for the few-second waits — proving,
// requesting a credential — where the whole screen should be inert.
export function LoadingModal({ visible, label }) {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    // Reset then pop in each time it opens.
    scale.setValue(0.85);
    opacity.setValue(0);
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={s.modalBackdrop}>
        <Animated.View
          accessibilityRole="progressbar"
          accessibilityLabel={label || "Memuat"}
          style={[s.modalCard, { opacity, transform: [{ scale }] }]}
        >
          <ActivityIndicator size="large" color={color.accent} />
          {label ? <Text style={s.modalLabel}>{label}</Text> : null}
        </Animated.View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: color.paper },
  screenContent: {
    paddingHorizontal: space[6],
    paddingTop: space[7],
    paddingBottom: space[9],
  },

  brand: { flexDirection: "row", alignItems: "center", gap: space[2] },
  logoTile: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: color.line,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "700",
    color: color.ink,
    letterSpacing: 0.2,
  },

  // Button
  btn: {
    minHeight: TARGET,
    borderRadius: radius.md,
    paddingHorizontal: space[5],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space[2],
  },
  btnPrimary: { backgroundColor: color.accent },
  btnPrimaryPressed: { backgroundColor: color.accentPressed },
  btnSecondary: {
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.lineStrong,
  },
  btnSecondaryPressed: { backgroundColor: color.paperSunken },
  btnGhostDanger: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: color.dangerSoft,
  },
  btnGhostDangerPressed: { backgroundColor: color.dangerSoft },
  btnDisabled: { backgroundColor: color.paperSunken, borderColor: color.line },
  btnSpinner: { marginRight: space[1] },
  btnLabel: { fontSize: 16, fontWeight: "700", letterSpacing: 0.2 },
  btnLabelPrimary: { color: color.onAccent },
  btnLabelSecondary: { color: color.ink },
  btnLabelGhostDanger: { color: color.danger },
  btnLabelDisabled: { color: color.inkFaint },

  // Field
  field: { gap: space[2] },
  fieldLabel: { ...type.label },
  input: {
    minHeight: TARGET,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.md,
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    fontSize: 17,
    color: color.ink,
  },
  inputFocused: { borderColor: color.accent, borderWidth: 2 },
  inputError: { borderColor: color.danger, borderWidth: 2 },
  fieldHint: { ...type.caption },
  fieldError: { ...type.caption, color: color.danger },

  // Callout
  callout: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: space[4],
    gap: space[2],
  },
  calloutInfo: { backgroundColor: color.paperSunken, borderColor: color.line },
  calloutSuccess: {
    backgroundColor: color.accentSoft,
    borderColor: "#C9E0D2",
  },
  calloutDanger: {
    backgroundColor: color.dangerSoft,
    borderColor: "#E7C9C2",
  },
  calloutTitle: { fontSize: 15, fontWeight: "700", color: color.ink },
  calloutBody: { fontSize: 14, lineHeight: 21, color: color.inkMuted },

  // Badge
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[2],
    alignSelf: "flex-start",
    backgroundColor: color.paperSunken,
    borderRadius: radius.pill,
    paddingHorizontal: space[3],
    paddingVertical: 5,
  },
  badgeLabel: { fontSize: 12, fontWeight: "600", color: color.inkMuted },
  badgeDevice: { backgroundColor: color.accentSoft },
  badgeDeviceDot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: color.accent,
  },
  badgeDeviceLabel: { color: color.accentInk },

  divider: { height: 1, backgroundColor: color.line },

  // LoadingModal
  modalBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(28,26,23,0.32)", // ink, translucent
    paddingHorizontal: space[6],
  },
  modalCard: {
    minWidth: 132,
    minHeight: 132,
    maxWidth: 240,
    alignItems: "center",
    justifyContent: "center",
    gap: space[4],
    paddingVertical: space[6],
    paddingHorizontal: space[6],
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.line,
    shadowColor: "#1C1A17",
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  modalLabel: {
    ...type.label,
    color: color.inkMuted,
    textAlign: "center",
  },

  // Code
  code: {
    ...type.display,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
});
