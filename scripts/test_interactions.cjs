const fs = require('fs');
const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const proc = spawn(edgePath, [
  '--headless',
  '--remote-debugging-port=9228',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--window-size=1920,1080',
  'http://localhost:4173/'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9228/json');
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

      // 1. Enter 3D mode
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 3,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              const btns = Array.from(document.querySelectorAll('button'));
              const enterBtn = btns.find(b => b.innerText.includes('Enter CloudVerse'));
              if (enterBtn) enterBtn.click();
            })()`
          }
        }));
      }, 3500);

      // 2. Click Sigiriya in nav bar to open IslandModal
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 4,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              const navBtns = Array.from(document.querySelectorAll('nav button'));
              const sigiriyaBtn = navBtns.find(b => b.innerText.includes('Sigiriya'));
              if (sigiriyaBtn) sigiriyaBtn.click();
            })()`
          }
        }));
      }, 4800);

      // 3. Take screenshot of IslandModal open
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 5,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 6200);

      // 4. Close modal and open CloudOps Game
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 6,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              // Click close or open CloudOps
              const btns = Array.from(document.querySelectorAll('button'));
              const closeBtn = btns.find(b => b.getAttribute('aria-label') === 'Close drawer' || b.innerText.includes('✕') || b.className.includes('rounded-full'));
              if (closeBtn) closeBtn.click();
              const gameBtn = btns.find(b => b.innerText.includes('CloudOps'));
              if (gameBtn) gameBtn.click();
            })()`
          }
        }));
      }, 7500);

      // 5. Take screenshot of CloudOps game modal
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 7,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 9000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 5 && msg.result && msg.result.data) {
        fs.writeFileSync('C:\\Users\\User\\AppData\\Local\\Temp\\render_island_modal.png', msg.result.data, 'base64');
        console.log('Captured render_island_modal.png');
      }
      if (msg.id === 7 && msg.result && msg.result.data) {
        fs.writeFileSync('C:\\Users\\User\\AppData\\Local\\Temp\\render_cloudops.png', msg.result.data, 'base64');
        console.log('Captured render_cloudops.png');
        ws.close();
        proc.kill();
      }
    };
  } catch (err) {
    console.error(err);
    proc.kill();
  }
}, 3000);
