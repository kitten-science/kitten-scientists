module.exports = {
  root: true,
  extends: ["eslint:recommended"],

  env: {
    browser: true,
    node: true,
    es2022: true,
  },

  parser: "@babel/eslint-parser",
  parserOptions: {
    babelOptions: {
      plugins: ["@babel/plugin-syntax-import-assertions"],
    },
    requireConfigFile: false,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "jsdoc"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:jsdoc/recommended",
      ],
      parserOptions: {
        project: ["packages/*/tsconfig.json"],
      },
      rules: {
        "@typescript-eslint/no-explicit-any": [
          "error",
          {
            ignoreRestArgs: true,
          },
        ],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
        "@typescript-eslint/no-var-requires": "off",
        "jsdoc/require-param-type": "off",
        "jsdoc/require-returns": ["off", { checkGetters: false }],
        "jsdoc/require-returns-type": "off",
      },
    },
  ],
  rules: {
    "no-implied-eval": "off",
    "no-unused-expressions": "warn",
    quotes: "warn",
  },
  ignorePatterns: ["build/", "output/"],
};
