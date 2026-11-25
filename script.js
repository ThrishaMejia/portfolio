/* ===== Academic Portfolio - script.js ===== */
const KEY = 'academic-portfolio-v1';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ----- Sample data (used ONLY the first time, when nothing is saved) ----- */
const SAMPLE = {
  intro: {
    name: 'Your Name',
    course: 'BS Your Course - Section A',
    bio: 'I am a student who enjoys learning, asking questions, and trying new things. This portfolio records my journey through the course.',
    welcome: 'Welcome to my academic journal!'
  },
  weeks: [1, 2, 3],
  activities: [
    { id: 'a1', week: 1, type: 'Lecture', date: '2026-08-10', name: 'Course Orientation',
      photos: [], description: 'We discussed the course outline, grading system, and class expectations.',
      reflection: 'I realized how important it is to plan my study time from the very start.' },
    { id: 'a2', week: 1, type: 'Laboratory', date: '2026-08-12', name: 'Laboratory Safety and Tools',
      photos: [], description: 'We toured the laboratory and learned the safety rules and basic tools.',
      reflection: 'Following safety rules protects everyone. I now feel more confident in the lab.' },
    { id: 'a3', week: 2, type: 'Lecture', date: '2026-08-17', name: 'Fundamental Concepts',
      photos: [], description: 'The lecture covered the core terms and ideas we will use all semester.',
      reflection: 'Taking notes in my own words helped me understand the topic better.' },
    { id: 'a4', week: 2, type: 'Laboratory', date: '2026-08-19', name: 'First Hands-on Exercise',
      photos: [], description: 'I completed my first exercise by following the instructions step by step.',
      reflection: 'Mistakes are part of learning. I fixed my errors by re-reading the steps.' },
    { id: 'a5', week: 3, type: 'Lecture', date: '2026-08-24', name: 'Applying the Concepts',
      photos: [], description: 'We looked at real examples that use the concepts from last week.',
      reflection: 'Seeing real examples made the lessons feel useful and interesting.' }
  ],
  reflection: {
    experience: 'Write about your overall learning experience in this course.',
    skills: 'Write about the skills and knowledge you gained.',
    challenges: 'Write about the challenges you met and how you handled them.',
    projects: 'Write about the activities or projects that helped you improve.',
    future: 'Write about how you can apply what you learned in the future.'
  }
};

/* ----- Load & save (browser localStorage) ----- */
let db = load();
function load() {
  try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch (e) {}
  const fresh = JSON.parse(JSON.stringify(SAMPLE));
  try { localStorage.setItem(KEY, JSON.stringify(fresh)); } catch (e) {}
  return fresh;
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); return true; }
  catch (e) { alert('Storage is full. Remove some photos or download a backup, then try again.'); return false; }
}

/* ----- Helpers ----- */
const fmtDate = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US',
  { year: 'numeric', month: 'long', day: 'numeric' }) : '';
function allWeeks() {
  return [...new Set([...db.weeks, ...db.activities.map(a => Number(a.week))])].sort((a, b) => a - b);
}
function weekActs(w) {
  return db.activities.filter(a => Number(a.week) === w)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
}

/* ----- Render ----- */
function render() {
  const i = db.intro;
  $('#intro').innerHTML = `
    <h1>${esc(i.name)}</h1>
    <p class="course">${esc(i.course)}</p>
    <p class="welcome">${esc(i.welcome)}</p>
    <p class="value">${esc(i.bio)}</p>
    <div class="actions noprint" style="justify-content:center">
      <button class="btn small" data-act="edit-intro">Edit Introduction</button></div>`;

  const weeks = allWeeks();
  $('#tocList').innerHTML = weeks.length ? weeks.map(w => {
    const acts = weekActs(w);
    return `<div class="tocWeek"><strong>Week ${w}</strong>` + (acts.length
      ? `<ul>${acts.map(a => `<li><a href="#act-${a.id}">${esc(a.type)} &ndash; ${esc(a.name)}</a></li>`).join('')}</ul>`
      : `<div class="empty">No activities yet</div>`) + `</div>`;
  }).join('') : '<p class="empty">No weeks yet. Tap "Add Week" or "Add Activity".</p>';

  $('#entries').innerHTML = weeks.map(w => `
    <div class="week" data-week="${w}">
      <div class="weekHead"><h2>WEEK ${w}</h2>
        <span class="noprint"><button class="btn small" data-act="print-week" data-week="${w}">Save Week as PDF</button>
        ${weekActs(w).length ? '' : `<button class="btn small danger" data-act="del-week" data-week="${w}">Remove Week</button>`}</span></div>
      ${weekActs(w).map(entryHtml).join('')}
    </div>`).join('');

  const r = db.reflection;
  const items = [['Overall Learning Experience', 'experience'], ['Skills and Knowledge Gained', 'skills'],
    ['Challenges and How I Addressed Them', 'challenges'], ['Activities and Projects That Helped Me Improve', 'projects'],
    ['Applying What I Learned in the Future', 'future']];
  $('#reflection').innerHTML = `<h2>Overall Reflection</h2>` +
    items.map(([t, k]) => `<div class="refItem"><div class="label">${t}</div><p class="value">${esc(r[k])}</p></div>`).join('') +
    `<div class="actions noprint"><button class="btn small" data-act="edit-reflection">Edit Overall Reflection</button></div>`;
}

