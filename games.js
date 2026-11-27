/* ===== เกมภาษา: จับคู่คำ · ฟังแล้วเลือก · พูดให้ทัน · เรียงประโยค · ศึกชิงแต้ม =====
 * ใช้ศัพท์ของภาษาที่เลือกอยู่ (อังกฤษ/จีน/ญี่ปุ่น) ตามระดับที่เรียน + คำที่เคยเรียนแล้ว
 * แต้มเก็บใน P().game = {wk:'2026-W48', wpts, tot, best:{match,listen,speak,order}} แล้วซิงก์ขึ้นหลังบ้านพร้อมผลเรียน */
(function(){
const GAMES=[
 {id:'match',icon:'🃏',name:'จับคู่คำ',desc:'พลิกการ์ดจับคู่คำกับความหมาย 6 คู่ ให้ทันเวลา'},
 {id:'listen',icon:'🎧',name:'ฟังแล้วเลือก',desc:'ฟังเสียงแล้วเลือกคำที่ได้ยิน 10 ข้อ'},
 {id:'speak',icon:'🎤',name:'พูดให้ทัน',desc:'พูดคำที่ขึ้นมาให้ถูก ภายใน 60 วินาที'},
 {id:'order',icon:'🧩',name:'เรียงประโยค',desc:'แตะคำเรียงเป็นประโยคให้ถูก 5 ข้อ'}
];
const GN=Object.fromEntries(GAMES.map(g=>[g.id,g.name]));
const sh=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function weekKey(d){d=new Date(d||Date.now());const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-day);
 const y=t.getUTCFullYear(),w=Math.ceil(((t-Date.UTC(y,0,1))/864e5+1)/7);return y+'-W'+String(w).padStart(2,'0')}
function G(){const p=P();const g=p.game||(p.game={wk:'',wpts:0,tot:0,best:{}});const wk=weekKey();if(g.wk!==wk){g.wk=wk;g.wpts=0}g.best=g.best||{};return g}
function addPts(id,pts){const g=G();g.wpts+=pts;g.tot=(g.tot||0)+pts;const nb=pts>(g.best[id]||0);if(nb)g.best[id]=pts;touch();return nb}
// คำที่ใช้เล่น: ระดับที่เรียนอยู่ + คำที่เคยเรียนแล้ว (ทุกระดับ)
function pool(){const Pr=P(),C=Pr.cards,lv=Pr.lv||0;const seen=Object.keys(C).map(w=>BYW[w]).filter(Boolean);
 const cur=inLv(lv);const m=new Map();[...seen,...cur].forEach(e=>{if(e&&e.th)m.set(e.w,e)});let a=[...m.values()];
 if(a.length<12)a=ALL.filter(e=>e.lv<=Math.max(lv,1));return a}
const shortTh=t=>String(t||'').split(/[\/,(]/)[0].trim();
const wordHTML=(e,big)=>`<span style="font-weight:700;${CJK?'font-size:'+(big?30:22)+'px':'font-size:'+(big?24:17)+'px'}">${esc(e.w)}</span>${pyw(e.w)}${D.showRD&&e.rd?`<span class="rd">${rdHTML(e.rd)}</span>`:''}`;
function head(title,sub){return `<div class="row" style="align-items:center"><button class="back" id="gbk" aria-label="กลับ">${BACK}</button><div style="flex:1"><h1>${esc(title)}</h1>${sub?`<div class="mut" id="gsub">${sub}</div>`:''}</div></div>`}
function needWords(cb){if(!allReady){app.innerHTML='<div class="mut">กำลังโหลดคำศัพท์…</div>';loadAll().then(()=>{allReady=true;cb()});return false}return true}
let RUN=0;// กันตัวจับเวลาของเกมเก่าทำงานต่อเมื่อเปลี่ยนหน้า
const stars=(n)=>'★★★'.slice(0,n)+'☆☆☆'.slice(0,3-n);
function finish(id,pts,detail,again){const nb=addPts(id,pts);const g=G();const xp=Math.round(pts/10)+5;FX.quest('gpts',pts);FX.addXP(xp,true);save(D);
 const st=pts>=100?3:pts>=50?2:pts>0?1:0,c=FX.GCOL[id]||['#E6F1FB','#0C447C','#185FA5'];
 const star=(on,d)=>`<svg class="fx-pop" style="animation-delay:${d}s" width="44" height="44" viewBox="0 0 24 24"><path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.5 5.8 21l1.4-7L2 9.3l7-.8z" fill="${on?'#EF9F27':'#D3D1C7'}"/></svg>`;
 app.innerHTML=head(GN[id])+`<div class="hero" id="fin" style="align-items:center;text-align:center;background:${c[0]};color:${c[1]}">
 <div class="row" style="justify-content:center;gap:2px">${star(st>=1,.1)}${star(st>=2,.25)}${star(st>=3,.4)}</div>
 ${FX.mascot(80,st>=2?'cheer':st?'happy':'think')}
 <div style="font-size:20px;font-weight:700" class="fx-pop">${st>=3?'สุดยอด!':st>=2?'เก่งมาก!':st?'ดีแล้ว ลองอีกนะ':'ไม่เป็นไร ลองใหม่นะ'}</div>
 <div style="font-size:44px;font-weight:700;line-height:1;color:${c[2]}" class="fx-pop">+${pts}</div><div>${detail}</div>
 <div class="row" style="justify-content:center;gap:6px">${nb?'<span class="fx-pill" style="background:#EEEDFE;color:#3C3489">สถิติใหม่</span>':''}<span class="fx-pill" style="background:#EAF3DE;color:#27500A">+${xp} XP</span><span class="fx-pill" style="background:#FAEEDA;color:#633806">ภารกิจ ${FX.questsDone()}/3</span></div></div>
 <div class="card"><div class="row" style="justify-content:space-between"><span>แต้มสัปดาห์นี้ (${esc(LP.thName)})</span><b>${g.wpts}</b></div><div class="row" style="justify-content:space-between"><span class="mut">สถิติดีสุดเกมนี้</span><span>${g.best[id]||0}</span></div></div>
 <div class="g2"><button class="btn org" id="gag">เล่นอีกรอบ</button><button class="soft" id="gls">เลือกเกมอื่น</button></div><button class="soft" id="gbd">ดูตารางแต้ม</button>`;
 if(st)FX.confetti($('#fin'));FX.sfx[st?'win':'bad']();
 $('#gbk').onclick=()=>go('games');$('#gag').onclick=again;$('#gls').onclick=()=>go('games');$('#gbd').onclick=()=>game('board')}

/* ---------- หน้ารวมเกม ---------- */
window.games=function(){RUN++;if(!needWords(window.games))return;const g=G(),n=pool().length;
 app.innerHTML=`<h1>เกมภาษา${CJK?' · '+esc(LP.thName):''}</h1>${langRow()}
 <div class="hero" style="flex-direction:row;align-items:center;gap:10px">${FX.mascot(70)}<div style="flex:1"><div style="opacity:.9;font-size:14px">แต้มสัปดาห์นี้</div><div style="font-size:34px;font-weight:700;line-height:1.1">${g.wpts}</div><button class="btn white" id="gboard" style="margin-top:6px;min-height:38px">ตารางแต้ม</button></div></div><div class="mut" style="margin-top:-6px">
 ใช้คำจาก Level ${P().lv||0} และคำที่เคยเรียนแล้ว · ${n} คำ · แต้มรีเซ็ตทุกวันจันทร์</div>`+
 GAMES.map(x=>{const c=FX.GCOL[x.id];return `<button class="fx-gc" data-g="${x.id}" style="background:${c[0]};flex-direction:row;align-items:center;gap:12px;min-height:84px">${FX.ICON[x.id]}<span style="flex:1"><b style="color:${c[1]};font-size:17px">${x.name}</b><br><span style="font-size:13px;color:${c[2]}">${x.desc}</span></span><span class="fx-pill" style="background:#fff;color:${c[1]}">${g.best[x.id]?'ดีสุด '+g.best[x.id]:'ใหม่'}</span></button>`}).join('')+
 `<div class="mut">เปลี่ยนระดับคำได้ที่หน้า "คำศัพท์" · เปิดเสียงลำโพงก่อนเล่นเกมฟังและเกมพูด</div>`;
 app.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>switchLang(b.dataset.lang));
 app.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>game(b.dataset.g));$('#gboard').onclick=()=>game('board')};
