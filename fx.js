/* ===== ความสนุก: น้องมีไฟ (ตัวการ์ตูน) · XP/ขั้นผู้เล่น · ภารกิจประจำวัน · หีบสมบัติ · เอฟเฟกต์ =====
 * เก็บในผลเรียนของแต่ละภาษา: P().xp (สะสม) · P().day = {d, rev, snd, gpts, chest}
 * ทุกอย่างวาดด้วยโค้ด (SVG/CSS) ไม่มีไฟล์ภาพ ไม่มีค่าใช้จ่าย */
(function(){
const css=document.createElement('style');css.textContent=`
.fx-bob{animation:fxbob 2.4s ease-in-out infinite;transform-origin:50% 90%}@keyframes fxbob{50%{transform:translateY(-6px) rotate(-2deg)}}
.fx-blink{animation:fxbl 4s infinite;transform-box:fill-box;transform-origin:center}@keyframes fxbl{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
.fx-spark{animation:fxsp 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}@keyframes fxsp{50%{opacity:.25;transform:scale(.6)}}
.fx-flame{animation:fxfl .9s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}@keyframes fxfl{to{transform:scaleY(1.12) scaleX(.92)}}
.fx-pop{animation:fxpop .5s cubic-bezier(.3,1.6,.5,1) both}@keyframes fxpop{from{transform:scale(.3);opacity:0}}
.fx-shake{animation:fxsh .4s}@keyframes fxsh{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
.fx-jump{animation:fxjp .6s ease}@keyframes fxjp{40%{transform:translateY(-14px) scale(1.06)}}
.fx-xp{height:12px;border-radius:6px;background:#E1F5EE;overflow:hidden}.fx-xp>i{display:block;height:100%;background:#1D9E75;border-radius:6px;transition:width 1.2s ease-out}
.fx-pill{border-radius:999px;padding:3px 10px;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
.fx-hero{display:flex;align-items:center;gap:10px;background:#E6F1FB;border-radius:18px;padding:10px 12px}
.fx-bub{background:#fff;border-radius:12px 12px 12px 2px;padding:8px 10px;font-size:14px;color:#16213E}
.fx-q{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:12px;background:#EEF0F5;font-size:15px}
.fx-q.done{background:#EAF3DE;color:#27500A}.fx-q b{font-weight:600}
.fx-gc{border:none;border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:2px;text-align:left;font:inherit;transition:transform .15s;min-height:104px}.fx-gc:active{transform:scale(.96)}
.fx-toast{position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:50;background:#1D9E75;color:#fff;font-weight:700;border-radius:999px;padding:6px 16px;pointer-events:none;animation:fxtoast 1.4s ease forwards}
@keyframes fxtoast{0%{opacity:0;transform:translate(-50%,10px)}15%{opacity:1;transform:translate(-50%,0)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-18px)}}
.fx-conf{position:absolute;inset:0;pointer-events:none;overflow:hidden}.fx-conf span{position:absolute;top:-14px;width:8px;height:12px;border-radius:2px;animation:fxcf 2.4s linear forwards}
@keyframes fxcf{to{transform:translateY(520px) rotate(620deg);opacity:.15}}
.opt.ok{animation:fxpop .4s cubic-bezier(.3,1.6,.5,1)}.opt.bad{animation:fxsh .4s}
@media (prefers-reduced-motion:reduce){.fx-bob,.fx-blink,.fx-spark,.fx-flame{animation:none}}`;
(document.head||document.documentElement).appendChild(css);

/* ---------- น้องมีไฟ ---------- */
const MOOD={happy:'M39 55q7 7 14 0',wow:'M41 54q5 9 10 0q-5 4-10 0',cheer:'M38 53q8 12 16 0z',think:'M40 57q6-3 12 0'};
function mascot(size,mood){size=size||92;const h=Math.round(size*104/92);
 return `<svg class="fx-bob fx-mascot" width="${size}" height="${h}" viewBox="0 0 92 104" role="img" aria-label="น้องมีไฟ" style="flex:none;cursor:pointer">
 <path class="fx-spark" d="M12 14l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill="#EF9F27"/><path class="fx-spark" style="animation-delay:.8s" d="M80 24l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#EF9F27"/>
 <rect x="33" y="78" width="26" height="14" rx="4" fill="#888780"/><rect x="36" y="92" width="20" height="6" rx="3" fill="#5F5E5A"/>
 <path d="M46 10c-19 0-32 14-32 30 0 12 7 19 13 25 4 4 6 8 6 13h26c0-5 2-9 6-13 6-6 13-13 13-25 0-16-13-30-32-30z" fill="#FAC775"/>
 <path d="M30 32c3-8 10-12 18-12" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".7"/>
 <g class="fx-blink"><ellipse cx="37" cy="44" rx="4.5" ry="6" fill="#412402"/><ellipse cx="56" cy="44" rx="4.5" ry="6" fill="#412402"/></g>
 <circle cx="30" cy="54" r="4" fill="#F0997B" opacity=".7"/><circle cx="63" cy="54" r="4" fill="#F0997B" opacity=".7"/>
 <path class="fx-mouth" d="${MOOD[mood]||MOOD.happy}" stroke="#412402" stroke-width="3" stroke-linecap="round" fill="${mood==='cheer'?'#993C1D':'none'}"/>
 <path d="M40 66l6-10 1 7 6-1-7 10-1-7z" fill="#EF9F27"/></svg>`}
const FLAME='<svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true"><path class="fx-flame" d="M7 1C8 5 12 6 12 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3C6 6 6 3 7 1z" fill="#EF9F27"/></svg>';
const CHEST='<svg width="26" height="24" viewBox="0 0 22 20" aria-hidden="true"><rect x="1" y="7" width="20" height="12" rx="3" fill="#BA7517"/><path d="M1 9a10 6 0 0120 0z" fill="#EF9F27"/><rect x="9" y="9" width="4" height="5" rx="1" fill="#FAEEDA"/></svg>';
const ICON={
 match:'<svg width="54" height="40" viewBox="0 0 54 40" aria-hidden="true"><rect x="4" y="6" width="22" height="30" rx="4" fill="#AFA9EC" transform="rotate(-10 15 21)"/><rect x="26" y="4" width="22" height="30" rx="4" fill="#534AB7" transform="rotate(8 37 19)"/><text x="37" y="24" text-anchor="middle" fill="#EEEDFE" font-size="13" font-weight="700" transform="rotate(8 37 19)">A</text></svg>',
 listen:'<svg width="54" height="40" viewBox="0 0 54 40" aria-hidden="true"><path d="M8 26a19 19 0 0138 0" stroke="#0F6E56" stroke-width="4" fill="none"/><rect x="4" y="22" width="10" height="14" rx="4" fill="#1D9E75"/><rect x="40" y="22" width="10" height="14" rx="4" fill="#1D9E75"/><path class="fx-spark" d="M27 6v6M21 9l2 4M33 9l-2 4" stroke="#5DCAA5" stroke-width="2.5" stroke-linecap="round"/></svg>',
 speak:'<svg width="54" height="40" viewBox="0 0 54 40" aria-hidden="true"><rect x="20" y="4" width="14" height="22" rx="7" fill="#D85A30"/><path d="M14 18a13 13 0 0026 0M27 31v5" stroke="#993C1D" stroke-width="3" fill="none" stroke-linecap="round"/><path class="fx-spark" d="M44 10q4 6 0 12M48 6q7 10 0 20" stroke="#F0997B" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>',
 order:'<svg width="54" height="40" viewBox="0 0 54 40" aria-hidden="true"><rect x="4" y="8" width="16" height="12" rx="3" fill="#ED93B1"/><rect x="22" y="8" width="12" height="12" rx="3" fill="#D4537E"/><rect x="36" y="8" width="14" height="12" rx="3" fill="#993556"/><rect class="fx-bob" x="16" y="24" width="22" height="12" rx="3" fill="#F4C0D1"/></svg>',
 trophy:'<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><path d="M9 4h16v8a8 8 0 01-16 0z" fill="#EF9F27"/><path d="M9 7H4a5 5 0 005 6M25 7h5a5 5 0 01-5 6" stroke="#BA7517" stroke-width="2.5" fill="none"/><rect x="14" y="20" width="6" height="6" fill="#BA7517"/><rect x="10" y="26" width="14" height="4" rx="2" fill="#854F0B"/></svg>'};
const GCOL={match:['#EEEDFE','#3C3489','#534AB7'],listen:['#E1F5EE','#085041','#0F6E56'],speak:['#FAECE7','#712B13','#993C1D'],order:['#FBEAF0','#72243E','#993556']};

/* ---------- เสียงเอฟเฟกต์ (สังเคราะห์ในเครื่อง) ---------- */
let AC=null;function tone(fs,dur,type,vol){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime;
 fs.forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(0,t+i*dur);g.gain.linearRampToValueAtTime(vol||.12,t+i*dur+.01);g.gain.exponentialRampToValueAtTime(.001,t+(i+1)*dur);o.connect(g).connect(AC.destination);o.start(t+i*dur);o.stop(t+(i+1)*dur+.02)})}catch(e){}}
