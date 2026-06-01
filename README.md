# kage-mobile

The wallet that holds a user's KTP identity and proves age ≥ 18 on-device — without ever exposing the NIK, name, or date of birth.

This React Native / Expo app is the **only component in proven-kyc that touches PII**. It onboards the NIK, fetches a signed credential from the issuer, generates a Groth16 proof locally (~5–15 s), and renders a QR that contains the proof only — never personal data.

## Role in the system

```
kage-mobile  ──credential request──▶  kage-issuer (signs KTP credential)
             ◀──signed credential──

kage-mobile  ──on-device Groth16 proof (snarkjs, ~5–15 s)──▶  QR code
                                                              (proof + public signals, NO PII)
                                                                    │
                                                               kage-web (scans QR)
                                                                    │
                                                             kage-program (verifies on-chain,
                                                                           rejects replays via nullifier)
```

After onboarding the raw NIK is encrypted in the OS keystore and never leaves the device.

## Install

`@kagehq/shared` and `@kagehq/circuits` are published to GitHub Packages, so you first need a `.npmrc` that routes the `@kagehq` scope there:

```
@kagehq:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT
```

The PAT needs the `read:packages` scope. **Never commit it.**

```bash
pnpm install          # also runs postinstall → copies wasm + zkey into assets/
```

## Run

**Prerequisites:** Node 18+, pnpm, [Expo CLI](https://docs.expo.dev/get-started/installation/).

```bash
pnpm start
```

Open Expo Go on your device / emulator and scan the terminal QR code, or press `a` to launch on a connected Android emulator.

### Issuer URL

The app is pre-configured for the Android emulator host alias:

```js
// src/screens/OnboardScreen.js
const ISSUER_URL = "http://10.0.2.2:4000";
```

| Target | URL to use |
|--------|-----------|
| Android emulator | `http://10.0.2.2:4000` (default, host `localhost`) |
| Physical device / iOS simulator | Replace with the host machine's LAN IP or `http://localhost:4000` |

[kage-issuer](https://github.com/KageHQ/kage-issuer) must be running on port 4000.

### Demo NIK

```
3174071708950001
```

Male, born 1995-08-17 — age ≥ 18 check passes.

## Test

```bash
pnpm test
```

Runs the Jest suite under `__tests__/`.

## Screens

### Onboard — `src/screens/OnboardScreen.js`

First-run screen. The user enters their 16-digit NIK, which is posted to `kage-issuer /sign` (`src/issuerClient.js`). The issuer returns a signed credential (EdDSA public key, signature, nullifier hash, secret). The credential is persisted via `expo-secure-store` (iOS Keychain / Android Keystore) by `src/credentialStore.js`. On subsequent launches this screen is skipped.

### Prove — `src/screens/ProveScreen.js`

Main screen once onboarded. Tapping **Generate age ≥ 18 proof** runs `snarkjs groth16.fullProve` inside `src/prover.js` against the bundled wasm + zkey circuit assets. The resulting proof and public signals are encoded into a QR payload via `@kagehq/shared encodeProofPayload` and rendered as a QR code. The QR contains **no PII** — only the cryptographic proof and public signals.

## Circuit assets

`@kagehq/circuits` ships the compiled Circom artefacts:

| File | Source package path |
|------|---------------------|
| `assets/age_kyc.wasm` | `@kagehq/circuits/build/age_kyc_js/age_kyc.wasm` |
| `assets/age_kyc.zkey` | `@kagehq/circuits/build/age_kyc.zkey` |

The `postinstall` script in `package.json` copies them automatically on every `pnpm install`:

```json
"postinstall": "mkdir -p assets && cp node_modules/@kagehq/circuits/build/age_kyc_js/age_kyc.wasm assets/ && cp node_modules/@kagehq/circuits/build/age_kyc.zkey assets/"
```

`assets/` is gitignored — these are large generated binaries regenerated on install.

## Privacy note

After onboarding, the NIK is encrypted at rest in the OS keystore and never transmitted again. The QR code that the verifier scans contains **only the Groth16 proof and public signals** — no NIK, no name, no date of birth.

## Sibling repos

| Repo | Role |
|------|------|
| **kage-mobile (this repo)** | React Native / Expo app — PII entry + on-device proving |
| [kage-shared](https://github.com/KageHQ/kage-shared) | Shared types, proof codec (`encodeProofPayload`), `MIN_AGE` constant |
| [kage-circuits](https://github.com/KageHQ/kage-circuits) | Circom circuit, wasm + zkey build |
| [kage-issuer](https://github.com/KageHQ/kage-issuer) | EdDSA credential signing server |
| [kage-program](https://github.com/KageHQ/kage-program) | Solana on-chain Groth16 verifier + nullifier PDA |
| [kage-web](https://github.com/KageHQ/kage-web) | Browser verifier — scans QR, submits to Solana |
| [kage-e2e](https://github.com/KageHQ/kage-e2e) | End-to-end happy-path tests |
