// ============================================================
//  UI RENDER FUNCTIONS – Complete
// ============================================================

function closeAllModals() {
  var infoModal = document.getElementById('infoModal');
  if (infoModal) infoModal.style.display = 'none';
  var confirmModal = document.getElementById('confirmModal');
  if (confirmModal) confirmModal.style.display = 'none';
  var overlays = document.querySelectorAll('body > div[style*="z-index"][style*="fixed"]');
  overlays.forEach(function(el) {
    if (el.id === 'startMenu' || el.id === 'gameWrapper') return;
    el.remove();
  });
  var iframeModals = document.querySelectorAll('div[style*="position:fixed"][style*="z-index"]');
  iframeModals.forEach(function(el) {
    if (el.id !== 'startMenu' && el.id !== 'gameWrapper') {
      el.remove();
    }
  });
  var popupContainer = document.getElementById('popupContainer');
  if (popupContainer) popupContainer.innerHTML = '';
}

function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function serializeGameData(game) {
  return {
    detectiveNotes: game.detectiveNotes || [],
    suspects: game.suspects ? game.suspects.map(function(s) {
      return {
        id: s.id,
        name: s.name,
        emoji: s.emoji,
        questions: s.questions,
        responses: s.responses,
        unlocked: s.unlocked
      };
    }) : [],
    askedQuestions: game.askedQuestions || { s1: [], s2: [], s3: [] },
    suspectStress: game.suspectStress || { s1: 0, s2: 0, s3: 0 },
    mainSolved: game.mainSolved || [],
    bonusSolved: game.bonusSolved || [],
    mainPuzzles: game.mainPuzzles ? game.mainPuzzles.map(function(p) {
      return { id: p.id, title: p.title, digit: p.digit };
    }) : [],
    bonusPuzzles: game.bonusPuzzles ? game.bonusPuzzles.map(function(p) {
      return { id: p.id, title: p.title };
    }) : [],
    usbUnlocked: game.usbUnlocked || false
  };
}

// ============================================================
//  OPTION HELPERS  (parent-side, bulletproof)
// ============================================================

// Normalise any string to lowercase alphanumerics only.
function normaliseKey(str) {
  if (str == null) return '';
  var s = String(str);
  if (s.normalize) s = s.normalize('NFKD');
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Strip a leading letter prefix like "A) ", "A. ", "A - ", "A: ".
function stripLetterPrefix(letter, text) {
  var t = (text == null ? '' : String(text)).replace(/\s+/g, ' ').trim();
  if (!letter) return t;
  var L = String(letter).toUpperCase();
  var re = new RegExp('^' + L + '\\s*[\\)\\.\\-:\\s]\\s*', 'i');
  return t.replace(re, '').trim();
}

// Extract a normalised {letter, text} from a raw option of any shape.
function parseOption(raw, index) {
  var letter = '';
  var text = '';
  if (raw == null) return { letter: '', text: '' };
  if (typeof raw === 'string') {
    text = raw;
  } else if (typeof raw === 'object') {
    letter = (raw.letter || raw.label || raw.key || '').toString();
    text = (raw.text || raw.value || raw.answer || '').toString();
    if (!text && raw.label) text = raw.label.toString();
  }
  text = text.replace(/\s+/g, ' ').trim();

  if (letter) {
    letter = letter.toUpperCase();
    text = stripLetterPrefix(letter, text);
  } else {
    // Try to sniff letter from text like "A) Claythorpe"
    var m = text.match(/^([A-Z])\s*[\\)\\.\\-:]\\s*/i);
    if (m) {
      letter = m[1].toUpperCase();
      text = text.substring(m[0].length).trim();
    }
  }
  if (!letter) letter = String.fromCharCode(65 + index);

  return { letter: letter, text: text };
}

// Sanitise: parse → dedupe by normalised text → cap at 3 → re-letter A/B/C.
function sanitiseOptions(raw) {
  if (!Array.isArray(raw)) return [];
  var parsed = [];
  for (var i = 0; i < raw.length; i++) {
    var p = parseOption(raw[i], i);
    if (p.text) parsed.push(p);
  }
  var seen = {};
  var unique = [];
  for (var j = 0; j < parsed.length; j++) {
    var k = normaliseKey(parsed[j].text);
    if (!k || seen[k]) continue;
    seen[k] = true;
    unique.push(parsed[j]);
  }
  unique = unique.slice(0, 3);
  for (var x = 0; x < unique.length; x++) {
    unique[x].letter = String.fromCharCode(65 + x);
  }
  return unique;
}

// Given a puzzle, return { sanitised: [...], correctIndex: n }.
function computePuzzleMeta(puzzle) {
  var rawOptions = Array.isArray(puzzle.options) ? puzzle.options : [];
  var sanitised = sanitiseOptions(rawOptions);
  var solution = (puzzle.solution || '').toString().toUpperCase();
  var correctIndex = -1;

  // 1. Match by raw option letter === solution, then find in sanitised
  for (var i = 0; i < rawOptions.length; i++) {
    var o = rawOptions[i];
    if (!o || typeof o !== 'object') continue;
    var rawLetter = (o.letter || '').toString().toUpperCase();
    if (rawLetter && rawLetter === solution) {
      var cleanedText = stripLetterPrefix(rawLetter, (o.text || o.value || o.answer || '').toString());
      var key = normaliseKey(cleanedText);
      for (var j = 0; j < sanitised.length; j++) {
        if (normaliseKey(sanitised[j].text) === key) {
          correctIndex = j;
          break;
        }
      }
      if (correctIndex >= 0) break;
    }
  }

  // 2. Fallback: solution is a letter like "A"/"B"/"C"; use index
  if (correctIndex < 0) {
    var idxByLetter = 'ABC'.indexOf(solution);
    if (idxByLetter >= 0 && idxByLetter < sanitised.length) {
      correctIndex = idxByLetter;
    }
  }

  // 3. Fallback: solution is the answer text itself
  if (correctIndex < 0) {
    var solKey = normaliseKey(solution);
    if (solKey) {
      for (var k = 0; k < sanitised.length; k++) {
        if (normaliseKey(sanitised[k].text) === solKey) {
          correctIndex = k;
          break;
        }
      }
    }
  }

  return { sanitised: sanitised, correctIndex: correctIndex };
}

