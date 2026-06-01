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

// Publishes an encoded payload to the issuer's relay; returns a short code the
// verifier types in to fetch it. Avoids screen-to-camera QR scanning.
async function publishPayload(payload, proverUrl) {
  const res = await fetch(`${proverUrl}/relay`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ payload }),
  });
  if (!res.ok) throw new Error(`relay error ${res.status}`);
  const { code } = await res.json();
  return code;
}

module.exports = { generateProofPayload, publishPayload };
