// ============================================================
//  GAME MANAGER – All game state and logic
// ============================================================

class Suspect {
  constructor(id, name, emoji, questions, responses) {
    this.id = id;
    this.name = name;
    this.emoji = emoji;
    this.questions = questions;
    this.responses = responses;
    this.unlocked = false;
  }
}

class Puzzle {
  constructor(id, title, desc, solution, hints, onSolve) {
    this.id = id;
    this.title = title;
    this.desc = desc;
    this.solution = solution;
    this.hints = hints;
    this.onSolve = onSolve;
  }
}

class MainPuzzle extends Puzzle {
  constructor(id, title, desc, solution, hints, digit, options) {
    super(id, title, desc, solution, hints);
    this.digit = digit;
    this.options = options;
  }
}

class BonusPuzzle extends Puzzle {
  constructor(id, title, desc, solution, hints, unlockAfterMain, render, check) {
    super(id, title, desc, solution, hints);
    this.unlockAfterMain = unlockAfterMain;
    this.render = render;
    this.check = check;
  }
}

class GameManager {
  constructor() {
    this.initialInterviewDone = false;
    this.askedQuestions = { s1: [], s2: [], s3: [] };
    this.puzzlesUnlocked = false;
    this.mainSolved = new Array(7).fill(false);
    this.bonusSolved = new Array(6).fill(false);
    this.solvedMainPuzzles = 0;
    this.solvedBonusPuzzles = 0;
    this.codeDigits = ['_', '_', '_', '_', '_', '_', '_'];
    this.roundQuestionsRemaining = 0;
    this.waitingForQuestions = false;
    this.hintsUsed = new Array(7).fill(0);
    this.cryptogramSolved = false;
    this.cryptogramRevealedLetters = new Set();
    this.suspects = [];
    this.mainPuzzles = [];
    this.bonusPuzzles = [];
    this.currentTab = 'mypc';
    this.questionRoundTriggered = new Array(7).fill(false);
    this.lockerPuzzleState = null;
    this.interviewIntroShown = false;
    this.secondInterviewPhaseShown = false;
    this.newSuspectsNotified = false;
    this.suspectNotificationRead = true;
    this.hasNewInterviewQuestions = false;
    this.caseClosed = false;
    this.towerSolved = false;
    this.usbUnlocked = false;
    this.vaultUnlocked = false;
    this.folderNotifications = {
      detectiveNotes: true,
      interviewResults: false,
      puzzleLog: false,
      suspects: false
    };
    this.detectiveNotes = [
      "🔍 DETECTIVE NOTES (CASE LOG)",
      "📁 CASE FILE OPENED",
      "",
      "A robbery has been reported within the city. Initial enquiries suggest the offender may be linked to several similar incidents reported across multiple towns.",
      "",
      "No signs of forced entry were discovered at any scene, suggesting the offender has developed an alternative method of gaining access.",
      "",
      "Investigators recovered two important pieces of evidence:",
      "  • A fragmented cryptogram that appears impossible to solve without a seven-digit key.",
      "  • A single-page newspaper whose significance is currently unknown.",
      "",
      "A suspect employed at the original crime scene has been brought in for questioning. Their involvement remains unclear.",
      "",
      "📋 CURRENT OBJECTIVES:",
      "  • Interview the suspect.",
      "  • Examine all recovered evidence.",
      "  • Locate all seven encrypted digits.",
      "  • Decode the cryptogram.",
      "  • Identify the offender."
    ];
    this.prisonYears = 30;
    this.hintsLeft = 12;
    this.currentQuestionRoundIdx = -1;
    this.suspectStress = { s1: 0, s2: 0, s3: 0 };
    this.suspectExtraClueRevealed = { s1: false, s2: false, s3: false };
  }

  init(suspectsData, mainPuzzlesData, bonusPuzzlesData) {
    for (let s of suspectsData) {
      this.suspects.push(new Suspect(s.id, s.name, s.emoji, s.questions, s.responses));
    }
    var s1 = this.suspects.find(s => s.id === 's1');
    if (s1) s1.unlocked = true;

    for (let i = 0; i < mainPuzzlesData.length; i++) {
      const p = mainPuzzlesData[i];
      const puzzle = new MainPuzzle(p.id, p.title, p.desc, p.solution, p.hints, p.digit, p.options);
      puzzle.onSolve = () => this.onMainPuzzleSolved(i);
      this.mainPuzzles.push(puzzle);
    }

    for (let p of bonusPuzzlesData) {
      const puzzle = new BonusPuzzle(p.id, p.title, p.desc, p.solution, p.hints, p.unlockAfterMain, p.render, p.check);
      puzzle.onSolve = () => this.onBonusPuzzleSolved(puzzle);
      this.bonusPuzzles.push(puzzle);
    }
  }

