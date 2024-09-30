{
  const arr = [1, 23, 3, 45, 6, 4, 3];
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  console.log(max, min);
}
{
  const arr = [1, 2, 3, 4];
  const all = arr.reduce((acc, cur) => acc + cur, 0);
  console.log(all);
}
{
  const str = 'hello';
  const revsersedStr = str.split('').reverse().join('');
  console.log(revsersedStr);
}