function game(id){RUN++;window.scrollTo(0,0);({match,listen:listenG,speak,order,board})[id]()}
window.game=game;window.weekKeyNow=()=>weekKey();

/* ---------- 1) จับคู่คำ ---------- */
function match(){if(!needWords(match))return;const my=RUN;const ws=sh(pool()).slice(0,6);let t0=Date.now(),left=6,miss=0,sel=null,lock=false;const LIM=90;
 const tiles=sh([...ws.map((e,i)=>({k:i,side:'w',e})),...ws.map((e,i)=>({k:i,side:'t',e}))]);
 app.innerHTML=head('จับคู่คำ','แตะคำ แล้วแตะความหมายที่คู่กัน')+`<div class="row" style="justify-content:space-between"><span class="tag" id="mt" style="background:#EEF0F5;color:#16213E">เวลา 0 วิ</span><span class="tag" id="ml" style="background:#D2F0EA;color:#0B5E54">เหลือ 6 คู่</span></div>
 <div class="g3" id="mg">${tiles.map((t,i)=>`<button class="opt w2" data-i="${i}" style="min-height:84px">${t.side==='w'?wordHTML(t.e):`<span style="font-size:15px;font-weight:600">${esc(shortTh(t.e.th))}</span>`}</button>`).join('')}</div>`;
 $('#gbk').onclick=()=>go('games');
 const tick=setInterval(()=>{if(my!==RUN||!$('#mt'))return clearInterval(tick);const s=Math.floor((Date.now()-t0)/1000);$('#mt').textContent='เวลา '+s+' วิ';if(s>=LIM){clearInterval(tick);end()}},300);
 function end(){clearInterval(tick);const s=Math.round((Date.now()-t0)/1000),got=6-left;const st=left?0:s<=30?3:s<=50?2:1;
  const pts=got*10+(left?0:Math.max(0,LIM-s))-miss*2;finish('match',Math.max(0,pts),`${stars(st)} · จับคู่ได้ ${got}/6 คู่ · ${s} วินาที · พลาด ${miss} ครั้ง`,match)}
 app.querySelectorAll('#mg [data-i]').forEach(b=>b.onclick=()=>{if(lock||b.disabled)return;const t=tiles[+b.dataset.i];if(t.side==='w')say(t.e.w);
  if(!sel){sel={b,t};b.style.background='#FFF1C7';return}
  if(sel.b===b){b.style.background='';sel=null;return}
  const a=sel;sel=null;
  if(a.t.k===t.k&&a.t.side!==t.side){[a.b,b].forEach(x=>{x.classList.add('ok');x.disabled=true;x.style.background=''});FX.sfx.ok();left--;$('#ml').textContent='เหลือ '+left+' คู่';if(!left)setTimeout(end,500)}
  else{miss++;lock=true;FX.sfx.bad();[a.b,b].forEach(x=>{x.classList.add('bad');x.style.background=''});setTimeout(()=>{[a.b,b].forEach(x=>x.classList.remove('bad'));lock=false},650)}})}

