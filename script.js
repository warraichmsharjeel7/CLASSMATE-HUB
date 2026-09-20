const KEY = "classmatehub_v2";
const USER_KEY = "classmatehub_user_name";

const defaults = {
  tasks: [
    { id: 1, title: "Complete Mathematics Assignment", subject: "Mathematics", due: "2026-09-20", desc: "Finish questions 1–20 from the assigned chapter.", done: false },
    { id: 2, title: "Physics practical write-up", subject: "Physics", due: "2026-09-22", desc: "Prepare the practical notebook and submit it.", done: false },
    { id: 3, title: "English presentation", subject: "English", due: "2026-09-25", desc: "Prepare slides for the class presentation.", done: false }
  ],
  notes: [
    { id: 1, title: "Basic Counting Principles", subject: "Mathematics", desc: "Addition rule, multiplication rule and permutations.", date: "Today" },
    { id: 2, title: "Networking Basics", subject: "Computer Science", desc: "Hosting, on-premises, shared and dedicated hosting.", date: "Yesterday" },
    { id: 3, title: "Chapter 4 — Motion", subject: "Physics", desc: "Class notes and key formulas.", date: "Sep 12" }
  ],
  exams: [
    { id: 1, title: "Mathematics Mid-Term", subject: "Mathematics", date: "2026-10-03", room: "Room 12" },
    { id: 2, title: "Computer Science Test", subject: "Computer Science", date: "2026-10-10", room: "Lab 2" }
  ],
  announcements: [
    { id: 1, title: "Welcome to ClassMate Hub!", text: "Use this dashboard to keep your notes, assignments, timetable and exam dates organized.", date: "Today" },
    { id: 2, title: "Project submission reminder", text: "Remember to check your assignment deadlines and submit work on time.", date: "Yesterday" }
  ],
  classes: [
    { id: 101, day: "Monday", time: "08:00", subject: "Mathematics", room: "Room 12" },
    { id: 102, day: "Monday", time: "09:00", subject: "Physics", room: "Lab 1" },
    { id: 103, day: "Monday", time: "10:00", subject: "English", room: "Room 8" },
    { id: 104, day: "Tuesday", time: "08:00", subject: "Computer Science", room: "Lab 2" },
    { id: 105, day: "Tuesday", time: "09:00", subject: "Mathematics", room: "Room 12" },
    { id: 106, day: "Wednesday", time: "08:00", subject: "Physics", room: "Lab 1" },
    { id: 107, day: "Wednesday", time: "10:00", subject: "Computer Science", room: "Lab 2" },
    { id: 108, day: "Thursday", time: "09:00", subject: "English", room: "Room 8" },
    { id: 109, day: "Thursday", time: "10:00", subject: "Mathematics", room: "Room 12" },
    { id: 110, day: "Friday", time: "08:00", subject: "Computer Science", room: "Lab 2" },
    { id: 111, day: "Friday", time: "09:00", subject: "Physics", room: "Lab 1" }
  ],
  focus: 0
};

let data = JSON.parse(localStorage.getItem(KEY) || "null") || structuredClone(defaults);
let userName = localStorage.getItem(USER_KEY) || "";

function initUser() {
  if (!userName) {
    document.getElementById("nameOverlay").classList.add("show");
  } else {
    document.getElementById("nameOverlay").classList.remove("show");
    updateUserDisplay();
  }
}

function updateUserDisplay() {
  document.getElementById("displayName").textContent = userName;
  document.getElementById("sidebarUserName").textContent = userName;
  document.getElementById("avatarLetter").textContent = userName.charAt(0).toUpperCase();
}

document.getElementById("nameForm").onsubmit = e => {
  e.preventDefault();
  const input = document.getElementById("userNameInput").value.trim();
  if (input) {
    userName = input;
    localStorage.setItem(USER_KEY, userName);
    initUser();
    toast(`Welcome, ${userName}! 👋`);
  }
};

document.getElementById("changeNameBtn").onclick = () => {
  document.getElementById("userNameInput").value = userName;
  document.getElementById("nameOverlay").classList.add("show");
};

function save() {
  localStorage.setItem(KEY, JSON.stringify(data));
  renderAll();
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
}

function toast(t) {
  const x = document.getElementById("toast");
  x.textContent = t;
  x.classList.add("show");
  setTimeout(() => x.classList.remove("show"), 2200);
}

function openModal(html) {
  document.getElementById("modalContent").innerHTML = html;
  document.getElementById("modalBackdrop").classList.add("show");
}