// ============================================================
//  RENDER: INTERVIEWS TAB
// ============================================================
var interviewsIframe = null;

function buildInterviewSnapshot() {
  return {
    initialInterviewDone:      !!game.initialInterviewDone,
    waitingForQuestions:       !!game.waitingForQuestions,
    roundQuestionsRemaining:   game.roundQuestionsRemaining || 0,
    mainSolved:                game.mainSolved || [],
    bonusSolved:               game.bonusSolved || [],
    askedQuestions:            JSON.parse(JSON.stringify(game.askedQuestions || { s1: [], s2: [], s3: [] })),
    suspectStress:             JSON.parse(JSON.stringify(game.suspectStress || { s1: 0, s2: 0, s3: 0 }))
  };
}

function buildInterviewQuestions() {
  var q = {};
  (game.suspects || []).forEach(function (s) {
    q[s.id] = { questions: s.questions, responses: s.responses };
  });
  return q;
}

function pushInterviewState() {
  if (!interviewsIframe || !interviewsIframe.contentWindow) return;
  interviewsIframe.contentWindow.postMessage({
    type: 'INIT_STATE',
    data: buildInterviewSnapshot(),
    questions: buildInterviewQuestions()
  }, '*');
}

function renderInterviews() {
  if (!game.interviewIntroShown) {
    game.interviewIntroShown = true;
    game.saveToLocalStorage();
    showInterviewIntro(function () {
      renderInterviewsContent();
    });
    return;
  }
  renderInterviewsContent();
}

function renderInterviewsContent() {
  var content = document.getElementById('content');
  if (!content) return;

  content.innerHTML =
    '<div style="width:100%; height:calc(100vh - 280px); min-height:520px; max-height:640px; background:#060a10; border-radius:16px; overflow:hidden;">' +
      '<iframe id="interviewsIframe" src="interviews.html" ' +
        'style="width:100%; height:100%; border:none; display:block;">' +
      '</iframe>' +
    '</div>';

  interviewsIframe = document.getElementById('interviewsIframe');
  if (!interviewsIframe) return;

  interviewsIframe.onload = function () {
    pushInterviewState();
  };
}

window.addEventListener('message', function (event) {
  var d = event.data;
  if (!d || typeof d !== 'object') return;

  if (d.type === 'READY') {
    pushInterviewState();
    return;
  }

  if (d.type !== 'ASK_QUESTION') return;

  var sid = d.suspectId;
  var qIdx = d.questionIdx;
  var suspect = game.suspects.find(function (s) { return s.id === sid; });
  if (!suspect) return;

  if (!game.askedQuestions[sid]) game.askedQuestions[sid] = [];
  if (game.askedQuestions[sid].indexOf(qIdx) !== -1) return;

  if (!game.initialInterviewDone) {
    if (sid !== 's1') return;
    if (game.askedQuestions.s1.length >= 3) return;

    game.askedQuestions.s1.push(qIdx);
    game.suspectStress.s1 = Math.min(100, (game.suspectStress.s1 || 0) + 10);

    if (game.suspectStress.s1 > 80 && !game.suspectExtraClueRevealed.s1) {
      game.suspectExtraClueRevealed.s1 = true;
      game.addDetectiveNote(
        "Neil Down's extra clue: He mentioned hearing a name 'Vega' over the radio just before the alarms.",
        "🔍 Neil Down slipped up! Under pressure, he muttered something about 'Vega' on the radio before the alarms."
      );
    }

    if (game.askedQuestions.s1.length >= 3) {
      game.initialInterviewDone = true;
      var s2 = game.suspects.find(function (s) { return s.id === 's2'; });
      var s3 = game.suspects.find(function (s) { return s.id === 's3'; });
      if (s2) s2.unlocked = true;
      if (s3) s3.unlocked = true;
      game.puzzlesUnlocked = true;
      var mp = document.querySelector('.tab[data-tab="mainpuzzles"]');
      var bp = document.querySelector('.tab[data-tab="bonuspuzzles"]');
      if (mp) mp.classList.remove('locked');
      if (bp) bp.classList.remove('locked');
      game.addDetectiveNote(
        "These guys don't seem to be able to get their story straight.",
        "Nice work—Neil Down has opened up, but their story feels a little too rehearsed."
      );
    }
  }
  else if (game.waitingForQuestions && game.roundQuestionsRemaining > 0) {
    var puzzleGate = !!(game.mainSolved && game.mainSolved[0] && game.bonusSolved && game.bonusSolved[0]);
    if (sid !== 's1' && !puzzleGate) return;

    game.askedQuestions[sid].push(qIdx);
    game.suspectStress[sid] = Math.min(100, (game.suspectStress[sid] || 0) + 10);

    if (game.suspectStress[sid] > 80 && !game.suspectExtraClueRevealed[sid]) {
      game.suspectExtraClueRevealed[sid] = true;
      var clueText = '', popupMsg = '';
      if (sid === 's1') {
        clueText = "Neil Down's extra clue: He mentioned hearing a name 'Vega' over the radio just before the alarms.";
        popupMsg = "🔍 Neil Down slipped up! Under pressure, he muttered something about 'Vega' on the radio before the alarms.";
      } else if (sid === 's2') {
        clueText = "Sienna Clarke's extra clue: Her system logs show a backdoor entry at 2:17 AM from an IP address traced to a local library.";
        popupMsg = "💻 Sienna Clarke cracked! She accidentally revealed a backdoor entry at 2:17 AM from a library IP.";
      } else if (sid === 's3') {
        clueText = "Vincent Hale's extra clue: He admitted seeing a suspicious van with the license plate 'WH1TBY' parked near the service entrance.";
        popupMsg = "🚐 Vincent Hale let it slip – a white van with plate 'WH1TBY' was parked near the service entrance.";
      }
      game.addDetectiveNote(clueText, popupMsg);
    }

    game.roundQuestionsRemaining--;
    if (game.roundQuestionsRemaining <= 0) {
      game.waitingForQuestions = false;
      if (typeof game.completeQuestionRound === 'function') {
        game.completeQuestionRound();
      }
      game.showPopup("✅ You've used all 3 questions. The next main puzzle will now appear.");
    }
  }
  else {
    return;
  }

  game.saveToLocalStorage();
  game.updateUI();
  pushInterviewState();
});

