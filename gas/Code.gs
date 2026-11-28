/**
 * English Step — ระบบล็อกอิน + เก็บผลการเรียน
 * ฐานข้อมูล: Google Sheet "English Step DB" (เปิดด้วย ID)
 * Deploy: Web app · Execute as: Me · Who has access: Anyone
 */
const SS = SpreadsheetApp.openById('1p0V5hjxcO3gtchqGx5NdNPMhMLVdWPe4GUp6iV7PgOo');
const SESSION_DAYS = 30;
const MAX_FAIL = 5;          // ใส่รหัสผิดได้กี่ครั้ง
const LOCK_MIN = 15;         // ล็อกกี่นาทีเมื่อผิดเกิน
// ใช้บัญชีศูนย์รวมงาน กฟส.อ่าวลึก — ตรวจตัวตนและสิทธิ์โปรแกรม 'english' กับหลังบ้านศูนย์รวมงาน
const HUB_URL = 'https://script.google.com/macros/s/AKfycbzqsOqJJQlF4SS1UX_YM6hmhd3lUXCVocAJiK7l28Tzddms9SQ9Z7p-iYgrrgd2B2meWw/exec';
const HUB_APP = 'english';
// บัญชีกลาง Aloof Apps (ผู้ทดสอบ/ลูกค้า) — แยกกลุ่มจากพนักงาน (username = 'app:' + ชื่อผู้ใช้)
const APPS_URL = 'https://script.google.com/macros/s/AKfycbw3ify1S1DyG8fmm-xuDuEoTY7_vl6caAjlpnt5RNU-1I3lB6N5h8bWbz1-Jfxv3eU1/exec';

function sheet_(name, head) {
  let s = SS.getSheetByName(name);
  if (!s) { s = SS.insertSheet(name); s.appendRow(head); s.setFrozenRows(1); }
  return s;
}
const users_ = () => sheet_('users', ['username', 'name', 'salt', 'hash', 'created', 'role', 'lastLogin']);
const sessions_ = () => sheet_('sessions', ['token', 'username', 'expires']);
const progress_ = () => sheet_('progress', ['username', 'data', 'updated']);

/** เข้าสู่ระบบด้วยบัญชีศูนย์รวมงาน: ถามหลังบ้านศูนย์รวมงาน (whoAmI) ว่าชื่อ/รหัสถูกและมีสิทธิ์ english หรือไม่
 *  ไม่เก็บรหัสผ่านไว้ที่นี่ — ผลการเรียนผูกกับชื่อผู้ใช้ศูนย์รวมงาน (username = 'hub:' + ชื่อ) */
function hubAuth_(b) {
  const name = String(b.name || '').trim(), pass = String(b.pass || '');
  if (!name || !pass) return { ok: false, auth: false, msg: 'ยังไม่ได้เข้าสู่ระบบศูนย์รวมงาน' };
  let r;
  try {
    const res = UrlFetchApp.fetch(HUB_URL, { method: 'post', contentType: 'text/plain', muteHttpExceptions: true,
      payload: JSON.stringify({ action: 'whoAmI', changedBy: name, changedByPassword: pass }) });
    r = JSON.parse(res.getContentText());
  } catch (e) { return { ok: false, msg: 'ตรวจสอบกับศูนย์รวมงานไม่ได้ ลองใหม่อีกครั้ง' }; }
  if (!r || !r.role) return { ok: false, auth: false, msg: 'ชื่อหรือรหัสผ่านศูนย์รวมงานใช้ไม่ได้ กรุณาเข้าสู่ระบบศูนย์รวมงานใหม่' };
  if (r.role !== 'admin' && (r.apps || []).indexOf(HUB_APP) < 0) return { ok: false, perm: false, msg: 'บัญชีนี้ยังไม่ได้รับสิทธิ์ใช้ English Step กรุณาขอสิทธิ์จากผู้ดูแลระบบในศูนย์รวมงาน' };
  const u = 'hub:' + name.toLowerCase(), sh = users_(), f = find_(sh, u);
  if (!f) sh.appendRow([u, safe_(name), '', '', new Date(), r.role, new Date()]);
  else sh.getRange(f.row, 6, 1, 2).setValues([[r.role, new Date()]]);
  const p = find_(progress_(), u);
  return { ok: true, token: newSession_(u), user: { username: u, name: name, role: r.role }, data: p ? progData_(p.vals) : null };
}

