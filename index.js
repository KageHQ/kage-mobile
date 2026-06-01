// Explicit entry point. Expo's default `expo/AppEntry` does require("../../App"),
// which only resolves under a flat node_modules; pnpm nests packages, so we
// register the root component ourselves.
import { registerRootComponent } from "expo";
import App from "./App";

registerRootComponent(App);
