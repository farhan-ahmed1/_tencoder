module.exports = {
  root: true,
  extends: ["eslint:recommended", "prettier"],
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    // Basic rules for root config
  },
  ignorePatterns: ["node_modules/", "dist/", ".next/", "coverage/"],
};
