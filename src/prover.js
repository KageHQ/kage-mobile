// snarkjs.fullProve is too heavy for Expo Go / Hermes, so proving runs on the
// local prover service (the issuer's /prove endpoint). The phone posts its
// stored credential, gets a real Groth16 proof back, and encodes the QR locally.
const { encodeProofPayload } = require("@kagehq/shared/src/proof-codec");

// cred: the credential stored on-device. request: { currentDateInt, currentYY, minAge }.
// proverUrl: base URL of the prover service (the issuer).
async function generateProofPayload(cred, request, proverUrl) {
  const res = await fetch(`${proverUrl}/prove`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ cred, request }),
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json()).error || "";
    } catch {}
    throw new Error(`prover error ${res.status}${detail ? `: ${detail}` : ""}`);
  }
  const { proof, publicSignals } = await res.json();
  return encodeProofPayload(proof, publicSignals);
}

module.exports = { generateProofPayload };
