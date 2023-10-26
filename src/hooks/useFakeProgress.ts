import { ref, computed, type Ref, onBeforeUnmount } from 'vue'
import FakeProgress from 'fake-progress'

interface IUseFakeProgress {
  progress: Ref<number>
  percentage: Ref<number>
  start: () => void
  end: () => void
}

/**
 * useFakeProgress Hook
 *
 * @param {number} [timeConstant=5000] - 默认timeConstant为5000，单位毫秒
 * @param {boolean} [autoStart=false] - 是否自动开始，默认为false
 * @return {IUseFakeProgress}
 */
export function useFakeProgress(
  timeConstant?: number,
  autoStart?: boolean
): IUseFakeProgress {
  const fake = new FakeProgress({
    timeConstant: timeConstant || 5000,
    autoStart
  })
  const progress = ref(fake.progress)
  const percentage = computed(() => parseInt(progress.value * 100 + ''))
  let timerInterval: ReturnType<typeof setInterval> | null
  if (autoStart) {
    setTimerInterval()
  }

  onBeforeUnmount(() => {
    clearTimerInterval()
  })

  function start() {
    if (!percentage.value || percentage.value === 100) {
      fake.start()
      setTimerInterval()
    }
  }

  function end() {
    fake.end()
    progress.value = fake.progress
  }

  function setTimerInterval() {
    clearTimerInterval()
    timerInterval = setInterval(() => {
      progress.value = fake.progress
    }, 100)
  }

  function clearTimerInterval() {
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = null
  }

  return {
    progress,
    percentage,
    start,
    end
  }
}
