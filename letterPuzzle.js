// ============================================================
//  letterPuzzle.js — Modal loader for The Bragger's Note
// ============================================================
(function () {
  'use strict';

  var modalEl = null;
  var iframeEl = null;
  var solveCallback = null;

  // ──────────────────────────────────────────────────────────
  //  showLetterPuzzleModal(callback)
  // ──────────────────────────────────────────────────────────
  window.showLetterPuzzleModal = function (cb) {
    solveCallback = (typeof cb === 'function') ? cb : null;

    if (modalEl) return;   // already open

    modalEl = document.createElement('div');
    modalEl.id = 'letterPuzzleModal';
    modalEl.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:9000',
      'background:rgba(0,0,0,0.88)',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'padding:16px',
      'backdrop-filter:blur(4px)'
    ].join(';');

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = '✕ CLOSE';
    closeBtn.style.cssText = [
      'position:absolute',
      'top:18px',
      'right:22px',
      'z-index:10',
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
      window.closeLetterPuzzleModal();
    });
    modalEl.appendChild(closeBtn);

    iframeEl = document.createElement('iframe');
    iframeEl.id = 'letterPuzzleIframe';
    iframeEl.src = 'letterPuzzle.html';
    iframeEl.style.cssText = [
      'width:100%',
      'max-width:820px',
      'height:92vh',
      'border:none',
      'border-radius:16px',
      'background:#1a1a2a',
      'box-shadow:0 20px 60px rgba(0,0,0,0.6)'
    ].join(';');
    modalEl.appendChild(iframeEl);

    document.body.appendChild(modalEl);
  };

  // ──────────────────────────────────────────────────────────
  //  closeLetterPuzzleModal()
  // ──────────────────────────────────────────────────────────
  window.closeLetterPuzzleModal = function () {
    if (modalEl && modalEl.parentNode) {
      modalEl.parentNode.removeChild(modalEl);
    }
    modalEl = null;
    iframeEl = null;
    solveCallback = null;
  };

  // ──────────────────────────────────────────────────────────
  //  Listen for the solved signal from the iframe
  // ──────────────────────────────────────────────────────────
  window.addEventListener('message', function (event) {
    var d = event.data;

    var isSolvedSignal =
      d === 'LETTER_PUZZLE_SOLVED' ||
      (d && typeof d === 'object' && d.type === 'LETTER_PUZZLE_SOLVED');

    if (!isSolvedSignal) return;

    var cb = solveCallback;
    solveCallback = null;

    if (modalEl && modalEl.parentNode) {
      modalEl.parentNode.removeChild(modalEl);
    }
    modalEl = null;
    iframeEl = null;

    if (typeof cb === 'function') {
      try { cb(); } catch (e) { console.error('letterPuzzle callback error:', e); }
    }
  });

  console.log('%c📜 letterPuzzle.js loaded', 'color:#d7b477;');
})();
