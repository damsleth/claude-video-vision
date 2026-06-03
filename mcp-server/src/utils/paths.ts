import { existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const APP_DIR = "claude-video-vision";

/** Legacy location used by versions <= 1.3.2: ~/.claude-video-vision */
export const LEGACY_DIR = join(homedir(), ".claude-video-vision");

/**
 * Pure resolver for the base data directory, separated from the environment so
 * it can be unit-tested. Precedence:
 *   1. $XDG_CONFIG_HOME/claude-video-vision — explicit XDG override
 *   2. ~/.claude-video-vision               — legacy dir, if it already exists (backward compat)
 *   3. ~/.config/claude-video-vision        — XDG-spec default
 */
export function resolveBaseDir(opts: {
  xdgConfigHome?: string;
  homeDir: string;
  legacyDir: string;
  legacyExists: boolean;
}): string {
  const xdg = opts.xdgConfigHome?.trim();
  if (xdg) return join(xdg, APP_DIR);
  if (opts.legacyExists) return opts.legacyDir;
  return join(opts.homeDir, ".config", APP_DIR);
}

/**
 * Base directory holding config.json plus the sessions/, models/ and downloads/
 * subdirectories. Honors $XDG_CONFIG_HOME and the XDG default of ~/.config,
 * while preserving any pre-existing ~/.claude-video-vision install.
 */
export function getBaseDir(): string {
  return resolveBaseDir({
    xdgConfigHome: process.env.XDG_CONFIG_HOME,
    homeDir: homedir(),
    legacyDir: LEGACY_DIR,
    legacyExists: existsSync(LEGACY_DIR),
  });
}

export const BASE_DIR = getBaseDir();
export const CONFIG_PATH = join(BASE_DIR, "config.json");
export const SESSIONS_DIR = join(BASE_DIR, "sessions");
export const MODELS_DIR = join(BASE_DIR, "models");
export const DOWNLOADS_DIR = join(BASE_DIR, "downloads");
