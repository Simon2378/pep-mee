(function () {
  'use strict';

  var HREF = 'https://wa.me/447516826329';
  var MESSAGE = 'Hello Kyle, I would like to place an order.';
  var DISMISS_KEY = 'pepticore_whatsapp_widget_dismissed';
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

  function whatsappHref() {
    return HREF + '?text=' + encodeURIComponent(MESSAGE);
  }

  function build() {
    if (isDismissed()) return;

    var href = whatsappHref();
    var trackAttrs = ' data-track-event="whatsapp_redirect" data-track-entity-type="support_widget" data-track-entity-id="whatsapp-support-widget"';

    var wrap = document.createElement('div');
    wrap.className = 'wa-support';
    wrap.innerHTML =
      '<div class="wa-support-bubble">' +
        '<button type="button" class="wa-support-close" aria-label="Dismiss">&times;</button>' +
        '<p class="wa-support-msg"><strong>Kyle</strong> · PeptidesPrescripts support<br>Hey, are you trying to order? Tap below and I’ll help you directly on WhatsApp.</p>' +
        '<a class="wa-support-cta" href="' + href + '" target="_blank" rel="noopener noreferrer"' + trackAttrs + ' data-track-label="WhatsApp support widget CTA">Yes, chat with Kyle</a>' +
      '</div>' +
      '<a class="wa-support-btn" href="' + href + '" target="_blank" rel="noopener noreferrer" aria-label="Chat with Kyle on WhatsApp"' + trackAttrs + ' data-track-label="WhatsApp support widget button">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.5 14.4c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.1c-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5s.2-.3.3-.5c.1-.2.1-.4 0-.5s-.7-1.7-1-2.3-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.1 3c.1.2 2 3.1 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.5-.2z"/><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15l-1.4 5.1 5.2-1.4A10 10 0 1 0 12 2zm5.9 15.9a8 8 0 0 1-10.1.9l-.4-.2-3 .8.8-3-.2-.4A8 8 0 1 1 17.9 17.9z"/></svg>' +
      '</a>';

    document.body.appendChild(wrap);

    wrap.querySelector('.wa-support-close').addEventListener('click', function (e) {
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
