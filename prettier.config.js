/** @type {import("prettier").Config} */
export default {
  printWidth: 100,
  arrowParens: "avoid",
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-sh"],
  overrides: [
    {
      files: "*.md",
      options: {
        tabWidth: 4,
      },
    },
  ],
};
