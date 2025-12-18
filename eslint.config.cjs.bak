/**
 * ESLint Flat Config (CJS) — Next.js 16 + ESLint 9
 * 
 * Manual flat config construction to work around:
 * - @next/eslint-plugin-next v16.0.10 does NOT expose flatConfig.coreWebVitals
 * - Correct export is configs['core-web-vitals'] but contains circular plugin refs
 * 
 * Solution: Manually register plugins and apply Next.js + React Hooks rules
 */

const nextPlugin = require("@next/eslint-plugin-next");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const tsParser = require("@typescript-eslint/parser");

// Extract rule definitions from Next.js plugin
// These are the same rules used in configs['core-web-vitals']
const nextRecommendedRules = {
  '@next/next/google-font-display': 'warn',
  '@next/next/google-font-preconnect': 'warn',
  '@next/next/next-script-for-ga': 'warn',
  '@next/next/no-async-client-component': 'warn',
  '@next/next/no-before-interactive-script-outside-document': 'warn',
  '@next/next/no-css-tags': 'warn',
  '@next/next/no-head-element': 'warn',
  '@next/next/no-html-link-for-pages': 'warn',
  '@next/next/no-img-element': 'warn',
  '@next/next/no-page-custom-font': 'warn',
  '@next/next/no-styled-jsx-in-document': 'warn',
  '@next/next/no-sync-scripts': 'warn',
  '@next/next/no-title-in-document-head': 'warn',
  '@next/next/no-typos': 'warn',
  '@next/next/no-unwanted-polyfillio': 'warn',
  '@next/next/inline-script-id': 'error',
  '@next/next/no-assign-module-variable': 'error',
  '@next/next/no-document-import-in-page': 'error',
  '@next/next/no-duplicate-head': 'error',
  '@next/next/no-head-import-in-document': 'error',
  '@next/next/no-script-component-in-head': 'error',
};

const nextCoreWebVitalsRules = {
  '@next/next/no-html-link-for-pages': 'error',
  '@next/next/no-sync-scripts': 'error',
};

module.exports = [
  // Ignore build + deps + archives
  {
    ignores: [".next/**", "node_modules/**", "_archive/**"],
  },

  // Main config: Next.js + React Hooks
  {
    name: "botexcel/next-core-web-vitals",
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      // All Next.js rules (recommended + core-web-vitals)
      ...nextRecommendedRules,
      ...nextCoreWebVitalsRules,

      // React Hooks rules (standard for Next.js apps)
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Server route handlers: React Hooks rules do not apply
  {
    files: ["app/api/**/*.{ts,tsx}", "**/route.{ts,tsx}"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];
