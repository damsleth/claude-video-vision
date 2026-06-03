import { describe, it, expect } from "vitest";
import { join } from "path";
import { resolveBaseDir } from "../src/utils/paths.js";

describe("resolveBaseDir", () => {
  const homeDir = "/home/tester";
  const legacyDir = join(homeDir, ".claude-video-vision");

  it("honors XDG_CONFIG_HOME when set", () => {
    expect(
      resolveBaseDir({ xdgConfigHome: "/custom/xdg", homeDir, legacyDir, legacyExists: false }),
    ).toBe(join("/custom/xdg", "claude-video-vision"));
  });

  it("XDG_CONFIG_HOME takes precedence even when a legacy dir exists", () => {
    expect(
      resolveBaseDir({ xdgConfigHome: "/custom/xdg", homeDir, legacyDir, legacyExists: true }),
    ).toBe(join("/custom/xdg", "claude-video-vision"));
  });

  it("falls back to the legacy dir when it exists and no XDG override is set", () => {
    expect(
      resolveBaseDir({ xdgConfigHome: undefined, homeDir, legacyDir, legacyExists: true }),
    ).toBe(legacyDir);
  });

  it("defaults to ~/.config/claude-video-vision for fresh installs", () => {
    expect(
      resolveBaseDir({ xdgConfigHome: undefined, homeDir, legacyDir, legacyExists: false }),
    ).toBe(join(homeDir, ".config", "claude-video-vision"));
  });

  it("ignores an empty or whitespace-only XDG_CONFIG_HOME", () => {
    expect(
      resolveBaseDir({ xdgConfigHome: "   ", homeDir, legacyDir, legacyExists: false }),
    ).toBe(join(homeDir, ".config", "claude-video-vision"));
  });
});
