// ============================================================
//  PUZZLES DATA – Suspects, Main Puzzles, Bonus Puzzles
// ============================================================

// ========== SUSPECTS ==========
var suspectsData = [
  {
    id: "s1",
    name: "Neil Down",
    emoji: "👨",
    questions: [
      "Where were you on the night of the robbery?",
      "What do you know about the stolen items?",
      "Why were you near the crime scene?",
      "Do you have any alibis?",
      "Have you ever been convicted of a crime?"
    ],
    responses: [
      "I was at home, alone, watching television.",
      "I don't know anything about any stolen items.",
      "I was just passing by, I often walk that way.",
      "My wife can confirm I was home, but she was asleep.",
      "No, I have a clean record."
    ]
  },
  {
    id: "s2",
    name: "Sienna Clarke",
    emoji: "👩",
    questions: [
      "What is your relationship to the victim?",
      "Did you have access to the security systems?",
      "Were you at the location on the day of the theft?",
      "Do you know anyone who might have a grudge against the victim?",
      "Can you explain your recent financial transactions?"
    ],
    responses: [
      "I was a consultant, I worked on the security system.",
      "Yes, I had administrative access, but I never misused it.",
      "I was there that morning for a routine check.",
      "Not that I know of, he was well-liked.",
      "I've been under some financial stress, but nothing illegal."
    ]
  },
  {
    id: "s3",
    name: "Vincent Hale",
    emoji: "🧓",
    questions: [
      "How long have you known the victim?",
      "Were you present at any of the crime scenes?",
      "What were you doing on the nights of the robberies?",
      "Do you have any knowledge of the stolen goods' whereabouts?",
      "Why should we believe you?"
    ],
    responses: [
      "We were colleagues for about 10 years.",
      "I was at some of the locations for work, but not during the thefts.",
      "I was either at home or at the office, I have logs.",
      "I have no idea where they are.",
      "I'm a man of integrity, I have nothing to hide."
    ]
  }
];

// ========== MAIN PUZZLES ==========
var mainPuzzlesData = [
  {
    id: "escape_route",
    title: "The Escape Route",
    desc: "Tracing the thief's possible escape route on a map. They were last seen heading south by boat on the River Witham. Which town along the river could the thief have stopped at for coffee?",
    solution: "Stamford",
    hints: [
      "Look at a map of Lincolnshire.",
      "The River Witham flows through several towns.",
      "Stamford is a historic town on the river."
    ],
    digit: "3",
    options: [
      { letter: "Claythorpe", text: "Claythorpe" },
      { letter: "Colsterworth", text: "Colsterworth" },
      { letter: "Stamford", text: "Stamford" }
    ]
  },
  {
    id: "two_mischievous_watchers",
    title: "Two Mischievous Watchers",
    desc: "The thief bragged about watching from the Cathedral. What did they write in the note?",
    solution: "cathedral",
    hints: [
      "The note was found at the jewellery store.",
      "They claimed to have watched from a landmark.",
      "It's a place of worship."
    ],
    digit: "7",
    options: [
      { letter: "cathedral", text: "Cathedral" },
      { letter: "museum", text: "Museum" },
      { letter: "library", text: "Library" },
      { letter: "castle", text: "Castle" }
    ]
  },
  {
    id: "silver_street",
    title: "Street of Shining Metal",
    desc: "A digit was scratched behind a statue on Silver Street. What is the digit?",
    solution: "1",
    hints: [
      "The statue is in the town centre.",
      "It's a historical figure.",
      "The digit is scratched behind it."
    ],
    digit: "1",
    options: [
      { letter: "0", text: "0" },
      { letter: "1", text: "1" },
      { letter: "2", text: "2" },
      { letter: "3", text: "3" }
    ]
  },
  {
    id: "lincoln_museum",
    title: "The Chase Through Lincoln",
    desc: "A hidden compartment in the Rare Books collection revealed a digit. What is it?",
    solution: "5",
    hints: [
      "The book was about medieval history.",
      "It was found on the third shelf.",
      "The digit is 5."
    ],
    digit: "5",
    options: [
      { letter: "4", text: "4" },
      { letter: "5", text: "5" },
      { letter: "6", text: "6" },
      { letter: "7", text: "7" }
    ]
  },
  {
    id: "stadium_crowd",
    title: "The Roar of the Crowd",
    desc: "A locker at the stadium contains evidence. What digit was inside?",
    solution: "2",
    hints: [
      "It was found in locker 14.",
      "The scale pieces had a number.",
      "The digit is 2."
    ],
    digit: "2",
    options: [
      { letter: "1", text: "1" },
      { letter: "2", text: "2" },
      { letter: "3", text: "3" },
      { letter: "4", text: "4" }
    ]
  },
  {
    id: "castle_cannons",
    title: "Defenders of the Castle",
    desc: "A cannonball with a digit was found. What is the digit?",
    solution: "8",
    hints: [
      "The cannonball was near the east wall.",
      "It was marked with the digit.",
      "The digit is 8."
    ],
    digit: "8",
    options: [
      { letter: "6", text: "6" },
      { letter: "7", text: "7" },
      { letter: "8", text: "8" },
      { letter: "9", text: "9" }
    ]
  },
  {
    id: "sword_of_richard",
    title: "The Sword of Richard I",
    desc: "The final digit was recovered from the stolen sword. What is it?",
    solution: "9",
    hints: [
      "The sword was taken from the museum.",
      "The digit is the last one needed.",
      "It's 9."
    ],
    digit: "9",
    options: [
      { letter: "7", text: "7" },
      { letter: "8", text: "8" },
      { letter: "9", text: "9" },
      { letter: "0", text: "0" }
    ]
  }
];

