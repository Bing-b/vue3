<template>
  <div class="h-full w-full overflow-auto">
    <div class="container flex">
      <!-- hook -->
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>鼠标位置hook</span>
          </div>
        </template>
        <div>
          <p>X:{{ x }}</p>
          <p>Y: {{ y }}</p>
        </div>
      </el-card>

      <!-- pdf -->
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>pdf文档预览</span>
            <el-button type="primary" @click="dialogTableVisible = !dialogTableVisible"
              >显示PDF</el-button
            >
          </div>
        </template>
        <div>
          <p>文件链接添加#scrollbars=0&toolbar=0&statusbar=0可去除预览工具栏</p>
        </div>
      </el-card>

      <el-dialog v-model="dialogTableVisible" title="文档预览">
        <div class="pdf-container">
          <embed
            src="/leaflet技术调研.pdf#navpanes=0&view=FitH#scrollbars=0&toolbar=0&statusbar=0"
            type="application/pdf" />
          <!-- <iframe style="width: 100%; min-height: 600px"
            src="http://view.officeapps.live.com/op/view.aspx?src=newteach.pbworks.com%2Ff%2Fele%2Bnewsletter.docx"
            width="100%" height="100%" frameborder="1" /> -->
        </div>
      </el-dialog>

      <!-- 文本超出省略 -->
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>文本超出省略</span>
          </div>
        </template>
        <div>
          <p>1、可动态判断文本是否超出父容器宽度来控制显示tooltip</p>
          <p>2、支持传递 文本超出行数 参数控制显示...</p>
          <br />
          <textEllipsis lineClamp="2" placement="bottom">
            恐龙体型巨大，各种形态各异，有短小的小型恐龙，也有高达20米以上的大型恐龙。恐龙的主要特征是：四肢直立，行走方式为双足行走；颈部和尾部通常较长；拥有强有力的下颌和锋利的牙齿，适应多样的食性；身体覆盖着角质质地的鳞片或者羽毛；有些恐龙还拥有壮观的骨刺，用于防御或吓唬敌人。
          </textEllipsis>
        </div>
      </el-card>
      <!-- <img id="ii" /> -->

      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>大菠萝（pinia）</span>
            <el-button type="primary" @click="addCount">计数++</el-button>
            <el-button type="primary" @click="userStore.clear()">清除pinia</el-button>
          </div>
        </template>
        <div>
          <el-input v-model="userStore.name" placeholder="请输入名称" clearable></el-input>
          <p class="mt-2">名称：{{ userStore.name }}</p>
          <p>计数：{{ userStore.counter }}</p>
        </div>
      </el-card>

      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>鼠标横向滚动</span>
          </div>
        </template>
        <div>
          <div class="tab-list" id="nav">
            <div
              class="flex items-center justify-center flex-none tab-item w-[100px] h-[50px]"
              v-for="i in 10"
              :key="i">
              <div class="w-[80px] h-full bg-slate-400">
                {{ i }}
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="box-card">
        <template #header>
          <div class="card-header" v-loading="loading">
            <span>loading Hook</span>
          </div>
        </template>
        <div>
          <xButton @click="handleShowLoading">{{ loading ? '关闭' : '显示' }}</xButton>
        </div>
      </el-card>
      <Switch :component="component" :parent="parent" a="哈哈哈哈">
        <el-button type="default" @click="handClick">切换卡片</el-button>
      </Switch>

      <el-card class="box-card">
        <template #header>
          <div class="card-header" v-loading="loading">
            <span>导出excel</span>
          </div>
        </template>
        <div>
          <xButton @click="exportExcel">导出</xButton>
        </div>
      </el-card>

      <el-card class="box-card">
        <template #header>
          <div class="card-header" v-loading="loading">
            <span>element指令-ClickOutside 点击区域外关闭dom</span>
          </div>
        </template>
        <div class="relative h-[300px]">
          <xButton @click="flag = true">打開下拉框</xButton>
          <div
            v-click-outside="onClickOutside"
            v-show="flag"
            class="absolute top-[40px] left-0 bg-[#eded23] w-[200px] h-[200px] border"></div>
        </div>
      </el-card>

      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>V3新特性-defineModel</span>
          </div>
        </template>
        <div>
          <Child v-model="msg" />
          {{ msg }}
        </div>
      </el-card>

      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>V3一键复制</span>
          </div>
        </template>
        <div>
          <el-input v-model="text" placeholder="请输入"></el-input>
          <el-button @click="handleCopy">复制</el-button>
        </div>
      </el-card>

      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>一行代码复制剪切板</span>
          </div>
        </template>
        <div>
          <el-input v-model="textVal" placeholder="请输入"></el-input>
          <el-button @click="copyToClipboard">复制</el-button>
        </div>
      </el-card>

      <Teleport to="body">
        <!-- Renders it to a child element of the `body` -->
        <span>xxxxx</span>
      </Teleport>

      <Obsec />
    </div>
  </div>