const sfx={ok:()=>tone([880,1320],.09),bad:()=>tone([220,160],.12,'square',.05),win:()=>tone([523,659,784,1047],.11,'triangle',.12),xp:()=>tone([1046],.07,'sine',.06)};

/* ---------- XP · ขั้นผู้เล่น · ภารกิจ ---------- */
const today=()=>new Date().toISOString().slice(0,10);
function DAYQ(){const p=P();if(!p.day||p.day.d!==today())p.day={d:today(),rev:0,snd:0,gpts:0,chest:false};return p.day}
const QUESTS=[{k:'rev',goal:10,icon:'ti-cards',t:n=>`ทบทวนศัพท์ ${n} คำ`},{k:'snd',goal:1,icon:'ti-microphone',t:()=>'ออกเสียงผ่าน 1 บท (70+)'},{k:'gpts',goal:100,icon:'ti-device-gamepad-2',t:n=>`เล่นเกมให้ได้ ${n} แต้ม`}];
function rankOf(xp){let lv=1,need=100,left=xp||0;while(left>=need){left-=need;lv++;need=100+lv*20}return{lv,cur:left,need}}
const RANKN=['','มือใหม่','หัดพูด','เริ่มคล่อง','นักสื่อสาร','ดาวรุ่ง','มือโปร','เซียนภาษา','ตำนาน'];
const rankName=lv=>RANKN[Math.min(lv,RANKN.length-1)]+(lv>=RANKN.length-1?' '+(lv-RANKN.length+2):'');
function toast(t,col){const n=document.createElement('div');n.className='fx-toast';if(col)n.style.background=col;n.textContent=t;document.body.appendChild(n);setTimeout(()=>n.remove(),1500)}
function addXP(n,silent){if(!n)return;const p=P(),before=rankOf(p.xp||0).lv;p.xp=(p.xp||0)+n;const after=rankOf(p.xp).lv;
 if(!silent){toast('+'+n+' XP');sfx.xp()}if(after>before)setTimeout(()=>{toast('เลื่อนขั้นเป็น '+rankName(after)+'!','#534AB7');sfx.win()},900)}
