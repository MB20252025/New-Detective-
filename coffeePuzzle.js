// ============================================================
//  COFFEE PUZZLE – Pour exactly 8 litres into the 10L jug
// ============================================================
function showCoffeePuzzleModal(onSolve) {
  const modalDiv = document.createElement('div');
  modalDiv.style.position = 'fixed';
  modalDiv.style.top = '0';
  modalDiv.style.left = '0';
  modalDiv.style.width = '100%';
  modalDiv.style.height = '100%';
  modalDiv.style.background = '#2b2520';
  modalDiv.style.zIndex = '3000';
  modalDiv.style.overflow = 'auto';
  modalDiv.style.display = 'flex';
  modalDiv.style.justifyContent = 'center';
  modalDiv.style.alignItems = 'center';
  modalDiv.innerHTML = `
    <style>
      * { box-sizing: border-box; user-select: none; margin: 0; padding: 0; }
      .coffee-wrapper {
        font-family: 'Segoe UI', Arial, sans-serif;
        text-align: center;
        background: #0a1a2f;
        color: #dce6f0;
        background-image: radial-gradient(circle at 20% 30%, #1a2a3f 5%, #051020 90%);
        padding: 20px;
        border-radius: 30px;
        max-width: 600px;
        width: 100%;
        margin: 20px auto;
      }
      .top-section { flex-shrink: 0; }
      h1 { margin: 0; font-weight: 400; letter-spacing: 1px; color: #fad7a8; text-shadow: 0 2px 5px #2d1f13; font-size: 1.8rem; }
      .sub { font-size: 1.2rem; background: #2b1f17b8; padding: 4px 20px; border-radius: 40px; backdrop-filter: blur(2px); border: 1px solid #b48d64; margin: 4px 0 2px; display: inline-block; }
      .info { font-size: 0.9rem; background: #1f2a2f; padding: 4px 18px; border-radius: 30px; border: 1px solid #b59268; margin: 2px 0 10px; display: inline-block; }
      .spacer { flex: 1 1 auto; min-height: 10px; }
      .jugContainer { display: flex; justify-content: center; align-items: flex-end; gap: 40px; width: 100%; max-width: 550px; margin: 0 auto; padding: 0 5px; }
      .jug {
        position: relative; cursor: pointer; background: rgba(40,35,30,0.25); border: 2px solid rgba(230,210,180,0.5);
        border-radius: 15px 15px 25px 25px; box-shadow: 0 0 0 1px rgba(255,235,200,0.3), inset 0 0 12px rgba(230,200,160,0.25), 0 8px 12px rgba(0,0,0,0.7);
        backdrop-filter: blur(2px); transition: border 0.15s, transform 0.15s; overflow: visible; width: 90px; min-width: 80px;
      }
      #jug6 { height: 140px; } #jug5 { height: 120px; } #jug10 { height: 170px; }
      .jug:hover { transform: scale(1.02); border-color: #efcba0; }
      .selected { border-color: #fdb657; box-shadow: 0 0 0 3px #c58d42, inset 0 0 15px #f3b15a, 0 12px 18px black; transform: translateY(-10px); }
      .jug::before { content: ""; position: absolute; top: -3px; left: -2px; width: calc(100% + 4px); height: 12px; background: linear-gradient(180deg, #cdb697, #9f8468); border-radius: 18px 18px 8px 8px; box-shadow: 0 1px 3px #2f1e0f, inset 0 -1px 2px #fff3d1; z-index: 15; pointer-events: none; }
      .jug::after { content: ""; position: absolute; top: -1px; left: 1px; width: calc(100% - 2px); height: 8px; background: radial-gradient(circle at 30% 30%, rgba(255,240,210,0.7), transparent 80%); border-radius: 12px 12px 0 0; z-index: 16; pointer-events: none; }
      .pour-spout { position: absolute; top: -4px; left: -6px; width: 18px; height: 12px; background: #b48b62; border-radius: 20% 50% 40% 40%; transform: rotate(-5deg); box-shadow: 0 2px 4px rgba(0,0,0,0.5), inset -1px -1px 3px #ffe2b3; z-index: 20; pointer-events: none; border: 1px solid #dbbc93; }
      .handle { position: absolute; background: transparent; border-radius: 30px; box-shadow: 0 3px 6px rgba(0,0,0,0.6), inset 0 2px 4px #ecdbba; pointer-events: none; z-index: 30; }
      .cup-handle { right: -18px; top: 20px; width: 22px; height: 55px; border: 4px solid #b48b62; }
      .jug-handle { right: -20px; top: 25px; width: 26px; height: 75px; border: 5px solid #b48b62; }
      .water { position: absolute; bottom: 0; width: 100%; background: linear-gradient(150deg, #8b5d37, #5b3f25 85%); border-radius: 0 0 22px 22px; transition: height 0.2s ease-out; box-shadow: inset 0 4px 4px -3px #ebbc81, 0 -1px 3px #ab7a49; z-index: 1; }
      .marks { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10; }
      .mark { position: absolute; left: 8%; width: 84%; height: 1.5px; background: linear-gradient(90deg, transparent, rgba(255,240,200,0.9), rgba(255,225,160,1), rgba(255,240,200,0.9), transparent); transform: translateY(50%); box-shadow: 0 0 3px #ffeecc; opacity: 0.9; }
      .mark.target-mark { background: #2ecc71; box-shadow: 0 0 8px #27ae60; height: 2px; opacity: 1; }
      .mark::after { content: attr(data-label); position: absolute; left: -22px; top: -6px; font-size: 7px; font-weight: 500; color: #e4cfb2; text-shadow: 0 0 2px #2a180b; background: rgba(30,22,15,0.8); padding: 1px 4px; border-radius: 16px; border: 1px solid #b69465; backdrop-filter: blur(2px); line-height: 1.1; white-space: nowrap; }
      .mark.target-mark::after { background: #1e4a2e; border-color: #2ecc71; color: white; font-weight: bold; }
      .label { margin-top: 14px; font-size: 0.8rem; background: #2b231d; display: inline-block; padding: 3px 10px; border-radius: 20px; border: 1px solid #b6976f; color: #fadbbc; letter-spacing: 0.5px; box-shadow: inset 0 1px 3px #3d2c1b; white-space: nowrap; }
      .bottom-section { flex-shrink: 0; margin-bottom: 10px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 15px; }
      .bottom-section button { margin-top: 8px; padding: 5px 24px; font-size: 0.9rem; background: #4f3a28; border: 2px solid #cbab82; color: #f7e9d3; border-radius: 30px; cursor: pointer; font-weight: 600; transition: all 0.15s; box-shadow: 0 3px 0 #2b1d12; }
      .bottom-section button:hover { background: #73583e; border-color: #f5cf9e; transform: translateY(-1px); box-shadow: 0 4px 0 #2b1d12; }
      .bottom-section button:active { transform: translateY(2px); box-shadow: 0 1px 0 #2b1d12; }
      .note { margin-top: 5px; font-style: italic; color: #cfa97c; background: #0000002e; padding: 2px 14px; border-radius: 20px; font-size: 0.65rem; display: inline-block; }
    </style>
    <div class="coffee-wrapper">
      <div class="top-section">
        <h1>The Coffee Puzzle</h1>
        <div class="sub">8L in the 10L Jug</div>
        <p class="info">Tap, then tap another (target is the green line)</p>
      </div>
      <div class="spacer"></div>
      <div class="jugContainer">
        <div><div class="jug" id="jug6" onclick="selectJug(0)"><div class="water" id="water6"></div><div class="handle cup-handle"></div></div><div class="label">6L Cup</div></div>
        <div><div class="jug" id="jug5" onclick="selectJug(1)"><div class="water" id="water5"></div><div class="handle cup-handle"></div></div><div class="label">5L Cup</div></div>
        <div><div class="jug" id="jug10" onclick="selectJug(2)"><div class="water" id="water10"></div><div class="handle jug-handle"></div><div class="pour-spout"></div></div><div class="label">10L Jug</div></div>
      </div>
      <div class="spacer"></div>
      <div class="bottom-section">
        <button onclick="resetGame()">⟲ Fresh Coffee</button>
        <button id="solveCoffeeBtn">⚡ SOLVE</button>
        <button id="closeCoffeeBtn">❌ CLOSE</button>
        <div class="note">— Breakroom Edition —</div>
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

  const closeCoffeeBtn = modalDiv.querySelector('#closeCoffeeBtn');
  closeCoffeeBtn.onclick = function() {
    clearPopups();
    modalDiv.remove();
  };

  (function() {
    const capacity = [6, 5, 10];
    let jugs = [6, 5, 0];
    let selected = null;
    let solved = false;
    let stepInterval = null;
    const jugElements = modalDiv.querySelectorAll('.jug');
    const waterElements = [modalDiv.querySelector('#water6'), modalDiv.querySelector('#water5'), modalDiv.querySelector('#water10')];
    function createMeasurementLines() {
      jugElements.forEach((jug, idx) => {
        const cap = capacity[idx];
        let marksDiv = jug.querySelector('.marks');
        if (marksDiv) marksDiv.remove();
        marksDiv = document.createElement('div');
        marksDiv.className = 'marks';
        jug.appendChild(marksDiv);
        for (let liter = 1; liter < cap; liter++) {
          const mark = document.createElement('div');
          mark.className = 'mark';
          mark.style.bottom = (liter / cap) * 100 + '%';
          mark.setAttribute('data-label', liter + 'L');
          if (idx === 2 && liter === 8) mark.classList.add('target-mark');
          marksDiv.appendChild(mark);
        }
      });
    }
    createMeasurementLines();
    function updateUI() {
      waterElements[0].style.height = (jugs[0] / capacity[0] * 100) + '%';
      waterElements[1].style.height = (jugs[1] / capacity[1] * 100) + '%';
      waterElements[2].style.height = (jugs[2] / capacity[2] * 100) + '%';
      if (!solved && Math.abs(jugs[2] - 8) < 0.001) {
        solved = true;
        if (stepInterval) clearInterval(stepInterval);
        onSolve();
        // DO NOT close the modal – let the user click the CLOSE button
      }
    }
    function clearSelectedStyle() { jugElements.forEach(el => el.classList.remove('selected')); }
    function pour(fromIdx, toIdx) {
      if (fromIdx === toIdx) return;
      const space = capacity[toIdx] - jugs[toIdx];
      if (space <= 0) return;
      const amount = Math.min(space, jugs[fromIdx]);
      if (amount === 0) return;
      jugs[fromIdx] -= amount;
      jugs[toIdx] += amount;
      updateUI();
    }
    window.selectJug = function(index) {
      if (solved) return;
      if (selected === null) { selected = index; jugElements[index].classList.add('selected'); }
      else { pour(selected, index); jugElements[selected].classList.remove('selected'); selected = null; updateUI(); }
    };
    window.resetGame = function() {
      if (solved) return;
      if (stepInterval) clearInterval(stepInterval);
      jugs = [6, 5, 0];
      clearSelectedStyle(); selected = null; updateUI();
    };
    const solveBtn = modalDiv.querySelector('#solveCoffeeBtn');
    if (solveBtn) {
      solveBtn.onclick = () => {
        if (solved) return;
        game.addPenalty();
        window.resetGame();
        const steps = [[0,2],[1,0],[2,0],[0,1],[1,2],[0,1],[2,0],[0,1],[1,2],[0,1],[2,0],[0,1],[1,2]];
        let stepIndex = 0;
        if (stepInterval) clearInterval(stepInterval);
        stepInterval = setInterval(() => {
          if (solved || stepIndex >= steps.length) { clearInterval(stepInterval); return; }
          const [from, to] = steps[stepIndex];
          pour(from, to);
          stepIndex++;
        }, 600);
      };
    }
    updateUI();
  })();
}