function s(e, t = "unsupported") {
  try {
    return e();
  } catch {
    return t;
  }
}
function c(e) {
  if (e && typeof e == "object" && !Array.isArray(e)) {
    const t = {};
    return Object.keys(e).sort().forEach((n) => {
      t[n] = c(e[n]);
    }), JSON.stringify(t);
  } else if (Array.isArray(e))
    return JSON.stringify(e.map(c));
  return JSON.stringify(e);
}
function l(e) {
  const t = c(e);
  let n = 5381;
  for (let i = 0; i < t.length; i++)
    n = n * 33 ^ t.charCodeAt(i);
  return "fp_" + (n >>> 0).toString(16);
}
function d() {
  const e = document.createElement("canvas"), t = e.getContext("2d");
  return t.textBaseline = "top", t.font = "14px Arial", t.fillStyle = "#f60", t.fillRect(0, 0, 100, 100), t.fillStyle = "#069", t.fillText("custom_fp_test", 10, 10), e.toDataURL();
}
function f() {
  const e = document.createElement("canvas"), t = e.getContext("webgl") || e.getContext("experimental-webgl");
  if (!t) return "unsupported";
  const n = t.getExtension("WEBGL_debug_renderer_info"), i = n ? t.getParameter(n.UNMASKED_VENDOR_WEBGL) : "unknown", o = n ? t.getParameter(n.UNMASKED_RENDERER_WEBGL) : "unknown";
  return `${i}~${o}`;
}
function g() {
  try {
    const e = document.createElement("canvas"), t = e.getContext("webgl") || e.getContext("experimental-webgl");
    return t ? t.getSupportedExtensions() : "unsupported";
  } catch {
    return "unsupported";
  }
}
async function p() {
  try {
    const e = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100), t = e.createOscillator(), n = e.createDynamicsCompressor();
    return t.type = "triangle", t.frequency.setValueAtTime(1e4, e.currentTime), n.threshold.setValueAtTime(-50, e.currentTime), n.knee.setValueAtTime(40, e.currentTime), n.ratio.setValueAtTime(12, e.currentTime), n.attack.setValueAtTime(0, e.currentTime), n.release.setValueAtTime(0.25, e.currentTime), t.connect(n), n.connect(e.destination), t.start(0), e.startRendering(), new Promise((i) => {
      e.oncomplete = (o) => {
        const r = o.renderedBuffer.getChannelData(0).slice(0, 30).join(",");
        i(r);
      };
    });
  } catch {
    return "unsupported";
  }
}
function m() {
  const e = ["monospace", "sans-serif", "serif"], t = ["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana"], n = [], i = document.createElement("span");
  return i.style.position = "absolute", i.style.left = "-9999px", i.style.fontSize = "72px", i.textContent = "mmmmmmmmmmlli", document.body.appendChild(i), e.forEach((o) => {
    i.style.fontFamily = o;
    const r = i.offsetWidth;
    t.forEach((a) => {
      i.style.fontFamily = `${a},${o}`, i.offsetWidth !== r && !n.includes(a) && n.push(a);
    });
  }), document.body.removeChild(i), n;
}
function h() {
  return navigator.plugins ? Array.from(navigator.plugins).map((e) => e.name) : "unsupported";
}
function v() {
  return {
    webdriver: navigator.webdriver || !1,
    isHeadless: /HeadlessChrome/.test(navigator.userAgent),
    pluginsEmpty: navigator.plugins.length === 0,
    screenTooPerfect: window.outerWidth === 800 && window.outerHeight === 600
  };
}
function w() {
  var e;
  return ((e = screen.orientation) == null ? void 0 : e.type) || window.orientation || "unknown";
}
async function y() {
  return new Promise((e) => {
    const t = new RTCPeerConnection({ iceServers: [] });
    t.createDataChannel(""), t.createOffer().then((n) => t.setLocalDescription(n)), t.onicecandidate = (n) => {
      if (!n || !n.candidate) return;
      const i = n.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
      i && e(i[1]), t.close();
    }, setTimeout(() => e("unavailable"), 1e3);
  });
}
async function b() {
  try {
    return (await (await fetch("https://api.ipify.org?format=json")).json()).ip;
  } catch {
    return "unavailable";
  }
}
async function T() {
  var e;
  if (!((e = navigator.mediaDevices) != null && e.enumerateDevices)) return "unsupported";
  try {
    return (await navigator.mediaDevices.enumerateDevices()).map((n) => `${n.kind}:${n.label || "hidden"}`);
  } catch {
    return "unavailable";
  }
}
function C() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
function x() {
  const e = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return e ? {
    type: e.type,
    effectiveType: e.effectiveType,
    downlink: e.downlink,
    rtt: e.rtt
  } : "unsupported";
}
function A() {
  return new Promise((e) => {
    let t = speechSynthesis.getVoices();
    if (t.length) return e(t.map((n) => n.name));
    speechSynthesis.onvoiceschanged = () => e(speechSynthesis.getVoices().map((n) => n.name));
  });
}
function P() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function S() {
  const e = navigator.userAgent, t = /Mobi|Android/i.test(e), i = /Tablet|iPad/i.test(e) ? "tablet" : t ? "mobile" : "desktop";
  let o = "Unknown Device";
  if (/iPhone/.test(e)) o = "iPhone";
  else if (/iPad/.test(e)) o = "iPad";
  else if (/Macintosh/.test(e)) o = "Mac";
  else if (/Android/.test(e)) {
    const r = e.match(/Android.*;\s([^)]+)/);
    o = r ? r[1].trim() : "Android device";
  } else /Windows/.test(e) && (o = "Windows PC");
  return { deviceType: i, deviceLabel: o };
}
async function E() {
  const [
    e,
    t,
    n,
    i,
    o
  ] = await Promise.all([
    p(),
    y(),
    b(),
    T(),
    A()
  ]), r = S(), a = {
    userAgent: navigator.userAgent,
    languages: navigator.languages || [],
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezoneOffset: (/* @__PURE__ */ new Date()).getTimezoneOffset(),
    timeZone: s(() => Intl.DateTimeFormat().resolvedOptions().timeZone),
    hardwareConcurrency: navigator.hardwareConcurrency || "unknown",
    deviceMemory: navigator.deviceMemory || "unknown",
    maxTouchPoints: navigator.maxTouchPoints || 0,
    touchSupport: C(),
    devicePixelRatio: window.devicePixelRatio || 1,
    canvasFingerprint: s(d),
    webGLFingerprint: s(f),
    webGLExtensions: s(g),
    audioFingerprint: e,
    fonts: s(m),
    plugins: s(h),
    orientation: w(),
    mathFingerprint: [
      Math.acos(0.123456789),
      Math.sin(1),
      Math.tan(1),
      Math.exp(1)
    ].join(","),
    webRTCLocalIP: t,
    publicIP: n,
    mediaDevices: i,
    automationFlags: v(),
    networkInfo: x(),
    speechVoices: o,
    preferredColorScheme: P(),
    deviceType: r.deviceType,
    deviceLabel: r.deviceLabel,
    deviceCapabilities: {
      bluetooth: !!navigator.bluetooth,
      usb: !!navigator.usb
    },
    featureFlags: {
      localStorage: typeof localStorage < "u",
      sessionStorage: typeof sessionStorage < "u",
      indexedDB: !!window.indexedDB,
      serviceWorker: "serviceWorker" in navigator,
      webRTC: typeof RTCPeerConnection < "u"
    }
  }, u = l(a).slice(0, 12);
  return { fingerprint: a, shortHash: u };
}
export {
  E as default,
  E as getFingerprint
};
