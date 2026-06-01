import * as SecureStore from "expo-secure-store";

const KEY = "proven_kyc_credential";

// expo-secure-store encrypts at rest using the iOS Keychain / Android Keystore.
export async function saveCredential(cred) {
  await SecureStore.setItemAsync(KEY, JSON.stringify(cred));
}
export async function loadCredential() {
  const raw = await SecureStore.getItemAsync(KEY);
  if (!raw) throw new Error("no credential stored");
  return JSON.parse(raw);
}
export async function hasCredential() {
  return (await SecureStore.getItemAsync(KEY)) != null;
}
export async function clearCredential() {
  await SecureStore.deleteItemAsync(KEY);
}
