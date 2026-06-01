import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import OnboardScreen from "./src/screens/OnboardScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import SplashScreen from "./src/screens/SplashScreen";
import MainShell from "./src/screens/MainShell";
import { hasCredential, clearCredential } from "./src/credentialStore";
import { color } from "./src/theme";

export default function App() {
  // onboarded: null until the keystore check resolves, then boolean.
  const [onboarded, setOnboarded] = useState(null);
  const [splashFinished, setSplashFinished] = useState(false);
  // started: user tapped through Welcome into onboarding (first-run only).
  const [started, setStarted] = useState(false);

  useEffect(() => {
    hasCredential()
      .then(setOnboarded)
      .catch(() => setOnboarded(false));
  }, []);

  async function reset() {
    await clearCredential();
    setOnboarded(false);
    // Skip Welcome on reset — the user knows the app; go straight to NIK entry.
    setStarted(true);
  }

  // Hold the splash until its animation ends AND the credential check resolves.
  const booting = !splashFinished || onboarded === null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }}>
      {booting ? (
        <SplashScreen onFinish={() => setSplashFinished(true)} />
      ) : onboarded ? (
        <MainShell onReset={reset} />
      ) : started ? (
        <OnboardScreen onDone={() => setOnboarded(true)} />
      ) : (
        <WelcomeScreen onStart={() => setStarted(true)} />
      )}
    </SafeAreaView>
  );
}