function entryHtml(a) {
  const photos = (a.photos || []).length
    ? `<div class="photos">${a.photos.map(p => `<img src="${p}" alt="Photo of ${esc(a.name)}">`).join('')}</div>`
    : `<div class="nophoto">No photo added</div>`;
  return `<article class="card" id="act-${a.id}">
    <div class="field"><div class="label">Activity Type</div><p class="value"><span class="badge ${esc(a.type)}">${esc(a.type)}</span></p></div>
    <div class="field"><div class="label">Date</div><p class="value">${esc(fmtDate(a.date))}</p></div>
    <div class="field"><div class="label">Activity Name</div><p class="value name">${esc(a.name)}</p></div>
    <div class="field"><div class="label">Photo</div>${photos}</div>
    <div class="field"><div class="label">Description</div><p class="value">${esc(a.description)}</p></div>
    <div class="field"><div class="label">Reflection</div><p class="value reflect">${esc(a.reflection)}</p></div>
    <div class="actions noprint">
      <button class="btn small" data-act="edit-activity" data-id="${a.id}">Edit</button>
      <button class="btn small danger" data-act="del-activity" data-id="${a.id}">Delete</button></div>
  </article>`;
}

/* ----- Button clicks ----- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const act = b.dataset.act, id = b.dataset.id, w = Number(b.dataset.week);
  if (act === 'add-week') addWeek();
  else if (act === 'add-activity') openActivity();
  else if (act === 'edit-activity') openActivity(id);
  else if (act === 'del-activity') delActivity(id);
  else if (act === 'del-week') { db.weeks = db.weeks.filter(x => x !== w); save(); render(); }
  else if (act === 'print-all') printPart(null);
  else if (act === 'print-week') printPart(w);
  else if (act === 'edit-intro') openEditor('Edit Introduction', db.intro, [
    ['name', 'Name', 'text'], ['course', 'Course and section', 'text'],
    ['welcome', 'Welcome message', 'text'], ['bio', 'Short introduction', 'area']]);
  else if (act === 'edit-reflection') openEditor('Edit Overall Reflection', db.reflection, [
    ['experience', 'Overall learning experience', 'area'], ['skills', 'Skills and knowledge gained', 'area'],
    ['challenges', 'Challenges and how I addressed them', 'area'],
    ['projects', 'Activities or projects that helped me improve', 'area'],
    ['future', 'How I can apply what I learned', 'area']]);
  else if (act === 'backup') backup();
  else if (act === 'restore') $('#restoreFile').click();
});

/* ----- Add week ----- */
function addWeek() {
  const max = Math.max(0, ...allWeeks());
  const n = parseInt(prompt('Week number to add:', max + 1), 10);
  if (!n || n < 1) return;
  if (allWeeks().includes(n)) { alert('Week ' + n + ' already exists.'); return; }
  db.weeks.push(n); save(); render();
}

