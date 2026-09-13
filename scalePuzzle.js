// ============================================================
//  scalePuzzle.js — Modal loader for The Balance of Justice
// ============================================================
(function () {
  'use strict';

  var modalEl = null;
  var iframeEl = null;
  var solveCallback = null;
  var previousOverflow = '';

  window.showScalePuzzleModal = function (cb) {
    solveCallback = (typeof cb === 'function') ? cb : null;

    if (modalEl) return;

    previousOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';

    modalEl = document.createElement('div');
    modalEl.id = 'scalePuzzleModal';
    modalEl.style.cssText = [
      'position:fixed',
      'inset:0',
      'width:100vw',
      'height:100vh',
      'z-index:99999',
      'background:#1a140e',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'padding:0',
      'margin:0',
      'overflow:hidden'
    ].join(';');

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = '✕ CLOSE';
    closeBtn.style.cssText = [
      'position:fixed',
      'top:18px',
      'right:22px',
      'z-index:100001',
      'background:#a13d3d',
      'color:#fff',
      'border:none',
      'padding:10px 20px',
      'border-radius:30px',
      'cursor:pointer',
      'font-family:monospace',
      'font-weight:bold',
      'font-size:0.95rem',
      'letter-spacing:1px',
      'box-shadow:0 4px 0 #5c2020'
    ].join(';');
    closeBtn.addEventListener('click', function () {
      window.closeScalePuzzleModal();
    });
    modalEl.appendChild(closeBtn);

    iframeEl = document.createElement('iframe');
    iframeEl.id = 'scalePuzzleIframe';
    iframeEl.src = 'scalePuzzle.html';
    iframeEl.style.cssText = [
      'width:100%',
      'height:100%',
      'border:none',
      'display:block',
      'background:#1a140e'
    ].join(';');
    modalEl.appendChild(iframeEl);

    document.body.appendChild(modalEl);
  };

  window.closeScalePuzzleModal = function () {
    if (modalEl && modalEl.parentNode) modalEl.parentNode.removeChild(modalEl);
    modalEl = null;
    iframeEl = null;
    solveCallback = null;
    document.body.style.overflow = previousOverflow;
    previousOverflow = '';
  };

  window.addEventListener('message', function (event) {
    var d = event.data;
    if (!d || typeof d !== 'object') return;

    if (d.type === 'SCALE_PUZZLE_SOLVED') {
      var cb = solveCallback;
      solveCallback = null;
      if (typeof cb === 'function') {
        try { cb(); } catch (e) { console.error('scalePuzzle callback error:', e); }
      }
      return;
    }

    if (d.type === 'CLOSE_SCALE_PUZZLE') {
      window.closeScalePuzzleModal();
      return;
    }
  });

  console.log('%c⚖️ scalePuzzle.js loaded', 'color:#d7b477;');
})();
