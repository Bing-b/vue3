ace.define('ace/mode/mylang', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/custom_highlight_rules'], (require, exports, module) => {
  const oop = require('ace/lib/oop');
  const TextMode = require('ace/mode/text').Mode;
  const { MyLangHighlightRules } = require('ace/mode/mylang_highlight_rules');
  const { Tokenizer } = require('ace/tokenizer');

  const Mode = function () {
    this.HighlightRules = MyLangHighlightRules;
    this.$tokenizer = new Tokenizer(new MyLangHighlightRules().getRules());
  };

  oop.inherits(Mode, TextMode);

  (function () {
    // Load stylesheet  加载css 样式设置，以便控制自定义语言关键词高亮颜色
    const dom = require('ace/lib/dom');
    dom.importCssString(exports.cssText, exports.cssClass);
  }).call(Mode.prototype);

  (function () {
    // 添加代码提示
    this.completer = {
      getCompletions(editor, session, pos, prefix, callback) {
        const wordList = [
          'hello',
          'world',
          'AceEditor',
          'hello world this is AceEditor',
        ];
        callback(
          null,
          wordList.map((word) => ({
            caption: word,
            value: word,
            meta: 'mylang', // 自定义语言标识
          })),
        );
      },
    };
  }.call(Mode.prototype));

  exports.Mode = Mode;
});

ace.define(
  'ace/mode/mylang_highlight_rules',
  ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'],
  (require, exports, module) => {
    const oop = require('ace/lib/oop');
    const { TextHighlightRules } = require('ace/mode/text_highlight_rules');

    // 具体来说，Mode 通常是一个对象，用于定义 Ace Editor 如何处理特定语言的代码。它必须包括一组规则（Rules），
    // 每个规则描述了如何处理输入文本中的单个字符序列。Ace Editor 中的规则是由 Tokenizer 对象处理的.
    // Tokenizer 是 Ace Editor 内置的一种基于正则表达式的解析器，用于将输入文本转换为标记（Token）流。
    // 标记是 Ace Editor 中的基本元素，它们由不同类型的 token 组成，例如：keyword、comment、string 等等

    const MyLangHighlightRules = function () {
      // 定义高亮规则
      const keywordList = 'let|const|function|world'; // 高亮关键词
      this.$rules = {
        start: [
          {
            token: 'keyword',
            regex: `\\b(?:${keywordList})\\b`,
          },
          {
            token: 'string',
            regex: '".*?"',
          },
          {
            token: 'constant',
            regex: /\b(true|false|null)\b/,
          },
          {
            token: 'comment',
            regex: /\/\/.*$/,
          },
          {
            token: 'comment',
            start: '/\\*',
            end: '\\*/',
          },
          {
            token: 'mylang',
            regex: '\\b(?:hello|world|AceEditor)\\b',
          },
        ],
      };
    };

    oop.inherits(MyLangHighlightRules, TextHighlightRules);

    exports.MyLangHighlightRules = MyLangHighlightRules;
  },
);
