const { buildCircuitInput } = require("../src/prover");

test("buildCircuitInput maps a stored credential to circuit signals", () => {
  const cred = {
    nik: "3174071708950001", name: "12345", secret: "99",
    pubKey: { Ax: "11", Ay: "22" },
    signature: { R8x: "1", R8y: "2", S: "3" },
    nullifierHash: "77",
  };
  const input = buildCircuitInput(cred, { currentDateInt: 20260601, currentYY: 26, minAge: 18 });
  expect(input.nik).toHaveLength(16);
  expect(input.nik[0]).toBe("3");
  expect(input.Ax).toBe("11");
  expect(input.minAge).toBe("18");
  expect(input).toHaveProperty("nullifierHash");
});