/* ---------- 2) ฟังแล้วเลือก ---------- */
function listenG(){if(!needWords(listenG))return;const my=RUN;const P0=pool();const qs=sh(P0).slice(0,10);let qi=0,pts=0,ok=0,streak=0;
 function distract(e){const len=[...e.w].length,sid=LP.soundFor?LP.soundFor(e):null;
  const near=sh(P0.filter(x=>x.w!==e.w&&shortTh(x.th)!==shortTh(e.th)&&Math.abs([...x.w].length-len)<=1&&(!sid||LP.soundFor(x)===sid)));
  const rest=sh(P0.filter(x=>x.w!==e.w&&!near.includes(x)));return [...near,...rest].slice(0,3)}
 function q(){if(my!==RUN)return;if(qi>=qs.length)return finish('listen',pts,`ตอบถูก ${ok}/10 ข้อ`,listenG);
  const e=qs[qi],opts=sh([e,...distract(e)]);let done=false;
  app.innerHTML=head('ฟังแล้วเลือก',`ข้อ ${qi+1}/10 · ${pts} แต้ม${streak>=2?' · ติดกัน '+streak+' ข้อ':''}`)+`<div class="bar"><i style="width:${qi*10}%"></i></div>
  <div class="card" style="align-items:center"><button class="mic" id="lp" aria-label="ฟังอีกครั้ง" style="background:var(--blue)"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 010 7M19 5a10 10 0 010 14"/></svg></button><div class="row"><button class="soft" id="ls">ฟังช้า</button></div><div class="mut">ฟังแล้วเลือกคำที่ได้ยิน</div></div>
  <div class="g2" id="lo">${opts.map((o,i)=>`<button class="opt w2" data-i="${i}" style="min-height:76px">${wordHTML(o)}</button>`).join('')}</div><div id="lr"></div>`;
  $('#gbk').onclick=()=>go('games');$('#lp').onclick=()=>say(e.w);$('#ls').onclick=()=>say(e.w,0.55);setTimeout(()=>{if(my===RUN)say(e.w)},250);
  app.querySelectorAll('#lo [data-i]').forEach(b=>b.onclick=()=>{if(done)return;done=true;const o=opts[+b.dataset.i],right=o===e;
   if(right){ok++;streak++;pts+=10+(streak>=3?5:0);b.classList.add('ok');FX.sfx.ok();if(streak>=3)FX.toast('ติดกัน '+streak+' ข้อ! +5','#0F6E56')}else{streak=0;FX.sfx.bad();b.classList.add('bad');app.querySelectorAll('#lo [data-i]')[opts.indexOf(e)].classList.add('ok')}
   $('#lr').innerHTML=`<div class="${right?'okn':'note'}">${right?'ถูกต้อง':'คำที่ได้ยินคือ'} <b>${esc(e.w)}</b> = ${esc(e.th)}</div><button class="btn" id="ln">${qi<9?'ข้อต่อไป':'ดูผล'}</button>`;
   $('#ln').onclick=()=>{qi++;q()}})}
 q()}

