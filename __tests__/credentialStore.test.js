jest.mock("expo-secure-store", () => {
  const mem = {};
  return {
    setItemAsync: jest.fn(async (k, v) => { mem[k] = v; }),
    getItemAsync: jest.fn(async (k) => mem[k] ?? null),
    deleteItemAsync: jest.fn(async (k) => { delete mem[k]; }),
  };
});
const { saveCredential, loadCredential, hasCredential } = require("../src/credentialStore");

test("saves and loads a credential through secure store", async () => {
  const cred = { nik: "3174071708950001", name: "12345", secret: "9", signature: {} };
  expect(await hasCredential()).toBe(false);
  await saveCredential(cred);
  expect(await hasCredential()).toBe(true);
  const loaded = await loadCredential();
  expect(loaded.nik).toBe("3174071708950001");
});
