import React, { useState } from "react";
import { View } from "react-native";
import { requestCredential } from "../issuerClient";
import { saveCredential } from "../credentialStore";
import {
  Screen,
  Brandmark,
  H1,
  Lead,
  Body,
  Caption,
  TextField,
  Button,
  Callout,
  Badge,
  Divider,
  LoadingModal,
} from "../components/ui";
import { space } from "../theme";

// Default is the deployed issuer. Override via EXPO_PUBLIC_ISSUER_URL (e.g.
// http://10.0.2.2:4000 for the emulator against a local issuer, or your Mac's
// LAN IP for a physical phone on the same network).
const ISSUER_URL =
  process.env.EXPO_PUBLIC_ISSUER_URL || "https://kage-issuer.theola.dev";

export default function OnboardScreen({ onDone }) {
  const [nik, setNik] = useState("");
  // name is the numeric field signed into the credential (Poseidon needs a field
  // element, not free text). Kept internal so the signature/circuit stay valid;
  // never shown to the user.
  const [name] = useState("12345");
  // Display-only KTP fields. These never enter the proof, so they stay on the
  // device — collected here, stored locally, shown on the profile. Never sent to
  // the issuer/prover (keeps PII off-device, unlike the signed fields).
  const [fullName, setFullName] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [address, setAddress] = useState("");
  // phase: idle | loading | done | error
  const [phase, setPhase] = useState("idle");
  const [message, setMessage] = useState("");

  const nikValid = /^\d{16}$/.test(nik);

  async function onSubmit() {
    setPhase("loading");
    setMessage("Meminta kredensial dari penerbit…");
    try {
      const cred = await requestCredential(ISSUER_URL, { nik, name });
      await saveCredential({
        ...cred,
        nik,
        name,
        // device-local PII, not part of the signed credential
        profile: { fullName, placeOfBirth, address },
      });
      setPhase("done");
      setMessage("Tersimpan dengan aman di perangkat ini.");
      onDone?.();
    } catch (e) {
      setPhase("error");
      setMessage(`Gagal: ${e.message}`);
    }
  }

  return (
    <Screen>
      <LoadingModal
        visible={phase === "loading"}
        label={message || "Memuat…"}
      />
      <Brandmark />

      <View style={{ marginTop: space[6], gap: space[2] }}>
        <H1>Verifikasi identitas</H1>
        <Lead>
          Cukup sekali. Setelah ini Kage bisa membuktikan usia Anda tanpa
          membagikan dokumen apa pun.
        </Lead>
      </View>

      {/* Section A — what leaves the device */}
      <View style={{ marginTop: space[7], gap: space[4] }}>
        <View style={{ gap: space[1] }}>
          <Body style={{ fontWeight: "700" }}>Untuk membuat kredensial</Body>
          <Caption>Hanya nomor NIK yang dikirim ke penerbit.</Caption>
        </View>
        <TextField
          label="NIK (16 digit KTP)"
          value={nik}
          onChangeText={(t) => setNik(t.replace(/[^\d]/g, "").slice(0, 16))}
          keyboardType="number-pad"
          placeholder="3174071708950001"
          maxLength={16}
          hint={
            nik.length > 0 && !nikValid
              ? undefined
              : "Nomor ini dipakai sekali untuk menerbitkan kredensial Anda."
          }
          error={nik.length > 0 && !nikValid ? "NIK harus 16 digit angka." : undefined}
        />
      </View>

      <Divider style={{ marginVertical: space[6] }} />

      {/* Section B — what stays on the device */}
      <View style={{ gap: space[4] }}>
        <View style={{ gap: space[2] }}>
          <Body style={{ fontWeight: "700" }}>Data pribadi Anda</Body>
          <Badge label="Tersimpan di perangkat ini saja" tone="device" />
          <Caption>
            Nama, tempat lahir, dan alamat tidak pernah dikirim ke mana pun dan
            tidak masuk ke dalam bukti.
          </Caption>
        </View>
        <TextField
          label="Nama lengkap"
          value={fullName}
          onChangeText={setFullName}
          placeholder="BUDI SANTOSO"
          autoCapitalize="characters"
        />
        <TextField
          label="Tempat lahir"
          value={placeOfBirth}
          onChangeText={setPlaceOfBirth}
          placeholder="JAKARTA"
          autoCapitalize="characters"
        />
        <TextField
          label="Alamat"
          value={address}
          onChangeText={setAddress}
          placeholder="JL. MERDEKA NO. 1, RT 001/RW 002"
          multiline
          style={{ minHeight: 88, paddingTop: space[3], textAlignVertical: "top" }}
        />
      </View>

      <View style={{ marginTop: space[7], gap: space[3] }}>
        <Button
          title="Verifikasi identitas"
          onPress={onSubmit}
          disabled={!nikValid}
          loading={phase === "loading"}
        />
        {phase === "done" && (
          <Callout tone="success" title="Identitas terverifikasi">
            {message}
          </Callout>
        )}
        {phase === "error" && (
          <Callout tone="danger" title="Tidak bisa memverifikasi">
            {message}
          </Callout>
        )}
      </View>
    </Screen>
  );
}
