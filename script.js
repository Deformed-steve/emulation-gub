const romUpload = document.getElementById("romUpload");
const gameInfo = document.getElementById("gameInfo");
const emulatorFrame = document.getElementById("emulatorFrame");

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

romUpload.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Detect extension -> core
  const ext = file.name.split(".").pop().toLowerCase();
  const core = coreMap[ext] || "gba";

  // Detect name/year
  const fileName = file.name.replace(/\.[^/.]+$/, "");
  let year = "";
  const match = fileName.match(/\b(19|20)\d{2}\b/);
  if (match) year = ` (${match[0]})`;

  gameInfo.textContent = `Loaded: ${fileName}${year} [${core.toUpperCase()}]`;

  // Create local blob URL
  const blobUrl = URL.createObjectURL(file);

  // Save to localStorage
  localStorage.setItem("lastGame", JSON.stringify({
    name: fileName,
    core: core,
    url: blobUrl
  }));

  loadGame(blobUrl, core, fileName);
});

// Restore session
window.addEventListener("load", () => {
  const lastGame = JSON.parse(localStorage.getItem("lastGame") || "null");
  if (lastGame) {
    gameInfo.textContent = `Restored: ${lastGame.name} [${lastGame.core.toUpperCase()}]`;
    loadGame(lastGame.url, lastGame.core, lastGame.name);
  }
});

// Load into emulator iframe
function loadGame(url, core, name) {
  const params = new URLSearchParams({
    EJS_core: core,
    EJS_gameUrl: url,
    EJS_gameName: name,
    EJS_biosUrl: "",
    EJS_fullscreenOnLoaded: "false"
  });

  emulatorFrame.src = `https://cdn.emulatorjs.org/latest/loader.html?${params.toString()}`;
}
