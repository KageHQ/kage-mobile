export async function requestCredential(baseUrl, { nik, name }) {
  const res = await fetch(`${baseUrl}/sign`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ nik, name }),
  });
  if (!res.ok) throw new Error(`issuer error ${res.status}`);
  return res.json();
}
