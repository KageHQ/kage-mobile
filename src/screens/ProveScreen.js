import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { loadCredential } from "../credentialStore";
import { generateProofPayload, publishPayload } from "../prover";
import { MIN_AGE } from "@kagehq/shared/src/constants";
import {
  Screen,
  Brandmark,
  H1,
  H2,
  Lead,
  Body,
  Caption,
  Button,
  Callout,
  Badge,
  CodeDisplay,
} from "../components/ui";
import { color, space, radius } from "../theme";

// The event this proof is for. The nullifier is scoped to it, so one identity
// can prove at different events but not twice at the same one. In a real flow
// the phone reads the eventId from the gate; here it is a demo constant that
// must match the verifier gate's VITE_EVENT_ID.
const EVENT_ID = process.env.EXPO_PUBLIC_EVENT_ID || "1001";

// Demo: fixed currentDate keeps the witness deterministic.
const REQUEST = { currentDateInt: 20260601, currentYY: 26, minAge: MIN_AGE, scope: EVENT_ID };

// The prover service is the issuer (same host). Override via EXPO_PUBLIC_ISSUER_URL.
const PROVER_URL = process.env.EXPO_PUBLIC_ISSUER_URL || "http://10.0.2.2:4000";

export default function ProveScreen({ onReset }) {
  const [code, setCode] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState(null);

  // Show the device-local PII collected at onboarding. Never leaves the device.
  useEffect(() => {
    loadCredential()
      .then((c) => setProfile(c.profile || null))
      .catch(() => setProfile(null));
  }, []);

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

  const hasProfile =
    profile && (profile.fullName || profile.placeOfBirth || profile.address);

  return (
    <Screen>
      <Brandmark />

      {hasProfile && (
        <View style={styles.profile}>
          {profile.fullName ? <H2>{profile.fullName}</H2> : null}
          {profile.placeOfBirth ? (
            <Body style={{ color: color.inkMuted }}>
              Lahir di {profile.placeOfBirth}
            </Body>
          ) : null}
          {profile.address ? (
            <Body style={{ color: color.inkMuted }}>{profile.address}</Body>
          ) : null}
          <View style={{ marginTop: space[2] }}>
            <Badge label="Di perangkat ini · tidak ada dalam bukti" tone="device" />
          </View>
        </View>
      )}

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

      <View style={styles.resetWrap}>
        <Button
          title="Ganti NIK (atur ulang kredensial)"
          variant="ghostDanger"
          onPress={onReset}
        />
      </View>
    </Screen>
  );
}

const styles = {
  profile: {
    marginTop: space[6],
    gap: space[1],
    padding: space[4],
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.lg,
  },
  resetWrap: { marginTop: space[9] },
};
