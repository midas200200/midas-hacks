(() => {
  const OVERLAY_ID = "midas-unsupported-overlay";
  const STYLE_ID = "midas-unsupported-styles";

  document.getElementById(OVERLAY_ID)?.remove();
  document.getElementById(STYLE_ID)?.remove();

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `
    @keyframes midasUnsupportedFadeIn {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    @keyframes midasUnsupportedCardIn {
      from {
        opacity: 0;
        transform: translateY(18px) scale(0.96);
      }

      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes midasUnsupportedFadeOut {
      from {
        opacity: 1;
      }

      to {
        opacity: 0;
      }
    }

    #${OVERLAY_ID} {
      position: fixed;
      inset: 0;
      z-index: 2147483647;

      display: flex;
      align-items: center;
      justify-content: center;

      background: rgba(8, 8, 8, 0.96);
      color: white;
      font-family: Arial, sans-serif;

      animation: midasUnsupportedFadeIn 0.5s ease forwards;
    }

    #${OVERLAY_ID}.midas-closing {
      pointer-events: none;
      animation: midasUnsupportedFadeOut 0.45s ease forwards;
    }

    #${OVERLAY_ID} .midas-unsupported-card {
      width: min(460px, calc(100vw - 40px));
      padding: 28px;

      border: 1px solid #555;
      border-radius: 14px;

      background: #171717;
      text-align: center;

      box-shadow: 0 14px 50px rgba(0, 0, 0, 0.65);

      animation: midasUnsupportedCardIn 0.6s ease forwards;
    }

    #${OVERLAY_ID} .midas-unsupported-title {
      margin-bottom: 10px;

      font-size: 28px;
      font-weight: 700;
    }

    #${OVERLAY_ID} .midas-unsupported-message {
      color: #cfcfcf;
      font-size: 16px;
      line-height: 1.5;
    }

    #${OVERLAY_ID} .midas-unsupported-button {
      margin: 22px auto 0;
      min-width: 110px;
      padding: 10px 18px;

      border: none;
      border-radius: 8px;

      background: #8b5cf6;
      color: white;

      font-size: 15px;
      cursor: pointer;

      transition:
        opacity 0.25s ease,
        filter 0.25s ease,
        transform 0.15s ease;
    }

    #${OVERLAY_ID} .midas-unsupported-button:disabled {
      opacity: 0.45;
      filter: grayscale(0.55);
      cursor: not-allowed;
    }

    #${OVERLAY_ID} .midas-unsupported-button:not(:disabled):hover {
      filter: brightness(1.15);
    }

    #${OVERLAY_ID} .midas-unsupported-button:not(:disabled):active {
      transform: scale(0.96);
    }
  `;

  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;

  overlay.innerHTML = `
    <div class="midas-unsupported-card">
      <div class="midas-unsupported-title">
        Midas Hacks
      </div>

      <div class="midas-unsupported-message">
        This Neal.fun game is not supported yet.
      </div>

      <button
        class="midas-unsupported-button"
        type="button"
        disabled
      >
        OK
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  const okButton =
    overlay.querySelector(".midas-unsupported-button");

  const enableButtonTimer = setTimeout(() => {
    okButton.disabled = false;
  }, 3000);

  okButton.addEventListener("click", () => {
    if (okButton.disabled) return;

    clearTimeout(enableButtonTimer);

    overlay.classList.add("midas-closing");

    setTimeout(() => {
      overlay.remove();
      style.remove();
    }, 450);
  });
})();
