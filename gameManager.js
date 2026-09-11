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
    this.bonusSolved = new Array(7).fill(false);
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
    this.questionRoundTriggered = new Array(5).fill(false);
    this.lockerPuzzleState = null;
    this.interviewIntroShown = false;
    this.secondInterviewPhaseShown = false;
    this.newSuspectsNotified = false;
    this.suspectNotificationRead = true;
    this.hasNewInterviewQuestions = false;
    this.caseClosed = false;
    this.towerSolved = false;
    this.usbUnlocked = false;
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
      0: { note: "Escape route confirmed. The offender appears to have left the area by boat. Officers believe witnesses in the destination town may have seen something suspicious. You should travel there and begin making local enquiries. A witness has come forward with torn paper containing a digit.", popup: "Escape route confirmed! A witness in Colchester has handed over torn paper with a digit." },
      1: { note: "Two Mischievous Watchers – The thief watched from the cathedral. A ripped note was found at the jewellery store. The thief bragged about watching police activity from the Cathedral.", popup: "⚠️ A note was found at the crime scene! The thief claims they were watching from the Cathedral." },
      2: { note: "Silver Street confirmed as a crime scene. A digit was discovered scratched behind the statue.", popup: "Digit recorded. Silver Street confirmed as a crime scene. Officers searched the statue." },
      3: { note: "The route ends at Lincoln Museum. Officers have been dispatched to investigate the Rare Books collection.", popup: "Lincoln Museum confirmed. A hidden compartment in the Rare Books collection has revealed another digit." },
      4: { note: "The thief was in the stadium crowd. A locker at the stadium contains evidence.", popup: "Digit recorded. Stadium locker has been opened – scale pieces and a note found." },
      5: { note: "The castle cannons witnessed everything. Officers discovered several cannonballs. One had a digit scratched into its surface. Another key digit has been recovered.", popup: "Officers discovered several cannonballs. One had a digit scratched into its surface. Another key digit has been recovered." },
      6: { note: "The sword of Richard I has been stolen. The final digit has been recovered. The cryptogram can now be decoded.", popup: "Final digit recorded! The cryptogram is now ready to be decoded." }
    };
    
    if (mainNotes[idx]) {
      this.folderNotifications.detectiveNotes = true;
      this.addDetectiveNote(mainNotes[idx].note, mainNotes[idx].popup);
      if (idx === 0) {
        setTimeout(() => {
          this.showPopup("🗣️ A witness has been found in Colchester. It might be worth asking questions in that town to see if anyone saw anything.");
          setTimeout(() => {
            if (typeof showWitnessPopup === 'function') {
              showWitnessPopup(function() {});
            }
          }, 1000);
        }, 500);
      }
      if (idx === 1) {
        setTimeout(() => {
          this.showPopup("📝 A ripped note was found at the jewellery store. The thief wrote: 'I watched everything from the Cathedral. You'll never catch me.'");
          this.addDetectiveNote("The thief left a bragging note at the jewellery store, claiming to have watched from the Cathedral.", "");
        }, 500);
      }
    }

    // ROUND TRIGGERING
    if (idx === 2) {
      this.startQuestionRound(3);
    }
  }

  onTowerSolved() {
    console.log('🎯 onTowerSolved called!');
    if (this.towerSolved) {
      console.log('⚠️ Tower already solved – ignoring.');
      return;
    }
    this.towerSolved = true;
    console.log('✅ Tower marked as solved.');
    this.startQuestionRound(2);
    this.addDetectiveNote("The Mastermind's Tower puzzle solved! The USB drive contained a cryptic message: 'The next target is GRAND AVENUE VAULT.'", "🔓 Tower of Hanoi solved! New interview questions available.");
    this.updateUI();
    this.saveToLocalStorage();
    console.log('✅ onTowerSolved complete.');
  }

  onBonusPuzzleSolved(puzzle) {
    var idx = this.bonusPuzzles.findIndex(p => p.id === puzzle.id);
    if (idx >= 0 && !this.bonusSolved[idx]) {
      this.bonusSolved[idx] = true;
      this.solvedBonusPuzzles++;
      this.updateUI();
      this.saveToLocalStorage();
      this.refreshCurrentTab();

      // Unlock s2 and s3 when Braggers Note (idx 0) is solved
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
        this.detectiveNotes.push("Two additional suspects have been brought in following today's discoveries.");
        this.detectiveNotes.push("Total suspects: 3");
        this.folderNotifications.detectiveNotes = true;
        this.showPopup("🚨 Two additional suspects have been brought in following today's discoveries. Total suspects: 3");
        this.updateUI();
        this.refreshCurrentTab();
        updateTabNotifications();
      }

      // Bonus 1 (measure of a Thief) unlocks USB
      if (idx === 1) {
        this.usbUnlocked = true;
        this.showPopup("💾 USB drive unlocked! The Mastermind's Tower is now accessible on the MY PC tab.");
      }

      // ROUND TRIGGERING FOR BONUS SOLVES
      if (idx === 0) {
        this.startQuestionRound(1);
      }
      if (idx === 3) {
        this.startQuestionRound(3);
      }
      if (idx === 4) {
        this.startQuestionRound(4);
      }

      // Bonus Notes
      var bonusNotes = {
        0: { note: "Bragger's Note solved! Every 10th letter reveals: WALKER JEWELLERY STORE. Officers have been dispatched to the location.", popup: "UV reveals: WALKER JEWELLERY STORE. Officers dispatched!" },
        1: { note: "Coffee Room USB recovered. One of the three suspects must have left it while visiting the toilets. The thief left a USB stick and a mocking note, trying to prove they're cleverer than the detective.", popup: "USB stick recovered from the coffee room! One of the suspects left it while they were in the toilets." },
        2: { note: "Shelf of Secrets – The thief touched specific books in the museum. Hidden compartment found with evidence and a digit.", popup: "Hidden clue revealed: 'Next stop – Lincoln Stadium.'" },
        3: { note: "The Cold Case Cabinet – locker opened! Inside: scale components and a note about weighing evidence.", popup: "Locker opened! Inside: scale pieces and a note." },
        4: { note: "The Balance of Justice – scale puzzle solved. The three numbers are 2, 4, and 6. The case file has been updated.", popup: "Scale balanced! The numbers are 2, 4, 6." },
        5: { note: "The Vault has been cracked! The final evidence confirms the mastermind's identity.", popup: "Vault cracked! The final evidence is secured." }
      };

      if (bonusNotes[idx]) {
        this.folderNotifications.detectiveNotes = true;
        this.addDetectiveNote(bonusNotes[idx].note, bonusNotes[idx].popup);
      }
    }
  }

  startQuestionRound(mainIdx) {
    if (this.questionRoundTriggered[mainIdx]) {
      console.log(`⚠️ Round ${mainIdx} already triggered.`);
      return;
    }
    console.log(`🔄 Starting round ${mainIdx}`);
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
      0: { note: "Their stories aren't lining up at all. The pressure is starting to crack them.", popup: "Good job—you've spoken to everyone, but their stories don't quite match." },
      1: { note: "They're starting to slip up under pressure. Contradictions are appearing.", popup: "Well played—they're starting to contradict each other now." },
      2: { note: "I'm getting closer—they're getting nervous. One of them is hiding something.", popup: "Good work—you're putting pressure on them, and it's showing." },
      3: { note: "One of them is definitely hiding something big. The tension is palpable.", popup: "Well done—someone's clearly hiding something now." },
      4: { note: "The truth is starting to crack through. We have enough to make an arrest.", popup: "Strong work—their stories are starting to fall apart." }
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
      if (i === 2 && !this.towerSolved) continue;
      if (i >= 4 && !this.bonusSolved[i - 1]) continue;
      if (!this.mainSolved[i] && this.bonusSolved[i - 1] && !this.waitingForQuestions) {
        return this.mainPuzzles[i];
      }
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
          clueText = "Neil Down's extra clue: He mentioned hearing a name 'Vega' over the radio just before the alarms.";
          popupMsg = "🔍 Neil Down slipped up! Under pressure, he muttered something about 'Vega' on the radio before the alarms.";
        } else if (suspectId === 's2') {
          clueText = "Sienna Clarke's extra clue: Her system logs show a backdoor entry at 2:17 AM from an IP address traced to a local library.";
          popupMsg = "💻 Sienna Clarke cracked! She accidentally revealed a backdoor entry at 2:17 AM from a library IP.";
        } else if (suspectId === 's3') {
          clueText = "Vincent Hale's extra clue: He admitted seeing a suspicious van with the license plate 'WH1TBY' parked near the service entrance.";
          popupMsg = "🚐 Vincent Hale let it slip – a white van with plate 'WH1TBY' was parked near the service entrance.";
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
        this.addDetectiveNote("Initial interview complete. Neil Down has opened up. Further investigation may reveal more suspects.", null);
        this.updateUI();
        this.refreshCurrentTab();
        updateTabNotifications();
      }
      this.saveToLocalStorage();
      this.updateUI();
      this.refreshCurrentTab();
      return { suspect: suspect, questionIdx: questionIdx, response: response };
    } else if (this.waitingForQuestions) {
      if (this.roundQuestionsRemaining <= 0) {
        alert("No questions left this round. The next main puzzle will appear if the required bonus is solved.");
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
          clueText2 = "Neil Down's extra clue: He mentioned hearing a name 'Vega' over the radio just before the alarms.";
          popupMsg2 = "🔍 Neil Down slipped up! Under pressure, he muttered something about 'Vega' on the radio before the alarms.";
        } else if (suspectId === 's2') {
          clueText2 = "Sienna Clarke's extra clue: Her system logs show a backdoor entry at 2:17 AM from an IP address traced to a local library.";
          popupMsg2 = "💻 Sienna Clarke cracked! She accidentally revealed a backdoor entry at 2:17 AM from a library IP.";
        } else if (suspectId === 's3') {
          clueText2 = "Vincent Hale's extra clue: He admitted seeing a suspicious van with the license plate 'WH1TBY' parked near the service entrance.";
          popupMsg2 = "🚐 Vincent Hale let it slip – a white van with plate 'WH1TBY' was parked near the service entrance.";
        }
        this.folderNotifications.detectiveNotes = true;
        this.addDetectiveNote(clueText2, popupMsg2);
      }
      this.roundQuestionsRemaining--;
      if (this.roundQuestionsRemaining === 0) {
        this.completeQuestionRound();
        this.showPopup("✅ You've used all 3 questions. The next main puzzle will now appear (provided the required bonus puzzle is solved).");
        this.waitingForQuestions = false;
        this.updateUI();
        this.refreshCurrentTab();
      }
      this.updateUI();
      this.refreshCurrentTab();
      return { suspect: suspect, questionIdx: questionIdx, response: response2 };
    } else {
      alert("No active question round. Complete the current main puzzle and its linked bonus puzzle to unlock more questions.");
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
    updateTabNotifications();
  }

  refreshCurrentTab() {
    if (this.currentTab === 'mypc') renderMyPcTab();
    else if (this.currentTab === 'interviews') renderInterviews();
    else if (this.currentTab === 'mainpuzzles') renderMainPuzzles();
    else if (this.currentTab === 'bonuspuzzles') renderBonusPuzzles();
    else if (this.currentTab === 'newspaper') renderNewspaperTab();
    else if (this.currentTab === 'mainmenu') renderMainMenuTab();
  }

  showNotify(msg) {
    var div = document.createElement('div');
    div.className = "unlock-notify";
    div.innerHTML = msg;
    document.getElementById("content").prepend(div);
    setTimeout(() => div.remove(), 3000);
  }

  getRequiredBonusNameForNextQuestions() {
    for (var i = 0; i < 5; i++) {
      if (this.mainSolved[i] && !this.bonusSolved[i]) {
        return this.bonusPuzzles[i] ? this.bonusPuzzles[i].title : "Bonus Puzzle";
      }
    }
    return null;
  }

  getEvidenceList() {
    var evidence = [];
    var notes = this.detectiveNotes;
    var keywords = [
      { key: "Escape route confirmed", label: "🔍 Escape route confirmed – offender left by boat" },
      { key: "Colchester", label: "🗣️ Witness statement – Colchester Harbour" },
      { key: "torn paper containing a digit", label: "📄 Torn paper with digit 3 recovered" },
      { key: "Two Mischievous Watchers", label: "👀 Thief watched from Cathedral – note found" },
      { key: "Silver Street", label: "🏛️ Silver Street – digit scratched behind statue" },
      { key: "Lincoln Museum", label: "🏛️ Lincoln Museum – hidden compartment in Rare Books" },
      { key: "stadium crowd", label: "🏟️ Stadium locker – scale pieces and note" },
      { key: "castle cannons", label: "🏰 Castle cannons – cannonball with digit" },
      { key: "sword of Richard I", label: "⚔️ Sword of Richard I – final digit recovered" },
      { key: "Bragger's Note", label: "📜 Braggers Note – WALKER JEWELLERY STORE identified" },
      { key: "USB", label: "💻 USB stick – recovered from coffee room" },
      { key: "KEYSTONE", label: "🔑 KEYSTONE – recurring clue in USB files" },
      { key: "Scale puzzle", label: "⚖️ Scale puzzle – numbers 2, 4, 6 recorded" },
      { key: "Vault", label: "🔐 Vault – final evidence secured" },
      { key: "Neil Down", label: "👨 Interview – Neil Down" },
      { key: "Sienna Clarke", label: "👩 Interview – Sienna Clarke" },
      { key: "Vincent Hale", label: "🧓 Interview – Vincent Hale" }
    ];
    for (var i = 0; i < keywords.length; i++) {
      for (var j = 0; j < notes.length; j++) {
        if (notes[j].indexOf(keywords[i].key) !== -1) {
          var exists = false;
          for (var k = 0; k < evidence.length; k++) {
            if (evidence[k] === keywords[i].label) exists = true;
          }
          if (!exists) {
            evidence.push(keywords[i].label);
          }
          break;
        }
      }
    }
    if (evidence.length < 5) {
      if (this.initialInterviewDone && evidence.indexOf("👨 Interview – Neil Down") === -1) {
        evidence.push("👨 Interview – Neil Down");
      }
      if (this.bonusSolved[0] && evidence.indexOf("📜 Braggers Note") === -1) {
        evidence.push("📜 Braggers Note – WALKER JEWELLERY STORE identified");
      }
    }
    return evidence;
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
        towerSolved: this.towerSolved
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
    this.bonusSolved = saveData.bonusSolved;
    this.solvedMainPuzzles = saveData.solvedMainPuzzles;
    this.solvedBonusPuzzles = saveData.solvedBonusPuzzles;
    this.codeDigits = saveData.codeDigits;
    this.roundQuestionsRemaining = saveData.roundQuestionsRemaining;
    this.waitingForQuestions = saveData.waitingForQuestions;
    this.hintsUsed = saveData.hintsUsed;
    this.cryptogramSolved = saveData.cryptogramSolved;
    this.cryptogramRevealedLetters = new Set(saveData.cryptogramRevealedLetters);
    this.questionRoundTriggered = saveData.questionRoundTriggered;
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

    if (saveData.suspectUnlocked) {
      var s1 = this.suspects.find(s => s.id === 's1');
      var s2 = this.suspects.find(s => s.id === 's2');
      var s3 = this.suspects.find(s => s.id === 's3');
      if (s1) s1.unlocked = saveData.suspectUnlocked.s1;
      if (s2) s2.unlocked = saveData.suspectUnlocked.s2;
      if (s3) s3.unlocked = saveData.suspectUnlocked.s3;
    }

    if (this.puzzlesUnlocked) {
      document.querySelector('.tab[data-tab="mainpuzzles"]').classList.remove('locked');
      document.querySelector('.tab[data-tab="bonuspuzzles"]').classList.remove('locked');
    }
    this.updateUI();
  }

  resetGame() {
    this.initialInterviewDone = false;
    this.askedQuestions = { s1: [], s2: [], s3: [] };
    this.puzzlesUnlocked = false;
    this.mainSolved = new Array(7).fill(false);
    this.bonusSolved = new Array(7).fill(false);
    this.solvedMainPuzzles = 0;
    this.solvedBonusPuzzles = 0;
    this.codeDigits = ['_', '_', '_', '_', '_', '_', '_'];
    this.roundQuestionsRemaining = 0;
    this.waitingForQuestions = false;
    this.hintsUsed = new Array(7).fill(0);
    this.cryptogramSolved = false;
    this.cryptogramRevealedLetters = new Set();
    this.questionRoundTriggered = new Array(5).fill(false);
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
    this.usbUnlocked = false;
    this.towerSolved = false;
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
styleSheet.textContent = `
  @keyframes pulse-dot {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
    100% { opacity: 1; transform: scale(1); }
  }
`;
document.head.appendChild(styleSheet);