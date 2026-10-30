const fs = require('fs');
const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const proc = spawn(edgePath, [
  '--headless',
  '--remote-debugging-port=9227',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--window-size=390,844',
  'http://localhost:4173/'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9227/json');
    const pages = await listRes.json();
    const page = pages.find(p => p.url.includes('4173'));
    if (!page) {
      console.log('No page found');
      proc.kill();
      return;
    }

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 3500);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2 && msg.result && msg.result.data) {
        fs.writeFileSync('C:\\Users\\User\\AppData\\Local\\Temp\\render_mobile.png', msg.result.data, 'base64');
        console.log('Captured render_mobile.png');
        ws.close();
        proc.kill();
      }
    };
  } catch (err) {
    console.error(err);
    proc.kill();
  }
}, 3000);
