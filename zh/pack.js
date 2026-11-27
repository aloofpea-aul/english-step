/* ชุดภาษาจีน: ข้อมูลบทเรียนเสียง + ตัวแปลงพินอินเป็นคำอ่านไทย */
(function(g){
/* ---------- พินอิน → คำอ่านไทย ---------- */
const TM={'ā':'a1','á':'a2','ǎ':'a3','à':'a4','ē':'e1','é':'e2','ě':'e3','è':'e4','ī':'i1','í':'i2','ǐ':'i3','ì':'i4','ō':'o1','ó':'o2','ǒ':'o3','ò':'o4','ū':'u1','ú':'u2','ǔ':'u3','ù':'u4','ǖ':'ü1','ǘ':'ü2','ǚ':'ü3','ǜ':'ü4','ü':'ü0'};
const INI=['zh','ch','sh','b','p','m','f','d','t','n','l','g','k','h','j','q','x','r','z','c','s','y','w',''];
const FIN=['iang','iong','uang','ueng','ang','eng','ong','ian','iao','uai','uan','üan','ai','ei','ao','ou','an','en','er','ia','ie','iu','in','ing','ua','uo','ui','un','üe','ün','a','o','e','i','u','ü'];
const SYL=new Set();
INI.forEach(i=>FIN.forEach(f=>{if(f==='er'&&i)return;let s=i+f;if(/^[jqxy]ü/.test(s))SYL.add(s.replace('ü','u'));SYL.add(s)}));
['yi','yin','ying','yu','yue','yuan','yun','ya','ye','yao','you','yan','yang','yong','wu','wa','wo','wai','wei','wan','wen','wang','weng','r','n','ng','m'].forEach(s=>SYL.add(s));
// แยกพยางค์ในคำเดียว (DP) คืน [{s:'xie',t:4,raw:'xiè'}]
function splitWord(tok){const low=tok.toLowerCase();const base=[],tone=[];
 for(const ch of low){const m=TM[ch];if(m){base.push(m[0]);tone.push(+m[1])}else if(/[a-z]/.test(ch)){base.push(ch);tone.push(0)}}
 const n=base.length,best=new Array(n+1).fill(null);best[0]={c:0,p:[]};
 for(let i=0;i<n;i++){if(!best[i])continue;for(let L=1;L<=6&&i+L<=n;L++){const s=base.slice(i,i+L).join('');if(!SYL.has(s))continue;
  const ts=tone.slice(i,i+L).filter(Boolean);const c=best[i].c+1+(ts.length>1?5:0);
  if(!best[i+L]||c<best[i+L].c)best[i+L]={c,p:best[i].p.concat([{s,t:ts[0]||0}])}}}
 return best[n]?best[n].p:null}
function parse(py){const out=[];String(py||'').toLowerCase().replace(/[’'`]/g,' ').split(/[^a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]+/).filter(Boolean).forEach(tok=>{const p=splitWord(tok);if(p)out.push(...p)});return out}
const MID={b:'ป',d:'ต',g:'ก',j:'จ',zh:'จ',z:'จ','':'อ'};
const PAIR={p:['พ','ผ'],m:['ม','หม'],f:['ฟ','ฝ'],t:['ท','ถ'],n:['น','หน'],l:['ล','หล'],k:['ค','ข'],h:['ฮ','ห'],q:['ช','ฉ'],x:['ซ','ส'],ch:['ช','ฉ'],sh:['ซ','ส'],r:['ร','หร'],c:['ช','ฉ'],s:['ซ','ส'],y:['ย','หย'],w:['ว','หว']};
const TPL={a:'C#า',o:'โC#',e:'เC#อ',ai:'ไC#',ei:'เC#ย',ao:'เC#า',ou:'โC#ว',an:'C#าน',en:'เCิ#น',ang:'C#าง',eng:'เCิ#ง',ong:'C#ง',er:'เC#อร์',
 i:'Cี#',ia:'เCี#ย',ie:'เCี#ย',iao:'เCี#ยว',iu:'Cิ#ว',ian:'เCี#ยน',in:'Cิ#น',iang:'เCี#ยง',ing:'Cิ#ง',iong:'Cย#ง',
 u:'Cู#',ua:'Cว#า',uo:'Cั#ว',uai:'ไCว#',ui:'Cุ#ย',uan:'C#วน',un:'Cุ#น',uang:'Cว#าง',ueng:'เCวิ#ง',
 'ü':'Cวี#','üe':'เCวี#ย','üan':'เCวี#ยน','ün':'Cวิ#น'};
const YW={yi:['','i'],ya:['y','a'],ye:['y','ie'],yao:['y','ao'],you:['y','ou'],yan:['y','ian'],yin:['','in'],yang:['y','ang'],ying:['','ing'],yong:['y','ong'],
 yu:['','ü'],yue:['y','üe'],yuan:['y','uan'],yun:['y','un'],wu:['','u'],wa:['w','a'],wo:['w','o'],wai:['w','ai'],wei:['w','ei'],wan:['w','an'],wen:['w','en'],wang:['w','ang'],weng:['w','eng']};
function split(s){if(YW[s])return YW[s];for(const i of INI){if(i&&s.startsWith(i)){let f=s.slice(i.length);if(/^[jqx]$/.test(i)&&f[0]==='u')f='ü'+f.slice(1);return [i,f]}}return ['',s]}
function thai(sy){const s=sy.s,t=sy.t;if(s==='r')return 'ร์';if(s==='n'||s==='ng'||s==='m')return 'อึ'+(t===4?'้':t===3?'่':'')+(s==='m'?'ม':'ง');
 let [i,f]=split(s);let tpl;
 if(f==='i'&&/^(zh|ch|sh|r|z|c|s)$/.test(i))tpl='Cื#อ';else if(i==='w'&&f==='o')tpl='C#อ';else if(f==='o'&&/^[bpmf]$/.test(i))tpl='Cั#ว';else tpl=TPL[f];if(!tpl)return s;
 let C,mk='';
 if(MID[i]!=null){C=MID[i];mk=['','','๋','่','้'][t]}
 else{const [L,H]=PAIR[i]||['อ','อ'];if(t===2||t===3){C=H;mk=t===3?'่':''}else{C=L;mk=t===4?'่':''}}
 let r=tpl.replace('C',C).replace('#',mk);
 if(/^(zh|ch|sh|r|z|c)$/.test(i)||/^ü/.test(f)||f==='er')r='{'+r+'}';return r}
// เปลี่ยนเสียงวรรณยุกต์ตามการพูดจริง: 3+3 และ 一 / 不
function sandhi(syl,han){const a=syl.map(x=>Object.assign({},x));const ch=han?[...String(han).replace(/[^㐀-鿿]/g,'')]:[];const ok=ch.length===a.length;
 for(let k=0;k<a.length;k++){const nx=a[k+1];if(!nx)break;
  if(ok&&ch[k]==='不'&&a[k].s==='bu'&&nx.t===4)a[k].t=2;
  else if(ok&&ch[k]==='一'&&a[k].s==='yi'&&nx.t)a[k].t=nx.t===4?2:4;
  else if(a[k].t===3&&nx.t===3)a[k].t=2}
 return a}
function read(py,han){const syl=parse(py);if(!syl.length)return '';return sandhi(syl,han).map(thai).join('-')}
function readSentence(py,han){const words=String(py||'').split(/\s+/).filter(Boolean);const per=words.map(w=>parse(w));
 const flat=[].concat(...per);const hz=String(han||'').replace(/[^\u3400-\u9fff]/g,'');
 let sd=[];let start=0;const brk=words.map(w=>/[,.!?;:，。！？；：]$/.test(w));
 // แบ่งช่วงตามเครื่องหมายวรรคตอน แล้วเปลี่ยนเสียงทีละช่วง
 const segs=[];let cur=[];per.forEach((p,k)=>{cur.push(...p);if(brk[k]){segs.push(cur);cur=[]}});if(cur.length)segs.push(cur);
 const useH=hz.length===flat.length;let hp=0;segs.forEach(sg=>{sd.push(...sandhi(sg,useH?hz.slice(hp,hp+sg.length):''));hp+=sg.length});
 let k=0;return words.map((w,wi)=>{const n=per[wi].length;if(!n)return w;const part=sd.slice(k,k+n).map(thai).join('-');k+=n;return part+(w.match(/[,.!?;:，。！？；：]+$/)||[''])[0]}).join(' ')}
function tones(py){return parse(py).map(x=>x.t)}

/* ---------- บทเรียนเสียง ---------- */
const SOUNDS=[
{id:'t1',name:'วรรณยุกต์ 1 · เสียงสูงเรียบ ¯',tone:[1],ex:['妈','八','书','天'],
 steps:['ตั้งเสียงสูงกว่าเสียงพูดปกติ แล้วลากยาวเรียบๆ ไม่ขึ้นไม่ลง','เหมือนร้องเพลงโน้ตสูงค้างไว้','คนไทยมักพูดต่ำไป ให้ยกเสียงสูงขึ้นอีก'],
 pairs:[['妈','马'],['八','爸'],['书','树'],['汤','糖']]},
{id:'t2',name:'วรรณยุกต์ 2 · เสียงขึ้น ˊ',tone:[2],ex:['来','学','人','茶'],
 steps:['เริ่มกลางๆ แล้วไล่ขึ้นสูงเร็วๆ','คล้ายเวลาถามว่า “หา?” แบบแปลกใจ','ใกล้เคียงเสียงจัตวาของไทย'],
 pairs:[['麻','马'],['来','赖'],['糖','汤'],['十','是']]},
{id:'t3',name:'วรรณยุกต์ 3 · เสียงต่ำ ˇ',tone:[3],ex:['我','你','好','马'],
 steps:['กดเสียงลงต่ำที่สุด ต่ำกว่าเสียงเอกของไทย','ถ้าอยู่ท้ายประโยค ให้เด้งขึ้นนิดหนึ่งตอนจบ','ถ้าอยู่กลางประโยค พูดแค่ช่วงต่ำ ไม่ต้องเด้งขึ้น'],
 pairs:[['马','妈'],['买','卖'],['好','号'],['米','蜜']]},
{id:'t4',name:'วรรณยุกต์ 4 · เสียงลง ˋ',tone:[4],ex:['是','不','去','爸'],
 steps:['เริ่มสูงแล้วตกลงต่ำเร็วและสั้น','เหมือนออกคำสั่งหนักแน่น “ไป!”','ใกล้เคียงเสียงโทของไทย แต่ตกแรงกว่า'],
 pairs:[['卖','买'],['是','十'],['爸','八'],['树','书']]},
{id:'t0',name:'เสียงเบา (ไม่มีวรรณยุกต์)',tone:[1,0],ex:['妈妈','爸爸','你们','谢谢'],
 steps:['พยางค์หลังพูดสั้นและเบา ไม่เน้น','ระดับเสียงขึ้นกับพยางค์หน้า','พบบ่อยในคำซ้ำ และคำช่วยท้ายประโยค เช่น 的 了 吗 呢'],
 pairs:[['妈妈','马马'],['东西','东西'],['是的','是']]},
{id:'s33',name:'3 + 3 กลายเป็น 2 + 3',tone:[2,3],ex:['你好','很好','可以','水果'],
 steps:['ถ้าพยางค์เสียง 3 อยู่ติดกัน พยางค์แรกเปลี่ยนเป็นเสียง 2','你好 เขียน nǐ hǎo แต่พูดเป็น ní hǎo','คำอ่านไทยในแอปเปลี่ยนเสียงให้แล้วตามการพูดจริง'],
 pairs:[['你好','您好'],['很好','真好'],['可以','科学']]},
{id:'yb',name:'一 กับ 不 เปลี่ยนเสียง',tone:[2,4],ex:['不是','一个','一起','不要'],
 steps:['不 bù ถ้าตามด้วยเสียง 4 ให้พูดเป็น bú','一 yī ถ้าตามด้วยเสียง 4 พูดเป็น yí ถ้าตามด้วยเสียง 1-3 พูดเป็น yì','ถ้า 一 อยู่ลำพังหรือเป็นตัวเลขเรียงลำดับ พูด yī ตามเดิม'],
 pairs:[['不是','不来'],['一个','一天'],['不要','不好']]},
{id:'zh',name:'zh ch sh r ม้วนลิ้น กับ z c s',ex:['知道','吃','是','人'],
 steps:['zh ch sh r: ยกปลายลิ้นม้วนไปด้านหลังเพดาน ไม่แตะฟัน','z c s: ปลายลิ้นแตะหลังฟันบน ยิ้มกว้าง เสียงใส','ไทยไม่มีทั้งสองแบบ คำอ่านไทยจึงขีดเส้นจุดไว้'],
 pairs:[['四','是'],['三','山'],['早','找'],['菜','柴']]},
{id:'jqx',name:'j q x ลิ้นแบนชิดเพดาน',ex:['家','去','小','谢谢'],
 steps:['ปลายลิ้นแตะหลังฟันล่าง ยกกลางลิ้นชิดเพดานแข็ง','ยิ้มกว้าง j ≈ จี q ≈ ชี (พ่นลม) x ≈ ซี','ตามด้วย i หรือ ü เท่านั้น'],
 pairs:[['七','吃'],['西','师'],['鸡','知'],['小','少']]},
{id:'ü',name:'ü เสียง “อวี” ปากจู๋',ex:['女','去','鱼','绿'],
 steps:['ทำลิ้นเหมือนพูด “อี”','ค้างลิ้นไว้ แล้วห่อปากจู๋เหมือนพูด “อู”','หลัง j q x y เขียนเป็น u แต่ออกเสียง ü'],
 pairs:[['女','奴'],['绿','路'],['鱼','姨'],['去','气']]},
{id:'nng',name:'-n กับ -ng ท้ายพยางค์',ex:['山','上','门','朋友'],
 steps:['-n: ปลายลิ้นแตะปุ่มเหงือก เหมือน น สะกด','-ng: โคนลิ้นยกแตะเพดานอ่อน เหมือน ง สะกด','คนไทยแยกได้ดีอยู่แล้ว แค่ฟังให้ชัด'],
 pairs:[['三','桑'],['人','扔'],['金','京'],['心','星']]},
{id:'e',name:'e กับ er',ex:['饿','车','喝','二'],
 steps:['e: ปากเปิดเล็กน้อย ไม่ห่อ เสียงคล้าย “เออ” ลึกในคอ','er: พูด “เออ” แล้วม้วนปลายลิ้นขึ้น','儿 ท้ายคำ (北京话) ให้ม้วนลิ้นต่อท้ายพยางค์'],
 pairs:[['饿','二'],['喝','黑'],['车','吃']]}
];
const DEMO={t1:{tone:[1],w:'妈',cmp:[[1,'妈'],[3,'马']]},t2:{tone:[2],w:'来',cmp:[[2,'麻'],[3,'马']]},t3:{tone:[3],w:'马',cmp:[[3,'买'],[4,'卖']]},t4:{tone:[4],w:'是',cmp:[[4,'是'],[2,'十']]},
 t0:{tone:[1,0],w:'妈妈'},s33:{tone:[2,3],w:'你好'},yb:{tone:[2,4],w:'不是'},
 zh:{m:'ʂ',w:'是',cmp:[['ʂ','是'],['s','四']],seq:null},jqx:{m:'tɕ',w:'西',cmp:[['tɕ','西'],['ʂ','师']]},'ü':{m:'y',w:'女',cmp:[['y','女'],['w','奴']]},
 nng:{m:'n',w:'山',cmp:[['n','三'],['ŋ','桑']]},e:{m:'ɤ',w:'饿',cmp:[['ɤ','饿'],['r','二']]}};
Object.keys(DEMO).forEach(k=>DEMO[k].yt=({t1:'chinese first tone',t2:'chinese second tone',t3:'chinese third tone',t4:'chinese fourth tone',t0:'chinese neutral tone',s33:'chinese third tone sandhi',yb:'chinese 一 不 tone change',zh:'chinese zh ch sh r pronunciation',jqx:'chinese j q x pronunciation',ü:'chinese ü pronunciation',nng:'chinese n ng pronunciation',e:'chinese e er pronunciation'})[k]);
// คำในบทเรียนเสียง (คำที่ไม่ได้อยู่ในคลังศัพท์)
const DICT={'东西':['dōngxi','ของ / สิ่งของ'],'是的':['shì de','ใช่แล้ว'],'很好':['hěn hǎo','ดีมาก'],'可以':['kěyǐ','ได้ / สามารถ'],'不是':['bú shì','ไม่ใช่'],'一个':['yí gè','หนึ่ง (อัน/คน)'],'一起':['yìqǐ','ด้วยกัน'],'不要':['bú yào','ไม่เอา / อย่า'],'知道':['zhīdào','รู้'],'门':['mén','ประตู'],'朋友':['péngyou','เพื่อน'],'谢谢':['xièxie','ขอบคุณ'],'妈妈':['māma','แม่'],'爸爸':['bàba','พ่อ'],'你们':['nǐmen','พวกคุณ'],'你好':['nǐ hǎo','สวัสดี'],'水果':['shuǐguǒ','ผลไม้'],'上':['shàng','บน'],'家':['jiā','บ้าน'],'小':['xiǎo','เล็ก'],'谢':['xiè','ขอบคุณ'],'马':['mǎ','ม้า'],'麻':['má','งา / ชา (อาการ)'],'赖':['lài','พึ่งพา / โทษ'],'号':['hào','หมายเลข / วันที่'],'米':['mǐ','ข้าวสาร / เมตร'],'蜜':['mì','น้ำผึ้ง'],'树':['shù','ต้นไม้'],'汤':['tāng','ซุป'],'糖':['táng','น้ำตาล'],'卖':['mài','ขาย'],'马马':['mǎma','ม้าๆ'],'您好':['nín hǎo','สวัสดี (สุภาพ)'],'真好':['zhēn hǎo','ดีจริงๆ'],'科学':['kēxué','วิทยาศาสตร์'],'不来':['bù lái','ไม่มา'],'一天':['yì tiān','หนึ่งวัน'],'不好':['bù hǎo','ไม่ดี'],'早':['zǎo','เช้า'],'找':['zhǎo','หา'],'柴':['chái','ฟืน'],'鸡':['jī','ไก่'],'知':['zhī','รู้'],'师':['shī','ครู / อาจารย์'],'少':['shǎo','น้อย'],'奴':['nú','ทาส'],'姨':['yí','น้า / ป้า'],'气':['qì','อากาศ / แก๊ส'],'桑':['sāng','หม่อน'],'扔':['rēng','โยน'],'京':['jīng','เมืองหลวง'],'星':['xīng','ดาว'],'黑':['hēi','ดำ'],'吃':['chī','กิน'],'七':['qī','เจ็ด'],'西':['xī','ตะวันตก'],'四':['sì','สี่'],'三':['sān','สาม'],'山':['shān','ภูเขา'],'菜':['cài','ผัก / กับข้าว'],'绿':['lǜ','เขียว'],'路':['lù','ถนน'],'鱼':['yú','ปลา'],'女':['nǚ','ผู้หญิง'],'去':['qù','ไป'],'金':['jīn','ทอง'],'心':['xīn','หัวใจ'],'人':['rén','คน'],'饿':['è','หิว'],'二':['èr','สอง'],'喝':['hē','ดื่ม'],'车':['chē','รถ'],'十':['shí','สิบ'],'是':['shì','ใช่ / เป็น'],'八':['bā','แปด'],'爸':['bà','พ่อ'],'书':['shū','หนังสือ'],'天':['tiān','วัน / ท้องฟ้า'],'妈':['mā','แม่'],'来':['lái','มา'],'学':['xué','เรียน'],'茶':['chá','ชา'],'我':['wǒ','ฉัน'],'你':['nǐ','คุณ'],'好':['hǎo','ดี'],'不':['bù','ไม่'],'买':['mǎi','ซื้อ']};

const TIPS=[
['ฟังวรรณยุกต์ก่อนจำความหมาย','ทุกครั้งที่เรียนคำใหม่ ให้ฟังแล้วชี้มือตามเส้นวรรณยุกต์ ขึ้น ลง เรียบ ต่ำ คนไทยมีหูวรรณยุกต์อยู่แล้ว ได้เปรียบมาก'],
['จำตัวอักษรด้วยส่วนประกอบ','ตัวจีนส่วนมากประกอบจากส่วนเล็กๆ เช่น 氵 = น้ำ อยู่ใน 河 แม่น้ำ 海 ทะเล 洗 ล้าง เห็นส่วนนี้ก็เดาความหมายได้'],
['เรียนเป็นคำ ไม่ใช่ทีละตัว','ภาษาจีนใช้คำสองพยางค์มาก เช่น 电 ไฟฟ้า + 话 คำพูด = 电话 โทรศัพท์ จำเป็นคำจะเอาไปใช้ได้ทันที'],
['ใช้คำยืมที่คนไทยรู้อยู่แล้ว','คำไทยหลายคำมาจากจีน เช่น 茶 ชา, 面 หมี่, 老板 เถ้าแก่ ใช้เป็นสะพานจำ'],
['พูดออกเสียงทุกครั้ง','อ่านในใจจะลืมวรรณยุกต์ ให้พูดออกเสียงพร้อมกดฟังต้นแบบ แล้วกดไมค์ให้ระบบฟัง'],
['ทบทวนตามรอบ','ระบบนัดทบทวน 1, 3, 7, 14, 30, 60 วัน กดปุ่มตามจริง ลืมก็กดลืม ระบบจะนำมาให้ทวนเร็วขึ้น']
];
const LEVELS=[{lv:0,name:'พินอิน + วรรณยุกต์',cefr:'HSK 1 ต้น',goal:150},{lv:1,name:'เอาตัวรอด',cefr:'HSK 1',goal:500},{lv:2,name:'สื่อสารประจำวัน',cefr:'HSK 2',goal:1272},{lv:3,name:'คุยได้คล่อง',cefr:'HSK 3',goal:2245},{lv:4,name:'มั่นใจในที่ทำงาน',cefr:'HSK 4',goal:3245}];
function soundFor(e){const syl=parse(e&&e.py||'');if(!syl.length)return null;
 for(const x of syl){const [i,f]=split(x.s);if(/^(zh|ch|sh|r|z|c)$/.test(i))return 'zh';if(/^[jqx]$/.test(i))return 'jqx';if(/^ü/.test(f))return 'ü'}
 return 't'+(syl[0].t||1)}
g.LANGPACK={soundFor,code:'zh',label:'中文',thName:'ภาษาจีน',tts:'zh-CN',ttsRe:/^zh[-_]?(CN|Hans)?/i,levels:LEVELS,SOUNDS,DEMO,DICT,TIPS,read,readSentence,tones,parse,
 fields:['w','py','th','ex','expy','exth'],hint:'ตัวอักษรจีน',lvFile:lv=>'zh/l'+lv+'.js'};
})(typeof window!=='undefined'?window:globalThis);
