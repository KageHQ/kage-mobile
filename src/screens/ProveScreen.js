import React, { useState } from "react";
import { View, Button, Text, ActivityIndicator } from "react-native";
import { loadCredential } from "../credentialStore";
import { generateProofPayload, publishPayload } from "../prover";
import { MIN_AGE } from "@kagehq/shared/src/constants";

// Demo: fixed currentDate keeps the witness deterministic.
const REQUEST = { currentDateInt: 20260601, currentYY: 26, minAge: MIN_AGE };

// The prover service is the issuer (same host). Override via EXPO_PUBLIC_ISSUER_URL.
const PROVER_URL = process.env.EXPO_PUBLIC_ISSUER_URL || "http://10.0.2.2:4000";

export default function ProveScreen({ onReset }) {
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
    <View style={{ padding: 24, alignItems: "center", gap: 16 }}>
      <Button title="Generate age≥18 proof" onPress={onProve} disabled={busy} />
      {busy && <ActivityIndicator />}
      {error && <Text style={{ color: "#c00" }}>{error}</Text>}
      {code && (
        <View style={{ alignItems: "center", gap: 8, marginTop: 8 }}>
          <Text style={{ fontSize: 16, color: "#555" }}>Enter this code on the verifier:</Text>
          <Text style={{ fontSize: 56, fontWeight: "bold", letterSpacing: 8 }}>{code}</Text>
          <Text style={{ fontSize: 13, color: "#777" }}>
            Valid 5 min · one-time · no personal data inside.
          </Text>
        </View>
      )}
      <View style={{ marginTop: 24 }}>
        <Button title="Re-enter NIK (reset credential)" color="#c00" onPress={onReset} />
      </View>
    </View>
  );
}
