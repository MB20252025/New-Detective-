// ============================================================
//  CRYPTOGRAM MODAL – The final decoded message
// ============================================================
function showCryptogramModal() {
  const letterToNumber = {
    'A':21, 'B':24, 'C':6, 'D':22, 'E':2, 'F':15, 'G':11, 'H':17, 'I':20, 'J':10,
    'K':23, 'L':8, 'M':16, 'N':12, 'O':14, 'P':13, 'Q':3, 'R':5, 'S':7, 'T':25,
    'U':4, 'V':19, 'W':18, 'X':26, 'Y':9, 'Z':1
  };
  const preRevealedMapping = { '2':'E', '8':'L', '6':'C', '7':'S', '9':'Y', '5':'R' };
  const sentence = "THE VAULT IS BENEATH THE STAGE OF THE NEW THEATRE ROYAL";

  let sentenceItems = [];
  for (let ch of sentence) {
    if (ch === ' ') continue;
    const num = letterToNumber[ch];
    sentenceItems.push({ letter: ch, number: num, revealed: false });
  }
  for (let item of sentenceItems) {
    if (preRevealedMapping[item.number] === item.letter || game.cryptogramRevealedLetters.has(item.letter)) {
      item.revealed = true;
    }
  }

  let solvedMappings = {};
  for (let [numStr, letter] of Object.entries(preRevealedMapping)) {
    solvedMappings[letter] = parseInt(numStr);
  }
  for (let l of game.cryptogramRevealedLetters) {
    if (!solvedMappings[l] && letterToNumber[l]) solvedMappings[l] = letterToNumber[l];
  }

  let hintsUsed = 0;
  const MAX_HINTS = 3;

  function countRevealed() { return sentenceItems.filter(item => item.revealed).length; }

  function revealLetter(letter) {
    let changed = false;
    for (let i = 0; i < sentenceItems.length; i++) {
      if (sentenceItems[i].letter === letter && !sentenceItems[i].revealed) {
        sentenceItems[i].revealed = true;
        changed = true;
      }
    }
    if (changed) {
      const numberVal = letterToNumber[letter];
      if (numberVal) solvedMappings[letter] = numberVal;
      game.cryptogramRevealedLetters.add(letter);
      renderFull();
      if (countRevealed() === sentenceItems.length && !game.cryptogramSolved) {
        game.cryptogramSolved = true;
        game.showPopup("🏦 The Vault has been unlocked in the Case File tab!");
        game.addDetectiveNote("It's over.", "Perfect—everything fits… it's time to make your final decision.");
        game.updateUI();
        game.refreshCurrentTab();
        const notify = document.createElement('div');
        notify.className = 'unlock-notify';
        notify.innerHTML = '🔓 Cryptogram solved! The truth is revealed. You can now accuse the mastermind.';
        document.getElementById('content').prepend(notify);
        setTimeout(() => notify.remove(), 4000);
      }
    }
  }

  let currentGuessPos = null, currentGuessLetter = null;
  function openGuessModal(pos, correctLetter) {
    currentGuessPos = pos; 
    currentGuessLetter = correctLetter;
    const modal = document.getElementById('cryptogramGuessModal');
    const input = document.getElementById('cryptogramGuessInput');
    const feedback = document.getElementById('cryptogramGuessFeedback');
    feedback.innerHTML = '';
    input.value = '';
    modal.style.transition = 'none';
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    modal.classList.add('active');
    input.focus();
    setTimeout(() => { modal.style.transition = ''; }, 50);
  }
  function closeGuessModal() {
    const modal = document.getElementById('cryptogramGuessModal');
    modal.style.transition = 'none';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    modal.classList.remove('active');
    currentGuessPos = null;
    currentGuessLetter = null;
    setTimeout(() => { modal.style.transition = ''; }, 50);
  }
  function submitGuess() {
    const input = document.getElementById('cryptogramGuessInput');
    let guess = input.value.trim().toUpperCase();
    const feedback = document.getElementById('cryptogramGuessFeedback');
    if (!guess || !guess.match(/[A-Z]/)) { feedback.innerHTML = '❌ Enter a single letter A-Z'; return; }
    if (guess.length > 1) guess = guess[0];
    if (currentGuessPos === null) { closeGuessModal(); return; }
    const correct = (guess === currentGuessLetter);
    if (correct) {
      revealLetter(currentGuessLetter);
      feedback.innerHTML = '✅ Correct! The letter has been revealed across the cryptogram.';
      closeGuessModal();
    } else {
      feedback.innerHTML = `❌ Wrong. '${guess}' is not the correct letter. Try again!`;
      input.value = '';
      input.focus();
    }
  }

  function renderMappingTable() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let gridHtml = '<div class="mapping-grid">';
    for (let l of letters) {
      const mappedNum = solvedMappings[l] || '_';
      const solvedClass = solvedMappings[l] ? 'solved' : '';
      gridHtml += `<div class="mapping-pair">
                      <span class="mapping-letter">${l}</span>
                      <span class="mapping-number ${solvedClass}">${mappedNum}</span>
                    </div>`;
    }
    gridHtml += '</div>';
    return `<div class="mapping-container">${gridHtml}</div>`;
  }

  function renderCryptogramWords() {
    let globalIdx = 0;
    const words = sentence.split(' ');
    let wordsHtml = '<div class="crypto-words">';
    for (let w of words) {
      wordsHtml += '<div class="word">';
      for (let i = 0; i < w.length; i++) {
        const item = sentenceItems[globalIdx];
        const display = item.revealed ? item.letter : item.number;
        const revealedClass = item.revealed ? 'revealed' : '';
        wordsHtml += `<div class="crypto-cell ${revealedClass}" data-pos="${globalIdx}" data-letter="${item.letter}" data-number="${item.number}">${display}</div>`;
        globalIdx++;
      }
      wordsHtml += '</div>';
    }
    wordsHtml += '</div>';
    return wordsHtml;
  }

  function renderFull() {
    const container = document.getElementById('cryptogramRoot');
    if (!container) return;
    const mappingHtml = renderMappingTable();
    const wordsHtml = renderCryptogramWords();
    const total = sentenceItems.length;
    const revealed = countRevealed();
    const percent = Math.floor((revealed / total) * 100);
    const progressHtml = `<div class="progress-bar"><div class="progress-fill" style="width: ${percent}%"></div></div>`;
    const remaining = MAX_HINTS - hintsUsed;
    const controlsHtml = `<div class="cryptogram-controls">
                            <button class="cryptogram-hint-btn" id="cryptogramHintBtn" ${hintsUsed >= MAX_HINTS || revealed === total ? 'disabled' : ''}>
                              <i class="fas fa-lightbulb"></i> REVEAL HINT (${remaining} left)
                            </button>
                          </div>`;
    container.innerHTML = mappingHtml + wordsHtml + progressHtml + controlsHtml;

    document.querySelectorAll('#cryptogramRoot .crypto-cell').forEach(cell => {
      if (!cell.classList.contains('revealed')) {
        cell.addEventListener('click', (e) => {
          const pos = parseInt(cell.dataset.pos);
          const expectedLetter = cell.dataset.letter;
          openGuessModal(pos, expectedLetter);
        });
      }
    });

    const hintBtn = document.getElementById('cryptogramHintBtn');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        if (hintsUsed >= MAX_HINTS) return;
        for (let i = 0; i < sentenceItems.length; i++) {
          if (!sentenceItems[i].revealed) {
            revealLetter(sentenceItems[i].letter);
            hintsUsed++;
            renderFull();
            const toast = document.createElement('div');
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.background = '#1e3d4a';
            toast.style.border = '2px solid #eace9f';
            toast.style.borderRadius = '50px';
            toast.style.padding = '8px 24px';
            toast.style.color = '#f5e7c8';
            toast.style.fontWeight = 'bold';
            toast.style.zIndex = '5000';
            toast.innerText = `🔎 Hint: letter '${sentenceItems[i].letter}' revealed.`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 1800);
            break;
          }
        }
      });
    }
  }

  // Build the modal
  const modalDiv = document.createElement('div');
  modalDiv.style.position = 'fixed';
  modalDiv.style.top = '0';
  modalDiv.style.left = '0';
  modalDiv.style.width = '100%';
  modalDiv.style.height = '100%';
  modalDiv.style.backgroundColor = 'rgba(0,0,0,0.9)';
  modalDiv.style.zIndex = '10000';
  modalDiv.style.display = 'flex';
  modalDiv.style.alignItems = 'center';
  modalDiv.style.justifyContent = 'center';
  modalDiv.style.padding = '20px';
  modalDiv.style.overflow = 'auto';

  const container = document.createElement('div');
  container.style.backgroundColor = '#0f2a3f';
  container.style.border = '3px solid #6b4f3c';
  container.style.borderRadius = '28px 28px 20px 20px';
  container.style.maxWidth = '1100px';
  container.style.width = '100%';
  container.style.maxHeight = '90%';
  container.style.overflow = 'auto';
  container.style.boxShadow = '0 20px 35px rgba(0,0,0,0.6)';
  container.innerHTML = `
    <div class="cryptogram-standalone">
      <div class="header" style="background:#1e3d4a; padding:18px 24px; border-bottom:3px solid #b68b5c; text-align:center;">
        <h1 style="font-family:'Cinzel',serif; font-size:1.8rem; color:#eace9f; display:flex; align-items:center; justify-content:center; gap:12px;"><i class="fas fa-key"></i> WHITBY CRYPTOGRAM <i class="fas fa-lock"></i></h1>
        <div class="sub" style="font-family:'Cormorant Garamond',serif; font-size:1rem; color:#cdba92; margin-top:6px;">"The Cartographer's Final Message"</div>
      </div>
      <div class="content-panel" id="cryptogramRoot" style="padding:28px 24px 32px;"></div>
      <footer style="text-align:center; font-size:0.7rem; background:#122b38; padding:12px; border-top:1px solid #6b4f3c; color:#b3aa8a;">⚓ Each number hides a letter. Click any cell to guess. Reveal the message hidden by the conspiracy.</footer>
    </div>
  `;

  const guessModalDiv = document.createElement('div');
  guessModalDiv.id = 'cryptogramGuessModal';
  guessModalDiv.className = 'modal';
  guessModalDiv.style.position = 'fixed';
  guessModalDiv.style.top = '0';
  guessModalDiv.style.left = '0';
  guessModalDiv.style.width = '100%';
  guessModalDiv.style.height = '100%';
  guessModalDiv.style.backgroundColor = 'rgba(0,0,0,0.85)';
  guessModalDiv.style.backdropFilter = 'blur(6px)';
  guessModalDiv.style.display = 'flex';
  guessModalDiv.style.alignItems = 'center';
  guessModalDiv.style.justifyContent = 'center';
  guessModalDiv.style.zIndex = '3000';
  guessModalDiv.style.opacity = '0';
  guessModalDiv.style.pointerEvents = 'none';
  guessModalDiv.style.transition = '0.2s';
  guessModalDiv.innerHTML = `
    <div class="modal-content" style="background:#17323f; border:3px solid #b68b5c; border-radius:48px; padding:28px 24px; max-width:380px; width:90%; text-align:center; color:#ece3d0; box-shadow:0 20px 30px black;">
      <h3 style="font-size:1.9rem; margin-bottom:16px; color:#eace9f;"><i class="fas fa-question-circle"></i> Enter Letter</h3>
      <p>What letter does this number represent?</p>
      <input type="text" id="cryptogramGuessInput" maxlength="1" class="guess-input" style="background:#1f4454; border:2px solid #b68b5c; border-radius:50px; padding:14px; font-size:2rem; width:90px; text-align:center; margin:16px auto; display:block; color:#f5e7c8; font-weight:bold; font-family:monospace;">
      <div class="modal-buttons" style="display:flex; gap:18px; justify-content:center; margin-top:20px;">
        <button id="cryptogramSubmitGuess" style="background:#b68b5c; border:none; border-radius:60px; padding:8px 28px; font-weight:bold; cursor:pointer; font-size:1rem;">SUBMIT</button>
        <button id="cryptogramCloseGuess" style="background:#b68b5c; border:none; border-radius:60px; padding:8px 28px; font-weight:bold; cursor:pointer; font-size:1rem;">CANCEL</button>
      </div>
      <div class="message-tip" id="cryptogramGuessFeedback" style="background:#2d2f2b; padding:12px; border-radius:30px; margin-top:12px; font-size:0.9rem;"></div>
    </div>
  `;

  const closeModalBtn = document.createElement('button');
  closeModalBtn.innerHTML = '✖';
  closeModalBtn.style.position = 'absolute';
  closeModalBtn.style.top = '12px';
  closeModalBtn.style.right = '16px';
  closeModalBtn.style.zIndex = '10001';
  closeModalBtn.style.background = '#a13d3d';
  closeModalBtn.style.border = 'none';
  closeModalBtn.style.color = 'white';
  closeModalBtn.style.fontSize = '28px';
  closeModalBtn.style.width = '44px';
  closeModalBtn.style.height = '44px';
  closeModalBtn.style.borderRadius = '50%';
  closeModalBtn.style.cursor = 'pointer';
  closeModalBtn.style.fontWeight = 'bold';
  closeModalBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  closeModalBtn.style.display = 'flex';
  closeModalBtn.style.alignItems = 'center';
  closeModalBtn.style.justifyContent = 'center';

  container.appendChild(closeModalBtn);
  modalDiv.appendChild(container);
  modalDiv.appendChild(guessModalDiv);
  document.body.appendChild(modalDiv);

  const style = document.createElement('style');
  style.textContent = `
    .cryptogram-standalone .mapping-container { background:#17323f; border:2px solid #6b4f3c; border-radius:24px; padding:20px 16px; margin-bottom:28px; box-shadow:inset 0 0 0 1px #2d5a4a,0 6px 12px rgba(0,0,0,0.3); }
    .mapping-grid { display:grid; grid-template-columns:repeat(7,minmax(52px,auto)); justify-content:center; gap:10px 8px; }
    @media (max-width:640px){ .mapping-grid { grid-template-columns:repeat(6,minmax(48px,auto)); } }
    @media (max-width:540px){ .mapping-grid { grid-template-columns:repeat(5,minmax(44px,auto)); } }
    @media (max-width:440px){ .mapping-grid { grid-template-columns:repeat(4,minmax(42px,auto)); } }
    .mapping-pair { display:flex; flex-direction:column; align-items:center; background:#1f4454; border:2px solid #5a7c8c; border-radius:18px; padding:8px 4px; transition:0.1s; }
    .mapping-letter { font-weight:bold; font-size:1.2rem; color:#eace9f; font-family:'Cinzel',serif; }
    .mapping-number { font-size:1rem; font-family:'Courier New',monospace; background:#0e2938; padding:3px 12px; border-radius:40px; margin-top:6px; font-weight:bold; color:#bdd4cf; }
    .mapping-number.solved { background:#2d6b4c; color:#f5e7c8; box-shadow:0 0 6px #7ac67a; border:1px solid #eace9f; }
    .crypto-words { background:#17323f; border:2px solid #6b4f3c; border-radius:24px; padding:24px 18px; margin:20px 0; display:flex; flex-wrap:wrap; gap:20px; justify-content:center; box-shadow:inset 0 0 0 1px #2f5a4a; overflow-x:auto; }
    .word { display:flex; flex-wrap:nowrap; gap:6px; align-items:center; justify-content:center; background:transparent; }
    .crypto-cell { background:#1f4454; border:2px solid #5a7c8c; border-radius:14px; width:52px; height:56px; display:flex; align-items:center; justify-content:center; font-size:1.4rem; font-weight:bold; color:#eace9f; cursor:pointer; transition:all 0.18s ease; font-family:'Courier Prime',monospace; box-shadow:0 2px 4px black; flex-shrink:0; }
    @media (max-width:680px){ .crypto-cell { width:44px; height:48px; font-size:1.2rem; } }
    @media (max-width:550px){ .crypto-cell { width:38px; height:44px; font-size:1rem; } }
    .crypto-cell:hover:not(.revealed) { transform:scale(1.07); border-color:#eace9f; background:#2f6073; box-shadow:0 0 12px rgba(234,206,159,0.5); }
    .crypto-cell.revealed { background:#2d6b4c; border-color:#eace9f; color:#fff3cf; cursor:default; box-shadow:0 0 10px #7bc97b; }
    .progress-bar { width:100%; height:12px; background:#1f4454; border-radius:30px; margin:20px 0 12px; overflow:hidden; border:1px solid #6b4f3c; }
    .progress-fill { height:100%; background:#2d6b4c; width:0%; transition:width 0.3s ease; box-shadow:0 0 6px #a2f0a2; }
    .cryptogram-controls { display:flex; gap:20px; justify-content:center; margin:18px 0 10px; flex-wrap:wrap; }
    .cryptogram-hint-btn { background:#b68b5c; color:#0b1e2b; border:none; border-radius:60px; padding:12px 28px; font-weight:bold; font-size:1rem; cursor:pointer; display:inline-flex; align-items:center; gap:12px; transition:0.2s; box-shadow:0 4px 0 #6b4f3c; font-family:'Cinzel',serif; }
    .cryptogram-hint-btn:active { transform:translateY(2px); box-shadow:0 1px 0 #6b4f3c; }
    .cryptogram-hint-btn:disabled { opacity:0.5; transform:none; cursor:not-allowed; }
  `;
  container.appendChild(style);

  renderFull();

  const guessSubmit = document.getElementById('cryptogramSubmitGuess');
  const guessClose = document.getElementById('cryptogramCloseGuess');
  const guessInput = document.getElementById('cryptogramGuessInput');
  if (guessSubmit) guessSubmit.addEventListener('click', submitGuess);
  if (guessClose) guessClose.addEventListener('click', closeGuessModal);
  if (guessInput) {
    guessInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') submitGuess(); });
    guessInput.addEventListener('input', function() {
      const val = this.value.trim().toUpperCase();
      if (val.length === 1 && val.match(/[A-Z]/)) {
        submitGuess();
      }
    });
  }

  closeModalBtn.onclick = () => modalDiv.remove();
  modalDiv.onclick = (e) => { if (e.target === modalDiv) modalDiv.remove(); };
}