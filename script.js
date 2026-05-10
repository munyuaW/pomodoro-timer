const modeTabs = document.querySelectorAll(".tab");

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

// the ring
const progressRingIndicator = document.getElementById("progressRingIndicator");
const RING_RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// duration for each mode
const DURATIONS = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 30 * 60,
};

// track state
let currentMode = "focus";
let remainingTime = DURATIONS[currentMode];
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
  const currentModeTotal = DURATIONS[currentMode];
  const ratio = remainingTime / currentModeTotal;
  const dashOffset = CIRCUMFERENCE * (1 - ratio);
  progressRingIndicator.style.strokeDashoffset = `${dashOffset}`;
}

function resetCurrentMode() {
  stopTimer();
  initProgressRing();
  remainingTime = DURATIONS[currentMode];
  updateTimerDisplay();
  updateStatusText();
}

function updateStatusText() {
  statusEl.textContent = `${getModeLabel(currentMode)} time`;
  sessionCountEl.textContent = `Completed Focus Sessions: ${completedSessions} / 4`;
}

function handleSessionComplete() {
  stopTimer();
  playAlarm();

  const previousMode = currentMode;
  const nextMode = getNextMode(previousMode);
  currentMode = nextMode;
  remainingTime = DURATIONS[nextMode];

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
  remainingTime = DURATIONS[newMode];

  stopTimer();
  updateTabState();
  updateStatusText();
  initProgressRing();
  updateTimerDisplay();
}

function playAlarm() {
  audio.src = "assets/ding-ding-sound-effect.mp3";
  audio.volume = alarmVolume;
  audio.play();
}

updateTabState();
updateStatusText();
initProgressRing();
updateTimerDisplay();