/* ---------- 3) พูดให้ทัน ---------- */
function speak(){if(!needWords(speak))return;const my=RUN;
 if(!(window.SpeechRecognition||window.webkitSpeechRecognition)){app.innerHTML=head('พูดให้ทัน')+'<div class="note">เครื่องหรือเบราว์เซอร์นี้ยังไม่รองรับการฟังเสียงพูด แนะนำให้เปิดด้วย Chrome บน Android หรือคอมพิวเตอร์</div>';$('#gbk').onclick=()=>go('games');return}
 const qs=sh(pool());let qi=0,pts=0,ok=0,skip=0,rec=null,started=false,t0=0;const LIM=60;
 app.innerHTML=head('พูดให้ทัน','พูดคำที่ขึ้นมาให้ถูก ได้คำละ 15 แต้ม · ข้ามได้')+`<div class="row" style="justify-content:space-between"><span class="tag" id="st" style="background:#EEF0F5;color:#16213E">เวลา ${LIM} วิ</span><span class="tag" id="sp" style="background:#D2F0EA;color:#0B5E54">0 แต้ม</span></div>
 <div class="card" style="align-items:center;text-align:center;min-height:170px;justify-content:center" id="sw"></div>
 <button class="mic" id="smic" aria-label="กดแล้วพูด">${MIC}</button><div class="mut" style="text-align:center" id="shint">กดไมค์เพื่อเริ่ม เวลาจะเริ่มนับเมื่อกดครั้งแรก</div>
 <div class="g2"><button class="soft" id="shear">ฟังตัวอย่าง (−5)</button><button class="soft" id="sskip">ข้ามคำนี้</button></div><div id="sres"></div>`;
 $('#gbk').onclick=()=>{if(rec)try{rec.stop()}catch(e){}go('games')};
 const cur=()=>qs[qi%qs.length];
 const show=()=>{const e=cur();$('#sw').innerHTML=`${bigW(e.w)}${pyw(e.w)}${D.showRD&&e.rd?`<div class="rd" style="font-size:16px">${rdHTML(e.rd)}</div>`:''}<div class="trs" style="font-size:15px">${esc(e.th)}</div>`};show();
 let tick=null;
 function begin(){if(started)return;started=true;t0=Date.now();tick=setInterval(()=>{if(my!==RUN||!$('#st'))return clearInterval(tick);const l=Math.max(0,LIM-Math.floor((Date.now()-t0)/1000));$('#st').textContent='เวลา '+l+' วิ';if(!l){clearInterval(tick);if(rec)try{rec.stop()}catch(e){}setTimeout(()=>{if(my===RUN)finish('speak',pts,`พูดถูก ${ok} คำ · ข้าม ${skip} คำ`,speak)},400)}},250)}
 const next=()=>{qi++;show()};
 $('#sskip').onclick=()=>{begin();skip++;$('#sres').innerHTML='';next()};
 $('#shear').onclick=()=>{begin();pts=Math.max(0,pts-5);$('#sp').textContent=pts+' แต้ม';say(cur().w)};
 $('#smic').onclick=()=>{if(rec){try{rec.stop()}catch(e){}return}begin();const m=$('#smic');m.classList.add('on');$('#shint').textContent='กำลังฟัง… พูดได้เลย';
  rec=listen(alts=>{m.classList.remove('on');rec=null;if(my!==RUN)return;const e=cur(),r=judge(alts,e.w);
   if(r.ok){ok++;pts+=15;FX.sfx.ok();$('#sp').textContent=pts+' แต้ม';$('#sres').innerHTML=`<div class="okn">ถูกต้อง “${esc(r.heard)}” +15</div>`;next()}
   else $('#sres').innerHTML=`<div class="note">ระบบได้ยินว่า “${esc(r.heard||'-')}” ลองอีกครั้ง หรือกดข้าม</div>`;
   $('#shint').textContent='กดไมค์แล้วพูดคำถัดไป'},
   err=>{m.classList.remove('on');rec=null;$('#sres').innerHTML=`<div class="note">${esc(err)}</div>`})}}

