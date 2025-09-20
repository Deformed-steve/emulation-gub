const romUpload = document.getElementById('romUpload');
const gameInfo = document.getElementById('gameInfo');

romUpload.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Detect game name/year
  const fileName = file.name.replace(/\.[^/.]+$/, ""); 
  let year = "";
  const match = fileName.match(/\b(19|20)\d{2}\b/);
  if (match) year = ` (${match[0]})`;

  gameInfo.textContent = `Loaded: ${fileName}${year}`;

  const arrayBuffer = await file.arrayBuffer();

  // Save game to IndexedDB
  localStorage.setItem("lastGameName", fileName);
  localStorage.setItem("lastGameROM", JSON.stringify(Array.from(new Uint8Array(arrayBuffer))));

  runGame(new Uint8Array(arrayBuffer));
});

// Restore last session
window.addEventListener("load", () => {
  const lastROM = localStorage.getItem("lastGameROM");
  if (lastROM) {
    const fileName = localStorage.getItem("lastGameName");
    gameInfo.textContent = `Restored: ${fileName}`;
    runGame(new Uint8Array(JSON.parse(lastROM)));
  }
});

// Boot emulator.js
function runGame(romData) {
  const canvas = document.getElementById("emulatorCanvas");
  EJS_player = "#emulatorCanvas";
  EJS_gameName = "Uploaded Game";
  EJS_gameData = romData;
  EJS_biosUrl = "";
  EJS_core = "gba"; // auto set based on extension (todo)
  EJS_fullscreenOnLoaded = false;

  // Call emulator.js boot
  if (typeof window.EJS_emulatorReady === "function") {
    window.EJS_emulatorReady();
  }
}