function quest(k,n){const q=DAYQ();const Q=QUESTS.find(x=>x.k===k);const was=q[k]>=Q.goal;q[k]=(q[k]||0)+n;if(!was&&q[k]>=Q.goal){setTimeout(()=>{toast('ภารกิจสำเร็จ: '+Q.t(Q.goal),'#BA7517');sfx.win()},500);addXP(15,true)}}
const questsDone=()=>{const q=DAYQ();return QUESTS.filter(x=>(q[x.k]||0)>=x.goal).length};
function confetti(el){const c=document.createElement('div');c.className='fx-conf';const cols=['#7F77DD','#1D9E75','#EF9F27','#D4537E','#378ADD'];
 for(let i=0;i<26;i++){const s=document.createElement('span');s.style.left=Math.random()*100+'%';s.style.background=cols[i%5];s.style.animationDelay=Math.random()*1.2+'s';c.appendChild(s)}
 (el||app).style.position='relative';(el||app).appendChild(c);setTimeout(()=>c.remove(),4000)}

/* ---------- ส่วนประกอบหน้าหลัก ---------- */
const TALK={en:['Hello! วันนี้ฝึกกันนิดนะ','พูดผิดไม่เป็นไร พูดบ่อยๆ เก่งเอง','ฝึกวันละนิด เก่งขึ้นทุกวัน','Good job! ทำต่อไปนะ'],
 zh:['你好! วันนี้ฝึกวรรณยุกต์กัน','ชี้มือตามเสียงขึ้นลง จำง่ายขึ้นนะ','加油! สู้ๆ','ฝึกวันละนิด เก่งขึ้นทุกวัน'],
 ja:['こんにちは! วันนี้ฝึกกันนิดนะ','สระยาวต้องลากให้ครบจังหวะนะ','がんばって! สู้ๆ','ฝึกวันละนิด เก่งขึ้นทุกวัน']};
