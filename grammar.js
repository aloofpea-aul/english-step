/* ห้องไวยากรณ์ — ใช้ร่วมทุกภาษา · เนื้อหาอยู่ใน <ภาษา>/grammar.js (อังกฤษ = vocab/grammar.js)
   รูปแบบบท: {id,lv,t,rule,table:[[ซ้าย,ขวา]],ex:[[ประโยค,คำอ่าน,แปล]],q:[{q,o:[..],a,why}|{order:'ประโยค',th:'แปล'}]} */
(function(){
const gLoaded={};
function gFile(){return (LANG==='en'?'vocab':LANG)+'/grammar.js'}
function loadG(){window.GRAMMAR=window.GRAMMAR||{};if(GRAMMAR[LANG])return Promise.resolve();
 if(gLoaded[LANG])return gLoaded[LANG];
 if(window.ES_SALE)return gLoaded[LANG]=ES_SALE.load(gFile()).catch(()=>{gLoaded[LANG]=null});
 return gLoaded[LANG]=new Promise(res=>{const s=document.createElement('script');s.src=gFile()+'?v=20261128a';s.onload=res;s.onerror=()=>{gLoaded[LANG]=null;res()};document.head.appendChild(s)})}
const prog=()=>{const p=P();return p.gram||(p.gram={})};
const lvName=lv=>{const L=(LP.levels||[]).find(x=>x.lv===lv);return 'Level '+lv+(L?' · '+L.name:'')};
const rd=(t)=>CJK&&t?`<div class="mut" style="font-size:13px">${esc(t)}</div>`:'';
function list(){const G=GRAMMAR[LANG]||[];
 if(!G.length){app.innerHTML=`<h1>ห้องไวยากรณ์</h1><div class="note">ไวยากรณ์${esc(LP.thName)}กำลังจัดทำ เร็วๆ นี้</div>`;return}
 const pr=prog(),done=G.filter(g=>(pr[g.id]||0)>=80).length;let h=`<h1>ห้องไวยากรณ์ · ${esc(LP.thName)}</h1><div class="mut">${G.length} บท · ผ่านแล้ว ${done} บท · ทำแบบฝึกได้ 80% ขึ้นไปถือว่าผ่าน</div>`,cur=-1;
 G.forEach((g,i)=>{if(g.lv!==cur){cur=g.lv;h+=`<h2 style="margin:14px 0 6px">${esc(lvName(g.lv))}</h2>`}
  const b=pr[g.id];const t=b>=80?`<span class="tag" style="background:#D2F0EA;color:#0B5E54">ผ่าน ${b}%</span>`:b!=null?`<span class="tag" style="background:#FCE3CC;color:#7A3A08">${b}%</span>`:'<span class="tag" style="background:#EEF0F5;color:#4A5470">ใหม่</span>';
  h+=`<button class="item" data-g="${i}"><span><b>${i+1}. ${esc(g.t)}</b>${g.sub?`<br><span class="mut">${esc(g.sub)}</span>`:''}</span>${t}</button>`});
 app.innerHTML=h;app.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{window.scrollTo(0,0);lesson(+b.dataset.g)})}
function lesson(i){const G=GRAMMAR[LANG],g=G[i];if(!g)return list();
 const tb=(g.table||[]).length?`<table style="width:100%;border-collapse:collapse;margin:8px 0;font-size:15px">${g.table.map((r,k)=>`<tr style="${k?'border-top:1px solid #E6E8EF':''}">${r.map((c,j)=>`<td style="padding:6px 4px;${j?'':'font-weight:600'}">${esc(c)}</td>`).join('')}</tr>`).join('')}</table>`:'';
 const ex=(g.ex||[]).map((e,k)=>`<button class="item" data-x="${k}" style="text-align:left"><span><b>${esc(e[0])}</b>${rd(e[1])}<br><span class="mut">${esc(e[2])}</span></span><span class="tag" style="background:#E6F1FB;color:#0C447C">ฟัง</span></button>`).join('');
 app.innerHTML=`<button class="back" id="gBack">‹ ห้องไวยากรณ์</button><h1 style="margin-top:6px">${i+1}. ${esc(g.t)}</h1>
 <div class="card" style="background:#EEEDFE;color:#26215C;white-space:pre-line;line-height:1.7">${esc(g.rule)}</div>${tb}
 <h2 style="margin:12px 0 6px">ตัวอย่าง</h2>${ex}
 ${g.tip?`<div class="note" style="white-space:pre-line">${esc(g.tip)}</div>`:''}
 <button class="btn" id="gQuiz" style="width:100%;margin-top:12px">ทำแบบฝึก ${(g.q||[]).length} ข้อ</button>
 <div class="row" style="justify-content:space-between;margin-top:10px">${i>0?'<button class="soft" id="gPrev">‹ บทก่อน</button>':'<span></span>'}${i<G.length-1?'<button class="soft" id="gNext">บทถัดไป ›</button>':''}</div>`;
 app.querySelector('#gBack').onclick=()=>{window.scrollTo(0,0);list()};
 app.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>say(g.ex[+b.dataset.x][0]));
 app.querySelector('#gQuiz').onclick=()=>{window.scrollTo(0,0);quiz(i)};
 const pv=app.querySelector('#gPrev'),nx=app.querySelector('#gNext');if(pv)pv.onclick=()=>{window.scrollTo(0,0);lesson(i-1)};if(nx)nx.onclick=()=>{window.scrollTo(0,0);lesson(i+1)}}
