// ============================================================
//  DETECTIVE PUZZLE – Load standalone Hanoi puzzle as iframe
// ============================================================
function showDetectivePuzzleModal(onSolve) {
  var modalDiv = document.createElement('div');
  modalDiv.style.position = 'fixed';
  modalDiv.style.top = '0';
  modalDiv.style.left = '0';
  modalDiv.style.width = '100%';
  modalDiv.style.height = '100%';
  modalDiv.style.background = 'rgba(0,0,0,0.95)';
  modalDiv.style.zIndex = '10000';
  modalDiv.style.display = 'flex';
  modalDiv.style.alignItems = 'center';
  modalDiv.style.justifyContent = 'center';
  modalDiv.style.padding = '20px';

  var container = document.createElement('div');
  container.style.backgroundColor = '#050505';
  container.style.borderRadius = '20px';
  container.style.width = '95%';
  container.style.height = '95%';
  container.style.maxWidth = '950px';
  container.style.overflow = 'hidden';
  container.style.position = 'relative';
  container.style.boxShadow = '0 20px 40px rgba(0,0,0,0.8)';

  var iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  // Use the file path – ensure this file exists!
  iframe.src = 'js/puzzles/hanoi-puzzle.html';
  // Add a fallback if the file fails to load
  iframe.onerror = function() {
    console.error('Failed to load hanoi-puzzle.html – check file path.');
  };
  container.appendChild(iframe);

  var closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✖';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '12px';
  closeBtn.style.right = '16px';
  closeBtn.style.zIndex = '10001';
  closeBtn.style.background = '#a13d3d';
  closeBtn.style.border = 'none';
  closeBtn.style.color = 'white';
  closeBtn.style.fontSize = '28px';
  closeBtn.style.width = '44px';
  closeBtn.style.height = '44px';
  closeBtn.style.borderRadius = '50%';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontWeight = 'bold';
  closeBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  closeBtn.style.display = 'flex';
  closeBtn.style.alignItems = 'center';
  closeBtn.style.justifyContent = 'center';

  container.appendChild(closeBtn);
  modalDiv.appendChild(container);
  document.body.appendChild(modalDiv);

  var puzzleSolved = false;

  window.puzzleSolved = function() {
    puzzleSolved = true;
  };

  function closeModal() {
    if (puzzleSolved && typeof onSolve === 'function') {
      onSolve();
    }
    modalDiv.remove();
    delete window.puzzleSolved;
  }

  closeBtn.onclick = function(e) {
    e.stopPropagation();
    closeModal();
  };

  modalDiv.onclick = function(e) {
    if (e.target === modalDiv) {
      closeModal();
    }
  };
}