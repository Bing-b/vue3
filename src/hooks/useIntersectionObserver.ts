export function useIntersectionObserver (elements,options: {}, callback) {
  if(!elements || (Array.isArray(elements) && elements.length === 0)) {
    throw new Error('参数 elements 不能为空！')
  }

  // 判断是单个元素还是多个
  const isSingleElement = !Array.isArray(elements)
  const targetElements = isSingleElement? [elements]:elements;

  const observer = new IntersectionObserver((entries, observer) => {
    callback && callback(entries, observer)
  },options)

  targetElements.forEach((ele) => {
    observer.observe(ele)
  })

  // 取消单个元素监听
  const unObserverElement = (ele) => {
    if(ele) observer.unobserve(ele)
  }

  // 取消全部元素监听
  const unObserverAllElements = () => {
    targetElements.forEach(e => {
      observer.unobserve(e)
    })
  }

  // 终止对所有目标元素可见性变化的观察
  const disConnectObserver = () => {
    observer.disconnect()
  }

  return {
    unObserverElement,
    unObserverAllElements,
    disConnectObserver
  }
}