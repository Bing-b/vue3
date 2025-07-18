<template>
  <div class="bg-black">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { camelize, onMounted } from 'vue';

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

// 初始化函数，用于获取canvas元素并返回相关信息
const init = (eleid) => {
  let canvas = document.getElementById(eleid) as HTMLCanvasElement;
  // 获取2d绘图上下文，这里d是小写的
  const c = canvas.getContext('2d');
  // 设置canvas 宽高
  const w = (canvas.width = window.innerWidth);
  const h = (canvas.height = window.innerHeight);
  // 设置填充样式为半透明读
  c.fillStyle = 'rgba(30,30,30,1)';
  c.fillRect(0, 0, w, h);
  return {
    c,
    canvas,
  };
};

const create = () => {
  let c = init('canvas').c,
    canvas = init('canvas').canvas,
    w = (canvas.width = window.innerWidth),
    h = (canvas.height = window.innerHeight),
    // 鼠标对象
    mouse = {
      x: false,
      y: false,
    },
    last_mouse = {};

  // 定义计算两点距离的函数
  const dist = (p1x, p1y, p2x, p2y) => {
    return Math.sqrt(Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2));
  };

  // 定义 segment 类
  class segment {
    // 构造函数，用于初始化 segment 对象
    constructor(parent, l, a, first) {
      // 如果是第一条触手段，则位置坐标为触手顶部位置
      // 否则位置坐标为上一个segment对象的nextPos坐标
      this.first = first;
      if (first) {
        this.pos = {
          x: parent.x,
          y: parent.y,
        };
      } else {
        this.pos = {
          x: parent.nextPos.x,
          y: parent.nextPos.y,
        };
      }
      // 设置segment的长度和角度
      this.l = l;
      this.ang = a;
      // 计算下一个segment的坐标位置
      this.nextPos = {
        x: this.pos.x + this.l * Math.cos(this.ang),
        y: this.pos.y + this.l * Math.sin(this.ang),
      };
    }
    // 更新segment位置的方法
    update(t) {
      // 计算segment与目标点的角度
      this.ang = Math.atan2(t.y - this.pos.y, t.x - this.pos.x);
      // 根据目标点和角度更新位置坐标
      this.pos.x = t.x + this.l * Math.cos(this.ang - Math.PI);
      this.pos.y = t.y + this.l * Math.sin(this.ang - Math.PI);
      // 根据新的位置坐标更新nextPos坐标
      this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
      this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
    }
    // 将 segment 回执回初始位置的方法
    fallback(t) {
      // 将位置坐标设置为目标点坐标
      this.pos.x = t.x;
      this.pos.y = t.y;
      this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
      this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
    }
    show() {
      c.lineTo(this.nextPos.x, this.nextPos.y);
    }
  }

  // 定义 tentacle 类
  class tentacle {
    // 构造函数，用于初始化 tentacle 对象
    constructor(x, y, l, n, a) {
      // 设置触手的顶部位置坐标
      this.x = x;
      this.y = y;
      // 设置触手的长度
      this.l = l;
      // 设置触手的段数
      this.n = n;
      // 初始化触手的目标点对象
      this.t = {};
      // 设置触手的随机移动参数
      this.rand = Math.random();
      // 创建触手的第一条段
      this.segments = [new segment(this, this.l / this.n, 0, true)];
      // 创建其他的段
      for (let i = 1; i < this.n; i++) {
        this.segments.push(new segment(this.segments[i - 1], this.l / this.n, 0, false));
      }
    }
    // 移动触手到目标点的方法
    move(last_target, target) {
      // 计算触手顶部与目标点的角度
      this.angle = Math.atan2(target.y - this.y, target.x - this.x);
      // 计算触手的距离参数
      this.dt = dist(last_target.x, last_target.y, target.x, target.y);
      // 计算触手的目标点坐标
      this.t = {
        x: target.x - 0.8 * this.dt * Math.cos(this.angle),
        y: target.y - 0.8 * this.dt * Math.sin(this.angle),
      };
      // 如果计算出了目标点，则更新最后一个segment对象的位置坐标
      // 否则，更新最后一个segment对象的位置坐标为目标点坐标
      if (this.t.x) {
        this.segments[this.n - 1].update(this.t);
      } else {
        this.segments[this.n - 1].update(target);
      }
      // 遍历所有segment对象，更新它们的位置坐标
      for (let i = this.n - 2; i >= 0; i--) {
        this.segments[i].update(this.segments[i + 1].pos);
      }
      if (
        dist(this.x, this.y, target.x, target.y) <=
        this.l + dist(last_target.x, last_target.y, target.x, target.y)
      ) {
        this.segments[0].fallback({ x: this.x, y: this.y });
        for (let i = 1; i < this.n; i++) {
          this.segments[i].fallback(this.segments[i - 1].nextPos);
        }
      }
    }
    show(target) {
      // 如果触手与目标点的距离小于触手的长度，则回执触手
      if (dist(this.x, this.y, target.x, target.y) <= this.l) {
        // 设置全局合成操作为lighter
        c.globalCompositeOperation = 'lighter';
        // 开始新路径
        c.beginPath();
        // 从触手起始位置开始绘制线条
        c.moveTo(this.x, this.y);
        // 遍历所有的segment对象，并使用他们的show方法回执线条
        for (let i = 0; i < this.n; i++) {
          this.segments[i].show();
        }
        // 设置线条样式
        c.strokeStyle = 'hsl(' + (this.rand * 60 + 180) + ',100%,' + (this.rand * 60 + 25) + '%)';
        // 设置线条宽度
        c.lineWidth = this.rand * 2;
        // 设置线条端点样式
        c.lineCap = 'round';
        // 设置线条连接处样式
        c.lineJoin = 'round';
        // 绘制线条
        c.stroke();
        // 设置全局合成操作为“source-over”
        c.globalCompositeOperation = 'source-over';
      }
    }
    // 绘制触手的圆形头的方法
    show2(target) {
      // 开始新路径
      c.beginPath();
      // 如果触手与目标点的距离小于触手的长度，则回执白色的圆形
      // 否则绘制青色的圆形
      if (dist(this.x, this.y, target.x, target.y) <= this.l) {
        c.arc(this.x, this.y, 2 * this.rand + 1, 0, 2 * Math.PI);
        c.fillStyle = 'whith';
      } else {
        c.arc(this.x, this.y, this.rand * 2, 0, 2 * Math.PI);
        c.fillStyle = 'darkcyan';
      }
      // 填充圆形
      c.fill();
    }
  }
  // 初始化变量
  let maxl = 400, //触手的最大长度
    minl = 50, //触手的最小长度
    n = 30, //触手的段数
    numt = 600, //触手的数量
    tent = [], //触手的数组
    clicked = false, //鼠标是否被按下
    target = { x: 0, y: 0 }, //触手的目标点
    last_target = {}, //上一个触手的目标点
    t = 0, //当前时间
    q = 10; //触手每次移动的步长

  // 创建触手对象
  for (let i = 0; i < numt; i++) {
    tent.push(
      new tentacle(
        Math.random() * w, //触手的横坐标
        Math.random() * h, //触手的纵坐标
        Math.random() * (maxl - minl) + minl, //触手的长度
        n, //触手的段数
        Math.random() * 2 * Math.PI //触手的角度
      )
    );
  }
  // 绘制图像的方法
  function draw() {
    // 如果鼠标移动，则计算触手的目标点与当前点的偏差
    if (mouse.x) {
      target.errx = mouse.x - target.x;
      target.erry = mouse.y - target.y;
    } else {
      // 否则，计算触手的目标点的横坐标
      target.errx =
        w / 2 +
        ((h / 2 - q) * Math.sqrt(2) * Math.cos(t)) / (Math.pow(Math.sin(t), 2) + 1) -
        target.x;
      target.erry =
        h / 2 +
        ((h / 2 - q) * Math.sqrt(2) * Math.cos(t) * Math.sin(t)) / (Math.pow(Math.sin(t), 2) + 1) -
        target.y;
    }

    // 更新触手的目标点坐标
    target.x += target.errx / 10;
    target.y += target.erry / 10;

    // 更新时间
    t += 0.01;

    // 绘制触手的目标点
    c.beginPath();
    c.arc(
      target.x,
      target.y,
      dist(last_target.x, last_target.y, target.x, target.y) + 5,
      0,
      2 * Math.PI
    );
    c.fillStyle = 'hsl(210,100%,80%)';
    c.fill();

    // 绘制所有触手的中心点
    for (let i = 0; i < numt; i++) {
      tent[i].move(last_target, target);
      tent[i].show2(target);
    }
    // 绘制所有触手
    for (let i = 0; i < numt; i++) {
      tent[i].show(target);
    }
    // 更新上一个触手的目标点坐标
    last_target.x = target.x;
    last_target.y = target.y;
  }
  // 循环执行绘制动画的函数
  function loop() {
    // 使用requestAnimFrame函数循环执行

    window.requestAnimationFrame(loop); // 使用标准的 requestAnimationFrame

    // 清空canvas
    c.clearRect(0, 0, w, h);

    // 绘制动画
    draw();
  }

  // 监听窗口大小改变事件
  window.addEventListener('resize', function () {
    // 重置canvas的大小
    w = canvas.width = window.innerWidth;
    w = canvas.height = window.innerHeight;

    // 循环执行回执动画的函数
    loop();
  });

  // 循环执行回执动画的函数
  loop();
  // 使用setInterval函数循环
  setInterval(loop, 1000 / 60);

  // 监听鼠标移动事件
  canvas.addEventListener(
    'mousemove',
    function (e) {
      // 记录上一次的鼠标位置
      last_mouse.x = mouse.x;
      last_mouse.y = mouse.y;

      // 更新点前的鼠标位置
      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
    },
    false
  );

  // 监听鼠标离开事件
  canvas.addEventListener('mouseleave', function (e) {
    // 将mouse设为false
    mouse.x = false;
    mouse.y = false;
  });
};

onMounted(() => {
  create();
});
</script>

<style lang="scss" scoped></style>
