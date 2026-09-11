<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes, viewport-fit=cover" />
    <title>📜 The Bragger's Note – UV Puzzle</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:wght@400;600&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet" />
    <style>
        /* ─── RESET & BASE ─── */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            background: #1a1a2a;
            font-family: 'Courier New', monospace;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 16px;
            color: #ece3d0;
        }

        .puzzle-wrapper {
            max-width: 720px;
            width: 100%;
            border-radius: 8px 20px 20px 8px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 2px #b5986b inset,
                0 0 0 4px #e5d2b5 inset, 0 0 0 8px #fbf3e0 inset, -5px 0 8px rgba(0, 0, 0, 0.1);
            padding: 2rem 1.6rem 2rem;
            border-left: 10px solid #8b6b42;
            margin: 10px auto;
            position: relative;
            background: #fbf3e0;
            transition: box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease;
        }

        /* ─── UV MODE OVERRIDES (whole card goes dark) ─── */
        body.uv-active .puzzle-wrapper {
            background: #0c0c1a;
            box-shadow: 0 20px 40px black, 0 0 0 1px #1a1a2a inset, 0 0 0 3px #2a2a3a inset,
                0 0 60px rgba(60, 120, 255, 0.25);
            border-left: 10px solid #1a1a2a;
        }

        /* ─── IMAGE STACK (the letter itself) ─── */
        .image-stack {
            position: relative;
            width: 100%;
            border-radius: 6px;
            overflow: hidden;
            background: #fbf3e0;
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
            transition: background 0.35s ease, box-shadow 0.35s ease;
        }
        body.uv-active .image-stack {
            background: #0a0a14;
            box-shadow: inset 0 0 0 1px rgba(80, 130, 255, 0.35),
                        0 0 24px rgba(60, 120, 255, 0.35);
        }

        .letter-img {
            display: block;
            width: 100%;
            height: auto;
            user-select: none;
            -webkit-user-drag: none;
            pointer-events: none;
        }

        /* Normal letter sits in flow; UV letter is absolutely stacked on top */
        .letter-img-uv {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
            opacity: 0;
            transition: opacity 0.35s ease;
        }

        body.uv-active .letter-img-uv {
            opacity: 1;
            animation: uvPulse 1.4s ease-out;
        }

        @keyframes uvPulse {
            0%   { opacity: 0;    filter: brightness(2.2) saturate(1.6); }
            15%  { opacity: 0.55; filter: brightness(1.6); }
            30%  { opacity: 0.35; }
            50%  { opacity: 0.9;  }
            70%  { opacity: 0.7;  }
            100% { opacity: 1;    filter: brightness(1); }
        }

        /* Blue UV wash over the whole card when active */
        body.uv-active .image-stack::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 30%,
                rgba(80, 140, 255, 0.18) 0%,
                rgba(50, 100, 220, 0.10) 40%,
                rgba(20, 60, 180, 0.05) 70%,
                transparent 100%);
            pointer-events: none;
            mix-blend-mode: screen;
        }

        /* ─── CONTROL PANEL ─── */
        .control-panel {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(2px);
            border-radius: 40px 40px 20px 20px;
            padding: 1.5rem 1.2rem;
            box-shadow: 0 8px 0 rgba(0, 0, 0, 0.08), 0 12px 24px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            margin-top: 1.5rem;
            transition: background 0.35s ease, box-shadow 0.35s ease,
                        border-color 0.35s ease, backdrop-filter 0.35s ease;
        }
        body.uv-active .control-panel {
            background: rgba(26, 26, 42, 0.9);
            box-shadow: 0 8px 0 #0a0a1a;
            border-bottom: 2px solid #4a3b22;
            border: 1px solid #2a2a4a;
            backdrop-filter: blur(4px);
        }

        .button-row {
            display: flex;
            justify-content: center;
            margin-bottom: 1.2rem;
        }
        .detective-btn {
            background: rgba(255, 255, 255, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: #1a1a2a;
            font-family: 'Courier New', monospace;
            font-size: 1.3rem;
            font-weight: bold;
            padding: 0.9rem 2rem;
            border-radius: 50px;
            letter-spacing: 1.5px;
            box-shadow: 0 5px 0 rgba(0, 0, 0, 0.1);
            cursor: pointer;
            text-transform: uppercase;
            transition: 0.08s linear, background 0.35s ease, color 0.35s ease;
            width: 100%;
            backdrop-filter: blur(4px);
        }
        .detective-btn:active {
            transform: translateY(5px);
            box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
        }
        body.uv-active .detective-btn {
            background: #4a70a0;
            color: #fff;
            border: 1px solid #c0d8ff;
            box-shadow: 0 5px 0 #1a3a5a;
        }
        .detective-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .input-area {
            display: flex;
            flex-direction: column;
            gap: 15px;
            align-items: center;
        }
        #shopGuess {
            width: 100%;
            background: rgba(255, 255, 255, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 16px 20px;
            font-size: 1.2rem;
            border-radius: 60px;
            font-family: monospace;
            font-weight: bold;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
            outline: none;
            color: #1a1a2a;
            backdrop-filter: blur(4px);
            transition: background 0.35s ease, border-color 0.35s ease, color 0.35s ease;
        }
        #shopGuess:focus {
            border-color: rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.95);
        }
        body.uv-active #shopGuess {
            background: #fff5e0;
            border: 2px solid #c09050;
            color: #1a1a2a;
        }
        #shopGuess:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        #submitGuess {
            width: 100%;
            background: rgba(255, 255, 255, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: #1a1a2a;
            font-size: 1.5rem;
            padding: 14px 20px;
            border-radius: 60px;
            font-weight: bold;
            box-shadow: 0 6px 0 rgba(0, 0, 0, 0.1);
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: 0.05s linear, background 0.35s ease, color 0.35s ease;
            backdrop-filter: blur(4px);
        }
        #submitGuess:active {
            transform: translateY(6px);
            box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
        }
        body.uv-active #submitGuess {
            background: #b0784a;
            color: #fff;
            border: 1px solid #f0c090;
            box-shadow: 0 6px 0 #5a3a20;
        }
        #submitGuess:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
            box-shadow: 0 6px 0 rgba(0, 0, 0, 0.1);
        }

        .result-message {
            text-align: center;
            color: #1a140e;
            font-size: 1.2rem;
            margin-top: 20px;
            font-weight: 600;
            min-height: 2.8rem;
            padding: 6px 12px;
            border-radius: 30px;
            background: rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(2px);
            transition: color 0.35s ease, background 0.35s ease;
        }
        .result-message.correct { color: #1f6e43; }
        .result-message.wrong   { color: #a13d3d; }
        body.uv-active .result-message {
            color: #b8a787;
            background: rgba(0, 0, 0, 0.25);
        }

        .case-note {
            color: rgba(0, 0, 0, 0.25);
            text-align: right;
            font-size: 0.9rem;
            margin-top: 10px;
            font-style: italic;
            border-top: 1px dashed rgba(0, 0, 0, 0.1);
            padding-top: 10px;
            transition: color 0.35s ease, border-color 0.35s ease;
        }
        body.uv-active .case-note {
            color: #6a6a8a;
            border-top-color: rgba(120, 140, 200, 0.25);
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 500px) {
            .puzzle-wrapper {
                padding: 1.2rem 0.9rem 1.4rem;
                border-left-width: 6px;
            }
            .detective-btn {
                font-size: 1rem;
                padding: 0.7rem 1.2rem;
            }
            #submitGuess {
                font-size: 1.2rem;
                padding: 12px 16px;
            }
            #shopGuess {
                font-size: 1rem;
                padding: 12px 16px;
            }
            .control-panel {
                padding: 1rem 0.8rem;
            }
        }

        /* ─── SUCCESS OVERLAY ─── */
        .success-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(6px);
            z-index: 5000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .success-card {
            background: linear-gradient(145deg, #1e3d4a, #0f2a3f);
            border: 3px solid #eace9f;
            border-radius: 48px;
            padding: 40px 32px;
            max-width: 420px;
            width: 90%;
            text-align: center;
            color: #f5e7c8;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }
        .success-card h2 {
            font-size: 2rem;
            color: #eace9f;
            margin-bottom: 16px;
        }
        .success-card p {
            font-size: 1.1rem;
            margin-bottom: 24px;
            line-height: 1.5;
        }
        .success-card .badge {
            display: inline-block;
            background: #1f6e43;
            padding: 6px 18px;
            border-radius: 40px;
            font-weight: bold;
            margin-bottom: 20px;
            font-size: 1rem;
        }
        .success-card button {
            background: #b68b5c;
            border: none;
            color: #0b1e2b;
            font-size: 1.2rem;
            font-weight: bold;
            padding: 12px 32px;
            border-radius: 60px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            box-shadow: 0 4px 0 #6b4f3c;
            transition: 0.05s linear;
        }
        .success-card button:active {
            transform: translateY(4px);
            box-shadow: 0 1px 0 #6b4f3c;
        }

        /* ─── SHAKE ─── */
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%      { transform: translateX(-10px); }
            40%      { transform: translateX(10px); }
            60%      { transform: translateX(-6px); }
            80%      { transform: translateX(6px); }
        }
    </style>
</head>
<body>

    <div class="puzzle-wrapper" id="puzzleWrapper">

        <!-- LETTER IMAGE STACK -->
        <div class="image-stack" id="imageStack">
            <!-- Normal paper (visible by default) -->
            <img src="paper.jpg" alt="The Bragger's Note" class="letter-img letter-img-normal" />
            <!-- UV-revealed paper (fades in when UV is on) -->
            <img src="paper1.jpg" alt="The Bragger's Note under UV light" class="letter-img letter-img-uv" />
        </div>

        <!-- CONTROL PANEL -->
        <div class="control-panel">
            <div class="button-row">
                <button class="detective-btn" id="uvBtn">🔦 UV TORCH</button>
            </div>

            <div class="input-area">
                <input type="text" id="shopGuess" placeholder="enter shop name…" autocomplete="off" />
                <button id="submitGuess">➡️ SUBMIT</button>
            </div>

            <div class="result-message" id="resultMsg"></div>
        </div>

        <div class="case-note">— Activate the UV torch to reveal hidden writing —</div>
    </div>

    <script>
        (function() {
            "use strict";

            // ─── CONFIG ───
            const CORRECT_ANSWER = "walker jewellery store";

            // ─── DOM REFS ───
            const uvBtn = document.getElementById('uvBtn');
            const submitBtn = document.getElementById('submitGuess');
            const guessInput = document.getElementById('shopGuess');
            const resultMsg = document.getElementById('resultMsg');
            const body = document.body;

            // ─── STATE ───
            let uvActive = false;
            let solved = false;

            // ─── UV TOGGLE ───
            function activateUV() {
                if (solved) return;
                uvActive = true;
                body.classList.add('uv-active');
                uvBtn.textContent = '🔦 UV ON — TAP TO HIDE';
            }

            function deactivateUV() {
                uvActive = false;
                body.classList.remove('uv-active');
                uvBtn.textContent = '🔦 UV TORCH';
            }

            uvBtn.addEventListener('click', () => {
                if (solved) return;
                uvActive ? deactivateUV() : activateUV();
            });

            // ─── SUBMIT LOGIC ───
            function normalize(str) {
                return str.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[^\w\s]/g, '');
            }

            function showSuccess() {
                solved = true;
                deactivateUV();

                resultMsg.textContent = '✅ CORRECT! Well done, detective.';
                resultMsg.className = 'result-message correct';

                uvBtn.disabled = true;
                uvBtn.style.opacity = '0.5';
                uvBtn.style.cursor = 'not-allowed';

                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.5';
                submitBtn.style.cursor = 'not-allowed';
                guessInput.disabled = true;

                const overlay = document.createElement('div');
                overlay.className = 'success-overlay';
                overlay.innerHTML = `
                    <div class="success-card">
                        <div class="badge">🧩 PUZZLE SOLVED</div>
                        <h2>📜 THE BRAGGER'S NOTE</h2>
                        <p>The UV light revealed the hidden message:<br />
                        <strong style="color:#eace9f; font-size:1.4rem;">WALKER JEWELLERY STORE</strong></p>
                        <p style="font-size:0.95rem; color:#cdba92;">The thief's next target has been identified.<br />
                        Add this clue to your case file.</p>
                        <button id="closeSuccessBtn">✅ CONTINUE</button>
                    </div>
                `;
                document.body.appendChild(overlay);

                document.getElementById('closeSuccessBtn').addEventListener('click', () => {
                    overlay.remove();
                });
            }

            submitBtn.addEventListener('click', () => {
                if (solved) return;
                const guess = normalize(guessInput.value);
                const correct = normalize(CORRECT_ANSWER);
                if (guess === correct || guess === "walkerjewellerystore") {
                    showSuccess();
                } else {
                    resultMsg.textContent = '❌ NOT YET… KEEP INVESTIGATING';
                    resultMsg.className = 'result-message wrong';
                    resultMsg.style.animation = 'none';
                    requestAnimationFrame(() => {
                        resultMsg.style.animation = 'shake 0.3s ease';
                    });
                    setTimeout(() => {
                        if (!solved) {
                            resultMsg.textContent = '';
                            resultMsg.className = 'result-message';
                        }
                    }, 2000);
                }
            });

            guessInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') submitBtn.click();
            });

            // ─── CLEANUP ON UNLOAD ───
            window.addEventListener('beforeunload', () => {
                deactivateUV();
            });

        })();
    </script>

</body>
</html>
