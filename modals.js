// ============================================================
//  GENERIC MODAL HELPERS – showModal, createFullScreenConfirm
// ============================================================

// ========== SHOW MODAL (for folder contents, interview results, etc.) ==========
function showModal(title, contentHtml) {
  const modal = document.getElementById("infoModal");
  document.getElementById("modal-title").innerText = title;
  document.getElementById("modal-info").innerHTML = contentHtml;
  modal.style.display = "flex";
}

// ========== FULL SCREEN CONFIRMATION (for opening bonus puzzles) ==========
function createFullScreenConfirm(title, message, onConfirm) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.95)';
  overlay.style.backdropFilter = 'blur(8px)';
  overlay.style.zIndex = '40000';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';  // ✅ FIXED: was "justifyCenter"
  overlay.style.fontFamily = "'Cinzel', serif";

  const card = document.createElement('div');
  card.style.background = 'linear-gradient(145deg, #1e3d4a, #0f2a3f)';
  card.style.border = '4px solid #eace9f';
  card.style.borderRadius = '48px';
  card.style.padding = '40px 32px';
  card.style.maxWidth = '500px';
  card.style.width = '90%';
  card.style.textAlign = 'center';
  card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.6)';

  card.innerHTML = `
    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #eace9f; margin-bottom: 16px;"></i>
    <h2 style="color: #eace9f; font-size: 2rem; margin-bottom: 16px;">${title}</h2>
    <p style="color: #f5e7c8; font-size: 1.2rem; margin-bottom: 32px;">${message}</p>
    <div style="display: flex; gap: 20px; justify-content: center;">
      <button id="confirmYes" style="background: #b68b5c; border: none; color: #0b1e2b; font-size: 1.2rem; font-weight: bold; padding: 12px 28px; border-radius: 60px; cursor: pointer;">✔️ YES, CONTINUE</button>
      <button id="confirmNo" style="background: #5a3f2a; border: none; color: #f0e6d2; font-size: 1.2rem; font-weight: bold; padding: 12px 28px; border-radius: 60px; cursor: pointer;">❌ CANCEL</button>
    </div>
  `;

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  document.getElementById('confirmYes').onclick = () => {
    overlay.remove();
    if (onConfirm) onConfirm();
  };
  document.getElementById('confirmNo').onclick = () => {
    overlay.remove();
  };
}