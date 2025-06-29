// src/index.js

function safe(fn, fallback = 'unsupported') {
  try { return fn(); } catch { return fallback; }
}

function stableStringify(obj) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const sorted = {};
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = stableStringify(obj[key]);
    });
    return JSON.stringify(sorted);
  } else if (Array.isArray(obj)) {
    return JSON.stringify(obj.map(stableStringify));
  }
  return JSON.stringify(obj);
}

function hashFingerprint(obj) {
  const str = stableStringify(obj);
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return ('fp_' + (hash >>> 0).toString(16));
}

function getCanvasFingerprint() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillStyle = '#f60';
  ctx.fillRect(0, 0, 100, 100);
  ctx.fillStyle = '#069';
  ctx.fillText('custom_fp_test', 10, 10);
  return canvas.toDataURL();
}

function getWebGLFingerprint() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return 'unsupported';
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';
  const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
  return `${vendor}~${renderer}`;
}

function getWebGLExtensions() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl ? gl.getSupportedExtensions() : 'unsupported';
  } catch {
    return 'unsupported';
  }
}

async function getAudioFingerprint() {
  try {
    const ctx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100);
    const osc = ctx.createOscillator();
    const comp = ctx.createDynamicsCompressor();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(10000, ctx.currentTime);
    comp.threshold.setValueAtTime(-50, ctx.currentTime);
    comp.knee.setValueAtTime(40, ctx.currentTime);
    comp.ratio.setValueAtTime(12, ctx.currentTime);
    comp.attack.setValueAtTime(0, ctx.currentTime);
    comp.release.setValueAtTime(0.25, ctx.currentTime);
    osc.connect(comp); comp.connect(ctx.destination); osc.start(0); ctx.startRendering();
    return new Promise(resolve => {
      ctx.oncomplete = event => {
        const fp = event.renderedBuffer.getChannelData(0).slice(0, 30).join(',');
        resolve(fp);
      };
    });
  } catch {
    return 'unsupported';
  }
}

function detectFonts() {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testFonts = ['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana'];
  const detected = [];
  const span = document.createElement('span');
  span.style.position = 'absolute';
  span.style.left = '-9999px';
  span.style.fontSize = '72px';
  span.textContent = 'mmmmmmmmmmlli';
  document.body.appendChild(span);
  baseFonts.forEach(base => {
    span.style.fontFamily = base;
    const defaultWidth = span.offsetWidth;
    testFonts.forEach(font => {
      span.style.fontFamily = `${font},${base}`;
      if (span.offsetWidth !== defaultWidth && !detected.includes(font)) {
        detected.push(font);
      }
    });
  });
  document.body.removeChild(span);
  return detected;
}

function detectPlugins() {
  if (!navigator.plugins) return 'unsupported';
  return Array.from(navigator.plugins).map(p => p.name);
}

function detectAutomation() {
  return {
    webdriver: navigator.webdriver || false,
    isHeadless: /HeadlessChrome/.test(navigator.userAgent),
    pluginsEmpty: (navigator.plugins.length === 0),
    screenTooPerfect: window.outerWidth === 800 && window.outerHeight === 600
  };
}

function getOrientation() {
  return screen.orientation?.type || window.orientation || 'unknown';
}

async function getWebRTCLocalIP() {
  return new Promise(resolve => {
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    pc.createOffer().then(offer => pc.setLocalDescription(offer));
    pc.onicecandidate = event => {
      if (!event || !event.candidate) return;
      const ipMatch = event.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
      if (ipMatch) resolve(ipMatch[1]);
      pc.close();
    };
    setTimeout(() => resolve('unavailable'), 1000);
  });
}

async function getPublicIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return 'unavailable';
  }
}

async function getMediaDevices() {
  if (!navigator.mediaDevices?.enumerateDevices) return 'unsupported';
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.map(d => `${d.kind}:${d.label || 'hidden'}`);
  } catch {
    return 'unavailable';
  }
}

function detectTouchSupport() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function getNetworkInfo() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return conn ? {
    type: conn.type,
    effectiveType: conn.effectiveType,
    downlink: conn.downlink,
    rtt: conn.rtt
  } : 'unsupported';
}

function getSpeechVoices() {
  return new Promise(resolve => {
    let voices = speechSynthesis.getVoices();
    if (voices.length) return resolve(voices.map(v => v.name));
    speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices().map(v => v.name));
  });
}

function getColorScheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getDeviceIdentity() {
  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android/i.test(ua);
  const isTablet = /Tablet|iPad/i.test(ua);
  const deviceType = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";
  let deviceLabel = "Unknown Device";
  if (/iPhone/.test(ua)) deviceLabel = "iPhone";
  else if (/iPad/.test(ua)) deviceLabel = "iPad";
  else if (/Macintosh/.test(ua)) deviceLabel = "Mac";
  else if (/Android/.test(ua)) {
    const match = ua.match(/Android.*;\s([^)]+)/);
    deviceLabel = match ? match[1].trim() : "Android device";
  } else if (/Windows/.test(ua)) deviceLabel = "Windows PC";
  return { deviceType, deviceLabel };
}

async function getFingerprint() {
  const [
    audioFingerprint,
    localIP,
    publicIP,
    mediaDevices,
    speechVoices
  ] = await Promise.all([
    getAudioFingerprint(),
    getWebRTCLocalIP(),
    getPublicIP(),
    getMediaDevices(),
    getSpeechVoices()
  ]);

  const deviceInfo = getDeviceIdentity();

  const fingerprint = {
    userAgent: navigator.userAgent,
    languages: navigator.languages || [],
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezoneOffset: new Date().getTimezoneOffset(),
    timeZone: safe(() => Intl.DateTimeFormat().resolvedOptions().timeZone),
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    deviceMemory: navigator.deviceMemory || 'unknown',
    maxTouchPoints: navigator.maxTouchPoints || 0,
    touchSupport: detectTouchSupport(),
    devicePixelRatio: window.devicePixelRatio || 1,
    canvasFingerprint: safe(getCanvasFingerprint),
    webGLFingerprint: safe(getWebGLFingerprint),
    webGLExtensions: safe(getWebGLExtensions),
    audioFingerprint,
    fonts: safe(detectFonts),
    plugins: safe(detectPlugins),
    orientation: getOrientation(),
    mathFingerprint: [
      Math.acos(0.123456789),
      Math.sin(1),
      Math.tan(1),
      Math.exp(1)
    ].join(','),
    webRTCLocalIP: localIP,
    publicIP: publicIP,
    mediaDevices,
    automationFlags: detectAutomation(),
    networkInfo: getNetworkInfo(),
    speechVoices,
    preferredColorScheme: getColorScheme(),
    deviceType: deviceInfo.deviceType,
    deviceLabel: deviceInfo.deviceLabel,
    deviceCapabilities: {
      bluetooth: !!navigator.bluetooth,
      usb: !!navigator.usb
    },
    featureFlags: {
      localStorage: typeof localStorage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      indexedDB: !!window.indexedDB,
      serviceWorker: 'serviceWorker' in navigator,
      webRTC: typeof RTCPeerConnection !== 'undefined'
    }
  };

  const fullHash = hashFingerprint(fingerprint);
  const shortHash = fullHash.slice(0, 12);

  return { fingerprint, shortHash };
}

export { getFingerprint };
export default getFingerprint;