function closeModal() {
  document.getElementById("modalBackdrop").classList.remove("show");
}

document.getElementById("modalClose").onclick = closeModal;
document.getElementById("modalBackdrop").onclick = e => { if (e.target.id === "modalBackdrop") closeModal(); };

function showPage(page) {
  document.querySelectorAll(".page").forEach(x => x.classList.remove("active"));
  document.getElementById("page-" + page)?.classList.add("active");
  document.querySelectorAll(".nav-item[data-page]").forEach(x => x.classList.toggle("active", x.dataset.page === page));
  document.getElementById("sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", e => {
  const p = e.target.closest("[data-page]");
  if (p) showPage(p.dataset.page);
});

document.getElementById("menuBtn").onclick = () => document.getElementById("sidebar").classList.toggle("open");
document.getElementById("themeBtn").onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("cm_dark", document.body.classList.contains("dark"));
};
if (localStorage.getItem("cm_dark") === "true") document.body.classList.add("dark");

function renderDashboard() {
  document.getElementById("statNotes").textContent = data.notes.length;
  document.getElementById("statTasks").textContent = data.tasks.filter(x => !x.done).length;
  document.getElementById("statExams").textContent = data.exams.length;
  document.getElementById("statFocus").textContent = data.focus;
  document.getElementById("taskBadge").textContent = data.tasks.filter(x => !x.done).length;

  const now = new Date();
  document.getElementById("dateText").textContent = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) + " • Stay organized and keep learning.";

  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const today = data.classes.filter(x => x.day === day).sort((a, b) => a.time.localeCompare(b.time));

  document.getElementById("todayClasses").innerHTML = today.length
    ? today.map(c => `<div class="class-row"><span class="time">${esc(c.time)}</span><span class="subject-dot"></span><div><strong>${esc(c.subject)}</strong><small>${esc(c.room)}</small></div></div>`).join("")
    : `<div class="class-row"><div><strong>No classes scheduled today 🎉</strong><small>Enjoy your free day.</small></div></div>`;

  const pending = data.tasks.filter(x => !x.done).slice(0, 4);
  document.getElementById("upcomingTasks").innerHTML = pending.length
    ? pending.map(t => `<div class="task-row" onclick="toggleTask(${t.id})"><span class="check"></span><div><strong>${esc(t.title)}</strong><small>${esc(t.subject)}</small></div><span class="due">${esc(t.due)}</span></div>`).join("")
    : `<div class="task-row"><div><strong>All caught up! 🎉</strong><small>No pending assignments.</small></div></div>`;

  const exams = [...data.exams].sort((a, b) => new Date(a.date) - new Date(b.date));
  const ex = exams[0];
  document.getElementById("nextExamSubject").textContent = ex ? ex.subject : "No exams added yet";

  if (ex) {
    let d = Math.ceil((new Date(ex.date) - new Date()) / 86400000);
    d = Math.max(0, d);
    document.getElementById("examHero").innerHTML = `<div><h3>${esc(ex.title)}</h3><p>${esc(ex.date)} • ${esc(ex.room)}</p></div><div class="days">${d}<small>days left</small></div>`;
  } else {
    document.getElementById("examHero").innerHTML = "<div><h3>Add your first exam</h3><p>Use the Exam Planner to create a countdown.</p></div>";
  }
}

function renderTasks(filter = "all") {
  const list = data.tasks.filter(t => filter === "pending" ? !t.done : filter === "done" ? t.done : true);
  document.getElementById("tasksContainer").innerHTML = list.length
    ? list.map(t => `<div class="task-card ${t.done ? "done" : ""}"><div class="card-top"><span class="tag">${esc(t.subject)}</span><button class="delete" onclick="deleteItem('tasks',${t.id})">×</button></div><h3>${esc(t.title)}</h3><p>${esc(t.desc)}</p><div class="card-bottom"><span>Due ${esc(t.due)}</span><button class="complete-btn" onclick="toggleTask(${t.id})">${t.done ? "↩ Mark pending" : "✓ Complete"}</button></div></div>`).join("")
    : `<div class="task-card"><h3>No assignments here</h3><p>Add an assignment to start tracking your work.</p></div>`;
}

