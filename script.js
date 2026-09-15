/* =========================================
   STUDYHUB - REFINED VERSION
========================================= */


/* ---------- PAGE NAVIGATION ---------- */

function showPage(page, button) {

  document.querySelectorAll(".page")
    .forEach(p => p.classList.remove("active"));

  document.getElementById(page)
    .classList.add("active");

  document.querySelectorAll(".navBtn")
    .forEach(b => b.classList.remove("active"));

  if (button) {
    button.classList.add("active");
  }
}


/* ---------- DARK MODE ---------- */

const darkBtn = document.getElementById("darkBtn");

if (localStorage.getItem("studyhub-dark") === "true") {
  document.body.classList.add("dark");
  darkBtn.innerText = "☀️";
}

darkBtn.onclick = function () {

  document.body.classList.toggle("dark");

  const dark =
    document.body.classList.contains("dark");

  localStorage.setItem(
    "studyhub-dark",
    dark
  );

  darkBtn.innerText =
    dark ? "☀️" : "🌙";
};


/* =========================================
   PCMB CHAPTERS
========================================= */

const chapters = {

  Physics: [
    "Electric Charges and Fields",
    "Electrostatic Potential and Capacitance",
    "Current Electricity",
    "Moving Charges and Magnetism",
    "Magnetism and Matter",
    "Electromagnetic Induction",
    "Alternating Current",
    "Electromagnetic Waves",
    "Ray Optics and Optical Instruments",
    "Wave Optics",
    "Dual Nature of Radiation and Matter",
    "Atoms",
    "Nuclei",
    "Semiconductor Electronics"
  ],

  Chemistry: [
    "Solutions",
    "Electrochemistry",
    "Chemical Kinetics",
    "d- and f-Block Elements",
    "Coordination Compounds",
    "Haloalkanes and Haloarenes",
    "Alcohols, Phenols and Ethers",
    "Aldehydes, Ketones and Carboxylic Acids",
    "Amines",
    "Biomolecules"
  ],

  Biology: [
    "Sexual Reproduction in Flowering Plants",
    "Human Reproduction",
    "Reproductive Health",
    "Principles of Inheritance and Variation",
    "Molecular Basis of Inheritance",
    "Evolution",
    "Human Health and Disease",
    "Microbes in Human Welfare",
    "Biotechnology: Principles and Processes",
    "Biotechnology and its Applications",
    "Organisms and Populations",
    "Ecosystem",
    "Biodiversity and Conservation",
    "Environmental Issues"
  ],

  Mathematics: [
    "Relations and Functions",
    "Inverse Trigonometric Functions",
    "Matrices",
    "Determinants",
    "Continuity and Differentiability",
    "Application of Derivatives",
    "Integrals",
    "Application of Integrals",
    "Differential Equations",
    "Vector Algebra",
    "Three Dimensional Geometry",
    "Linear Programming",
    "Probability"
  ]

};


/* ---------- CHAPTER STORAGE ---------- */

let chapterProgress =
  JSON.parse(
    localStorage.getItem("studyhub-chapters") || "{}"
  );


let currentSubject = "Physics";


function saveChapterProgress() {

  localStorage.setItem(
    "studyhub-chapters",
    JSON.stringify(chapterProgress)
  );
}


/* ---------- SHOW SUBJECT ---------- */

function showSubject(subject, button) {

  currentSubject = subject;

  document.querySelectorAll(".subjectTab")
    .forEach(b => b.classList.remove("active"));

  if (button) {
    button.classList.add("active");
  }

  renderChapters();
}


/* ---------- RENDER CHAPTERS ---------- */

