import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { loadCredential } from "../credentialStore";
import {
  Screen,
  Brandmark,
  H1,
  H2,
  Lead,
  Body,
  Caption,
  Badge,
  Divider,
} from "../components/ui";
import { color, space, radius } from "../theme";

// "Identitas" tab: the device-local KTP data the user entered at onboarding.
// None of this is in the credential signature or the proof — it never leaves the
// phone. The screen exists to make that visible (the privacy-visible principle).
export default function IdentityScreen() {
  const [cred, setCred] = useState(null);

  useEffect(() => {
    loadCredential()
      .then(setCred)
      .catch(() => setCred(null));
  }, []);

  const profile = cred?.profile || {};
  const hasProfile =
    profile.fullName || profile.placeOfBirth || profile.address;
  // Show only the tail of the NIK; the full number is never displayed.
  const nikTail =
    typeof cred?.nik === "string" && cred.nik.length >= 4
      ? cred.nik.slice(-4)
      : null;

  return (
    <Screen floating>
      <Brandmark />

      <View style={{ marginTop: space[6], gap: space[2] }}>
        <H1>Identitas Anda</H1>
        <Lead>Data ini tersimpan di perangkat ini saja.</Lead>
      </View>

      <View style={s.card}>
        <View style={s.cardTop}>
          <Caption style={{ letterSpacing: 1, textTransform: "uppercase" }}>
            Kartu identitas · Kage
          </Caption>
          <Badge label="Di perangkat ini" tone="device" />
        </View>

        <Divider style={{ marginVertical: space[4] }} />

        {hasProfile ? (
          <View style={{ gap: space[4] }}>
            {profile.fullName ? (
              <Field label="Nama lengkap" value={profile.fullName} />
            ) : null}
            {profile.placeOfBirth ? (
              <Field label="Tempat lahir" value={profile.placeOfBirth} />
            ) : null}
            {profile.address ? (
              <Field label="Alamat" value={profile.address} />
            ) : null}
          </View>
        ) : (
          <Body style={{ color: color.inkMuted }}>
            Tidak ada data pribadi yang disimpan.
          </Body>
        )}

        {nikTail ? (
          <>
            <Divider style={{ marginVertical: space[4] }} />
            <Field label="NIK" value={`•••• •••• •••• ${nikTail}`} mono />
          </>
        ) : null}
      </View>

      <Caption style={{ marginTop: space[4] }}>
        Nama, tempat lahir, dan alamat tidak pernah dikirim ke mana pun dan tidak
        masuk ke dalam bukti usia Anda.
      </Caption>
    </Screen>
  );
}

function Field({ label, value, mono }) {
  return (
    <View style={{ gap: 3 }}>
      <Caption>{label}</Caption>
      <H2 style={[{ fontSize: 18 }, mono && { fontVariant: ["tabular-nums"] }]}>
        {value}
      </H2>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    marginTop: space[6],
    padding: space[5],
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.lg,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space[3],
  },
});
