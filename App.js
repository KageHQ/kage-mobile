import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import OnboardScreen from "./src/screens/OnboardScreen";
import ProveScreen from "./src/screens/ProveScreen";
import { hasCredential } from "./src/credentialStore";

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  useEffect(() => { hasCredential().then(setOnboarded); }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {onboarded ? <ProveScreen /> : <OnboardScreen onDone={() => setOnboarded(true)} />}
    </SafeAreaView>
  );
}
