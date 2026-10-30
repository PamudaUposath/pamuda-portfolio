const http = require('http');
const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const proc = spawn(edgePath, [
  '--headless',
  '--remote-debugging-port=9222',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  'http://localhost:4173/'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9222/json');
    const pages = await listRes.json();
    const page = pages.find(p => p.url.includes('4173'));
    if (!page) {
      console.log('No page found matching 4173');
      proc.kill();
      return;
    }

    console.log('Connecting to WS:', page.webSocketDebuggerUrl);
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
      ws.send(JSON.stringify({
        id: 3,
        method: 'Runtime.evaluate',
        params: {
          expression: `({
            title: document.title,
            canvasCount: document.querySelectorAll('canvas').length,
            canvasWidth: document.querySelector('canvas') ? document.querySelector('canvas').width : 0,
            canvasHeight: document.querySelector('canvas') ? document.querySelector('canvas').height : 0,
            bodyHtml: document.getElementById('root').innerHTML.substring(0, 300)
          })`,
          returnByValue: true
        }
      }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 3) {
        console.log('DOM & Canvas state:', JSON.stringify(msg.result, null, 2));
      }
      if (msg.method === 'Runtime.consoleAPICalled' || msg.method === 'Runtime.exceptionThrown') {
        console.log('CONSOLE EVENT:', JSON.stringify(msg, null, 2));
      }
    };

    setTimeout(() => {
      ws.close();
      proc.kill();
    }, 3000);
  } catch (e) {
    console.error('Error:', e);
    proc.kill();
  }
}, 2500);
