(function () {
  'use strict';

  var HREF = 'https://t.me/kyle_pep';
  var MESSAGE = 'Hello Kyle, I would like to place an order.';
  var DISMISS_KEY = 'pepticore_telegram_widget_dismissed';
  var SHOW_DELAY_MS = 3000;
  var SCROLL_THRESHOLD = 120;

  function isDismissed() {
    try {
      return window.sessionStorage && sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setDismissed() {
    try {
      if (window.sessionStorage) sessionStorage.setItem(DISMISS_KEY, '1');
    } catch (e) {}
  }

  function telegramHref() {
    return HREF + '?text=' + encodeURIComponent(MESSAGE);
  }

  function build() {
    if (isDismissed()) return;

    var href = telegramHref();
    var trackAttrs = ' data-track-event="telegram_redirect" data-track-entity-type="support_widget" data-track-entity-id="telegram-support-widget"';

    var wrap = document.createElement('div');
    wrap.className = 'tg-support';
    wrap.innerHTML =
      '<div class="tg-support-bubble">' +
        '<button type="button" class="tg-support-close" aria-label="Dismiss">&times;</button>' +
        '<p class="tg-support-msg"><strong>Kyle</strong> · PeptidesPrescripts support<br>Hey, are you trying to order? Tap below and I’ll help you directly on Telegram.</p>' +
        '<a class="tg-support-cta" href="' + href + '" target="_blank" rel="noopener noreferrer"' + trackAttrs + ' data-track-label="Telegram support widget CTA">Yes, chat with Kyle</a>' +
      '</div>' +
      '<a class="tg-support-btn" href="' + href + '" target="_blank" rel="noopener noreferrer" aria-label="Chat with Kyle on Telegram"' + trackAttrs + ' data-track-label="Telegram support widget button">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.94 6.86-1.66 7.82c-.12.56-.46.7-.94.43l-2.6-1.92-1.25 1.2c-.14.14-.26.26-.53.26l.19-2.69 4.9-4.43c.21-.19-.05-.3-.33-.11l-6.06 3.81-2.61-.82c-.57-.18-.58-.57.12-.84l10.2-3.93c.47-.17.89.11.57.62z"/></svg>' +
      '</a>';

    document.body.appendChild(wrap);

    wrap.querySelector('.tg-support-close').addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      wrap.classList.remove('is-open');
      setDismissed();
      window.setTimeout(function () { wrap.remove(); }, 240);
    });

    var revealed = false;
    function reveal() {
      if (revealed || isDismissed()) return;
      revealed = true;
      window.requestAnimationFrame(function () { wrap.classList.add('is-open'); });
    }

    window.setTimeout(reveal, SHOW_DELAY_MS);
    window.addEventListener('scroll', function onScroll() {
      if (window.pageYOffset > SCROLL_THRESHOLD) {
        reveal();
        window.removeEventListener('scroll', onScroll);
      }
    }, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build, { once: true });
  else build();
}());
