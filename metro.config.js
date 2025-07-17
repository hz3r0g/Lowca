// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  // Pass the path to your tailwind.config.js file.
  // This is not required in NativeWind v4, but is supported for v2.
  // input: './tailwind.config.js'

  // Pass the path to your app's global CSS file.
  // This is not required in NativeWind v4, but is supported for v2.
  input: "./global.css",

  // Enable this to have Tailwind classes automatically generated.
  // This is not required in NativeWind v4, but is supported for v2.
  // "inlineRem": 16
}); 