function renderNotes(subject = "All") {
  const list = subject === "All" ? data.notes : data.notes.filter(n => n.subject === subject);
  const subs = ["All", ...new Set(data.notes.map(n => n.subject))];
  document.getElementById("subjectTabs").innerHTML = subs.map(s => `<button class="subject-tab ${s === subject ? "active" : ""}" onclick="renderNotes('${esc(s).replace(/'/g, "\\'")}')">${esc(s)}</button>`).join("");
  document.getElementById("notesContainer").innerHTML = list.length
    ? list.map(n => `<div class="note-card"><div class="card-top"><span class="tag">${esc(n.subject)}</span><button class="delete" onclick="deleteItem('notes',${n.id})">×</button></div><h3>${esc(n.title)}</h3><p>${esc(n.desc)}</p><div class="card-bottom"><span>${esc(n.date)}</span></div></div>`).join("")
    : `<div class="note-card"><h3>No notes found</h3><p>Add your first note.</p></div>`;
}

function renderTimetable() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  document.getElementById("timetableContainer").innerHTML = days.map(d => {
    const dayClasses = data.classes.filter(c => c.day === d).sort((a, b) => a.time.localeCompare(b.time));
    return `<div class="day-card">
      <div class="day-head">
        <span>${d}</span>
        ${dayClasses.length ? `<button class="clear-day-btn" onclick="clearDay('${d}')">Clear Day</button>` : ""}
      </div>
      <div class="day-classes">
        ${dayClasses.map(c => `
          <div class="class-chip">
            <div class="chip-top">
              <b>${esc(c.subject)}</b>
              <button class="delete-class-btn" onclick="deleteItem('classes', ${c.id})">×</button>
            </div>
            <small>🕐 ${esc(c.time)} •${esc(c.room)}</small>
          </div>
        `).join("") || '<div class="class-chip empty"><small>No class scheduled</small></div>'}
      </div>
    </div>`;
  }).join("");
}

function clearDay(day) {
  if (confirm(`Are you sure you want to clear all classes for ${day}?`)) {
    data.classes = data.classes.filter(c => c.day !== day);
    save();
    toast(`Cleared all classes for ${day}`);
  }
}
window.clearDay = clearDay;

function renderExams() {
  const list = [...data.exams].sort((a, b) => new Date(a.date) - new Date(b.date));
  document.getElementById("examsContainer").innerHTML = list.length
    ? list.map(e => {
        let d = Math.ceil((new Date(e.date) - new Date()) / 86400000);
        return `<div class="exam-card"><div class="card-top"><span class="tag">${esc(e.subject)}</span><button class="delete" onclick="deleteItem('exams',${e.id})">×</button></div><h3>${esc(e.title)}</h3><p>📅 ${esc(e.date)}<br>📍 ${esc(e.room)}</p><div class="card-bottom"><strong>${Math.max(0, d)} days left</strong></div></div>`;
      }).join("")
    : `<div class="exam-card"><h3>No exams added</h3><p>Create an exam countdown so you can plan your revision.</p></div>`;
}

function renderAnnouncements() {
  document.getElementById("announcementsContainer").innerHTML = data.announcements.map(a => `<div class="announcement"><div class="card-top"><span class="tag">CLASS UPDATE</span><button class="delete" onclick="deleteItem('announcements',${a.id})">×</button></div><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p><small>${esc(a.date)}</small></div>`).join("");
}

function renderAll() {
  renderDashboard();
  renderTasks();
  renderNotes();
  renderTimetable();
  renderExams();
  renderAnnouncements();
}

function toggleTask(id) {
  const t = data.tasks.find(x => x.id === id);
  if (t) {
    t.done = !t.done;
    save();
    toast(t.done ? "Assignment completed 🎉" : "Assignment marked pending");
  }
}

function deleteItem(type, id) {
  data[type] = data[type].filter(x => x.id !== id);
  save();
  toast("Removed");
}

window.toggleTask = toggleTask;
window.deleteItem = deleteItem;
window.renderNotes = renderNotes;

