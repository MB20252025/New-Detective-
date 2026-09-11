// ============================================================
//  LOCKER PUZZLE – Evidence lockers with combination clues
// ============================================================
function showLockerPuzzleModal(onSolve) {
  if (!game.lockerPuzzleState) {
    game.lockerPuzzleState = {
      lockers: [
        { combination: "524", clues: ["531 – One digit correct and in the right place","489 – One digit correct but in the wrong place","245 – Two digits correct but both in the wrong places","796 – All digits are wrong","152 – One digit correct but in the wrong place"], content: "The locker is empty.", unlocked: false, opened: false, currentDigits: [0,0,0] },
        { combination: "042", clues: ["682 – One digit correct and in the right place","614 – One digit correct but in the wrong place","206 – Two digits correct but both in the wrong places","738 – All digits are wrong","380 – One digit correct but in the wrong place"], content: "The locker is empty.", unlocked: false, opened: false, currentDigits: [0,0,0] },
        { combination: "315", clues: ["123 – One digit correct and in the right place","356 – One digit correct but in the wrong place","507 – Two digits correct but both in the wrong places","489 – All digits are wrong","701 – One digit correct but in the wrong place"], content: "The locker is empty.", unlocked: false, opened: false, currentDigits: [0,0,0] },
        { combination: "417", clues: ["741 – One digit correct and in the right place","169 – One digit correct but in the wrong place","437 – Two digits correct but both in the wrong places","852 – All digits are wrong","914 – One digit correct but in the wrong place"], content: "The locker is empty.", unlocked: false, opened: false, currentDigits: [0,0,0] },
        { combination: "981", clues: ["918 – One digit correct and in the right place","307 – One digit correct but in the wrong place","189 – Two digits correct but both in the wrong places","456 – All digits are wrong","801 – One digit correct but in the wrong place"], content: "The locker is empty.", unlocked: false, opened: false, currentDigits: [0,0,0] },
        { combination: "142", clues: ["214 – One digit correct and in the right place","673 – One digit correct but in the wrong place","421 – Two digits correct but both in the wrong places","589 – All digits are wrong","162 – One digit correct but in the wrong place"], content: "✨ You found something interesting inside... ✨", unlocked: false, opened: false, currentDigits: [0,0,0] }
      ],
      currentIndex: 0
    };
  }

  const modalDiv = document.createElement('div');
  modalDiv.style.position = 'fixed';
  modalDiv.style.top = '0';
  modalDiv.style.left = '0';
  modalDiv.style.width = '100%';
  modalDiv.style.height = '100%';
  modalDiv.style.background = '#1a2634';
  modalDiv.style.zIndex = '3000';
  modalDiv.style.overflow = 'auto';
  modalDiv.classList.add('locker-puzzle-modal');
  modalDiv.innerHTML = `
    <div class="locker-puzzle-container">
      <h1>🚔 EVIDENCE LOCKER</h1>
      <div id="locker-grid" class="locker-grid"></div>
      <div id="locker-detail" class="detail-view hidden">
        <div class="detail-header">
          <h2>LOCKER <span id="locker-number"></span></h2>
          <button class="back-to-grid">⬅ BACK</button>
        </div>
        <div class="detail-content">
          <div class="clue-panel">
            <h3>📋 CLUES</h3>
            <ul class="clue-list" id="clue-list"></ul>
          </div>
          <div class="locker-door">
            <div class="padlock" id="padlock-area">
              <div class="digits">
                <button class="digit" id="digit1">0</button>
                <button class="digit" id="digit2">0</button>
                <button class="digit" id="digit3">0</button>
              </div>
              <div class="lock-actions">
                <button id="open-lock">🔓 OPEN</button>
                <button id="pick-lock">🔧 PICK</button>
              </div>
            </div>
            <div class="lock-message" id="lock-message"></div>
            <button id="open-door" disabled>🚪 OPEN DOOR</button>
            <div id="contents" class="contents hidden"></div>
          </div>
        </div>
      </div>
      <div class="footer-note">[ tap locker • turn dials • clues or pick ]</div>
      <button class="close-locker-modal" id="closeLockerModal">❌ CLOSE</button>
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

  const lockerColors = ['#FF6B6B', '#4ECDC4', '#FFB347', '#A06AB4', '#5D9B5D', '#FFD93D'];
  const lockers = game.lockerPuzzleState.lockers;
  let currentIndex = game.lockerPuzzleState.currentIndex;

  const gridEl = modalDiv.querySelector('#locker-grid');
  const detailEl = modalDiv.querySelector('#locker-detail');
  const lockerNumberSpan = modalDiv.querySelector('#locker-number');
  const clueListEl = modalDiv.querySelector('#clue-list');
  const digit1 = modalDiv.querySelector('#digit1');
  const digit2 = modalDiv.querySelector('#digit2');
  const digit3 = modalDiv.querySelector('#digit3');
  const openLockBtn = modalDiv.querySelector('#open-lock');
  const pickLockBtn = modalDiv.querySelector('#pick-lock');
  const lockMessageDiv = modalDiv.querySelector('#lock-message');
  const openDoorBtn = modalDiv.querySelector('#open-door');
  const contentsDiv = modalDiv.querySelector('#contents');
  const backBtn = modalDiv.querySelector('.back-to-grid');
  const closeBtn = modalDiv.querySelector('#closeLockerModal');
  const padlockArea = modalDiv.querySelector('#padlock-area');

  // Attach close button to clear popups
  closeBtn.addEventListener('click', function() {
    clearPopups();
    modalDiv.remove();
  });

  function renderGrid() {
    gridEl.innerHTML = '';
    lockers.forEach((locker, idx) => {
      const card = document.createElement('div');
      card.className = 'locker-card';
      card.style.backgroundColor = lockerColors[idx % lockerColors.length];
      card.dataset.index = idx;

      const vent = document.createElement('div');
      vent.className = 'vent';
      vent.innerHTML = '<div class="vent-line"></div><div class="vent-line"></div><div class="vent-line"></div>';
      card.appendChild(vent);

      const numberDiv = document.createElement('div');
      numberDiv.className = 'locker-number';
      numberDiv.textContent = `#${idx+1}`;
      card.appendChild(numberDiv);

      const iconDiv = document.createElement('div');
      iconDiv.className = 'locker-icon';
      iconDiv.textContent = locker.opened ? '❌' : '🔒';
      card.appendChild(iconDiv);

      const statusDiv = document.createElement('div');
      statusDiv.className = 'locker-status';
      statusDiv.textContent = locker.opened ? 'OPEN' : (locker.unlocked ? 'UNLOCKED' : 'LOCKED');
      card.appendChild(statusDiv);

      card.addEventListener('click', () => showDetail(idx));
      gridEl.appendChild(card);
    });
  }

  function showDetail(index) {
    currentIndex = index;
    game.lockerPuzzleState.currentIndex = index;
    const locker = lockers[index];

    lockerNumberSpan.textContent = index + 1;

    clueListEl.innerHTML = '';
    locker.clues.forEach(clue => {
      const li = document.createElement('li');
      li.textContent = clue;
      clueListEl.appendChild(li);
    });

    digit1.textContent = locker.currentDigits[0];
    digit2.textContent = locker.currentDigits[1];
    digit3.textContent = locker.currentDigits[2];

    lockMessageDiv.textContent = '';

    contentsDiv.classList.add('hidden');
    contentsDiv.style.display = 'none';
    contentsDiv.textContent = locker.content;

    if (locker.opened) {
      padlockArea.style.display = 'none';
      openDoorBtn.disabled = true;
      openDoorBtn.style.display = 'none';
      contentsDiv.classList.remove('hidden');
      contentsDiv.style.display = 'block';
      lockMessageDiv.textContent = 'Locker is open.';
    } else {
      padlockArea.style.display = 'block';
      openDoorBtn.style.display = 'block';
      openDoorBtn.disabled = !locker.unlocked;
      if (locker.unlocked) {
        lockMessageDiv.textContent = 'You hear a click. The padlock opens.';
      } else {
        lockMessageDiv.textContent = '';
      }
    }

    gridEl.classList.add('hidden');
    detailEl.classList.remove('hidden');
  }

  function updateDigitDisplay() {
    const locker = lockers[currentIndex];
    digit1.textContent = locker.currentDigits[0];
    digit2.textContent = locker.currentDigits[1];
    digit3.textContent = locker.currentDigits[2];
  }

  function makeDigitHandler(pos) {
    return () => {
      const locker = lockers[currentIndex];
      if (locker.opened) return;
      locker.currentDigits[pos] = (locker.currentDigits[pos] + 1) % 10;
      updateDigitDisplay();
    };
  }

  function handleOpenLock() {
    const locker = lockers[currentIndex];
    if (locker.opened) {
      lockMessageDiv.textContent = 'Already opened.';
      return;
    }
    const entered = locker.currentDigits.join('');
    if (entered === locker.combination) {
      locker.unlocked = true;
      lockMessageDiv.textContent = 'You hear a click. The padlock opens.';
      openDoorBtn.disabled = false;
    } else {
      lockMessageDiv.textContent = 'Wrong combination. Try again.';
    }
  }

  function handlePickLock() {
    const locker = lockers[currentIndex];
    if (locker.opened) {
      lockMessageDiv.textContent = 'Already opened.';
      return;
    }
    game.addPenalty();
    const combo = locker.combination.split('').map(Number);
    locker.currentDigits = [combo[0], combo[1], combo[2]];
    updateDigitDisplay();

    locker.unlocked = true;
    lockMessageDiv.textContent = `🔧 Lock picked! Combo: ${locker.combination}. Padlock clicks.`;
    openDoorBtn.disabled = false;
  }

  function handleOpenDoor() {
    const locker = lockers[currentIndex];
    if (!locker.unlocked || locker.opened) return;
    locker.opened = true;
    padlockArea.style.display = 'none';
    openDoorBtn.disabled = true;
    openDoorBtn.style.display = 'none';
    contentsDiv.classList.remove('hidden');
    contentsDiv.style.display = 'block';
    lockMessageDiv.textContent = 'Locker is open.';

    if (currentIndex === 5 && !game.bonusSolved[4]) {
      const lockerPuzzle = game.bonusPuzzles.find(p => p.id === 'locker_puzzle');
      if (lockerPuzzle) {
        lockerPuzzle.onSolve();
        // DO NOT close the modal – let the user click the CLOSE button
      }
    }
  }

  function backToGrid() {
    detailEl.classList.add('hidden');
    gridEl.classList.remove('hidden');
    renderGrid();
  }

  digit1.addEventListener('click', makeDigitHandler(0));
  digit2.addEventListener('click', makeDigitHandler(1));
  digit3.addEventListener('click', makeDigitHandler(2));
  openLockBtn.addEventListener('click', handleOpenLock);
  pickLockBtn.addEventListener('click', handlePickLock);
  openDoorBtn.addEventListener('click', handleOpenDoor);
  backBtn.addEventListener('click', backToGrid);

  renderGrid();
}