function heroHTML(){const p=P(),r=rankOf(p.xp||0),done=questsDone(),left=3-done;
 const line=left?`วันนี้อีก ${left} ภารกิจก็ได้เปิดหีบสมบัติแล้ว!`:(DAYQ().chest?'วันนี้ครบแล้ว เก่งมาก! พรุ่งนี้มาต่อนะ':'ครบ 3 ภารกิจแล้ว เปิดหีบสมบัติเลย!');
 return `<div class="fx-hero">${mascot(88)}<div style="flex:1;min-width:0"><div class="fx-bub" id="fxBub">${esc(line)}</div>
 <div style="margin-top:8px;font-size:13px;color:#0C447C;font-weight:600">ขั้น ${r.lv} · ${esc(rankName(r.lv))}</div><div class="fx-xp"><i id="fxBar" style="width:0"></i></div>
 <div style="font-size:12px;color:#185FA5;margin-top:2px">${r.cur} / ${r.need} XP ถึงขั้นถัดไป</div></div></div>`}
function pillsHTML(){const p=P();return `<span class="row" style="gap:6px"><span class="fx-pill" style="background:#FAEEDA;color:#633806">${FLAME}${D.streak||0} วัน</span><span class="fx-pill" style="background:#EEEDFE;color:#3C3489">★ ${p.xp||0}</span></span>`}
function questsHTML(){const q=DAYQ(),done=questsDone();
 return `<div class="card" style="gap:8px"><div class="row" style="justify-content:space-between;align-items:center"><h2>ภารกิจวันนี้</h2><span class="mut">${done}/3</span></div>`+
 QUESTS.map(x=>{const v=Math.min(q[x.k]||0,x.goal),ok=v>=x.goal;return `<div class="fx-q ${ok?'done':''}"><i class="ti ${ok?'ti-check':x.icon}" style="font-size:20px" aria-hidden="true"></i><span style="flex:1">${esc(x.t(x.goal))}</span><span style="font-size:13px">${ok?'+15 XP':v+'/'+x.goal}</span></div>`}).join('')+
 `<button class="fx-q" id="fxChest" style="border:1.5px dashed #EF9F27;background:${done===3&&!q.chest?'#FAEEDA':'transparent'};width:100%;font:inherit;text-align:left;color:#633806;cursor:pointer"><span class="${done===3&&!q.chest?'fx-bob':''}" style="display:flex">${CHEST}</span><span style="flex:1">${q.chest?'เปิดหีบวันนี้แล้ว':'ครบ 3 ภารกิจ เปิดหีบสมบัติ'}</span><span style="font-size:13px">${q.chest?'✓':done+'/3'}</span></button></div>`}
function gamesHTML(){const g=(P().game||{}),best=g.best||{};const GN=(window.GAPI&&GAPI.GN)||{match:'จับคู่คำ',listen:'ฟังแล้วเลือก',speak:'พูดให้ทัน',order:'เรียงประโยค'};const pick=['adv','match','rain','listen','dialog','tf'].filter(k=>GN[k]&&GCOL[k]&&ICON[k]);const names={};(pick.length>=4?pick:Object.keys(GN).slice(0,4)).forEach(k=>names[k]=GN[k]);
 return `<div class="g2">${Object.keys(names).map(k=>{const c=GCOL[k];return `<button class="fx-gc" data-fxg="${k}" style="background:${c[0]}">${ICON[k]}<span style="font-weight:700;color:${c[1]}">${names[k]}</span><span style="font-size:12px;color:${c[2]}">${best[k]?'ดีสุด '+best[k]:'ยังไม่เคยเล่น'}</span></button>`}).join('')}</div>
 <button class="soft" id="fxAllG" style="width:100%">ดูเกมทั้งหมด ${Object.keys(GN).filter(k=>k!=='board').length} เกม</button>
 <button class="fx-q" id="fxBoard" style="background:#FAEEDA;border:none;width:100%;font:inherit;text-align:left;cursor:pointer">${ICON.trophy}<span style="flex:1"><span style="display:block;font-weight:700;color:#633806" id="fxRank">ตารางแต้มประจำสัปดาห์</span><span style="font-size:12px;color:#854F0B" id="fxRank2">แต้มสัปดาห์นี้ ${g.wk===window.weekKeyNow()?g.wpts||0:0}</span></span><i class="ti ti-chevron-right" style="color:#854F0B" aria-hidden="true"></i></button>`}