  onMainPuzzleSolved(idx) {
    if (this.mainSolved[idx]) return;
    this.mainSolved[idx] = true;
    this.solvedMainPuzzles++;
    this.codeDigits[idx] = this.mainPuzzles[idx].digit;
    this.updateUI();
    this.saveToLocalStorage();
    this.refreshCurrentTab();

    var mainNotes = {
      0: { note: "Escape route confirmed. The offender appears to have left the area by boat. A witness has come forward with torn paper containing a digit.", popup: "Escape route confirmed! A witness in Colchester has handed over torn paper with a digit." },
      1: { note: "Two Mischievous Watchers – The thief watched from the cathedral. A ripped note was found at the jewellery store.", popup: "⚠️ A note was found at the crime scene!" },
      2: { note: "Silver Street confirmed as a crime scene. A digit was discovered scratched behind the statue.", popup: "Digit recorded. Silver Street confirmed as a crime scene." },
      3: { note: "The route ends at Lincoln Museum. Officers have been dispatched to investigate the Rare Books collection.", popup: "Lincoln Museum confirmed." },
      4: { note: "The thief was in the stadium crowd. A locker at the stadium contains evidence.", popup: "Digit recorded. Stadium locker opened." },
      5: { note: "The castle cannons witnessed everything. Another key digit has been recovered.", popup: "Another key digit has been recovered." },
      6: { note: "The sword of Richard I has been stolen. The final digit has been recovered. The cryptogram can now be decoded.", popup: "Final digit recorded! The cryptogram is now ready to be decoded." }
    };

    if (mainNotes[idx]) {
      this.folderNotifications.detectiveNotes = true;
      this.addDetectiveNote(mainNotes[idx].note, mainNotes[idx].popup);
      if (idx === 0) {
        setTimeout(() => {
          this.showPopup("🗣️ A witness has been found in Colchester.");
          setTimeout(() => {
            if (typeof showWitnessPopup === 'function') {
              showWitnessPopup(function() {});
            }
          }, 1000);
        }, 500);
      }
      if (idx === 1) {
        setTimeout(() => {
          this.showPopup("📝 A ripped note was found at the jewellery store.");
          this.addDetectiveNote("The thief left a bragging note at the jewellery store.", "");
        }, 500);
      }
    }
  }

  onTowerSolved() {
    console.log('onTowerSolved called — this is now handled by the bonus puzzle.');
  }

  onBonusPuzzleSolved(puzzle) {
    var idx = this.bonusPuzzles.findIndex(p => p.id === puzzle.id);
    if (idx >= 0 && !this.bonusSolved[idx]) {
      this.bonusSolved[idx] = true;
      this.solvedBonusPuzzles++;
      this.updateUI();
      this.saveToLocalStorage();
      this.refreshCurrentTab();

      if (idx === 0 && !this.newSuspectsNotified) {
        this.newSuspectsNotified = true;
        this.suspectNotificationRead = false;
        this.folderNotifications.suspects = true;
        var s2 = this.suspects.find(s => s.id === 's2');
        var s3 = this.suspects.find(s => s.id === 's3');
        if (s2) s2.unlocked = true;
        if (s3) s3.unlocked = true;

        this.detectiveNotes.push("");
        this.detectiveNotes.push("🚨 NEW SUSPECTS BROUGHT IN");
        this.detectiveNotes.push("");
        this.detectiveNotes.push("Two additional suspects have been brought in. Total suspects: 3");
        this.folderNotifications.detectiveNotes = true;
        this.showPopup("🚨 Two additional suspects have been brought in. Total suspects: 3");
        this.updateUI();
        this.refreshCurrentTab();
        if (typeof updateTabNotifications === 'function') updateTabNotifications();
      }

      if (idx === 1) {
        this.usbUnlocked = true;
      }

      // One round per bonus solve
      this.startQuestionRound(idx + 1);

      var bonusNotes = {
        0: { note: "Bragger's Note solved! Every 10th letter reveals: WALKER JEWELLERY STORE.", popup: "UV reveals: WALKER JEWELLERY STORE." },
        1: { note: "Coffee Room USB recovered. The thief left a USB stick and a mocking note.", popup: "USB stick recovered from the coffee room!" },
        2: { note: "Shelf of Secrets – hidden compartment found with evidence and a digit.", popup: "Hidden clue revealed!" },
        3: { note: "The Cold Case Cabinet – locker opened! Inside: scale components.", popup: "Locker opened!" },
        4: { note: "The Balance of Justice – the numbers are 2, 4, and 6.", popup: "Scale balanced! The numbers are 2, 4, 6." },
        5: { note: "The Mastermind's Tower solved. USB drive accessed.", popup: "Tower of Hanoi solved!" }
      };

      if (bonusNotes[idx]) {
        this.folderNotifications.detectiveNotes = true;
        this.addDetectiveNote(bonusNotes[idx].note, bonusNotes[idx].popup);
      }
    }
  }

