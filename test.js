const { ar } = require('element-plus/es/locale');
const { EmitFlags } = require('typescript');

{
  const arr = [
    { classId: '1', name: '张三', age: 16 },
    { classId: '1', name: '李四', age: 15 },
    { classId: '2', name: '王五', age: 16 },
    { classId: '3', name: '赵六', age: 15 },
    { classId: '2', name: '孔七', age: 16 },
  ];

  const key = 'classId';

  const groupById = arr.reduce((acc, cur) => {
    if (!acc[cur[key]]) {
      acc[cur[key]] = [];
    }
    acc[cur[key]].push(cur);
    return acc;
  }, {});

  console.log(groupById);
}

{
  const arr = [1, 2, 3];
  const d = arr.reduce((acc, cur) => ((acc = acc + 1), acc + cur));
  console.log(d);
}

{
  const a = [1, 2, 3].filter((i) => i > 2);
  console.log(a);
}

{
  const arr = [
    {
      a: '2',
      b: 'c',
    },
    {
      a: '1',
      b: 'cd',
    },
    {
      a: '2',
      b: 'd',
    },
  ];

  const arrByA = arr.reduce((acc, cur) => {});
}
