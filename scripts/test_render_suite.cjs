const fs = require('fs');
const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const proc = spawn(edgePath, [
  '--headless',
  '--remote-debugging-port=9226',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--window-size=1920,1080',
  'http://localhost:4173/'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9226/json');
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
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

      // 1. Take landing screenshot after WebGL has initialized
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 3,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 3500);

      // 2. Click "Enter CloudVerse"
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 4,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              const btns = Array.from(document.querySelectorAll('button'));
              const enterBtn = btns.find(b => b.innerText.includes('Enter CloudVerse'));
              if (enterBtn) enterBtn.click();
              return !!enterBtn;
            })()`
          }
        }));
      }, 5500);

      // 3. Take 3D Explorer screenshot
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 5,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 7500);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 3 && msg.result && msg.result.data) {
        fs.writeFileSync('C:\\Users\\User\\AppData\\Local\\Temp\\render_landing.png', msg.result.data, 'base64');
        console.log('Captured render_landing.png');
      }
      if (msg.id === 5 && msg.result && msg.result.data) {
        fs.writeFileSync('C:\\Users\\User\\AppData\\Local\\Temp\\render_explorer.png', msg.result.data, 'base64');
        console.log('Captured render_explorer.png');
        ws.close();
        proc.kill();
      }
    };
  } catch (err) {
    console.error(err);
    proc.kill();
  }
}, 3000);
