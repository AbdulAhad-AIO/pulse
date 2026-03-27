import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  extends: ['next/core-web-vitals'],
  rules: {
    '@next/next/no-img-element': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};

module.exports = config;
