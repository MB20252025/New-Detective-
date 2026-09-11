// ============================================================
//  VAULT PUZZLE – Security Pattern + Lockbox + Evidence
// ============================================================
function showVaultPuzzleModal(onSolve) {
  const modalDiv = document.createElement('div');
  modalDiv.style.position = 'fixed';
  modalDiv.style.top = '0';
  modalDiv.style.left = '0';
  modalDiv.style.width = '100%';
  modalDiv.style.height = '100%';
  modalDiv.style.background = '#111418';
  modalDiv.style.zIndex = '3000';
  modalDiv.style.overflow = 'auto';
  modalDiv.style.display = 'flex';
  modalDiv.style.alignItems = 'center';
  modalDiv.style.justifyContent = 'center';

  const vaultHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>VAULT · DETECTIVE PUZZLE</title>
  <style>
    /* ========== GLOBAL STYLES ========== */
    * {
      box-sizing: border-box;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      background: #111418;
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', 'Arial', system-ui, sans-serif;
      padding: 8px;
      overflow: hidden;
    }

    /* ========== SCENE CONTAINER ========== */
    .scene-container {
      position: relative;
      width: 100%;
      max-width: 500px;
      height: 90vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .scene {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transition: opacity 0.4s ease, transform 0.4s ease;
      opacity: 0;
      transform: scale(0.96);
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .scene.active {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }

    /* ========== VAULT DOOR STYLES (Scene 1 & 3) ========== */
    .vault-room {
      background: #1e262e;
      border-radius: 40px 40px 20px 20px;
      padding: 20px;
      box-shadow: 0 20px 35px rgba(0,0,0,0.8), inset 0 0 0 2px #576675;
      width: 100%;
      max-width: 450px;
    }

    .vault-door {
      position: relative;
      width: 100%;
      aspect-ratio: 3 / 4;
      background: #2c3a47;
      border-radius: 50px 50px 30px 30px;
      box-shadow: inset 0 -10px 0 #1a242f, 0 20px 30px black;
      border: 6px solid #3f5162;
      overflow: hidden;
      transition: transform 1s ease-in-out;
      transform-style: preserve-3d;
      perspective: 1000px;
      cursor: pointer;
    }

    .door-plate {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 30% 40%, #3f5366, #1f2d3a);
      border-radius: inherit;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 0;
      transform-origin: left center;
      transition: transform 1.2s ease-in-out;
    }

    .vault-door.open .door-plate {
      transform: rotateY(15deg) translateX(-15px);
      box-shadow: -20px 10px 30px rgba(0,0,0,0.7);
    }

    /* ===== SHIP'S WHEEL (no handles) ===== */
    .wheel {
      position: relative;
      width: min(45%, 180px);
      aspect-ratio: 1 / 1;
      cursor: pointer;
      transition: transform 0.2s;
      margin: 0 auto;
    }

    .wheel:active {
      transform: scale(0.95);
    }

    .wheel-outer {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #5d4037;
      box-shadow: 0 0 0 8px #4a362e, 0 15px 25px black, inset 0 -8px 8px #2b1f1a;
    }

    .wheel-outer::before {
      content: '';
      position: absolute;
      top: 8px;
      left: 8px;
      right: 8px;
      bottom: 8px;
      border-radius: 50%;
      background: #7b5e4b;
      box-shadow: inset 0 2px 5px #aa8b72, inset 0 -2px 5px #3b2c22;
    }

    .wheel-spoke {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8%;
      height: 80%;
      background: #8b6b51;
      transform: translate(-50%, -50%) rotate(0deg);
      border-radius: 20px;
      box-shadow: 0 0 5px black;
      z-index: 2;
    }

    .wheel-spoke:nth-child(2) { transform: translate(-50%, -50%) rotate(30deg); }
    .wheel-spoke:nth-child(3) { transform: translate(-50%, -50%) rotate(60deg); }
    .wheel-spoke:nth-child(4) { transform: translate(-50%, -50%) rotate(90deg); }
    .wheel-spoke:nth-child(5) { transform: translate(-50%, -50%) rotate(120deg); }
    .wheel-spoke:nth-child(6) { transform: translate(-50%, -50%) rotate(150deg); }

    .wheel-hub {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 25%;
      height: 25%;
      background: #c29a6b;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: inset 0 -3px 0 #7b5e3e, 0 0 0 4px #4a362e;
      z-index: 3;
    }

    .wheel.shake {
      animation: shake 0.3s ease-in-out;
    }

    @keyframes shake {
      0% { transform: rotate(0deg); }
      20% { transform: rotate(5deg); }
      40% { transform: rotate(-5deg); }
      60% { transform: rotate(3deg); }
      80% { transform: rotate(-3deg); }
      100% { transform: rotate(0deg); }
    }

    .wheel.rotate {
      animation: rotateWheel 1.5s ease-in-out forwards;
    }

    @keyframes rotateWheel {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* bolts */
    .bolts {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .bolt-horizontal {
      position: absolute;
      width: 18%;
      height: 4%;
      background: linear-gradient(to right, #3b4c5c, #61788b);
      border-radius: 20px;
      box-shadow: inset 0 -3px 0 #1f2a33, 0 5px 8px black;
      border: 1px solid #7f95a8;
      transition: transform 0.8s cubic-bezier(0.2, 0.9, 0.3, 1.1);
    }

    .bolt-horizontal.left {
      left: -5%;
      top: 25%;
      transform: translateX(0);
    }

    .bolt-horizontal.right {
      right: -5%;
      top: 50%;
      transform: translateX(0);
    }

    .bolt-horizontal.top {
      top: 8%;
      left: 50%;
      transform: translateX(-50%) rotate(90deg);
      width: 14%;
    }

    .bolt-horizontal.bottom {
      bottom: 8%;
      left: 50%;
      transform: translateX(-50%) rotate(90deg);
      width: 14%;
    }

    .vault-door.unlocked .bolt-horizontal.left {
      transform: translateX(-80%);
    }
    .vault-door.unlocked .bolt-horizontal.right {
      transform: translateX(80%);
    }
    .vault-door.unlocked .bolt-horizontal.top {
      transform: translateX(-50%) rotate(90deg) translateY(-80%);
    }
    .vault-door.unlocked .bolt-horizontal.bottom {
      transform: translateX(-50%) rotate(90deg) translateY(80%);
    }

    /* ===== BINARY KEYPAD (1s and 0s only) ===== */
    .calculator-keypad {
      position: absolute;
      bottom: 6%;
      right: 10%;
      width: 20%;
      max-width: 100px;
      background: #2a3a48;
      border-radius: 16px;
      box-shadow: 0 5px 0 #0b1219;
      padding: 10px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5px;
      cursor: pointer;
      transition: all 0.1s;
      z-index: 10;
    }

    .calculator-keypad:active {
      transform: translateY(3px);
      box-shadow: 0 2px 0 #0b1219;
    }

    .calc-button {
      aspect-ratio: 1 / 1;
      background: #1f2b35;
      border-radius: 8px;
      box-shadow: inset 0 -2px 0 #0f171f, 0 1px 3px black;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #d0e4ff;
      font-size: 1rem;
      font-weight: bold;
      text-shadow: 0 1px 0 black;
      border: 1px solid #5a768f;
      font-family: 'Courier New', monospace;
    }

    .calc-button.enter {
      grid-column: span 2;
      aspect-ratio: 2 / 1;
      background: #3d5a73;
      font-family: 'Segoe UI', 'Arial', sans-serif;
    }

    /* ===== LED WITH PULSING GLOW ANIMATIONS ===== */
    .vault-led {
      position: absolute;
      top: 8%;
      left: 8%;
      width: 10%;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      background: #330000;
      box-shadow: 0 0 0 4px #1f2c36;
      transition: background 0.3s;
    }

    .vault-led.red {
      background: #ff3333;
      animation: pulseRed 1.5s infinite ease-in-out;
    }

    .vault-led.green {
      background: #33cc66;
      animation: pulseGreen 1.5s infinite ease-in-out;
    }

    @keyframes pulseRed {
      0% { box-shadow: 0 0 5px #ff3333, 0 0 10px #ff3333, 0 0 15px #ff3333, 0 0 0 4px #1f2c36; }
      50% { box-shadow: 0 0 15px #ff6666, 0 0 30px #ff3333, 0 0 45px #ff0000, 0 0 0 4px #1f2c36; }
      100% { box-shadow: 0 0 5px #ff3333, 0 0 10px #ff3333, 0 0 15px #ff3333, 0 0 0 4px #1f2c36; }
    }

    @keyframes pulseGreen {
      0% { box-shadow: 0 0 5px #33cc66, 0 0 10px #33cc66, 0 0 15px #33cc66, 0 0 0 4px #1f2c36; }
      50% { box-shadow: 0 0 15px #66ff99, 0 0 30px #33cc66, 0 0 45px #00ff88, 0 0 0 4px #1f2c36; }
      100% { box-shadow: 0 0 5px #33cc66, 0 0 10px #33cc66, 0 0 15px #33cc66, 0 0 0 4px #1f2c36; }
    }

    .vault-message {
      margin-top: 15px;
      font-size: 1.5rem;
      color: #b0cde0;
      text-align: center;
      min-height: 3rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-shadow: 0 2px 0 black;
    }

    /* ========== PUZZLE SCENE (Scene 2) – fully visible ========== */
    .puzzle-scene {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5px 0;
      overflow: auto;
    }

    .security-panel {
      transform: scale(0.9);
      transform-origin: top center;
      margin: 0;
      padding: 20px 15px 10px;
      max-width: 600px;
      background: #1e262e;
      background-image: radial-gradient(circle at 30% 20%, #3a4552 1px, transparent 1px), radial-gradient(circle at 70% 80%, #3a4552 1px, transparent 1px);
      background-size: 30px 30px;
      border-radius: 50px 50px 45px 45px;
      box-shadow: 0 20px 35px rgba(0,0,0,0.8), inset 0 0 0 2px #576675, inset 0 0 15px #0a0e12;
      padding: 30px 25px 20px;
      max-width: 680px;
      width: fit-content;
      margin: 0 auto;
      position: relative;
      border: 1px solid #2f3b45;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .security-panel::before, .security-panel::after { content: ''; position: absolute; width: 12px; height: 12px; background: #6f7f8e; border-radius: 50%; top: 18px; box-shadow: 0 0 0 2px #3a4555, 0 0 0 3px #1e2a33; z-index: 5; }
    .security-panel::before { left: 25px; }
    .security-panel::after { right: 25px; }
    .screw-bottom-left, .screw-bottom-right { position: absolute; width: 10px; height: 10px; background: #6f7f8e; border-radius: 50%; bottom: 20px; box-shadow: 0 0 0 2px #3a4555, 0 0 0 3px #1e2a33; z-index: 5; }
    .screw-bottom-left { left: 30px; }
    .screw-bottom-right { right: 30px; }
    .warning-strip { background: #332b1e; color: #ffb86b; font-size: 0.8rem; letter-spacing: 2px; text-align: center; padding: 6px 12px; border-radius: 30px; display: inline-block; margin: 0 auto 15px; border-left: 3px solid #b8860b; border-right: 3px solid #b8860b; box-shadow: inset 0 0 6px #0a0a0a; font-weight: 600; }
    .header-title { color: #bdc9db; font-size: 1.4rem; font-weight: 300; letter-spacing: 5px; text-transform: uppercase; text-shadow: 0 2px 0 #0c0f13; margin: 5px 0 0 0; text-align: center; }
    .input-label { color: #8e9fb1; font-size: 0.9rem; letter-spacing: 2px; margin: 15px 0 5px 0; border-bottom: 1px solid #374857; display: inline-block; padding-bottom: 4px; }
    .display-screen { background: #19232c; border-radius: 30px; padding: 25px 15px 20px; box-shadow: inset 0 0 20px #070b0f, 0 0 0 2px #3f5364, 0 0 0 5px #1e2b35; margin: 15px 0 5px; position: relative; width: fit-content; }
    .scan-container { position: relative; overflow: hidden; border-radius: 22px; }
    .scan-line { position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, transparent, #b0f0ff, #5dc9e2, transparent); opacity: 0; pointer-events: none; z-index: 10; box-shadow: 0 0 12px #00ccff; }
    @keyframes scan { 0% { top: 0; opacity: 0.8; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
    .scan-active .scan-line { animation: scan 1.2s ease-out forwards; }
    .grid { display: grid; grid-template-columns: repeat(6, 60px); gap: 6px; justify-content: center; margin: 0 auto; width: fit-content; background: #0d1a24; padding: 14px; border-radius: 28px; box-shadow: inset 0 0 10px #010101, 0 6px 0 #0f171f; }
    .tile { width: 60px; height: 60px; background: #1e2c3a; border-radius: 16px; box-shadow: inset 0 -3px 0 #0f181f, 0 2px 5px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; font-size: 38px; font-weight: 600; color: #c8e0f0; cursor: pointer; transition: all 0.08s; border: 1px solid #3a5065; text-shadow: 0 2px 3px black; font-family: 'Courier New', monospace; }
    .tile.locked { background: #263845; color: #6b869f; border-color: #475f74; box-shadow: inset 0 -2px 0 #17232b, 0 1px 3px rgba(0,0,0,0.7); cursor: not-allowed; filter: brightness(0.85); }
    .tile:active:not(.locked) { background: #2f4153; transform: scale(0.94); box-shadow: inset 0 0 10px #0a1118; }
    .fade-in { animation: tileFade 0.5s ease-in-out; }
    @keyframes tileFade { 0% { opacity: 0.3; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
    .action-button { background: #2a3948; border: none; color: #e5efff; font-size: 1.3rem; font-weight: 600; padding: 14px 30px; border-radius: 50px; cursor: pointer; box-shadow: 0 8px 0 #10171f, 0 5px 15px black; transition: 0.07s linear; border: 1px solid #4d6479; letter-spacing: 3px; text-transform: uppercase; margin: 10px 0 5px; min-width: 220px; }
    .action-button:active { transform: translateY(6px); box-shadow: 0 2px 0 #10171f, 0 5px 12px black; }
    .action-button:disabled { opacity: 0.6; transform: translateY(4px); box-shadow: 0 4px 0 #10171f; cursor: not-allowed; }
    .message-area { min-height: 50px; font-size: 1.8rem; font-weight: 500; text-align: center; margin: 5px 0 0; padding: 5px; }
    .granted { color: #87f5b2; text-shadow: 0 0 10px #00cc66; animation: unlockPulse 0.8s; }
    .denied { color: #ff8a8a; text-shadow: 0 0 10px #cc3333; }
    .analyzing-text { color: #f5e56b; text-shadow: 0 0 6px #ffd966; font-size: 1.6rem; }
    .led-strip { display: flex; gap: 6px; justify-content: center; margin: 8px 0 0; }
    .led { width: 12px; height: 12px; background: #2b3a44; border-radius: 50%; box-shadow: inset 0 0 4px black; }
    .led.active { background: #44dd88; box-shadow: 0 0 12px #22ee88; }
    @keyframes unlockPulse { 0% { transform: scale(1); } 50% { transform: scale(1.07); text-shadow: 0 0 25px #33ee88; } }
    .compartment-section { display: flex; flex-direction: column; align-items: center; margin-top: 5px; width: 100%; }
    .solution-label { color: #a5d6ff; font-size: 1rem; font-family: 'Courier New', monospace; letter-spacing: 3px; text-transform: uppercase; text-shadow: 0 0 8px #2277cc, 0 0 2px white; background: rgba(10, 20, 30, 0.7); padding: 5px 15px; border-radius: 20px; border: 1px solid #3b6885; backdrop-filter: blur(2px); box-shadow: 0 0 12px #1a4d73; margin-bottom: 8px; }
    .compartment { width: 140px; height: 130px; background: #1f2c36; border-radius: 16px; box-shadow: inset 0 0 8px #0a0f14, 0 2px 0 #101a22; border: 1px solid #384c5c; position: relative; }
    .compartment-cover { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #273846; border-radius: 14px; box-shadow: inset 0 -3px 0 #151f2a, 0 2px 6px black; display: flex; flex-wrap: wrap; padding: 15px; gap: 15px; transition: opacity 0.3s; z-index: 25; }
    .compartment-cover.hidden { opacity: 0; pointer-events: none; }
    .screw { position: relative; width: 24px; height: 24px; background: #7b8b9c; border-radius: 50%; box-shadow: 0 0 0 2px #2f3f4f, 0 0 0 4px #1f2a33; cursor: pointer; transition: all 0.1s; }
    .screw::after { content: ''; position: absolute; top: 50%; left: 15%; width: 70%; height: 3px; background: #1a1e26; transform: translateY(-50%); border-radius: 2px; box-shadow: inset 0 1px 2px black; }
    .screw.step1 { background: #6a7a8b; transform: rotate(10deg) scale(0.95); }
    .screw.step2 { background: #596977; transform: rotate(20deg) scale(0.9); opacity: 0.8; }
    .screw.removed { background: #3a4958; box-shadow: 0 0 0 2px #1b2632, 0 0 0 4px #131d26; transform: scale(0.6) rotate(45deg); opacity: 0.3; pointer-events: none; }
    .screw.removed::after { opacity: 0.3; }
    .screw:nth-child(1) { align-self: flex-start; }
    .screw:nth-child(2) { align-self: flex-start; margin-left: auto; }
    .screw:nth-child(3) { align-self: flex-end; }
    .screw:nth-child(4) { align-self: flex-end; margin-left: auto; }
    .wires { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 25px; opacity: 0; pointer-events: none; transition: opacity 0.3s; z-index: 30; }
    .wires.visible { opacity: 1; pointer-events: all; }
    .wire { width: 100px; height: 16px; border-radius: 20px; cursor: pointer; transition: 0.1s; box-shadow: 0 2px 4px black; position: relative; background: #44dd88; }
    .wire.green { background: #44dd88; border: 1px solid #88ffaa; }
    .wire.red { background: #dd4444; border: 1px solid #ff8888; }
    .bolt { position: absolute; top: 50%; transform: translateY(-50%); width: 12px; height: 12px; background: radial-gradient(circle at 30% 30%, #c0cbd8, #5a6c7e); border-radius: 50%; box-shadow: 0 0 0 1px #2a3848, 0 2px 3px black; z-index: 2; }
    .bolt.left { left: -6px; }
    .bolt.right { right: -6px; }
    .wire.cut { background: #44dd88; }
    .wire.cut::after { content: ''; position: absolute; top: 5%; left: 50%; width: 3px; height: 90%; background: #111; transform: translateX(-50%); box-shadow: 0 0 5px black; z-index: 1; }
    .spark { position: absolute; width: 24px; height: 24px; background: radial-gradient(circle, #ffaa44, #ff5500); border-radius: 50%; pointer-events: none; opacity: 0; }
    .spark.active { animation: spark 0.3s; }
    @keyframes spark { 0% { opacity: 1; transform: scale(0.5); } 100% { opacity: 0; transform: scale(1.8); } }
    @media (max-width: 600px) { .grid { grid-template-columns: repeat(6, 50px); gap: 5px; padding: 12px; } .tile { width: 50px; height: 50px; font-size: 30px; } .compartment { width: 120px; height: 110px; } .wire { width: 80px; height: 14px; } .message-area { font-size: 1.5rem; } }
  </style>
</head>
<body>
  <div class="scene-container">
    <!-- SCENE 1: VAULT (LOCKED) -->
    <div class="scene vault" id="sceneVault">
      <div class="vault-room">
        <div class="vault-door" id="vaultDoor">
          <div class="door-plate">
            <div class="vault-led red" id="vaultLed"></div>
            <div class="wheel" id="wheel">
              <div class="wheel-outer"></div>
              <div class="wheel-spoke"></div>
              <div class="wheel-spoke"></div>
              <div class="wheel-spoke"></div>
              <div class="wheel-spoke"></div>
              <div class="wheel-spoke"></div>
              <div class="wheel-spoke"></div>
              <div class="wheel-hub"></div>
            </div>
            <div class="calculator-keypad" id="keypadPanel">
              <div class="calc-button">1</div>
              <div class="calc-button">0</div>
              <div class="calc-button">1</div>
              <div class="calc-button">0</div>
              <div class="calc-button">1</div>
              <div class="calc-button">0</div>
              <div class="calc-button">1</div>
              <div class="calc-button">0</div>
              <div class="calc-button">1</div>
              <div class="calc-button">0</div>
              <div class="calc-button enter">⏎</div>
            </div>
          </div>
          <div class="bolts">
            <div class="bolt-horizontal left"></div>
            <div class="bolt-horizontal right"></div>
            <div class="bolt-horizontal top"></div>
            <div class="bolt-horizontal bottom"></div>
          </div>
        </div>
        <div class="vault-message" id="vaultMessage">🔴 VAULT LOCKED</div>
      </div>
    </div>

    <!-- SCENE 2: PUZZLE -->
    <div class="scene puzzle" id="scenePuzzle">
      <div class="back-button" id="backToVaultFromPuzzle">← VAULT</div>
      <div class="puzzle-scene">
        <div class="security-panel">
          <div class="screw-bottom-left"></div>
          <div class="screw-bottom-right"></div>
          <div class="warning-strip">⚠ SECURE ACCESS ⚠</div>
          <div class="header-title">SECURITY PATTERN VERIFICATION</div>
          <div class="input-label">▌ INPUT GRID ▌</div>
          <div class="display-screen">
            <div class="scan-container" id="scanContainer">
              <div class="scan-line" id="scanLine"></div>
              <div id="puzzleGrid" class="grid"></div>
            </div>
            <div class="led-strip">
              <span class="led"></span><span class="led"></span><span class="led"></span><span class="led"></span>
            </div>
          </div>
          <button class="action-button" id="checkBtn">🔒 VERIFY</button>
          <div id="message" class="message-area"></div>
          <div class="compartment-section">
            <div class="solution-label">⚡ SOLUTION ⚡</div>
            <div class="compartment">
              <div class="compartment-cover" id="compartmentCover">
                <div class="screw" data-index="0"></div>
                <div class="screw" data-index="1"></div>
                <div class="screw" data-index="2"></div>
                <div class="screw" data-index="3"></div>
              </div>
              <div class="wires" id="wires">
                <div class="wire green" id="greenWire">
                  <span class="bolt left"></span>
                  <span class="bolt right"></span>
                </div>
                <div class="wire red" id="redWire">
                  <span class="bolt left"></span>
                  <span class="bolt right"></span>
                </div>
                <div class="spark" id="spark"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SCENE 4: BIRD'S-EYE VIEW TABLETOP -->
    <div class="scene interior" id="sceneInterior">
      <div class="back-button" id="backToVaultFromInterior">← DOOR</div>
      <div class="tabletop-scene">
        <div class="table-top"></div>
        <div class="gold-bars-table">
          <div class="gold-bar-table"></div><div class="gold-bar-table"></div><div class="gold-bar-table"></div><div class="gold-bar-table"></div><div class="gold-bar-table"></div>
          <div class="gold-bar-table"></div><div class="gold-bar-table"></div><div class="gold-bar-table"></div><div class="gold-bar-table"></div><div class="gold-bar-table"></div>
          <div class="gold-bar-table"></div><div class="gold-bar-table"></div><div class="gold-bar-table"></div><div class="gold-bar-table"></div><div class="gold-bar-table"></div>
        </div>
        <div class="diamonds-table">
          <div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div><div class="diamond-table red"></div><div class="diamond-table blue"></div>
        </div>
        <div class="coins-area">
          <div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div><div class="coin gold"></div><div class="coin silver"></div>
        </div>
        <div class="lockbox-table" id="lockbox">
          <div class="lockbox-lid-table"></div>
          <div class="lockbox-front-table">
            <div class="dial-table" data-dial="0" id="dial1">0</div>
            <div class="dial-table" data-dial="1" id="dial2">0</div>
            <div class="dial-table" data-dial="2" id="dial3">0</div>
          </div>
          <div class="dial-symbol symbol-star"></div>
          <div class="dial-symbol symbol-triangle"></div>
          <div class="dial-symbol symbol-circle"></div>
          <div class="lockbox-glow-table"></div>
        </div>
        <div class="evidence-message-table" id="evidenceMessage">
          <div class="evidence-icons"><span>🧬</span><span>🖐️</span><span>📷</span></div>
          FORENSIC MATCH FOUND
          <span style="font-size: 1rem; display: block; margin-top: 10px;">DNA · FINGERPRINTS · PHOTO</span>
          <span style="font-size: 0.9rem; display: block; margin-top: 15px; text-transform: none;">EVIDENCE LINKS SUSPECT TO CRIME</span>
        </div>
      </div>
    </div>
  </div>

  <!-- ORIGINAL PUZZLE SCRIPT (unchanged) -->
  <script>
    (function() {
      const SIZE = 6;
      const EMPTY = -1;
      const CIRCLE = 0;
      const TRIANGLE = 1;

      const cluePattern = [
        "0.....",
        "......",
        "1.....",
        ".0..0.",
        "1..0..",
        ".0...0"
      ];
      const solutionPattern = [
        "001011",
        "010011",
        "110100",
        "001101",
        "110010",
        "101100"
      ];

      function patternToGrid(pattern) {
        const grid = Array(SIZE).fill().map(() => Array(SIZE).fill(EMPTY));
        for (let r = 0; r < SIZE; r++) {
          const rowStr = pattern[r];
          for (let c = 0; c < SIZE; c++) {
            const ch = rowStr[c];
            if (ch === '0') grid[r][c] = CIRCLE;
            else if (ch === '1') grid[r][c] = TRIANGLE;
          }
        }
        return grid;
      }

      const clueGrid = patternToGrid(cluePattern);
      const solutionGrid = patternToGrid(solutionPattern);

      const lockedGrid = Array(SIZE).fill().map((_, r) =>
        Array(SIZE).fill().map((_, c) => clueGrid[r][c] !== EMPTY)
      );

      let currentGrid = clueGrid.map(row => [...row]);

      const gridContainer = document.getElementById('puzzleGrid');
      const messageDiv = document.getElementById('message');
      const checkBtn = document.getElementById('checkBtn');
      const scanContainer = document.getElementById('scanContainer');
      const compartmentCover = document.getElementById('compartmentCover');
      const screws = document.querySelectorAll('.screw');
      const wiresDiv = document.getElementById('wires');
      const greenWire = document.getElementById('greenWire');
      const redWire = document.getElementById('redWire');
      const spark = document.getElementById('spark');

      let screwClicks = [0, 0, 0, 0];
      let audioCtx = null;
      function playSound(type) {
        if (!audioCtx) {
          try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          } catch (e) { return; }
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        if (type === 'screw') {
          osc.frequency.value = 300;
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
        } else if (type === 'cut') {
          osc.frequency.value = 200;
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
        } else if (type === 'spark') {
          osc.frequency.value = 800;
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        }
      }

      function renderGrid(applyFade = false) {
        gridContainer.innerHTML = '';
        for (let r = 0; r < SIZE; r++) {
          for (let c = 0; c < SIZE; c++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            if (lockedGrid[r][c]) tile.classList.add('locked');
            if (applyFade) tile.classList.add('fade-in');
            tile.dataset.row = r;
            tile.dataset.col = c;
            const val = currentGrid[r][c];
            tile.textContent = val === CIRCLE ? '0' : (val === TRIANGLE ? '1' : '');
            gridContainer.appendChild(tile);
          }
        }
        if (applyFade) setTimeout(() => document.querySelectorAll('.fade-in').forEach(t => t.classList.remove('fade-in')), 600);
      }

      function cycleValue(currentVal) {
        if (currentVal === EMPTY) return CIRCLE;
        if (currentVal === CIRCLE) return TRIANGLE;
        return EMPTY;
      }

      gridContainer.addEventListener('click', (e) => {
        const tile = e.target.closest('.tile');
        if (!tile) return;
        if (tile.classList.contains('locked')) return;
        if (checkBtn.disabled) return;
        const row = parseInt(tile.dataset.row);
        const col = parseInt(tile.dataset.col);
        const newVal = cycleValue(currentGrid[row][col]);
        currentGrid[row][col] = newVal;
        tile.textContent = newVal === CIRCLE ? '0' : (newVal === TRIANGLE ? '1' : '');
      });

      function checkSolution() {
        for (let r = 0; r < SIZE; r++) {
          for (let c = 0; c < SIZE; c++) {
            if (currentGrid[r][c] !== solutionGrid[r][c]) return false;
          }
        }
        return true;
      }

      checkBtn.addEventListener('click', () => {
        if (checkBtn.disabled) return;
        checkBtn.disabled = true;
        messageDiv.innerHTML = '<span class="analyzing-text">🔍 ANALYZING…</span>';
        scanContainer.classList.add('scan-active');
        setTimeout(() => {
          scanContainer.classList.remove('scan-active');
          const correct = checkSolution();
          if (correct) {
            messageDiv.innerHTML = '<span class="granted">🔓 ACCESS GRANTED</span>';
            document.querySelectorAll('.led').forEach((led, i) => setTimeout(() => led.classList.add('active'), i * 100));
          } else {
            messageDiv.innerHTML = '<span class="denied">⛔ ACCESS DENIED</span>';
          }
          checkBtn.disabled = false;
        }, 1200);
      });

      function updateScrewAppearance(screw, clicks) {
        screw.classList.remove('step1', 'step2', 'removed');
        if (clicks === 1) screw.classList.add('step1');
        else if (clicks === 2) screw.classList.add('step2');
        else if (clicks >= 3) screw.classList.add('removed');
      }

      function checkAllScrewsRemoved() {
        if (screwClicks.every(v => v >= 3)) {
          compartmentCover.classList.add('hidden');
          wiresDiv.classList.add('visible');
        }
      }

      screws.forEach((screw, index) => {
        screw.addEventListener('click', () => {
          if (screwClicks[index] >= 3) return;
          screwClicks[index]++;
          playSound('screw');
          updateScrewAppearance(screw, screwClicks[index]);
          checkAllScrewsRemoved();
        });
      });

      greenWire.addEventListener('click', () => {
        if (greenWire.classList.contains('cut')) return;
        greenWire.classList.add('cut');
        playSound('cut');
        currentGrid = solutionGrid.map(row => [...row]);
        renderGrid(true);
        document.querySelectorAll('.led').forEach((led, i) => setTimeout(() => led.classList.add('active'), i * 100));
      });

      redWire.addEventListener('click', () => {
        playSound('spark');
        spark.classList.add('active');
        setTimeout(() => spark.classList.remove('active'), 300);
      });

      renderGrid();
    })();
  </script>

  <!-- INTEGRATION SCRIPT with full‑door re‑entry -->
  <script>
    (function() {
      const sceneVault = document.getElementById('sceneVault');
      const scenePuzzle = document.getElementById('scenePuzzle');
      const sceneInterior = document.getElementById('sceneInterior');
      const vaultDoor = document.getElementById('vaultDoor');
      const vaultLed = document.getElementById('vaultLed');
      const wheel = document.getElementById('wheel');
      const keypadPanel = document.getElementById('keypadPanel');
      const vaultMessage = document.getElementById('vaultMessage');
      const puzzleMessage = document.getElementById('message');
      const backToVaultFromPuzzle = document.getElementById('backToVaultFromPuzzle');
      const backToVaultFromInterior = document.getElementById('backToVaultFromInterior');
      const dial1 = document.getElementById('dial1');
      const dial2 = document.getElementById('dial2');
      const dial3 = document.getElementById('dial3');
      const lockbox = document.getElementById('lockbox');
      const evidenceMessage = document.getElementById('evidenceMessage');

      let isVaultUnlocked = false;
      let isDoorOpened = false;
      let grantTimeout = null;
      let isAnimating = false;
      let combination = [0, 0, 0];
      const correctCombination = [2, 4, 6];
      let lockboxUnlocked = false;
      let puzzleSolved = false;

      function showScene(scene) {
        sceneVault.classList.remove('active');
        scenePuzzle.classList.remove('active');
        sceneInterior.classList.remove('active');
        if (scene === 'vault') sceneVault.classList.add('active');
        else if (scene === 'puzzle') scenePuzzle.classList.add('active');
        else if (scene === 'interior') sceneInterior.classList.add('active');
      }

      function updateVaultUI() {
        if (isVaultUnlocked) {
          vaultLed.classList.remove('red');
          vaultLed.classList.add('green');
          if (!isDoorOpened) vaultMessage.innerHTML = '🟢 VAULT UNLOCKED';
          else vaultMessage.innerHTML = '🚪 VAULT OPEN';
        } else {
          vaultLed.classList.remove('green');
          vaultLed.classList.add('red');
          vaultMessage.innerHTML = '🔴 VAULT LOCKED';
        }
      }

      // Check if entire puzzle is complete
      function checkPuzzleComplete() {
        if (lockboxUnlocked && !puzzleSolved) {
          puzzleSolved = true;
          // Call the onSolve callback to mark the puzzle as complete in the game
          if (typeof onSolve === 'function') {
            onSolve();
          }
          // Also unlock the vault if not already
          if (!isVaultUnlocked) {
            isVaultUnlocked = true;
            updateVaultUI();
          }
        }
      }

      // Central function to handle door interaction
      function handleDoorInteraction() {
        if (!sceneVault.classList.contains('active')) return;
        if (!isVaultUnlocked) {
          wheel.classList.add('shake');
          vaultMessage.innerHTML = '⛔ VAULT LOCKED';
          setTimeout(() => wheel.classList.remove('shake'), 300);
          return;
        }

        if (isDoorOpened) {
          showScene('interior');
          vaultMessage.innerHTML = '🚪 DOOR OPEN';
          setTimeout(() => { if (isVaultUnlocked && isDoorOpened) vaultMessage.innerHTML = '🚪 VAULT OPEN'; }, 1000);
        } else {
          if (isAnimating) return;
          isAnimating = true;
          isDoorOpened = true;
          vaultDoor.classList.add('open', 'unlocked');
          wheel.classList.add('rotate');
          vaultMessage.innerHTML = '🚪 DOOR AJAR';
          setTimeout(() => {
            wheel.classList.remove('rotate');
            showScene('interior');
            updateVaultUI();
            isAnimating = false;
          }, 1500);
        }
      }

      // Wheel click
      wheel.addEventListener('click', (e) => {
        e.stopPropagation();
        handleDoorInteraction();
      });

      // Vault door click
      vaultDoor.addEventListener('click', (e) => {
        if (e.target.closest('.calculator-keypad')) return;
        if (e.target.closest('.wheel')) return;
        handleDoorInteraction();
      });

      // Puzzle success detection
      function onPuzzleGranted() {
        if (isVaultUnlocked) return;
        isVaultUnlocked = true;
        if (grantTimeout) clearTimeout(grantTimeout);
        grantTimeout = setTimeout(() => {
          showScene('vault');
          updateVaultUI();
          grantTimeout = null;
        }, 1500);
      }

      const observer = new MutationObserver((mutations) => {
        for (let mut of mutations) {
          const text = puzzleMessage?.innerText || '';
          if (text.includes('ACCESS GRANTED')) onPuzzleGranted();
        }
      });
      if (puzzleMessage) observer.observe(puzzleMessage, { childList: true, characterData: true, subtree: true });

      keypadPanel.addEventListener('click', () => showScene('puzzle'));
      backToVaultFromPuzzle.addEventListener('click', () => showScene('vault'));
      backToVaultFromInterior.addEventListener('click', () => showScene('vault'));

      // Combination lock
      function updateDial(dialElement, index) { dialElement.textContent = combination[index]; }
      function checkCombination() {
        if (lockboxUnlocked) return;
        if (combination[0] === correctCombination[0] && combination[1] === correctCombination[1] && combination[2] === correctCombination[2]) {
          lockboxUnlocked = true;
          lockbox.classList.add('open');
          evidenceMessage.classList.add('show');
          // Check if puzzle is complete
          checkPuzzleComplete();
          if (window.audioCtx) {
            try {
              const ctx = window.audioCtx;
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = 400;
              gain.gain.setValueAtTime(0.2, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
              osc.start(ctx.currentTime);
              osc.stop(ctx.currentTime + 0.1);
            } catch(e) {}
          }
        }
      }
      dial1.addEventListener('click', () => { combination[0] = (combination[0] + 1) % 10; updateDial(dial1, 0); checkCombination(); });
      dial2.addEventListener('click', () => { combination[1] = (combination[1] + 1) % 10; updateDial(dial2, 1); checkCombination(); });
      dial3.addEventListener('click', () => { combination[2] = (combination[2] + 1) % 10; updateDial(dial3, 2); checkCombination(); });

      updateDial(dial1, 0);
      updateDial(dial2, 1);
      updateDial(dial3, 2);
      updateVaultUI();
      showScene('vault');
    })();
  </script>
</body>
</html>`;

  // Create the modal overlay
  const modalDiv2 = document.createElement('div');
  modalDiv2.style.position = 'fixed';
  modalDiv2.style.top = '0';
  modalDiv2.style.left = '0';
  modalDiv2.style.width = '100%';
  modalDiv2.style.height = '100%';
  modalDiv2.style.backgroundColor = 'rgba(0,0,0,0.95)';
  modalDiv2.style.zIndex = '10000';
  modalDiv2.style.display = 'flex';
  modalDiv2.style.alignItems = 'center';
  modalDiv2.style.justifyContent = 'center';
  modalDiv2.style.padding = '20px';

  const container = document.createElement('div');
  container.style.backgroundColor = '#111418';
  container.style.borderRadius = '20px';
  container.style.width = '95%';
  container.style.height = '95%';
  container.style.maxWidth = '600px';
  container.style.overflow = 'hidden';
  container.style.position = 'relative';
  container.style.boxShadow = '0 20px 40px rgba(0,0,0,0.8)';

  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.srcdoc = vaultHTML;
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
  modalDiv2.appendChild(container);
  document.body.appendChild(modalDiv2);

  closeBtn.onclick = () => modalDiv2.remove();
  modalDiv2.onclick = (e) => { if (e.target === modalDiv2) modalDiv2.remove(); };
}