/* eslint-disable no-irregular-whitespace */
{
  const arr = [1, 2, 3, 4, 3, 2, 1];
  const countMap = new Map();

  arr.forEach(item => {
    countMap.set(item, (countMap.get(item) || 0) + 1);
  });

  console.log(countMap);
  console.log(Array.from(countMap));

  const str = 'hello word';

  const countStrMap = new Map();
  for (const i of str) {
    countStrMap.set(i, (countStrMap.get(i) || 0) + 1);
  }
  // console.log(countStrMap);

  const data = [{ a: 1, b: 'tom' }, { a: 2, b: 'anno' }, { a: 3, b: 'mark' }];

  const dataMap = new Map(data.map(item => [item.a, item]));
  const result = data.filter(d => dataMap.has(d.a) && d.b === 'anno');
  // console.log(result);
}
// 根据key分组数据
function groupArrayByKey (arr = [], key) {
  return arr.reduce((t, v) => (!t[v[key]] && (t[v[key]] = []), t[v[key]].push(v), t), {});
}

{
  const arr = [
    { classId: '1', name: '张三', age: 16 },
    { classId: '1', name: '李四', age: 15 },
    { classId: '2', name: '王五', age: 16 },
    { classId: '3', name: '赵六', age: 15 },
    { classId: '2', name: '孔七', age: 16 }
  ];

  // console.log(groupArrayByKey(arr, 'classId'));
}

{
  const arr = [
    {
      id: 1,
      name: 'wang'
    },
    {
      id: 2,
      name: 'zhang'
    },
    {
      id: 1,
      name: 'cheng'
    }
  ];
  const uniqueObj = (arr, fn) => arr.reduce((acc, item) => { if (!acc.some(x => fn(item, x))) acc.push(item); return acc; }, []);

  const result = uniqueObj(arr, (a, b) => a.id === b.id);
  console.log(result);
}

{
  console.log(1 % 2);
}
