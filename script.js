const romUpload = document.getElementById("romUpload");
const gameInfo = document.getElementById("gameInfo");
const gameContainer = document.getElementById("gameContainer");

const coreMap = {
  // Nintendo
  "nes": "nes",
  "fds": "nes",
  "unf": "nes",
  "gb": "gb",
  "gbc": "gb",
  "gba": "gba",
  "sfc": "snes",
  "smc": "snes",
  "fig": "snes",
  "swc": "snes",
  "n64": "n64",
  "z64": "n64",
  "v64": "n64",
  "nds": "nds",
  "dsi": "nds",

  // Sega
  "sms": "sms",
  "gg": "sms",    // Game Gear works with SMS core
  "sg": "sms",
  "md": "genesis",
  "gen": "genesis",
  "smd": "genesis",
  "32x": "sega32x",

  // NEC
  "pce": "pce",
  "sgx": "pce",
  "tg16": "pce",

  // Sony
  "cue": "psx",
  "bin": "psx",
  "iso": "psx",
  "chd": "psx",

  // Atari
  "a26": "atari2600",
  "a52": "atari5200",
  "a78": "atari7800",
  "jag": "jaguar",
  "lynx": "lynx",

  // Misc handhelds
  "ws": "ws",
  "wsc": "ws",
  "ngp": "ngp",
  "ngc": "ngp",
  "neo": "ngp",
  "vb": "vb",

  // Commodore & computers
  "d64": "c64",
  "prg": "c64",
  "tap": "c64",
  "crt": "c64",

  // Arcade
  "zip": "mame",

  // GameCube / Wii
  "gcm": "dolphin",
  "rvz": "dolphin",
  "wad": "dolphin",
  "dol": "dolphin",
  "elf": "dolphin",

  // Extras
  "7z": "zip",
  "gz": "zip"
};

// ROM upload logic stays the same
romUpload.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const ext = file.name.split(".").pop().toLowerCase();
  const core = coreMap[ext] || "gba"; // fallback

  // Game name + year detection
  const fileName = file.name.replace(/\.[^/.]+$/, "");
  let year = "";
  const match = fileName.match(/\b(19|20)\d{2}\b/);
  if (match) year = ` (${match[0]})`;

  gameInfo.textContent = `Loaded: ${fileName}${year} [${core.toUpperCase()}]`;

  const blobUrl = URL.createObjectURL(file);

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
  gameContainer.innerHTML = "";

  window.EJS_player = "#gameContainer";
  window.EJS_core = core;
  window.EJS_gameUrl = url;
  window.EJS_gameName = name;
  window.EJS_pathtodata = "https://cdn.emulatorjs.org/latest/data/";

  const existing = document.querySelector("script#emulatorjs-loader");
  if (existing) existing.remove();

  const script = document.createElement("script");
  script.id = "emulatorjs-loader";
  script.src = window.EJS_pathtodata + "loader.js";
  document.body.appendChild(script);
}
