import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Screen,
  Brandmark,
  H1,
  H2,
  Body,
  Caption,
  Button,
  Callout,
  Divider,
} from "../components/ui";
import { color, space, radius } from "../theme";

// "Pengaturan" tab: about/privacy copy and the one destructive action — reset
// the credential (clears the stored NIK + profile and restarts onboarding).
export default function SettingsScreen({ onReset }) {
  return (
    <Screen floating>
      <Brandmark />

      <View style={{ marginTop: space[6], gap: space[2] }}>
        <H1>Pengaturan</H1>
      </View>

      <View style={s.group}>
        <H2 style={{ fontSize: 17 }}>Privasi</H2>
        <Body style={{ color: color.inkMuted, fontSize: 15, lineHeight: 22 }}>
          Kage menyimpan NIK Anda di penyimpanan aman perangkat. Setiap bukti
          hanya menyatakan bahwa Anda cukup umur — tanpa nama, NIK, atau dokumen.
        </Body>
        <Row label="Penyimpanan" value="Aman di perangkat" />
        <Divider />
        <Row label="Data dalam bukti" value="Tidak ada data pribadi" />
      </View>

      <View style={s.group}>
        <H2 style={{ fontSize: 17 }}>Kredensial</H2>
        <Callout tone="danger" title="Mengganti NIK akan menghapus kredensial">
          Anda perlu memasukkan NIK lagi dan memverifikasi ulang identitas.
        </Callout>
        <Button
          title="Ganti NIK (atur ulang kredensial)"
          variant="ghostDanger"
          onPress={onReset}
        />
      </View>

      <Caption style={{ marginTop: space[6], textAlign: "center" }}>
        Kage · bukti usia tanpa membagikan identitas
      </Caption>
    </Screen>
  );
}

function Row({ label, value }) {
  return (
    <View style={s.row}>
      <Body style={{ color: color.inkMuted, fontSize: 15 }}>{label}</Body>
      <Body style={{ fontSize: 15, fontWeight: "600" }}>{value}</Body>
    </View>
  );
}

const s = StyleSheet.create({
  group: {
    marginTop: space[6],
    gap: space[3],
    padding: space[5],
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space[3],
  },
});
