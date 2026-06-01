# proven-kyc mobile

React Native / Expo app that lets a user onboard with a KYC credential and generate a zero-knowledge age proof displayed as a QR code.

## Pre-requisites

Node 18+, pnpm, and the [Expo CLI](https://docs.expo.dev/get-started/installation/) installed.

## Setup

### 1. Build the circuit artifacts

The app bundles the compiled Circom circuit (`.wasm`) and proving key (`.zkey`). Build them first:

```bash
pnpm --filter @proven-kyc/circuits build
```

### 2. Copy artifacts into `mobile/assets/`

```bash
mkdir -p mobile/assets
cp circuits/build/age_kyc_js/age_kyc.wasm mobile/assets/
cp circuits/build/age_kyc.zkey mobile/assets/
```

These files are gitignored (large generated binaries — never commit them).

### 3. Start the issuer server

```bash
pnpm --filter @proven-kyc/issuer start
```

The issuer listens on `localhost:4000`. The app is pre-configured to reach it at
`http://10.0.2.2:4000` (the Android emulator's alias for the host machine).

> **Physical device:** replace `10.0.2.2` with your host machine's LAN IP address
> in `src/screens/OnboardScreen.js`.

### 4. Start the Expo dev server

```bash
pnpm --filter @proven-kyc/mobile start
```

Open the Expo Go app on your device/emulator and scan the QR code that appears in
the terminal, or press `a` to launch directly on a connected Android emulator.

## Manual smoke test

1. Launch the app — the **Onboard** screen appears (no credential stored yet).
2. Enter a 16-digit NIK and tap **Verify identity (one time)**.
3. The app requests a credential from the issuer and stores it encrypted on-device.
4. The app transitions to the **Prove** screen.
5. Tap **Generate age≥18 proof** — the ZK proof is generated on-device (takes ~5–15 s).
6. A QR code renders. Scan it with the verifier to confirm the proof is valid.
   No personal data is encoded in the QR — only the proof and public signals.

## Notes

- Credentials are stored using `expo-secure-store` (iOS Keychain / Android Keystore).
- The `currentDateInt` in `ProveScreen` is fixed to `20260601` to keep the witness
  deterministic during development. Change it to `Date.now()` logic for production.
