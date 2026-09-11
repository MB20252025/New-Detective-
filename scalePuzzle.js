// ============================================================
//  SCALE PUZZLE – Balance of Justice (star, triangle, circle)
// ============================================================
function showScalePuzzleModal(onSolve) {
  const modalDiv = document.createElement('div');
  modalDiv.style.position = 'fixed';
  modalDiv.style.top = '0';
  modalDiv.style.left = '0';
  modalDiv.style.width = '100%';
  modalDiv.style.height = '100%';
  modalDiv.style.background = '#d9c8ae';
  modalDiv.style.zIndex = '3000';
  modalDiv.style.overflow = 'auto';
  modalDiv.innerHTML = `
    <div style="max-width:400px; margin:20px auto; background:#fff8e7; border-radius:40px; padding:18px 12px 22px; border:5px solid #b59e7c;">
      <h1 style="text-align:center; font-weight:700; color:#4a3729; font-size:2.0rem; letter-spacing:1px; text-shadow:2px 2px 0 #e9d7b4; margin:0 0 4px;">⚖️ AUTO‑DESELECT</h1>
      <div style="text-align:center; color:#6b4f3a; font-size:0.9rem; margin-bottom:8px; font-style:italic;">select → tap pan | deselects after placing | tap badge to remove</div>
      <div class="scale-stage" style="position:relative; height:260px; margin:10px 0;">
        <div style="position:relative; width:340px; height:260px; max-width:100%; margin:0 auto;">
          <div style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:160px; height:16px; background:#6b4f3a; border-radius:20px 20px 8px 8px; box-shadow:0 5px 0 #4a3729; border-bottom:3px solid #c9a87c; z-index:1;"></div>
          <div style="position:absolute; bottom:16px; left:50%; transform:translateX(-50%); width:20px; height:200px; background:#8b6b47; border-radius:10px 10px 4px 4px; box-shadow:inset -3px -3px 8px #3f2e1f,0 5px 0 #4a3729; border:2px solid #dbb78c; z-index:2;"></div>
          <div style="position:absolute; width:32px; height:32px; background:radial-gradient(circle at 30% 30%, #efdfc0, #b49164); border-radius:50%; left:50%; bottom:200px; transform:translate(-50%,50%); box-shadow:0 4px 0 #4d3a27,0 6px 10px rgba(0,0,0,0.4); border:3px solid #e7caa6; z-index:10;"></div>
          <div id="beam" style="position:absolute; width:260px; height:12px; background:linear-gradient(180deg,#9b7a54,#5a3e28); border-radius:30px; left:50%; bottom:216px; transform:translateX(-50%) rotate(0deg); transform-origin:center center; transition:transform 0.3s cubic-bezier(0.2,0.9,0.3,1.2); box-shadow:0 4px 0 #3f2e1f,0 8px 8px rgba(0,0,0,0.25); border-bottom:2px solid #d4af7a; z-index:5;"></div>
          <svg style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:12;">
            <line id="leftString" stroke="#6b4f3a" stroke-width="3" stroke-linecap="round" stroke-dasharray="2" x1="30" y1="40" x2="60" y2="150" />
            <line id="rightString" stroke="#6b4f3a" stroke-width="3" stroke-linecap="round" stroke-dasharray="2" x1="310" y1="40" x2="280" y2="150" />
          </svg>
          <div id="leftPan" style="position:absolute; width:120px; min-height:90px; background:transparent; border-bottom:4px solid #5a432e; box-shadow:0 2px 4px rgba(0,0,0,0.2); display:flex; align-items:flex-end; justify-content:center; cursor:pointer; transform-origin:center top; padding:0 4px 6px 4px; z-index:15;"><div id="leftWeights" style="display:flex; flex-direction:column; align-items:center; justify-content:flex-end; width:100%;"><div id="leftTopRow" style="display:flex; justify-content:center; gap:6px; margin-bottom:3px;"></div><div id="leftBottomRow" style="display:flex; justify-content:center; gap:6px;"></div></div></div>
          <div id="rightPan" style="position:absolute; width:120px; min-height:90px; background:transparent; border-bottom:4px solid #5a432e; box-shadow:0 2px 4px rgba(0,0,0,0.2); display:flex; align-items:flex-end; justify-content:center; cursor:pointer; transform-origin:center top; padding:0 4px 6px 4px; z-index:15;"><div id="rightWeights" style="display:flex; flex-direction:column; align-items:center; justify-content:flex-end; width:100%;"><div id="rightTopRow" style="display:flex; justify-content:center; gap:6px; margin-bottom:3px;"></div><div id="rightBottomRow" style="display:flex; justify-content:center; gap:6px;"></div></div></div>
        </div>
      </div>
      <div class="tray-label" style="text-align:center; color:#4b3621; margin:10px 0 5px; font-weight:600;">▼ select a weight (one each) ▼</div>
      <div id="tray" style="display:flex; flex-wrap:wrap; justify-content:center; gap:8px; margin:5px 0 10px; padding:10px 8px; background:#d8c5a8; border-radius:50px; border:3px solid #a88963;">
        <div class="tray-item" data-type="2" style="width:54px; height:54px; background:#fff0cc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1.9rem; font-weight:bold; border:4px solid #8b6d4b; box-shadow:0 4px 0 #5a432e; cursor:pointer; color:#1a3a1a; text-shadow:0 1px 0 #ffdd99;">2</div>
        <div class="tray-item" data-type="5" style="width:54px; height:54px; background:#fff0cc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1.9rem; font-weight:bold; border:4px solid #8b6d4b; box-shadow:0 4px 0 #5a432e; cursor:pointer; color:#1a3a1a; text-shadow:0 1px 0 #ffdd99;">5</div>
        <div class="tray-item" data-type="star" style="width:54px; height:54px; background:#fcf2dd; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1.9rem; border:4px solid #8b6d4b; box-shadow:0 4px 0 #5a432e; cursor:pointer;">⭐</div>
        <div class="tray-item" data-type="triangle" style="width:54px; height:54px; background:#fcf2dd; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1.9rem; border:4px solid #8b6d4b; box-shadow:0 4px 0 #5a432e; cursor:pointer;">🔺</div>
        <div class="tray-item" data-type="circle" style="width:54px; height:54px; background:#fcf2dd; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1.9rem; border:4px solid #8b6d4b; box-shadow:0 4px 0 #5a432e; cursor:pointer;">⚫</div>
      </div>
      <div class="action-row" style="display:flex; justify-content:center; margin:5px 0 10px;">
        <button id="resetScaleBtn" style="background:#b1865b; border:none; color:white; font-size:1.2rem; padding:8px 30px; border-radius:40px; font-weight:600; box-shadow:0 5px 0 #5f4230; cursor:pointer; border:2px solid #e9c894;">⟲ reset all</button>
      </div>
      <div class="guess-panel" style="background:#eedcbf; border-radius:40px; padding:15px 8px; border:3px solid #af8f6b;">
        <div class="guess-title" style="text-align:center; font-size:1rem; font-weight:600; color:#2e1f13; margin-bottom:8px;">deduce hidden values</div>
        <div class="guess-row" style="display:flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:8px;">
          <div class="guess-item" style="display:flex; align-items:center; gap:4px; background:#fcf2dd; padding:4px 10px 4px 6px; border-radius:30px; border:2px solid #957859; font-size:1.4rem;"><label>⭐</label><input type="number" id="starGuess" placeholder="?" style="width:50px; padding:4px; font-size:1.2rem; text-align:center; border:2px solid #b39264; border-radius:20px; background:#fffcf0; font-weight:600;"></div>
          <div class="guess-item" style="display:flex; align-items:center; gap:4px; background:#fcf2dd; padding:4px 10px 4px 6px; border-radius:30px; border:2px solid #957859; font-size:1.4rem;"><label>🔺</label><input type="number" id="triangleGuess" placeholder="?" style="width:50px; padding:4px; font-size:1.2rem; text-align:center; border:2px solid #b39264; border-radius:20px; background:#fffcf0; font-weight:600;"></div>
          <div class="guess-item" style="display:flex; align-items:center; gap:4px; background:#fcf2dd; padding:4px 10px 4px 6px; border-radius:30px; border:2px solid #957859; font-size:1.4rem;"><label>⚫</label><input type="number" id="circleGuess" placeholder="?" style="width:50px; padding:4px; font-size:1.2rem; text-align:center; border:2px solid #b39264; border-radius:20px; background:#fffcf0; font-weight:600;"></div>
          <button id="checkScaleBtn" style="background:#5f7b6e; border:none; color:white; font-size:1.4rem; padding:6px 18px; border-radius:40px; font-weight:700; box-shadow:0 4px 0 #2f4a3f; cursor:pointer; border:2px solid #bdd3c0;">✔ check</button>
        </div>
        <div class="message" id="scaleMessage" style="text-align:center; font-size:1.2rem; min-height:2.2rem; color:#2f4d3a; margin:8px 0 5px; padding:4px; background:#f4e9d8; border-radius:30px; border:2px solid #bda37e;"></div>
      </div>
      <button id="closeScaleModal" style="display:block; margin:15px auto 0; background:#8f7759; border:none; color:black; font-size:1rem; padding:8px 24px; border-radius:40px; font-family:'Cinzel',serif; letter-spacing:1px; box-shadow:0 4px 0 #4d3e2e; cursor:pointer;">❌ CLOSE</button>
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

  const SECRET = { star:2, triangle:4, circle:6 };
  let leftSet = new Set();
  let rightSet = new Set();
  let selectedType = null;

  const beam = modalDiv.querySelector('#beam');
  const leftPan = modalDiv.querySelector('#leftPan');
  const rightPan = modalDiv.querySelector('#rightPan');
  const leftTopRow = modalDiv.querySelector('#leftTopRow');
  const leftBottomRow = modalDiv.querySelector('#leftBottomRow');
  const rightTopRow = modalDiv.querySelector('#rightTopRow');
  const rightBottomRow = modalDiv.querySelector('#rightBottomRow');
  const leftString = modalDiv.querySelector('#leftString');
  const rightString = modalDiv.querySelector('#rightString');
  const trayItems = modalDiv.querySelectorAll('.tray-item');
  const resetBtn = modalDiv.querySelector('#resetScaleBtn');
  const starInp = modalDiv.querySelector('#starGuess');
  const triangleInp = modalDiv.querySelector('#triangleGuess');
  const circleInp = modalDiv.querySelector('#circleGuess');
  const checkBtn = modalDiv.querySelector('#checkScaleBtn');
  const msgDiv = modalDiv.querySelector('#scaleMessage');
  const closeBtn = modalDiv.querySelector('#closeScaleModal');

  // Attach close button to clear popups
  closeBtn.addEventListener('click', function() {
    clearPopups();
    modalDiv.remove();
  });

  function getValue(type) {
    if (type === '2') return 2;
    if (type === '5') return 5;
    if (type === 'star') return SECRET.star;
    if (type === 'triangle') return SECRET.triangle;
    if (type === 'circle') return SECRET.circle;
    return 0;
  }
  function getChar(type) {
    if (type === '2') return '2';
    if (type === '5') return '5';
    if (type === 'star') return '⭐';
    if (type === 'triangle') return '🔺';
    if (type === 'circle') return '⚫';
    return '?';
  }
  function splitPyramid(items) {
    let arr = Array.from(items);
    let total = arr.length;
    if (total <= 2) return { bottom: arr, top: [] };
    if (total === 3) return { bottom: arr.slice(0,2), top: arr.slice(2) };
    if (total === 4) return { bottom: arr.slice(0,2), top: arr.slice(2) };
    return { bottom: arr.slice(0,3), top: arr.slice(3) };
  }
  function computeTotals() {
    let leftTotal = 0, rightTotal = 0;
    for (let t of leftSet) leftTotal += getValue(t);
    for (let t of rightSet) rightTotal += getValue(t);
    return { leftTotal, rightTotal };
  }
  function render() {
    let leftSplit = splitPyramid(leftSet);
    leftBottomRow.innerHTML = '';
    leftTopRow.innerHTML = '';
    leftSplit.bottom.forEach(type => leftBottomRow.appendChild(createWeightBadge(type, 'left')));
    leftSplit.top.forEach(type => leftTopRow.appendChild(createWeightBadge(type, 'left')));

    let rightSplit = splitPyramid(rightSet);
    rightBottomRow.innerHTML = '';
    rightTopRow.innerHTML = '';
    rightSplit.bottom.forEach(type => rightBottomRow.appendChild(createWeightBadge(type, 'right')));
    rightSplit.top.forEach(type => rightTopRow.appendChild(createWeightBadge(type, 'right')));

    let { leftTotal, rightTotal } = computeTotals();
    let diff = leftTotal - rightTotal;
    let angle = Math.min(20, Math.max(-20, -diff));
    beam.style.transform = `translateX(-50%) rotate(${angle}deg)`;

    updatePanPositions(angle);

    trayItems.forEach(item => {
      let t = item.dataset.type;
      item.classList.toggle('used', leftSet.has(t) || rightSet.has(t));
    });
  }
  function createWeightBadge(type, side) {
    let b = document.createElement('span');
    b.className = 'weight-badge';
    b.textContent = getChar(type);
    b.dataset.type = type;
    b.dataset.side = side;
    b.style.cssText = 'display:inline-flex; align-items:center; justify-content:center; width:38px; height:38px; background:#f0dbb0; border:3px solid #4f3f2f; box-shadow:0 3px 0 #7b6144; font-size:1.8rem; color:#2c1f13; border-radius:4px; cursor:pointer; flex-shrink:0;';
    if (type === '2' || type === '5') b.style.background = '#ffefc0';
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      if (selectedType !== null) addToSide(side);
      else removeWeight(side, type);
    });
    return b;
  }
  function removeWeight(side, type) {
    if (side === 'left') leftSet.delete(type);
    else rightSet.delete(type);
    if (selectedType === type) selectedType = null;
    render();
    highlightTray();
  }
  function updatePanPositions(angle) {
    const svgHeight = 260;
    const beamY = svgHeight - 216;
    const beamCenterX = 170;
    const half = 130;
    const rad = angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    let leftEndX = beamCenterX + (-half * cos - 0 * sin);
    let leftEndY = beamY + (-half * sin + 0 * cos);
    let rightEndX = beamCenterX + (half * cos - 0 * sin);
    let rightEndY = beamY + (half * sin + 0 * cos);

    const STRING_LENGTH = 70;
    const leftPanX = leftEndX;
    const leftPanY = leftEndY + STRING_LENGTH;
    const rightPanX = rightEndX;
    const rightPanY = rightEndY + STRING_LENGTH;

    leftPan.style.left = (leftPanX - 60) + 'px';
    leftPan.style.top = leftPanY + 'px';
    rightPan.style.left = (rightPanX - 60) + 'px';
    rightPan.style.top = rightPanY + 'px';

    void leftPan.offsetHeight;
    void rightPan.offsetHeight;

    let leftPanBottom = leftPanY + leftPan.offsetHeight;
    let rightPanBottom = rightPanY + rightPan.offsetHeight;

    leftString.setAttribute('x1', leftEndX);
    leftString.setAttribute('y1', leftEndY);
    leftString.setAttribute('x2', leftPanX);
    leftString.setAttribute('y2', leftPanBottom);

    rightString.setAttribute('x1', rightEndX);
    rightString.setAttribute('y1', rightEndY);
    rightString.setAttribute('x2', rightPanX);
    rightString.setAttribute('y2', rightPanBottom);
  }
  function highlightTray() {
    trayItems.forEach(item => {
      let t = item.dataset.type;
      item.classList.toggle('selected', t === selectedType && !leftSet.has(t) && !rightSet.has(t));
    });
  }
  function addToSide(side) {
    if (!selectedType) {
      msgDiv.textContent = '⚡ select a weight';
      setTimeout(() => { if (msgDiv.textContent === '⚡ select a weight') msgDiv.textContent = ''; }, 700);
      return;
    }
    if (leftSet.has(selectedType) || rightSet.has(selectedType)) {
      msgDiv.textContent = '⛔ already used (deselect to remove)';
      setTimeout(() => { if (msgDiv.textContent === '⛔ already used (deselect to remove)') msgDiv.textContent = ''; }, 1000);
      return;
    }
    if (side === 'left') leftSet.add(selectedType);
    else rightSet.add(selectedType);

    selectedType = null;

    render();

    let pan = side === 'left' ? leftPan : rightPan;
    pan.classList.add('bounce');
    setTimeout(() => pan.classList.remove('bounce'), 150);

    highlightTray();
    msgDiv.textContent = '';
  }
  function resetAll() {
    leftSet.clear();
    rightSet.clear();
    selectedType = null;
    render();
    highlightTray();
    msgDiv.textContent = '';
  }
  function attachEvents() {
    trayItems.forEach(item => {
      item.addEventListener('click', () => {
        let t = item.dataset.type;
        if (leftSet.has(t) || rightSet.has(t)) {
          msgDiv.textContent = '⛔ already on scale (deselect to remove)';
          setTimeout(() => { if (msgDiv.textContent === '⛔ already on scale (deselect to remove)') msgDiv.textContent = ''; }, 700);
          return;
        }
        selectedType = (selectedType === t) ? null : t;
        highlightTray();
        msgDiv.textContent = selectedType ? `selected ${getChar(selectedType)}` : 'no selection';
        setTimeout(() => { if (msgDiv.textContent.includes('selected') || msgDiv.textContent === 'no selection') msgDiv.textContent = ''; }, 800);
      });
    });

    leftPan.addEventListener('click', () => addToSide('left'));
    rightPan.addEventListener('click', () => addToSide('right'));

    resetBtn.addEventListener('click', resetAll);

    checkBtn.addEventListener('click', () => {
      let s = parseInt(starInp.value, 10);
      let t = parseInt(triangleInp.value, 10);
      let c = parseInt(circleInp.value, 10);
      if (isNaN(s) || isNaN(t) || isNaN(c)) {
        msgDiv.textContent = '❌ enter numbers';
        return;
      }
      if (s === SECRET.star && t === SECRET.triangle && c === SECRET.circle) {
        msgDiv.textContent = '✅ Puzzle solved!';
        onSolve();
        // DO NOT close the modal – let the user click the CLOSE button
      } else {
        game.addPenalty();
        msgDiv.textContent = '❌ Not quite. Try again.';
      }
    });
  }

  render();
  attachEvents();
}