  startQuestionRound(mainIdx) {
    if (this.questionRoundTriggered[mainIdx]) {
      console.log('⚠️ Round ' + mainIdx + ' already triggered.');
      return;
    }
    console.log('🔄 Starting round ' + mainIdx);
    this.questionRoundTriggered[mainIdx] = true;
    this.waitingForQuestions = true;
    this.roundQuestionsRemaining = 3;
    this.currentQuestionRoundIdx = mainIdx;
    this.hasNewInterviewQuestions = true;
    this.folderNotifications.interviewResults = true;
    this.updateUI();
    this.saveToLocalStorage();
    this.refreshCurrentTab();
    this.showPopup('🔓 You can now ask 3 questions to any suspect. After that, the next main puzzle will appear.');
  }

  completeQuestionRound() {
    var roundNotes = {
      1: { note: "Their stories aren't lining up at all.", popup: "Good job—their stories don't quite match." },
      2: { note: "They're starting to slip up under pressure.", popup: "They're starting to contradict each other now." },
      3: { note: "One of them is hiding something.", popup: "You're putting pressure on them, and it's showing." },
      4: { note: "One of them is definitely hiding something big.", popup: "Someone's clearly hiding something now." },
      5: { note: "The truth is starting to crack through.", popup: "Their stories are starting to fall apart." },
      6: { note: "Almost there — one final push.", popup: "You're close to the truth." }
    };
    if (roundNotes[this.currentQuestionRoundIdx]) {
      this.folderNotifications.detectiveNotes = true;
      this.folderNotifications.interviewResults = true;
      this.addDetectiveNote(roundNotes[this.currentQuestionRoundIdx].note, roundNotes[this.currentQuestionRoundIdx].popup);
    }
    this.saveToLocalStorage();
  }

  getCurrentMainPuzzle() {
    if (!this.initialInterviewDone) return null;
    if (!this.mainSolved[0]) return this.mainPuzzles[0];

    for (var i = 1; i < this.mainPuzzles.length; i++) {
      if (this.waitingForQuestions) return null;
      if (!this.bonusSolved[i - 1]) return null;
      if (!this.mainSolved[i]) return this.mainPuzzles[i];
    }
    return null;
  }

