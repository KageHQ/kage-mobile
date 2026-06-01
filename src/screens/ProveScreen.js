import React, { useState } from "react";
import { View, Button, Text, ActivityIndicator } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Asset } from "expo-asset";
import { loadCredential } from "../credentialStore";
import { generateProofPayload } from "../prover";
import { MIN_AGE } from "@kagehq/shared/src/constants";

// Demo: fixed currentDate keeps the witness deterministic.
const REQUEST = { currentDateInt: 20260601, currentYY: 26, minAge: MIN_AGE };

export default function ProveScreen() {
  const [payload, setPayload] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onProve() {
    setBusy(true);
    try {
      const cred = await loadCredential();
      const wasm = Asset.fromModule(require("../../assets/age_kyc.wasm")).uri;
      const zkey = Asset.fromModule(require("../../assets/age_kyc.zkey")).uri;
      const p = await generateProofPayload(cred, REQUEST, wasm, zkey);
      setPayload(p);
    } finally { setBusy(false); }
  }

  return (
    <View style={{ padding: 24, alignItems: "center", gap: 16 }}>
      <Button title="Generate age≥18 proof" onPress={onProve} disabled={busy} />
      {busy && <ActivityIndicator />}
      {payload && <QRCode value={payload} size={280} />}
      {payload && <Text>Show this QR to the verifier. No personal data is inside.</Text>}
    </View>
  );
}