// ============================================================
//  RENDER: MAIN PUZZLES TAB
// ============================================================
var mainPuzzlesIframe = null;

function buildMainPuzzlesState() {
  var total = game.mainPuzzles.length;
  var allSolved = (game.solvedMainPuzzles === total);

  var displayIdx = -1;
  var isInteractive = false;
  var current = game.getCurrentMainPuzzle();

  if (current) {
    displayIdx = game.mainPuzzles.findIndex(function(p){ return p.id === current.id; });
    isInteractive = true;
  } else {
    var lastSolved = -1;
    for (var i = 0; i < game.mainSolved.length; i++) {
      if (game.mainSolved[i]) lastSolved = i;
    }
    displayIdx = (lastSolved >= 0) ? lastSolved : 0;
    isInteractive = false;
  }

  var displayPuzzle = game.mainPuzzles[displayIdx];
  var isSolved = !!game.mainSolved[displayIdx];
  var usedHints = game.hintsUsed[displayIdx] || 0;

  var meta = computePuzzleMeta(displayPuzzle);

  var statusMessage = '';
  var statusType = 'info';

  if (allSolved) {
    statusMessage = '🏆 All main puzzles solved! The Cryptogram is now available in the Case File tab.';
    statusType = 'success';
  } else if (!isInteractive) {
    if (game.waitingForQuestions) {
      statusMessage = '🔒 Answer ' + game.roundQuestionsRemaining +
        ' more question(s) in the Interviews tab to unlock the next puzzle.';
      statusType = 'lock';
    } else {
      var neededBonus = game.getRequiredBonusNameForNextQuestions();
      if (neededBonus) {
        statusMessage = '🔒 Solve the bonus puzzle "' + neededBonus +
          '" before the next main puzzle will appear. Go to the Bonus Puzzles tab.';
        statusType = 'lock';
      } else if (!game.bonusSolved[5] && game.solvedMainPuzzles === 6) {
        statusMessage = '🔒 Solve the Scale & Weight Puzzle in the Bonus Puzzles tab before the final main puzzle appears.';
        statusType = 'lock';
      }
    }
  }

  return {
    state: allSolved ? 'all_solved' : (isInteractive ? 'puzzle' : 'puzzle_solved_waiting'),
    currentIndex: displayIdx,
    totalPuzzles: total,
    solved: isSolved,
    interactive: isInteractive,
    puzzle: {
      id: displayPuzzle.id,
      title: displayPuzzle.title,
      desc: displayPuzzle.desc,
      options: meta.sanitised,
      correctIndex: meta.correctIndex,
      digit: displayPuzzle.digit
    },
    hintsUsed: usedHints,
    maxHints: 3,
    hints: displayPuzzle.hints || [],
    statusMessage: statusMessage,
    statusType: statusType,
    feedback: ''
  };
}

function pushMainPuzzlesState(extra) {
  if (!mainPuzzlesIframe || !mainPuzzlesIframe.contentWindow) return;
  var state = buildMainPuzzlesState();
  if (extra && extra.feedback) state.feedback = extra.feedback;
  mainPuzzlesIframe.contentWindow.postMessage({ type: 'INIT_STATE', data: state }, '*');
}

function renderMainPuzzles() {
  var panel = document.getElementById('content');
  if (!panel) return;

  var existing = document.getElementById('mainPuzzlesIframe');
  if (existing && existing.parentNode) {
    mainPuzzlesIframe = existing;
    pushMainPuzzlesState();
    return;
  }

  panel.innerHTML =
    '<div style="width:100%; height:calc(100vh - 200px); min-height:560px; background:#0b1a2b; border-radius:16px; overflow:hidden;">' +
      '<iframe id="mainPuzzlesIframe" src="mainPuzzles.html" ' +
        'style="width:100%; height:100%; border:none; display:block;">' +
      '</iframe>' +
    '</div>';

  mainPuzzlesIframe = document.getElementById('mainPuzzlesIframe');
  if (!mainPuzzlesIframe) return;

  mainPuzzlesIframe.onload = function () {
    pushMainPuzzlesState();
  };
}

