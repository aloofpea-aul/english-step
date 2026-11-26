/* ภาพปากด้านข้าง + ด้านหน้า สำหรับห้องออกเสียง (สร้างเป็น SVG) */
(function(g){
const SKIN='#F4C9A8',LINE='#5A3A2A',LIP='#D9776B',TEETH='#FFFFFF',TONGUE='#E8828A',MOUTH='#7A2E2E',AIR='#2F5BEA',VOICE='#B85A12',TOUCH='#0E7C6E';
// p: jaw(0-18) tip[x,y] body(y ของโคนลิ้น) lipX(ยื่นปาก 0-8) lipLowY(ริมฝีปากล่างยกขึ้น) air voice touch[x,y] spread(0-1) open(0-1) round(0-1)
function side(p){
 const j=p.jaw||0, lx=p.lipX||0;
 const ut=74, lt=78+j;                      // ปลายฟันบน / ขอบบนฟันล่าง
 const ll=p.lipLowY!=null?p.lipLowY:(lt+2);  // ขอบบนริมฝีปากล่าง
 const tx=p.tip[0], ty=p.tip[1], by=p.body;
 let s=`<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.label||'ภาพปากด้านข้าง'}">`;
 // ใบหน้า: หน้าผาก-จมูก-ริมฝีปากบน | ริมฝีปากล่าง-คาง-คอ
 s+=`<path d="M8 8 H150 L156 24 L178 40 L158 46 Q166 52 ${168+lx} 60 Q${172+lx} 70 150 ${ut+2} L150 ${ll} Q${172+lx} ${ll+2} ${168+lx} ${ll+12} Q160 ${ll+22} 152 ${ll+26} Q156 ${120+j} 140 ${134+j} Q110 ${150+j} 90 162 H8 Z" fill="${SKIN}" stroke="${LINE}" stroke-width="1.5" stroke-linejoin="round"/>`;
 // ช่องปาก
 s+=`<path d="M36 70 Q70 44 126 50 Q140 54 142 ${ut} L141 ${lt+10} Q120 ${118+j} 80 ${124+j} Q48 ${128+j} 36 ${138+j} Z" fill="${MOUTH}"/>`;
 // ลิ้น
 s+=`<path d="M36 ${140+j} C38 ${by+6} ${tx-48} ${by-6} ${tx} ${ty} C${tx+2} ${ty+7} ${tx-8} ${ty+12} ${tx-16} ${ty+14} Q${Math.min(tx-20,130)} ${lt+16} 110 ${118+j} Q70 ${130+j} 36 ${144+j} Z" fill="${TONGUE}" stroke="${LINE}" stroke-width="1.2" stroke-linejoin="round"/>`;
 // เพดาน + ปุ่มเหงือก
 s+=`<path d="M36 70 Q70 44 126 50 Q137 52 140 58" fill="none" stroke="${LINE}" stroke-width="2.2" stroke-linecap="round"/>`;
 // ฟันบน / ฟันล่าง
 s+=`<path d="M139 54 L149 54 L148 ${ut} L141 ${ut} Z" fill="${TEETH}" stroke="${LINE}" stroke-width="1"/>`;
 s+=`<path d="M139 ${lt} L148 ${lt} L148 ${lt+18} L139 ${lt+18} Z" fill="${TEETH}" stroke="${LINE}" stroke-width="1"/>`;
 // ริมฝีปาก
 s+=`<path d="M149 54 Q${166+lx} 54 ${170+lx} 64 Q${170+lx} ${ut+2} 149 ${ut+1} Z" fill="${LIP}" stroke="${LINE}" stroke-width="1.2"/>`;
 s+=`<path d="M148 ${ll} Q${168+lx} ${ll-1} ${170+lx} ${ll+9} Q${166+lx} ${ll+20} 148 ${ll+18} Z" fill="${LIP}" stroke="${LINE}" stroke-width="1.2"/>`;
 if(p.touch) s+=`<circle cx="${p.touch[0]}" cy="${p.touch[1]}" r="6" fill="none" stroke="${TOUCH}" stroke-width="2.5"/>`;
 if(p.air) s+=`<path d="M178 ${p.air} h16 M178 ${p.air-7} h11 M178 ${p.air+7} h11" stroke="${AIR}" stroke-width="2.5" stroke-linecap="round"/><path d="M190 ${p.air-5} l5 5 -5 5" fill="none" stroke="${AIR}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
 if(p.voice) s+=`<path d="M18 150 q5 -4 0 -8 q-5 -4 0 -8 M28 150 q5 -4 0 -8 q-5 -4 0 -8" fill="none" stroke="${VOICE}" stroke-width="2.2" stroke-linecap="round"/>`;
 return s+'</svg>';
}
// มุมมองด้านหน้า: รูปปาก
function front(p){
 const w=32+(p.spread||0)*16-(p.round||0)*12, h=4+(p.open||0)*26;
 let s=`<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="รูปปากด้านหน้า">`;
 s+=`<ellipse cx="60" cy="40" rx="${w+8}" ry="${h/2+12}" fill="${LIP}" stroke="${LINE}" stroke-width="1.2"/>`;
 s+=`<ellipse cx="60" cy="40" rx="${w}" ry="${h/2+2}" fill="${MOUTH}"/>`;
 if(p.teethTop!==false&&h>6) s+=`<rect x="${60-w*0.6}" y="${40-h/2}" width="${w*1.2}" height="${Math.min(7,h/2)}" rx="2" fill="${TEETH}"/>`;
 if(p.lipOnTeeth) s+=`<rect x="${60-w*0.6}" y="36" width="${w*1.2}" height="5" rx="2" fill="${TEETH}"/>`;
 if(p.tongueOut) s+=`<ellipse cx="60" cy="${40+1}" rx="${w*0.55}" ry="4" fill="${TONGUE}" stroke="${LINE}" stroke-width="0.8"/>`;
 return s+'</svg>';
}
// รูปแบบปากของแต่ละเสียง
const M={
 'θ':{label:'เสียง th ไม่ก้อง',jaw:4,tip:[158,78],body:92,air:78,touch:[146,77],f:{spread:.4,open:.3,tongueOut:1}},
 'ð':{label:'เสียง th ก้อง',jaw:4,tip:[158,78],body:92,air:78,voice:1,touch:[146,77],f:{spread:.4,open:.3,tongueOut:1}},
 'v':{label:'เสียง v',jaw:2,tip:[132,88],body:96,lipLowY:70,air:74,voice:1,touch:[147,73],f:{spread:.4,open:.15,lipOnTeeth:1,teethTop:true}},
 'w':{label:'เสียง w',jaw:4,tip:[132,90],body:80,lipX:7,voice:1,f:{round:1,open:.25,teethTop:false}},
 'l':{label:'เสียง l',jaw:6,tip:[139,59],body:96,voice:1,touch:[139,57],f:{spread:.3,open:.45}},
 'r':{label:'เสียง r',jaw:6,tip:[124,64],body:92,lipX:4,voice:1,f:{round:.6,open:.4}},
 's':{label:'เสียง s',jaw:2,tip:[137,64],body:86,air:76,f:{spread:.9,open:.18}},
 'ʃ':{label:'เสียง sh',jaw:3,tip:[128,64],body:80,lipX:7,air:76,f:{round:.8,open:.3}},
 'tʃ':{label:'เสียง ch',jaw:3,tip:[138,58],body:80,lipX:6,touch:[138,56],air:76,f:{round:.7,open:.3}},
 'z':{label:'เสียง z',jaw:2,tip:[137,64],body:86,air:76,voice:1,f:{spread:.9,open:.18}},
 'iː':{label:'อี ยาว',jaw:2,tip:[136,84],body:66,voice:1,f:{spread:1,open:.2}},
 'ɪ':{label:'อิ สั้น',jaw:5,tip:[136,88],body:76,voice:1,f:{spread:.6,open:.3}},
 'æ':{label:'แอ',jaw:16,tip:[138,100],body:104,voice:1,f:{spread:.7,open:1}},
 'e':{label:'เอะ',jaw:9,tip:[137,92],body:88,voice:1,f:{spread:.7,open:.55}},
 't':{label:'เสียง t / d ท้ายคำ',jaw:3,tip:[139,59],body:92,touch:[139,57],f:{spread:.4,open:.25}},
 'ɒ':{label:'ออ (stop)',jaw:12,tip:[134,98],body:104,lipX:4,voice:1,f:{round:.6,open:.8}},
 'd':{label:'เสียง d ท้ายคำ',jaw:3,tip:[139,59],body:92,touch:[139,57],voice:1,f:{spread:.4,open:.25}},
 'p':{label:'ปากปิด (p/b)',jaw:0,tip:[132,88],body:94,lipLowY:76,f:{spread:.4,open:0,teethTop:false}}
};

const REST={label:'ท่าปกติ',jaw:2,tip:[130,90],body:98,lipX:0,f:{spread:.4,open:0,teethTop:false}};
const L=(a,b,t)=>a+(b-a)*t;
function lerp(a,b,t){ // a,b = ท่า, t 0..1
 const j=L(a.jaw||0,b.jaw||0,t);
 const llA=a.lipLowY!=null?a.lipLowY:80+(a.jaw||0), llB=b.lipLowY!=null?b.lipLowY:80+(b.jaw||0);
 const fa=a.f||{},fb=b.f||{};
 return {label:b.label,jaw:j,tip:[L(a.tip[0],b.tip[0],t),L(a.tip[1],b.tip[1],t)],body:L(a.body,b.body,t),lipX:L(a.lipX||0,b.lipX||0,t),lipLowY:L(llA,llB,t),
  air:t>.85?b.air:null,voice:t>.85?b.voice:null,touch:t>.85?b.touch:null,
  f:{spread:L(fa.spread||0,fb.spread||0,t),open:L(fa.open||0,fb.open||0,t),round:L(fa.round||0,fb.round||0,t),tongueOut:t>.6&&fb.tongueOut,lipOnTeeth:t>.6&&fb.lipOnTeeth,teethTop:fb.teethTop}};
}

g.MOUTH={side,front,M,REST,lerp,draw:k=>({side:side(M[k]),front:front(M[k].f),label:M[k].label})};
})(typeof window!=='undefined'?window:globalThis);
