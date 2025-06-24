import { ElLoading, ElMessageBox } from 'element-plus';
import { LoadingInstance } from 'element-plus/es/components/loading/src/loading';
import { onUnmounted, ref } from 'vue';

/**
 * 取消请求hook
 * @returns
 */
export default function useCancelRequest() {
  const signal = ref<AbortSignal>({} as AbortSignal); // 终止标识
  let timer: ReturnType<typeof setTimeout> | null = null; // 定时器延迟弹窗加载
  let loading: LoadingInstance;

  /** 初始化取消请求弹窗 */
  const loadCancelAlert = () => {
    const controller = new AbortController(); // 请求终止器
    signal.value = controller.signal;

    loading = ElLoading.service({
      lock: true,
      text: '',
      background: 'rgab(0,0,0,0.2)',
    });

    timer = setTimeout(() => {
      ElMessageBox.confirm(
        '<div class="flex flex-col gap-3 items-center"><div class="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div><p>查询中...</p></div>',
        '提示',
        {
          dangerouslyUseHTMLString: true,
          customClass: 'custom-style',
          showClose: false,
          showCancelButton: false,
          confirmButtonText: '取消查询',
          closeOnClickModal: false,
          closeOnPressEscape: false,
        },
      ).then(() => {
        // 中止请求
        controller.abort();
        // 中止 后端真实请求查询
        // stopTrueRequest().then(() => {
        //   ElMessage.success('已取消查询！');
        // });
      });
    }, 2000);
  };

  // 请求完成时调用，取消加载取消请求弹窗
  const cancelPendingAlert = () => {
    loading?.close();
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  onUnmounted(() => {
    if (timer) clearTimeout(timer);
    if (loading) loading.close();
  });

  return {
    loadCancelAlert,
    cancelPendingAlert,
    signal,
  };
}