function form(type) {
  const configs = {
    tasks: { title: "New Assignment", fields: `<label>Title<input name="title" required placeholder="e.g. Math homework"></label><label>Subject<input name="subject" required placeholder="Mathematics"></label><label>Due date<input name="due" type="date" required></label><label>Description<textarea name="desc" placeholder="What needs to be done?"></textarea></label>` },
    notes: { title: "Add Note", fields: `<label>Title<input name="title" required placeholder="Chapter / topic"></label><label>Subject<input name="subject" required placeholder="Mathematics"></label><label>Details<textarea name="desc" required placeholder="Short summary or key points"></textarea></label>` },
    exams: { title: "Add Exam", fields: `<label>Exam name<input name="title" required placeholder="Mathematics Mid-Term"></label><label>Subject<input name="subject" required placeholder="Mathematics"></label><label>Date<input name="date" type="date" required></label><label>Room<input name="room" placeholder="Room 12"></label>` },
    announcements: { title: "New Announcement", fields: `<label>Title<input name="title" required placeholder="Important update"></label><label>Message<textarea name="text" required placeholder="Write your announcement..."></textarea></label>` },
    classes: { title: "Add Class Slot", fields: `<label>Day<select name="day">${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(x => `<option>${x}</option>`).join("")}</select></label><label>Time<input name="time" type="time" required></label><label>Subject<input name="subject" required placeholder="Mathematics"></label><label>Room<input name="room" placeholder="Room 12"></label>` }
  }[type];

  openModal(`<h2>${configs.title}</h2><form class="form" id="dynamicForm">${configs.fields}<button class="primary" type="submit">Save</button></form>`);
  document.getElementById("dynamicForm").onsubmit = e => {
    e.preventDefault();
    const o = Object.fromEntries(new FormData(e.target));
    o.id = Date.now();
    if (type === "notes") o.date = "Just now";
    if (type === "announcements") o.date = "Just now";
    if (type === "tasks") o.done = false;
    data[type].push(o);
    save();
    closeModal();
    toast("Saved successfully ✓");
  };
}

document.getElementById("addTaskBtn").onclick = () => form("tasks");
document.getElementById("addNoteBtn").onclick = () => form("notes");
document.getElementById("addExamBtn").onclick = () => form("exams");
document.getElementById("addAnnouncementBtn").onclick = () => form("announcements");
document.getElementById("addClassBtn").onclick = () => form("classes");
document.getElementById("quickAdd").onclick = () => openModal(`<h2>Quick Add</h2><div class="form"><button class="primary" onclick="closeModal();form('tasks')">＋ Assignment</button><button class="secondary" onclick="closeModal();form('notes')">＋ Note</button><button class="secondary" onclick="closeModal();form('exams')">＋ Exam</button><button class="secondary" onclick="closeModal();form('classes')">＋ Class</button></div>`);
document.getElementById("notifyBtn").onclick = () => showPage("announcements");
document.querySelectorAll(".filter").forEach(b => b.onclick = () => {
  document.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  renderTasks(b.dataset.filter);
});
document.querySelectorAll("[data-tool]").forEach(b => b.onclick = () => showPage("tools"));

// Student Tools Calculators
document.getElementById("pctBtn").onclick = () => {
  let a = +pctA.value, b = +pctB.value;
  pctResult.textContent = (isFinite(a) && isFinite(b)) ? (a / 100 * b).toFixed(2) : "Enter both values";
};
document.getElementById("gradeBtn").onclick = () => {
  let a = +marksA.value, b = +marksB.value;
  if (!b) { gradeResult.textContent = "Enter total marks"; return; }
  let p = a / b * 100, g = p >= 90 ? "A+" : p >= 80 ? "A" : p >= 70 ? "B" : p >= 60 ? "C" : p >= 50 ? "D" : "F";
  gradeResult.textContent = `${p.toFixed(1)}% • ${g}`;
};
document.getElementById("ageBtn").onclick = () => {
  let d = new Date(dob.value);
  if (isNaN(d)) { ageResult.textContent = "Select your birth date"; return; }
  let n = new Date(), age = n.getFullYear() - d.getFullYear();
  if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) age--;
  ageResult.textContent = `${age} years old`;
};

// Focus Timer
let seconds = 1500, timerRunning = false, timerInterval;
function paintTimer() {
  document.getElementById("timer").textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
document.getElementById("startTimer").onclick = () => {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    startTimer.textContent = "Start";
    return;
  }
  timerRunning = true;
  startTimer.textContent = "Pause";
  timerInterval = setInterval(() => {
    if (seconds <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      startTimer.textContent = "Start";
      data.focus += 25;
      save();
      toast("Focus session complete! 🎉");
      seconds = 1500;
      paintTimer();
      return;
    }
    seconds--;
    paintTimer();
  }, 1000);
};
document.getElementById("resetTimer").onclick = () => {
  clearInterval(timerInterval);
  timerRunning = false;
  seconds = 1500;
  paintTimer();
  startTimer.textContent = "Start";
};

// Global Search
document.getElementById("globalSearch").oninput = e => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) return;
  const match = data.notes.find(n => (n.title + " " + n.subject + " " + n.desc).toLowerCase().includes(q)) ||
                data.tasks.find(t => (t.title + " " + t.subject + " " + t.desc).toLowerCase().includes(q));
  if (match) showPage(match.title ? (match.due ? "tasks" : "notes") : "dashboard");
};

initUser();
renderAll();
paintTimer();