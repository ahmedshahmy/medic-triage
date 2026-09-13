/* =========================================================================
   Shared headless-Chrome harness for the MediTriage tests.
   Launches Chrome, connects over CDP and exposes tiny helpers.
   ========================================================================= */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const SHOTS = resolve(ROOT, 'test/shots');
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.events = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { res, rej } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
      } else if (msg.method) {
        this.events.push(msg);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((res, rej) => {
      this.pending.set(id, { res, rej });
      setTimeout(() => { if (this.pending.delete(id)) rej(new Error('CDP timeout: ' + method)); }, 30000);
    });
  }
  async eval(expression, awaitPromise = false) {
    const r = await this.send('Runtime.evaluate', {
      expression, returnByValue: true, awaitPromise, userGesture: true
    });
    if (r.exceptionDetails) {
      throw new Error('page error: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    }
    return r.result.value;
  }
  errors() {
    return this.events.filter((e) =>
      e.method === 'Runtime.exceptionThrown' ||
      (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error') ||
      (e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
    ).map((e) => JSON.stringify(e.params).slice(0, 400));
  }
}

async function target(port) {
  for (let i = 0; i < 80; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page;
    } catch { /* browser not up yet */ }
    await sleep(250);
  }
  throw new Error('Chrome did not expose a debuggable page');
}

/**
 * Launch Chrome on `url` and return { cdp, chrome, shot, close }.
 * `speed` multiplies the page's own clock (performance.now) so long case
 * timelines can be exercised in seconds of real time.
 */
export async function launch({ url, width = 390, height = 844, mobile = true, speed = 1 } = {}) {
  mkdirSync(SHOTS, { recursive: true });
  const port = 9333 + Math.floor(Math.random() * 500);
  const chrome = spawn(process.env.CHROME || 'google-chrome', [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
    '--disable-dev-shm-usage', '--hide-scrollbars',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=/tmp/mt-chrome-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    url
  ], { stdio: 'ignore' });

  const page = await target(port);
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });
  const cdp = new CDP(ws);
  await cdp.send('Runtime.enable');
  await cdp.send('Log.enable');
  await cdp.send('Page.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride',
    { width, height, deviceScaleFactor: mobile ? 2 : 1, mobile });

  // wait for the app to finish booting rather than guessing at a sleep
  for (let i = 0; i < 120; i++) {
    try {
      const ready = await cdp.eval(
        'document.readyState === "complete" && !!(window.MediTriage && window.CASES && window.CASES.length)');
      if (ready) break;
    } catch { /* page may still be loading */ }
    await sleep(250);
  }

  if (speed !== 1) {
    // scale the page clock: 30x speed turns a 10-minute case into 20 seconds
    await cdp.eval(`(() => {
      const t0 = performance.now();
      const orig = performance.now.bind(performance);
      window.__mtSpeed = ${speed};
      performance.now = () => t0 + (orig() - t0) * window.__mtSpeed;
      return true; })()`);
  }

  return {
    cdp, chrome,
    async shot(name) {
      const r = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      writeFileSync(resolve(SHOTS, name), Buffer.from(r.data, 'base64'));
    },
    close() {
      try { ws.close(); } catch {}
      try { chrome.kill('SIGKILL'); } catch {}
    }
  };
}
