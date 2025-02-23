import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  prettierConfig,
  {
    ignores: [
      "_site/",
      ".git/",
      ".github/",
      ".yarn/",
      "docs/",
      "lib/",
      "node_modules/",

      "packages/documentation/.venv/",
      "packages/documentation/public/",

      "packages/*/build/",
      "packages/*/coverage/",
      "packages/*/output/",
      "packages/*/vite.config.*",

      "*.config.*",
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.web,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      parserOptions: {
        sourceType: "commonjs",
      },
    },
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      parserOptions: {
        sourceType: "module",
      },
    },
  },
  {
    files: ["**/*.cts", "**/*.mts", "**/*.ts"],
    extends: tseslint.configs.strictTypeChecked,
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        EXPERIMENTAL_useProjectService: true,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
      "@typescript-eslint/no-explicit-any": [
        "error",
        {
          ignoreRestArgs: true,
        },
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowBoolean: true,
          allowNumber: true,
        },
      ],
    },
  },
  {
    rules: {
      "consistent-return": "error",
      eqeqeq: "error",
      "no-console": "off",
      "no-else-return": "error",
      "no-unused-expressions": "warn",
      "no-use-before-define": "off",
      "prefer-const": "error",
      strict: ["error", "global"],
    },
  },
);
