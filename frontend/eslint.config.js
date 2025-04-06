import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      // ecmaVersion here is redundant because it's covered in parserOptions
      globals: {
        ...globals.browser,
        ...globals.node, // <--- Add this line
        // 'global' is part of globals.node, so you might not need it explicitly
        // global: "readonly",
        // Test globals (keep these if you use Vitest/Jest etc.)
        vi: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
      parserOptions: {
        ecmaVersion: "latest", // Use 'latest' or a specific year like 2022
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: "detect" } }, // 'detect' is usually preferred
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules, // If using React 17+ new JSX transform
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // You might want to add prop-types validation if not using TypeScript
      // "react/prop-types": "warn",
    },
  },
  eslintPluginPrettierRecommended, // Ensures Prettier rules run last and override others
];
