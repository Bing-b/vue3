import type { Plugin, IndexHtmlTransformResult } from 'vite';

interface BugRecorderOptions {
  /** 是否开启录制器 */
  enabled?: boolean;
  /** rrweb 库地址 */
  rrwebSrc?: string;
  /** 是否录制鼠标移动轨迹（开启后回放可看到光标移动，但会增大录制数据量） */
  mousemove?: boolean | number;
  /** 是否录制 Canvas 内容（适用于 AntV G6、ECharts 等可视化场景） */
  recordCanvas?: boolean;
}

export default function vitePluginBugRecorder(options: BugRecorderOptions = {}): Plugin {
  const {
    enabled = true,
    rrwebSrc = 'https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb-all.min.js',
    mousemove = true,
    recordCanvas = true,
  } = options;

  // mousemove: false → 关闭, true → 默认200ms采样(只记录有意义的移动), number → 自定义采样间隔
  const mousemoveValue = mousemove === true ? 150 : mousemove === false ? false : mousemove;

  return {
    name: 'vite-plugin-bug-recorder',
    transformIndexHtml(): IndexHtmlTransformResult {
      if (!enabled) return [];

      return [
        {
          tag: 'script',
          attrs: { src: rrwebSrc },
          injectTo: 'head',
        },
        {
          tag: 'script',
          injectTo: 'body',
          children: `
            (function() {
              const initRecorder = () => {
                if (typeof rrweb === 'undefined' || !rrweb.record) {
                  setTimeout(initRecorder, 300);
                  return;
                }

                if (document.getElementById('bug-recorder-console')) return;

                let events = [];
                let stopFn = null;
                let isRecording = false;

                // 1. 创建 UI 容器，并添加 'rr-ignore' 类防止递归录制
                const container = document.createElement('div');
                container.id = 'bug-recorder-console';
                container.classList.add('rr-ignore'); 
                Object.assign(container.style, {
                  position: 'fixed', right: '20px', bottom: '20px', zIndex: '2147483647',
                  backgroundColor: 'rgba(255,255,255,0.95)', padding: '8px', borderRadius: '10px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column',
                  gap: '6px', border: '1px solid #e0e0e0', fontFamily: 'system-ui, sans-serif', 
                  width: '120px', boxSizing: 'border-box', backdropFilter: 'blur(8px)',
                  userSelect: 'none', transition: 'box-shadow 0.2s'
                });

                // 拖拽头部
                const header = document.createElement('div');
                header.innerHTML = '<span id="br-dot" style="width:7px;height:7px;border-radius:50%;background:#ccc;display:inline-block;margin-right:5px;"></span><span style="font-size:11px;color:#555;font-weight:600">REC</span>';
                Object.assign(header.style, { display: 'flex', alignItems: 'center', cursor: 'grab', padding: '2px 0' });

                // 拖拽逻辑
                let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
                header.addEventListener('mousedown', (e) => {
                  isDragging = true;
                  dragOffsetX = e.clientX - container.getBoundingClientRect().left;
                  dragOffsetY = e.clientY - container.getBoundingClientRect().top;
                  header.style.cursor = 'grabbing';
                  e.preventDefault();
                });
                document.addEventListener('mousemove', (e) => {
                  if (!isDragging) return;
                  const x = e.clientX - dragOffsetX;
                  const y = e.clientY - dragOffsetY;
                  container.style.left = Math.max(0, Math.min(x, window.innerWidth - container.offsetWidth)) + 'px';
                  container.style.top = Math.max(0, Math.min(y, window.innerHeight - container.offsetHeight)) + 'px';
                  container.style.right = 'auto';
                  container.style.bottom = 'auto';
                });
                document.addEventListener('mouseup', () => {
                  if (isDragging) { isDragging = false; header.style.cursor = 'grab'; }
                });

                const info = document.createElement('div');
                info.id = 'br-info';
                info.innerText = '就绪';
                Object.assign(info.style, { fontSize: '10px', color: '#999', textAlign: 'center' });

                const btnCommon = "padding:5px 0; color:#fff; border:none; border-radius:5px; cursor:pointer; font-size:11px; font-weight:500; flex:1;";
                
                const btnStart = document.createElement('button');
                btnStart.innerText = '录制';
                btnStart.style.cssText = btnCommon + "background-color: #007aff;";

                const btnExport = document.createElement('button');
                btnExport.innerText = '导出';
                btnExport.disabled = true;
                btnExport.style.cssText = btnCommon + "background-color: #34c759; opacity: 0.4;";

                const btnRow = document.createElement('div');
                Object.assign(btnRow.style, { display: 'flex', gap: '6px' });
                btnRow.append(btnStart, btnExport);

                container.append(header, info, btnRow);
                document.body.appendChild(container);

                // 节流更新 UI，避免每个事件都触发 DOM 操作导致卡死
                let uiTimer = null;
                const updateUI = () => {
                  info.innerText = isRecording ? '● ' + events.length : '已停止 ' + events.length;
                  info.style.color = isRecording ? '#ff3b30' : '#999';
                  document.getElementById('br-dot').style.backgroundColor = isRecording ? '#ff3b30' : '#ccc';
                };
                const scheduleUIUpdate = () => {
                  if (uiTimer) return;
                  uiTimer = setInterval(() => {
                    updateUI();
                    if (!isRecording) { clearInterval(uiTimer); uiTimer = null; }
                  }, 1000);
                };

                const exportHtml = () => {
                  if (events.length < 2) return alert('数据不足，请多操作几下页面');
                  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                  // 转义 JSON 防止破坏脚本闭合
                  const dataStr = JSON.stringify(events).replace(/</g, '\\\\u003c');
                  
                  const template = \`<!DOCTYPE html><html><head><meta charset="UTF-8">
                  <title>Bug Reproduce - \${timestamp}</title>
                  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/rrweb-player@latest/dist/style.css">
                  <script src="https://cdn.jsdelivr.net/npm/rrweb-player@latest/dist/index.js"><\\/script>
                  <style>body{margin:0;background:#f5f5f7;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;min-height:100vh;}#v{margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.1);overflow:hidden;}.rr-player,.rr-player__frame{margin:0 auto;}</style>
                  </head><body>
                  <h3 style="text-align:center">Bug 复现回放 - \${new Date().toLocaleString()}</h3>
                  <div id="v"></div><script>
                  const e = \${dataStr};
                  window.onload = () => {
                    new rrwebPlayer({ target: document.getElementById("v"), props: { events: e, width: window.innerWidth - 80, height: window.innerHeight - 150, autoPlay: true, UNSAFE_replayCanvas: true } });
                  };<\\/script></body></html>\`;

                  const blob = new Blob([template], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url; link.download = 'bug_report_' + timestamp + '.html';
                  link.click();
                  URL.revokeObjectURL(url);
                };

                btnStart.onclick = () => {
                  try {
                    events = [];
                    isRecording = true;
                    btnStart.disabled = true; btnStart.style.opacity = '0.5';
                    btnExport.disabled = false; btnExport.style.opacity = '1';

                    // 2. 核心性能优化参数
                    stopFn = rrweb.record({
                      emit: (e) => {
                        events.push(e);
                      },
                      // 关键：不记录鼠标移动，防止页面卡顿
                      sampling: {
                        mousemove: ${mousemoveValue === false ? 'false' : mousemoveValue}, 
                        mouseInteraction: { MouseUp: true, MouseDown: true, Click: true, ContextMenu: true },
                        scroll: 150,
                        input: 'all',
                        canvas: ${recordCanvas ? 15 : 0},
                      },
                      blockClass: 'rr-block',
                      ignoreClass: 'rr-ignore',
                      recordCanvas: ${recordCanvas},
                      checkoutEveryNms: 60000,
                    });
                    // 调试信息: 检测页面上的 canvas 元素
                    const canvasCount = document.querySelectorAll('canvas').length;
                    console.log('[Bug Recorder] Started. Canvas elements detected:', canvasCount, canvasCount > 0 ? '(recordCanvas enabled)' : '(no canvas found)');
                    scheduleUIUpdate();
                  } catch (err) {
                    console.error('Recorder failed:', err);
                    alert('录制启动失败，请检查控制台');
                  }
                };

                btnExport.onclick = () => {
                  isRecording = false;
                  if (stopFn) stopFn();
                  btnStart.disabled = false; btnStart.style.opacity = '1';
                  btnExport.disabled = true; btnExport.style.opacity = '0.5';
                  exportHtml();
                  updateUI();
                };
              };

              if (document.readyState === 'complete') initRecorder();
              else window.addEventListener('load', initRecorder);
            })();
          `,
        },
      ];
    },
  };
}