/** เข้าด้วยบัญชี Aloof Apps: ส่ง token ของบัญชีกลางมาตรวจ แล้วออก session ของ English Step */
function appAuth_(b) {
  if (!b.appToken) return { ok: false, auth: false, msg: 'ยังไม่ได้เข้าสู่ระบบ Aloof Apps' };
  let r;
  try { r = JSON.parse(UrlFetchApp.fetch(APPS_URL, { method: 'post', contentType: 'text/plain', muteHttpExceptions: true, payload: JSON.stringify({ action: 'verify', token: String(b.appToken), app: 'english' }) }).getContentText()); }
  catch (e) { return { ok: false, msg: 'ตรวจสอบบัญชีไม่ได้ ลองใหม่อีกครั้ง' }; }
  if (!r || !r.ok) return { ok: false, auth: r && r.auth === false ? false : undefined, perm: r && r.perm === false ? false : undefined, msg: (r && r.msg) || 'เข้าสู่ระบบไม่สำเร็จ' };
  const u = 'app:' + String(r.user.username).toLowerCase(), sh = users_(), f = find_(sh, u), role = 'app-' + r.user.type;
  if (!f) sh.appendRow([u, safe_(r.user.name), '', '', new Date(), role, new Date()]);
  else sh.getRange(f.row, 2, 1, 1).setValue(safe_(r.user.name)), sh.getRange(f.row, 6, 1, 2).setValues([[role, new Date()]]);
  const p = find_(progress_(), u);
  return { ok: true, token: newSession_(u), user: { username: u, name: r.user.name, role: role, type: r.user.type, avatar: r.user.avatar, langs: (r.perm && r.perm.langs) || ['en'], expires: r.user.expires }, data: p ? progData_(p.vals) : null };
}

/* ---------- ช่องสำหรับน้องมีไฟ ----------
 * น้องมีไฟส่งชื่อ/รหัสศูนย์รวมงานที่ตั้งไว้ในเครื่อง (hubUser/hubPass) มาด้วยทุกครั้ง
 * ตรวจกับศูนย์รวมงานแล้วจำผลไว้ 10 นาที */
