
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const DEV = import.meta.env.DEV;
const PORT = location.port || '3000';
if (DEV) {
  const state = { verbose: false };
  const log = (...args: unknown[]) => { if (state.verbose) console.log('[preview]', ...args); };
  const banner = [
    'NutritionWise AI Preview',
    `Mode: development`,
    `HMR: ${Boolean((import.meta as any).hot) ? 'enabled' : 'disabled'}`,
    `Local: http://localhost:${PORT}`,
    `Network: http://${location.hostname || 'localhost'}:${PORT}`,
  ].join(' | ');
  console.log(banner);
  const requiredEnv = [
    'VITE_GENAI_API_KEY',
    'VITE_GEMINI_API_KEY',
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID',
  ];
  const missing = requiredEnv.filter(k => !(import.meta.env as any)[k]);
  if (missing.length) {
    console.warn('Config warning: missing env', missing);
  }
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const method = init?.method || (typeof input === 'string' ? 'GET' : (input as Request).method);
    const url = typeof input === 'string' ? input : (input as Request).url;
    const start = performance.now();
    try {
      const res = await originalFetch(input as any, init);
      const dur = Math.round(performance.now() - start);
      if (state.verbose) console.info('[net]', method, url, res.status, dur + 'ms');
      return res;
    } catch (e) {
      const dur = Math.round(performance.now() - start);
      console.error('[net]', method, url, 'error', dur + 'ms', e);
      throw e;
    }
  };
  const XHR = window.XMLHttpRequest;
  const open = XHR.prototype.open;
  const send = XHR.prototype.send;
  XHR.prototype.open = function (method: string, url: string, async?: boolean, user?: string, password?: string) {
    (this as any).__nw_meta = { method, url };
    return open.call(this, method, url, async, user, password);
  };
  XHR.prototype.send = function (body?: Document | BodyInit | null) {
    const meta = (this as any).__nw_meta || {}; const start = performance.now();
    this.addEventListener('loadend', () => {
      const dur = Math.round(performance.now() - start);
      if (state.verbose) console.info('[net]', meta.method, meta.url, (this.status || 0), dur + 'ms');
    });
    return send.call(this, body as any);
  };
  const bp = (w: number) => w < 640 ? 'xs' : w < 768 ? 'sm' : w < 1024 ? 'md' : w < 1280 ? 'lg' : 'xl';
  let currentBp = bp(window.innerWidth);
  console.log('Viewport', window.innerWidth, currentBp);
  window.addEventListener('resize', () => {
    const next = bp(window.innerWidth);
    if (next !== currentBp) {
      currentBp = next;
      console.log('Breakpoint', next, window.innerWidth);
    }
  });
  const controls = {
    restart: () => {
      if ((import.meta as any).hot) (import.meta as any).hot.invalidate(); else location.reload();
    },
    toggleVerbose: () => { state.verbose = !state.verbose; console.log('Verbose', state.verbose ? 'on' : 'off'); },
    clearConsole: () => { console.clear(); console.log(banner); },
  };
  (window as any).__previewControls = controls;
  if ((import.meta as any).hot) {
    (import.meta as any).hot.on('vite:beforeUpdate', (e: any) => log('HMR beforeUpdate', e.type));
    (import.meta as any).hot.on('vite:afterUpdate', (e: any) => log('HMR afterUpdate', e.type));
    (import.meta as any).hot.on('vite:error', (err: any) => console.error('HMR error', err));
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