</template>
<script lang="ts" setup>
import useMousePositon from '@/hooks/useMousePosition';
import useLoading from '@/hooks/useLoading';
import { onMounted, ref } from 'vue';
import imgUrl from '@/assets/images/logo/logo_square.png';
import useUserStore from '@/store/modules/user';
import { exportExcle } from '@/utils/excel';
import { ClickOutside as vClickOutside } from 'element-plus';
import utils from '@/utils/commonFuction';
import Switch from '../switch/index.vue';
import Child from './child.vue';
import Obsec from '../features/index.vue';

// 复用获取鼠标位置
const { x, y } = useMousePositon();

// 复用加载动画
const { loading, showLoading, hideLoading } = useLoading();

const dialogTableVisible = ref(false);

// 大菠萝
const userStore = useUserStore();

const msg = ref('ss');

const text = ref<string>('');

const textVal = ref<string>('');

const addCount = () => {
  userStore.counter++;
};

const handler = (event: any) => {
  // 获取要绑定事件的元素
  const nav = document.getElementById('nav');
  // 获取滚动方向
  const detail = event.wheelDelta || event.detail;
  // 定义滚动方向，其实也可以在赋值的时候写
  const moveForwardStep = 1;
  const moveBackStep = -1;
  // 定义滚动距离
  let step = 0;
  // 判断滚动方向,这里的100可以改，代表滚动幅度，也就是说滚动幅度是自定义的
  if (detail < 0) {
    step = moveForwardStep * 100;
  } else {
    step = moveBackStep * 100;
  }
  // 对需要滚动的元素进行滚动操作
  nav!.scrollLeft += step;
};

const scrollInit = () => {
  // 获取要绑定事件的元素
  const nav = document.getElementById('nav');
  if (nav) {
    nav.addEventListener('mousewheel', handler, false);
  }
};

const handleShowLoading = () => {
  if (loading.value) hideLoading();
  else showLoading();
};

const component = ref<'Card1' | 'Card2'>('Card1');

const parent = ref('腹肌');

// 控制显示下拉框
const flag = ref<boolean>(false);

// 卡片切换
const handClick = () => {
  component.value = component.value === 'Card2' ? 'Card1' : 'Card2';
};

const userExcelHeader = [
  {
    title: '用户序号',
    key: 'user_id',
    width: 80,
  },
  {
    title: '登录名称',
    key: 'user_name',
  },
  {
    title: '用户邮箱',
    key: 'email',
    width: 240,
  },
  {
    title: '手机号码',
    key: 'phonenumber',
  },
  {
    title: '用户性别',
    key: 'sex',
  },
  {
    title: '帐号状态',
    key: 'status',
  },
  {
    title: '最后登录IP',
    key: 'login_ip',
  },
  {
    title: '最后登录时间',
    key: 'login_date',
  },
  {
    title: '部门名称',
    key: 'dept.dept_name',
  },
  {
    title: '部门负责人',
    key: 'dept.leader',
  },
];

const content = [
  {
    user_id: 1,
    user_name: 'admin',
    email: '15345271705@163.com',
    phonenumber: '15345271705',
    sex: '男',
    status: '正常',
    login_ip: '',
    login_date: '00:00:00',
    'dept.dept_name': '深圳总公司',
    'dept.leader': 'wen',
  },
  {
    user_id: 2,
    user_name: 'password',
    email: null,
    phonenumber: null,
    sex: '未知',
    status: '正常',
    login_ip: null,
    login_date: null,
    'dept.dept_name': '研发部门',
    'dept.leader': 'wen',
  },

  {
    user_id: 2,
    user_name: 'password',
    email: null,
    phonenumber: null,
    sex: '未知',
    status: '正常',
    login_ip: null,
    login_date: null,
    'dept.dept_name': '研发部门',
    'dept.leader': 'wen',
  },
  {
    user_id: 3,
    user_name: 'password',
    email: null,
    phonenumber: null,
    sex: '未知',
    status: '正常',
    login_ip: null,
    login_date: null,
    'dept.dept_name': '研发部门',
    'dept.leader': 'wen',
  },
];

const excleOption = {
  tableName: '',
  headerColumns: userExcelHeader,
  tableData: content,
};

// 导出
const exportExcel = () => {
  exportExcle(excleOption);
};

const onClickOutside = () => {
  flag.value = false;
};

// 复制
const handleCopy = () => {
  utils.copyText(text.value);
};

// 一键复制
const copyToClipboard = () => navigator.clipboard.writeText(textVal.value);

onMounted(() => {
  const img = document.getElementById('ii') as HTMLImageElement | null;
  if (img) {
    img.src = imgUrl;
  }
  scrollInit();
});
</script>

<style lang="scss">
.container {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(720px, 1fr));
  align-content: start;
  gap: 20px;
  flex-wrap: wrap;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  flex: 20%;
  height: 300px;
}

.pdf-container {
  width: 100%;
  height: 600px;

  embed {
    width: 100%;
    height: 100%;
  }
}

.tab-list {
  width: 400px;
  display: flex;
  align-items: center;
  overflow-x: auto;
  transition: all 0.36s ease; // 滑动动画
}

.tab-list::-webkit-scrollbar {
  height: 0; // 隐藏滚动条
}
</style>
