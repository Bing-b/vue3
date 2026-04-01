import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginTs from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';
import configPrettier from 'eslint-config-prettier';

const sharedRules = {
  'no-console': 'off',
  'no-undef': 'off',
  'no-unused-vars': 'off',
  'vue/multi-word-component-names': 'off',
  '@typescript-eslint/no-unused-vars': ['error'],
  '@typescript-eslint/explicit-function-return-type': 'off',
  'no-use-before-define': 'warn',
};

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
    },
    rules: sharedRules,
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
    },
    rules: sharedRules,
  },
  configPrettier,
];
