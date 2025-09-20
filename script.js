const romUpload = document.getElementById("romUpload");
const gameInfo = document.getElementById("gameInfo");
const gameContainer = document.getElementById("gameContainer");

const coreMap = {
  "nes": "nes",
  "gba": "gba",
  "gb": "gb",
  "gbc": "gb",
  "sfc": "snes",
  "smc": "snes",
  "n64": "n64",
  "nds": "nds",
  "zip": "gba" // fallback for zipped ROMs
};

// Handle ROM upload
romUpload.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const ext = file.name.split(".").pop().toLowerCase();
  const core = coreMap[ext] || "gba";

  // Game name + year detection
  const fileName = file.name.replace(/\.[^/.]+$/, "");
  let year = "";
  const match = fileName.match(/\b(19|20)\d{2}\b/);
  if (match) year = ` (${match[0]})`;

  gameInfo.textContent = `Loaded: ${fileName}${year} [${core.toUpperCase()}]`;

  // Blob URL for ROM
  const blobUrl = URL.createObjectURL(file);

  // Save session
  localStorage.setItem("lastGame", JSON.stringify({
    name: fileName,
    core: core,
    url: blobUrl
  }));

  loadGame(blobUrl, core, fileName);
});

// Restore last session
window.addEventListener("load", () => {
  const lastGame = JSON.parse(localStorage.getItem("lastGame") || "null");
  if (lastGame) {
    gameInfo.textContent = `Restored: ${lastGame.name} [${lastGame.core.toUpperCase()}]`;
    loadGame(lastGame.url, lastGame.core, lastGame.name);
  }
});

function loadGame(url, core, name) {
  // Clear previous emulator
  gameContainer.innerHTML = "";

  // Set EmulatorJS globals
  window.EJS_player = "#gameContainer";
  window.EJS_core = core;
  window.EJS_gameUrl = url;
  window.EJS_gameName = name;
  window.EJS_pathtodata = "https://cdn.emulatorjs.org/latest/data/";

  // Remove existing loader if any
  const existing = document.querySelector("script#emulatorjs-loader");
  if (existing) existing.remove();

  // Load EmulatorJS
  const script = document.createElement("script");
  script.id = "emulatorjs-loader";
  script.src = window.EJS_pathtodata + "loader.js";
  document.body.appendChild(script);
}