window.addEventListener('message', function (event) {
  var d = event.data;
  if (!d || typeof d !== 'object') return;

  if (d.type === 'READY') {
    pushMainPuzzlesState();
    return;
  }

  if (d.type === 'HINT') {
    var current = game.getCurrentMainPuzzle();
    if (!current) return;
    var idx = game.mainPuzzles.findIndex(function(p){ return p.id === current.id; });
    var used = game.hintsUsed[idx] || 0;
    if (used >= 3) {
      game.showPopup('❌ No more hints left for this puzzle.');
      return;
    }
    game.addPenalty();
    game.hintsUsed[idx] = used + 1;
    game.saveToLocalStorage();
    game.updateUI();
    game.showPopup('💡 Hint ' + (used + 1) + ': ' + current.hints[used] + ' -2 Prison Years');
    pushMainPuzzlesState();
    return;
  }

  if (d.type === 'ANSWER') {
    var currentP = game.getCurrentMainPuzzle();
    if (!currentP) return;
    var idxP = game.mainPuzzles.findIndex(function(p){ return p.id === currentP.id; });
    if (game.mainSolved[idxP]) return;

    var meta = computePuzzleMeta(currentP);
    var clickedIndex = -1;

    // Prefer explicit index from the iframe
    if (typeof d.index === 'number') {
      clickedIndex = d.index;
    } else if (d.letter) {
      // Fallback for older iframes: match by letter in sanitised options
      for (var i = 0; i < meta.sanitised.length; i++) {
        if (meta.sanitised[i].letter === d.letter) {
          clickedIndex = i; break;
        }
      }
    }

    var isCorrect = (meta.correctIndex >= 0) && (clickedIndex === meta.correctIndex);

    console.log('[mainPuzzles] clicked:', clickedIndex, '| correct:', meta.correctIndex, '| match:', isCorrect);

    if (isCorrect) {
      pushMainPuzzlesState({ feedback: 'correct' });
      setTimeout(function () {
        currentP.onSolve();
      }, 900);
    } else {
      game.addPenalty();
      if (navigator.vibrate) navigator.vibrate(200);
      pushMainPuzzlesState({ feedback: 'wrong' });
    }
  }
});

