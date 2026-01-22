import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginTs from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import configPrettier from 'eslint-config-prettier'; // 核心：关闭冲突规则

export default [
  // 基础配置
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    files: ['**/*.ts', '**/*.vue'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
    },
    rules: {
      // 质量规则
      'no-console': 'off',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-use-before-define': 'warn',
    },
  },
  configPrettier, // 自动禁用所有与 Prettier 冲突的 ESLint 格式规则
];