function renderChapters() {

  const list =
    document.getElementById("chapterList");

  const title =
    document.getElementById("subjectTitle");

  const progressText =
    document.getElementById("subjectProgressText");

  const percentText =
    document.getElementById("subjectPercent");

  const bar =
    document.getElementById("subjectBar");


  title.innerText =
    getSubjectIcon(currentSubject) +
    " " +
    currentSubject;


  list.innerHTML = "";


  const subjectChapters =
    chapters[currentSubject];


  if (!chapterProgress[currentSubject]) {
    chapterProgress[currentSubject] = {};
  }


  let completed = 0;


  subjectChapters.forEach((chapter, index) => {

    const done =
      chapterProgress[currentSubject][index] === true;


    if (done) completed++;


    const div =
      document.createElement("div");

    div.className =
      "chapter" +
      (done ? " completed" : "");


    div.innerHTML = `

      <input
        type="checkbox"
        ${done ? "checked" : ""}
        onchange="toggleChapter(${index})"
      >

      <span class="chapterName">
        ${index + 1}. ${escapeHTML(chapter)}
      </span>

    `;


    list.appendChild(div);

  });


  const percentage =
    Math.round(
      (completed / subjectChapters.length) * 100
    );


  progressText.innerText =
    completed +
    " / " +
    subjectChapters.length +
    " completed";


  percentText.innerText =
    percentage + "%";


  bar.style.width =
    percentage + "%";


  updateOverallProgress();
}


/* ---------- TOGGLE CHAPTER ---------- */

function toggleChapter(index) {

  if (!chapterProgress[currentSubject]) {
    chapterProgress[currentSubject] = {};
  }


  chapterProgress[currentSubject][index] =
    !chapterProgress[currentSubject][index];


  saveChapterProgress();

  renderChapters();
}


/* ---------- SUBJECT ICON ---------- */

function getSubjectIcon(subject) {

  if (subject === "Physics") return "⚡";

  if (subject === "Chemistry") return "🧪";

  if (subject === "Biology") return "🧬";

  return "📐";
}


/* =========================================
   OVERALL CHAPTER PROGRESS
========================================= */

function getChapterStats() {

  let total = 0;
  let completed = 0;


  Object.keys(chapters).forEach(subject => {

    total += chapters[subject].length;


    chapters[subject].forEach((_, index) => {

      if (
        chapterProgress[subject] &&
        chapterProgress[subject][index]
      ) {
        completed++;
      }

    });

  });


  return {
    total,
    completed
  };
}


function updateOverallProgress() {

  const stats =
    getChapterStats();


  const totalTasks =
    tasks.length;


  const completedTasks =
    tasks.filter(t => t.completed).length;


  /*
    Chapters + Tasks को मिलाकर
    overall progress बनाया गया है.
  */

  const totalItems =
    stats.total + totalTasks;


  const completedItems =
    stats.completed + completedTasks;


  const percentage =
    totalItems === 0
      ? 0
      : Math.round(
          (completedItems / totalItems) * 100
        );


  document.getElementById(
    "overallBar"
  ).style.width =
    percentage + "%";


  document.getElementById(
    "overallPercent"
  ).innerText =
    percentage + "%";


  document.getElementById(
    "overallText"
  ).innerText =
    completedItems +
    " of " +
    totalItems +
    " study items completed";


  document.getElementById(
    "chapterDone"
  ).innerText =
    stats.completed;
}


/* =========================================
   TASK SYSTEM
========================================= */

let tasks =
  JSON.parse(
    localStorage.getItem("studyhub-tasks") || "[]"
  );


function saveTasks() {

  localStorage.setItem(
    "studyhub-tasks",
    JSON.stringify(tasks)
  );
}


function addTask() {

  const input =
    document.getElementById("taskInput");

  const subject =
    document.getElementById("taskSubject");


  const text =
    input.value.trim();


  if (!text) {

    alert("Please enter a study task!");

    return;
  }


  tasks.push({

    id: Date.now(),

    text: text,

    subject: subject.value,

    completed: false

  });


  input.value = "";


  saveTasks();

  renderTasks();

  updateOverallProgress();
}


function toggleTask(id) {

  const task =
    tasks.find(t => t.id === id);


  if (!task) return;


  task.completed =
    !task.completed;


  saveTasks();

  renderTasks();

  updateOverallProgress();
}


function deleteTask(id) {

  tasks =
    tasks.filter(t => t.id !== id);


  saveTasks();

  renderTasks();

  updateOverallProgress();
}


