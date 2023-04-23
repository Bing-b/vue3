module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:vue/essential",
    "airbnb-base",
  ],
  parserOptions: {
    ecmaVersion: 12,
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint", "prettier"],
  rules: {
    "no-console": "off", // 关闭console对象方法校验
    "import/no-unresolved": "off", // 关闭
    "import/no-absolute-path": "off", // 关闭绝对路径校验
    "import/extensions": "off", // 导入文件扩展名
    "max-len": ["error", { code: 200 }],
    "vue/no-v-model-argument": "off", // vue代码v-model参数校验
    "vue/multi-word-component-names": "off", // vue组件名校验
    "no-undef": "off", // 关闭未定义校验,ts校验会检测ForStatement
    "no-restricted-syntax": ["off", { selector: "ForStatement" }],
    "no-unused-vars": "off", // 解决ts中全局类型声明错误的校验
    "@typescript-eslint/no-unused-vars": ["error"], // 解决ts中全局类型声明报错错误的校验
    "import/prefer-default-export": "off", // 允许一个ts、js只导出单个方法
    "no-use-before-define": "warn", // 允许先使用，后声明
    "no-param-reassign": "off", // 允许对对象进行重新赋值
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ], // 可导入dev依赖
    "consistent-return": "off", // 关闭函数必须返回一个值
    "guard-for-in": "off", // 关闭for循环需要验证原型上是否存在该属性
  },
};
