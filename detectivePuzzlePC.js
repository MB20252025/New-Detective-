// ============================================================
//  detectivePuzzlePC.js — Alias for detectivePuzzle.js
//  (Both loaders point at hanoi-puzzle.html; kept for compat.)
// ============================================================
(function () {
  'use strict';

  var modalEl = null;
  var iframeEl = null;
  var solveCallback = null;
  var previousOverflow = '';

  window.showDetectivePuzzleModal = function (cb) {
    solveCallback = (typeof cb === 'function') ? cb : null;

    if (modalEl) return;

    previousOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';

    modalEl = document.createElement('div');
    modalEl.id = 'detectivePuzzleModal';
    modalEl.style.cssText = [
      'position:fixed',
      'inset:0',
      'width:100vw',
      'height:100vh',
      'z-index:99999',
      'background:#0a0e14',
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
      window.closeDetectivePuzzleModal();
    });
    modalEl.appendChild(closeBtn);

    iframeEl = document.createElement('iframe');
    iframeEl.id = 'detectivePuzzleIframe';
    iframeEl.src = 'hanoi-puzzle.html';
    iframeEl.style.cssText = [
      'width:100%',
      'height:100%',
      'border:none',
      'display:block',
      'background:#0a0e14'
    ].join(';');
    modalEl.appendChild(iframeEl);

    document.body.appendChild(modalEl);
  };

  window.closeDetectivePuzzleModal = function () {
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

    if (d.type === 'HANOI_SOLVED') {
      var cb = solveCallback;
      solveCallback = null;
      if (typeof cb === 'function') {
        try { cb(); } catch (e) { console.error('detectivePuzzle callback error:', e); }
      }
      return;
    }

    if (d.type === 'CLOSE_HANOI') {
      window.closeDetectivePuzzleModal();
      return;
    }
  });

  console.log('%c🗼 detectivePuzzlePC.js loaded', 'color:#d7b477;');
})();