// ============================================================
//  RENDER: BONUS PUZZLES TAB
// ============================================================
function renderBonusPuzzles() {
  var panel = document.getElementById("content");
  if (!panel) return;
  var html = '<div>';
  for (var i = 0; i < game.bonusPuzzles.length; i++) {
    var p = game.bonusPuzzles[i];
    var unlocked = (p.unlockAfterMain <= game.solvedMainPuzzles);
    var solved = game.bonusSolved[i];
    html += `<div class="bonus-puzzle" id="puzzle-${p.id}" style="text-align:center;">`;
    if (!unlocked) {
      var requiredMainPuzzle = game.mainPuzzles[p.unlockAfterMain - 1];
      var mainTitle = requiredMainPuzzle ? requiredMainPuzzle.title : `Main Puzzle ${p.unlockAfterMain}`;
      html += `<div class="puzzle-title">🎁 ${p.title}</div><div class="puzzle-desc">🔒 Complete "${mainTitle}" first.</div>`;
    } else {
      if (p.render) {
        html += p.render(solved);
      } else if (solved) {
        html += `<div class="puzzle-title">🎁 ${p.title}</div><div class="puzzle-solved-badge">✅ SOLVED! Clue added to Detective Notes.</div>`;
      } else {
        html += `<div class="puzzle-title">🎁 ${p.title}</div><div class="puzzle-desc">${p.desc}</div>
          <div class="puzzle-input-area"><input type="text" id="bonus_input_${i}" placeholder="Your answer...">
          <button class="puzzle-btn" data-bonus-idx="${i}">🔓 SUBMIT</button>
          <button class="puzzle-hint-btn" data-hint-idx="${i}">💡 HINT</button></div>
          <div class="puzzle-feedback" id="bonus_fb_${i}"></div>`;
      }
    }
    html += '</div>';
  }
  html += '</div>';
  panel.innerHTML = html;

  var letterFolder = document.getElementById('letter-puzzle-folder');
  if (letterFolder) {
    var letterPuzzle = game.bonusPuzzles.find(function(p) { return p.id === 'letter_puzzle'; });
    var newLetterFolder = letterFolder.cloneNode(true);
    letterFolder.parentNode.replaceChild(newLetterFolder, letterFolder);
    newLetterFolder.onclick = function() {
      if (letterPuzzle && game.bonusSolved[0]) {
        game.showPopup('✅ This puzzle is already solved!');
        return;
      }
      createFullScreenConfirm("📜 BONUS PUZZLE", "The Braggers Note – A letter was found at the crime scene. It looks ordinary, but forensic analysis suggests something is written in invisible ink. Are you ready to examine it under UV light?", function() {
        showLetterPuzzleModal(function() { 
          if (letterPuzzle && !game.bonusSolved[0]) { 
            letterPuzzle.onSolve(); 
            game.bonusSolved[0] = true; 
            game.solvedBonusPuzzles++; 
            game.updateUI(); 
            renderBonusPuzzles(); 
          } 
        });
      });
    };
  }

  var coffeeFolder = document.getElementById('coffee-puzzle-folder');
  if (coffeeFolder) {
    var coffeePuzzle = game.bonusPuzzles.find(function(p) { return p.id === 'coffee_puzzle'; });
    var newCoffeeFolder = coffeeFolder.cloneNode(true);
    coffeeFolder.parentNode.replaceChild(newCoffeeFolder, coffeeFolder);
    newCoffeeFolder.onclick = function() {
      if (coffeePuzzle && game.bonusSolved[1]) {
        game.showPopup('✅ This puzzle is already solved!');
        return;
      }
      createFullScreenConfirm(
        "☕ BONUS PUZZLE",
        "While all three suspects were waiting to be interviewed, each visited the station toilets.<br><br>During this time, one suspect appears to have slipped into the detectives' coffee room.<br><br>They left behind a USB stick and a handwritten note mocking the investigation.<br><br>One of the three suspects must have left it while they were in the toilets, trying to prove they're cleverer than the detective.<br><br>Identify which suspect wrote the note.",
        function() {
          showCoffeePuzzleModal(function() { if (coffeePuzzle && !game.bonusSolved[1]) { coffeePuzzle.onSolve(); game.bonusSolved[1] = true; game.solvedBonusPuzzles++; game.updateUI(); renderBonusPuzzles(); } });
        }
      );
    };
  }

  var detectiveFolder = document.getElementById('detective-puzzle-folder');
  if (detectiveFolder) {
    var detectivePuzzle = game.bonusPuzzles.find(function(p) { return p.id === 'detective_puzzle'; });
    var newDetectiveFolder = detectiveFolder.cloneNode(true);
    detectiveFolder.parentNode.replaceChild(newDetectiveFolder, detectiveFolder);
    newDetectiveFolder.onclick = function() {
      if (detectivePuzzle && game.bonusSolved[2]) {
        game.showPopup('✅ This puzzle is already solved!');
        return;
      }
      createFullScreenConfirm(
        "🧩 BONUS PUZZLE",
        "The Mastermind's Tower – The USB stick the thief left behind is locked.<br><br>A forensic terminal is ready to analyse the evidence.<br><br>Prove you're worthy of the chase.",
        function() {
          showDetectivePuzzleModal(function() { 
            if (detectivePuzzle && !game.bonusSolved[2]) { 
              detectivePuzzle.onSolve(); 
              game.bonusSolved[2] = true; 
              game.solvedBonusPuzzles++; 
              game.updateUI(); 
              renderBonusPuzzles(); 
            } 
          });
        }
      );
    };
  }

  var shelfFolder = document.getElementById('shelf-puzzle-folder');
  if (shelfFolder) {
    var shelfPuzzle = game.bonusPuzzles.find(function(p) { return p.id === 'shelf_puzzle'; });
    var newShelfFolder = shelfFolder.cloneNode(true);
    shelfFolder.parentNode.replaceChild(newShelfFolder, shelfFolder);
    newShelfFolder.onclick = function() {
      if (shelfPuzzle && game.bonusSolved[3]) {
        game.showPopup('✅ This puzzle is already solved!');
        return;
      }
      createFullScreenConfirm(
        "📚 BONUS PUZZLE",
        "🚨 EMERGENCY MESSAGE<br><br>Officers require your attendance immediately.<br><br>Very little appears to have been disturbed...<br><br>Except the Rare Books collection.",
        function() {
          showShelfPuzzleModal(function() { if (shelfPuzzle && !game.bonusSolved[3]) { shelfPuzzle.onSolve(); game.bonusSolved[3] = true; game.solvedBonusPuzzles++; game.updateUI(); renderBonusPuzzles(); } });
        }
      );
    };
  }

  var lockerFolder = document.getElementById('locker-puzzle-folder');
  if (lockerFolder) {
    var lockerPuzzle = game.bonusPuzzles.find(function(p) { return p.id === 'locker_puzzle'; });
    var newLockerFolder = lockerFolder.cloneNode(true);
    lockerFolder.parentNode.replaceChild(newLockerFolder, lockerFolder);
    newLockerFolder.onclick = function() {
      if (lockerPuzzle && game.bonusSolved[4]) {
        game.showPopup('✅ This puzzle is already solved!');
        return;
      }
      createFullScreenConfirm("🔒 BONUS PUZZLE", "The Cold Case Cabinet – crack the locker combinations using logic. Ready to investigate?", function() {
        showLockerPuzzleModal(function() { if (lockerPuzzle && !game.bonusSolved[4]) { lockerPuzzle.onSolve(); game.bonusSolved[4] = true; game.solvedBonusPuzzles++; game.updateUI(); renderBonusPuzzles(); } });
      });
    };
  }

  var scaleFolder = document.getElementById('scale-puzzle-folder');
  if (scaleFolder) {
    var scalePuzzle = game.bonusPuzzles.find(function(p) { return p.id === 'scale_puzzle'; });
    var newScaleFolder = scaleFolder.cloneNode(true);
    scaleFolder.parentNode.replaceChild(newScaleFolder, scaleFolder);
    newScaleFolder.onclick = function() {
      if (scalePuzzle && game.bonusSolved[5]) {
        game.showPopup('✅ This puzzle is already solved!');
        return;
      }
      createFullScreenConfirm(
        "⚖️ BONUS PUZZLE",
        "The Balance of Justice – deduce the hidden values of the star, triangle and circle. Begin?",
        function() {
          showScalePuzzleModal(function() {
            if (scalePuzzle && !game.bonusSolved[5]) {
              scalePuzzle.onSolve();
              game.bonusSolved[5] = true;
              game.solvedBonusPuzzles++;
              game.updateUI();
              renderBonusPuzzles();
              game.showPopup("✅ Scale puzzle solved! The hidden values are revealed.");
              var dialogue = "📋 CASE NOTES UPDATED<br><br>" +
                             '"I\'ve recorded these in the case file."<br><br>' +
                             '"They don\'t appear useful yet..."<br><br>' +
                             '"...but I have a feeling they\'ll matter later."';
              game.addDetectiveNote("Scale puzzle complete. The numbers 2, 4, and 6 have been recorded. Their significance is unknown... for now.", dialogue);
            }
          });
        }
      );
    };
  }

  var vaultFolder = document.getElementById('vault-puzzle-folder');
  if (vaultFolder) {
    var vaultPuzzle = game.bonusPuzzles.find(function(p) { return p.id === 'vault_puzzle'; });
    var newVaultFolder = vaultFolder.cloneNode(true);
    vaultFolder.parentNode.replaceChild(newVaultFolder, vaultFolder);
    newVaultFolder.onclick = function() {
      if (vaultPuzzle && game.bonusSolved[6]) {
        game.showPopup('✅ This puzzle is already solved!');
        return;
      }
      createFullScreenConfirm("🔐 BONUS PUZZLE", "The Vault – You've decoded the cryptogram. Now a sealed vault has been discovered. Inside may be the final piece of evidence. Ready to crack it?", function() {
        showVaultPuzzleModal(function() { 
          if (vaultPuzzle && !game.bonusSolved[6]) { 
            vaultPuzzle.onSolve(); 
            game.bonusSolved[6] = true; 
            game.solvedBonusPuzzles++; 
            game.updateUI(); 
            renderBonusPuzzles(); 
            game.showPopup("✅ Vault cracked! The evidence has been secured.");
            game.addDetectiveNote("The vault is open – the final evidence confirms the mastermind's identity.", "");
          } 
        });
      });
    };
  }

  for (var j = 0; j < game.bonusPuzzles.length; j++) {
    var p2 = game.bonusPuzzles[j];
    if (p2.render) continue;
    var btn = document.querySelector(`.puzzle-btn[data-bonus-idx="${j}"]`);
    if (btn) {
      btn.onclick = function() {
        var idx = parseInt(this.dataset.bonusIdx);
        var input = document.getElementById('bonus_input_' + idx);
        if (!input) return;
        var answer = input.value.trim().toLowerCase();
        var correct = game.bonusPuzzles[idx].solution;
        var fb = document.getElementById('bonus_fb_' + idx);
        if (answer === correct) {
          if (!game.bonusSolved[idx]) {
            game.bonusPuzzles[idx].onSolve();
            game.bonusSolved[idx] = true;
            game.solvedBonusPuzzles++;
            game.updateUI();
            if (fb) fb.innerHTML = "✅ Correct! Clue added to Detective Notes.";
            renderBonusPuzzles();
          } else if (fb) fb.innerHTML = "Already solved!";
        } else {
          game.addPenalty();
          if (fb) fb.innerHTML = "❌ Wrong. Try again.";
        }
      };
    }
    var hintBtn = document.querySelector(`.puzzle-hint-btn[data-hint-idx="${j}"]`);
    if (hintBtn) hintBtn.onclick = function() {
      var idx = parseInt(this.dataset.hintIdx);
      game.showPopup(`💡 Hint: ${game.bonusPuzzles[idx].hints[0]}`);
    };
  }
}