function bindHome(){const lines=TALK[LANG]||TALK.en;let li=-1;
 requestAnimationFrame(()=>{const b=$('#fxBar');if(b){const r=rankOf(P().xp||0);b.style.width=Math.round(r.cur/r.need*100)+'%'}});
 const m=app.querySelector('.fx-mascot');if(m)m.onclick=()=>{li=(li+1)%lines.length;const bub=$('#fxBub');bub.textContent=lines[li];bub.classList.remove('fx-pop');void bub.offsetWidth;bub.classList.add('fx-pop');
  const mo=m.querySelector('.fx-mouth');mo.setAttribute('d',MOOD.cheer);mo.setAttribute('fill','#993C1D');m.classList.remove('fx-jump');void m.getBoundingClientRect();m.classList.add('fx-jump');sfx.xp();
  setTimeout(()=>{mo.setAttribute('d',MOOD.happy);mo.setAttribute('fill','none')},700)};
 app.querySelectorAll('[data-fxg]').forEach(b=>b.onclick=()=>{b.classList.add('fx-pop');setTimeout(()=>window.game(b.dataset.fxg),150)});
 const ag=$('#fxAllG');if(ag)ag.onclick=()=>go('games');const bd=$('#fxBoard');if(bd)bd.onclick=()=>window.game('board');
 const ch=$('#fxChest');if(ch)ch.onclick=openChest;
 // อันดับของฉันสัปดาห์นี้ (ถ้าหลังบ้านพร้อม)
 if(AUTH&&window.weekKeyNow)api('board',{token:AUTH.token,lang:LANG,week:window.weekKeyNow()}).then(r=>{if(!r||!r.ok||!Array.isArray(r.list)||!$('#fxRank'))return;
  const i=r.list.findIndex(x=>x.u===AUTH.user.username);if(i<0){$('#fxRank').textContent='ยังไม่ติดอันดับสัปดาห์นี้';$('#fxRank2').textContent=r.list.length?`อันดับ 1 มี ${r.list[0].pts} แต้ม · เล่นเกมเพื่อขึ้นตาราง`:'เป็นคนแรกบนตารางเลย';return}
  $('#fxRank').textContent=`อันดับ ${i+1} ของสาขาสัปดาห์นี้`;$('#fxRank2').textContent=i?`อีก ${r.list[i-1].pts-r.list[i].pts+1} แต้มแซงอันดับ ${i}`:'นำเป็นอันดับ 1 อยู่!'}).catch(()=>{})}
function openChest(){const q=DAYQ();if(q.chest){toast('เปิดหีบวันนี้แล้ว พรุ่งนี้มาใหม่นะ','#5F5E5A');return}
 if(questsDone()<3){const b=$('#fxChest');b.classList.remove('fx-shake');void b.offsetWidth;b.classList.add('fx-shake');toast('ทำภารกิจให้ครบ 3 ข้อก่อนนะ','#854F0B');return}
 q.chest=true;const prize=[30,40,50,60,80][Math.floor(Math.random()*5)];
 app.insertAdjacentHTML('afterbegin',`<div class="hero fx-pop" id="fxPrize" style="background:#BA7517;align-items:center;text-align:center;position:relative;overflow:hidden">
  <svg width="90" height="80" viewBox="0 0 22 20" class="fx-jump"><rect x="1" y="9" width="20" height="10" rx="3" fill="#854F0B"/><path d="M1 7a10 6 0 0120 0v2H1z" fill="#EF9F27" transform="rotate(-18 1 9)"/><circle cx="11" cy="8" r="3" fill="#FAC775"/></svg>
  <div style="font-size:20px;font-weight:700">หีบสมบัติวันนี้</div><div style="font-size:40px;font-weight:700;line-height:1">+${prize} XP</div><div style="opacity:.9">ครบภารกิจ 3 ข้อ เก่งมาก!</div></div>`);
 confetti($('#fxPrize'));sfx.win();addXP(prize,true);save(D);window.scrollTo(0,0);setTimeout(()=>{if($('#fxPrize'))home()},2600)}

window.FX={mascot,heroHTML,pillsHTML,questsHTML,gamesHTML,bindHome,addXP,quest,confetti,sfx,toast,rankOf,rankName,ICON,GCOL,DAYQ,questsDone};
})();