const TOTAL_WORDS = 4000, TOTAL_SOUNDS = 12;
function hubRole_(name, pass) {
  name = String(name || '').trim(); pass = String(pass || '');
  if (!name || !pass) return '';
  const key = 'hr_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, name + '\n' + pass)).slice(0, 40);
  const c = CacheService.getScriptCache(), hit = c.get(key);
  if (hit !== null) return hit;
  let role = '';
  try {
    const r = JSON.parse(UrlFetchApp.fetch(HUB_URL, { method: 'post', contentType: 'text/plain', muteHttpExceptions: true,
      payload: JSON.stringify({ action: 'whoAmI', changedBy: name, changedByPassword: pass }) }).getContentText());
    role = r && r.role ? String(r.role) : '';
  } catch (e) { return ''; }
  c.put(key, role, 600);
  return role;
}
const bkkDay_ = (d) => Utilities.formatDate(d || new Date(), 'UTC', 'yyyy-MM-dd');   // ให้ตรงกับแอป (toISOString)
function summarize_(username, name, data, updated) {
  const d = data || {}, cards = cardsOf_(d), sounds = d.sounds || {};
  const ks = Object.keys(cards), now = Date.now();
  const snd = Object.keys(sounds);
  return {
    ชื่อ: name, คำที่จำได้แล้ว: ks.filter((k) => cards[k].box >= 2).length, คำที่เคยเรียน: ks.length, คำศัพท์ทั้งหมดในแอป_ประมาณ: TOTAL_WORDS,
    คำที่ครบรอบทบทวน: ks.filter((k) => cards[k].due <= now).length,
    คำที่ลืมบ่อย: ks.filter((k) => cards[k].box === 0).slice(0, 8),
    เสียงที่ผ่านแล้ว: snd.filter((k) => sounds[k].best >= 70).length, เสียงทั้งหมด: TOTAL_SOUNDS,
    เสียงที่ยังต้องฝึก: snd.filter((k) => sounds[k].best < 70).map((k) => ({ เสียง: k, คะแนนดีสุด: sounds[k].best })),
    เรียนต่อเนื่อง_วัน: d.last === bkkDay_() || d.last === bkkDay_(new Date(Date.now() - 864e5)) ? (d.streak || 0) : 0,
    เรียนล่าสุด: updated ? bkkDay_(new Date(updated)) : ''
  };
}
function findLearner_(name) {
  const want = String(name || '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (!want) return null;
  const v = users_().getDataRange().getValues();
  let hit = null;
  for (let i = 1; i < v.length; i++) {
    const u = String(v[i][0]), n = String(v[i][1] || '').toLowerCase().replace(/\s+/g, ' ');
    if (u.indexOf('hub:') !== 0) continue;
    if (u === 'hub:' + want || n === want) return { username: u, name: String(v[i][1]) };
    if (!hit && (n.indexOf(want) >= 0 || want.indexOf(n) >= 0)) hit = { username: u, name: String(v[i][1]) };
  }
  return hit;
}
function robotUser_(b) {
  if (!hubRole_(b.hubUser, b.hubPass)) return { ok: false, msg: 'ชื่อ/รหัสศูนย์รวมงานในเครื่องน้องมีไฟใช้ไม่ได้' };
  const who = findLearner_(b.name);
  if (!who) return { ok: true, found: false, msg: 'ยังไม่พบผู้เรียนชื่อนี้ใน English Step (ต้องเข้าแอปจากศูนย์รวมงานอย่างน้อย 1 ครั้ง)' };
  const p = find_(progress_(), who.username);
  return { ok: true, found: true, learner: summarize_(who.username, who.name, p ? progData_(p.vals) : null, p ? p.vals[2] : null) };
}
function robotSummary_(b) {
  if (hubRole_(b.hubUser, b.hubPass) !== 'admin') return { ok: false, msg: 'ภาพรวมผู้เรียนดูได้เฉพาะบัญชีผู้ดูแลระบบ' };
  const v = users_().getDataRange().getValues(), pv = progress_().getDataRange().getValues(), pm = {};
  for (let i = 1; i < pv.length; i++) pm[String(pv[i][0])] = pv[i];
  const out = [];
  for (let i = 1; i < v.length; i++) {
    const u = String(v[i][0]); if (u.indexOf('hub:') !== 0) continue;
    const p = pm[u];
    out.push(summarize_(u, String(v[i][1]), p ? progData_(p) : null, p ? p[2] : null));
  }
  out.sort((a, c) => String(c.เรียนล่าสุด).localeCompare(String(a.เรียนล่าสุด)));
  return { ok: true, ผู้เรียนทั้งหมด: out.length, รายชื่อ: out };
}
/** บันทึกคะแนนฝึกพูดกับน้องมีไฟ เข้าผลเรียนของผู้เรียนคนนั้น */
function robotLog_(b) {
  if (!hubRole_(b.hubUser, b.hubPass)) return { ok: false, msg: 'ชื่อ/รหัสศูนย์รวมงานในเครื่องน้องมีไฟใช้ไม่ได้' };
  const who = findLearner_(b.name);
  if (!who) return { ok: false, found: false, msg: 'ยังไม่พบผู้เรียนชื่อนี้ใน English Step' };
  const sound = String(b.sound || '').slice(0, 10), score = Math.max(0, Math.min(100, Number(b.score) || 0));
  const sh = progress_(), f = find_(sh, who.username);
  const d = (f && progData_(f.vals)) || { cards: {}, sounds: {}, streak: 0, last: '', newToday: 0, newDay: '', showTH: true };
  d.sounds = d.sounds || {};
  if (sound) { const st = d.sounds[sound] || { best: 0, tries: 0 }; st.tries++; st.best = Math.max(st.best, score); d.sounds[sound] = st; }
  const t = bkkDay_(); if (d.last !== t) { d.streak = d.last === bkkDay_(new Date(Date.now() - 864e5)) ? (d.streak || 0) + 1 : 1; d.last = t; }
  writeProg_(sh, f, who.username, JSON.stringify(d));
  return { ok: true, name: who.name };
}

/** ตารางแต้มเกมรายสัปดาห์ (ต่อภาษา) — อ่านจากผลเรียนของทุกคน เก็บผลไว้ 2 นาที */
function board_(b) {
  const me = auth_(b.token);
  if (!me) return { ok: false, auth: false, msg: 'กรุณาเข้าสู่ระบบใหม่' };
  const lang = /^(en|zh|ja)$/.test(String(b.lang)) ? String(b.lang) : 'en';
  const week = String(b.week || '').slice(0, 8);
  const grp = me.indexOf('app:') === 0 ? 'app:' : 'hub:';
  const ck = 'board_' + grp + lang + '_' + week, c = CacheService.getScriptCache(), hit = c.get(ck);
  if (hit) return JSON.parse(hit);
  const names = {}, uv = users_().getDataRange().getValues();
  for (let i = 1; i < uv.length; i++) names[String(uv[i][0])] = String(uv[i][1] || '');
  const pv = progress_().getDataRange().getValues(), list = [];
  for (let i = 1; i < pv.length; i++) {
    const u = String(pv[i][0]); if (u.indexOf(grp) !== 0) continue;
    let d = null; try { d = progData_(pv[i]); } catch (e) { continue; }
    if (!d) continue;
    const g = lang === 'en' ? d.game : (d.L && d.L[lang] && d.L[lang].game);
    if (g && g.wk === week && Number(g.wpts) > 0) list.push({ u: u, name: names[u] || u.slice(4), pts: Number(g.wpts) || 0 });
  }
  list.sort((x, y) => y.pts - x.pts);
  const out = { ok: true, list: list.slice(0, 30), updated: Utilities.formatDate(new Date(), 'Asia/Bangkok', 'HH:mm') };
  c.put(ck, JSON.stringify(out), 120);
  return out;
}

/** กดรันครั้งเดียวเพื่อขอสิทธิ์เชื่อมต่อภายนอก (UrlFetchApp) */
function authorizeHub() { if (APPS_URL.indexOf('http') === 0) UrlFetchApp.fetch(APPS_URL, { muteHttpExceptions: true }); UrlFetchApp.fetch(HUB_URL, { method: 'post', contentType: 'text/plain', payload: JSON.stringify({ action: 'whoAmI' }), muteHttpExceptions: true }); }

/** รันครั้งแรกครั้งเดียว เพื่อสร้างชีตทั้งหมด */
function setup() { users_(); sessions_(); progress_(); }

function doGet() { return out_({ ok: true, app: 'english-step' }); }

function doPost(e) {
  let r;
  try {
    const b = JSON.parse(e.postData.contents);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try { r = route_(b); } finally { lock.releaseLock(); }
  } catch (err) {
    r = { ok: false, msg: 'ระบบขัดข้อง: ' + (err && err.message ? err.message : err) };
  }
  return out_(r);
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function route_(b) {
  switch (b.action) {
    case 'hubAuth': return hubAuth_(b);
    case 'appAuth': return appAuth_(b);
    case 'robotUser': return robotUser_(b);
    case 'robotSummary': return robotSummary_(b);
    case 'robotLog': return robotLog_(b);
    case 'board': return board_(b);
    case 'register':
    case 'login': return { ok: false, msg: 'กรุณาเข้าสู่ระบบด้วยบัญชีศูนย์รวมงาน' };
    case 'load': return load_(b);
    case 'save': return save_(b);
    case 'logout': return logout_(b);
    default: return { ok: false, msg: 'ไม่รู้จักคำสั่ง' };
  }
}

const clean_ = u => String(u || '').trim().toLowerCase();
const safe_ = v => { v = String(v || '').trim(); return /^[=+\-@]/.test(v) ? "'" + v : v; };

/* ผลการเรียนยาวได้ถึง ~360,000 ตัวอักษร: แบ่งเก็บ ช่อง B (ส่วนแรก) + ช่อง D เป็นต้นไป (ส่วนต่อ) เพราะ 1 ช่องเก็บได้ไม่เกิน 50,000 */
const PART = 45000, MAX_PARTS = 8, PROG_COLS = 2 + MAX_PARTS;
function progJson_(vals) { return String(vals[1] || '') + vals.slice(3).map(String).join(''); }
function progData_(vals) { const t = progJson_(vals); return t ? JSON.parse(t) : null; }
function writeProg_(sh, f, username, json) {
  const parts = []; for (let i = 0; i < json.length; i += PART) parts.push(json.slice(i, i + PART));
  if (!parts.length) parts.push('{}');
  const row = [username, parts[0], new Date()].concat(parts.slice(1));
  while (row.length < PROG_COLS + 1) row.push('');
  if (f) sh.getRange(f.row, 1, 1, row.length).setValues([row]); else sh.appendRow(row);
}
function cardsOf_(d) {
  if (d && d.cz != null) { const c = {}; String(d.cz).split('\n').forEach((l) => { const x = l.split('\t'); if (x.length === 3) c[x[0]] = { box: +x[1], due: +x[2] * 864e5 }; }); return c; }
  return (d && d.cards) || {};
}

function hash_(salt, pw) {
  let h = salt + ':' + pw;
  for (let i = 0; i < 300; i++) {
    h = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, h + salt, Utilities.Charset.UTF_8));
  }
  return h;
}

