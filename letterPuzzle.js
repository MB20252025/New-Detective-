// ============================================================
//  LETTER PUZZLE – Bragger's Note with UV torch
//  (Original design, no flicker, no pulsing, no initial red text)
// ============================================================
function showLetterPuzzleModal(onSolve) {
  const modalDiv = document.createElement('div');
  modalDiv.style.position = 'fixed';
  modalDiv.style.top = '0';
  modalDiv.style.left = '0';
  modalDiv.style.width = '100%';
  modalDiv.style.height = '100%';
  modalDiv.style.background = '#2b2b2b';
  modalDiv.style.zIndex = '3000';
  modalDiv.style.overflow = 'auto';
  modalDiv.innerHTML = `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .case-file {
        background: #fbf3e0;
        background-image: radial-gradient(circle at 10% 20%, rgba(160,130,80,0.08) 0%, transparent 25%), radial-gradient(circle at 90% 70%, rgba(120,80,40,0.08) 0%, transparent 30%), linear-gradient(165deg, rgba(200,170,120,0.15) 0%, transparent 30%), repeating-linear-gradient(45deg, rgba(0,0,0,0.01) 0px, rgba(0,0,0,0.01) 3px, transparent 3px, transparent 8px);
        max-width: 700px;
        width: 100%;
        border-radius: 8px 20px 20px 8px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 0 2px #b5986b inset, 0 0 0 4px #e5d2b5 inset, 0 0 0 8px #fbf3e0 inset, -5px 0 8px rgba(0,0,0,0.1);
        padding: 2.5rem 1.8rem 2rem;
        border-left: 10px solid #8b6b42;
        margin: 10px auto;
      }
      .letter { color: #2a241c; font-size: 1.1rem; line-height: 1.7; text-shadow: 0 1px 0 rgba(255,250,240,0.8); }
      .letter .salutation { font-weight: 600; margin-bottom: 1.8rem; border-bottom: 1px dashed #b5986b; padding-bottom: 0.5rem; font-size: 1.2rem; }
      .letter p { margin-bottom: 1.5rem; }
      .hidden-letter { color: inherit; transition: color 0.2s; }
      .uv-spotlight { color: #ffffcc !important; font-weight: 700; text-shadow: 0 0 12px #ffffaa, 0 0 22px #ffff88; }
      .middle-scrollable { flex: 1; overflow-y: auto; }
      .control-panel {
        background: #e5d7c0;
        border-radius: 40px 40px 20px 20px;
        padding: 1.5rem 1.2rem;
        box-shadow: 0 8px 0 #9f8b6e, 0 12px 24px rgba(0,0,0,0.3);
        border-bottom: 2px solid #b48b4a;
        margin-top: 2rem;
      }
      .detective-btn {
        background: #2f4259;
        border: none;
        color: #f0e6d2;
        font-family: 'Courier New', monospace;
        font-size: 1.3rem;
        font-weight: bold;
        padding: 0.9rem 2rem;
        border-radius: 50px;
        letter-spacing: 1.5px;
        box-shadow: 0 5px 0 #141d26, 0 6px 16px black;
        cursor: pointer;
        text-transform: uppercase;
        border: 1px solid #7f8fa0;
      }
      .detective-btn:active { transform: translateY(5px); box-shadow: 0 2px 0 #141d26; }
      .input-area { display: flex; flex-direction: column; gap: 15px; align-items: center; }
      #shopGuess {
        width: 100%;
        background: #efe3cf;
        border: none;
        padding: 16px 20px;
        font-size: 1.2rem;
        border-radius: 60px;
        font-family: monospace;
        font-weight: bold;
        border: 2px solid #936e2e;
        box-shadow: inset 0 2px 8px rgba(0,0,0,0.1);
      }
      #submitGuess {
        width: 100%;
        background: #6f4e2b;
        border: none;
        color: #ffeecd;
        font-size: 1.5rem;
        padding: 14px 20px;
        border-radius: 60px;
        font-weight: bold;
        box-shadow: 0 6px 0 #3a2c1a, 0 6px 16px black;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
      #submitGuess:active { transform: translateY(6px); box-shadow: 0 1px 0 #3a2c1a; }
      .result-message { text-align: center; color: #1a140e; font-size: 1.2rem; margin-top: 20px; font-weight: 600; }
      .uv-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,5,20,0.8); mix-blend-mode: multiply; pointer-events: none; z-index: 200; display: none; }
      .uv-spot {
        position: fixed;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(80,140,255,0.3) 0%, rgba(50,100,220,0.2) 30%, rgba(20,60,180,0.1) 70%, transparent 95%);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 250;
        display: none;
        filter: blur(5px);
        mix-blend-mode: screen;
        box-shadow: 0 0 18px 6px rgba(60,120,255,0.3);
      }
      /* REMOVED the flicker animation entirely */
      body.uv-active .case-file {
        background: #0c0c1a;
        background-image: none;
        box-shadow: 0 20px 40px black, 0 0 0 1px #1a1a2a inset, 0 0 0 3px #2a2a3a inset;
        border-left: 10px solid #1a1a2a;
        height: 100dvh;
        display: flex;
        flex-direction: column;
        margin-top: 0;
        border-radius: 0;
        padding: 1rem 1.8rem 0;
      }
      body.uv-active .letter { color: #2a2a3a; text-shadow: none; flex: 1; display: flex; flex-direction: column; }
      body.uv-active .hidden-letter { color: #2a2a3a; }
      body.uv-active .control-panel {
        background: #1a1a2a;
        box-shadow: 0 8px 0 #0a0a1a;
        border-bottom: 2px solid #4a3b22;
        margin-top: 0;
        border-radius: 40px 40px 0 0;
      }
      body.uv-active .detective-btn {
        background: #4a70a0;
        color: #fff;
        border: 1px solid #c0d8ff;
        box-shadow: 0 5px 0 #1a3a5a;
      }
      body.uv-active #shopGuess { background: #fff5e0; border: 2px solid #c09050; }
      body.uv-active #submitGuess { background: #b0784a; color: #fff; border: 1px solid #f0c090; box-shadow: 0 6px 0 #5a3a20; }
      body.uv-active .result-message { color: #b8a787; }
      body.uv-active .first-paragraph, body.uv-active .salutation, body.uv-active .third-paragraph { display: none; }
      body.uv-active .middle-scrollable {
        overflow: hidden !important;
        border: 1px solid #3a3a5a;
        border-radius: 8px;
        background: rgba(0,0,0,0.2);
        margin: 1rem 0;
      }
      body.uv-active #hidden-paragraph { margin: 1.5rem 1rem; }
      body.uv-active .middle-scrollable p:not(#hidden-paragraph) { display: none; }
      body.uv-active .uv-overlay { display: block; }
      body.uv-active .uv-spot { display: block; }
      .case-note { color: #b49b72; text-align: right; font-size: 0.9rem; margin-top: 10px; font-style: italic; border-top: 1px dashed #8b7a5a; padding-top: 10px; }
      
      /* Bottom close button styles */
      .bottom-close-btn {
        background: #8f7759;
        border: none;
        color: black;
        font-size: 1rem;
        padding: 10px 30px;
        border-radius: 40px;
        font-family: 'Cinzel', serif;
        letter-spacing: 1px;
        box-shadow: 0 4px 0 #4d3e2e;
        cursor: pointer;
        margin-top: 15px;
        transition: all 0.08s linear;
        width: 100%;
      }
      .bottom-close-btn:active {
        transform: translateY(4px);
        box-shadow: 0 1px 0 #4d3e2e;
      }
    </style>
    <div class="case-file" id="caseFile">
      <div class="letter">
        <div class="salutation">Detective,</div>
        <p class="first-paragraph">You're always too late, detective. By the time you arrive, the scene is cold, the trail is gone, and I'm already somewhere new. You follow rules, procedures, and paperwork - I follow instinct, precision, and opportunity. While you hesitate, I act. While you search, I take. Every move you make is predictable, every step I take is flawless.</p>
        <div class="middle-scrollable" id="middleScrollable">
          <p id="hidden-paragraph">Its to easy <span class="hidden-letter" data-index="0">w</span>hen police <span class="hidden-letter" data-index="1">a</span>re lazy, du<span class="hidden-letter" data-index="2">l</span>l wicked dor<span class="hidden-letter" data-index="3">k</span>s. I watch <span class="hidden-letter" data-index="4">e</span>very move, you<span class="hidden-letter" data-index="5">r</span> deceptive <span class="hidden-letter" data-index="6">j</span>ustice, hop<span class="hidden-letter" data-index="7">e</span>less. I have <span class="hidden-letter" data-index="8">w</span>on already. <span class="hidden-letter" data-index="9">E</span>very alarm, <span class="hidden-letter" data-index="10">l</span>ock , a safe, I <span class="hidden-letter" data-index="11">l</span>oot with pl<span class="hidden-letter" data-index="12">e</span>asure. A sca<span class="hidden-letter" data-index="13">r</span>ed DCI? Ever<span class="hidden-letter" data-index="14">y</span>one pitys a <span class="hidden-letter" data-index="15">s</span>tupid fool, <span class="hidden-letter" data-index="16">t</span>he harder y<span class="hidden-letter" data-index="17">o</span>u try the ha<span class="hidden-letter" data-index="18">r</span>der it will <span class="hidden-letter" data-index="19">e</span>mpty your spirit and soul.</p>
          <p class="third-paragraph">You read everything, detective… yet you never stop to count. Patterns repeat, over and over, in perfect order - something you always seem to miss. Perhaps I'll make it easier for you... count carefully. The last job took me ten minutes — in, out, untouched. Precision like that doesn't happen by accident. Order matters more than you realise. If you can't see the pattern in that… then maybe you're not as clever as you think.</p>
        </div>
        <div class="control-panel">
          <div class="button-row">
            <button class="detective-btn" id="uvBtn">🔦 UV TORCH</button>
          </div>
          <div class="input-area">
            <input type="text" id="shopGuess" placeholder="enter shop name...">
            <button id="submitGuess">➡️  SUBMIT</button>
          </div>
          <div class="result-message" id="resultMsg"></div>
          <!-- Bottom Close Button -->
          <button class="bottom-close-btn" id="letterBottomCloseBtn">❌ CLOSE</button>
        </div>
      </div>
      <div class="case-note">— UV mode: container locked (no scroll) —</div>
    </div>
    <div class="uv-overlay" id="uvOverlay"></div>
    <div class="uv-spot" id="uvSpot"></div>
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

  // Top-right close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '❌ CLOSE';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '20px';
  closeBtn.style.right = '20px';
  closeBtn.style.padding = '10px 20px';
  closeBtn.style.background = '#5a3f2a';
  closeBtn.style.color = '#ffeecd';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '40px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontFamily = 'monospace';
  closeBtn.onclick = function() {
    clearPopups();
    modalDiv.remove();
  };
  modalDiv.appendChild(closeBtn);

  // Bottom close button (inside the HTML)
  const bottomCloseBtn = document.getElementById('letterBottomCloseBtn');
  if (bottomCloseBtn) {
    bottomCloseBtn.onclick = function() {
      clearPopups();
      modalDiv.remove();
    };
  }

  (function() {
    const CORRECT_ANSWER = "walker jewellery store";
    const hiddenSpans = Array.from(modalDiv.querySelectorAll('.hidden-letter'));
    const uvBtn = modalDiv.querySelector('#uvBtn');
    const uvOverlay = modalDiv.querySelector('#uvOverlay');
    const uvSpot = modalDiv.querySelector('#uvSpot');
    const submitBtn = modalDiv.querySelector('#submitGuess');
    const guessInput = modalDiv.querySelector('#shopGuess');
    const resultMsg = modalDiv.querySelector('#resultMsg');
    const body = document.body;
    let uvActive = false;
    const SPOT_RADIUS = 30;

    function updateHighlights(centerX, centerY) {
      hiddenSpans.forEach(span => {
        const rect = span.getBoundingClientRect();
        const spanCenterX = rect.left + rect.width / 2;
        const spanCenterY = rect.top + rect.height / 2;
        const dx = spanCenterX - centerX;
        const dy = spanCenterY - centerY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist <= SPOT_RADIUS + 8) span.classList.add('uv-spotlight');
        else span.classList.remove('uv-spotlight');
      });
    }

    function moveSpotlight(e) {
      if (!uvActive) return;
      let clientX, clientY;
      if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      uvSpot.style.left = clientX + 'px';
      uvSpot.style.top = clientY + 'px';
      updateHighlights(clientX, clientY);
    }

    function deactivateUV() {
      uvActive = false;
      body.classList.remove('uv-active');
      body.style.overflow = '';
      document.removeEventListener('mousemove', moveSpotlight);
      document.removeEventListener('touchmove', moveSpotlight);
      document.removeEventListener('touchstart', moveSpotlight);
      if (modalDiv) modalDiv.style.overflow = 'auto';
    }

    function activateUV() {
      uvActive = true;
      body.classList.add('uv-active');
      body.style.overflow = 'hidden';
      modalDiv.style.overflow = 'hidden';
      // Center the spotlight initially
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      uvSpot.style.left = centerX + 'px';
      uvSpot.style.top = centerY + 'px';
      updateHighlights(centerX, centerY);
      document.addEventListener('mousemove', moveSpotlight);
      document.addEventListener('touchmove', moveSpotlight, { passive: true });
      document.addEventListener('touchstart', moveSpotlight, { passive: true });
    }

    uvBtn.addEventListener('click', () => uvActive ? deactivateUV() : activateUV());

    function normalize(str) {
      return str.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[^\w\s]/g, '');
    }

    submitBtn.addEventListener('click', () => {
      const guess = normalize(guessInput.value);
      const correct = normalize(CORRECT_ANSWER);
      if (guess === correct || guess === "walkerjewellerystore") {
        resultMsg.style.color = '#2c5a2c';
        resultMsg.textContent = '✅ CORRECT!';
        deactivateUV();
        onSolve();
        // DO NOT close the modal – let the user click the CLOSE button
      } else {
        resultMsg.style.color = '#a13d3d';
        resultMsg.textContent = '❌ NOT YET... KEEP INVESTIGATING';
      }
    });

    guessInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') submitBtn.click();
    });

    // Ensure result message is empty on load (no red text)
    resultMsg.textContent = '';
  })();
}