  askQuestion(suspectId, questionIdx) {
    var suspect = this.suspects.find(s => s.id === suspectId);
    if (!suspect) return false;
    if (!suspect.unlocked && suspectId !== 's1') {
      alert("Suspect not yet available.");
      return false;
    }
    if (this.askedQuestions[suspectId].includes(questionIdx)) {
      alert("Already asked that question.");
      return false;
    }

    if (!this.initialInterviewDone) {
      if (suspectId !== 's1') {
        alert("Only Neil Down is available for initial questioning.");
        return false;
      }
      if (this.askedQuestions.s1.length >= 3) {
        alert("You've already asked 3 questions. Solve the first main puzzle now.");
        return false;
      }
      this.askedQuestions.s1.push(questionIdx);
      var response = suspect.responses[questionIdx];
      this.suspectStress[suspectId] = Math.min(100, this.suspectStress[suspectId] + 10);
      if (this.suspectStress[suspectId] > 80 && !this.suspectExtraClueRevealed[suspectId]) {
        this.suspectExtraClueRevealed[suspectId] = true;
        var clueText = "", popupMsg = "";
        if (suspectId === 's1') {
          clueText = "Neil Down's extra clue: He mentioned hearing a name 'Vega' over the radio.";
          popupMsg = "🔍 Neil Down slipped up!";
        } else if (suspectId === 's2') {
          clueText = "Sienna Clarke's extra clue: Her system logs show a backdoor entry at 2:17 AM.";
          popupMsg = "💻 Sienna Clarke cracked!";
        } else if (suspectId === 's3') {
          clueText = "Vincent Hale's extra clue: He saw a white van 'WH1TBY' near the service entrance.";
          popupMsg = "🚐 Vincent Hale let it slip!";
        }
        this.folderNotifications.detectiveNotes = true;
        this.addDetectiveNote(clueText, popupMsg);
      }
      if (this.askedQuestions.s1.length === 3) {
        this.initialInterviewDone = true;
        this.puzzlesUnlocked = true;
        document.querySelector('.tab[data-tab="mainpuzzles"]').classList.remove('locked');
        document.querySelector('.tab[data-tab="bonuspuzzles"]').classList.remove('locked');

        this.folderNotifications.interviewResults = true;
        this.folderNotifications.detectiveNotes = true;
        this.addDetectiveNote("Initial interview complete. Neil Down has opened up.", null);
        this.updateUI();
        this.refreshCurrentTab();
        if (typeof updateTabNotifications === 'function') updateTabNotifications();
      }
      this.saveToLocalStorage();
      this.updateUI();
      this.refreshCurrentTab();
      return { suspect: suspect, questionIdx: questionIdx, response: response };
    } else if (this.waitingForQuestions) {
      if (this.roundQuestionsRemaining <= 0) {
        alert("No questions left this round.");
        this.waitingForQuestions = false;
        this.saveToLocalStorage();
        this.updateUI();
        this.refreshCurrentTab();
        return false;
      }
      this.askedQuestions[suspectId].push(questionIdx);
      var response2 = suspect.responses[questionIdx];
      this.suspectStress[suspectId] = Math.min(100, this.suspectStress[suspectId] + 10);
      if (this.suspectStress[suspectId] > 80 && !this.suspectExtraClueRevealed[suspectId]) {
        this.suspectExtraClueRevealed[suspectId] = true;
        var clueText2 = "", popupMsg2 = "";
        if (suspectId === 's1') {
          clueText2 = "Neil Down's extra clue: He mentioned hearing a name 'Vega' over the radio.";
          popupMsg2 = "🔍 Neil Down slipped up!";
        } else if (suspectId === 's2') {
          clueText2 = "Sienna Clarke's extra clue: Her system logs show a backdoor entry at 2:17 AM.";
          popupMsg2 = "💻 Sienna Clarke cracked!";
        } else if (suspectId === 's3') {
          clueText2 = "Vincent Hale's extra clue: He saw a white van 'WH1TBY' near the service entrance.";
          popupMsg2 = "🚐 Vincent Hale let it slip!";
        }
        this.folderNotifications.detectiveNotes = true;
        this.addDetectiveNote(clueText2, popupMsg2);
      }
      this.roundQuestionsRemaining--;
      if (this.roundQuestionsRemaining === 0) {
        this.completeQuestionRound();
        this.showPopup("✅ You've used all 3 questions.");
        this.waitingForQuestions = false;
        this.updateUI();
        this.refreshCurrentTab();
      }
      this.updateUI();
      this.refreshCurrentTab();
      return { suspect: suspect, questionIdx: questionIdx, response: response2 };
    } else {
      alert("No active question round.");
      return false;
    }
  }

  getNextQuestions(suspectId, limit) {
    if (limit === undefined) limit = 3;
    var suspect = this.suspects.find(s => s.id === suspectId);
    if (!suspect) return [];
    var all = suspect.questions.map((_, i) => i);
    var answered = this.askedQuestions[suspectId] || [];
    var remaining = all.filter(i => !answered.includes(i));
    remaining.sort((a, b) => a - b);
    return remaining.slice(0, limit);
  }

