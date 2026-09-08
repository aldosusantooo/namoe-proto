import { describe, expect, it } from "vitest";
import { checkUpload, UPLOAD_MAX_BYTES, uploadFileName } from "../upload";

describe("checkUpload", () => {
  it("accepts jpeg, png, webp and gif under 5 MB", () => {
    expect(checkUpload("image/jpeg", 1000)).toEqual({ ok: true, ext: "jpg" });
    expect(checkUpload("image/PNG", 1000)).toEqual({ ok: true, ext: "png" });
    expect(checkUpload("image/webp", UPLOAD_MAX_BYTES)).toEqual({ ok: true, ext: "webp" });
  });
  it("rejects other types and oversize files", () => {
    expect(checkUpload("application/pdf", 1000)).toEqual({ ok: false, error: "fileType" });
    expect(checkUpload("image/svg+xml", 1000)).toEqual({ ok: false, error: "fileType" });
    expect(checkUpload("image/jpeg", UPLOAD_MAX_BYTES + 1)).toEqual({ ok: false, error: "fileTooLarge" });
    expect(checkUpload("image/jpeg", 0)).toEqual({ ok: false, error: "fileTooLarge" });
  });
});

describe("uploadFileName", () => {
  it("never uses the client name, only random plus the checked extension", () => {
    expect(uploadFileName("jpg", () => "abc123")).toBe("abc123.jpg");
    expect(uploadFileName("png")).toMatch(/^[0-9a-f]{16}\.png$/);
  });
});