function find_(sh, key) {
  const v = sh.getDataRange().getValues();
  for (let i = 1; i < v.length; i++) if (String(v[i][0]) === key) return { row: i + 1, vals: v[i] };
  return null;
}

function newSession_(username) {
  const token = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
  const sh = sessions_();
  sh.appendRow([token, username, new Date(Date.now() + SESSION_DAYS * 864e5)]);
  // ล้าง session ที่หมดอายุ (ทำนานๆ ครั้ง)
  if (Math.random() < 0.1) {
    const v = sh.getDataRange().getValues(), now = new Date();
    for (let i = v.length - 1; i >= 1; i--) if (new Date(v[i][2]) < now) sh.deleteRow(i + 1);
  }
  return token;
}

function auth_(token) {
  if (!token) return null;
  const f = find_(sessions_(), String(token));
  if (!f || new Date(f.vals[2]) < new Date()) return null;
  return String(f.vals[1]);
}

function profile_(username) {
  const f = find_(users_(), username);
  return f ? { username: username, name: String(f.vals[1]), role: String(f.vals[5] || 'learner') } : null;
}

function register_(b) {
  const u = clean_(b.username), pw = String(b.password || ''), name = String(b.name || '').trim();
  if (!/^[a-z0-9_.]{3,20}$/.test(u)) return { ok: false, msg: 'ชื่อผู้ใช้ต้องเป็น a-z, 0-9, _ หรือ . ยาว 3–20 ตัว' };
  if (pw.length < 6) return { ok: false, msg: 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัว' };
  if (!name || name.length > 40) return { ok: false, msg: 'กรุณาใส่ชื่อที่ใช้แสดง (ไม่เกิน 40 ตัว)' };
  const sh = users_();
  if (find_(sh, u)) return { ok: false, msg: 'ชื่อผู้ใช้นี้มีคนใช้แล้ว' };
  const salt = Utilities.getUuid();
  sh.appendRow([u, safe_(name), salt, hash_(salt, pw), new Date(), 'learner', new Date()]);
  return { ok: true, token: newSession_(u), user: profile_(u), data: null };
}

function login_(b) {
  const u = clean_(b.username), pw = String(b.password || '');
  const cache = CacheService.getScriptCache(), ck = 'fail_' + u;
  const fails = Number(cache.get(ck) || 0);
  if (fails >= MAX_FAIL) return { ok: false, msg: 'ใส่รหัสผิดหลายครั้ง กรุณารอ ' + LOCK_MIN + ' นาที' };
  const sh = users_(), f = find_(sh, u);
  if (!f || hash_(String(f.vals[2]), pw) !== String(f.vals[3])) {
    cache.put(ck, String(fails + 1), LOCK_MIN * 60);
    return { ok: false, msg: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  }
  cache.remove(ck);
  sh.getRange(f.row, 7).setValue(new Date());
  const p = find_(progress_(), u);
  return { ok: true, token: newSession_(u), user: profile_(u), data: p ? progData_(p.vals) : null, updated: p ? p.vals[2] : null };
}

function load_(b) {
  const u = auth_(b.token);
  if (!u) return { ok: false, auth: false, msg: 'กรุณาเข้าสู่ระบบใหม่' };
  const p = find_(progress_(), u);
  return { ok: true, user: profile_(u), data: p ? progData_(p.vals) : null };
}

function save_(b) {
  const u = auth_(b.token);
  if (!u) return { ok: false, auth: false, msg: 'กรุณาเข้าสู่ระบบใหม่' };
  const json = JSON.stringify(b.data || {});
  if (json.length > PART * MAX_PARTS) return { ok: false, msg: 'ข้อมูลใหญ่เกินไป' };
  const sh = progress_();
  writeProg_(sh, find_(sh, u), u, json);
  return { ok: true };
}

function logout_(b) {
  const f = b.token && find_(sessions_(), String(b.token));
  if (f) sessions_().deleteRow(f.row);
  return { ok: true };
}