  updateUI() {
    document.getElementById("prisonYears").innerText = this.prisonYears;
    document.getElementById("hintsLeft").innerText = this.hintsLeft;
    document.getElementById("solvedMain").innerText = this.solvedMainPuzzles + '/' + this.mainPuzzles.length;
    for (var i = 0; i < this.codeDigits.length; i++) {
      document.getElementById('code' + i).innerText = this.codeDigits[i];
    }
    if (this.cryptogramSolved && !this.caseClosed) {
      document.getElementById("accuseBtn").style.display = "inline-block";
    } else {
      document.getElementById("accuseBtn").style.display = "none";
    }
    if (typeof updateTabNotifications === 'function') updateTabNotifications();
    if (typeof showVaultTabIfUnlocked === 'function') showVaultTabIfUnlocked();
  }

  refreshCurrentTab() {
    if (this.currentTab === 'mypc') renderMyPcTab();
    else if (this.currentTab === 'interviews') renderInterviews();
    else if (this.currentTab === 'mainpuzzles') renderMainPuzzles();
    else if (this.currentTab === 'bonuspuzzles') renderBonusPuzzles();
    else if (this.currentTab === 'newspaper') renderNewspaperTab();
    else if (this.currentTab === 'mainmenu') renderMainMenuTab();
    else if (this.currentTab === 'vault') renderVaultTab();
  }

  showNotify(msg) {
    var div = document.createElement('div');
    div.className = "unlock-notify";
    div.innerHTML = msg;
    document.getElementById("content").prepend(div);
    setTimeout(() => div.remove(), 3000);
  }

  getRequiredBonusNameForNextQuestions() {
    for (var i = 0; i < 6; i++) {
      if (this.mainSolved[i] && !this.bonusSolved[i]) {
        return this.bonusPuzzles[i] ? this.bonusPuzzles[i].title : "Bonus Puzzle";
      }
    }
    return null;
  }

  saveToLocalStorage() {
    try {
      var saveData = {
        initialInterviewDone: this.initialInterviewDone,
        askedQuestions: this.askedQuestions,
        puzzlesUnlocked: this.puzzlesUnlocked,
        mainSolved: this.mainSolved,
        bonusSolved: this.bonusSolved,
        solvedMainPuzzles: this.solvedMainPuzzles,
        solvedBonusPuzzles: this.solvedBonusPuzzles,
        codeDigits: this.codeDigits,
        roundQuestionsRemaining: this.roundQuestionsRemaining,
        waitingForQuestions: this.waitingForQuestions,
        hintsUsed: this.hintsUsed,
        cryptogramSolved: this.cryptogramSolved,
        cryptogramRevealedLetters: Array.from(this.cryptogramRevealedLetters),
        questionRoundTriggered: this.questionRoundTriggered,
        detectiveNotes: this.detectiveNotes,
        prisonYears: this.prisonYears,
        hintsLeft: this.hintsLeft,
        currentQuestionRoundIdx: this.currentQuestionRoundIdx,
        lockerPuzzleState: this.lockerPuzzleState,
        suspectStress: this.suspectStress,
        suspectExtraClueRevealed: this.suspectExtraClueRevealed,
        interviewIntroShown: this.interviewIntroShown,
        secondInterviewPhaseShown: this.secondInterviewPhaseShown,
        newSuspectsNotified: this.newSuspectsNotified,
        suspectNotificationRead: this.suspectNotificationRead,
        hasNewInterviewQuestions: this.hasNewInterviewQuestions,
        caseClosed: this.caseClosed,
        folderNotifications: this.folderNotifications,
        suspectUnlocked: {
          s1: this.suspects.find(s => s.id === 's1') ? this.suspects.find(s => s.id === 's1').unlocked : false,
          s2: this.suspects.find(s => s.id === 's2') ? this.suspects.find(s => s.id === 's2').unlocked : false,
          s3: this.suspects.find(s => s.id === 's3') ? this.suspects.find(s => s.id === 's3').unlocked : false
        },
        usbUnlocked: this.usbUnlocked,
        towerSolved: this.towerSolved,
        vaultUnlocked: this.vaultUnlocked
      };
      localStorage.setItem('whitbyConspiracySave', JSON.stringify(saveData));
    } catch (e) {
      console.error("Save failed:", e);
      this.showPopup("⚠️ Auto-save failed! Check console.");
    }
  }

