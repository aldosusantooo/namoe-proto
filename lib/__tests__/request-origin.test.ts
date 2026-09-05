import { describe, expect, it } from "vitest";
import { originFromHeaders } from "../request-origin";

describe("originFromHeaders", () => {
  it("prefers the forwarded host and proto", () => {
    const h = new Headers({ host: "localhost:8080", "x-forwarded-host": "namoe.example.app", "x-forwarded-proto": "https" });
    expect(originFromHeaders(h)).toBe("https://namoe.example.app");
  });
  it("falls back to http for a bare localhost host", () => {
    expect(originFromHeaders(new Headers({ host: "localhost:3100" }))).toBe("http://localhost:3100");
  });
  it("assumes https for any other host without a forwarded proto", () => {
    expect(originFromHeaders(new Headers({ host: "namoe.example.app" }))).toBe("https://namoe.example.app");
  });
});
