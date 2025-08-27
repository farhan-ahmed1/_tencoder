module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off", // Using app directory, not pages
  },
  ignorePatterns: ["node_modules/", "dist/", ".next/", "coverage/"],
};
