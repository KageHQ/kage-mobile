// Metro (the RN bundler) needs babel-preset-expo to transform JSX / React Native.
// Jest runs in a plain Node env and transforms only plain-JS modules, so it keeps
// the lighter preset-env + preset-react. NODE_ENV=test (set by Jest) selects it.
module.exports = function (api) {
  const isTest = api.env("test");
  api.cache.using(() => process.env.NODE_ENV);

  if (isTest) {
    return {
      presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/preset-react",
      ],
    };
  }

  return { presets: ["babel-preset-expo"] };
};
