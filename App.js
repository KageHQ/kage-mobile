import React, { useEffect, useState, Suspense } from "react";
import { SafeAreaView, Text } from "react-native";
import OnboardScreen from "./src/screens/OnboardScreen";
import { hasCredential } from "./src/credentialStore";

// Lazy so snarkjs (heavy, Node-builtin-dependent) only loads when we actually
// prove — not at app startup, which would blank the Onboard screen too.
const ProveScreen = React.lazy(() => import("./src/screens/ProveScreen"));

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  useEffect(() => {
    hasCredential()
      .then(setOnboarded)
      .catch(() => setOnboarded(false));
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {onboarded ? (
        <Suspense fallback={<Text style={{ padding: 24 }}>Loading prover…</Text>}>
          <ProveScreen />
        </Suspense>
      ) : (
        <OnboardScreen onDone={() => setOnboarded(true)} />
      )}
    </SafeAreaView>
  );
}
