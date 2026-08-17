import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const port = 9333;
const previewPort = process.env.PREVIEW_PORT || '4321';
const screenshotDir = process.env.QA_SCREENSHOT_DIR;
if (screenshotDir) await mkdir(screenshotDir, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), 'doloc-chrome-'));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${profile}`,
  `--remote-debugging-port=${port}`, '--window-size=1280,900', `http://127.0.0.1:${previewPort}/guides/`
], { stdio: 'ignore' });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let target;
for (let attempt = 0; attempt < 30; attempt += 1) {
  try {
    const tabs = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
    target = tabs.find((tab) => tab.type === 'page');
    if (target) break;
  } catch {}
  await wait(100);
}

try {
  assert.ok(target, 'Chrome page target did not become ready');
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let requestId = 0;
  const pending = new Map();
  const consoleErrors = [];
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message.result);
      pending.delete(message.id);
    }
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') consoleErrors.push(message.params.args.map((arg) => arg.value ?? arg.description).join(' '));
    if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') consoleErrors.push(message.params.entry.text);
  };
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = ++requestId;
    pending.set(id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');
  const matrix = JSON.parse(await readFile(new URL('../src/data/site-matrix.json', import.meta.url), 'utf8'));
  const routes = [
    { path: '', type: 'home' },
    ...matrix.categories.map((category) => ({ path: category.slug, type: 'category' })),
    ...matrix.categories.flatMap((category) => category.guides.map((guide) => ({ path: `${category.slug}/${guide.slug}`, type: 'guide' }))),
    { path: '404.html', type: '404' },
  ].filter((route) => !process.env.QA_ROUTE || route.path === process.env.QA_ROUTE);
  const viewports = [
    { width: 390, height: 844, mobile: true },
    { width: 768, height: 1024, mobile: true },
    { width: 1280, height: 800, mobile: false },
    { width: 1440, height: 900, mobile: false },
  ];
  const screenshotRoutes = new Set(['', 'farming', 'characters-items/old-engine-cores', '404.html']);
  for (const viewport of viewports) {
    await send('Emulation.setDeviceMetricsOverride', { ...viewport, deviceScaleFactor: 1 });
    for (const route of routes) {
      const routeSuffix = route.path.endsWith('.html') ? route.path : `${route.path}/`;
      await send('Page.navigate', { url: `http://127.0.0.1:${previewPort}/${routeSuffix}` });
      await wait(150);
      const evaluated = await send('Runtime.evaluate', {
        expression: `({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth,
          menuVisible: getComputedStyle(document.querySelector('.mobile-nav')).display !== 'none',
          h1Count: document.querySelectorAll('h1').length,
          guideGrid: Boolean(document.querySelector('.guide-grid')),
          guideArticle: Boolean(document.querySelector('.guide-article')),
          toc: Boolean(document.querySelector('[aria-label="On this page"]')),
          breadcrumb: Boolean(document.querySelector('[aria-label="Breadcrumb"]')),
          breadcrumbListStyle: document.querySelector('.breadcrumbs ol') ? getComputedStyle(document.querySelector('.breadcrumbs ol')).listStyleType : null,
          sourceRefCount: document.querySelectorAll('.source-ref').length,
          sourceSections: document.querySelectorAll('.source-section').length,
          footerVisible: document.querySelector('footer').getBoundingClientRect().width > 0,
          h1Top: document.querySelector('h1').getBoundingClientRect().top,
          clippedText: [...document.querySelectorAll('main *, footer *')].filter((element) => {
            const style = getComputedStyle(element);
            return element.textContent.trim() && element.scrollWidth > element.clientWidth + 1 && ['hidden', 'clip'].includes(style.overflowX) && element.getAttribute('aria-hidden') !== 'true';
          }).map((element) => element.tagName + '.' + element.className).slice(0, 5),
          outsideViewport: [...document.querySelectorAll('main *, footer *')].filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1);
          }).map((element) => element.tagName + '.' + element.className).slice(0, 5),
          positiveTabIndexes: [...document.querySelectorAll('[tabindex]')].filter((element) => element.tabIndex > 0).map((element) => element.tagName + '#' + element.id),
          mainRight: document.querySelector('main').getBoundingClientRect().right,
          mainLeft: document.querySelector('main').getBoundingClientRect().left
        })`,
        returnByValue: true,
      });
      const metrics = evaluated.result.value;
      const label = route.type === '404' ? '/404.html' : `/${route.path}/`.replace('//', '/');
      assert.equal(metrics.innerWidth, viewport.width, `${label} must use the ${viewport.width}px viewport`);
      assert.equal(metrics.menuVisible, viewport.mobile, `${label} navigation mode must match ${viewport.width}px`);
      assert.equal(metrics.h1Count, 1, `${label} must have one H1`);
      if (route.type === 'category') assert.equal(metrics.guideGrid, true, `${label} must render its guide grid`);
      if (route.type === 'guide') {
        assert.equal(metrics.guideArticle, true, `${label} must render its guide article`);
        assert.equal(metrics.toc, true, `${label} must render its contents navigation`);
        assert.ok(metrics.sourceRefCount > 0, `${label} must render SourceRef links`);
        assert.equal(metrics.sourceSections, 1, `${label} must hide the empty reference section and render additional research links`);
      }
      if (!['home', '404'].includes(route.type)) {
        assert.equal(metrics.breadcrumb, true, `${label} must render breadcrumbs`);
        assert.equal(metrics.breadcrumbListStyle, 'none', `${label} breadcrumb must not show default numbering`);
      }
      assert.equal(metrics.footerVisible, true, `${label} must render its footer`);
      assert.ok(metrics.h1Top >= 0 && metrics.h1Top < viewport.height * .8, `${label} H1 has abnormal top spacing at ${viewport.width}px`);
      assert.deepEqual(metrics.clippedText, [], `${label} has clipped text at ${viewport.width}px`);
      assert.deepEqual(metrics.outsideViewport, [], `${label} has elements outside ${viewport.width}px viewport`);
      assert.deepEqual(metrics.positiveTabIndexes, [], `${label} must preserve natural tab order`);
      assert.ok(metrics.mainLeft >= 0 && metrics.mainRight <= metrics.innerWidth, `${label} main content must stay inside the viewport`);
      assert.ok(metrics.scrollWidth <= metrics.innerWidth, `${label} overflows at ${viewport.width}px: ${metrics.scrollWidth}px > ${metrics.innerWidth}px`);
      if (viewport.width === 390) {
        await send('Runtime.evaluate', { expression: `document.querySelector('#mobile-menu-toggle').focus()` });
        await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space' });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space' });
        const opened = await send('Runtime.evaluate', {
          expression: `({ opened: document.querySelector('#mobile-menu-toggle').getAttribute('aria-expanded') === 'true' && !document.querySelector('#mobile-menu').hidden })`,
          returnByValue: true,
        });
        await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
        const closed = await send('Runtime.evaluate', {
          expression: `({ closed: document.querySelector('#mobile-menu-toggle').getAttribute('aria-expanded') === 'false' && document.querySelector('#mobile-menu').hidden, focusReturned: document.activeElement === document.querySelector('#mobile-menu-toggle') })`,
          returnByValue: true,
        });
        assert.deepEqual({ ...opened.result.value, ...closed.result.value }, { opened: true, closed: true, focusReturned: true }, `${label} mobile menu keyboard contract failed`);
      }
      if (screenshotDir && screenshotRoutes.has(route.path)) {
        const capture = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
        const name = (route.path || 'home').replaceAll('/', '-') + `-${viewport.width}.png`;
        await writeFile(join(screenshotDir, name), Buffer.from(capture.data, 'base64'));
      }
      console.log(`Responsive check passed: ${label} at ${viewport.width}px (${metrics.scrollWidth}px content width)`);
    }
  }
  assert.deepEqual(consoleErrors, [], `browser console errors: ${consoleErrors.join(' | ')}`);
  console.log('Browser console check passed: 0 errors');
  socket.close();
} finally {
  chrome.kill('SIGTERM');
}
