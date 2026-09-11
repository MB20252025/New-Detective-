// ============================================================
//  BACK PAGE – The Daily Chronicle (puzzles only)
// ============================================================
function showBackPageModal() {
  const backPageHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <title>Daily Chronicle – Puzzle Page</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#2c241f; font-family:"Times New Roman",Georgia,serif; display:flex; flex-direction:column; align-items:center; padding:20px; min-height:100vh; }
    .newspaper { width:100%; max-width:1000px; padding:20px 16px; border:2px solid #111; background:#fff; font-family:"Times New Roman",serif; color:#111; }
    .header { text-align:center; border-bottom:2px solid #000; padding-bottom:8px; margin-bottom:14px; }
    .title { font-size:34px; font-weight:bold; letter-spacing:1.5px; }
    .meta { display:flex; justify-content:space-between; font-size:12px; margin-top:6px; font-weight:500; }
    .content { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .puzzle { border-top:1px solid #000; padding-top:8px; display:flex; flex-direction:column; }
    .headline { font-weight:800; font-size:16px; margin-bottom:5px; }
    .wordsearch { margin-top:6px; overflow-x:auto; }
    .wordsearch table { border-collapse:collapse; width:100%; background:#fff; cursor:pointer; }
    .wordsearch td { border:1px solid #111; width:32px; height:32px; text-align:center; font-weight:bold; font-size:16px; background-color:#fff; transition:all 0.1s; user-select:none; cursor:pointer; }
    .wordsearch td.selected { background-color:#f9e45b; box-shadow:inset 0 0 0 2px #d4a017; }
    .wordsearch td.found { background-color:#a5d6a5; color:#2c5e2c; }
    .wordsearch-clues { display:flex; justify-content:space-between; margin:8px 0; gap:20px; }
    .wordsearch-clues-column { display:flex; flex-direction:column; gap:12px; flex:1; }
    .wordsearch-clues-column p { margin:0; font-size:14px; font-weight:600; font-family:'Courier New',monospace; padding:2px 0; border-left:2px solid #d4c9b6; padding-left:8px; cursor:pointer; }
    .wordsearch-clues-column p.found-clue { text-decoration:line-through; color:#2e7d32; border-left-color:#2e7d32; }
    .sudoku { margin:8px 0 4px; overflow-x:auto; }
    .sudoku table { border-collapse:collapse; width:100%; background:#fff; }
    .sudoku td { border:1px solid #888; width:36px; height:36px; text-align:center; padding:0; }
    .sudoku td[data-col="2"], .sudoku td[data-col="5"], .sudoku td[data-col="8"] { border-right:3px solid #111; }
    .sudoku td[data-row="2"], .sudoku td[data-row="5"], .sudoku td[data-row="8"] { border-bottom:3px solid #111; }
    .sudoku input { width:100%; height:100%; text-align:center; font-weight:bold; font-size:16px; font-family:'Courier New',monospace; border:none; background:transparent; outline:none; color:#1e3c5c; }
    .sudoku input:focus { background-color:#fff3cf; }
    .sudoku .given-cell { background-color:#f0ede8; }
    .sudoku .given-cell input { font-weight:800; color:#2c3e2f; }
    .sudoku td.error-cell { background-color:#ffe0e0; }
    .reset-btn { margin-top:8px; background:#e0d6c6; border:1px solid #9b8e7c; padding:5px 12px; border-radius:20px; font-size:11px; font-weight:bold; cursor:pointer; font-family:system-ui; align-self:flex-start; }
    .entertainment { margin-top:20px; border-top:2px solid #000; padding-top:14px; display:grid; grid-template-columns:1fr 1fr; gap:18px; background:#fff; }
    .riddle-box, .joke-box { background:#fff; padding:10px 8px 8px 8px; border-left:3px solid #c7b27e; }
    .riddle-box h4, .joke-box h4 { font-size:15px; font-weight:800; margin-bottom:12px; color:#3a2a1f; border-bottom:2px solid #e2d5bc; display:inline-block; padding-bottom:4px; }
    .riddle-item, .joke-item { margin-bottom:14px; }
    .riddle-question { font-weight:700; font-size:13px; color:#2c5530; margin-bottom:4px; font-family:'Courier New',monospace; cursor:pointer; display:inline-block; }
    .riddle-question:hover { text-decoration:underline; }
    .riddle-answer { font-size:12.5px; color:#5a3e2e; padding-left:10px; border-left:2px solid #e8ddc4; margin-top:6px; display:none; }
    .riddle-answer.revealed { display:block; }
    .joke-text { font-size:12.5px; color:#2c3e2f; line-height:1.4; font-weight:500; }
    .joke-punchline { font-weight:700; color:#b45f2b; margin-top:4px; font-size:12px; padding-left:6px; }
    hr.divider-light { margin:8px 0; border:0; height:1px; background:#e2d5bc; }
    .tap-instruction { text-align:center; font-size:11px; color:#8b7355; font-family:monospace; margin-top:16px; padding:6px; background:#fef7e8; border-radius:20px; }
    .space-filler { display:flex; justify-content:center; align-items:center; gap:12px; margin:8px 0 4px; color:#b8a77c; font-family:monospace; font-size:12px; }
    .space-filler hr { flex:1; border:none; height:1px; background:linear-gradient(90deg,transparent,#d4c5a8,transparent); }
    .space-filler span { font-size:14px; letter-spacing:2px; }
    .puzzle-facts { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px; border-top:2px solid #000; padding-top:16px; }
    .fact-item { background:#f8f4ec; padding:12px; border-radius:8px; border-left:4px solid #c7b27e; }
    .fact-item strong { display:block; margin-bottom:6px; color:#3a2a1f; }
    .cryptogram-container { background:#f8f4ec; padding:16px; border-radius:8px; border-left:4px solid #c7b27e; margin-top:8px; }
    .cryptogram-container h2 { font-size:18px; margin-bottom:10px; color:#2c2418; }
    .cryptogram-container .encrypted { font-size:18px; font-family:'Courier New',monospace; font-weight:bold; letter-spacing:2px; color:#1e3c5c; padding:8px; background:#fff; border-radius:4px; border:1px solid #d4c9b6; }
    .page-control { margin-top:12px; display:flex; justify-content:center; gap:12px; }
    .nav-btn { background:#2b2a27; border:none; color:#f9f2e0; font-family:system-ui,sans-serif; font-size:1rem; font-weight:600; padding:10px 24px; border-radius:60px; cursor:pointer; box-shadow:0 3px 8px rgba(0,0,0,0.2); transition:all 0.2s; }
    .nav-btn:hover { transform:translateY(-2px); box-shadow:0 5px 12px rgba(0,0,0,0.3); }
  </style>
</head>
<body>
<div class="newspaper">
  <div class="header">
    <div class="title">THE DAILY CHRONICLE</div>
    <div class="meta"><span>March 20, 2026</span><span>£1.50</span></div>
  </div>
  <div class="content">
    <div>
      <div class="puzzle">
        <div class="headline">🔍 Word Search 1 Clues</div>
        <div class="wordsearch-clues" id="ws1-clues-container"></div>
      </div>
    </div>
    <div>
      <div class="puzzle">
        <div class="headline">Word Search 1 Grid</div>
        <div class="wordsearch" id="wordsearch1"></div>
      </div>
    </div>
  </div>
  <div class="content">
    <div>
      <div class="puzzle">
        <div class="headline">🧩 Sudoku Puzzle 1</div>
        <div id="sudoku1" class="sudoku"></div>
        <button class="reset-btn" id="resetSudoku1">⟳ Reset Sudoku 1</button>
      </div>
    </div>
    <div>
      <div class="puzzle">
        <div class="headline">🧩 Sudoku Puzzle 2</div>
        <div id="sudoku2" class="sudoku"></div>
        <button class="reset-btn" id="resetSudoku2">⟳ Reset Sudoku 2</button>
      </div>
    </div>
  </div>
  <div class="content">
    <div>
      <div class="puzzle">
        <div class="headline">🔍 Word Search 2 Clues</div>
        <div class="wordsearch-clues" id="ws2-clues-container"></div>
      </div>
    </div>
    <div>
      <div class="puzzle">
        <div class="headline">Word Search 2 Grid</div>
        <div class="wordsearch" id="wordsearch2"></div>
      </div>
    </div>
  </div>
  <div class="entertainment">
    <div class="riddle-box">
      <h4>📜 WEEKLY RIDDLES</h4>
      <div class="riddle-item"><div class="riddle-question">❓ I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?</div><div class="riddle-answer"><strong>Answer:</strong> An echo.</div></div>
      <div class="riddle-item"><div class="riddle-question">❓ The more you take, the more you leave behind. What are they?</div><div class="riddle-answer"><strong>Answer:</strong> Footsteps.</div></div>
      <div class="riddle-item"><div class="riddle-question">❓ I am always coming but never arrive. What am I?</div><div class="riddle-answer"><strong>Answer:</strong> Tomorrow.</div></div>
      <div class="riddle-item"><div class="riddle-question">❓ What has a face and two hands but no arms or legs?</div><div class="riddle-answer"><strong>Answer:</strong> A clock.</div></div>
      <div class="riddle-item"><div class="riddle-question">❓ I have keys but open no locks. I have space but no room. What am I?</div><div class="riddle-answer"><strong>Answer:</strong> A keyboard.</div></div>
      <div class="tap-instruction">👆 Tap riddles to reveal answers!</div>
    </div>
    <div class="joke-box">
      <h4>😆 DETECTIVE PUNS & JOKES</h4>
      <div class="joke-item"><div class="joke-text">Why did the detective bring a ladder to the crime scene?</div><div class="joke-punchline">He heard the case was "unsolved" and wanted to get to the next level.</div></div>
      <hr class="divider-light">
      <div class="joke-item"><div class="joke-text">What do you call a detective who solves cases in the bakery?</div><div class="joke-punchline">Sherlock Doughmes.</div></div>
      <hr class="divider-light">
      <div class="joke-item"><div class="joke-text">How does a detective solve a riddle?</div><div class="joke-punchline">He follows the "clue"prints.</div></div>
      <hr class="divider-light">
      <div class="joke-item"><div class="joke-text">Why did the private eye always carry a pencil?</div><div class="joke-punchline">In case he needed to draw his own conclusions.</div></div>
      <hr class="divider-light">
      <div class="joke-item"><div class="joke-text">What's a detective's favorite type of music?</div><div class="joke-punchline">Rhythm & Clues.</div></div>
      <hr class="divider-light">
      <div class="joke-item"><div class="joke-text">Why did the detective go to art school?</div><div class="joke-punchline">To learn how to draw a conclusion.</div></div>
    </div>
  </div>
  <div class="space-filler"><hr><span>✦  PUZZLE CORNER  ✦</span><hr></div>
  <div class="puzzle-facts">
    <div class="fact-item">
      <strong>🧩 Riddle of the Day</strong>
      <span class="fact-riddle" id="dailyRiddle">What has keys but can't open locks, and space but no room?</span>
      <div class="fact-answer" id="riddleAnswer">A keyboard (or a piano)!</div>
    </div>
    <div class="fact-item">
      <strong>📖 Puzzle Facts</strong>
      The first crossword puzzle was published in the <em>New York World</em> newspaper on December 21, 1913. It was called a "word-cross". There are more Rubik's Cube combinations than atoms in your body. Around 43 quintillion combinations—far beyond human-scale counting.
    </div>
    <div class="fact-item">
      <strong>🧩 Spot The Liar Puzzle</strong>
      <div class="riddle-item">
        <div class="riddle-question">
          I wrote down a number and showed it to Alice, Ben, Charlotte and Daniel.<br>Clue: Go through each person assuming they are the liar. If their lie causes another person to be a liar, they can't be the original sole liar.<br>
          Alice: “It's not 150”.<br>
          Ben: “It has exactly two digits”.<br>
          Charlotte: “It goes evenly into 150”.<br>
          Daniel: “It's divisible by 25”.<br>
          Exactly one of them is lying. Who is the liar?
        </div>
        <div class="riddle-answer">
          <strong>Answer:</strong> Daniel. The number is 30 – only Daniel's statement is false.
        </div>
      </div>
    </div>
    <div class="fact-item">
      <strong>🔢 Sudoku Facts</strong>
      The modern Sudoku was popularized in Japan in 1986, but number puzzles similar to it appeared in French newspapers as early as 1895. The world's hardest Sudoku took over 6 hours to solve.
    </div>
    <div class="cryptogram-container">
      <h2>🔐 CRYPTOGRAM</h2>
      <p class="encrypted">
        19 3 8 5 20 5 14 3 5 / 15 18 4 5 18 / 8 9 4 5 19 / 20 8 5 / 20 18 21 20 8
      </p>
      <h3 style="margin-top:10px; font-size:14px;">📌 DECODE KEY</h3>
      <p style="font-family:monospace; font-size:14px; background:#fff; padding:8px; border-radius:4px; border:1px solid #d4c9b6;">
        A=1  B=?  C=3  D=?  E=5  F=?  G=?  H=8  I=?  J=?  K=?  L=12  M=?  N=14  O=?  P=?  Q=?  R=18  S=?  T=20  U=?  V=?  W=?  X=24  Y=?  Z=26
      </p>
      <p style="font-size:13px; margin-top:8px;">Decode the message using the incomplete key.</p>
    </div>
  </div>
  <div class="page-control">
    <button class="nav-btn" id="goToFrontPage">📰 TURN TO FRONT PAGE (NEWS)</button>
  </div>
</div>
<script>
  (function(){
    function initRiddles(){
      document.querySelectorAll('.riddle-question').forEach(q=>{let a=q.nextElementSibling;if(a&&a.classList.contains('riddle-answer'))q.addEventListener('click',e=>{e.stopPropagation();a.classList.toggle('revealed')})});
      const r=document.getElementById('dailyRiddle'),a=document.getElementById('riddleAnswer');if(r&&a)r.addEventListener('click',()=>a.classList.toggle('revealed'));
    }
    const ws1Grid=[['T','S','I','E','H','Y'],['M','A','P','S','B','N'],['C','Z','K','T','K','I'],['Y','L','I','S','N','G'],['Q','H','U','J','A','H'],['W','S','M','E','B','T']];
    const ws1Words=['BANK','CLUE','MAP','NIGHT','HEIST','WHITBY'];
    const ws2Grid=[['A','U','K','R','A','M'],['P','L','C','O','P','O'],['T','N','I','R','P','T'],['C','B','O','B','S','I'],['A','O','A','U','I','V'],['F','J','D','L','B','E']];
    const ws2Words=['ALIBI','COP','DUST','LAB','MARK','PRINT','PROOF','FACT','MOTIVE'];
    let ws1State={selectedCells:new Set(),foundCells:new Set(),foundWords:new Set()},ws2State={selectedCells:new Set(),foundCells:new Set(),foundWords:new Set()};
let ws1HintAwarded = false, ws2HintAwarded = false, sudoku1HintAwarded = false, sudoku2HintAwarded = false;
function awardHint(puzzleName) {
    if (parent && parent.game) {
        if (typeof parent.game.addHint === 'function') {
            parent.game.addHint();
            showBackPageToast("🎉 +1 Hint earned!");
            if (puzzleName === 'ws1') ws1HintAwarded = true;
            if (puzzleName === 'ws2') ws2HintAwarded = true;
            if (puzzleName === 'sudoku1') sudoku1HintAwarded = true;
            if (puzzleName === 'sudoku2') sudoku2HintAwarded = true;
        }
    }
}
function showBackPageToast(message) {
    let toast = document.getElementById('backPageToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'backPageToast';
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = '#1e3d4a';
        toast.style.color = '#f5e7c8';
        toast.style.border = '2px solid #eace9f';
        toast.style.borderRadius = '50px';
        toast.style.padding = '10px 20px';
        toast.style.fontFamily = 'monospace';
        toast.style.fontWeight = 'bold';
        toast.style.zIndex = '10001';
        toast.style.whiteSpace = 'nowrap';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.style.display = 'none';
            toast.style.opacity = '1';
        }, 500);
    }, 4000);
}
function cellKey(r,c){return r+','+c;}
function checkWord(grid,selected,words,foundWords,foundCells,cluesId){
      if(selected.size<2)return false;
      let arr=Array.from(selected).map(k=>{let[r,c]=k.split(',').map(Number);return{r,c}});
      for(let w of words){
        if(foundWords.has(w)||w.length!==arr.length)continue;
        let dr=arr[1].r-arr[0].r,dc=arr[1].c-arr[0].c,sr=dr===0?0:(dr>0?1:-1),sc=dc===0?0:(dc>0?1:-1),line=true;
        for(let i=1;i<arr.length;i++)if(arr[i].r!==arr[0].r+sr*i||arr[i].c!==arr[0].c+sc*i){line=false;break;}
        if(!line)continue;
        let fwd=true,rev=true;
        for(let i=0;i<w.length;i++){if(grid[arr[i].r][arr[i].c]!==w[i])fwd=false;if(grid[arr[arr.length-1-i].r][arr[arr.length-1-i].c]!==w[i])rev=false;if(!fwd&&!rev)break;}
        if(fwd||rev){
    arr.forEach(cell=>foundCells.add(cellKey(cell.r,cell.c)));
    foundWords.add(w);
    document.getElementById(cluesId).querySelectorAll('p').forEach(p=>{if(p.innerText===w)p.classList.add('found-clue')});
    selected.clear();
    if (!ws1HintAwarded && cluesId === 'ws1-clues-container') {
        if (foundWords.size === ws1Words.length) awardHint('ws1');
    }
    if (!ws2HintAwarded && cluesId === 'ws2-clues-container') {
        if (foundWords.size === ws2Words.length) awardHint('ws2');
    }
    return true;
}
      }
      return false;
    }
    function renderWS(grid,containerId,state,cluesId,isWS2){
      const cont=document.getElementById(containerId);let html='<table>';
      for(let r=0;r<grid.length;r++){html+='<tr>';for(let c=0;c<grid[0].length;c++){let key=cellKey(r,c),cls='';if(state.foundCells.has(key))cls='found';if(state.selectedCells.has(key))cls+=' selected';html+='<td class="'+cls.trim()+'" data-row="'+r+'" data-col="'+c+'">'+grid[r][c]+'</td>';}html+='</tr>';}
      html+='</table>';cont.innerHTML=html;cont.querySelectorAll('td').forEach(td=>{td.addEventListener('click',e=>{e.stopPropagation();let r=parseInt(td.dataset.row),c=parseInt(td.dataset.col),key=cellKey(r,c);if(state.selectedCells.has(key))state.selectedCells.delete(key);else state.selectedCells.add(key);let words=isWS2?ws2Words:ws1Words,gridData=isWS2?ws2Grid:ws1Grid;checkWord(gridData,state.selectedCells,words,state.foundWords,state.foundCells,cluesId);renderWS(grid,containerId,state,cluesId,isWS2);});});
    }
    function renderClues(words,found,containerId){let cont=document.getElementById(containerId),col1=[],col2=[],mid=Math.ceil(words.length/2);words.forEach((w,i)=>{let cls=found.has(w)?'found-clue':'';let p='<p class="'+cls+'">'+w+'</p>';if(i<mid)col1.push(p);else col2.push(p);});cont.innerHTML='<div class="wordsearch-clues-column">'+col1.join('')+'</div><div class="wordsearch-clues-column">'+col2.join('')+'</div>';}
    function initWS(grid,words,gridId,cluesId,isWS2){let state=isWS2?ws2State:ws1State;renderWS(grid,gridId,state,cluesId,isWS2);renderClues(words,state.foundWords,cluesId);}
    const sudoku1Init=[[5,0,3,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]];
    const sudoku2Init=[[1,0,0,4,0,0,5,0,0],[0,3,0,0,5,0,0,2,0],[0,0,6,0,0,2,0,0,7],[7,0,0,2,0,0,0,0,5],[0,5,0,0,3,0,0,6,0],[4,0,0,0,0,6,0,0,8],[0,0,2,0,5,8,0,0,0],[0,7,0,0,8,0,0,4,0],[0,0,0,0,7,0,0,3,0]];
function buildSudoku(containerId, initBoard, resetId) {
    let board = initBoard.map(r => [...r]);
    const cont = document.getElementById(containerId);
    function markErr(r, c, err) {
        let td = cont.querySelector('td[data-row="' + r + '"][data-col="' + c + '"]');
        if (td) err ? td.classList.add('error-cell') : td.classList.remove('error-cell');
    }
    function validate(r, c) {
        let v = board[r][c];
        if (v === 0) return true;
        for (let i = 0; i < 9; i++) {
            if (i !== c && board[r][i] === v) { markErr(r, c, true); return false; }
            if (i !== r && board[i][c] === v) { markErr(r, c, true); return false; }
        }
        let br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let rr = br + i, cc = bc + j;
                if ((rr !== r || cc !== c) && board[rr][cc] === v) { markErr(r, c, true); return false; }
            }
        }
        markErr(r, c, false);
        return true;
    }
    function isSudokuComplete() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) return false;
            }
        }
        if (cont.querySelectorAll('.error-cell').length > 0) return false;
        return true;
    }
    function render() {
        let html = '<table>';
        for (let i = 0; i < 9; i++) {
            html += '<tr>';
            for (let j = 0; j < 9; j++) {
                let val = board[i][j], given = initBoard[i][j] !== 0;
                html += '<td class="' + (given ? 'given-cell' : '') + '" data-row="' + i + '" data-col="' + j + '">';
                if (given) html += '<input type="text" maxlength="1" value="' + (val || '') + '" readonly>';
                else html += '<input type="text" maxlength="1" value="' + (val || '') + '">';
                html += '</td>';
            }
            html += '</tr>';
        }
        html += '</table>';
        cont.innerHTML = html;
        cont.querySelectorAll('input:not([readonly])').forEach(inp => {
            inp.addEventListener('input', e => {
                let v = e.target.value.trim();
                if (v === '') v = 0;
                else { let n = parseInt(v); if (isNaN(n) || n < 1 || n > 9) v = 0; else v = n; }
                let td = inp.parentElement, r = parseInt(td.dataset.row), c = parseInt(td.dataset.col);
                board[r][c] = v;
                e.target.value = v || '';
                validate(r, c);
                try {
                    if (containerId === 'sudoku1' && !sudoku1HintAwarded && isSudokuComplete()) {
                        awardHint('sudoku1');
                    }
                    if (containerId === 'sudoku2' && !sudoku2HintAwarded && isSudokuComplete()) {
                        awardHint('sudoku2');
                    }
                } catch (err) { console.warn("Hint award error:", err); }
            });
        });
    }
    function reset() {
        for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) board[i][j] = initBoard[i][j];
        render();
    }
    render();
    document.getElementById(resetId).onclick = reset;
}
    initWS(ws1Grid,ws1Words,'wordsearch1','ws1-clues-container',false);
    initWS(ws2Grid,ws2Words,'wordsearch2','ws2-clues-container',true);
    buildSudoku('sudoku1',sudoku1Init,'resetSudoku1');
    buildSudoku('sudoku2',sudoku2Init,'resetSudoku2');
    initRiddles();
  })();

  document.getElementById('goToFrontPage').addEventListener('click', function() {
    const modal = document.querySelector('div[style*="position:fixed"][style*="z-index:10000"]');
    if (modal) modal.remove();
    if (typeof window.parent.showFrontPageModal === 'function') {
      window.parent.showFrontPageModal();
    } else if (typeof window.showFrontPageModal === 'function') {
      window.showFrontPageModal();
    } else {
      try {
        if (window.parent && window.parent.game) {
          window.parent.showFrontPageModal();
        }
      } catch(e) {
        alert('Front page modal not loaded. Please check your files.');
      }
    }
  });
</script>
</body>
</html>`;

  // Create the modal overlay
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

  const container = document.createElement('div');
  container.style.backgroundColor = '#fff';
  container.style.borderRadius = '20px';
  container.style.maxWidth = '1100px';
  container.style.width = '95%';
  container.style.maxHeight = '95%';
  container.style.overflow = 'auto';
  container.style.position = 'relative';
  container.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';

  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = 'auto';
  iframe.style.minHeight = '700px';
  iframe.style.border = 'none';
  iframe.srcdoc = backPageHTML;
  container.appendChild(iframe);

  const closeBtn = document.createElement('button');
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

  closeBtn.onclick = () => modalDiv.remove();
  modalDiv.onclick = (e) => { if (e.target === modalDiv) modalDiv.remove(); };
}