// ========== BONUS PUZZLES (new order, no Vault) ==========
var bonusPuzzlesData = [
  {
    id: "letter_puzzle",
    title: "The Braggers Note",
    desc: "A mysterious letter with hidden UV ink.",
    solution: "walker jewellery store",
    hints: [
      "Use the UV torch to reveal the hidden letters.",
      "The letters spell a shop name.",
      "It's a jewellery store."
    ],
    unlockAfterMain: 1,
    render: function(solved) {
      return '<div class="folder-card" id="letter-puzzle-folder" style="width:200px; margin:0 auto;">' +
        '<span class="folder-icon">📜</span>' +
        '<div class="folder-title">The Braggers Note</div>' +
        (solved ? '<div class="solved-badge">✅ SOLVED!</div>' : '') +
        '</div>';
    },
    check: function(answer) {
      return answer.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[^\w\s]/g, '') === "walker jewellery store";
    }
  },
  {
    id: "coffee_puzzle",
    title: "The measure of a Thief",
    desc: "Pour exactly 8 litres into the 10L jug.",
    solution: "8",
    hints: [
      "You have 6L, 5L and 10L containers.",
      "Start with the 6L and 5L full.",
      "The 10L jug starts empty."
    ],
    unlockAfterMain: 2,
    render: function(solved) {
      return '<div class="folder-card" id="coffee-puzzle-folder" style="width:200px; margin:0 auto;">' +
        '<span class="folder-icon">☕</span>' +
        '<div class="folder-title">The measure of a Thief</div>' +
        (solved ? '<div class="solved-badge">✅ SOLVED!</div>' : '') +
        '</div>';
    },
    check: function(answer) { return true; }
  },
  {
    id: "shelf_puzzle",
    title: "The Shelf of Secrets",
    desc: "Find the correct sequence of books to open the hidden drawer.",
    solution: "shelf",
    hints: [
      "The correct order is from largest to smallest disc.",
      "Look at the book spines for numbers.",
      "The order is 6,5,4,3,2,1."
    ],
    unlockAfterMain: 3,
    render: function(solved) {
      return '<div class="folder-card" id="shelf-puzzle-folder" style="width:200px; margin:0 auto;">' +
        '<span class="folder-icon">📚</span>' +
        '<div class="folder-title">The Shelf of Secrets</div>' +
        (solved ? '<div class="solved-badge">✅ SOLVED!</div>' : '') +
        '</div>';
    },
    check: function(answer) { return true; }
  },
  {
    id: "locker_puzzle",
    title: "The Cold Case Cabinet",
    desc: "Crack the evidence locker combinations using the clues.",
    solution: "locker",
    hints: [
      "Each locker has a unique 3-digit combination.",
      "Clues are given – use logic to deduce the digits.",
      "Solve locker 5 to complete the puzzle."
    ],
    unlockAfterMain: 4,
    render: function(solved) {
      return '<div class="folder-card" id="locker-puzzle-folder" style="width:200px; margin:0 auto;">' +
        '<span class="folder-icon">🔒</span>' +
        '<div class="folder-title">The Cold Case Cabinet</div>' +
        (solved ? '<div class="solved-badge">✅ SOLVED!</div>' : '') +
        '</div>';
    },
    check: function(answer) { return true; }
  },
  {
    id: "scale_puzzle",
    title: "The Balance of Justice",
    desc: "Use the balance scale to deduce the hidden values of the star, triangle, and circle.",
    solution: "solve",
    hints: [
      "Place weights on both sides to find the balance.",
      "The secret values are whole numbers.",
      "Try to create equilibrium."
    ],
    unlockAfterMain: 5,
    render: function(solved) {
      return '<div class="folder-card" id="scale-puzzle-folder" style="width:200px; margin:0 auto;">' +
        '<span class="folder-icon">⚖️</span>' +
        '<div class="folder-title">The Balance of Justice</div>' +
        (solved ? '<div class="solved-badge">✅ SOLVED!</div>' : '') +
        '</div>';
    },
    check: function(answer) { return true; }
  },
  {
    id: "detective_puzzle",
    title: "The Mastermind's Tower",
    desc: "The USB stick the thief left behind is locked. Solve the Tower of Hanoi to access the files.",
    solution: "hanoi",
    hints: [
      "The classic Tower of Hanoi puzzle.",
      "Only one disk can be moved at a time.",
      "A larger disk may not be placed on a smaller one."
    ],
    unlockAfterMain: 6,
    render: function(solved) {
      return '<div class="folder-card" id="detective-puzzle-folder" style="width:200px; margin:0 auto;">' +
        '<span class="folder-icon">🗼</span>' +
        '<div class="folder-title">The Mastermind\'s Tower</div>' +
        (solved ? '<div class="solved-badge">✅ SOLVED!</div>' : '') +
        '</div>';
    },
    check: function(answer) { return true; }
  }
];

// ========== EXPOSE ==========
window.mainPuzzlesData = mainPuzzlesData;
window.bonusPuzzlesData = bonusPuzzlesData;
window.suspectsData = suspectsData;
window.mainPuzzles = mainPuzzlesData;
window.bonusPuzzles = bonusPuzzlesData;
