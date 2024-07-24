<template>
  <div class="my-5">
    <p>
      <span class="text-[14px]"></span> （
      <span class="text-[red]">自动上传</span>
      、拖拽上传、拖拽排序、设置请求头、上传进度、大图预览、多选文件、最大文件数量、文件类型限制、文件大小限制、删除文件）</p
    >

    <el-upload
      class="pure-upload my-5"
      v-model:file-list="fileList"
      drag
      multiple
      list-type="picture-card"
      accepet="image/jpeg,image/png,image/svg"
      action="https://run.mocky.io/v3/3aa761d7-b0b3-4a03-96b3-6168d4f7467b"
      :limit="3"
      :header="{ Authorization: 'eyJhbGciOiJIUzUxMiJ9.admin' }"
      :on-exceed="onExceed"
      :before-upload="onBefore">
      <el-icon class="m-auto mt-4" width="30">
        <Plus />
      </el-icon>
      <template #file="{ file }">
        <div v-if="file.status == 'ready' || file.status == 'uploading'" class="mt-[35%] m-auto">
          <p>文件上传中</p>
          <el-progress
            class="mt-2"
            :stroke-width="2"
            :text-inside="true"
            :show-text="false"
            :percentage="file.percentage" />
        </div>
        <div v-else @mouseenter.stop="imgDrop(file.uid)">
          <img :src="file.url" class="el-upload-list__item-thumbnail select-none" />
          <span
            id="pure-upload-item"
            :class="['el-upload-list__item-actions', fileList.length > 1 && '!cursor-move']">
            <span title="查看" class="hover:text-primary" @click="handlePictureCardPreview(file)">
              <el-icon class="hover:scale-125 duration-100">
                <View />
              </el-icon>
            </span>
            <span class="el-upload-list__item-delete" @click="handleRemove(file)">
              <span title="移除" class="hover:text-[var(--el-color-danger)]">
                <el-icon class="hover:scale-125 duration-100">
                  <Delete />
                </el-icon>
              </span>
            </span>
          </span>
        </div>
      </template>
    </el-upload>
    <el-image-viewer
      v-if="dialogVisible"
      :initialIndex="curOpenImgIndex"
      :url-list="urlList"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      @close="dialogVisible = false"
      @switch="(index) => (curOpenImgIndex = index)" />
    <!-- 将自定义内容插入到body里，有了它在图片预览的时候，想插入个分页器或者别的东东在预览区某个位置就很方便咯（用户需求可以很灵活，开源组件库几乎不可能尽善尽美，很多时候寻找别的解决途径或许更好） -->
    <teleport to="body">
      <div
        v-if="fileList[curOpenImgIndex] && dialogVisible"
        effect="dark"
        round
        size="large"
        type="info"
        class="img-name">
        <p class="text-[#fff] dark:text-black">
          {{ fileList[curOpenImgIndex].name }}
        </p>
      </div>
    </teleport>
    <p class="el-upload__tip"> 可拖拽上传最多3张单个不超过2MB且格式为jpeg/png/gif的图片 </p>
  </div>
</template>

<script lang="ts" setup>
import Sortable from 'sortablejs';
import { ElMessage, UploadFile } from 'element-plus';
import { computed, ref } from 'vue';

const fileList = ref([]);

const curOpenImgIndex = ref(0);
const dialogVisible = ref(false);

const getKeyList = (arr, key) => {
  return arr.map((item) => item[key]);
};

const urlList = computed(() => getKeyList(fileList.value, 'url'));

/** 上传文件前校验 */
const onBefore = (file) => {
  if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    ElMessage({
      type: 'success',
      message: '只能上传图片',
    });
    return false;
  }
  const isExceed = file.size / 1024 / 1024 > 2;
  if (isExceed) {
    ElMessage({
      type: 'success',
      message: '单个图片大小不能超过2MB',
    });
    return false;
  }
};

/** 超出最大上传数时触发 */
const onExceed = () => {
  ElMessage({
    type: 'success',
    message: '最多上传3张图片，请先删除在上传',
  });
};

const getUploadItem = () => document.querySelectorAll('#pure-upload-item');

/** 缩略图拖拽排序 */
const imgDrop = (uid) => {
  const CLASSNAME = 'el-upload-list';
  const _curIndex = fileList.value.findIndex((img) => img.uid === uid);
  getUploadItem()?.[_curIndex]?.classList?.add(`${CLASSNAME}__item-actions`);
  const wrapper: HTMLElement = document.querySelector(`.${CLASSNAME}`);
  Sortable.create(wrapper, {
    handle: `.${CLASSNAME}__item`,
    onEnd: ({ newIndex, oldIndex }) => {
      const oldFile = fileList.value[oldIndex];
      fileList.value.splice(oldIndex, 1);
      fileList.value.splice(newIndex, 0, oldFile);
      // fix: https://github.com/SortableJS/Sortable/issues/232 (firefox is ok, but chromium is bad. see https://bugs.chromium.org/p/chromium/issues/detail?id=410328)
      getUploadItem().forEach((ele) => {
        ele.classList.remove(`${CLASSNAME}__item-actions`);
      });
    },
  });
};

/** 大图预览 */
const handlePictureCardPreview = (file: UploadFile) => {
  curOpenImgIndex.value = fileList.value.findIndex((img) => img.uid === file.uid);
  dialogVisible.value = true;
};

/** 移除上传的文件 */
const handleRemove = (file: UploadFile) => {
  fileList.value.splice(fileList.value.indexOf(file), 1);
};
</script>

<style lang="scss" scoped>
:deep(.card-header) {
  display: flex;

  .header-right {
    display: flex;
    flex: auto;
    align-items: center;
    justify-content: flex-end;
    font-size: 14px;
  }
}

:deep(.pure-upload) {
  .el-upload-dragger {
    background-color: transparent;
    border: none;
  }
}

.img-name {
  position: absolute;
  bottom: 80px;
  left: 50%;
  z-index: 4000;
  padding: 5px 23px;
  background-color: var(--el-text-color-regular);
  border-radius: 22px;
  transform: translateX(-50%);

  /** 将下面的 left: 50%; bottom: 80px; transform: translateX(-50%); 注释掉
   *  解开下面 left: 40px; top: 40px; 注释，体验不一样的感觉。啊？还是差强人意，自己调整位置吧🥹
   */
  // left: 40px;
  // top: 40px;
}
</style>
