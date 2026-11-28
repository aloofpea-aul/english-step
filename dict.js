/* ===== พจนานุกรม (ขั้นที่ 1: ค้นจากคลังคำในบทเรียนทุกระดับ) ===== */
(function(){
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ü/g,'v').replace(/[\s'’\-·.,]/g,'');
const k2h=s=>String(s||'').replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
const isThai=s=>/[฀-๿]/.test(s);
let IDX=null,IDXN=0;
function index(){if(IDX&&IDXN===ALL.length)return IDX;IDXN=ALL.length;IDX=ALL.map(e=>({e,w:norm(e.w),th:String(e.th||''),r:LANG==='en'?'':norm(e.py||''),r2:LANG==='zh'?norm(String(e.py||'').replace(/[üǖǘǚǜ]/g,'v')):'',k:LANG==='ja'?k2h(String(e.kana||'').replace(/\s/g,'')):''}));return IDX}
function search(q){q=String(q||'').trim();if(!q)return[];const out=[];
 if(isThai(q)){const t=q.replace(/\s/g,'');for(const x of index()){const th=x.th.replace(/\s/g,'');const i=th.indexOf(t);if(i<0)continue;
   const parts=x.th.split(/[,;\/(（]/).map(s=>s.trim().replace(/\s/g,''));out.push({x,s:parts.includes(t)?0:i===0?1:2+x.th.length/100})}}
 else{const n=norm(q),h=k2h(q.replace(/\s/g,''));for(const x of index()){let s=9;
   const test=(v,base)=>{if(!v)return;if(v===n||v===h)s=Math.min(s,base);else if(v.startsWith(n)||v.startsWith(h))s=Math.min(s,base+1+v.length/100);else if(n.length>=2&&(v.includes(n)||v.includes(h)))s=Math.min(s,base+3)};
   test(x.w,0);test(x.r,0.5);test(x.r2,0.5);test(x.k,0.5);if(s<9)out.push({x,s})}}
 return out.sort((a,b)=>a.s-b.s||a.x.e.lv-b.x.e.lv).slice(0,60).map(o=>o.x.e)}
function inReview(e){return !!(P().cards||{})[e.w]}
function addReview(e){const C=P().cards=P().cards||{};if(!C[e.w])C[e.w]={box:1,due:Date.now()};save(D);if(window.touch)touch()}
const row=(e,i)=>`<button class="dict-row" data-i="${i}" style="display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:#fff;border:1px solid #E3E7F1;border-radius:14px;padding:10px 12px;font:inherit;cursor:pointer">
 <span style="flex:1;min-width:0"><span style="font-weight:700;font-size:${CJK?22:18}px">${esc(e.w)}</span>${CJK&&e.py&&e.py!==e.w?` <span class="py" style="font-weight:400">${esc(e.py)}</span>`:''}${D.showRD&&e.rd?`<br><span class="rd">${rdHTML(e.rd)}</span>`:''}<br><span style="font-size:15px;color:#2B3550">${esc(e.th)}</span></span>
 <span style="display:flex;flex-direction:column;align-items:flex-end;gap:6px"><span class="fx-pill" style="background:#E1F5EE;color:#085041;font-size:11px">Level ${e.lv}</span><span data-say="${i}" role="button" aria-label="ฟังเสียง" style="width:38px;height:38px;border-radius:50%;background:#E6F1FB;color:#185FA5;display:flex;align-items:center;justify-content:center"><i class="ti ti-volume" style="font-size:20px" aria-hidden="true"></i></span></span></button>`;
function detail(e){const exRd=D.showRD?(LANG==='en'?autoRead(e.ex):e.srd||''):'';
 return `<div class="card fx-pop" style="background:#E6F1FB;border-color:#B5D4F4;gap:8px">
 <div style="display:flex;align-items:center;gap:10px"><div style="flex:1">${bigW(e.w)}${pyw(e.w)}${D.showRD&&e.rd?`<div class="rd" style="font-size:17px">${rdHTML(e.rd)}</div>`:''}</div></div>
 <div style="font-size:18px;font-weight:700;color:#0C447C">${esc(e.th)}</div>
 ${e.note?`<div class="mut">${esc(e.note)}</div>`:''}
 ${e.ex?`<div style="background:#fff;border-radius:12px;padding:10px"><div style="font-size:${CJK?19:17}px;font-weight:600">${esc(e.ex)}</div>${CJK&&e.expy?`<div class="py">${esc(e.expy)}</div>`:''}${exRd?`<div class="rd">${rdHTML(exRd)}</div>`:''}<div class="trs">${esc(e.exth||'')}</div><button class="soft" id="dEx" style="margin-top:6px;min-height:36px">ฟังประโยค</button></div>`:''}
 <div class="g2"><button class="soft" id="dPlay">ฟังเสียง</button><button class="soft" id="dSlow">ฟังช้า</button></div>
 <button class="${inReview(e)?'soft':'btn'}" id="dAdd">${inReview(e)?'อยู่ในชุดทบทวนแล้ว':'+ เพิ่มเข้าชุดทบทวน'}</button></div>`}
function dict(q){q=q==null?(window.__dq||''):q;window.__dq=q;
 if(!allReady){app.innerHTML='<h1>พจนานุกรม</h1><div class="mut">กำลังโหลดคำศัพท์ทุกระดับ…</div>';loadAll().then(()=>{allReady=true;if(app.querySelector('h1')&&app.querySelector('h1').textContent==='พจนานุกรม')dict(q)});return}
 const ph=LANG==='en'?'พิมพ์ไทย หรือ English':LANG==='zh'?'พิมพ์ไทย จีน หรือพินอิน (ni hao)':'พิมพ์ไทย ญี่ปุ่น หรือคานะ';
 app.innerHTML=`<div class="row" style="align-items:center"><button class="back" id="dBk" aria-label="กลับ">${BACK}</button><div style="flex:1"><h1>พจนานุกรม</h1><div class="mut">${esc(LP.thName)} · ${ALL.length.toLocaleString()} คำในบทเรียน</div></div></div>
 ${langRow()}
 <div style="display:flex;align-items:center;gap:8px;background:#fff;border:2px solid #C9D3F2;border-radius:14px;padding:4px 6px 4px 12px"><i class="ti ti-search" style="font-size:20px;color:#4A5470" aria-hidden="true"></i><input id="dQ" type="search" value="${esc(q)}" placeholder="${ph}" autocomplete="off" style="flex:1;border:none;outline:none;font:inherit;font-size:17px;min-height:44px;background:transparent">${MIC?`<button id="dMic" aria-label="พูดเพื่อค้นหา" style="border:none;background:#EEEDFE;color:#3C3489;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center">${MIC}</button>`:''}</div>
 <div id="dMsg" class="mut"></div><div id="dDet"></div><div id="dRes" style="display:flex;flex-direction:column;gap:8px"></div>`;
 let res=[];const inp=$('#dQ');$('#dBk').onclick=()=>go('home');app.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{try{sessionStorage.setItem('es_dict_resume',inp.value||'')}catch(e){}switchLang(b.dataset.lang)});
 
 function render(){const v=inp.value;window.__dq=v;res=search(v);$('#dDet').innerHTML='';
  $('#dMsg').textContent=!v.trim()?'ค้นได้ทั้งคำแปลไทย คำศัพท์ และคำอ่าน · แตะคำเพื่อดูรายละเอียด':res.length?`พบ ${res.length}${res.length>=60?'+':''} คำ`:'ไม่พบในคลังคำของบทเรียน ลองพิมพ์คำอื่น หรือคำที่สั้นลง';
  $('#dRes').innerHTML=(v.trim()?res:sugg()).map(row).join('');if(!v.trim())res=sugg();
  app.querySelectorAll('#dRes [data-i]').forEach(b=>b.onclick=ev=>{const e=res[+b.dataset.i];if(ev.target.closest('[data-say]')){say(e.w);return}open(e)})}
 let sg=null;function sugg(){if(!sg){const C=P().cards||{};const seen=ALL.filter(e=>C[e.w]);sg=(seen.length?seen.slice(-8).reverse():ALL.filter(e=>e.lv===0).slice(0,8))}return sg}
 function open(e){say(e.w);$('#dDet').innerHTML=detail(e);window.scrollTo(0,0);
  $('#dPlay').onclick=()=>say(e.w);$('#dSlow').onclick=()=>say(e.w,0.55);const x=$('#dEx');if(x)x.onclick=()=>say(e.ex,0.85);
  $('#dAdd').onclick=()=>{if(inReview(e))return;addReview(e);FX.sfx.ok();FX.toast('เพิ่ม '+e.w+' เข้าชุดทบทวนแล้ว','#0F6E56');const b=$('#dAdd');b.className='soft';b.textContent='อยู่ในชุดทบทวนแล้ว'}}
 let t=null;inp.oninput=()=>{clearTimeout(t);t=setTimeout(render,120)};
 const m=$('#dMic');if(m)m.onclick=()=>{$('#dMsg').textContent='กำลังฟัง… พูดคำ'+LP.thName+'ได้เลย';listen(a=>{const h=(a[0]||{}).t||'';inp.value=h.replace(/[。．.!?！？]$/,'');render()},err=>{$('#dMsg').textContent=err})};
 render();if(!q)setTimeout(()=>{try{inp.focus()}catch(e){}},50)}
window.dict=dict;
window.dictBoxHTML=()=>`<button id="dictBox" style="display:flex;align-items:center;gap:10px;width:100%;background:#fff;border:2px solid #C9D3F2;border-radius:14px;padding:12px 14px;font:inherit;text-align:left;cursor:pointer"><i class="ti ti-search" style="font-size:20px;color:#4A5470" aria-hidden="true"></i><span style="flex:1;color:#8A93AB;font-size:16px">ค้นหาคำศัพท์ (พจนานุกรม)</span><i class="ti ti-book" style="font-size:20px;color:#534AB7" aria-hidden="true"></i></button>`;
window.dictBind=()=>{const b=$('#dictBox');if(b)b.onclick=()=>go('dict','')};
window.dictResume=()=>{let v=null;try{v=sessionStorage.getItem('es_dict_resume');sessionStorage.removeItem('es_dict_resume')}catch(e){}if(v!=null)setTimeout(()=>go('dict',v),0)};
})();
