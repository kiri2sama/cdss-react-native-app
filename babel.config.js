module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          extensions: [
            ".ios.ts",
            ".android.ts",
            ".ts",
            ".ios.tsx",
            ".android.tsx",
            ".tsx",
            ".jsx",
            ".js",
            ".json",
          ],
          alias: {
            "@": "./src",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@contexts": "./src/contexts",
            "@types": "./src/types",
            "@services": "./src/services",
            "@data": "./src/data",
            "@styles": "./src/styles",
          },
        },
      ],
      "@babel/plugin-proposal-export-namespace-from",
    ],
  };
};