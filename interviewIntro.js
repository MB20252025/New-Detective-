// ============================================================
//  INTERVIEW INTRO MODAL – Cinematic introduction to interviews
// ============================================================
function showInterviewIntro(onComplete) {
  // Create the overlay
  var overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.92)';
  overlay.style.backdropFilter = 'blur(8px)';
  overlay.style.zIndex = '35000';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.fontFamily = "'Cinzel', serif";

  // Create the dialog box
  var dialog = document.createElement('div');
  dialog.style.background = 'linear-gradient(145deg, #1a2a3f, #0f1f2f)';
  dialog.style.border = '3px solid #b68b5c';
  dialog.style.borderRadius = '32px';
  dialog.style.padding = '40px 36px';
  dialog.style.maxWidth = '600px';
  dialog.style.width = '90%';
  dialog.style.maxHeight = '85vh';
  dialog.style.overflow = 'auto';
  dialog.style.boxShadow = '0 30px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,215,150,0.1)';
  dialog.style.position = 'relative';

  dialog.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="font-size: 2rem;">🚔</span>
      <span style="font-size: 1.2rem; color: #b68b5c; letter-spacing: 4px; display: block; margin-top: 4px;">INTERVIEW TRANSCRIPT</span>
      <div style="width: 60px; height: 2px; background: linear-gradient(90deg, transparent, #b68b5c, transparent); margin: 8px auto;"></div>
    </div>

    <div style="color: #eace9f; font-size: 1.1rem; line-height: 1.8; font-family: 'Courier Prime', monospace;">

      <p style="margin-bottom: 16px; color: #cdba92;">
        <span style="color: #eace9f; font-weight: bold;">Detective:</span> 
        "Good afternoon, Mr. Down. Thank you for coming in."
      </p>

      <p style="margin-bottom: 16px; color: #cdba92;">
        <span style="color: #eace9f; font-weight: bold;">Detective:</span> 
        "We've asked you here because we're investigating a number of linked robberies across several towns."
      </p>

      <p style="margin-bottom: 16px; color: #cdba92;">
        <span style="color: #eace9f; font-weight: bold;">Detective:</span> 
        "At this stage you're not under arrest. We're simply trying to establish the facts."
      </p>

      <p style="margin-bottom: 16px; color: #cdba92;">
        <span style="color: #eace9f; font-weight: bold;">Detective:</span> 
        "If you've seen anything unusual or can help with our enquiries, now would be a good time."
      </p>

      <p style="margin-bottom: 16px; color: #cdba92;">
        <span style="color: #eace9f; font-weight: bold;">Detective:</span> 
        "Let's begin."
      </p>

      <div style="border-top: 1px solid rgba(182, 139, 92, 0.2); margin-top: 20px; padding-top: 16px; text-align: center;">
        <button id="beginInterviewBtn" style="
          background: linear-gradient(145deg, #b68b5c, #8a6a3a);
          border: none;
          color: #0b1e2b;
          font-size: 1.2rem;
          font-weight: bold;
          padding: 14px 40px;
          border-radius: 60px;
          cursor: pointer;
          font-family: 'Cinzel', serif;
          letter-spacing: 2px;
          box-shadow: 0 5px 0 #5a3f20, 0 8px 20px rgba(0,0,0,0.3);
          transition: 0.08s linear;
          text-transform: uppercase;
        ">✔️ BEGIN INTERVIEW</button>
      </div>

      <div style="font-size: 0.7rem; color: #6a8a9a; text-align: center; margin-top: 16px; letter-spacing: 1px;">
        ⚓ This interview will be recorded for investigative purposes
      </div>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // Handle the "Begin Interview" button
  document.getElementById('beginInterviewBtn').addEventListener('click', function() {
    overlay.remove();
    if (onComplete) onComplete();
  });

  // Close by clicking outside – force them to click the button
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      // Don't close – force them to click the button
      // This ensures they see the intro
    }
  });

  return overlay;
}

// ============================================================
//  SECOND INTERVIEW PHASE – Confrontational interview intro
// ============================================================
function showSecondInterviewPhase(onComplete) {
  var overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.92)';
  overlay.style.backdropFilter = 'blur(8px)';
  overlay.style.zIndex = '35000';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.fontFamily = "'Cinzel', serif";

  var dialog = document.createElement('div');
  dialog.style.background = 'linear-gradient(145deg, #1a2a3f, #0f1f2f)';
  dialog.style.border = '3px solid #b68b5c';
  dialog.style.borderRadius = '32px';
  dialog.style.padding = '40px 36px';
  dialog.style.maxWidth = '600px';
  dialog.style.width = '90%';
  dialog.style.maxHeight = '85vh';
  dialog.style.overflow = 'auto';
  dialog.style.boxShadow = '0 30px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,215,150,0.1)';
  dialog.style.position = 'relative';

  dialog.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="font-size: 2rem;">🔍</span>
      <span style="font-size: 1.2rem; color: #b68b5c; letter-spacing: 4px; display: block; margin-top: 4px;">CASE UPDATE</span>
      <div style="width: 60px; height: 2px; background: linear-gradient(90deg, transparent, #b68b5c, transparent); margin: 8px auto;"></div>
    </div>

    <div style="color: #eace9f; font-size: 1.1rem; line-height: 1.8; font-family: 'Courier Prime', monospace;">

      <p style="margin-bottom: 16px; color: #cdba92; text-align: center; font-style: italic;">
        "The investigation is becoming increasingly frustrating."
      </p>

      <p style="margin-bottom: 16px; color: #cdba92; text-align: center; font-style: italic;">
        "Despite mounting evidence, none of the suspects are making obvious mistakes."
      </p>

      <p style="margin-bottom: 16px; color: #cdba92; text-align: center; font-weight: bold; font-size: 1.2rem;">
        "Perhaps it's time to apply a little pressure..."
      </p>

      <div style="border-top: 1px solid rgba(182, 139, 92, 0.2); margin-top: 20px; padding-top: 16px; text-align: center;">
        <button id="beginSecondInterviewBtn" style="
          background: linear-gradient(145deg, #b68b5c, #8a6a3a);
          border: none;
          color: #0b1e2b;
          font-size: 1.2rem;
          font-weight: bold;
          padding: 14px 40px;
          border-radius: 60px;
          cursor: pointer;
          font-family: 'Cinzel', serif;
          letter-spacing: 2px;
          box-shadow: 0 5px 0 #5a3f20, 0 8px 20px rgba(0,0,0,0.3);
          transition: 0.08s linear;
          text-transform: uppercase;
        ">✔️ BEGIN CONFRONTATION</button>
      </div>

      <div style="font-size: 0.7rem; color: #6a8a9a; text-align: center; margin-top: 16px; letter-spacing: 1px;">
        ⚓ This interview will be recorded for investigative purposes
      </div>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  document.getElementById('beginSecondInterviewBtn').addEventListener('click', function() {
    overlay.remove();
    if (onComplete) onComplete();
  });

  return overlay;
}