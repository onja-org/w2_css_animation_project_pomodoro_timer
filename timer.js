/**
 * POMODORO TIMER - JavaScript Logic
 *
 * This file handles all the timer functionality.
 * You don't need to edit this file or understand how it works yet!
 *
 * Just make sure your HTML includes elements with these IDs:
 * - time-display (shows the remaining time)
 * - start-work-button (starts a 25-minute work session)
 * - start-break-button (starts a 5-minute break)
 * - pause-button (pauses the timer)
 * - reset-button (resets to default state)
 * - timer-container (main container - we add state classes to this)
 *
 * The timer-container will automatically get these classes:
 * - "work-mode" during work sessions
 * - "break-mode" during break sessions
 * - "paused" when paused
 *
 * We also update a CSS custom property --progress with the completion percentage
 */

// Timer configuration (in seconds)
const WORK_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60; // 5 minutes

// Timer state
let timeRemaining = WORK_TIME;
let totalTime = WORK_TIME;
let isRunning = false;
let isPaused = false;
let isWorkMode = true;
let timerInterval = null;

// Wait for the page to load before setting up
document.addEventListener("DOMContentLoaded", function () {
  // Find all our elements
  const timeDisplay = document.getElementById("time-display");
  const startWorkBtn = document.getElementById("start-work-button");
  const startBreakBtn = document.getElementById("start-break-button");
  const pauseBtn = document.getElementById("pause-button");
  const resetBtn = document.getElementById("reset-button");
  const container = document.getElementById("timer-container");

  // Check if all required elements exist
  if (!timeDisplay || !startWorkBtn || !startBreakBtn || !pauseBtn || !resetBtn || !container) {
    console.error("⚠️ Timer Setup Error!");
    console.error("Make sure your HTML has all required IDs:");
    console.error("- time-display");
    console.error("- start-work-button");
    console.error("- start-break-button");
    console.error("- pause-button");
    console.error("- reset-button");
    console.error("- timer-container");
    return;
  }

  // Initialize display
  updateDisplay();
  updateButtons();

  // Set up button click handlers
  startWorkBtn.addEventListener("click", startWork);
  startBreakBtn.addEventListener("click", startBreak);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);

  // Functions for timer control
  function startWork() {
    if (isRunning) {
      pauseTimer();
    }
    isWorkMode = true;
    timeRemaining = WORK_TIME;
    totalTime = WORK_TIME;
    container.className = "work-mode";
    startTimer();
    updateButtons();
  }

  function startBreak() {
    if (isRunning) {
      pauseTimer();
    }
    isWorkMode = false;
    timeRemaining = BREAK_TIME;
    totalTime = BREAK_TIME;
    container.className = "break-mode";
    startTimer();
    updateButtons();
  }

  function startTimer() {
    if (!isRunning) {
      console.log("ran");
      isRunning = true;
      isPaused = false;
      container.classList.remove("paused");

      timerInterval = setInterval(function () {
        timeRemaining--;
        updateDisplay();
        updateProgress();

        if (timeRemaining <= 0) {
          timerComplete();
        }
      }, 1000);

      updateButtons();
    }
  }

  function pauseTimer() {
    if (isRunning) {
      isRunning = false;
      container.classList.add("paused");
      isPaused = true;
      clearInterval(timerInterval);
      updateButtons();
    } else {
      startTimer();
      updateButtons();
    }
  }

  function resetTimer() {
    isRunning = false;
    clearInterval(timerInterval);

    // Reset to work mode by default
    isWorkMode = true;
    timeRemaining = WORK_TIME;
    totalTime = WORK_TIME;

    container.className = "";
    updateDisplay();
    updateProgress();
    updateButtons();
  }

  function timerComplete() {
    isRunning = false;
    clearInterval(timerInterval);

    // Add a completion class temporarily for celebration animations
    container.classList.add("completed");

    // Play a subtle sound using an oscillator (optional fun detail!)
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      // No sound if audio context not supported
    }

    // Remove completion class after animation
    setTimeout(function () {
      container.classList.remove("completed");
    }, 1000);

    updateButtons();
  }

  function updateDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function updateProgress() {
    const progress = ((totalTime - timeRemaining) / totalTime) * 100;
    container.style.setProperty("--progress", `${progress}%`);
  }

  function updateButtons() {
    // Enable/disable buttons based on state
    startWorkBtn.disabled = isRunning && isWorkMode;
    startBreakBtn.disabled = isRunning && !isWorkMode;
    pauseBtn.disabled = !isRunning && !isPaused;

    // Update button text to show state
    if (isRunning) {
      pauseBtn.textContent = "Pause";
    } else if (timeRemaining < totalTime) {
      pauseBtn.textContent = "Resume";
    } else {
      pauseBtn.textContent = "Pause";
    }
  }

  // Log success message
  console.log("✅ Timer successfully connected!");
  console.log("Click the buttons to test your timer.");
});

// Expose timer state for debugging (students can see this in console)
window.getTimerState = function () {
  return {
    timeRemaining: timeRemaining,
    isRunning: isRunning,
    isWorkMode: isWorkMode,
    totalTime: totalTime,
  };
};
