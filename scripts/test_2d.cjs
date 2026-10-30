const fs = require('fs');
const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const proc = spawn(edgePath, [
  '--headless',
  '--remote-debugging-port=9229',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--window-size=1920,1080',
  'http://localhost:4173/'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9229/json');
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

      // Click "View Portfolio" on landing page
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 3,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              const btns = Array.from(document.querySelectorAll('button'));
              const portBtn = btns.find(b => b.innerText.includes('View Portfolio'));
              if (portBtn) portBtn.click();
            })()`
          }
        }));
      }, 3500);

      // Take screenshot of 2D Portfolio view
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 4,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 5500);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 4 && msg.result && msg.result.data) {
        fs.writeFileSync('C:\\Users\\User\\AppData\\Local\\Temp\\render_2d.png', msg.result.data, 'base64');
        console.log('Captured render_2d.png');
        ws.close();
        proc.kill();
      }
    };
  } catch (err) {
    console.error(err);
    proc.kill();
  }
}, 3000);