/* ----- Activity form ----- */
let editId = null, formPhotos = [];
function openActivity(id) {
  editId = id || null;
  const a = id ? db.activities.find(x => x.id === id) : null;
  $('#actTitle').textContent = a ? 'Edit Activity' : 'Add Activity';
  $('#fWeek').value = a ? a.week : Math.max(1, ...allWeeks());
  $('#fType').value = a ? a.type : 'Laboratory';
  $('#fDate').value = a ? a.date : new Date().toISOString().slice(0, 10);
  $('#fName').value = a ? a.name : '';
  $('#fDesc').value = a ? a.description : '';
  $('#fRef').value = a ? a.reflection : '';
  $('#fPhotos').value = '';
  formPhotos = a ? [...(a.photos || [])] : [];
  showThumbs();
  $('#actDialog').showModal();
}
function showThumbs() {
  $('#photoPrev').innerHTML = formPhotos.map((p, i) =>
    `<div class="thumb"><img src="${p}" alt=""><button type="button" data-i="${i}" aria-label="Remove photo">&times;</button></div>`).join('');
}
$('#photoPrev').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  formPhotos.splice(Number(b.dataset.i), 1); showThumbs();
});
$('#fPhotos').addEventListener('change', async e => {
  for (const f of e.target.files) formPhotos.push(await shrink(f));
  e.target.value = ''; showThumbs();
});
/* Shrinks photos so they fit in browser storage */
function shrink(file) {
  return new Promise(res => {
    const rd = new FileReader();
    rd.onload = () => {
      const img = new Image();
      img.onload = () => {
        const s = Math.min(1, 900 / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        res(c.toDataURL('image/jpeg', 0.7));
      };
      img.src = rd.result;
    };
    rd.readAsDataURL(file);
  });
}
$('#actCancel').onclick = () => $('#actDialog').close();
$('#actForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = { week: Number($('#fWeek').value), type: $('#fType').value, date: $('#fDate').value,
    name: $('#fName').value.trim(), photos: formPhotos, description: $('#fDesc').value.trim(),
    reflection: $('#fRef').value.trim() };
  const backup = JSON.stringify(db);
  if (editId) Object.assign(db.activities.find(x => x.id === editId), data);
  else { editId = uid(); db.activities.push({ id: editId, ...data }); }
  if (!save()) { db = JSON.parse(backup); return; }
  $('#actDialog').close(); render();
  const el = document.getElementById('act-' + editId); if (el) el.scrollIntoView();
  editId = null;
});
function delActivity(id) {
  const a = db.activities.find(x => x.id === id);
  if (!confirm('Permanently delete "' + a.name + '"? This cannot be undone.')) return;
  db.activities = db.activities.filter(x => x.id !== id); save(); render();
}

/* ----- Generic editor (intro & reflection) ----- */
let edTarget = null, edFields = [];
function openEditor(title, obj, fields) {
  edTarget = obj; edFields = fields;
  $('#edTitle').textContent = title;
  $('#edFields').innerHTML = fields.map(([k, l, t]) => `<label>${l}` +
    (t === 'area' ? `<textarea rows="5" data-k="${k}">${esc(obj[k])}</textarea>`
      : `<input type="text" data-k="${k}" value="${esc(obj[k])}">`) + `</label>`).join('');
  $('#edDialog').showModal();
}
$('#edCancel').onclick = () => $('#edDialog').close();
$('#edForm').addEventListener('submit', e => {
  e.preventDefault();
  document.querySelectorAll('#edFields [data-k]').forEach(el => edTarget[el.dataset.k] = el.value);
  save(); $('#edDialog').close(); render();
});

/* ----- PDF (uses the browser's Print > Save as PDF) ----- */
function printPart(week) {
  const hidden = [];
  if (week !== null) {
    ['#intro', '#toc', '#reflection'].forEach(s => hidden.push($(s)));
    document.querySelectorAll('.week').forEach(el => { if (Number(el.dataset.week) !== week) hidden.push(el); });
  }
  hidden.forEach(el => el.classList.add('hide-print'));
  const undo = () => hidden.forEach(el => el.classList.remove('hide-print'));
  window.addEventListener('afterprint', undo, { once: true });
  window.print();
}

/* ----- Backup & restore (moves your data between devices) ----- */
function backup() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(db)], { type: 'application/json' }));
  a.download = 'portfolio-backup.json'; a.click();
}
$('#restoreFile').addEventListener('change', e => {
  const f = e.target.files[0]; if (!f) return;
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const d = JSON.parse(rd.result);
      if (!d.activities || !d.intro || !d.reflection) throw 0;
      if (!confirm('Replace everything on this device with this backup?')) return;
      db = d; save(); render();
    } catch (err) { alert('That is not a valid backup file.'); }
  };
  rd.readAsText(f); e.target.value = '';
});

$('#year').textContent = new Date().getFullYear();
render();