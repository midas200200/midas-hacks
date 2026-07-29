(() => {
  const PANEL_ID = "midas-hacks-panel";
  const OVERLAY_ID = "midas-upgrade-overlay";
  const STYLE_ID = "midas-hacks-styles";

  document.getElementById(PANEL_ID)?.remove();
  document.getElementById(OVERLAY_ID)?.remove();
  document.getElementById(STYLE_ID)?.remove();

  clearInterval(window.stimCheat);
  window.stimCheat = null;

  clearInterval(window.midasActivationCheck);
  window.midasActivationCheck = null;

  // ─────────────────────────────────────────────
  // Styles and animations
  // ─────────────────────────────────────────────

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `
    @keyframes midasPanelAppear {
      from {
        opacity: 0;
        transform: translateY(-12px) scale(0.96);
      }

      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes midasOverlayAppear {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    @keyframes midasUpgradeCardAppear {
      0% {
        opacity: 0;
        transform: scale(0.78) translateY(20px);
      }

      65% {
        opacity: 1;
        transform: scale(1.04) translateY(-3px);
      }

      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    @keyframes midasButtonPulse {
      0% {
        transform: scale(1);
      }

      45% {
        transform: scale(0.94);
      }

      75% {
        transform: scale(1.04);
      }

      100% {
        transform: scale(1);
      }
    }

    @keyframes midasProgressGlow {
      0%, 100% {
        filter: brightness(1);
      }

      50% {
        filter: brightness(1.45);
      }
    }

    @keyframes midasFinish {
      0% {
        transform: scale(1);
      }

      50% {
        transform: scale(1.08);
      }

      100% {
        transform: scale(1);
      }
    }

    .midas-button-pulse {
      animation: midasButtonPulse 0.35s ease;
    }

    .midas-finish-animation {
      animation: midasFinish 0.45s ease;
    }
  `;

  document.head.appendChild(style);

  // ─────────────────────────────────────────────
  // Find the live Vue game component
  // ─────────────────────────────────────────────

  const seen = new Set();
  const components = [];

  function scanVue(component) {
    if (!component || seen.has(component)) return;

    seen.add(component);

    if (component.$el?.isConnected) {
      components.push(component);
    }

    (component.$children || []).forEach(scanVue);
  }

  document.querySelectorAll("*").forEach(element => {
    if (element.__vue__) {
      scanVue(element.__vue__);
    }
  });

  const game = components.find(component =>
    Array.isArray(component.upgrades) &&
    typeof component.onUpgradeClick === "function" &&
    typeof component.stimulation === "number"
  );

  if (!game) {
    alert(
      "Midas Hacks could not find Stimulation Clicker.\n\n" +
      "Refresh the page, wait for the game to load, and run Midas Hacks again."
    );

    return;
  }

  window.midasGame = game;

  let hacksActivated =
    Number(game.stimulation) > 0 ||
    Number(game.totalStimulation) > 0;

  let autoEnabled = false;
  let buyingUpgrades = false;

  // ─────────────────────────────────────────────
  // Create the menu
  // ─────────────────────────────────────────────

  const panel = document.createElement("div");
  panel.id = PANEL_ID;

  Object.assign(panel.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: "2147483647",
    width: "300px",
    background: "#151515",
    color: "#ffffff",
    border: "1px solid #555",
    borderRadius: "12px",
    boxShadow: "0 10px 35px rgba(0, 0, 0, 0.55)",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    overflow: "hidden",
    userSelect: "none",
    animation: "midasPanelAppear 0.4s ease"
  });

  panel.innerHTML = `
    <div
      id="midas-drag-handle"
      style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:11px 13px;
        background:#222;
        cursor:move;
      "
    >
      <strong style="font-size:16px;">Midas Hacks</strong>

      <button
        id="midas-close"
        title="Close"
        style="
          background:#3a3a3a;
          color:white;
          border:none;
          border-radius:6px;
          padding:4px 8px;
          cursor:pointer;
        "
      >
        ✕
      </button>
    </div>

    <div style="padding:14px;user-select:text;">
      <div
        id="midas-activation-message"
        style="
          display:none;
          margin-bottom:13px;
          padding:10px;
          border:1px solid #81631e;
          border-radius:8px;
          background:#30270f;
          color:#ffe39a;
          text-align:center;
          line-height:1.35;
        "
      >
        Please click the game button once to activate hacks.
      </div>

      <div id="midas-controls">
        <label
          for="midas-amount"
          style="display:block;margin-bottom:5px;"
        >
          Stimulation amount
        </label>

        <input
          id="midas-amount"
          type="text"
          value="1000000000000"
          autocomplete="off"
          style="
            box-sizing:border-box;
            width:100%;
            padding:8px;
            margin-bottom:8px;
            border:1px solid #666;
            border-radius:7px;
            background:#262626;
            color:white;
          "
        >

        <div
          style="
            display:grid;
            grid-template-columns:1fr auto;
            gap:8px;
            margin-bottom:14px;
          "
        >
          <button
            id="midas-set"
            style="
              padding:9px;
              border:none;
              border-radius:7px;
              background:#4d7cff;
              color:white;
              cursor:pointer;
            "
          >
            Set Stimulation
          </button>

          <button
            id="midas-clear"
            style="
              padding:9px 13px;
              border:none;
              border-radius:7px;
              background:#555;
              color:white;
              cursor:pointer;
            "
          >
            Clear
          </button>
        </div>

        <div
          style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding:10px;
            margin-bottom:10px;
            border:1px solid #444;
            border-radius:8px;
          "
        >
          <span>Auto Clicker</span>

          <button
            id="midas-auto"
            style="
              min-width:70px;
              padding:7px 10px;
              border:none;
              border-radius:7px;
              background:#2d9c5a;
              color:white;
              cursor:pointer;
            "
          >
            OFF
          </button>
        </div>

        <button
          id="midas-buy-all"
          style="
            width:100%;
            padding:10px;
            border:none;
            border-radius:7px;
            background:#8b5cf6;
            color:white;
            cursor:pointer;
          "
        >
          Buy Missing Upgrades
        </button>

        <div
          style="
            margin-top:7px;
            color:#999;
            font-size:12px;
            text-align:center;
          "
        >
          Owned upgrades and Go to the Ocean are skipped.
        </div>
      </div>

      <div
        id="midas-status"
        style="
          margin-top:11px;
          color:#bbbbbb;
          font-size:13px;
        "
      >
        Ready.
      </div>
    </div>
  `;

  document.body.appendChild(panel);

  const dragHandle =
    panel.querySelector("#midas-drag-handle");

  const closeButton =
    panel.querySelector("#midas-close");

  const activationMessage =
    panel.querySelector("#midas-activation-message");

  const controls =
    panel.querySelector("#midas-controls");

  const amountInput =
    panel.querySelector("#midas-amount");

  const setButton =
    panel.querySelector("#midas-set");

  const clearButton =
    panel.querySelector("#midas-clear");

  const autoButton =
    panel.querySelector("#midas-auto");

  const buyAllButton =
    panel.querySelector("#midas-buy-all");

  const status =
    panel.querySelector("#midas-status");

  const hackButtons = [
    setButton,
    clearButton,
    autoButton,
    buyAllButton
  ];

  function setStatus(message) {
    status.textContent = message;
  }

  function animateButton(button) {
    button.classList.remove("midas-button-pulse");

    void button.offsetWidth;

    button.classList.add("midas-button-pulse");
  }

  // ─────────────────────────────────────────────
  // First-click activation
  // ─────────────────────────────────────────────

  function updateActivationDisplay() {
    activationMessage.style.display =
      hacksActivated ? "none" : "block";

    controls.style.opacity =
      hacksActivated ? "1" : "0.45";

    hackButtons.forEach(button => {
      button.disabled = !hacksActivated;

      if (!buyingUpgrades) {
        button.style.cursor =
          hacksActivated ? "pointer" : "not-allowed";
      }
    });

    amountInput.disabled = !hacksActivated;

    if (!hacksActivated) {
      setStatus("Waiting for your first click...");
    }
  }

  updateActivationDisplay();

  window.midasActivationCheck = setInterval(() => {
    if (hacksActivated) return;

    if (
      Number(game.stimulation) > 0 ||
      Number(game.totalStimulation) > 0
    ) {
      hacksActivated = true;

      updateActivationDisplay();
      setStatus("Hacks activated.");
    }
  }, 100);

  // ─────────────────────────────────────────────
  // Set and clear stimulation
  // ─────────────────────────────────────────────

  function setStimulation() {
    if (!hacksActivated) return;

    animateButton(setButton);

    const cleaned = amountInput.value
      .replaceAll(",", "")
      .replaceAll("_", "")
      .trim();

    const amount = Number(cleaned);

    if (!Number.isFinite(amount) || amount < 0) {
      setStatus("Enter a valid non-negative number.");
      return;
    }

    game.stimulation = amount;
    game.debouncedStimulation = amount;

    game.totalStimulation = Math.max(
      Number(game.totalStimulation) || 0,
      amount
    );

    game.$forceUpdate?.();

    setStatus(
      `Stimulation set to ${amount.toLocaleString("en-US")}.`
    );
  }

  function clearInput() {
    if (!hacksActivated) return;

    animateButton(clearButton);

    amountInput.value = "";
    amountInput.focus();

    setStatus("Input cleared.");
  }

  // ─────────────────────────────────────────────
  // Auto clicker
  // ─────────────────────────────────────────────

  function enableAutoClicker() {
    if (!hacksActivated) return;

    clearInterval(window.stimCheat);

    window.stimCheat = setInterval(() => {
      document.querySelector(".main-btn")?.click();
    }, 1);

    autoEnabled = true;

    autoButton.textContent = "ON";
    autoButton.style.background = "#b84040";

    setStatus("Auto clicker enabled.");
  }

  function disableAutoClicker(showMessage = true) {
    clearInterval(window.stimCheat);
    window.stimCheat = null;

    autoEnabled = false;

    autoButton.textContent = "OFF";
    autoButton.style.background = "#2d9c5a";

    if (showMessage) {
      setStatus("Auto clicker disabled.");
    }
  }

  // ─────────────────────────────────────────────
  // Upgrade helpers
  // ─────────────────────────────────────────────

  function upgradeIsOwned(upgrade) {
    return (
      upgrade?.purchased === true ||
      Number(upgrade?.count) > 0
    );
  }

  function createUpgradeOverlay(totalUpgrades) {
    document.getElementById(OVERLAY_ID)?.remove();

    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;

    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      zIndex: "2147483646",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(8, 8, 8, 0.94)",
      fontFamily: "Arial, sans-serif",
      pointerEvents: "none",
      animation: "midasOverlayAppear 0.25s ease"
    });

    overlay.innerHTML = `
      <div
        id="midas-upgrade-card"
        style="
          width:min(430px, calc(100vw - 40px));
          padding:22px;
          border:1px solid #666;
          border-radius:14px;
          background:#171717;
          color:white;
          text-align:center;
          box-shadow:0 12px 45px rgba(0,0,0,.6);
          animation:midasUpgradeCardAppear .5s ease;
        "
      >
        <div
          id="midas-upgrade-heading"
          style="
            font-size:27px;
            font-weight:bold;
            margin-bottom:8px;
          "
        >
          Processing upgrades...
        </div>

        <div
          id="midas-upgrade-name"
          style="
            min-height:20px;
            margin-bottom:14px;
            color:#c8c8c8;
            font-size:14px;
          "
        >
          Preparing...
        </div>

        <div
          style="
            width:100%;
            height:14px;
            overflow:hidden;
            border-radius:999px;
            background:#383838;
          "
        >
          <div
            id="midas-upgrade-progress"
            style="
              width:0%;
              height:100%;
              border-radius:999px;
              background:#8b5cf6;
              transition:width .15s ease;
              animation:midasProgressGlow 1.2s infinite;
            "
          ></div>
        </div>

        <div
          id="midas-upgrade-count"
          style="
            margin-top:10px;
            color:#d5d5d5;
            font-size:14px;
          "
        >
          0 / ${totalUpgrades}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    return {
      overlay,

      card:
        overlay.querySelector("#midas-upgrade-card"),

      heading:
        overlay.querySelector("#midas-upgrade-heading"),

      name:
        overlay.querySelector("#midas-upgrade-name"),

      progress:
        overlay.querySelector("#midas-upgrade-progress"),

      count:
        overlay.querySelector("#midas-upgrade-count")
    };
  }

  // ─────────────────────────────────────────────
  // Buy only missing upgrades
  // ─────────────────────────────────────────────

  async function buyMissingUpgrades() {
    if (!hacksActivated || buyingUpgrades) return;

    animateButton(buyAllButton);

    const upgradesToBuy = game.upgrades.filter(upgrade =>
      upgrade &&
      upgrade.id !== "ocean" &&
      !upgradeIsOwned(upgrade)
    );

    if (upgradesToBuy.length === 0) {
      setStatus(
        "You already own every available non-Ocean upgrade."
      );

      return;
    }

    buyingUpgrades = true;

    buyAllButton.disabled = true;
    buyAllButton.textContent = "Processing...";
    buyAllButton.style.cursor = "not-allowed";

    /*
     * Save only spendable stimulation.
     * totalStimulation is intentionally never changed here,
     * which prevents the level bar from being altered.
     */
    const originalValues = {
      stimulation:
        game.stimulation,

      debouncedStimulation:
        game.debouncedStimulation
    };

    const progressUI =
      createUpgradeOverlay(upgradesToBuy.length);

    let purchased = 0;
    let processed = 0;

    setStatus("Processing missing upgrades...");

    try {
      const temporaryStimulation =
        1_000_000_000_000;

      game.stimulation =
        temporaryStimulation;

      game.debouncedStimulation =
        temporaryStimulation;

      game.$forceUpdate?.();

      for (const upgrade of upgradesToBuy) {
        processed++;

        const upgradeName =
          upgrade.name ||
          upgrade.title ||
          upgrade.id ||
          `Upgrade ${processed}`;

        progressUI.name.textContent =
          upgradeName;

        progressUI.count.textContent =
          `${processed} / ${upgradesToBuy.length}`;

        progressUI.progress.style.width =
          `${Math.round(
            (processed / upgradesToBuy.length) * 100
          )}%`;

        /*
         * Double-check before purchasing in case the upgrade
         * became owned during the process.
         */
        if (upgradeIsOwned(upgrade)) {
          await new Promise(resolve =>
            setTimeout(resolve, 60)
          );

          continue;
        }

        try {
          game.onUpgradeClick(upgrade);
        } catch (error) {
          console.warn(
            `Midas Hacks could not purchase ${upgradeName}:`,
            error
          );
        }

        if (upgradeIsOwned(upgrade)) {
          purchased++;
        }

        /*
         * Prevents all of the upgrade effects from being
         * created at the exact same time.
         */
        await new Promise(resolve =>
          setTimeout(resolve, 150)
        );
      }

      progressUI.heading.textContent =
        "Upgrades complete!";

      progressUI.name.textContent =
        `${purchased} new upgrades purchased`;

      progressUI.progress.style.width =
        "100%";

      progressUI.progress.style.animation =
        "none";

      progressUI.card.classList.add(
        "midas-finish-animation"
      );

      await new Promise(resolve =>
        setTimeout(resolve, 850)
      );
    } finally {
      /*
       * Restore the exact amount from before the process.
       * It does not matter how much the temporary amount
       * decreased while upgrades were being purchased.
       */
      game.stimulation =
        originalValues.stimulation;

      game.debouncedStimulation =
        originalValues.debouncedStimulation;

      game.$forceUpdate?.();

      if (typeof game.$nextTick === "function") {
        await game.$nextTick();
      }

      progressUI.overlay.remove();

      buyingUpgrades = false;

      buyAllButton.disabled = false;
      buyAllButton.textContent =
        "Buy Missing Upgrades";

      buyAllButton.style.cursor =
        "pointer";

      setStatus("Missing upgrades bought.");
    }
  }

  // ─────────────────────────────────────────────
  // Events
  // ─────────────────────────────────────────────

  setButton.addEventListener(
    "click",
    setStimulation
  );

  clearButton.addEventListener(
    "click",
    clearInput
  );

  buyAllButton.addEventListener(
    "click",
    buyMissingUpgrades
  );

  amountInput.addEventListener(
    "keydown",
    event => {
      if (event.key === "Enter") {
        setStimulation();
      }
    }
  );

  autoButton.addEventListener("click", () => {
    if (!hacksActivated) return;

    animateButton(autoButton);

    if (autoEnabled) {
      disableAutoClicker();
    } else {
      enableAutoClicker();
    }
  });

  closeButton.addEventListener("click", () => {
    disableAutoClicker(false);

    clearInterval(window.midasActivationCheck);
    window.midasActivationCheck = null;

    document.getElementById(OVERLAY_ID)?.remove();
    document.getElementById(STYLE_ID)?.remove();

    panel.remove();
  });

  // ─────────────────────────────────────────────
  // Draggable menu
  // ─────────────────────────────────────────────

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  dragHandle.addEventListener(
    "mousedown",
    event => {
      if (event.target === closeButton) return;

      dragging = true;

      const rect =
        panel.getBoundingClientRect();

      offsetX =
        event.clientX - rect.left;

      offsetY =
        event.clientY - rect.top;

      panel.style.right = "auto";
      panel.style.left = `${rect.left}px`;
      panel.style.top = `${rect.top}px`;

      document.body.style.userSelect =
        "none";
    }
  );

  document.addEventListener(
    "mousemove",
    event => {
      if (!dragging) return;

      const maximumX = Math.max(
        0,
        window.innerWidth - panel.offsetWidth
      );

      const maximumY = Math.max(
        0,
        window.innerHeight - panel.offsetHeight
      );

      const x = Math.max(
        0,
        Math.min(
          event.clientX - offsetX,
          maximumX
        )
      );

      const y = Math.max(
        0,
        Math.min(
          event.clientY - offsetY,
          maximumY
        )
      );

      panel.style.left = `${x}px`;
      panel.style.top = `${y}px`;
    }
  );

  document.addEventListener("mouseup", () => {
    dragging = false;

    document.body.style.userSelect =
      "";
  });

  console.log(
    "Midas Hacks: Stimulation Clicker loaded.",
    game
  );
})();
