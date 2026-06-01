import React, { useState } from "react";
import { View } from "react-native";
import { loadCredential } from "../credentialStore";
import { generateProofPayload, publishPayload } from "../prover";
import { MIN_AGE } from "@kagehq/shared/src/constants";
import {
  Screen,
  Brandmark,
  H1,
  Lead,
  Caption,
  Button,
  Callout,
  CodeDisplay,
  LoadingModal,
} from "../components/ui";
import { space } from "../theme";

// The event this proof is for. The nullifier is scoped to it, so one identity
// can prove at different events but not twice at the same one. In a real flow
// the phone reads the eventId from the gate; here it is a demo constant that
// must match the verifier gate's VITE_EVENT_ID.
const EVENT_ID = process.env.EXPO_PUBLIC_EVENT_ID || "1001";

// Demo: fixed currentDate keeps the witness deterministic.
const REQUEST = { currentDateInt: 20260601, currentYY: 26, minAge: MIN_AGE, scope: EVENT_ID };

// The prover service is the issuer (same host). Override via EXPO_PUBLIC_ISSUER_URL.
const PROVER_URL = process.env.EXPO_PUBLIC_ISSUER_URL || "http://10.0.2.2:4000";

// "Bukti" tab: the single primary task — generate a one-time relay code. The
// device-local profile lives on the Identitas tab; reset lives on Pengaturan.
export default function ProveScreen() {
  const [code, setCode] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onProve() {
    setBusy(true);
    setError(null);
    setCode(null);
    try {
      const cred = await loadCredential();
      const payload = await generateProofPayload(cred, REQUEST, PROVER_URL);
      const c = await publishPayload(payload, PROVER_URL);
      setCode(c);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen floating>
      <LoadingModal visible={busy} label="Membuat bukti…" />
      <Brandmark />

      {!code && (
        <View style={{ marginTop: space[7], gap: space[3] }}>
          <H1>Buktikan usia ≥ {MIN_AGE}</H1>
          <Lead>
            Kage membuat satu kode sekali pakai. Verifikator memasukkannya untuk
            memastikan Anda cukup umur, tanpa melihat data pribadi Anda.
          </Lead>
        </View>
      )}

      {code ? (
        <View style={{ marginTop: space[7], gap: space[5], alignItems: "center" }}>
          <Caption style={{ fontSize: 14 }}>
            Masukkan kode ini di alat verifikasi
          </Caption>
          <CodeDisplay code={code} />
          <Callout tone="success" style={{ alignSelf: "stretch" }}>
            Berlaku 5 menit · sekali pakai · tanpa data pribadi di dalamnya.
          </Callout>
          <Button
            title="Buat kode baru"
            variant="secondary"
            onPress={onProve}
            loading={busy}
            style={{ alignSelf: "stretch" }}
          />
        </View>
      ) : (
        <View style={{ marginTop: space[7], gap: space[3] }}>
          <Button
            title={busy ? "Membuat bukti…" : `Buat bukti usia ≥ ${MIN_AGE}`}
            onPress={onProve}
            loading={busy}
          />
          {error && (
            <Callout tone="danger" title="Gagal membuat bukti">
              {error}
            </Callout>
          )}
        </View>
      )}
    </Screen>
  );
}