/* ---------- 4) เรียงประโยค ---------- */
function tokens(e){const strip=s=>s.replace(/[.,!?;:。、！？，．「」"]/g,'');
 if(LANG==='en')return e.ex.split(/\s+/).map(strip).filter(Boolean);
 if(LANG==='ja')return String(e.expy||'').split(/[\s　]+/).map(strip).filter(Boolean);
 // จีน: ตัดตัวอักษรจีนตามจำนวนพยางค์ของพินอินแต่ละคำ
 const hz=[...String(e.ex).replace(/[^㐀-鿿]/g,'')];const ws=String(e.expy||'').split(/\s+/).map(w=>LP.parse(w).length).filter(n=>n>0);
 if(ws.reduce((a,b)=>a+b,0)!==hz.length)return [];let k=0;return ws.map(n=>{const t=hz.slice(k,k+n).join('');k+=n;return t})}
function order(){if(!needWords(order))return;const my=RUN;
 const cand=sh(pool()).filter(e=>e.ex&&e.exth).map(e=>({e,t:tokens(e)})).filter(x=>x.t.length>=3&&x.t.length<=7&&new Set(x.t).size===x.t.length).slice(0,5);
 if(cand.length<3){app.innerHTML=head('เรียงประโยค')+'<div class="note">คำในระดับนี้ยังมีประโยคตัวอย่างไม่พอ ลองเลือก Level อื่นในหน้าคำศัพท์</div>';$('#gbk').onclick=()=>go('games');return}
 let qi=0,pts=0,ok=0;
 function q(){if(my!==RUN)return;if(qi>=cand.length)return finish('order',pts,`เรียงถูก ${ok}/${cand.length} ประโยค`,order);
  const {e,t}=cand[qi];const bank=sh(t.map((x,i)=>({x,i})));let ans=[],tries=0,hint=false;
  const draw=()=>{app.innerHTML=head('เรียงประโยค',`ข้อ ${qi+1}/${cand.length} · ${pts} แต้ม`)+`<div class="bar"><i style="width:${qi/cand.length*100}%"></i></div>
   <div class="card"><div class="mut">เรียงเป็นประโยคที่แปลว่า</div><div style="font-size:18px;font-weight:700">${esc(e.exth)}</div>
   <div id="oa" style="min-height:58px;border:2px dashed #C9D3F2;border-radius:12px;padding:8px;display:flex;flex-wrap:wrap;gap:6px">${ans.map((b,k)=>`<button class="soft" data-a="${k}" style="${CJK?'font-size:20px':''}">${esc(b.x)}</button>`).join('')||'<span class="mut">แตะคำด้านล่างเพื่อเรียง</span>'}</div></div>
   <div class="row" id="ob">${bank.map((b,k)=>ans.includes(b)?'':`<button class="opt" data-b="${k}" style="padding:0 14px;${CJK?'font-size:20px':''}">${esc(b.x)}</button>`).join('')}</div>
   <div class="g2"><button class="soft" id="oh">ฟังประโยค (−5)</button><button class="soft" id="oc">ล้าง</button></div><div id="or"></div>`;
   $('#gbk').onclick=()=>go('games');
   app.querySelectorAll('[data-b]').forEach(x=>x.onclick=()=>{const b=bank[+x.dataset.b];ans.push(b);if(LANG!=='en')say(b.x,0.9);draw();check()});
   app.querySelectorAll('[data-a]').forEach(x=>x.onclick=()=>{ans.splice(+x.dataset.a,1);draw()});
   $('#oc').onclick=()=>{ans=[];draw()};$('#oh').onclick=()=>{if(!hint){hint=true;pts=Math.max(0,pts-5)}say(e.ex,0.8)}};
  function check(){if(ans.length!==t.length)return;const right=ans.map(b=>b.x).join('|')===t.join('|');tries++;
   if(right){ok++;const g=tries===1?20:10;pts+=g;FX.sfx.ok();setTimeout(()=>say(e.ex,0.85),250);
    $('#or').innerHTML=`<div class="okn">ถูกต้อง +${g}<br><b>${esc(e.ex)}</b>${CJK&&e.expy?`<br><span class="py">${esc(e.expy)}</span>`:''}${D.showRD&&e.srd?`<br><span class="rd">${rdHTML(e.srd)}</span>`:''}</div><button class="btn" id="on">${qi<cand.length-1?'ข้อต่อไป':'ดูผล'}</button>`;
    app.querySelectorAll('[data-a],[data-b],#oc').forEach(x=>x.disabled=true);$('#on').onclick=()=>{qi++;q()}}
   else if(tries>=2){$('#or').innerHTML=`<div class="note">ประโยคที่ถูกคือ<br><b>${esc(t.join(LANG==='en'?' ':' · '))}</b></div><button class="btn" id="on">${qi<cand.length-1?'ข้อต่อไป':'ดูผล'}</button>`;say(e.ex,0.85);
    app.querySelectorAll('[data-a],[data-b],#oc').forEach(x=>x.disabled=true);$('#on').onclick=()=>{qi++;q()}}
   else{FX.sfx.bad();const oa=$('#oa');if(oa){oa.classList.remove('fx-shake');void oa.offsetWidth;oa.classList.add('fx-shake')}}if(!right&&tries<2)$('#or').innerHTML='<div class="note">ยังไม่ถูก แตะคำในกรอบเพื่อเอาออก แล้วลองอีกครั้ง (เหลือ 1 ครั้ง)</div>'}
  draw()}
 q()}

/* ---------- 5) ศึกชิงแต้ม (ตารางแต้มรายสัปดาห์) ---------- */
function board(){const my=RUN,g=G(),wk=weekKey();
 app.innerHTML=head('ศึกชิงแต้มรายสัปดาห์',`${esc(LP.thName)} · สัปดาห์ ${wk.slice(-2)} · รีเซ็ตทุกวันจันทร์`)+`<div class="hero" style="text-align:center"><div style="opacity:.9">แต้มของฉันสัปดาห์นี้</div><div style="font-size:40px;font-weight:700;line-height:1.1">${g.wpts}</div></div><div class="card" id="bl"><div class="mut">กำลังโหลดตารางแต้ม…</div></div><button class="btn org" id="bplay">ไปเล่นเกมเพิ่มแต้ม</button>`;
 $('#gbk').onclick=()=>go('games');$('#bplay').onclick=()=>go('games');
 const render=r=>{if(my!==RUN||!$('#bl'))return;
  if(!r||!r.ok||!Array.isArray(r.list)){$('#bl').innerHTML='<div class="note">ตารางแต้มรวมของทุกคนจะเปิดเมื่ออัปเดตระบบหลังบ้านแล้ว ตอนนี้แต้มของพี่บันทึกไว้แล้ว ไม่หาย</div>';return}
  if(!r.list.length){$('#bl').innerHTML='<div class="mut">สัปดาห์นี้ยังไม่มีใครเล่น เป็นคนแรกเลย</div>';return}
  const me=AUTH&&AUTH.user.username,medal=['🥇','🥈','🥉'];
  $('#bl').innerHTML='<h2>อันดับ</h2>'+r.list.map((x,i)=>`<div class="row" style="justify-content:space-between;align-items:center;padding:6px 8px;border-radius:10px;${x.u===me?'background:#FFF1C7':''}"><span><b style="display:inline-block;width:34px">${medal[i]||(i+1)+'.'}</b>${esc(x.name)}${x.u===me?' (ฉัน)':''}</span><b>${x.pts}</b></div>`).join('')+(r.updated?`<div class="mut">อัปเดต ${esc(r.updated)} · แต้มใหม่ขึ้นตารางภายในไม่กี่นาที</div>`:'')};
 const go2=()=>api('board',{token:AUTH&&AUTH.token,lang:LANG,week:wk}).then(render).catch(()=>render(null));
 if(syncT)push().then(go2);else go2()}
})();
