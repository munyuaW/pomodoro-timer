# Pomodoro Timer

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Responsive](https://img.shields.io/badge/Responsive-Mobile%20%2B%20Desktop-22c55e)](#features)

A responsive Pomodoro Timer web app built with plain HTML, CSS, and JavaScript.

This project uses a classic productivity cycle:

- **25 minutes** focus
- **5 minutes** short break
- After **4 focus sessions**, a **30-minute** long break

It also includes an alarm sound and a circular progress ring.

## Features

- Focus/Short Break/Long Break modes
- Start/Pause, Reset, and Skip controls
- Automatic cycle switching based on completed focus sessions
- Circular progress ring that updates every second
- Audio reminders (alarm) with volume slider
- Responsive layout for desktop and mobile

## Tech Stack

- **HTML5** for structure and accessibility
- **CSS3** for layout, responsive design, and visual styling
- **Vanilla JavaScript (ES6+)** for timer logic, state management, and audio

## Key Learning Concepts

1. **DOM manipulation**
   - Selecting elements with `querySelector` / `getElementById`
   - Updating text and attributes dynamically

2. **Event handling**
   - Button click handlers (`Start`, `Reset`, `Skip`)
   - Input events for the volume slider

3. **State management in JavaScript**
   - Tracking current mode (`focus`, `shortBreak`, `longBreak`)
   - Tracking remaining time and completed sessions
   - Keeping UI in sync with app state

4. **Timers and intervals**
   - Using `setInterval` for countdown behavior
   - Starting, pausing, and stopping timer loops safely

5. **Conditional logic**
   - Triggering a long break after every 4 completed focus sessions
   - Switching modes automatically

6. **Working with SVG and progress visuals**
   - Building a circular progress ring
   - Updating `stroke-dashoffset` to animate progress

7. **Web Audio basics**
   - Creating alarm tones with the Web Audio API
   - Controlling output volume from user input

8. **Responsive UI design**
   - Using flexible units and media queries
   - Designing for both mobile and desktop screens

## Project Structure

```
pomodoro-timer
|---
```
