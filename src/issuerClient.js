// RN fetch has no default timeout, so a dropped connection hangs forever. Abort
// after a few seconds and surface a clear error instead of stalling the UI.
async function fetchJson(url, opts = {}, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } catch (e) {
    if (e.name === "AbortError")
      throw new Error(`timeout: issuer ${url} unreachable (${timeoutMs}ms)`);
    throw e;
  } finally {
    clearTimeout(t);
  }
}

export async function requestCredential(baseUrl, { nik, name }) {
  const res = await fetchJson(`${baseUrl}/sign`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ nik, name }),
  });
  if (!res.ok) throw new Error(`issuer error ${res.status}`);
  return res.json();
}