function renderTasks() {

  const list =
    document.getElementById("taskList");


  list.innerHTML = "";


  if (tasks.length === 0) {

    list.innerHTML =
      '<p class="empty">No tasks added yet.</p>';

  } else {

    tasks.forEach(task => {

      const div =
        document.createElement("div");

      div.className = "task";


      div.innerHTML = `

        <input
          class="taskCheck"
          type="checkbox"
          ${task.completed ? "checked" : ""}
          onchange="toggleTask(${task.id})"
        >

        <div class="taskContent">

          <div class="taskText ${
            task.completed ? "completed" : ""
          }">

            ${escapeHTML(task.text)}

          </div>

          <div class="taskSubject">
            ${task.subject}
          </div>

        </div>

        <button
          class="deleteBtn"
          onclick="deleteTask(${task.id})">
          🗑️
        </button>

      `;


      list.appendChild(div);

    });

  }


  document.getElementById(
    "taskCounter"
  ).innerText =
    tasks.length +
    (tasks.length === 1 ? " task" : " tasks");


  document.getElementById(
    "taskDone"
  ).innerText =
    tasks.filter(t => t.completed).length;


  renderHomeTasks();
}


function renderHomeTasks() {

  const container =
    document.getElementById("homeTasks");


  const pending =
    tasks.filter(t => !t.completed).slice(0, 4);


  if (pending.length === 0) {

    container.innerHTML =
      '<p class="empty">🎉 No pending tasks!</p>';

    return;
  }


  container.innerHTML =
    pending.map(task => `

      <div class="task">

        <div class="taskContent">

          <div class="taskText">
            ${escapeHTML(task.text)}
          </div>

          <div class="taskSubject">
            ${task.subject}
          </div>

        </div>

      </div>

    `).join("");
}


/* =========================================
   PROFILE
========================================= */

function saveProfile() {

  const name =
    document.getElementById(
      "profileName"
    ).value.trim();


  const studentClass =
    document.getElementById(
      "profileClass"
    ).value;


  if (!name) {

    alert("Please enter your name!");

    return;
  }


  const profile = {

    name,
    studentClass

  };


  localStorage.setItem(
    "studyhub-profile",
    JSON.stringify(profile)
  );


  showProfile();

  alert("✅ Profile saved!");
}


function showProfile() {

  const profile =
    JSON.parse(
      localStorage.getItem(
        "studyhub-profile"
      ) || "null"
    );


  if (!profile) return;


  document.getElementById(
    "profileName"
  ).value =
    profile.name;


  document.getElementById(
    "profileClass"
  ).value =
    profile.studentClass;


  document.getElementById(
    "profileDisplay"
  ).innerText =
    "👋 " +
    profile.name +
    " • " +
    profile.studentClass;


  document.getElementById(
    "welcomeName"
  ).innerText =
    profile.name;
}


/* =========================================
   REMINDERS
========================================= */

let reminders =
  JSON.parse(
    localStorage.getItem(
      "studyhub-reminders"
    ) || "[]"
  );


function saveReminders() {

  localStorage.setItem(
    "studyhub-reminders",
    JSON.stringify(reminders)
  );
}


function addReminder() {

  const text =
    document.getElementById(
      "reminderText"
    ).value.trim();


  const time =
    document.getElementById(
      "reminderTime"
    ).value;


  if (!text || !time) {

    alert("Please enter reminder and time!");

    return;
  }


  reminders.push({

    id: Date.now(),

    text,

    time

  });


  document.getElementById(
    "reminderText"
  ).value = "";


  document.getElementById(
    "reminderTime"
  ).value = "";


  saveReminders();

  renderReminders();
}


function deleteReminder(id) {

  reminders =
    reminders.filter(
      reminder => reminder.id !== id
    );


  saveReminders();

  renderReminders();
}


function renderReminders() {

  const list =
    document.getElementById(
      "reminderList"
    );


  list.innerHTML = "";


  if (reminders.length === 0) {

    list.innerHTML =
      '<p class="empty">No reminders yet.</p>';

    return;
  }


  reminders.forEach(reminder => {

    const div =
      document.createElement("div");

    div.className = "reminder";


    div.innerHTML = `

      <div class="reminderText">
        🔔 ${escapeHTML(reminder.text)}
      </div>

      <div class="reminderTime">
        ${reminder.time}
      </div>

      <button
        class="deleteBtn"
        onclick="deleteReminder(${reminder.id})">
        🗑️
      </button>

    `;


    list.appendChild(div);

  });
}


