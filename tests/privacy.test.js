import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { load } from 'cheerio';
import { pages } from '../src/seo/site.js';
import { privacyUrl, cookieUrl, openCookiePreferences } from '../src/privacy/consent.js';

test('every generated page loads the CMP once and exposes working policy links', () => {
  for (const page of [...pages, { path: '/404' }]) {
    const file = page.path === '/' ? 'dist/index.html' : `dist${page.path}.html`;
    const $ = load(readFileSync(file, 'utf8'));
    const scripts = $('head script[src]').map((_, el) => $(el).attr('src')).get();
    assert.equal(scripts.filter(src => src.includes('embeds.iubenda.com/widgets/')).length, 1, file);
    assert.ok(scripts.indexOf('/privacy-init.js') < scripts.findIndex(src => src.includes('embeds.iubenda.com')), file);
    assert.equal($(`footer a[href="${privacyUrl}"]`).length, 1, file);
    assert.equal($(`footer a[href="${cookieUrl}"]`).length, 1, file);
    assert.match($('footer button').text(), /Gestisci preferenze cookie/);
    assert.equal($('iframe[src*="google"]').length, 0, file);
  }
});

test('both contact views disclose email processing and link to the privacy policy', () => {
  for (const file of ['dist/index.html', 'dist/contatti.html']) {
    const $ = load(readFileSync(file, 'utf8'));
    assert.equal($(`.contact-privacy a[href="${privacyUrl}"]`).length, 1);
    assert.match($('.contact-privacy').text(), /Resend.*Plus Five Five/s);
    assert.match($('.contact-privacy').text(), /Ergonet/);
  }
});

test('the consent bridge notifies React after initial load and preference changes', () => {
  const tasks = [], events = [];
  const window = { setTimeout: fn => tasks.push(fn), dispatchEvent: event => events.push(event.type) };
  runInNewContext(readFileSync('public/privacy-init.js', 'utf8'), { window, Event });
  const callbacks = window._iub.csConfiguration.callback;
  callbacks.onReady();
  callbacks.onPreferenceExpressedOrNotNeeded();
  assert.equal(events.length, 0, 'read the preference after iubenda finishes saving it');
  tasks.forEach(fn => fn());
  assert.deepEqual(events, ['iubenda:preferences', 'iubenda:preferences']);
});

test('preferences control opens the CMP, with a policy fallback if unavailable', () => {
  const previousWindow = globalThis.window;
  let opened = 0, destination;
  try {
    globalThis.window = {
      _iub: { cs: { api: { openPreferences: () => opened++ } } },
      location: { assign: url => { destination = url; } },
    };
    openCookiePreferences();
    assert.equal(opened, 1);
    assert.equal(destination, undefined);
    delete globalThis.window._iub;
    openCookiePreferences();
    assert.equal(destination, cookieUrl);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
