const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const proc = spawn(edgePath, [
  '--headless',
  '--remote-debugging-port=9223',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  'http://localhost:4173/'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9223/json');
    const pages = await listRes.json();
    const page = pages.find(p => p.url.includes('4173'));
    if (!page) {
      console.log('No page found');
      proc.kill();
      return;
    }

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({
        id: 2,
        method: 'Runtime.evaluate',
        params: {
          expression: `(() => {
            const canvas = document.querySelector('canvas');
            if (!canvas) return { error: 'No canvas found' };
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            const rect = canvas.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(canvas);
            const parentStyle = window.getComputedStyle(canvas.parentElement);
            return {
              canvasWidth: canvas.width,
              canvasHeight: canvas.height,
              rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
              display: computedStyle.display,
              visibility: computedStyle.visibility,
              opacity: computedStyle.opacity,
              zIndex: computedStyle.zIndex,
              parentRect: canvas.parentElement.getBoundingClientRect(),
              parentDisplay: parentStyle.display,
              hasGL: !!gl,
              glError: gl ? gl.getError() : null
            };
          })()`,
          returnByValue: true
        }
      }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        console.log('CANVAS INSPECTION:', JSON.stringify(msg.result, null, 2));
        ws.close();
        proc.kill();
      }
    };
  } catch (err) {
    console.error(err);
    proc.kill();
  }
}, 2500);
