/**
 * Public origin of the current request, from the proxy's forwarded headers.
 * Behind Railway the internal request URL is localhost:PORT, so redirects and absolute links must not use it.
 */
export function originFromHeaders(h: Headers): string {
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const isLocal = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  const proto = h.get("x-forwarded-proto")?.split(",")[0].trim() ?? (isLocal ? "http" : "https");
  return `${proto}://${host}`;
}
