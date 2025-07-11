module.exports = {
  // type 类型（定义之后，可通过上下键选择）
  types: [
    { value: 'feat', name: '✨ feat:       新功能' },
    { value: 'fix', name: '🐛 fix:        修复' },
    { value: 'docs', name: '📝 docs:      文档变更' },
    { value: 'style', name: '💄 style:     代码格式(不影响代码运行的变动)' },
    { value: 'refactor', name: '♻️  refactor:    重构 (既不增加feature, 也不是修复bug)' },
    { value: 'perf', name: '⚡️ perf:      性能优化' },
    {
      value: 'build',
      name: '🚀 build:      构建流程、外部依赖变更（如升级 npm 包、修改 vite 配置等）',
    },
    { value: 'revert', name: '⏪ revert:     回退' },
  ],

  // scope 类型（定义之后，可通过上下键选择）
  scopes: [
    ['components', '组件相关'],
    ['styles', '样式相关'],
    ['deps', '项目依赖'],
    ['other', '其他修改'],
    // 如果选择 custom，后面会让你再输入一个自定义的 scope。也可以不设置此项，把后面的 allowCustomScopes 设置为 true
    //  ['custom', '以上都不是？我要自定义'],
  ].map(([value, description]) => {
    return {
      value,
      name: `${value.padEnd(30)} (${description})`,
    };
  }),

  // 交互提示信息
  messages: {
    type: '请选择提交的类型：',
    customScope: '情输入修改的范围(可选)',
    subject: '请简要描述提交(必填)',
    body: '请输入详细描述(可选)',
    footer: '请输入要关闭的issus(可选)',
    confirmCommit: '确认要使用以上信息提交？(y/n)',
  },

  // 设置只有 type 选择了 feat 或 fix，才询问 breaking message
  allowBreakingChanges: ['feat', 'fix'],

  // 跳过要询问的步骤
  // skipQuestions: ['body', 'footer'],

  // subject 限制长度
  subjectLimit: 100,
  breaklineChar: '|', // 支持 body 和 footer
};
