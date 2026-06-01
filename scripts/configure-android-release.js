#!/usr/bin/env node
// Post-`expo prebuild` patch for the Android release build.
//
// `expo prebuild` regenerates android/ from scratch with debug signing and no
// ABI splits, so this runs after every prebuild (CI and local) to inject:
//   1. a `release` signingConfig that reads the keystore + passwords from env
//      (so secrets never touch the repo), and points the release buildType at it
//   2. per-ABI APK splits (arm64-v8a / armeabi-v7a / x86_64, no universal) to
//      cut the ~140MB fat APK down to ~40MB per arch
//
// Minify + resource shrink are NOT patched here — they're controlled by the
// gradle properties android.enableProguardInReleaseBuilds /
// android.enableShrinkResourcesInReleaseBuilds, set at build time.
//
// Idempotent: re-running on an already-patched file is a no-op.
const fs = require("fs");
const path = require("path");

const gradlePath = path.join(__dirname, "..", "android", "app", "build.gradle");
if (!fs.existsSync(gradlePath)) {
  console.error(`[configure-android-release] not found: ${gradlePath}\n` +
    "Run `expo prebuild -p android` first.");
  process.exit(1);
}

let g = fs.readFileSync(gradlePath, "utf8");

if (g.includes("signingConfigs.release")) {
  console.log("[configure-android-release] already patched — skipping.");
  process.exit(0);
}

// 1a. Add a `release` signingConfig right after the `signingConfigs {` opener.
const releaseSigning = `signingConfigs {
        release {
            storeFile file(System.getenv("ANDROID_KEYSTORE_FILE") ?: "release.keystore")
            storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
            keyAlias System.getenv("ANDROID_KEY_ALIAS")
            keyPassword System.getenv("ANDROID_KEY_PASSWORD")
        }`;
if (!/signingConfigs\s*\{/.test(g)) throw new Error("signingConfigs block not found");
g = g.replace(/signingConfigs\s*\{/, releaseSigning);

// 1b. Point the release buildType at the release signingConfig. The release
// block's signingConfig line is the one immediately followed by shrinkResources
// (the debug block's is followed by `}`), so this targets release only.
const beforeReleaseSwap = g;
g = g.replace(
  /signingConfig signingConfigs\.debug(\s*\n\s*shrinkResources)/,
  "signingConfig signingConfigs.release$1"
);
if (g === beforeReleaseSwap) {
  throw new Error("could not find release buildType signingConfig line to swap");
}

// 2. Per-ABI splits — insert a splits block just before `signingConfigs {`.
const splitsBlock = `splits {
        abi {
            enable true
            reset()
            include "arm64-v8a", "armeabi-v7a", "x86_64"
            universalApk false
        }
    }

    signingConfigs {`;
g = g.replace(/signingConfigs\s*\{/, splitsBlock);

fs.writeFileSync(gradlePath, g);
console.log("[configure-android-release] patched: release signing + ABI splits.");
