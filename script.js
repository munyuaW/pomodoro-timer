const modeTabs = document.querySelectorAll(".tab");

const customTimerBtn = document.getElementById("expandPanelBtn");
const customTimerPanel = document.getElementById("customDurations");
const applyDurationsBtn = document.getElementById("applyDurationsBtn");
const resetDurationsBtn = document.getElementById("resetDurationsBtn");

const statusEl = document.getElementById("statusText");
const sessionCountEl = document.getElementById("sessionCount");

const timeDisplayEl = document.getElementById("timeDisplay");

// control buttons
const startPauseBtn = document.getElementById("startPauseBtn");
const resetBtn = document.getElementById("resetBtn");
const skipBtn = document.getElementById("skipBtn");

// volume el
const volumeInputEl = document.getElementById("volume");
const audio = new Audio();
audio.src = "assets/ding-ding-sound-effect.mp3";

// the ring
const progressRingIndicator = document.getElementById("progressRingIndicator");
const RING_RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// duration for each mode
const focusMinutesInputEl = document.getElementById("focusMinutes");
const shortBreakMinutesInputEl = document.getElementById("shortBreakMinutes");
const longBreakMinutesInputEl = document.getElementById("longBreakMinutes");

const DEFAULT_MINUTES = {
  focus: 25,
  shortBreak: 5,
  longBreak: 30,
};

const STORAGE_KEY = "timer-durations";

// track state
let currentMode = "focus";
let durations = defaultMinutesToSeconds();
loadFromLocalStorage();
let remainingTime = durations[currentMode];
let isRunning = false;
let completedSessions = 0;
let timerId = null;
let alarmVolume = Number(volumeInputEl.value);

startPauseBtn.addEventListener("click", () => {
  if (isRunning) {
    stopTimer();
  } else {
    startTimer();
  }
});

resetBtn.addEventListener("click", resetCurrentMode);

skipBtn.addEventListener("click", handleSessionComplete);

modeTabs.forEach((tab) => {
  tab.addEventListener("click", () => setSelectedMode(tab.dataset.mode));
});

volumeInputEl.addEventListener("input", (e) => {
  alarmVolume = Number(e.target.value);
});

customTimerBtn.addEventListener("click", toggleExpandPanel);

applyDurationsBtn.addEventListener("click", applyDurationsFromInput);

resetDurationsBtn.addEventListener("click", resetDefaultDurations);

function minutesToSeconds(mins) {
  return Math.round(mins * 60);
}

function defaultMinutesToSeconds() {
  return {
    focus: minutesToSeconds(DEFAULT_MINUTES.focus),
    shortBreak: minutesToSeconds(DEFAULT_MINUTES.shortBreak),
    longBreak: minutesToSeconds(DEFAULT_MINUTES.longBreak),
  };
}

function readDurationsFromInput() {
  return {
    focus: minutesToSeconds(focusMinutesInputEl.value),
    shortBreak: minutesToSeconds(shortBreakMinutesInputEl.value),
    longBreak: minutesToSeconds(longBreakMinutesInputEl.value),
  };
}

function applyDurationsFromInput() {
  durations = readDurationsFromInput();
  stopTimer();

  remainingTime = durations[currentMode];
  saveToLocalStorage();
  updateTabState();
  updateStatusText();
  initProgressRing();
  updateTimerDisplay();
  toggleExpandPanel();
}

function saveToLocalStorage() {
  const durationsObj = {
    focus: durations.focus,
    shortBreak: durations.shortBreak,
    longBreak: durations.longBreak,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(durationsObj));
}

function loadFromLocalStorage() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return;

    const data = JSON.parse(rawData);

    if (
      typeof data.focus !== "number" ||
      typeof data.shortBreak !== "number" ||
      typeof data.longBreak !== "number"
    )
      return;

    durations = {
      focus: data.focus,
      shortBreak: data.shortBreak,
      longBreak: data.longBreak,
    };
  } catch (error) {
    console.log(error);
  }
}

function resetDefaultDurations() {
  durations = defaultMinutesToSeconds();
  stopTimer();
  localStorage.removeItem(STORAGE_KEY);

  initProgressRing();
  remainingTime = durations[currentMode];
  updateTimerDisplay();
  updateStatusText();
}

function initProgressRing() {
  progressRingIndicator.style.strokeDasharray = `${CIRCUMFERENCE}`;
  progressRingIndicator.style.strokeDashoffset = "0";
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  startPauseBtn.textContent = "Pause";
  timerId = setInterval(tick, 1000);
}

function stopTimer() {
  if (timerId) clearInterval(timerId);
  isRunning = false;
  startPauseBtn.textContent = "Start";
}

function tick() {
  if (remainingTime > 0) {
    remainingTime--;
    updateTimerDisplay();
    return;
  }

  handleSessionComplete();
}

function updateTimerDisplay() {
  timeDisplayEl.textContent = formatTime(remainingTime);
  document.title = `${formatTime(remainingTime)} - ${getModeLabel(currentMode)}`;
  updateProgressRing();
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function getModeLabel(mode) {
  switch (mode) {
    case "focus":
      return "Focus";

    case "shortBreak":
      return "Short Break";

    default:
      return "Long Break";
  }
}

function updateProgressRing() {
  const currentModeTotal = durations[currentMode];
  const ratio = remainingTime / currentModeTotal;
  const dashOffset = CIRCUMFERENCE * (1 - ratio);
  progressRingIndicator.style.strokeDashoffset = `${dashOffset}`;
}

function resetCurrentMode() {
  stopTimer();
  initProgressRing();
  remainingTime = durations[currentMode];
  updateTimerDisplay();
  updateStatusText();
}

function updateStatusText() {
  statusEl.textContent = `${getModeLabel(currentMode)} time`;
  sessionCountEl.textContent = `Completed Focus Sessions: ${completedSessions} / 4`;
}

async function handleSessionComplete() {
  stopTimer();

  // pause until sound starts
  await playAlarm();

  const previousMode = currentMode;
  const nextMode = getNextMode(previousMode);
  currentMode = nextMode;
  remainingTime = durations[nextMode];

  updateTabState();
  updateStatusText();
  initProgressRing();
  updateTimerDisplay();

  // auto resume for smoothness
  startTimer();
}

function getNextMode(currentMode) {
  if (currentMode === "focus") {
    completedSessions++;
    if (completedSessions % 4 === 0) return "longBreak";
    return "shortBreak";
  }

  if (currentMode === "longBreak") completedSessions = 0;

  return "focus";
}

function updateTabState() {
  modeTabs.forEach((tab) => {
    const isActive = tab.dataset.mode === currentMode;
    tab.setAttribute("aria-selected", String(isActive));
  });
}

function setSelectedMode(newMode) {
  currentMode = newMode;
  remainingTime = durations[newMode];

  stopTimer();
  updateTabState();
  updateStatusText();
  initProgressRing();
  updateTimerDisplay();
}

async function playAlarm() {
  audio.volume = alarmVolume;
  audio.currentTime = 0; // Reset to start

  try {
    await audio.play();
  } catch (error) {
    console.error("Audio playback failed:", error);
  }
}

function toggleExpandPanel() {
  const expanded = customTimerBtn.getAttribute("aria-expanded") === "true";
  customTimerBtn.setAttribute("aria-expanded", expanded ? "false" : "true");
  customTimerPanel.hidden = expanded;
}

updateTabState();
updateStatusText();
initProgressRing();
updateTimerDisplay();
