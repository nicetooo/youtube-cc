import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import sveltePlugin from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.svelte"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        extraFileExtensions: [".svelte"],
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
        chrome: "readonly",
        // WXT globals
        defineBackground: "readonly",
        defineContentScript: "readonly",
        createIntegratedUi: "readonly",
        // Svelte globals
        onMount: "readonly",
        onDestroy: "readonly",
        // Browser/Node globals
        NodeJS: "readonly",
        HTMLCollectionOf: "readonly",
        browser: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": [
        "warn",
        {
          "ts-ignore": "allow-with-description",
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
      },
    },
    plugins: {
      svelte: sveltePlugin,
    },
    rules: {
      ...sveltePlugin.configs.recommended.rules,
      "svelte/no-at-html-tags": "warn",
    },
  },
  {
    ignores: ["node_modules", ".output", ".wxt", "dist", "*.config.js"],
  },
];

