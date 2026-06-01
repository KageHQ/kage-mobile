const { requestCredential } = require("../src/issuerClient");

test("requestCredential posts NIK + name and returns credential", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ secret: "1", signature: { R8x: "1", R8y: "2", S: "3" },
      pubKey: { Ax: "9", Ay: "8" }, nullifierHash: "77" }),
  });
  const cred = await requestCredential("http://x", { nik: "3174071708950001", name: "12345" });
  expect(cred.nullifierHash).toBe("77");
  expect(global.fetch).toHaveBeenCalledWith("http://x/sign", expect.objectContaining({ method: "POST" }));
});
