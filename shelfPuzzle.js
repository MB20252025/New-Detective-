// ============================================================
//  SHELF PUZZLE – Books on the shelf, find the correct order
// ============================================================
function showShelfPuzzleModal(onSolve) {
  const modalDiv = document.createElement('div');
  modalDiv.style.position = 'fixed';
  modalDiv.style.top = '0';
  modalDiv.style.left = '0';
  modalDiv.style.width = '100%';
  modalDiv.style.height = '100%';
  modalDiv.style.background = '#121212';
  modalDiv.style.zIndex = '3000';
  modalDiv.style.overflow = 'auto';
  modalDiv.classList.add('shelf-bonus-puzzle');
  modalDiv.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; min-height: 100%; padding: 20px;">
      <div class="stage">
        <div class="shelf">
          <div class="books-row" id="shelfBooksRow"></div>
          <div class="indicator-row" id="shelfIndicatorRow"></div>
        </div>
        <button class="scan-button" id="shelfScanBtn">🔍 SCAN EVIDENCE</button>
        <div class="drawer-section" id="shelfDrawerSection">
          <div class="drawer-panel" id="shelfDrawerPanel">
            <button class="drawer-button" id="shelfOpenDrawerBtn">◈  OPEN  ◈</button>
          </div>
        </div>
        <button class="close-modal-btn" id="shelfCloseModalBtn">❌ CLOSE</button>
      </div>
      <div id="shelfEvidenceOverlay" class="evidence-overlay hidden">
        <div class="evidence-card">
          <h2>⚿  EVIDENCE  ⚿</h2>
          <p>📌 ZURICH VAULT SCHEMATIC<br>🔐 1612-79 · Λ</p>
          <button class="close-evidence" id="shelfCloseEvidence">✕ CONCEAL</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalDiv);

  // Function to clear popups
  function clearPopups() {
    const popupContainer = document.getElementById('popupContainer');
    if (popupContainer) {
      while (popupContainer.firstChild) {
        popupContainer.removeChild(popupContainer.firstChild);
      }
    }
  }

  const gradients = {
    1: 'linear-gradient(to right, #5d3a1a, #4a2c13, #3a1f0e)',
    2: 'linear-gradient(to right, #2c3e50, #1e2b3a, #141e2a)',
    3: 'linear-gradient(to right, #7d5e3a, #6b4e2f, #5a3e24)',
    4: 'linear-gradient(to right, #3a3a3a, #2a2a2a, #1a1a1a)',
    5: 'linear-gradient(to right, #2e5e5e, #1f4a4a, #123b3b)',
    6: 'linear-gradient(to right, #7a2e2e, #5e2323, #471b1b)'
  };
  const titles = {
    1: 'TRACK·ART',
    2: 'LOCK·DRILL',
    3: 'JEWEL·CUT',
    4: 'HEIST·HISTORY',
    5: 'SMUGGLE·NET',
    6: 'VAULT·CODE'
  };
  const positions = [
    { pos: 1, disc: 4 },
    { pos: 2, disc: null },
    { pos: 3, disc: 6 },
    { pos: 4, disc: 1 },
    { pos: 5, disc: null },
    { pos: 6, disc: null },
    { pos: 7, disc: 3 },
    { pos: 8, disc: 5 },
    { pos: 9, disc: null },
    { pos: 10, disc: 2 }
  ];
  const heightByDisc = { 1:150, 2:160, 3:170, 4:180, 5:190, 6:200 };
  const fillerHeights = [135, 145, 130, 140];
  const fillerColorByPos = {
    2: 'linear-gradient(145deg, #9b6b9b, #6d4a6d)',
    5: 'linear-gradient(145deg, #faeedc, #d5c2ae)',
    6: 'linear-gradient(145deg, #4a2e4a, #2d1b2d)',
    9: 'linear-gradient(145deg, #b0ff4d, #7fb333)'
  };
  const fillerTitlesByPos = { 2:'RITUAL', 5:'ASHES', 6:'EMBER', 9:'THORN' };
  const CORRECT_ORDER = [6, 5, 4, 3, 2, 1];

  let selectedOrder = [];
  let gameActive = true;
  let solved = false;
  let flashTimer = null;
  let scanTimer = null;

  const booksRow = modalDiv.querySelector('#shelfBooksRow');
  const indicatorRow = modalDiv.querySelector('#shelfIndicatorRow');
  const drawerPanel = modalDiv.querySelector('#shelfDrawerPanel');
  const openDrawerBtn = modalDiv.querySelector('#shelfOpenDrawerBtn');
  const evidenceOverlay = modalDiv.querySelector('#shelfEvidenceOverlay');
  const closeEvidence = modalDiv.querySelector('#shelfCloseEvidence');
  const scanBtn = modalDiv.querySelector('#shelfScanBtn');
  const closeModalBtn = modalDiv.querySelector('#shelfCloseModalBtn');

  // Attach close button to clear popups
  closeModalBtn.addEventListener('click', function() {
    clearPopups();
    modalDiv.remove();
  });

  function buildBooks() {
    booksRow.innerHTML = '';
    indicatorRow.innerHTML = '';

    let fillerIndex = 0;
    for (let i = 0; i < positions.length; i++) {
      const p = positions[i];
      const book = document.createElement('div');
      book.className = 'book';

      if (p.pos === 2 || p.pos === 7) book.classList.add('slightly-lean-forward');
      if (p.pos === 5 || p.pos === 9) book.classList.add('slightly-lean-back');

      if (p.disc !== null) {
        book.style.background = gradients[p.disc];
        book.setAttribute('data-order', p.disc.toString());
        book.style.height = heightByDisc[p.disc] + 'px';
        const titleSpan = document.createElement('div');
        titleSpan.className = 'spine-title';
        titleSpan.textContent = titles[p.disc];
        book.appendChild(titleSpan);
      } else {
        book.style.background = fillerColorByPos[p.pos];
        book.style.height = fillerHeights[fillerIndex] + 'px';
        fillerIndex++;
        const titleSpan = document.createElement('div');
        titleSpan.className = 'spine-title';
        titleSpan.textContent = fillerTitlesByPos[p.pos];
        book.appendChild(titleSpan);
        if (p.pos === 5 || p.pos === 9) book.classList.add('dark-text');
      }

      const band = document.createElement('div');
      band.className = 'top-band';
      book.insertBefore(band, book.firstChild);
      booksRow.appendChild(book);
    }

    for (let i = 0; i < 10; i++) {
      const ind = document.createElement('div');
      ind.className = 'indicator';
      ind.setAttribute('data-book-index', i);
      indicatorRow.appendChild(ind);
    }
  }

  function resetPuzzle() {
    if (flashTimer) clearTimeout(flashTimer);
    document.querySelectorAll('.book').forEach(b => b.classList.remove('pulled'));
    document.querySelectorAll('.indicator').forEach(i => {
      i.classList.remove('green', 'red-flash');
    });
    selectedOrder = [];
    gameActive = true;
  }

  function flashRedAndReset() {
    if (!gameActive) return;
    gameActive = false;
    const litIndicators = document.querySelectorAll('.indicator.green');
    function toggleRed(on) {
      litIndicators.forEach(ind => {
        if (on) ind.classList.add('red-flash');
        else ind.classList.remove('red-flash');
      });
    }
    toggleRed(true);
    setTimeout(() => {
      toggleRed(false);
      setTimeout(() => {
        toggleRed(true);
        setTimeout(() => {
          toggleRed(false);
          resetPuzzle();
        }, 160);
      }, 160);
    }, 160);
  }

  function checkWin() {
    if (selectedOrder.length === 6) {
      solved = true;
      gameActive = false;
      drawerPanel.classList.add('open');
      onSolve();
      // DO NOT close the modal – let the user click the CLOSE button
    }
  }

  function handleBookClick(e) {
    const book = e.currentTarget;
    if (!gameActive || solved) return;
    if (book.classList.contains('pulled')) return;

    const orderAttr = book.getAttribute('data-order');
    if (orderAttr === null) {
      flashRedAndReset();
      return;
    }

    const bookOrder = parseInt(orderAttr, 10);
    const nextExpected = CORRECT_ORDER[selectedOrder.length];

    if (bookOrder === nextExpected) {
      book.classList.add('pulled');
      const index = Array.from(booksRow.children).indexOf(book);
      const indicator = indicatorRow.children[index];
      indicator.classList.add('green');
      selectedOrder.push(bookOrder);
      checkWin();
    } else {
      flashRedAndReset();
    }
  }

  function scanEvidence() {
    if (solved) return;
    if (scanTimer) clearTimeout(scanTimer);
    const specialBooks = document.querySelectorAll('.book[data-order]');
    specialBooks.forEach(book => book.classList.add('hint-glow'));
    scanTimer = setTimeout(() => {
      specialBooks.forEach(book => book.classList.remove('hint-glow'));
      scanTimer = null;
    }, 3000);
  }

  function attachListeners() {
    document.querySelectorAll('.book').forEach(book => {
      book.addEventListener('click', handleBookClick);
    });
    scanBtn.addEventListener('click', scanEvidence);
    openDrawerBtn.addEventListener('click', () => {
      if (!solved) return;
      evidenceOverlay.classList.remove('hidden');
    });
    closeEvidence.addEventListener('click', () => {
      evidenceOverlay.classList.add('hidden');
    });
    evidenceOverlay.addEventListener('click', (e) => {
      if (e.target === evidenceOverlay) evidenceOverlay.classList.add('hidden');
    });
  }

  buildBooks();
  attachListeners();
}