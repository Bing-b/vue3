module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'standard-with-typescript',
    'prettier', // 放在最后，用于关闭所有与格式相关的eslint 配置
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['vue'],
  rules: {
    // --- 代码质量规则 ---
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    'vue/multi-word-component-names': 'off',
  },
};
