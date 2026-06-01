import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { requestCredential } from "../issuerClient";
import { saveCredential } from "../credentialStore";

const ISSUER_URL = "http://10.0.2.2:4000"; // Android emulator -> host localhost

export default function OnboardScreen({ onDone }) {
  const [nik, setNik] = useState("");
  const [name, setName] = useState("12345");
  const [status, setStatus] = useState("");

  async function onSubmit() {
    try {
      setStatus("requesting credential…");
      const cred = await requestCredential(ISSUER_URL, { nik, name });
      await saveCredential({ ...cred, nik, name });
      setStatus("stored on device ✓");
      onDone?.();
    } catch (e) { setStatus(`error: ${e.message}`); }
  }

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text>Enter your KTP NIK (16 digits)</Text>
      <TextInput value={nik} onChangeText={setNik} keyboardType="number-pad"
        placeholder="3174071708950001" style={{ borderWidth: 1, padding: 8 }} />
      <Button title="Verify identity (one time)" onPress={onSubmit} />
      <Text>{status}</Text>
    </View>
  );
}
