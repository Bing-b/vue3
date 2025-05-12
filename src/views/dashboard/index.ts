export const GrowCardList = [
  {
    label: 'GitLab访问',
    num: 1234,
    icon: 'gitlab',
  },
  {
    label: 'GitHub 访问',
    num: 1111,
    icon: 'github',
  },
  {
    label: '今日访问',
    num: 2222,
    icon: 'now',
  },
  {
    label: '昨日访问',
    num: 3333,
    icon: 'yesterday',
  },
];

const motionList = [
  {
    initial: {
      opacity: 0,
      y: 100,
    },
    enter: {
      opacity: 1,
      y: 0,
      transtion: {
        delay: 200,
      },
    },
  },
];
