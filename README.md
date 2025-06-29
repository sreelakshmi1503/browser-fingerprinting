# @sl_1503/browser-fingerprinting

This is a browser-based custom fingerprinting tool that collects detailed client information using WebGL, Canvas, Audio, Network, Fonts, Plugins, and more. Designed for personalization and fraud detection use cases.


##  Installation

```bash
npm install @sl_1503/browser-fingerprinting
```

## Usage

### With a JavaScript Bundler (Vite, Webpack, etc.)

```js
import getFingerprint from '@sl_1503/browser-fingerprinting';

getFingerprint().then(fp => {
  console.log('Fingerprint Data:', fp.fingerprint);
  console.log('Your fingerprint:', fp.shortHash);
});
```

### In a Plain HTML File (via CDN)

If you're not using a bundler, you can use the CDN version for quick browser testing:

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
        console.log('Fingerprint:', fp.shortHash);
      });
    </script>
  </body>
</html>
```

##  Output Format

The function `getFingerprint()` returns a Promise that resolves to an object with the following structure:

```js
{
  fingerprint: { /* full data used for fingerprinting */ },
  fullHash: "fp_1a2b3c4d5e6f7g8h",   // Full unique hash (longer)
  shortHash: "1a2b3c4d5e6f"         // Shorter hash (12 characters)
}
```

* **`shortHash`**: Compact version suitable for use in cookies, headers, or URLs.
* **`fullHash`**: Complete version for maximum uniqueness, derived from all collected data.

