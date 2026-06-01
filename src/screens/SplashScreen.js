import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  ActivityIndicator,
  AccessibilityInfo,
  StyleSheet,
} from "react-native";
import { color, space } from "../theme";
import { Logo } from "../components/ui";

// Launch screen shown while hasCredential() resolves. A calm, staggered reveal:
// a soft accent ring breathes out behind the mark, the logo springs in, then the
// wordmark and tagline rise in sequence. The mark then STAYS visible — App
// unmounts it once booting is done. It must not fade itself out: if the
// credential check is still pending when the animation ends, a faded-to-zero
// splash would leave a blank screen. onFinish fires on a guaranteed timer (min
// display time), independent of the animation callbacks.
const MIN_VISIBLE_MS = 6000;

export default function SplashScreen({ onFinish }) {
  // One value per animated element so they can be staggered independently.
  const ringScale = useRef(new Animated.Value(0.6)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const wordOpacity = useRef(new Animated.Value(0)).current;
  const wordY = useRef(new Animated.Value(12)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const tagY = useRef(new Animated.Value(10)).current;
  const spinnerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;

    // Snap everything to its resting state — no motion, just a quick fade in.
    function settleReduced() {
      ringOpacity.setValue(0);
      logoScale.setValue(1);
      wordY.setValue(0);
      tagY.setValue(0);
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
      Animated.timing(wordOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
      Animated.timing(tagOpacity, {
        toValue: 1,
        duration: 220,
        delay: 80,
        useNativeDriver: true,
      }).start();
      Animated.timing(spinnerOpacity, {
        toValue: 1,
        duration: 220,
        delay: 160,
        useNativeDriver: true,
      }).start();
    }

    function playFull() {
      Animated.sequence([
        // Logo springs in while a soft ring breathes out behind it.
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 420,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.spring(logoScale, {
            toValue: 1,
            friction: 6,
            tension: 70,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(ringOpacity, {
              toValue: 0.5,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.parallel([
              Animated.timing(ringScale, {
                toValue: 1.5,
                duration: 900,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(ringOpacity, {
                toValue: 0,
                duration: 900,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]),
        // Wordmark rises in.
        Animated.parallel([
          Animated.timing(wordOpacity, {
            toValue: 1,
            duration: 360,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(wordY, {
            toValue: 0,
            duration: 420,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        // Tagline follows.
        Animated.parallel([
          Animated.timing(tagOpacity, {
            toValue: 1,
            duration: 320,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(tagY, {
            toValue: 0,
            duration: 380,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        // Boot spinner fades in last — signals the app is getting ready.
        Animated.timing(spinnerOpacity, {
          toValue: 1,
          duration: 300,
          delay: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }

    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduce) => {
        if (cancelled) return;
        if (reduce) settleReduced();
        else playFull();
      })
      .catch(() => {
        // AccessibilityInfo can reject on some platforms; just show the mark.
        logoOpacity.setValue(1);
        logoScale.setValue(1);
        wordOpacity.setValue(1);
        wordY.setValue(0);
        tagOpacity.setValue(1);
        tagY.setValue(0);
        spinnerOpacity.setValue(1);
      });

    const t = setTimeout(() => {
      if (!cancelled) onFinish?.();
    }, MIN_VISIBLE_MS);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  return (
    <View style={s.root}>
      <View style={s.markWrap}>
        {/* Soft accent ring that breathes out once behind the mark. */}
        <Animated.View
          pointerEvents="none"
          style={[
            s.ring,
            { opacity: ringOpacity, transform: [{ scale: ringScale }] },
          ]}
        />
        <Animated.View
          style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}
        >
          <Logo size={88} />
        </Animated.View>
      </View>

      <Animated.Text
        style={[s.word, { opacity: wordOpacity, transform: [{ translateY: wordY }] }]}
      >
        Kage
      </Animated.Text>
      <Animated.Text
        style={[s.tag, { opacity: tagOpacity, transform: [{ translateY: tagY }] }]}
      >
        Bukti usia, privasi tetap milik Anda.
      </Animated.Text>

      <Animated.View style={[s.spinner, { opacity: spinnerOpacity }]}>
        <ActivityIndicator color={color.accent} />
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.paper,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space[6],
  },
  markWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space[4],
  },
  ring: {
    position: "absolute",
    width: 132,
    height: 132,
    borderRadius: 999,
    backgroundColor: color.accentSoft,
  },
  word: {
    fontSize: 34,
    fontWeight: "800",
    color: color.ink,
    letterSpacing: 0.2,
  },
  tag: {
    marginTop: space[2],
    fontSize: 14,
    color: color.inkMuted,
    textAlign: "center",
  },
  spinner: { marginTop: space[8] },
});
