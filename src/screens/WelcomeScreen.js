import React from "react";
import { View, ScrollView } from "react-native";
import { MIN_AGE } from "@kagehq/shared/src/constants";
import {
  Logo,
  H1,
  H2,
  Lead,
  Body,
  Caption,
  Button,
} from "../components/ui";
import { color, space } from "../theme";

// First-run intro, shown once before onboarding. Sells the trust claim
// (privacy-visible principle) in plain Bahasa, then routes to NIK entry.
export default function WelcomeScreen({ onStart }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: color.paper }}
      contentContainerStyle={st.content}
    >
      <View style={st.top}>
        <Logo size={64} />
        <View style={{ marginTop: space[6], gap: space[3] }}>
          <H1 style={{ fontSize: 30, lineHeight: 38 }}>
            Buktikan usia Anda. Simpan sisanya.
          </H1>
          <Lead>
            Kage membuat bukti bahwa Anda berusia {MIN_AGE} tahun atau lebih,
            tanpa membagikan KTP atau data pribadi apa pun.
          </Lead>
        </View>

        <View style={{ marginTop: space[8], gap: space[6] }}>
          <Point
            title="Tanpa menunjukkan KTP"
            body="Verifikator hanya menerima sebuah kode, bukan dokumen Anda."
          />
          <Point
            title="Data tetap di perangkat"
            body="Nama, tempat lahir, dan alamat tidak pernah dikirim ke mana pun."
          />
          <Point
            title="Sekali pakai"
            body="Setiap bukti kedaluwarsa dalam 5 menit dan tidak menyimpan identitas."
          />
        </View>
      </View>

      <View style={st.bottom}>
        <Button title="Mulai" onPress={onStart} />
        <Caption style={{ textAlign: "center" }}>
          Perlu KTP dengan NIK 16 digit. Sekali persiapan.
        </Caption>
      </View>
    </ScrollView>
  );
}

function Point({ title, body }) {
  return (
    <View style={st.point}>
      <View style={st.dot} />
      <View style={{ flex: 1, gap: 3 }}>
        <H2 style={{ fontSize: 17 }}>{title}</H2>
        <Body style={{ color: color.inkMuted, fontSize: 15, lineHeight: 22 }}>
          {body}
        </Body>
      </View>
    </View>
  );
}

const st = {
  content: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: space[6],
    paddingTop: space[8],
    paddingBottom: space[7],
  },
  top: {},
  bottom: { marginTop: space[8], gap: space[3] },
  point: { flexDirection: "row", gap: space[4] },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: color.accent,
    marginTop: 7,
  },
};