function toks(s){return (LANG==='en'||LANG==='fr')?s.replace(/[.!?。？！]+$/,'').split(/\s+/):s.split('|')}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function quiz(i){const g=GRAMMAR[LANG][i],Q=g.q||[];let n=0,ok=0;
 const head=()=>`<button class="back" id="gBack">‹ ${esc(g.t)}</button><div class="mut" style="margin:6px 0">ข้อ ${n+1}/${Q.length} · ถูก ${ok}</div>`;
 const bindBack=()=>app.querySelector('#gBack').onclick=()=>{window.scrollTo(0,0);lesson(i)};
 const after=(right,why,ans)=>{if(right){ok++;FX.sfx&&FX.sfx.ok&&FX.sfx.ok()}else{FX.sfx&&FX.sfx.bad&&FX.sfx.bad()}
  const f=document.createElement('div');f.className='note';f.style.background=right?'#E1F5EE':'#FCEBEB';f.style.color=right?'#085041':'#791F1F';f.style.whiteSpace='pre-line';
  f.textContent=(right?'ถูกต้อง':'ยังไม่ถูก คำตอบคือ '+ans)+(why?'\n'+why:'');app.appendChild(f);
  const b=document.createElement('button');b.className='btn';b.style.width='100%';b.style.marginTop='10px';b.textContent=n<Q.length-1?'ข้อต่อไป':'ดูผล';b.onclick=()=>{n++;n<Q.length?show():end()};app.appendChild(b)};
 function show(){const q=Q[n];
  if(q.order){const W=toks(q.order),pool=shuffle(W.map((w,k)=>({w,k})));let pick=[];
   const draw=()=>{app.innerHTML=head()+`<div class="card"><div class="mut">เรียงเป็นประโยคที่แปลว่า</div><b>${esc(q.th)}</b><div id="gAns" style="min-height:44px;margin:10px 0;padding:8px;border:2px dashed #CECBF6;border-radius:12px">${pick.map((p,k)=>`<button class="tag" data-u="${k}" style="margin:3px;font-size:16px;padding:6px 10px;background:#534AB7;color:#fff">${esc(p.w)}</button>`).join('')}</div>
    <div>${pool.map((p,k)=>pick.includes(p)?'':`<button class="tag" data-p="${k}" style="margin:3px;font-size:16px;padding:6px 10px;background:#EEEDFE;color:#3C3489">${esc(p.w)}</button>`).join('')}</div></div>
    <button class="btn" id="gChk" style="width:100%;margin-top:10px">ตรวจคำตอบ</button>`;bindBack();
    app.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{pick.push(pool[+b.dataset.p]);draw()});
    app.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{pick.splice(+b.dataset.u,1);draw()});
    app.querySelector('#gChk').onclick=()=>{if(pick.length<W.length){alertBox('ใช้ให้ครบทุกคำก่อน');return}
     const got=pick.map(p=>p.w).join(' '),want=W.join(' ');app.querySelector('#gChk').remove();app.querySelectorAll('[data-p],[data-u]').forEach(b=>b.onclick=null);
     say(q.order.replace(/\|/g,''));after(got===want,q.why,W.join(LANG==='en'||LANG==='fr'?' ':''))}};draw();return}
  const opts=q.o.map((t,k)=>({t,k})),sh=q.keep?opts:shuffle(opts);
  app.innerHTML=head()+`<div class="card"><div style="font-size:19px;line-height:1.6">${esc(q.q)}</div>${q.th?`<div class="mut">${esc(q.th)}</div>`:''}</div>`+
   sh.map(o=>`<button class="item" data-o="${o.k}" style="justify-content:center;font-size:17px">${esc(o.t)}</button>`).join('');bindBack();
  app.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const k=+b.dataset.o,right=k===q.a;
   app.querySelectorAll('[data-o]').forEach(x=>{x.onclick=null;const kk=+x.dataset.o;if(kk===q.a){x.style.background='#E1F5EE';x.style.borderColor='#1D9E75'}else if(kk===k){x.style.background='#FCEBEB';x.style.borderColor='#E24B4A'}});
   if(q.say)say(q.say);after(right,q.why,q.o[q.a])})}
 function end(){const pct=Math.round(ok/Q.length*100),pr=prog(),was=pr[g.id]||0;pr[g.id]=Math.max(was,pct);
  if(pct>=80&&was<80){FX.addXP(20);FX.confetti&&FX.confetti()}else if(pct>=80)FX.addXP(5);save(D);
  app.innerHTML=`<h1>${esc(g.t)}</h1><div class="hero"><div style="font-size:14px">ผลแบบฝึก</div><div class="big">${pct}%</div><div>ถูก ${ok} จาก ${Q.length} ข้อ ${pct>=80?'· ผ่านแล้ว':'· ต้องได้ 80% ขึ้นไป'}</div></div>
  <button class="btn" id="gAgain" style="width:100%;margin-top:10px">${pct>=80?'ทำอีกรอบ':'ลองใหม่'}</button>
  ${i<GRAMMAR[LANG].length-1?'<button class="btn" id="gNext" style="width:100%;margin-top:8px;background:#1D9E75">บทถัดไป ›</button>':''}
  <button class="soft" id="gList" style="width:100%;margin-top:8px">กลับห้องไวยากรณ์</button>`;
  app.querySelector('#gAgain').onclick=()=>quiz(i);app.querySelector('#gList').onclick=()=>list();const nx=app.querySelector('#gNext');if(nx)nx.onclick=()=>{window.scrollTo(0,0);lesson(i+1)}}
 show()}
window.grammar=function(arg){app.innerHTML='<div class="mut">กำลังเปิดห้องไวยากรณ์…</div>';loadG().then(()=>{(GRAMMAR[LANG]||[]).length&&arg!=null?lesson(arg):list()})};
window.grammarCardHTML=function(){return `<button class="item" id="gHome" style="background:#EEEDFE;border-color:#CECBF6"><span><b style="color:#26215C">ห้องไวยากรณ์ · ${esc(LP.thName)}</b><br><span class="mut">กฎสั้นๆ ภาษาไทย ตัวอย่างฟังเสียงได้ และแบบฝึกท้ายบท</span></span><span class="tag" style="background:#534AB7;color:#fff">เปิด</span></button>`};
window.grammarBind=function(){const b=document.getElementById('gHome');if(b)b.onclick=()=>go('grammar')};
})();
