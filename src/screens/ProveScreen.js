import React, { useState } from "react";
import { View, Button, Text, ActivityIndicator } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { loadCredential } from "../credentialStore";
import { generateProofPayload } from "../prover";
import { MIN_AGE } from "@kagehq/shared/src/constants";

// Demo: fixed currentDate keeps the witness deterministic.
const REQUEST = { currentDateInt: 20260601, currentYY: 26, minAge: MIN_AGE };

// The prover service is the issuer (same host). Override via EXPO_PUBLIC_ISSUER_URL.
const PROVER_URL = process.env.EXPO_PUBLIC_ISSUER_URL || "http://10.0.2.2:4000";

export default function ProveScreen({ onReset }) {
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onProve() {
    setBusy(true);
    setError(null);
    try {
      const cred = await loadCredential();
      const p = await generateProofPayload(cred, REQUEST, PROVER_URL);
      setPayload(p);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ padding: 24, alignItems: "center", gap: 16 }}>
      <Button title="Generate age≥18 proof" onPress={onProve} disabled={busy} />
      {busy && <ActivityIndicator />}
      {error && <Text style={{ color: "#c00" }}>{error}</Text>}
      {/* ecl "L" = least error-correction overhead -> fewer modules -> the dense
          proof payload is easier for a webcam to resolve. */}
      {payload && <QRCode value={payload} size={320} ecl="L" />}
      {payload && <Text>Show this QR to the verifier. No personal data is inside.</Text>}
      <View style={{ marginTop: 24 }}>
        <Button title="Re-enter NIK (reset credential)" color="#c00" onPress={onReset} />
      </View>
    </View>
  );
}
