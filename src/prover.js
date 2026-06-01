const { groth16 } = require("snarkjs");
const { encodeProofPayload } = require("@proven-kyc/shared");

// Pure: map a stored credential + verification request into circuit inputs.
function buildCircuitInput(cred, { currentDateInt, currentYY, minAge }) {
  if (!/^\d{16}$/.test(cred.nik)) throw new Error("bad NIK in credential");
  return {
    nik: cred.nik.split(""),
    name: String(cred.name),
    secret: String(cred.secret),
    Ax: cred.pubKey.Ax,
    Ay: cred.pubKey.Ay,
    R8x: cred.signature.R8x,
    R8y: cred.signature.R8y,
    S: cred.signature.S,
    currentDateInt: String(currentDateInt),
    currentYY: String(currentYY),
    minAge: String(minAge),
    nullifierHash: cred.nullifierHash,
  };
}

// Generates the proof and returns the QR payload string.
// wasmUri/zkeyUri are local asset URIs bundled in the app.
async function generateProofPayload(cred, request, wasmUri, zkeyUri) {
  const input = buildCircuitInput(cred, request);
  const { proof, publicSignals } = await groth16.fullProve(input, wasmUri, zkeyUri);
  return encodeProofPayload(proof, publicSignals);
}

module.exports = { buildCircuitInput, generateProofPayload };
