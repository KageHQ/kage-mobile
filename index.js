// Explicit entry point. Expo's default `expo/AppEntry` does require("../../App"),
// which only resolves under a flat node_modules; pnpm nests packages, so we
// register the root component ourselves.
// Buffer polyfill — proof-codec (base64) and web3/anchor expect a global Buffer,
// which React Native / Hermes does not provide.
import { Buffer } from "buffer";
global.Buffer = global.Buffer || Buffer;

import { registerRootComponent } from "expo";
import App from "./App";

registerRootComponent(App);
