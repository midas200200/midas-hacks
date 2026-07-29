(async () => {
  const LOADER_ID = "midas-universal-loader";
  const STYLE_ID = "midas-universal-loader-styles";

  const URLS = {
    stimulationClicker:
      "https://midas200200.github.io/midas-hacks/games/stimulation-clicker.js",

    unsupported:
      "https://midas200200.github.io/midas-hacks/error/unsupported.js",

    maintenance:
      "https://midas200200.github.io/midas-hacks/error/maintenance.js"
  };

  /*
   * supported:
   * Loads and runs the game's hack file.
   *
   * maintenance:
   * Runs the maintenance message instead.
   *
   * Games not listed here are automatically unsupported.
   */
  const games = {
    "stimulation-clicker": {
      status: "maintenance",
      url: URLS.stimulationClicker
    }

    /*
    Example for later:

    "infinite-craft": {
      status: "maintenance"
    },

    "password-game": {
      status: "supported",
      url: "https://midas200200.github.io/midas-hacks/games/password-game.js"
    }
    */
  };

  document.getElementById(LOADER_ID)?.remove();
  document.getElementById(STYLE_ID)?.remove();

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `
    @keyframes midasLoaderAppear {
      from {
        opacity: 0;
        transform: translateY(14px) scale(0.95);
      }

      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes midasLoaderDisappear {
      from {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      to {
        opacity: 0;
        transform: translateY(10px) scale(0.96);
      }
    }

    @keyframes midasLoaderSpin {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    @keyframes midasLoaderPulse {
      0%, 100% {
        opacity: 0.55;
      }

      50% {
        opacity: 1;
      }
    }

    @keyframes midasLoaderIconAppear {
      0% {
        opacity: 0;
        transform: scale(0.65);
      }

      70% {
        opacity: 1;
        transform: scale(1.15);
      }

      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    #${LOADER_ID} {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 2147483647;

      box-sizing: border-box;
      width: 275px;
      padding: 14px;

      border: 1px solid #555;
      border-radius: 12px;

      background: #171717;
      color: #ffffff;

      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.58);

      font-family: Arial, sans-serif;
      font-size: 14px;
      user-select: none;

      animation: midasLoaderAppear 0.35s ease forwards;
    }

    #${LOADER_ID}.midas-loader-closing {
      pointer-events: none;
      animation: midasLoaderDisappear 0.35s ease forwards;
    }

    #${LOADER_ID}.midas-loader-error {
      border-color: #8d3d3d;
      background: #241414;
    }

    #${LOADER_ID} .midas-loader-row {
      display: flex;
      align-items: center;
      gap: 11px;
    }

    #${LOADER_ID} .midas-loader-icon {
      flex: 0 0 auto;

      box-sizing: border-box;
      width: 23px;
      height: 23px;

      border: 3px solid rgba(139, 92, 246, 0.25);
      border-top-color: #8b5cf6;
      border-radius: 50%;

      animation: midasLoaderSpin 0.8s linear infinite;
    }

    #${LOADER_ID} .midas-loader-icon.midas-success-icon {
      display: flex;
      align-items: center;
      justify-content: center;

      border: none;

      color: #65d68a;
      font-size: 22px;
      font-weight: bold;

      animation: midasLoaderIconAppear 0.35s ease forwards;
    }

    #${LOADER_ID} .midas-loader-icon.midas-error-icon {
      display: flex;
      align-items: center;
      justify-content: center;

      border: none;

      color: #ff7777;
      font-size: 22px;
      font-weight: bold;

      animation: midasLoaderIconAppear 0.35s ease forwards;
    }

    #${LOADER_ID} .midas-loader-text {
      min-width: 0;
      flex: 1;
    }

    #${LOADER_ID} .midas-loader-brand {
      margin-bottom: 2px;
      color: #ffffff;
      font-size: 14px;
      font-weight: 700;
    }

    #${LOADER_ID} .midas-loader-status {
      overflow: hidden;

      color: #c8c8c8;
      font-size: 13px;

      text-overflow: ellipsis;
      white-space: nowrap;
    }

    #${LOADER_ID} .midas-loader-status.midas-error-message {
      overflow: visible;
      color: #ffb0b0;
      line-height: 1.4;
      white-space: normal;
    }

    #${LOADER_ID} .midas-loader-dots {
      display: inline-block;
      min-width: 18px;

      animation: midasLoaderPulse 0.9s ease-in-out infinite;
    }

    #${LOADER_ID} .midas-loader-ok {
      display: none;

      width: 100%;
      margin-top: 12px;
      padding: 8px 12px;

      border: none;
      border-radius: 7px;

      background: #8d3d3d;
      color: #ffffff;

      font-size: 13px;
      cursor: pointer;
    }

    #${LOADER_ID} .midas-loader-ok:hover {
      filter: brightness(1.12);
    }

    #${LOADER_ID} .midas-loader-ok:active {
      transform: scale(0.98);
    }
  `;

  document.head.appendChild(style);

  const loader = document.createElement("div");
  loader.id = LOADER_ID;

  loader.innerHTML = `
    <div class="midas-loader-row">
      <div
        class="midas-loader-icon"
        aria-hidden="true"
      ></div>

      <div class="midas-loader-text">
        <div class="midas-loader-brand">
          Midas Hacks
        </div>

        <div
          class="midas-loader-status"
          aria-live="polite"
        >
          Detecting game<span class="midas-loader-dots">...</span>
        </div>
      </div>
    </div>

    <button
      class="midas-loader-ok"
      type="button"
    >
      OK
    </button>
  `;

  document.body.appendChild(loader);

  const icon =
    loader.querySelector(".midas-loader-icon");

  const status =
    loader.querySelector(".midas-loader-status");

  const okButton =
    loader.querySelector(".midas-loader-ok");

  const wait = milliseconds =>
    new Promise(resolve =>
      setTimeout(resolve, milliseconds)
    );

  function setLoadingStatus(message) {
    loader.classList.remove("midas-loader-error");

    status.classList.remove("midas-error-message");
    status.replaceChildren();

    const text =
      document.createTextNode(message);

    const dots =
      document.createElement("span");

    dots.className = "midas-loader-dots";
    dots.textContent = "...";

    status.append(text, dots);

    icon.className = "midas-loader-icon";
    icon.textContent = "";

    okButton.style.display = "none";
  }

  function setSuccessStatus(message) {
    icon.className =
      "midas-loader-icon midas-success-icon";

    icon.textContent = "✓";

    status.classList.remove("midas-error-message");
    status.textContent = message;

    okButton.style.display = "none";
  }

  function showError(message) {
    loader.classList.add("midas-loader-error");

    icon.className =
      "midas-loader-icon midas-error-icon";

    icon.textContent = "!";

    status.classList.add("midas-error-message");
    status.textContent = message;

    okButton.style.display = "block";
  }

  async function removeLoader() {
    if (!loader.isConnected) return;

    loader.classList.add("midas-loader-closing");

    await wait(350);

    loader.remove();
    style.remove();
  }

  function createFreshUrl(url) {
    const freshUrl = new URL(url);

    freshUrl.searchParams.set(
      "midasCache",
      Date.now().toString()
    );

    return freshUrl.href;
  }

  async function getScriptCode(url) {
    const response = await fetch(
      createFreshUrl(url),
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        `Could not load a Midas Hacks file. HTTP ${response.status}.`
      );
    }

    return response.text();
  }

  function executeScript(code, originalUrl) {
    const executableCode =
      `${code}\n//# sourceURL=${originalUrl}`;

    new Function(executableCode)();
  }

  async function loadAndRun(url) {
    const code = await getScriptCode(url);

    executeScript(code, url);
  }

  async function closeLoaderAndRun(url) {
    setSuccessStatus("Game detected");

    await wait(300);
    await removeLoader();

    await loadAndRun(url);
  }

  okButton.addEventListener("click", () => {
    removeLoader();
  });

  try {
    const hostname =
      location.hostname.toLowerCase();

    const isNealFun =
      hostname === "neal.fun" ||
      hostname === "www.neal.fun";

    if (!isNealFun) {
      await wait(600);

      showError(
        "Midas Hacks only works on Neal.fun."
      );

      return;
    }

    const gameSlug =
      location.pathname
        .split("/")
        .filter(Boolean)[0] || "";

    await wait(700);

    if (!gameSlug) {
      showError(
        "Open a Neal.fun game before running Midas Hacks."
      );

      return;
    }

    const gameEntry =
      games[gameSlug];

    /*
     * Anything not listed is unsupported.
     */
    if (!gameEntry) {
      await closeLoaderAndRun(
        URLS.unsupported
      );

      return;
    }

    /*
     * Maintenance games run the maintenance screen.
     */
    if (gameEntry.status === "maintenance") {
      await closeLoaderAndRun(
        URLS.maintenance
      );

      return;
    }

    if (
      gameEntry.status !== "supported" ||
      typeof gameEntry.url !== "string"
    ) {
      throw new Error(
        `The loader configuration for "${gameSlug}" is invalid.`
      );
    }

    setLoadingStatus("Injecting hacks");

    /*
     * Keep this stage visible briefly even on a fast connection.
     */
    const [gameCode] = await Promise.all([
      getScriptCode(gameEntry.url),
      wait(800)
    ]);

    executeScript(
      gameCode,
      gameEntry.url
    );

    setSuccessStatus("Hacks injected");

    await wait(450);
    await removeLoader();
  } catch (error) {
    console.error(
      "Midas Hacks loader error:",
      error
    );

    showError(
      error instanceof Error
        ? error.message
        : "An unknown loader error occurred."
    );
  }
})();
