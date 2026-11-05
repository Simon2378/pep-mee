(function () {
  'use strict';

  // Adds an "Account" button to the top navigation. Accounts aren't available
  // yet, so clicking it opens a small popup that points visitors to the catalog.

  var CATALOG_URL = '/catalog';
  var ICON = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="8.5" r="3.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5 19.5c1.3-3.3 4-5 7-5s5.7 1.7 7 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

  var CSS =
    '.acct-btn{height:36px;padding:0 12px;display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line,rgba(15,16,17,.08));border-radius:999px;color:var(--muted,#6E6E74);font:inherit;font-size:13px;background:rgba(255,255,255,.5);cursor:pointer;transition:border-color .2s,color .2s,background .2s}' +
    '.acct-btn:hover{color:var(--ink,#111113);border-color:var(--line-2,rgba(15,16,17,.14));background:#fff}' +
    '@media (max-width:760px){.nav-right .acct-btn span{display:none}.nav-right .acct-btn{padding:0;width:36px;justify-content:center}}' +
    '.acct-pop{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,16,17,.42);opacity:0;transition:opacity .2s}' +
    '.acct-pop.is-open{opacity:1}' +
    '.acct-pop-box{position:relative;width:100%;max-width:380px;background:var(--bg,#FAF8F4);color:var(--ink,#111113);border-radius:18px;padding:28px 24px 22px;box-shadow:0 24px 60px rgba(15,16,17,.22);text-align:center;transform:translateY(10px);transition:transform .2s}' +
    '.acct-pop.is-open .acct-pop-box{transform:none}' +
    '.acct-pop-box h2{font-family:var(--serif,Georgia,serif);font-weight:500;font-size:24px;line-height:1.2;margin:0 0 10px}' +
    '.acct-pop-box p{margin:0 0 20px;color:var(--muted,#6E6E74);font-size:15px;line-height:1.5}' +
    '.acct-pop-go{display:block;width:100%;padding:13px 16px;border-radius:999px;background:var(--accent,#2E5339);color:#fff;font-weight:600;text-decoration:none;font-size:15px}' +
    '.acct-pop-go:hover{filter:brightness(1.1)}' +
    '.acct-pop-later{margin-top:10px;background:none;border:0;color:var(--muted,#6E6E74);font:inherit;font-size:14px;cursor:pointer;padding:8px}' +
    '.acct-pop-x{position:absolute;top:10px;right:12px;background:none;border:0;font-size:24px;line-height:1;color:var(--muted,#6E6E74);cursor:pointer;padding:4px 8px}';

  var pop = null;
  var lastFocus = null;

  function track(label) {
    try {
      if (window.va) window.va('event', { name: 'account_prompt', data: { action: label } });
    } catch (e) {}
  }

  function close() {
    if (!pop) return;
    var el = pop;
    pop = null;
    el.classList.remove('is-open');
    document.removeEventListener('keydown', onKey);
    window.setTimeout(function () { el.remove(); }, 200);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
  }

  function open(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (pop) return;
    lastFocus = document.activeElement;
    pop = document.createElement('div');
    pop.className = 'acct-pop';
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-modal', 'true');
    pop.setAttribute('aria-labelledby', 'acctPopTitle');
    pop.innerHTML =
      '<div class="acct-pop-box">' +
        '<button type="button" class="acct-pop-x" aria-label="Close">&times;</button>' +
        '<h2 id="acctPopTitle">Want to check our catalog?</h2>' +
        '<p>Accounts are coming soon. In the meantime you can browse every product, see prices and order straight from the catalog.</p>' +
        '<a class="acct-pop-go" href="' + CATALOG_URL + '">Click here to check the catalog</a>' +
        '<button type="button" class="acct-pop-later">Maybe later</button>' +
      '</div>';
    document.body.appendChild(pop);
    pop.addEventListener('click', function (ev) { if (ev.target === pop) close(); });
    pop.querySelector('.acct-pop-x').addEventListener('click', close);
    pop.querySelector('.acct-pop-later').addEventListener('click', close);
    pop.querySelector('.acct-pop-go').addEventListener('click', function () { track('go_catalog'); });
    document.addEventListener('keydown', onKey);
    window.requestAnimationFrame(function () { if (pop) pop.classList.add('is-open'); });
    pop.querySelector('.acct-pop-go').focus();
    track('open');
  }

  function makeButton() {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'acct-btn';
    b.setAttribute('aria-label', 'Account');
    b.innerHTML = ICON + '<span>Account</span>';
    b.addEventListener('click', open);
    return b;
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Homepage / app navigation: place before the cart button.
    var navRight = document.querySelector('.nav-right');
    if (navRight) {
      var cart = navRight.querySelector('#openCart');
      navRight.insertBefore(makeButton(), cart || null);
      return;
    }
    // Static pages (catalog, products, guides...): add to the end of the nav links.
    var seoNav = document.querySelector('.seo-nav');
    if (seoNav) {
      var a = document.createElement('a');
      a.href = '#account';
      a.textContent = 'Account';
      a.addEventListener('click', open);
      seoNav.appendChild(a);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());
