import { describe, expect, it } from "vitest";
import { speakerHandle, speakerLine, speakerRole } from "../speaker";

const theo = {
  name: "Theo Derick",
  handle: "byteproject",
  bio: "Theo Derick adalah founder byte.project dan penyelenggara Namoe Market. Ia merancang pasar keluarga ini.",
};

describe("speaker lines", () => {
  it("uses the handle, falling back to the name", () => {
    expect(speakerHandle(theo)).toBe("byteproject");
    expect(speakerHandle({ name: "Tamu" })).toBe("Tamu");
  });
  it("takes the role from the first sentence of the bio without the name and 'adalah'", () => {
    expect(speakerRole(theo)).toBe("founder byte.project dan penyelenggara Namoe Market");
  });
  it("falls back to the handle when the bio is empty", () => {
    expect(speakerRole({ name: "Tamu", handle: "tamu", bio: "" })).toBe("tamu");
    expect(speakerLine({ name: "Tamu", handle: "tamu", bio: null })).toBe("tamu");
  });
  it("joins handle and role with a comma", () => {
    expect(speakerLine(theo)).toBe("byteproject, founder byte.project dan penyelenggara Namoe Market");
  });
});
