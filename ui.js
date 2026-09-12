// ============================================================
//  UI RENDER FUNCTIONS
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
//  OPTION HELPERS (parent side)
// ============================================================
function normaliseKey(str) {
  if (str == null) return '';
  var s = String(str);
  if (s.normalize) s = s.normalize('NFKD');
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function stripLetterPrefix(letter, text) {
  var t = (text == null ? '' : String(text)).replace(/\s+/g, ' ').trim();
  if (!letter) return t;
  var L = String(letter).toUpperCase();
  var re = new RegExp('^' + L + '\\s*[\\)\\.\\-:\\s]\\s*', 'i');
  return t.replace(re, '').trim();
}

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
    var m = text.match(/^([A-Z])\s*[\)\.\-:]\s*/i);
    if (m) {
      letter = m[1].toUpperCase();
      text = text.substring(m[0].length).trim();
    }
  }
  if (!letter) letter = String.fromCharCode(65 + index);

  return { letter: letter, text: text };
}

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

// Returns { sanitised: [{letter,text}], correctIndex: n }
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

  // 2. Fallback: solution is a letter A/B/C → use index
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
//  INTERVIEWS TAB
// ============================================================
var interviewsIframe = null;

function buildInterviewSnapshot() {
  return {
    initialInterviewDone:    !!game.initialInterviewDone,
    waitingForQuestions:     !!game.waitingForQuestions,
    roundQuestionsRemaining: game.roundQuestionsRemaining || 0,
    mainSolved:              game.mainSolved || [],
    bonusSolved:             game.bonusSolved || [],
    askedQuestions:          JSON.parse(JSON.stringify(game.askedQuestions || { s1: [], s2: [], s3: [] })),
    suspectStress:           JSON.parse(JSON.stringify(game.suspectStress || { s1: 0, s2: 0, s3: 0 }))
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

// Message router – interviews
window.addEventListener('message', function (event) {
  var d = event.data;
  if (!d || typeof d !== 'object') return;

  if (d.type === 'READY' && d.source === 'interviews') {
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
//  MAIN PUZZLES TAB
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

// Message router – main puzzles
window.addEventListener('message', function (event) {
  var d = event.data;
  if (!d || typeof d !== 'object') return;

  if (d.type === 'READY' && d.source === 'mainpuzzles') {
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
    var clickedIndex = (typeof d.index === 'number') ? d.index : -1;
    var isCorrect = (meta.correctIndex >= 0) && (clickedIndex === meta.correctIndex);

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
//  BONUS PUZZLES TAB
// ============================================================
function renderBonusPuzzles() {
  var panel = document.getElementById("content");
  if (!panel) return;
  var html = '<div>';
  for (var i = 0; i < game.bonusPuzzles.length; i++) {
    var p = game.bonusPuzzles[i];
    var unlocked = (p.unlockAfterMain <= game.solvedMainPuzzles);
    var solved = game.bonusSolved[i];
    html += '<div class="bonus-puzzle" id="puzzle-' + p.id + '" style="text-align:center;">';
    if (!unlocked) {
      var requiredMainPuzzle = game.mainPuzzles[p.unlockAfterMain - 1];
      var mainTitle = requiredMainPuzzle ? requiredMainPuzzle.title : 'Main Puzzle ' + p.unlockAfterMain;
      html += '<div class="puzzle-title">🎁 ' + p.title + '</div><div class="puzzle-desc">🔒 Complete "' + mainTitle + '" first.</div>';
    } else {
      if (p.render) {
        html += p.render(solved);
      } else if (solved) {
        html += '<div class="puzzle-title">🎁 ' + p.title + '</div><div class="puzzle-solved-badge">✅ SOLVED! Clue added to Detective Notes.</div>';
      } else {
        html += '<div class="puzzle-title">🎁 ' + p.title + '</div><div class="puzzle-desc">' + p.desc + '</div>' +
          '<div class="puzzle-input-area"><input type="text" id="bonus_input_' + i + '" placeholder="Your answer...">' +
          '<button class="puzzle-btn" data-bonus-idx="' + i + '">🔓 SUBMIT</button>' +
          '<button class="puzzle-hint-btn" data-hint-idx="' + i + '">💡 HINT</button></div>' +
          '<div class="puzzle-feedback" id="bonus_fb_' + i + '"></div>';
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
    var btn = document.querySelector('.puzzle-btn[data-bonus-idx="' + j + '"]');
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
    var hintBtn = document.querySelector('.puzzle-hint-btn[data-hint-idx="' + j + '"]');
    if (hintBtn) hintBtn.onclick = function() {
      var idx = parseInt(this.dataset.hintIdx);
      game.showPopup('💡 Hint: ' + game.bonusPuzzles[idx].hints[0]);
    };
  }
}

// ============================================================
//  MY PC TAB
// ============================================================
var myPcIframe = null;

function renderMyPcTab() {
  var content = document.getElementById('content');
  if (!game) return;

  var t = Date.now();
  var baseUrl = 'hanoi-puzzle.html';
  var usbState = game.usbUnlocked ? 'true' : 'false';
  var url = baseUrl + '?usbUnlocked=' + usbState + '&_=' + t;

  content.innerHTML =
    '<div style="width:100%; height:100%; min-height:500px; background:#050505; border-radius:8px; overflow:hidden; position:relative;">' +
      '<iframe id="myPcIframe" src="' + url + '" style="width:100%; height:100%; border:none; display:block; position:absolute; top:0; left:0;"></iframe>' +
    '</div>';

  myPcIframe = document.getElementById('myPcIframe');

  myPcIframe.onload = function() {
    setTimeout(function() {
      if (myPcIframe && myPcIframe.contentWindow) {
        var gameData = serializeGameData(game);
        myPcIframe.contentWindow.postMessage({
          type: 'GAME_DATA',
          data: gameData
        }, '*');
      }
    }, 100);
  };
}

// ============================================================
//  NEWSPAPER TAB
// ============================================================
var newspaperIframe = null;
var currentNewspaperPage = 'front';

function renderNewspaperTab() {
  var content = document.getElementById('content');
  content.innerHTML =
    '<div style="width:100%; height:100%; min-height:500px; background:#2c241f; border-radius:8px; overflow:hidden; position:relative;">' +
      '<iframe id="newspaperIframe" src="newspaper.html" style="width:100%; height:100%; border:none; display:block; position:absolute; top:0; left:0;"></iframe>' +
    '</div>';
  newspaperIframe = document.getElementById('newspaperIframe');
}

// ============================================================
//  MAIN MENU TAB
// ============================================================
function renderMainMenuTab() {
  var content = document.getElementById('content');
  content.innerHTML =
    '<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; min-height:300px; padding:40px; text-align:center;">' +
      '<div style="font-size:48px; margin-bottom:20px;">🏠</div>' +
      '<h2 style="color:#cdba92;">Return to Main Menu</h2>' +
      '<p style="color:#b68b5c; max-width:400px;">Your progress will be saved automatically before returning.</p>' +
      '<button id="confirmReturnMenuBtn" class="action-btn" style="background:#a13d3d; border:none; color:white; padding:12px 40px; border-radius:8px; cursor:pointer; margin-top:20px; font-size:1.2rem;">🚪 Return to Main Menu</button>' +
      '<button id="cancelReturnMenuBtn" class="action-btn" style="background:#4a5b6e; border:none; color:white; padding:12px 40px; border-radius:8px; cursor:pointer; margin-top:10px; font-size:1rem;">Cancel</button>' +
    '</div>';

  document.getElementById('confirmReturnMenuBtn').addEventListener('click', function() {
    if (game) game.saveToLocalStorage();
    document.getElementById('gameWrapper').style.display = 'none';
    document.getElementById('startMenu').style.display = 'flex';
    document.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); });
    document.querySelector('.tab[data-tab="mypc"]').classList.add('active');
    if (game) game.currentTab = 'mypc';
    if (typeof window.refreshContinueButton === 'function') window.refreshContinueButton();
  });

  document.getElementById('cancelReturnMenuBtn').addEventListener('click', function() {
    if (game) game.refreshCurrentTab();
  });
}

// ============================================================
//  TAB SWITCHING
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

      document.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); });
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
//  GLOBAL STUBS
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
