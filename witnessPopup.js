// ============================================================
//  WITNESS POPUP – Colchester Harbour Interview
//  (Full interview with questions)
// ============================================================
function showWitnessPopup(onComplete) {
  // ---- Witness data ----
  var witness = {
    name: "Witness (Colchester Harbour)",
    emoji: "🗣️",
    questions: [
      "What time did you find the torn paper?",
      "Was anyone else around when you found it?",
      "Could you describe the paper – any markings, symbols?",
      "Did you see any suspicious activity near the harbour that evening?",
      "The paper mentioned a 'key' – do you know what that might refer to?"
    ],
    responses: [
      "I found it around 2:30 PM, just after my lunch break.",
      "No, the quayside was quiet. Just a few seagulls.",
      "It was damp, looked like it had been in the water. There was a faint symbol – like a compass rose.",
      "I did notice a small rowboat tied up where it shouldn't have been, but I didn't see anyone.",
      "No, but there's an old lock on the harbour master's office – might be connected."
    ]
  };
  var askedQuestions = [];
  var modalDiv = null;
  var container = null;
  var listDiv = null;

  // ---- Helper: create the question list ----
  function showQuestionList() {
    // Remove the current content (the intro) and show questions
    container.innerHTML = ''; // clear container
    listDiv = document.createElement('div');
    listDiv.style.width = '100%';
    listDiv.style.maxHeight = '70vh';
    listDiv.style.overflowY = 'auto';

    var header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.borderBottom = '2px solid #b68b5c';
    header.style.paddingBottom = '10px';
    header.style.marginBottom = '15px';
    header.innerHTML = `<div style="font-size:1.5rem; font-weight:bold; color:#eace9f;">🗣️ Witness Questions</div>`;
    listDiv.appendChild(header);

    var allAsked = askedQuestions.length === witness.questions.length;
    if (allAsked) {
      var doneMsg = document.createElement('div');
      doneMsg.style.textAlign = 'center';
      doneMsg.style.color = '#6bff6b';
      doneMsg.style.padding = '20px';
      doneMsg.innerHTML = '✅ All questions asked.';
      listDiv.appendChild(doneMsg);
      container.appendChild(listDiv);
      return;
    }

    for (var i = 0; i < witness.questions.length; i++) {
      if (askedQuestions.indexOf(i) !== -1) continue;
      var qDiv = document.createElement('div');
      qDiv.style.background = 'rgba(255,255,255,0.05)';
      qDiv.style.border = '1px solid #b68b5c';
      qDiv.style.borderRadius = '12px';
      qDiv.style.padding = '12px 16px';
      qDiv.style.marginBottom = '12px';

      var qText = document.createElement('div');
      qText.style.fontWeight = 'bold';
      qText.style.color = '#f0e6d2';
      qText.textContent = '❓ ' + witness.questions[i];
      qDiv.appendChild(qText);

      var askBtn = document.createElement('button');
      askBtn.textContent = 'Ask Question';
      askBtn.style.background = '#2e7d32';
      askBtn.style.border = 'none';
      askBtn.style.color = 'white';
      askBtn.style.padding = '4px 14px';
      askBtn.style.borderRadius = '20px';
      askBtn.style.cursor = 'pointer';
      askBtn.style.fontSize = '0.8rem';
      askBtn.style.marginTop = '8px';
      askBtn.style.boxShadow = '0 2px 0 #1a4a1a';
      askBtn.addEventListener('click', (function(idx) {
        return function() {
          if (askedQuestions.indexOf(idx) !== -1) return;
          askedQuestions.push(idx);
          // Show the answer
          var ansDiv = document.createElement('div');
          ansDiv.style.marginTop = '8px';
          ansDiv.style.padding = '8px 12px';
          ansDiv.style.background = '#3a6a5a';
          ansDiv.style.borderRadius = '8px';
          ansDiv.style.borderLeft = '4px solid #f5b642';
          ansDiv.innerHTML = '<strong style="color:#eace9f;">💬 Witness:</strong> ' + witness.responses[idx];
          qDiv.appendChild(ansDiv);
          askBtn.disabled = true;
          askBtn.style.opacity = '0.5';
          askBtn.style.cursor = 'default';

          // Check if all questions are asked
          if (askedQuestions.length === witness.questions.length) {
            var finishMsg = document.createElement('div');
            finishMsg.style.textAlign = 'center';
            finishMsg.style.color = '#6bff6b';
            finishMsg.style.padding = '12px';
            finishMsg.innerHTML = '✅ You\'ve asked all the questions.';
            listDiv.appendChild(finishMsg);
          }
        };
      })(i));
      qDiv.appendChild(askBtn);

      // If answer already shown (due to being asked earlier), show it
      if (askedQuestions.indexOf(i) !== -1) {
        // This shouldn't happen because we skip asked questions, but just in case
      }

      listDiv.appendChild(qDiv);
    }

    // Add a "Close" button at the bottom
    var closeBtn = document.createElement('button');
    closeBtn.textContent = '✖ Close Interview';
    closeBtn.style.background = '#a13d3d';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.padding = '8px 20px';
    closeBtn.style.borderRadius = '20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.marginTop = '15px';
    closeBtn.style.display = 'block';
    closeBtn.style.marginLeft = 'auto';
    closeBtn.style.marginRight = 'auto';
    closeBtn.addEventListener('click', function() {
      if (modalDiv) modalDiv.remove();
      if (typeof onComplete === 'function') onComplete();
    });
    listDiv.appendChild(closeBtn);

    container.appendChild(listDiv);
  }

  // ---- Create modal with initial introduction ----
  modalDiv = document.createElement('div');
  modalDiv.style.position = 'fixed';
  modalDiv.style.top = '0';
  modalDiv.style.left = '0';
  modalDiv.style.width = '100%';
  modalDiv.style.height = '100%';
  modalDiv.style.backgroundColor = 'rgba(0,0,0,0.92)';
  modalDiv.style.zIndex = '10002';
  modalDiv.style.display = 'flex';
  modalDiv.style.alignItems = 'center';
  modalDiv.style.justifyContent = 'center';
  modalDiv.style.padding = '20px';
  modalDiv.style.backdropFilter = 'blur(6px)';

  container = document.createElement('div');
  container.style.backgroundColor = '#1a2a1f';
  container.style.border = '3px solid #b68b5c';
  container.style.borderRadius = '28px';
  container.style.maxWidth = '600px';
  container.style.width = '100%';
  container.style.maxHeight = '90vh';
  container.style.overflow = 'auto';
  container.style.padding = '30px';
  container.style.boxShadow = '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(182,139,92,0.1)';
  container.style.position = 'relative';
  container.style.color = '#f0e6d2';
  container.style.fontFamily = "'Courier New', monospace";

  // Intro content
  container.innerHTML = `
    <div style="text-align:center; border-bottom:2px solid #b68b5c; padding-bottom:15px; margin-bottom:20px;">
      <div style="font-size:1.8rem; font-weight:bold; color:#eace9f;">🗣️ WITNESS INTERVIEW</div>
      <div style="font-size:0.9rem; color:#cdba92;">Colchester Harbour · 14:30 hrs</div>
    </div>
    <div style="line-height:1.8; font-size:1rem;">
      <p><strong style="color:#eace9f;">Detective:</strong> "Good evening. I'm Detective Inspector Mercer from Lincolnshire Police. I understand you found something near the harbour?"</p>
      <p><strong style="color:#eace9f;">Witness:</strong> "Yes, I did. I was walking my dog along the quayside and spotted something caught in the mooring ropes. It looked like a torn piece of paper."</p>
      <p><strong style="color:#eace9f;">Detective:</strong> "I'd like to ask you a few questions about what you saw. Could you tell me..."</p>
    </div>
    <div style="text-align:center; margin-top:25px;">
      <button id="witnessAskBtn" style="background:#2e7d32; border:none; color:white; padding:12px 40px; border-radius:50px; font-size:1.2rem; font-weight:bold; cursor:pointer; font-family:inherit; box-shadow:0 4px 0 #1a4a1a; transition:0.08s linear;">
        📝 ASK QUESTIONS
      </button>
    </div>
  `;

  modalDiv.appendChild(container);
  document.body.appendChild(modalDiv);

  // ---- ASK QUESTIONS button handler ----
  document.getElementById('witnessAskBtn').addEventListener('click', function() {
    // Remove the intro content and show the question list
    showQuestionList();
  });

  // Click outside to close
  modalDiv.addEventListener('click', function(e) {
    if (e.target === modalDiv) {
      modalDiv.remove();
      if (typeof onComplete === 'function') onComplete();
    }
  });
}