  loadFromSave(saveData) {
    this.initialInterviewDone = saveData.initialInterviewDone;
    this.askedQuestions = saveData.askedQuestions;
    this.puzzlesUnlocked = saveData.puzzlesUnlocked;
    this.mainSolved = saveData.mainSolved;
    this.bonusSolved = saveData.bonusSolved || new Array(6).fill(false);
    if (this.bonusSolved.length > 6) this.bonusSolved = this.bonusSolved.slice(0, 6);
    if (this.bonusSolved.length < 6) {
      while (this.bonusSolved.length < 6) this.bonusSolved.push(false);
    }
    this.solvedMainPuzzles = saveData.solvedMainPuzzles;
    this.solvedBonusPuzzles = saveData.solvedBonusPuzzles;
    this.codeDigits = saveData.codeDigits;
    this.roundQuestionsRemaining = saveData.roundQuestionsRemaining;
    this.waitingForQuestions = saveData.waitingForQuestions;
    this.hintsUsed = saveData.hintsUsed;
    this.cryptogramSolved = saveData.cryptogramSolved;
    this.cryptogramRevealedLetters = new Set(saveData.cryptogramRevealedLetters);
    this.questionRoundTriggered = saveData.questionRoundTriggered || new Array(7).fill(false);
    this.detectiveNotes = saveData.detectiveNotes;
    this.prisonYears = saveData.prisonYears;
    this.hintsLeft = saveData.hintsLeft;
    this.currentQuestionRoundIdx = saveData.currentQuestionRoundIdx;
    this.lockerPuzzleState = saveData.lockerPuzzleState;
    this.suspectStress = saveData.suspectStress || { s1: 0, s2: 0, s3: 0 };
    this.suspectExtraClueRevealed = saveData.suspectExtraClueRevealed || { s1: false, s2: false, s3: false };
    this.interviewIntroShown = saveData.interviewIntroShown || false;
    this.secondInterviewPhaseShown = saveData.secondInterviewPhaseShown || false;
    this.newSuspectsNotified = saveData.newSuspectsNotified || false;
    this.suspectNotificationRead = saveData.suspectNotificationRead !== undefined ? saveData.suspectNotificationRead : true;
    this.hasNewInterviewQuestions = saveData.hasNewInterviewQuestions || false;
    this.caseClosed = saveData.caseClosed || false;
    this.folderNotifications = saveData.folderNotifications || {
      detectiveNotes: false,
      interviewResults: false,
      puzzleLog: false,
      suspects: false
    };
    this.usbUnlocked = saveData.usbUnlocked || false;
    this.towerSolved = saveData.towerSolved || false;
    this.vaultUnlocked = saveData.vaultUnlocked || false;

    if (saveData.suspectUnlocked) {
      var s1 = this.suspects.find(s => s.id === 's1');
      var s2 = this.suspects.find(s => s.id === 's2');
      var s3 = this.suspects.find(s => s.id === 's3');
      if (s1) s1.unlocked = saveData.suspectUnlocked.s1;
      if (s2) s2.unlocked = saveData.suspectUnlocked.s2;
      if (s3) s3.unlocked = saveData.suspectUnlocked.s3;
    }

    if (this.puzzlesUnlocked) {
      var mp = document.querySelector('.tab[data-tab="mainpuzzles"]');
      var bp = document.querySelector('.tab[data-tab="bonuspuzzles"]');
      if (mp) mp.classList.remove('locked');
      if (bp) bp.classList.remove('locked');
    }
    this.updateUI();
  }

