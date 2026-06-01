// Floating bottom tab bar for the post-onboarding shell. A warm-white pill that
// hovers over the paper with a hairline border and a soft shadow — reads as a
// "real app" nav without the heavy chrome of a docked bar. No nav library: the
// active tab is plain state in MainShell, this is the presentational control.
import React from "react";
import { View, Text, Pressable, Platform, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { color, space, radius, TARGET } from "../theme";

// Each tab: stable key, Feather icon name, short Bahasa label.
export const TABS = [
  { key: "prove", icon: "shield", label: "Bukti" },
  { key: "identity", icon: "credit-card", label: "Identitas" },
  { key: "settings", icon: "settings", label: "Pengaturan" },
];

export default function TabBar({ active, onChange }) {
  return (
    // pointerBox is transparent and full-width; the pill inside catches touches.
    // Sits above the home indicator via the bottom offset.
    <View style={s.dock} pointerEvents="box-none">
      <View style={s.bar}>
        {TABS.map((t) => {
          const on = t.key === active;
          return (
            <Pressable
              key={t.key}
              onPress={() => onChange(t.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              accessibilityLabel={t.label}
              style={s.item}
              hitSlop={8}
            >
              <View style={[s.itemInner, on && s.itemInnerActive]}>
                <Feather
                  name={t.icon}
                  size={20}
                  color={on ? color.accent : color.inkFaint}
                />
                <Text style={[s.label, on && s.labelActive]} numberOfLines={1}>
                  {t.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  dock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    paddingHorizontal: space[5],
    // clears the iOS home indicator / Android nav gesture area
    paddingBottom: Platform.OS === "ios" ? space[6] : space[4],
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: color.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.line,
    paddingHorizontal: space[2],
    paddingVertical: space[2],
    // soft, low elevation — calm, not a popping card
    shadowColor: "#1C1A17",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  item: { flex: 1, minHeight: TARGET, justifyContent: "center" },
  itemInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space[2],
    paddingVertical: space[2],
    paddingHorizontal: space[2],
    borderRadius: radius.pill,
  },
  itemInnerActive: { backgroundColor: color.accentSoft },
  label: { fontSize: 12, fontWeight: "600", color: color.inkFaint },
  labelActive: { color: color.accentInk },
});
