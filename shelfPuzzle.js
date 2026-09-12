// ============================================================
//  shelfPuzzle.js — Modal loader for The Shelf of Secrets
// ============================================================
(function () {
  'use strict';

  var modalEl = null;
  var iframeEl = null;
  var solveCallback = null;
  var previousOverflow = '';

  // ──────────────────────────────────────────────────────────
  //  showShelfPuzzleModal(callback)
  // ──────────────────────────────────────────────────────────
  window.showShelfPuzzleModal = function (cb) {
    solveCallback = (typeof cb === 'function') ? cb : null;

    if (modalEl) return;   // already open

    // Lock body scroll — prevents the page behind from moving
    previousOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';

    modalEl = document.createElement('div');
    modalEl.id = 'shelfPuzzleModal';
    modalEl.style.cssText = [
      'position:fixed',
      'inset:0',
      'width:100vw',
      'height:100vh',
      'z-index:99999',
      'background:#0a0806',            // solid — nothing shows through
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'padding:0',
      'margin:0',
      'overflow:hidden'
    ].join(';');

    // Close (X) button
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
      window.closeShelfPuzzleModal();
    });
    modalEl.appendChild(closeBtn);

    iframeEl = document.createElement('iframe');
    iframeEl.id = 'shelfPuzzleIframe';
    iframeEl.src = 'shelfPuzzle.html';
    iframeEl.style.cssText = [
      'width:100%',
      'height:100%',
      'border:none',
      'display:block',
      'background:#2c1a12'
    ].join(';');
    modalEl.appendChild(iframeEl);

    document.body.appendChild(modalEl);
  };

  // ──────────────────────────────────────────────────────────
  //  closeShelfPuzzleModal()
  // ──────────────────────────────────────────────────────────
  window.closeShelfPuzzleModal = function () {
    if (modalEl && modalEl.parentNode) modalEl.parentNode.removeChild(modalEl);
    modalEl = null;
    iframeEl = null;
    solveCallback = null;

    // Restore body scroll
    document.body.style.overflow = previousOverflow;
    previousOverflow = '';
  };

  // ──────────────────────────────────────────────────────────
  //  Listen for messages from the puzzle iframe
  // ──────────────────────────────────────────────────────────
  window.addEventListener('message', function (event) {
    var d = event.data;
    if (!d || typeof d !== 'object') return;

    if (d.type === 'SHELF_PUZZLE_SOLVED') {
      var cb = solveCallback;
      solveCallback = null;   // fire once
      if (typeof cb === 'function') {
        try { cb(); } catch (e) { console.error('shelfPuzzle callback error:', e); }
      }
      return;
    }

    if (d.type === 'CLOSE_SHELF_PUZZLE') {
      window.closeShelfPuzzleModal();
      return;
    }
  });

  console.log('%c📚 shelfPuzzle.js loaded', 'color:#d7b477;');
})();