// ============================================================
//  RENDER: MY PC TAB
// ============================================================
var myPcIframe = null;

function renderMyPcTab() {
  var content = document.getElementById('content');
  if (!game) return;

  var t = Date.now();
  var baseUrl = 'hanoi-puzzle.html';
  var usbState = game.usbUnlocked ? 'true' : 'false';
  var url = baseUrl + '?usbUnlocked=' + usbState + '&_=' + t;

  content.innerHTML = `
    <div style="width:100%; height:100%; min-height:500px; background:#050505; border-radius:8px; overflow:hidden; position:relative;">
      <iframe id="myPcIframe" src="${url}" style="width:100%; height:100%; border:none; display:block; position:absolute; top:0; left:0;"></iframe>
    </div>
  `;

  myPcIframe = document.getElementById('myPcIframe');

  myPcIframe.onload = function() {
    setTimeout(function() {
      if (myPcIframe && myPcIframe.contentWindow) {
        var gameData = serializeGameData(game);
        myPcIframe.contentWindow.postMessage({
          type: 'GAME_DATA',
          data: gameData
        }, '*');
        console.log('📤 Sent game data to iframe');
      }
    }, 100);
  };
}

// ============================================================
//  RENDER: NEWSPAPER TAB
// ============================================================
var newspaperIframe = null;
var currentNewspaperPage = 'front';

const frontPageHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <title>Daily Chronicle – Front Page</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#2c241f; font-family:"Times New Roman",Georgia,serif; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; min-height:100vh; }
    .newspaper { width:100%; max-width:1000px; padding:20px 16px; border:2px solid #111; background:#fff; font-family:"Times New Roman",serif; color:#111; }
    .header { text-align:center; border-bottom:2px solid #000; padding-bottom:8px; margin-bottom:14px; }
    .title { font-size:34px; font-weight:bold; letter-spacing:1.5px; }
    .meta { display:flex; justify-content:space-between; font-size:12px; margin-top:6px; font-weight:500; }
    .content { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .story { border-top:1px solid #222; padding-top:8px; margin-bottom:6px; }
    .headline { font-weight:800; font-size:16px; margin-bottom:5px; }
    .author {font-size: 11px; font-family:'Courier New', monospace;color: #6b4f3c;margin:2px 0 6px 0;font-style: italic; }
    .text { font-size:13px; line-height:1.42; text-align:justify; }
    .ad-box { background:#fcf7e3; border:1px solid #c7b27e; padding:8px 10px; margin-top:6px; text-align:center; font-family:'Courier New',monospace; font-size:12px; }
    .ad-title { font-weight:bold; font-size:14px; background:#e7dbbc; display:inline-block; padding:2px 10px; margin-bottom:8px; }
    .missing-dog { background:#fff4e6; border-left:5px solid #b45f2b; padding:6px 10px; }
    .missing-dog strong { color:#b45f2b; }
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
      <div class="story">
        <div class="headline">Professor Arthur Vale Disappears in Whitby</div>
        <div class="author">By Karla Censine, Senior Reporter</div>
        <div class="text">Professor Arthur Vale, 58, has disappeared from his Whitby home. Colleagues say he recently found evidence of a hidden map in the town's archives. He mentioned a mysterious figure called 'The Cartographer'," said Dr. Miriam Shaw. "He became secretive, then vanished." Vale's study was ransacked. Rare documents are missing. Police are appealing for witnesses and treating the case as a high-priority investigation. Officers are conducting extensive searches across Whitby and surrounding coastal areas. Anyone with information should contact Whitby Police immediately.</div>
      </div>
      <div class="story">
        <div class="headline">Woman Caught Talking To Her Plants "They Refuse To Listen"</div>
        <div class="author">By Paige Turner, Senior Features Writer</div>
        <div class="text">A resident admitted to giving motivational speeches to her houseplants. Neighbours reported they “remain stubbornly unmotivated,” despite promises of water and fertilizer bribes.</div>
      </div>
      <div class="story">
        <div class="headline">Star Bakery Sees Late Night Delivery Spike</div>
        <div class="author">By Bill Board, Advertising & Media Reporter</div>
        <div class="text">A small bakery in Lincoln has unexpectedly become a late-night hotspot after extending its hours to serve shift workers and night owls. Key Owner Lila Grant said the idea came after noticing empty streets but growing online demand. “People wanted fresh pastries at odd hours,” she explained. Since then, star Bakery has seen a strange spike in late-night deliveries that appear to arrive even when no orders were placed. Staff have begun joking that the bakery is “on star mode all night,” with croissants allegedly disappearing faster than they can be counted. Locals have praised the welcoming atmosphere, though some admit the bread now feels “suspiciously enthusiastic.” City officials are monitoring the trend as staff continue insisting nothing unusual is happening, despite the ovens occasionally “working overtime on their own.”</div>
      </div>
      <div class="story">
        <div class="headline">Local Chef Arrested for triangular Pizza Experiment</div>
        <div class="author">By Chris P. Bacon, Food & Lifestyle Editor</div>
        <div class="text">A local chef has been arrested after a controversial triangular pizza experiment caused unexpected chaos in a city restaurant. Head chef Marco Bellini said the idea came from a “harmless attempt to challenge traditional pizza geometry,” claiming customers were “ready for evolution.” Police were called after diners reported being served slices that did not fit on any standard plate and appeared to “reject circular reality entirely.” Stone based pizza described by one witness as “emotionally unsettling but weirdly tasty.” The restaurant has since been closed for inspection, while officials investigate whether triangular food shapes pose a threat to public order or just to common sense.</div>
      </div>
      <div class="story">
        <div class="headline">📢 LOCAL ADVERTISER</div>
        <div class="ad-box">
          <div class="ad-title">✦ WHITBY ANTIQUARIAN BOOKS ✦</div>
          <div>Rare maps, forgotten journals & peculiar curiosities.<br><strong>20% off</strong> for Chronicle readers!<br>📍 7 Church Street, Whitby<br>☎ 01947 602341</div>
          <div style="margin-top:6px; font-size:10px;">"Where history hides in plain sight."</div>
        </div>
      </div>
    </div>
    <div>
      <div class="story">
        <div class="headline">Lost Dog Travels 40 Miles to Find Owner</div>
        <div class="author">By Anita Report, Investigative Journalist</div>
        <div class="text">A Labrador named Max has amazed residents after traveling nearly 40 miles to reunite with his owner. The dog went missing during a camping trip but was later found waiting outside his owner's former home. Neighbours recognised Max and contacted local authorities, who scanned his microchip. Experts believe the dog followed familiar scents and landmarks. "It's incredible loyalty," said one volunteer. Max has since been safely returned and is recovering well, with his owner calling the reunion "nothing short of a miracle."</div>
      </div>
      <div class="story">
        <div class="headline">Students Build Solar Car from Scrap Materials</div>
        <div class="author">By Al Beback, Field Correspondent</div>
        <div class="text">A group of engineering students has built a fully functioning solar-powered car using mostly recycled materials. The project, completed over six months, aimed to highlight sustainable innovation on a budget. Team leader Aisha Khan said the biggest challenge was balancing efficiency with durability. The car successfully completed a 15-mile test drive, impressing local sponsors and university staff. Plans are now underway to refine the design and enter it into a national competition. The team hopes their work will inspire others to explore green technology solutions.</div>
      </div>
      <div class="story">
        <div class="headline">Man Brings Ladder To Pub - Claims "Drinks Were On The House"</div>
        <div class="author">By Justin Case, Breaking News Reporter</div>
        <div class="text">A local man caused confusion last night after arriving at a pub carrying a ladder. When questioned, he calmly explained he'd heard the drinks were “on the house” and didn't want to miss out. Staff asked him to leave shortly after he tried to climb behind the bar.</div>
      </div>
      <div class="story">
        <div class="headline">Scientists Confirm Round Objects Roll More Than Square Ones</div>
        <div class="author">By Drew Peacock, Political Analyst</div>
        <div class="text">Scientists have confirmed that round objects roll more than square ones in what experts are calling the most expensive obvious discovery in modern science. The three-year study tested items including apples, wheels, and a very confident dinner plate that refused to cooperate on principle. Lead researcher Dr Helen Moore said, “We suspected round things would roll, but we didn't expect them to show off about it.” Square objects reportedly failed every test, with one cube described as “emotionally stable but physically disappointing.” One assistant added that the wheels “kept rolling away mid-experiment like they had somewhere better to be.” USB measurements were used to confirm rolling consistency across all test objects.The findings have sparked public outrage over funding, while officials defended the research, stating it was important to confirm what everyone already knew before school.</div>
      </div>
      <div class="story">
        <div class="headline">🐕 MISSING: HAVE YOU SEEN BAILEY?</div>
        <div class="missing-dog"><strong>Bailey</strong> – 3‑year‑old Border Collie, black & white, one blue eye. Went missing near Whitby Abbey on March 18. Very friendly, responds to name. Family is heartbroken. <strong>Reward £200</strong> for safe return.<br>📞 Call Jess: 07700 123456 or Whitby Police.<br><span style="font-size:11px;">Please share – last seen near the Old Coastguard path.</span></div>
      </div>
    </div>
  </div>
  <div class="page-control">
    <button class="nav-btn" onclick="window.parent.switchToBackPage()">📖 TURN TO BACK PAGE (PUZZLES)</button>
  </div>
</div>
</body>
</html>`;

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
    <button class="nav-btn" onclick="window.parent.switchToFrontPage()">📰 TURN TO FRONT PAGE (NEWS)</button>
  </div>
</div>
<script>
  // ... (word search and sudoku scripts – keep your existing) ...
</script>
</body>
</html>`;

window.switchToBackPage = function() {
  if (newspaperIframe) {
    newspaperIframe.srcdoc = backPageHTML;
    currentNewspaperPage = 'back';
  }
};

window.switchToFrontPage = function() {
  if (newspaperIframe) {
    newspaperIframe.srcdoc = frontPageHTML;
    currentNewspaperPage = 'front';
  }
};

function renderNewspaperTab() {
  var content = document.getElementById('content');
  content.innerHTML = `
    <div style="width:100%; height:100%; min-height:500px; background:#2c241f; border-radius:8px; overflow:hidden; position:relative;">
      <iframe id="newspaperIframe" style="width:100%; height:100%; border:none; display:block; position:absolute; top:0; left:0;"></iframe>
    </div>
  `;
  newspaperIframe = document.getElementById('newspaperIframe');
  newspaperIframe.srcdoc = frontPageHTML;
  currentNewspaperPage = 'front';
}

// ============================================================
//  RENDER: MAIN MENU TAB
// ============================================================
function renderMainMenuTab() {
  var content = document.getElementById('content');
  content.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; min-height:300px; padding:40px; text-align:center;">
      <div style="font-size:48px; margin-bottom:20px;">🏠</div>
      <h2 style="color:#cdba92;">Return to Main Menu</h2>
      <p style="color:#b68b5c; max-width:400px;">Your progress will be saved automatically before returning.</p>
      <button id="confirmReturnMenuBtn" class="action-btn" style="background:#a13d3d; border:none; color:white; padding:12px 40px; border-radius:8px; cursor:pointer; margin-top:20px; font-size:1.2rem;">🚪 Return to Main Menu</button>
      <button id="cancelReturnMenuBtn" class="action-btn" style="background:#4a5b6e; border:none; color:white; padding:12px 40px; border-radius:8px; cursor:pointer; margin-top:10px; font-size:1rem;">Cancel</button>
    </div>
  `;

  document.getElementById('confirmReturnMenuBtn').addEventListener('click', function() {
    if (game) game.saveToLocalStorage();
    document.getElementById('gameWrapper').style.display = 'none';
    document.getElementById('startMenu').style.display = 'flex';
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.tab[data-tab="mypc"]').classList.add('active');
    if (game) game.currentTab = 'mypc';
    if (typeof window.refreshContinueButton === 'function') window.refreshContinueButton();
  });

  document.getElementById('cancelReturnMenuBtn').addEventListener('click', function() {
    if (game) game.refreshCurrentTab();
  });
}

// ============================================================
//  TAB SWITCHING LOGIC
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  var tabBar = document.getElementById('tabBar');
  if (tabBar) {
    tabBar.addEventListener('click', function(e) {
      var tab = e.target.closest('.tab');
      if (!tab) return;
      if (tab.classList.contains('locked')) {
        if (tab.dataset.tab === 'mainpuzzles') {
          alert('🔒 Complete the initial interview to unlock Main Puzzles.');
        } else if (tab.dataset.tab === 'bonuspuzzles') {
          alert('🔒 Complete the initial interview to unlock Bonus Puzzles.');
        } else {
          alert('🔒 This tab is locked.');
        }
        return;
      }

      closeAllModals();

      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      var tabId = tab.dataset.tab;
      if (game) {
        game.currentTab = tabId;
        game.refreshCurrentTab();
      }
    });
  }
});

// ============================================================
//  INITIAL RENDER
// ============================================================
function renderInitialTab() {
  if (!game) return;
  game.currentTab = 'mypc';
  renderMyPcTab();
  game.updateUI();
}

// ============================================================
//  GLOBAL FUNCTIONS
// ============================================================
function openMainPuzzle(index) {
  if (!game) return;
  var puzzle = game.mainPuzzles[index];
  if (!puzzle) return;
  alert('Opening Main Puzzle: ' + puzzle.title);
}

function openBonusPuzzle(index) {
  if (!game) return;
  var puzzle = game.bonusPuzzles[index];
  if (!puzzle) return;
  alert('Opening Bonus Puzzle: ' + puzzle.title);
}

function askQuestion(suspectId) {
  if (!game) return;
  alert('Asking questions to ' + suspectId);
}

// ============================================================
//  EXPOSE
// ============================================================
window.renderInterviews = renderInterviews;
window.renderMainPuzzles = renderMainPuzzles;
window.renderBonusPuzzles = renderBonusPuzzles;
window.renderMyPcTab = renderMyPcTab;
window.renderNewspaperTab = renderNewspaperTab;
window.renderMainMenuTab = renderMainMenuTab;
window.renderInitialTab = renderInitialTab;
window.openMainPuzzle = openMainPuzzle;
window.openBonusPuzzle = openBonusPuzzle;
window.askQuestion = askQuestion;
