/* ===== เกมชุดที่ 2: ฝนคำศัพท์ · เติมคำ · สะกดคำ · ถูกหรือผิด · นักล่าเสียง · บิงโก · ตะลุยด่าน · บทสนทนาหน้างาน + โหมดดวลกับน้องมีไฟ =====
 * ใช้ส่วนกลางจาก games.js (window.GAPI) และ fx.js (window.FX) */
(function(){
const A=window.GAPI;if(!A)return;
const {sh,head,pool,wordHTML,shortTh,needWords,finish,G}=A;
const run=()=>A.run();
const W=ms=>new Promise(r=>setTimeout(r,ms));
const back=()=>{const b=$('#gbk');if(b)b.onclick=()=>go('games')};
function distract(e,P0,n,key){key=key||(x=>shortTh(x.th));const k0=key(e);const same=sh(P0.filter(x=>x.w!==e.w&&key(x)!==k0&&x.cat===e.cat));const rest=sh(P0.filter(x=>x.w!==e.w&&key(x)!==k0&&x.cat!==e.cat));
 const out=[],seen=new Set([k0]);for(const x of [...same,...rest]){const k=key(x);if(seen.has(k))continue;seen.add(k);out.push(x);if(out.length>=n)break}return out}
const hasHan=s=>/[\u3400-\u9fff]/.test(s);

/* ---------- โหมดดวล: น้องมีไฟทำแต้มตามเวลา ต้องทำให้ชนะ ---------- */
const EXP={match:45,listen:6,speak:60,order:18,fill:6,hunter:5,tf:60,rain:80,spell:10,bingo:70};// วินาทีต่อรอบ/ต่อข้อ
const PER={listen:1,fill:1,hunter:1,order:1,spell:1,bingo:1};// คิดเวลาตามจำนวนข้อ
let D0=null,DT=null,DEL=null;
window.DUEL={start(id){this.stop();const g=G();const n=A.CN(id,{match:6,listen:10,speak:60,order:5,fill:10,hunter:10,tf:60,spell:10,bingo:3,rain:0}[id]||10);
  const T=(PER[id]?n:1)*(EXP[id]||60)*(id==='speak'||id==='tf'?n/60:1);const best=(g.best||{})[id]||0;
  const target=Math.max(40,Math.round((best||({match:10*n,listen:10*n,order:15*n,fill:10*n,hunter:10*n,spell:12*n,bingo:60*n,tf:60,speak:60,rain:120}[id]||80))*0.9));
  D0={id,t0:Date.now(),T:Math.max(20,T),target};
  DEL=document.createElement('div');DEL.id='duelbar';DEL.style.cssText='position:fixed;left:50%;transform:translateX(-50%);top:8px;z-index:40;width:min(440px,92vw);background:#fff;border:1px solid #E3E7F1;border-radius:14px;padding:6px 10px;display:flex;align-items:center;gap:8px;box-shadow:0 4px 14px rgba(22,33,62,.12)';
  DEL.innerHTML=`<span style="width:30px">${FX.mascot(28)}</span><div style="flex:1"><div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700"><span style="color:#1D9E75">ฉัน <span id="dme">0</span></span><span style="color:#BA7517">น้องมีไฟ <span id="dbot">0</span></span></div><div style="position:relative;height:8px;background:#EEF0F5;border-radius:4px;overflow:hidden"><i id="dbme" style="position:absolute;left:0;top:0;height:4px;background:#1D9E75;width:0"></i><i id="dbbot" style="position:absolute;left:0;bottom:0;height:4px;background:#EF9F27;width:0"></i></div></div>`;
  document.body.appendChild(DEL);
  DT=setInterval(()=>{if(!D0)return;const me=window.__live?Math.round(window.__live()||0):0,bot=Math.min(D0.target,Math.round(D0.target*(Date.now()-D0.t0)/1000/D0.T)),mx=Math.max(D0.target,me,1);
   const a=$('#dme'),b=$('#dbot');if(!a){return}a.textContent=me;b.textContent=bot;$('#dbme').style.width=me/mx*100+'%';$('#dbbot').style.width=bot/mx*100+'%'},300)},
 stop(){clearInterval(DT);DT=null;if(DEL)DEL.remove();DEL=null},
 end(id,pts){if(!D0||D0.id!==id){this.stop();D0=null;return null}const bot=D0.target;this.stop();D0=null;const win=pts>bot;return{win,me:pts,bot,bonus:win?Math.max(10,Math.round(pts*.2)):0}}};
const oldGo=window.go;window.go=function(v,a){if(v!=='game')DUEL.stop();return oldGo(v,a)};

/* ---------- ตัวถามตอบแบบเลือกคำตอบ (ใช้ร่วมหลายเกม) ---------- */
function mcq(o){const my=run();let qi=0,pts=0,ok=0,streak=0;const N=o.n;A.LIVE(()=>pts);
 function q(){if(my!==run())return;if(qi>=N)return o.done?o.done(pts,ok,N):finish(o.id,pts,`ตอบถูก ${ok}/${N} ข้อ`);
  const Q=o.make(qi);if(!Q){qi=N;return q()}let done=false;
  app.innerHTML=head(o.title,`ข้อ ${qi+1}/${N} · ${pts} แต้ม${streak>=2?' · ติดกัน '+streak:''}`)+`<div class="bar"><i style="width:${qi/N*100}%"></i></div>
  <div class="card" style="align-items:center;text-align:center">${Q.prompt}${Q.say?`<div class="row"><button class="soft" id="qp">ฟังอีกครั้ง</button><button class="soft" id="qs">ฟังช้า</button></div>`:''}</div>
  <div class="${Q.cols===1?'':'g2'}" id="qo" style="${Q.cols===1?'display:flex;flex-direction:column;gap:8px':''}">${Q.opts.map((x,i)=>`<button class="opt w2" data-i="${i}" style="min-height:${Q.tall||72}px">${x.h}</button>`).join('')}</div><div id="qr"></div>`;
  back();if(Q.say){$('#qp').onclick=()=>say(Q.say);$('#qs').onclick=()=>say(Q.say,0.55);setTimeout(()=>{if(my===run())say(Q.say)},250)}
  app.querySelectorAll('#qo [data-i]').forEach(b=>b.onclick=()=>{if(done)return;done=true;const x=Q.opts[+b.dataset.i];
   if(x.ok){ok++;streak++;pts+=10+(streak>=3?5:0);b.classList.add('ok');FX.sfx.ok();if(streak===5||streak===10)FX.toast('ติดกัน '+streak+' ข้อ!','#0F6E56')}
   else{streak=0;b.classList.add('bad');FX.sfx.bad();app.querySelectorAll('#qo [data-i]')[Q.opts.findIndex(z=>z.ok)].classList.add('ok')}
   if(Q.after)Q.after(x.ok);
   $('#qr').innerHTML=`<div class="${x.ok?'okn':'note'}">${x.ok?'ถูกต้อง':'ยังไม่ใช่'} · ${Q.explain||''}</div><button class="btn" id="qn">${qi<N-1?'ข้อต่อไป':'ดูผล'}</button>`;
   $('#qn').onclick=()=>{qi++;q()}})}
 q()}

/* ---------- 1) ฝนคำศัพท์ ---------- */
function rain(){if(!needWords(rain))return;const my=run();const P0=pool();let pts=0,lives=3,caught=0,speed=34,combo=0,cur=null,y=0,last=0,alive=true;A.LIVE(()=>pts);
 app.innerHTML=head('ฝนคำศัพท์','แตะความหมายให้ทันก่อนคำตกถึงพื้น')+`<div class="row" style="justify-content:space-between"><span class="fx-pill" id="rl" style="background:#FCEBEB;color:#791F1F">♥♥♥</span><span class="fx-pill" id="rp" style="background:#E6F1FB;color:#0C447C">0 แต้ม</span></div>
 <div id="rf" style="position:relative;height:300px;background:#E6F1FB;border-radius:16px;overflow:hidden"><div id="rw" style="position:absolute;left:50%;transform:translateX(-50%);top:0;background:#185FA5;color:#fff;border-radius:12px;padding:8px 14px;text-align:center;min-width:120px"></div><div style="position:absolute;left:0;right:0;bottom:0;height:10px;background:#85B7EB"></div></div>
 <div class="g2" id="ro"></div>`;back();
 const lv=()=>{$('#rl').textContent='♥'.repeat(lives)+'♡'.repeat(3-lives);$('#rp').textContent=pts+' แต้ม'};
 function next(){cur=sh(P0)[0];y=0;const opts=sh([cur,...distract(cur,P0,3)]);
  $('#rw').innerHTML=`<div style="font-weight:700;font-size:${CJK?26:20}px">${esc(cur.w)}</div>${CJK&&cur.py&&cur.py!==cur.w?`<div style="font-size:13px;opacity:.85">${esc(cur.py)}</div>`:''}`;
  $('#ro').innerHTML=opts.map((o,i)=>`<button class="opt" data-i="${i}" style="min-height:58px;font-size:15px">${esc(shortTh(o.th))}</button>`).join('');
  app.querySelectorAll('#ro [data-i]').forEach(b=>b.onclick=()=>{if(!alive)return;const o=opts[+b.dataset.i];
   if(o===cur){caught++;combo++;pts+=10+Math.min(combo,10);speed+=2.5;FX.sfx.ok();say(cur.w);const w=$('#rw');w.style.background='#1D9E75';setTimeout(()=>{if(alive&&$('#rw')){w.style.background='#185FA5';next()}},260)}
   else{combo=0;b.classList.add('bad');FX.sfx.bad();miss()}lv()})}
 function miss(){lives--;combo=0;lv();const f=$('#rf');if(f){f.classList.remove('fx-shake');void f.offsetWidth;f.classList.add('fx-shake')}if(lives<=0){alive=false;setTimeout(()=>finish('rain',pts,`จับได้ ${caught} คำ · ความเร็วสูงสุด ${Math.round(speed)}`),500)}}
 function frame(t){if(my!==run()||!$('#rw')||!alive)return;if(!last)last=t;const dt=Math.min(.05,(t-last)/1000);last=t;y+=speed*dt;const H=($('#rf').clientHeight||300)-60;
  if(y>=H){FX.sfx.bad();miss();if(alive)next()}$('#rw').style.top=Math.min(y,H)+'px';requestAnimationFrame(frame)}
 next();lv();requestAnimationFrame(frame)}

/* ---------- 2) เติมคำในช่องว่าง ---------- */
function blankOf(e){const ex=String(e.ex||''),w=e.w;if(!ex||!w)return null;
 if(LANG==='en'){const re=new RegExp('\\b'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i');if(!re.test(ex))return null;return ex.replace(re,'＿＿＿')}
 if(!ex.includes(w))return null;return ex.replace(w,'＿＿＿')}
function fill(){if(!needWords(fill))return;const P0=pool();let C=sh(P0).map(e=>({e,b:blankOf(e)})).filter(x=>x.b);if(C.length<8)C=sh(ALL).map(e=>({e,b:blankOf(e)})).filter(x=>x.b).slice(0,200);
 const N=Math.min(A.CN('fill',10),C.length);
 mcq({id:'fill',title:'เติมคำในช่องว่าง',n:N,make(i){const {e,b}=C[i];const opts=sh([e,...distract(e,P0,3,x=>x.w)]).map(x=>({h:wordHTML(x),ok:x===e}));
  return{prompt:`<div style="font-size:${CJK?24:20}px;font-weight:700;line-height:1.5">${esc(b)}</div><div class="trs" style="font-size:15px">${esc(e.exth||'')}</div>`,opts,explain:`<b>${esc(e.ex)}</b>`,after(){say(e.ex,0.85)}}}})}

/* ---------- 3) สะกดคำ ---------- */
function unitsOf(e){if(LANG==='en')return /^[a-z]{3,10}$/i.test(e.w)?[...e.w.toLowerCase()]:null;
 if(LANG==='zh'){const u=[...e.w];return u.length>=2&&u.length<=4&&u.every(hasHan)?u:null}
 const k=String(e.kana||'').replace(/\s/g,'');const u=[...k];return u.length>=2&&u.length<=7&&!/[\s]/.test(k)?u:null}
function spell(){if(!needWords(spell))return;const my=run();const P0=pool();let C=sh(P0).filter(unitsOf);if(C.length<6)C=sh(ALL.filter(unitsOf)).slice(0,200);
 const N=Math.min(A.CN('spell',10),C.length);let qi=0,pts=0,ok=0;A.LIVE(()=>pts);
 const allU=[...new Set(C.flatMap(unitsOf))];
 function q(){if(my!==run())return;if(qi>=N)return finish('spell',pts,`สะกดถูก ${ok}/${N} คำ`);
  const e=C[qi],U=unitsOf(e),kt=c=>/[\u30a0-\u30ff]/.test(c),isK=U.some(kt),dec=sh(allU.filter(x=>!U.includes(x)&&(LANG!=='ja'||kt(x)===isK))).slice(0,U.length>5?3:2);const bank=sh([...U,...dec].map((x,i)=>({x,i})));let ans=[],tries=0,hint=false,over=false;
  const draw=()=>{app.innerHTML=head('สะกดคำ',`คำที่ ${qi+1}/${N} · ${pts} แต้ม`)+`<div class="bar"><i style="width:${qi/N*100}%"></i></div>
   <div class="card" style="align-items:center;text-align:center"><div class="mut">${LANG==='en'?'เรียงตัวอักษรให้เป็นคำที่แปลว่า':LANG==='zh'?'เรียงตัวอักษรจีนให้เป็นคำที่แปลว่า':'เรียงคานะให้เป็นคำที่แปลว่า'}</div><div style="font-size:22px;font-weight:700">${esc(e.th)}</div>
   ${hint&&D.showRD&&e.rd?`<div class="rd" style="font-size:16px">${rdHTML(e.rd)}</div>`:''}${hint&&LANG==='ja'&&e.w!==e.kana?`<div style="font-size:18px">${esc(e.w)}</div>`:''}
   <div id="sa" style="min-height:58px;width:100%;border:2px dashed #C9D3F2;border-radius:12px;padding:8px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center">${ans.map((b,k)=>`<button class="soft" data-a="${k}" style="min-width:44px;font-size:${CJK?24:20}px">${esc(b.x)}</button>`).join('')||'<span class="mut">แตะตัวด้านล่าง</span>'}</div></div>
   <div class="row" style="justify-content:center">${bank.map((b,k)=>ans.includes(b)?'':`<button class="opt" data-b="${k}" style="min-width:50px;font-size:${CJK?24:20}px">${esc(b.x)}</button>`).join('')}</div>
   <div class="g2"><button class="soft" id="sh">ฟังเสียง</button><button class="soft" id="sc">${hint?'ล้าง':'คำใบ้ (−5)'}</button></div><div id="sr"></div>`;back();
   app.querySelectorAll('[data-b]').forEach(x=>x.onclick=()=>{if(over||ans.length>=U.length)return;ans.push(bank[+x.dataset.b]);draw();check()});
   app.querySelectorAll('[data-a]').forEach(x=>x.onclick=()=>{if(over)return;ans.splice(+x.dataset.a,1);draw()});
   $('#sh').onclick=()=>say(e.w,0.8);$('#sc').onclick=()=>{if(over)return;if(!hint){hint=true;pts=Math.max(0,pts-5)}else ans=[];draw()}};
  function check(){if(ans.length!==U.length)return;const right=ans.map(b=>b.x).join('')===U.join('');tries++;
   if(right||tries>=2){over=true;if(right){ok++;const g=tries===1?15:8;pts+=g;FX.sfx.ok();FX.toast('+'+g,'#534AB7')}else FX.sfx.bad();say(e.w);
    $('#sr').innerHTML=`<div class="${right?'okn':'note'}">${right?'ถูกต้อง':'คำที่ถูกคือ'} <b>${esc(LANG==='ja'?e.kana:e.w)}</b>${LANG==='ja'&&e.w!==e.kana?' ('+esc(e.w)+')':''} = ${esc(e.th)}</div><button class="btn" id="sn">${qi<N-1?'คำต่อไป':'ดูผล'}</button>`;$('#sn').onclick=()=>{qi++;q()}}
   else{FX.sfx.bad();const a=$('#sa');a.classList.remove('fx-shake');void a.offsetWidth;a.classList.add('fx-shake');setTimeout(()=>{if(over||my!==run())return;ans=[];draw();$('#sr').innerHTML='<div class="note">ยังไม่ถูก ลองเรียงใหม่อีกครั้ง (เหลือ 1 ครั้ง)</div>'},600)}}
  draw();setTimeout(()=>{if(my===run())say(e.w,0.8)},250)}
 q()}

/* ---------- 4) ถูกหรือผิด ---------- */
function tf(){if(!needWords(tf))return;const my=run();const P0=pool();const LIM=A.CN('tf',60);let pts=0,ok=0,bad=0,combo=0,t0=0,cur=null,truth=true,started=false;A.LIVE(()=>pts);
 app.innerHTML=head('ถูกหรือผิด','คำกับความหมายตรงกันไหม ตอบให้ไวที่สุด')+`<div class="row" style="justify-content:space-between"><span class="fx-pill" id="tt" style="background:#FCEBEB;color:#791F1F">เวลา ${LIM} วิ</span><span class="fx-pill" id="tp" style="background:#FAECE7;color:#712B13">0 แต้ม</span><span class="fx-pill" id="tc" style="background:#EEEDFE;color:#3C3489">×1</span></div>
 <div class="card" id="tcard" style="align-items:center;text-align:center;min-height:200px;justify-content:center"></div>
 <div class="g2"><button id="tn" style="min-height:86px;border:none;background:#F7C1C1;color:#791F1F;font-size:22px;font-weight:700;border-radius:16px">✗ ผิด</button><button id="ty" style="min-height:86px;border:none;background:#9FE1CB;color:#085041;font-size:22px;font-weight:700;border-radius:16px">✓ ถูก</button></div>
 <div class="mut" style="text-align:center">ตอบถูกต่อเนื่องแต้มคูณสูงสุด ×3 · ตอบผิดหัก 3 แต้ม</div>`;back();
 function next(){cur=sh(P0)[0];truth=Math.random()<.5;const m=truth?cur:distract(cur,P0,1)[0]||cur;if(m===cur)truth=true;
  const c=$('#tcard');c.innerHTML=`${wordHTML(cur,true)}<div style="font-size:15px;color:#4A5470">แปลว่า</div><div style="font-size:24px;font-weight:700;color:#712B13">${esc(shortTh(m.th))}</div>`;c.classList.remove('fx-pop');void c.offsetWidth;c.classList.add('fx-pop')}
 let tick=null;function begin(){if(started)return;started=true;t0=Date.now();tick=setInterval(()=>{if(my!==run()||!$('#tt'))return clearInterval(tick);const l=Math.max(0,LIM-Math.floor((Date.now()-t0)/1000));$('#tt').textContent='เวลา '+l+' วิ';
  if(!l){clearInterval(tick);finish('tf',pts,`ตอบถูก ${ok} · ผิด ${bad}`)}},200)}
 function ans(v){begin();const mul=Math.min(3,1+Math.floor(combo/5));if(v===truth){ok++;combo++;pts+=5*mul;FX.sfx.ok()}else{bad++;combo=0;pts=Math.max(0,pts-3);FX.sfx.bad();const c=$('#tcard');c.classList.remove('fx-shake');void c.offsetWidth;c.classList.add('fx-shake')}
  $('#tp').textContent=pts+' แต้ม';$('#tc').textContent='×'+Math.min(3,1+Math.floor(combo/5));next()}
 $('#ty').onclick=()=>ans(true);$('#tn').onclick=()=>ans(false);next()}

/* ---------- 5) นักล่าเสียง ---------- */
const TM={1:'ˉ',2:'ˊ',3:'ˇ',4:'ˋ',0:'·'},TNm={1:'1',2:'2',3:'3',4:'4',0:'เบา'};
const k2h=s=>String(s).replace(/[\u30a1-\u30f6]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
const DAK={'か':'が','き':'ぎ','く':'ぐ','け':'げ','こ':'ご','さ':'ざ','し':'じ','す':'ず','せ':'ぜ','そ':'ぞ','た':'だ','て':'で','と':'ど','は':'ば','ひ':'び','ふ':'ぶ','へ':'べ','ほ':'ぼ'};
const UND=Object.fromEntries(Object.entries(DAK).map(([a,b])=>[b,a]));
const ROW_O='おこごそぞとどのほぼぽもよろょ',ROW_E='えけげせぜてでねへべぺめれ';
function jaVariants(k){const a=[...k],out=new Set();const kata=/[\u30a1-\u30fa]/.test(k);
 for(let i=0;i<a.length;i++){const c=a[i],n=a[i+1];
  if(n==='ー'||((n==='う')&&ROW_O.includes(k2h(c)))||(n==='い'&&ROW_E.includes(k2h(c))))out.add(a.slice(0,i+1).concat(a.slice(i+2)).join(''));// ทำให้สั้น
  else if((i>0||a.length<4)&&i<a.length-1&&!/[んンっッー]/.test(c)){if(kata)out.add(a.slice(0,i+1).concat(['ー'],a.slice(i+1)).join(''));else if(ROW_O.includes(c))out.add(a.slice(0,i+1).concat(['う'],a.slice(i+1)).join(''));else if(ROW_E.includes(c))out.add(a.slice(0,i+1).concat(['い'],a.slice(i+1)).join(''))}
  if(c==='っ'||c==='ッ')out.add(a.slice(0,i).concat(a.slice(i+1)).join(''));
  else if(i>0&&i<a.length&&/[かきくけこさしすせそたちつてとぱぴぷぺぽカキクケコサシスセソタチツテトパピプペポ]/.test(c)&&!/[っッんンー]/.test(a[i-1]))out.add(a.slice(0,i).concat([kata?'ッ':'っ'],a.slice(i)).join(''));
  const h=k2h(c);if(DAK[h]&&!kata)out.add(a.slice(0,i).concat([DAK[h]],a.slice(i+1)).join(''));else if(UND[h]&&!kata)out.add(a.slice(0,i).concat([UND[h]],a.slice(i+1)).join(''))}
 out.delete(k);return sh([...out])}
function hunter(){if(!needWords(hunter))return;const P0=pool();const N=A.CN('hunter',10);
 const pairs=(typeof SOUNDS!=='undefined'?SOUNDS:[]).flatMap(s=>(s.pairs||[]).map(p=>p.slice(0,2))).filter(p=>p[0]&&p[1]&&p[0]!==p[1]);let C=[];
 if(LANG==='zh'){C=sh(P0.filter(e=>e.py&&LP.tones(e.py).length>=1&&LP.tones(e.py).length<=3))}
 else if(LANG==='ja'){C=sh(P0.filter(e=>e.kana&&!/\s/.test(e.kana)&&e.kana.length>=2&&jaVariants(e.kana).length>=2))}
 const items=[];for(let i=0;i<N;i++){if((LANG==='en'||!C.length||i%4===3)&&pairs.length)items.push({pair:sh(pairs)[0]});else if(C.length)items.push({e:C[i%C.length]})}
 const title=LANG==='zh'?'นักล่าเสียง · วรรณยุกต์':LANG==='ja'?'นักล่าเสียง · สั้น/ยาว/っ':'นักล่าเสียง · คู่เสียงคล้าย';
 mcq({id:'hunter',title,n:items.length,make(i){const it=items[i];
  if(it.pair){const [a,b]=it.pair,t=Math.random()<.5?a:b;const ia=info(a),ib=info(b);const h=w=>{const x=info(w);return `<span style="font-weight:700;font-size:${CJK?24:20}px">${esc(w)}</span>${x.th?`<span class="tr">${esc(x.th)}</span>`:''}`};
   return{prompt:`${FX.ICON.listen}<div style="font-size:18px;font-weight:700">ฟังแล้วเลือกคำที่ได้ยิน</div>`,say:t,opts:[{h:h(a),ok:t===a},{h:h(b),ok:t===b}],explain:`ได้ยินว่า <b>${esc(t)}</b>${ia.th&&ib.th?' · '+esc(a)+' = '+esc(ia.th)+' · '+esc(b)+' = '+esc(ib.th):''}`}}
  const e=it.e;
  if(LANG==='zh'){const T=LP.tones(e.py);const key=x=>x.join('-');const set=new Set([key(T)]);const opts=[T];let guard=0;
   while(opts.length<4&&guard++<60){const r=T.map(()=>1+Math.floor(Math.random()*4));if(!set.has(key(r))){set.add(key(r));opts.push(r)}}
   const show=x=>`<span style="font-size:30px;font-weight:700;letter-spacing:6px">${x.map(t=>TM[t]).join(' ')}</span><span class="tr">เสียง ${x.map(t=>TNm[t]).join(' + ')}</span>`;
   return{prompt:`<div style="font-size:40px;font-weight:700">${esc(e.w)}</div><div class="trs">${esc(e.th)}</div><div class="mut">ฟังแล้วเลือกวรรณยุกต์ของคำนี้</div>`,say:e.w,opts:sh(opts).map(x=>({h:show(x),ok:key(x)===key(T)})),explain:`${esc(e.w)} = <b>${esc(e.py)}</b>`}}
  const V=jaVariants(e.kana).slice(0,3);
  return{prompt:`<div class="trs" style="font-size:17px">${esc(e.th)}</div><div class="mut">ฟังแล้วเลือกคานะที่ตรงกับเสียง</div>`,say:e.w,opts:sh([e.kana,...V]).map(x=>({h:`<span style="font-size:24px;font-weight:700">${esc(x)}</span>`,ok:x===e.kana})),explain:`<b>${esc(e.kana)}</b>${e.w!==e.kana?' ('+esc(e.w)+')':''}`}}})}

/* ---------- 6) บิงโกศัพท์ ---------- */
const LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function bingo(){if(!needWords(bingo))return;const my=run();const P0=pool();const NC=A.CN('bingo',3);let card=0,pts=0,hearts=3,lines=0,miss=0,t0=Date.now();A.LIVE(()=>pts);
 function newCard(){if(card>=NC||hearts<=0)return finish('bingo',pts,`${card} กระดาน · บิงโก ${lines} แถว · พลาด ${miss} ครั้ง · ${Math.round((Date.now()-t0)/1000)} วินาที`);
  card++;const grid=sh(P0).slice(0,9),mark=new Array(9).fill(false),got=new Set();const dec=sh(P0.filter(x=>!grid.includes(x))).slice(0,3);
  const calls=sh([...grid,...dec]);let ci=0,cur=null,lock=false;
  const draw=()=>{app.innerHTML=head('บิงโกศัพท์',`กระดาน ${card}/${NC} · ${pts} แต้ม`)+`<div class="row" style="justify-content:space-between"><span class="fx-pill" style="background:#FCEBEB;color:#791F1F">${'♥'.repeat(hearts)}${'♡'.repeat(3-hearts)}</span><span class="fx-pill" style="background:#FBEAF0;color:#72243E">เสียงที่ ${Math.min(ci+1,calls.length)}/${calls.length}</span></div>
   <div class="g3" id="bg">${grid.map((e,i)=>`<button class="opt w2" data-c="${i}" style="min-height:84px;${mark[i]?'background:#D4537E;color:#fff;border-color:#D4537E':''}">${mark[i]?`<span style="font-size:26px">★</span><span style="font-size:12px">${esc(e.w)}</span>`:wordHTML(e)}</button>`).join('')}</div>
   <div class="g2"><button class="soft" id="bp">ฟังอีกครั้ง</button><button class="soft" id="bn">ไม่มีในกระดาน</button></div><div id="br" class="mut" style="text-align:center">ฟังแล้วแตะคำที่ได้ยิน</div>`;back();
   app.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>pick(+b.dataset.c));$('#bp').onclick=()=>say(cur.w);$('#bn').onclick=()=>pick(-1)};
  function call(){if(my!==run())return;if(ci>=calls.length){pts+=20;FX.toast('ครบกระดาน +20','#993556');return setTimeout(newCard,700)}cur=calls[ci];lock=false;draw();setTimeout(()=>{if(my===run())say(cur.w)},200)}
  function pick(i){if(lock||!cur)return;const want=grid.indexOf(cur);const right=i===want;lock=true;
   if(right){FX.sfx.ok();pts+=5;if(i>=0){mark[i]=true;const nl=LINES.filter((L,k)=>!got.has(k)&&L.every(x=>mark[x]));nl.forEach(L=>{got.add(LINES.indexOf(L));lines++;pts+=15});if(nl.length){FX.sfx.win();FX.toast('บิงโก! +'+15*nl.length,'#D4537E')}}}
   else{FX.sfx.bad();miss++;hearts--;pts=Math.max(0,pts-3);FX.toast(want>=0?'คำนี้อยู่ในกระดาน: '+cur.w:'คำนี้ไม่มีในกระดาน','#791F1F')}
   ci++;if(hearts<=0)return setTimeout(()=>finish('bingo',pts,`${card} กระดาน · บิงโก ${lines} แถว · หัวใจหมด`),700);setTimeout(call,right?350:900)}
  call()}
 newCard()}

/* ---------- 7) ตะลุยด่าน ---------- */
function advList(){return ALL.slice().sort((a,b)=>a.lv-b.lv)}
const PERST=10;
function adv(){if(!needWords(adv))return;const p=P();p.adv=p.adv||{done:{},page:null};const L=advList(),NS=Math.ceil(L.length/PERST);const done=p.adv.done;
 let curI=0;while(done[curI]&&curI<NS-1)curI++;let page=p.adv.page!=null?p.adv.page:Math.floor(curI/20);const tot=Object.values(done).reduce((a,b)=>a+b,0);
 const nodes=[];for(let i=page*20;i<Math.min(NS,page*20+20);i++)nodes.push(i);
 const lvOf=i=>L[i*PERST]?L[i*PERST].lv:0;
 app.innerHTML=head('ตะลุยด่าน',`${NS} ด่าน · ผ่านแล้ว ${Object.keys(done).length} ด่าน · ★ ${tot}`)+`<div class="row" style="justify-content:space-between;align-items:center"><button class="soft" id="ap" ${page?'':'disabled'}>‹ ก่อนหน้า</button><b>ด่าน ${page*20+1}–${Math.min(NS,page*20+20)}</b><button class="soft" id="an" ${(page+1)*20<NS?'':'disabled'}>ถัดไป ›</button></div>
 <div style="position:relative;background:#E1F5EE;border-radius:18px;padding:14px 10px;display:flex;flex-direction:column;gap:6px">${nodes.map((i,k)=>{const boss=(i+1)%5===0,open=i===0||done[i-1]!=null||done[i]!=null,st=done[i];const off=[0,30,60,30][k%4];
  return `<div style="display:flex;align-items:center;gap:10px;margin-left:${off}%"><button data-s="${i}" ${open?'':'disabled'} aria-label="ด่าน ${i+1}" style="width:${boss?64:54}px;height:${boss?64:54}px;border-radius:50%;border:none;font-weight:700;font-size:${boss?15:17}px;flex:none;${i===curI?'outline:4px solid #EF9F27;':''}background:${st!=null?'#1D9E75':open?(boss?'#BA7517':'#fff'):'#B4B2A9'};color:${st!=null||boss&&open?'#fff':open?'#085041':'#fff'}" class="${i===curI?'fx-bob':''}">${boss?'บอส':i+1}</button><span style="font-size:13px;color:#085041">${st!=null?'★'.repeat(st)+'☆'.repeat(3-st):open?'Level '+lvOf(i)+(boss?' · ด่านบอส':''):'🔒'}</span></div>`}).join('')}</div>
 <div class="mut">ด่านละ ${PERST} คำ เรียงจาก Level 0 ขึ้นไป · ตอบถูก 7/10 ผ่าน · ด่านบอสทุก 5 ด่าน ถามคำจาก 5 ด่านล่าสุด 15 ข้อ ต้องถูก 12 ข้อ</div>`;back();
 $('#ap').onclick=()=>{p.adv.page=page-1;adv()};$('#an').onclick=()=>{p.adv.page=page+1;adv()};
 app.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>stage(+b.dataset.s))}
function stage(i){const p=P(),L=advList(),boss=(i+1)%5===0;const words=boss?L.slice((i-4)*PERST,(i+1)*PERST):L.slice(i*PERST,(i+1)*PERST);const n=boss?15:10,need=boss?12:7;
 const P0=words.length>=4?words:pool();const qs=sh(boss?[...words,...words].slice(0,n):words.concat(sh(words)).slice(0,n));
 if(window.DUEL)DUEL.stop();
 mcq({id:'adv',title:(boss?'ด่านบอส ':'ด่าน ')+(i+1),n:qs.length,make(k){const e=qs[k],t=k%3;const near=distract(e,ALL.filter(x=>x.lv===e.lv),3);
  if(t===0)return{prompt:`${wordHTML(e,true)}<div class="mut">แปลว่าอะไร</div>`,opts:sh([e,...near]).map(x=>({h:`<span style="font-size:16px;font-weight:600">${esc(shortTh(x.th))}</span>`,ok:x===e})),explain:`${esc(e.w)} = ${esc(e.th)}`,after(){say(e.w)}};
  if(t===1)return{prompt:`<div style="font-size:22px;font-weight:700">${esc(e.th)}</div><div class="mut">ภาษา${esc(LP.thName.replace('ภาษา',''))}คือคำไหน</div>`,opts:sh([e,...near]).map(x=>({h:wordHTML(x),ok:x===e})),explain:`${esc(e.th)} = ${esc(e.w)}`,after(){say(e.w)}};
  return{prompt:`${FX.ICON.listen}<div class="mut">ฟังแล้วเลือกคำที่ได้ยิน</div>`,say:e.w,opts:sh([e,...near]).map(x=>({h:wordHTML(x),ok:x===e})),explain:`${esc(e.w)} = ${esc(e.th)}`}},
  done(pts,ok,N){const pass=ok>=need,st=pass?(ok===N?3:ok>=N-1?2:1):0;p.adv=p.adv||{done:{}};if(pass){p.adv.done[i]=Math.max(p.adv.done[i]||0,st);p.adv.page=Math.floor((i+1)/20)}
   if(pass)words.forEach(e=>{const C=p.cards;if(!C[e.w])C[e.w]={box:1,due:Date.now()+86400000}});
   finish('adv',pts+(pass?st*10+(boss?30:0):0),pass?`${boss?'ชนะบอส! ':''}ผ่านด่าน ${i+1} · ถูก ${ok}/${N} · ${'★'.repeat(st)} · ปลดล็อกด่าน ${i+2}`:`ถูก ${ok}/${N} ต้องได้ ${need} ข้อจึงผ่าน`,()=>pass?adv():stage(i))}})}

/* ---------- 8) บทสนทนาหน้างาน ---------- */
function rdS(l){if(!D.showRD)return '';const r=LANG==='en'?(typeof autoRead==='function'?autoRead(l[0]):''):l[1]?LP.readSentence(l[1],l[0]):'';return r?`<span class="rd">${rdHTML(r)}</span>`:''}
const lineHTML=(l,big)=>`<span style="font-weight:700;font-size:${big?(CJK?20:18):16}px">${esc(l[0])}</span>${CJK&&l[1]?`<span class="py" style="font-weight:400">${esc(l[1])}</span>`:''}${rdS(l)}`;
function dialog(){const DL=(window.DIALOGS||{})[LANG]||[];const p=P();p.dlg=p.dlg||{};
 app.innerHTML=head('บทสนทนาหน้างาน',`${DL.length} สถานการณ์ · จบแล้ว ${Object.keys(p.dlg).length}`)+DL.map((d,i)=>`<button class="fx-gc" data-d="${i}" style="background:${p.dlg[i]?'#EAF3DE':'#F1EFE8'};flex-direction:row;align-items:center;gap:12px;min-height:70px"><i class="ti ${d.icon||'ti-message-circle'}" style="font-size:28px;color:#444441" aria-hidden="true"></i><span style="flex:1"><b style="font-size:16px;color:#2C2C2A">${esc(d.t)}</b><br><span class="mut">${d.turns.length} ช่วงสนทนา</span></span><span class="fx-pill" style="background:#fff;color:#444441">${p.dlg[i]?'★'.repeat(p.dlg[i]):'ใหม่'}</span></button>`).join('')+(DL.length?'':'<div class="note">ยังไม่มีบทสนทนาสำหรับภาษานี้</div>');back();
 app.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>scene(+b.dataset.d))}
function scene(si){const my=run();const d=window.DIALOGS[LANG][si];let ti=0,pts=0,ok=0,log=[];A.LIVE(()=>pts);
 function turn(){if(my!==run())return;if(ti>=d.turns.length){const st=ok===d.turns.length?3:ok>=d.turns.length-1?2:ok?1:0;const p=P();p.dlg[si]=Math.max(p.dlg[si]||0,st);return finish('dialog',pts,`${esc(d.t)} · ตอบถูก ${ok}/${d.turns.length}`,()=>dialog())}
  const T=d.turns[ti],opts=sh(T.opts.map((o,k)=>({o,ok:k===0})));let done=false;
  app.innerHTML=head(d.t,`ช่วงที่ ${ti+1}/${d.turns.length} · ${pts} แต้ม`)+`<div class="bar"><i style="width:${ti/d.turns.length*100}%"></i></div>
  <div style="display:flex;flex-direction:column;gap:8px">${log.join('')}
  <div style="display:flex;gap:8px;align-items:flex-end" class="fx-pop"><span style="flex:none;width:40px;height:40px;border-radius:50%;background:#D3D1C7;display:flex;align-items:center;justify-content:center"><i class="ti ti-user" style="font-size:22px;color:#444441" aria-hidden="true"></i></span><div style="background:#fff;border:1px solid #E3E7F1;border-radius:14px 14px 14px 2px;padding:10px 12px;max-width:85%">${T.who?`<div class="mut" style="font-size:12px">${esc(T.who)}</div>`:''}${lineHTML(T.npc,true)}<div class="trs">${esc(T.npc[2])}</div><button class="soft" id="dpl" style="min-height:34px;margin-top:4px">ฟังอีกครั้ง</button></div></div></div>
  <div class="mut">เลือกคำตอบที่เหมาะที่สุด</div><div style="display:flex;flex-direction:column;gap:8px" id="do">${opts.map((x,k)=>`<button class="opt w2" data-o="${k}" style="align-items:flex-start;text-align:left;min-height:60px">${lineHTML(x.o)}</button>`).join('')}</div><div id="dr"></div>`;back();
  setTimeout(()=>{if(my===run())say(T.npc[0],0.85)},250);$('#dpl').onclick=()=>say(T.npc[0],0.75);
  app.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{if(done)return;done=true;const x=opts[+b.dataset.o],good=opts.find(z=>z.ok).o;
   if(x.ok){ok++;pts+=15;b.classList.add('ok');FX.sfx.ok()}else{b.classList.add('bad');FX.sfx.bad();app.querySelectorAll('[data-o]')[opts.findIndex(z=>z.ok)].classList.add('ok')}
   setTimeout(()=>say(good[0],0.85),300);
   $('#dr').innerHTML=`<div class="${x.ok?'okn':'note'}">${x.ok?'ตอบได้เหมาะสม':'คำตอบที่เหมาะกว่าคือ'}<br><b>${esc(good[0])}</b><br>${esc(good[2])}</div><div class="g2"><button class="soft" id="dsp">พูดตาม (+5)</button><button class="btn" id="dn">${ti<d.turns.length-1?'ต่อไป':'จบบทสนทนา'}</button></div><div id="dsr"></div>`;
   let spoke=false;$('#dsp').onclick=()=>{if(spoke)return;const r0=listen(alts=>{const heard=(alts[0]||{}).t||'';const norm=s=>String(s).toLowerCase().replace(/[^a-z\u3040-\u30ff\u3400-\u9fff]/g,'');const t=norm(good[0]),h=norm(heard);
     let same=0;for(const c of new Set(t))if(h.includes(c))same++;const sc=t?same/new Set(t).size:0;if(sc>=.6){spoke=true;pts+=5;FX.sfx.ok();$('#dsr').innerHTML=`<div class="okn">พูดได้ดี +5 · “${esc(heard)}”</div>`}else $('#dsr').innerHTML=`<div class="note">ระบบได้ยินว่า “${esc(heard||'-')}” ลองอีกครั้ง</div>`},e=>{$('#dsr').innerHTML=`<div class="note">${esc(e)}</div>`});if(r0)$('#dsr').innerHTML='<div class="mut">กำลังฟัง… พูดได้เลย</div>'};
   $('#dn').onclick=()=>{log.push(`<div style="display:flex;gap:8px;opacity:.7"><span class="mut" style="flex:none;width:40px;text-align:center">${T.who?esc(T.who.slice(0,6)):'อีกฝ่าย'}</span><div style="font-size:14px">${esc(T.npc[0])}</div></div><div style="display:flex;justify-content:flex-end;opacity:.7"><div style="font-size:14px;background:#D2F0EA;border-radius:10px;padding:4px 10px">${esc(good[0])}</div></div>`);ti++;turn()}})}
 turn()}

/* ---------- ลงทะเบียนเกม ---------- */
Object.assign(FX.GCOL,{rain:['#E6F1FB','#0C447C','#185FA5'],fill:['#EAF3DE','#27500A','#3B6D11'],spell:['#EEEDFE','#3C3489','#534AB7'],tf:['#FAECE7','#712B13','#993C1D'],hunter:['#FAEEDA','#633806','#854F0B'],bingo:['#FBEAF0','#72243E','#993556'],adv:['#E1F5EE','#085041','#0F6E56'],dialog:['#F1EFE8','#2C2C2A','#444441']});
Object.assign(FX.ICON,{
 rain:'<svg width="54" height="40" viewBox="0 0 60 40" aria-hidden="true"><rect class="fx-bob" x="6" y="2" width="20" height="10" rx="3" fill="#378ADD"/><rect class="fx-bob" style="animation-delay:.6s" x="32" y="8" width="22" height="10" rx="3" fill="#185FA5"/><rect x="0" y="34" width="60" height="5" rx="2" fill="#85B7EB"/></svg>',
 fill:'<svg width="54" height="40" viewBox="0 0 60 40" aria-hidden="true"><rect x="2" y="14" width="16" height="12" rx="3" fill="#97C459"/><rect class="fx-spark" x="21" y="14" width="18" height="12" rx="3" fill="none" stroke="#3B6D11" stroke-width="2" stroke-dasharray="3 2"/><rect x="42" y="14" width="16" height="12" rx="3" fill="#97C459"/></svg>',
 spell:'<svg width="54" height="40" viewBox="0 0 60 40" aria-hidden="true"><rect class="fx-bob" x="2" y="12" width="12" height="14" rx="3" fill="#7F77DD"/><rect class="fx-bob" style="animation-delay:.3s" x="17" y="12" width="12" height="14" rx="3" fill="#534AB7"/><rect class="fx-bob" style="animation-delay:.6s" x="32" y="12" width="12" height="14" rx="3" fill="#7F77DD"/><rect class="fx-bob" style="animation-delay:.9s" x="47" y="12" width="12" height="14" rx="3" fill="#534AB7"/></svg>',
 tf:'<svg width="54" height="40" viewBox="0 0 60 40" aria-hidden="true"><circle cx="16" cy="20" r="13" fill="#5DCAA5"/><path d="M10 20l4 4 8-8" stroke="#fff" stroke-width="3" fill="none"/><circle cx="44" cy="20" r="13" fill="#F09595"/><path d="M39 15l10 10M49 15L39 25" stroke="#fff" stroke-width="3"/></svg>',
 hunter:'<svg width="54" height="40" viewBox="0 0 60 40" aria-hidden="true"><path d="M4 30L18 10 32 24 46 6 56 16" stroke="#BA7517" stroke-width="3" fill="none" stroke-linecap="round"/><circle class="fx-spark" cx="46" cy="6" r="4" fill="#EF9F27"/></svg>',
 bingo:'<svg width="54" height="40" viewBox="0 0 60 40" aria-hidden="true"><g fill="#F4C0D1"><rect x="8" y="2" width="12" height="11" rx="2"/><rect x="24" y="2" width="12" height="11" rx="2"/><rect x="40" y="2" width="12" height="11" rx="2"/><rect x="8" y="15" width="12" height="11" rx="2"/><rect x="40" y="15" width="12" height="11" rx="2"/><rect x="8" y="28" width="12" height="11" rx="2"/><rect x="24" y="28" width="12" height="11" rx="2"/></g><rect class="fx-spark" x="24" y="15" width="12" height="11" rx="2" fill="#D4537E"/><rect x="40" y="28" width="12" height="11" rx="2" fill="#D4537E"/></svg>',
 adv:'<svg width="54" height="40" viewBox="0 0 60 40" aria-hidden="true"><path d="M6 34q12-20 24-8t24-22" stroke="#5DCAA5" stroke-width="3" stroke-dasharray="4 3" fill="none"/><circle cx="6" cy="34" r="4" fill="#1D9E75"/><circle cx="30" cy="26" r="4" fill="#1D9E75"/><circle class="fx-bob" cx="54" cy="6" r="5" fill="#EF9F27"/></svg>',
 dialog:'<svg width="54" height="40" viewBox="0 0 60 40" aria-hidden="true"><rect x="2" y="4" width="34" height="14" rx="6" fill="#B4B2A9"/><rect x="24" y="22" width="34" height="14" rx="6" fill="#5F5E5A"/><circle class="fx-spark" cx="31" cy="29" r="2" fill="#fff"/><circle class="fx-spark" style="animation-delay:.3s" cx="38" cy="29" r="2" fill="#fff"/><circle class="fx-spark" style="animation-delay:.6s" cx="45" cy="29" r="2" fill="#fff"/></svg>'});
A.reg({id:'adv',cat:'adv',name:'ตะลุยด่าน',desc:'แผนที่หลายร้อยด่าน ผ่านด่านปลดล็อกด่านต่อ ทุก 5 ด่านเจอบอส'},adv);
A.reg({id:'rain',cat:'mem',name:'ฝนคำศัพท์',desc:'แตะความหมายให้ทันก่อนคำตกถึงพื้น ยิ่งนานยิ่งเร็ว'},rain);
A.reg({id:'tf',cat:'mem',name:'ถูกหรือผิด',desc:'ตอบให้ไวว่าคำกับความหมายตรงกันไหม'},tf,{opts:[60,90,120,180],unit:'วินาที',d:60});
A.reg({id:'bingo',cat:'mem',name:'บิงโกศัพท์',desc:'ฟังแล้วกากระดาน 3×3 ครบแถวได้บิงโก'},bingo,{opts:[1,3,5,10],unit:'กระดาน',d:3});
A.reg({id:'fill',cat:'use',name:'เติมคำในช่องว่าง',desc:'ประโยคจริงหายไป 1 คำ เลือกคำที่ใช่'},fill,{opts:[10,20,30,50],unit:'ข้อ',d:10});
A.reg({id:'spell',cat:'use',name:'สะกดคำ',get desc(){return LANG==='zh'?'เรียงตัวอักษรจีนให้เป็นคำ':LANG==='ja'?'เรียงคานะให้เป็นคำ':'เรียงตัวอักษรให้เป็นคำ'}},spell,{opts:[10,20,30,50],unit:'คำ',d:10});
A.reg({id:'dialog',cat:'use',name:'บทสนทนาหน้างาน',desc:'ลูกค้าแจ้งไฟดับ สั่งอาหาร ถามทาง เลือกคำตอบแล้วพูดตาม'},dialog);
A.reg({id:'hunter',cat:'ear',name:'นักล่าเสียง',get desc(){return LANG==='zh'?'ฟังแล้วทายวรรณยุกต์':LANG==='ja'?'ฟังแล้วแยกเสียงสั้น/ยาว/っ':'ฟังแล้วแยกคู่เสียงคล้าย'}},hunter,{opts:[10,20,30,50],unit:'ข้อ',d:10});
})();
