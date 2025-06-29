# @sl_1503/browser-fingerprinting

A browser-based custom fingerprinting tool that collects detailed client information using WebGL, Canvas, Audio, Network, Fonts, Plugins, and more.

Ideal for personalization, analytics, and fraud detection use cases.

---

## Installation

```bash
npm install @sl_1503/browser-fingerprinting
````

---

## Usage

### With JavaScript Bundler (Vite, Webpack, etc.)

```js
import getFingerprint from '@sl_1503/browser-fingerprinting';

getFingerprint().then(fp => {
  console.log('Fingerprint Data:', fp.fingerprint);
  console.log('Fingerprint ID:', fp.shortHash);
});
```

---

### In a Plain HTML File (via CDN)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Browser Fingerprint Test</title>
  </head>
  <body>
    <p>Open console to see fingerprint data</p>
    <script type="module">
      import getFingerprint from 'https://unpkg.com/@sl_1503/browser-fingerprinting/dist/index.esm.js';

      getFingerprint().then(fp => {
        console.log('Fingerprint Data:', fp.fingerprint);
        console.log('Fingerprint ID:', fp.shortHash);
      });
    </script>
  </body>
</html>
```

---

## Output Format

The function `getFingerprint()` returns a Promise that resolves to:

```js
{
  fingerprint: { /* full data used for fingerprintin */ },
  shortHash: "fp_b3c4d5e6"  // unique fingerprint ID
}
```

* `fingerprint`: Full detailed fingerprint object with device, browser, and network attributes.
* `shortHash`: Compact unique ID for use in cookies, headers, logs, etc.

---

## Framework-Specific Usage

### React (Vite or CRA)

```jsx
useEffect(() => {
  getFingerprint().then(fp => {
    console.log(fp.fingerprint);
    console.log(fp.shortHash);
  });
}, []);
```

### Vue 3

```vue
<script setup>
import { onMounted } from 'vue';
import getFingerprint from '@sl_1503/browser-fingerprinting';

onMounted(() => {
  getFingerprint().then(fp => {
    console.log(fp.fingerprint);
    console.log(fp.shortHash);
  });
});
</script>
```

### Next.js (React SSR)

```jsx
useEffect(() => {
  getFingerprint().then(fp => {
    console.log(fp.fingerprint);
    console.log(fp.shortHash);
  });
}, []);
```

---