  resetGame() {
    this.initialInterviewDone = false;
    this.askedQuestions = { s1: [], s2: [], s3: [] };
    this.puzzlesUnlocked = false;
    this.mainSolved = new Array(7).fill(false);
    this.bonusSolved = new Array(6).fill(false);
    this.solvedMainPuzzles = 0;
    this.solvedBonusPuzzles = 0;
    this.codeDigits = ['_', '_', '_', '_', '_', '_', '_'];
    this.roundQuestionsRemaining = 0;
    this.waitingForQuestions = false;
    this.hintsUsed = new Array(7).fill(0);
    this.cryptogramSolved = false;
    this.cryptogramRevealedLetters = new Set();
    this.questionRoundTriggered = new Array(7).fill(false);
    this.interviewIntroShown = false;
    this.secondInterviewPhaseShown = false;
    this.newSuspectsNotified = false;
    this.suspectNotificationRead = true;
    this.hasNewInterviewQuestions = false;
    this.caseClosed = false;
    this.folderNotifications = {
      detectiveNotes: true,
      interviewResults: false,
      puzzleLog: false,
      suspects: false
    };
    this.detectiveNotes = [
      "🔍 DETECTIVE NOTES (CASE LOG)",
      "📁 CASE FILE OPENED",
      "",
      "A robbery has been reported within the city.",
      "",
      "No signs of forced entry were discovered at any scene.",
      "",
      "Investigators recovered two important pieces of evidence:",
      "  • A fragmented cryptogram that appears impossible to solve without a seven-digit key.",
      "  • A single-page newspaper whose significance is currently unknown.",
      "",
      "📋 CURRENT OBJECTIVES:",
      "  • Interview the suspect.",
      "  • Examine all recovered evidence.",
      "  • Locate all seven encrypted digits.",
      "  • Decode the cryptogram.",
      "  • Identify the offender."
    ];
    this.prisonYears = 30;
    this.hintsLeft = 12;
    this.currentQuestionRoundIdx = -1;
    this.suspectStress = { s1: 0, s2: 0, s3: 0 };
    this.suspectExtraClueRevealed = { s1: false, s2: false, s3: false };
    this.usbUnlocked = false;
    this.towerSolved = false;
    this.vaultUnlocked = false;
    for (var i = 0; i < this.suspects.length; i++) {
      this.suspects[i].unlocked = false;
    }
    var s1 = this.suspects.find(s => s.id === 's1');
    if (s1) s1.unlocked = true;
    document.querySelector('.tab[data-tab="mainpuzzles"]').classList.add('locked');
    document.querySelector('.tab[data-tab="bonuspuzzles"]').classList.add('locked');
    localStorage.removeItem('whitbyConspiracySave');
    this.updateUI();
  }

  addDetectiveNote(noteText, popupMessage) {
    this.detectiveNotes.push(noteText);
    if (popupMessage) this.showPopup(popupMessage);
    this.updateUI();
    this.refreshCurrentTab();
  }

  addPenalty() {
    this.prisonYears = Math.max(0, this.prisonYears - 2);
    this.hintsLeft = Math.max(0, this.hintsLeft - 1);
    this.updateUI();
    this.saveToLocalStorage();
  }

  addHint() {
    this.hintsLeft = this.hintsLeft + 1;
    this.updateUI();
    this.saveToLocalStorage();
  }

  showPopup(msg) {
    var container = document.getElementById('popupContainer');
    if (!container) return;
    var div = document.createElement('div');
    div.className = 'popup-message';
    var closeSpan = document.createElement('span');
    closeSpan.className = 'popup-close';
    closeSpan.innerHTML = '&times;';
    closeSpan.onclick = function(e) { e.stopPropagation(); div.remove(); };
    div.appendChild(closeSpan);
    var textSpan = document.createElement('span');
    textSpan.innerText = msg;
    div.appendChild(textSpan);
    container.appendChild(div);
  }
}

// ========== TAB NOTIFICATION FUNCTION ==========
function updateTabNotifications() {
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function(tab) {
    var existingDot = tab.querySelector('.notification-dot');
    if (existingDot) existingDot.remove();
    var tabId = tab.dataset.tab;
    var shouldNotify = false;
    if (tabId === 'interviews') {
      if (game && game.hasNewInterviewQuestions) shouldNotify = true;
      if (game && game.newSuspectsNotified && !game.suspectNotificationRead) shouldNotify = true;
    }
    if (shouldNotify) {
      var dot = document.createElement('span');
      dot.className = 'notification-dot';
      dot.style.cssText = 'display:inline-block; width:10px; height:10px; background:#ff3333; border-radius:50%; margin-left:6px; box-shadow:0 0 8px #ff3333; animation:pulse-dot 1.5s infinite;';
      tab.appendChild(dot);
    }
  });
}

var styleSheet = document.createElement("style");
styleSheet.textContent = '@keyframes pulse-dot {' +
  '0% { opacity: 1; transform: scale(1); }' +
  '50% { opacity: 0.5; transform: scale(1.2); }' +
  '100% { opacity: 1; transform: scale(1); }' +
  '}';
document.head.appendChild(styleSheet);
