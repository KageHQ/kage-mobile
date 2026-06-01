const { generateProofPayload } = require("../src/prover");

test("generateProofPayload posts to the prover and returns an encoded payload", async () => {
  const calls = [];
  global.fetch = async (url, opts) => {
    calls.push({ url, body: JSON.parse(opts.body) });
    return {
      ok: true,
      json: async () => ({
        proof: { pi_a: ["1", "2"], pi_b: [["3", "4"], ["5", "6"]], pi_c: ["7", "8"] },
        publicSignals: ["0", "1", "2", "3", "4", "77"],
      }),
    };
  };

  const cred = { nik: "3174071708950001", name: "12345" };
  const payload = await generateProofPayload(
    cred,
    { currentDateInt: 20260601, currentYY: 26, minAge: 18 },
    "http://prover.test"
  );

  expect(typeof payload).toBe("string");
  expect(payload.length).toBeGreaterThan(0);
  expect(calls[0].url).toBe("http://prover.test/prove");
  expect(calls[0].body.cred.nik).toBe("3174071708950001");
});

test("generateProofPayload throws on a prover error", async () => {
  global.fetch = async () => ({ ok: false, status: 400, json: async () => ({ error: "bad NIK" }) });
  await expect(
    generateProofPayload({ nik: "x" }, { currentDateInt: 1, currentYY: 1, minAge: 1 }, "http://x")
  ).rejects.toThrow(/prover error 400/);
});
