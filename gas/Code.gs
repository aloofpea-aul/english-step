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
  return { ok: true, token: newSession_(u), user: { username: u, name: name, role: r.role }, data: p ? JSON.parse(p.vals[1]) : null };
}

/** กดรันครั้งเดียวเพื่อขอสิทธิ์เชื่อมต่อภายนอก (UrlFetchApp) */
function authorizeHub() { UrlFetchApp.fetch(HUB_URL, { method: 'post', contentType: 'text/plain', payload: JSON.stringify({ action: 'whoAmI' }), muteHttpExceptions: true }); }

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
  return { ok: true, token: newSession_(u), user: profile_(u), data: p ? JSON.parse(p.vals[1]) : null, updated: p ? p.vals[2] : null };
}

function load_(b) {
  const u = auth_(b.token);
  if (!u) return { ok: false, auth: false, msg: 'กรุณาเข้าสู่ระบบใหม่' };
  const p = find_(progress_(), u);
  return { ok: true, user: profile_(u), data: p ? JSON.parse(p.vals[1]) : null };
}

function save_(b) {
  const u = auth_(b.token);
  if (!u) return { ok: false, auth: false, msg: 'กรุณาเข้าสู่ระบบใหม่' };
  const json = JSON.stringify(b.data || {});
  if (json.length > 45000) return { ok: false, msg: 'ข้อมูลใหญ่เกินไป' };
  const sh = progress_(), f = find_(sh, u);
  if (f) sh.getRange(f.row, 2, 1, 2).setValues([[json, new Date()]]);
  else sh.appendRow([u, json, new Date()]);
  return { ok: true };
}

function logout_(b) {
  const f = b.token && find_(sessions_(), String(b.token));
  if (f) sessions_().deleteRow(f.row);
  return { ok: true };
}
