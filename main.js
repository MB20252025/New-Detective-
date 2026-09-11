// ============================================================
//  MAIN ENTRY
// ============================================================

var game;

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('newGameBtn').addEventListener('click', startNewGame);
  document.getElementById('continueGameBtn').addEventListener('click', continueGame);
  document.getElementById('howToPlayBtn').addEventListener('click', function() {
    document.getElementById('howModal').style.display = 'flex';
  });
  document.getElementById('closeHowModal').addEventListener('click', function() {
    document.getElementById('howModal').style.display = 'none';
  });

  var saved = localStorage.getItem('whitbyConspiracySave');
  if (saved) {
    document.getElementById('continueGameBtn').style.display = 'inline-block';
  }
});

function startNewGame() {
  if (!game) {
    game = new GameManager();
    game.init(window.suspectsData, window.mainPuzzlesData, window.bonusPuzzlesData);
  } else {
    game.resetGame();
  }
  window.game = game;

  // Define puzzleSolved globally so the iframe can call it directly
  window.puzzleSolved = function() {
    if (game) {
      console.log('📥 puzzleSolved called directly');
      game.onTowerSolved();
    }
  };

  document.getElementById('startMenu').style.display = 'none';
  document.getElementById('gameWrapper').style.display = 'block';
  renderInitialTab();
  game.updateUI();

  // Listen for puzzle solved messages from iframe (postMessage)
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'PUZZLE_SOLVED') {
      if (game) {
        console.log('📥 Received puzzle solved message from iframe');
        game.onTowerSolved();
      }
    }
  }, false);
}

function continueGame() {
  var saved = localStorage.getItem('whitbyConspiracySave');
  if (!saved) {
    alert('No saved game found.');
    return;
  }
  try {
    var data = JSON.parse(saved);
    if (!game) {
      game = new GameManager();
      game.init(window.suspectsData, window.mainPuzzlesData, window.bonusPuzzlesData);
    }
    game.loadFromSave(data);
    window.game = game;

    // Define puzzleSolved globally
    window.puzzleSolved = function() {
      if (game) {
        console.log('📥 puzzleSolved called directly');
        game.onTowerSolved();
      }
    };

    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('gameWrapper').style.display = 'block';
    renderInitialTab();
    game.updateUI();

    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'PUZZLE_SOLVED') {
        if (game) {
          console.log('📥 Received puzzle solved message from iframe');
          game.onTowerSolved();
        }
      }
    }, false);
  } catch (e) {
    alert('Error loading saved game. Please start a new game.');
    console.error(e);
  }
}

// Close modal handlers
document.getElementById('closeModal').addEventListener('click', function() {
  document.getElementById('infoModal').style.display = 'none';
});
document.getElementById('closeConfirmModal').addEventListener('click', function() {
  document.getElementById('confirmModal').style.display = 'none';
});
window.addEventListener('click', function(e) {
  if (e.target === document.getElementById('infoModal')) {
    document.getElementById('infoModal').style.display = 'none';
  }
  if (e.target === document.getElementById('confirmModal')) {
    document.getElementById('confirmModal').style.display = 'none';
  }
});

// Accuse button
document.getElementById('accuseBtn').addEventListener('click', function() {
  if (game && game.cryptogramSolved && !game.caseClosed) {
    if (typeof showCryptogramModal === 'function') {
      showCryptogramModal(function(suspectId) {
        if (suspectId === 's3') {
          game.caseClosed = true;
          game.showPopup('🎉 You caught the mastermind! Case closed!');
        } else {
          game.showPopup('❌ Wrong suspect! Keep investigating.');
          game.prisonYears = Math.max(0, game.prisonYears - 5);
          game.updateUI();
        }
      });
    }
  } else {
    alert('You must decode the cryptogram first!');
  }
});