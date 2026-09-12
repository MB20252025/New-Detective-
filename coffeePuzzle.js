// ============================================================
//  coffeePuzzle.js — Modal loader for The Coffee Puzzle
// ============================================================
(function () {
  'use strict';

  var modalEl = null;
  var iframeEl = null;
  var solveCallback = null;

  // ──────────────────────────────────────────────────────────
  //  showCoffeePuzzleModal(callback)
  // ──────────────────────────────────────────────────────────
  window.showCoffeePuzzleModal = function (cb) {
    solveCallback = (typeof cb === 'function') ? cb : null;

    if (modalEl) return;   // already open

    modalEl = document.createElement('div');
    modalEl.id = 'coffeePuzzleModal';
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

    // Close (X) button
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
      window.closeCoffeePuzzleModal();
    });
    modalEl.appendChild(closeBtn);

    iframeEl = document.createElement('iframe');
    iframeEl.id = 'coffeePuzzleIframe';
    iframeEl.src = 'coffeePuzzle.html';
    iframeEl.style.cssText = [
      'width:100%',
      'max-width:900px',
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
  //  closeCoffeePuzzleModal()
  // ──────────────────────────────────────────────────────────
  window.closeCoffeePuzzleModal = function () {
    if (modalEl && modalEl.parentNode) modalEl.parentNode.removeChild(modalEl);
    modalEl = null;
    iframeEl = null;
    solveCallback = null;
  };

  // ──────────────────────────────────────────────────────────
  //  Listen for messages from the puzzle iframe
  // ──────────────────────────────────────────────────────────
  window.addEventListener('message', function (event) {
    var d = event.data;
    if (!d || typeof d !== 'object') return;

    if (d.type === 'COFFEE_PUZZLE_SOLVED') {
      var cb = solveCallback;
      solveCallback = null;   // fire once
      if (typeof cb === 'function') {
        try { cb(); } catch (e) { console.error('coffeePuzzle callback error:', e); }
      }
      return;
    }

    if (d.type === 'CLOSE_COFFEE_PUZZLE') {
      window.closeCoffeePuzzleModal();
      return;
    }
  });

  console.log('%c☕ coffeePuzzle.js loaded', 'color:#d7b477;');
})();
