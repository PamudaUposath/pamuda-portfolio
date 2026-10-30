const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const proc = spawn(edgePath, [
  '--headless',
  '--remote-debugging-port=9225',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  'http://localhost:4173/'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9225/json');
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
            if (!canvas) return { error: 'No canvas' };
            // In React Three Fiber, canvas has __r3f property
            const r3f = canvas.__r3f;
            if (!r3f) return { error: 'No __r3f on canvas' };
            const state = r3f.root.getState();
            const scene = state.scene;
            const camera = state.camera;
            const gl = state.gl;

            return {
              cameraPos: camera.position.toArray(),
              cameraFar: camera.far,
              cameraNear: camera.near,
              sceneBg: scene.background ? (scene.background.isColor ? scene.background.getHexString() : 'texture') : 'null',
              sceneFog: scene.fog ? { color: scene.fog.color.getHexString(), near: scene.fog.near, far: scene.fog.far } : 'null',
              childrenCount: scene.children.length,
              childTypes: scene.children.map(c => ({ type: c.type, name: c.name || c.constructor.name })),
              clearColor: gl.getClearColor(new (scene.background ? scene.background.constructor : Object)()).getHexString(),
              clearAlpha: gl.getClearAlpha()
            };
          })()`,
          returnByValue: true
        }
      }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        console.log('R3F SCENE STATE:', JSON.stringify(msg.result, null, 2));
        ws.close();
        proc.kill();
      }
    };
  } catch (err) {
    console.error(err);
    proc.kill();
  }
}, 3000);
