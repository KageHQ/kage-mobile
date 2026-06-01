import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import TabBar from "../components/TabBar";
import ProveScreen from "./ProveScreen";
import IdentityScreen from "./IdentityScreen";
import SettingsScreen from "./SettingsScreen";

// The tabbed home shown once the user has a credential. Owns the active-tab
// state and overlays the floating TabBar on top of the active screen. All three
// screens stay mounted (toggled via display) so state — most importantly a
// freshly generated proof code — survives switching tabs and coming back.
export default function MainShell({ onReset }) {
  const [tab, setTab] = useState("prove");

  return (
    <View style={s.root}>
      <Pane visible={tab === "prove"}>
        <ProveScreen />
      </Pane>
      <Pane visible={tab === "identity"}>
        <IdentityScreen />
      </Pane>
      <Pane visible={tab === "settings"}>
        <SettingsScreen onReset={onReset} />
      </Pane>

      <TabBar active={tab} onChange={setTab} />
    </View>
  );
}

// Keeps an inactive screen mounted but hidden, so its state persists.
function Pane({ visible, children }) {
  return (
    <View
      style={[StyleSheet.absoluteFill, !visible && s.hidden]}
      pointerEvents={visible ? "auto" : "none"}
    >
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  hidden: { display: "none" },
});