/* =========================================
   STUDY STREAK
========================================= */

let streakData =
  JSON.parse(
    localStorage.getItem(
      "studyhub-streak"
    ) ||
    '{"dates":[],"best":0}'
  );


function getToday() {

  const date = new Date();

  return (
    date.getFullYear() +
    "-" +
    String(
      date.getMonth() + 1
    ).padStart(2, "0") +
    "-" +
    String(
      date.getDate()
    ).padStart(2, "0")
  );
}


function markStudyToday() {

  const today =
    getToday();


  if (
    !streakData.dates.includes(today)
  ) {

    streakData.dates.push(today);

    streakData.dates.sort();

  }


  calculateBestStreak();


  localStorage.setItem(
    "studyhub-streak",
    JSON.stringify(streakData)
  );


  updateStreak();


  document.getElementById(
    "streakMessage"
  ).innerText =
    "✅ Today's study marked!";
}


function calculateBestStreak() {

  const dates =
    streakData.dates;


  if (dates.length === 0) {

    streakData.best = 0;

    return;
  }


  let current = 1;

  let best = 1;


  for (
    let i = 1;
    i < dates.length;
    i++
  ) {

    const previous =
      new Date(dates[i - 1]);


    const currentDate =
      new Date(dates[i]);


    const difference =
      Math.round(
        (
          currentDate -
          previous
        ) /
        (1000 * 60 * 60 * 24)
      );


    if (difference === 1) {

      current++;

    } else {

      current = 1;

    }


    best =
      Math.max(best, current);

  }


  streakData.best = best;
}


function getCurrentStreak() {

  const dates =
    streakData.dates;


  if (dates.length === 0) {
    return 0;
  }


  const today =
    new Date(getToday());


  const last =
    new Date(
      dates[dates.length - 1]
    );


  const gap =
    Math.round(
      (
        today - last
      ) /
      (1000 * 60 * 60 * 24)
    );


  if (gap > 1) {
    return 0;
  }


  let streak = 1;


  for (
    let i = dates.length - 1;
    i > 0;
    i--
  ) {

    const current =
      new Date(dates[i]);


    const previous =
      new Date(dates[i - 1]);


    const difference =
      Math.round(
        (
          current - previous
        ) /
        (1000 * 60 * 60 * 24)
      );


    if (difference === 1) {

      streak++;

    } else {

      break;

    }

  }


  return streak;
}


function updateStreak() {

  const current =
    getCurrentStreak();


  document.getElementById(
    "streak"
  ).innerText =
    current;


  document.getElementById(
    "bestStreak"
  ).innerText =
    streakData.best;


  document.getElementById(
    "totalStudyDays"
  ).innerText =
    streakData.dates.length;


  document.getElementById(
    "homeStreak"
  ).innerText =
    current;


  document.getElementById(
    "homeStudyDays"
  ).innerText =
    streakData.dates.length;
}


/* =========================================
   POMODORO
========================================= */

let timeLeft = 25 * 60;

let timerInterval = null;


function updateTimer() {

  const minutes =
    Math.floor(timeLeft / 60);


  const seconds =
    timeLeft % 60;


  document.getElementById(
    "timer"
  ).innerText =

    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");
}


function startTimer() {

  if (timerInterval) return;


  timerInterval =
    setInterval(() => {

      if (timeLeft > 0) {

        timeLeft--;

        updateTimer();

      } else {

        clearInterval(timerInterval);

        timerInterval = null;

        alert("🎉 Focus session completed!");

      }

    }, 1000);
}


function pauseTimer() {

  clearInterval(timerInterval);

  timerInterval = null;
}


function resetTimer() {

  pauseTimer();

  timeLeft =
    25 * 60;

  updateTimer();
}


/* =========================================
   HELPER
========================================= */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


/* =========================================
   INITIALIZE
========================================= */

renderChapters();

renderTasks();

renderReminders();

showProfile();

calculateBestStreak();

updateStreak();

updateTimer();

updateOverallProgress();
