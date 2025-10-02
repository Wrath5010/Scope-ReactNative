// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Ensure tslib is resolved correctly on web and native
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  tslib: "tslib", // points to node_modules/tslib
};

module.exports = config;
