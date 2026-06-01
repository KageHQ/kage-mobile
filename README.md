# kage-mobile

The wallet: holds the user's NIK in the OS keystore, requests a signed credential from the issuer, delegates proving to the issuer's `/prove` endpoint, publishes the proof to the issuer's `/relay` endpoint, and displays a **6-digit relay code** for the verifier to type in.

<p>
  <img src="https://img.shields.io/badge/React%20Native-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React Native">
  <img src="https://img.shields.io/badge/Expo-000?style=flat-square&logo=expo&logoColor=white" alt="Expo">
  <img src="https://img.shields.io/badge/Groth16-2D7FF9?style=flat-square" alt="Groth16">
  <img src="https://img.shields.io/badge/Zero--Knowledge-6E56CF?style=flat-square" alt="Zero-Knowledge">
</p>

## Role in the system

```
1. Onboard
   kage-mobile  ──POST /sign { nik, name }──▶  kage-issuer
                ◀──signed credential──────────

2. Prove (server-side)
   kage-mobile  ──POST /prove { cred, request }──▶  kage-issuer (runs snarkjs Groth16)
                ◀──{ proof, publicSignals }──────

3. Relay
   kage-mobile  ──POST /relay { payload }──▶  kage-issuer
                ◀──{ code: "123456" }────────
   (phone displays the 6-digit code)

4. Verify on-chain
   User types code on kage-web  ──fetch relay──▶  kage-issuer
                                ──submit proof──▶  kage-program (Solana, nullifier PDA)
```

> **No QR scanning.** The prior approach rendered the proof as a QR code, but the
> encoded payload was too dense to scan reliably on physical devices. It was replaced
> by a relay code: the phone posts the payload to the issuer, which stores it for 5
> minutes under a 6-digit code that the web verifier fetches directly.

## Screens

### Onboard — `src/screens/OnboardScreen.js`

First-run screen. The user enters their 16-digit KTP NIK. The app calls `src/issuerClient.js → requestCredential()`, which POSTs `{ nik, name }` to `kage-issuer /sign`. The issuer returns a signed credential (EdDSA signature, nullifier hash, secret). The credential is saved to the OS keystore via `expo-secure-store` (`src/credentialStore.js`). On subsequent launches this screen is skipped.

### Prove — `src/screens/ProveScreen.js`

Main screen once onboarded. Tapping **Generate age ≥ 18 proof**:

1. Loads the stored credential.
2. Calls `src/prover.js → generateProofPayload(cred, request, proverUrl)` — POSTs to `kage-issuer /prove`, receives `{ proof, publicSignals }`, and encodes them into a payload via `@kagehq/shared encodeProofPayload`.
3. Calls `src/prover.js → publishPayload(payload, proverUrl)` — POSTs to `kage-issuer /relay`, receives a 6-digit `code`.
4. Displays the code in large text so the verifier can type it into `kage-web`.

A red **Re-enter NIK (reset credential)** button clears the stored credential and returns to the Onboard screen.

## Server-side proving

`snarkjs groth16.fullProve` is too heavy for Expo Go / Hermes: it requires Node built-ins not available in the React Native runtime. Proving is therefore delegated to the issuer's `/prove` endpoint.

**Privacy caveat:** the stored credential (NIK, name, nullifier secret, and issuer signature) leaves the device and is sent to the issuer server over the local network. In a production system the prover would run on-device or in a trusted enclave; for this campus demo the issuer and user share the same trust boundary.

## Install

`@kagehq/shared` is published to GitHub Packages. Add a `.npmrc` at the repo root that routes the `@kagehq` scope there (the file is gitignored — **never commit your token**):

```
@kagehq:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT
node-linker=hoisted
```

The PAT needs the `read:packages` scope.

> **pnpm + Expo** requires `node-linker=hoisted` so that Expo's Metro bundler can
> find transitive dependencies under a flat `node_modules/`. Either add it to
> `.npmrc` (as above) or prefix the install command:
>
> ```bash
> NPM_CONFIG_NODE_LINKER=hoisted pnpm install
> ```

```bash
pnpm install
```

## Run

**Prerequisites:** Node 18+, pnpm, [Expo CLI](https://docs.expo.dev/get-started/installation/), `kage-issuer` running on port 4000.

```bash
# Android emulator (default — issuer on host localhost)
EXPO_PUBLIC_ISSUER_URL=http://10.0.2.2:4000 pnpm start -c

# Physical phone or iOS simulator — use the host machine's LAN IP
EXPO_PUBLIC_ISSUER_URL=http://192.168.1.x:4000 pnpm start -c
```

Open Expo Go on your device / emulator and scan the terminal QR code, or press `a` to launch on a connected Android emulator.

| Target | `EXPO_PUBLIC_ISSUER_URL` |
|--------|--------------------------|
| Android emulator | `http://10.0.2.2:4000` (default, maps to host `localhost`) |
| Physical phone | `http://<host-LAN-IP>:4000` — phone and host must be on the same Wi-Fi |
| iOS simulator | `http://localhost:4000` |

### Demo NIK

```
3174071708950001
```

Male, born 1995-08-17 — age ≥ 18 check passes. The Circom circuit validates both the
issuer signature and the age constraint; random 16-digit numbers will fail.

## Test

```bash
pnpm test
```

Runs the Jest suite.

## Sibling repos

| Repo | Role |
|------|------|
| **[kage-mobile](https://github.com/KageHQ/kage-mobile) (this repo)** | React Native / Expo wallet — NIK entry, credential storage, relay-code display |
| [kage-shared](https://github.com/KageHQ/kage-shared) | Shared proof codec (`encodeProofPayload`), `MIN_AGE` constant |
| [kage-circuits](https://github.com/KageHQ/kage-circuits) | Circom circuit + Groth16 build artifacts |
| [kage-issuer](https://github.com/KageHQ/kage-issuer) | EdDSA credential signing + server-side prover + relay store |
| [kage-program](https://github.com/KageHQ/kage-program) | Solana on-chain Groth16 verifier + nullifier PDA |
| [kage-web](https://github.com/KageHQ/kage-web) | Browser verifier — fetches relay code, submits proof to Solana |
| [kage-e2e](https://github.com/KageHQ/kage-e2e) | End-to-end happy-path tests |
