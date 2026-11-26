/* English Step — ข้อมูลบทเรียน Level 0 (ใช้ร่วมกันระหว่างแอปและน้องมีไฟ) */
(function(g){
/* ================= ข้อมูลบทเรียน Level 0 ================= */
const SOUNDS=[
{id:'th1',name:'th ไม่ก้อง /θ/',ex:['think','three','thank','bath'],
 steps:['แลบปลายลิ้นออกมาวางระหว่างฟันบนกับฟันล่างเล็กน้อย','เป่าลมผ่านปลายลิ้นเบาๆ เสียงคล้ายลมรั่ว','ไม่ใช่ “ท” และไม่ใช่ “ซ” แบบไทย'],
 pairs:[['think','sink'],['three','tree'],['thank','tank'],['path','pass']]},
{id:'th2',name:'th ก้อง /ð/',ex:['this','that','mother','they'],
 steps:['ปลายลิ้นวางระหว่างฟันเหมือน th ไม่ก้อง','เปล่งเสียงจากคอไปด้วย จับคอจะรู้สึกสั่น','ไม่ใช่ “ด” แบบไทย'],
 pairs:[['they','day'],['then','den'],['those','doze'],['breathe','breed']]},
{id:'v',name:'v /v/',ex:['very','five','love','van'],
 steps:['ฟันบนแตะริมฝีปากล่างเบาๆ','เปล่งเสียงให้ริมฝีปากล่างสั่นเล็กน้อย','ไม่ใช่ “ว” ที่ห่อปาก'],
 pairs:[['vest','west'],['vine','wine'],['vet','wet'],['very','wary']]},
{id:'lr',name:'l และ r',ex:['light','right','glass','grass'],
 steps:['l: ปลายลิ้นแตะปุ่มเหงือกหลังฟันบน','r: ม้วนปลายลิ้นขึ้นเล็กน้อย แต่ไม่แตะเพดาน ห่อปากนิดหนึ่ง','r ภาษาอังกฤษไม่รัวลิ้นแบบ ร ไทย'],
 pairs:[['light','right'],['lice','rice'],['lead','read'],['glass','grass']]},
{id:'sh',name:'sh /ʃ/ กับ s',ex:['she','ship','shoe','fish'],
 steps:['sh: ห่อปากยื่นออกเล็กน้อย ลิ้นถอยหลังนิดหนึ่ง แล้วปล่อยลม “ชฺ”','s: ยิ้มกว้าง ลิ้นใกล้ฟัน เสียง “ซ” ใสๆ','ฟังให้ออกว่า sh เสียงทุ้มกว่า s'],
 pairs:[['she','see'],['ship','sip'],['shoe','sue'],['sheet','seat']]},
{id:'ch',name:'ch /tʃ/ กับ sh',ex:['chair','cheap','watch','chicken'],
 steps:['ch: เริ่มด้วยลิ้นแตะเพดานแล้วปล่อยออกทันที เสียงสั้นแบบ “ช” ที่กระแทก','sh: ไม่แตะเพดาน ลมไหลยาวต่อเนื่อง','ลองพูด chip กับ ship สลับกัน'],
 pairs:[['chip','ship'],['chair','share'],['cheap','sheep'],['watch','wash']]},
{id:'z',name:'z /z/ กับ s',ex:['zoo','zero','eyes','is'],
 steps:['ตำแหน่งลิ้นเหมือน s','เปล่งเสียงจากคอไปด้วย ได้เสียงหึ่งแบบผึ้ง','ภาษาไทยไม่มีเสียงนี้ ฝึกลากเสียง zzzz ก่อน'],
 pairs:[['zoo','sue'],['zip','sip'],['eyes','ice'],['buzz','bus']]},
{id:'ii',name:'อี ยาว /iː/ กับ อิ สั้น /ɪ/',ex:['sheep','ship','leave','live'],
 steps:['/iː/ ยาว: ยิ้มกว้าง ลากเสียง “อี”','/ɪ/ สั้น: ปากผ่อนลง เสียงอยู่ระหว่าง “อิ” กับ “เอะ”','ความยาวเสียงเปลี่ยนความหมายของคำ'],
 pairs:[['sheep','ship'],['leave','live'],['seat','sit'],['feet','fit']]},
{id:'ae',name:'แอ /æ/ กับ เอ /e/',ex:['bad','man','cat','apple'],
 steps:['/æ/: อ้าปากกว้าง ลดคางลง เสียง “แอ”','/e/: อ้าปากน้อยกว่า เสียง “เอะ”','ส่องกระจก ดูว่าคางลดลงตอน /æ/'],
 pairs:[['bad','bed'],['man','men'],['sad','said'],['pan','pen']]},
{id:'fs',name:'เสียงท้าย -s',ex:['cats','dogs','books','buses'],
 steps:['คนไทยมักทิ้งเสียงท้าย ให้ลากเสียง “ซฺ” สั้นๆ ตอนจบคำ','ถ้าเป็นหลายชิ้น ต้องได้ยินเสียง s ท้ายคำ','buses ท้ายคำออกเสียงเป็น “-ซิซ”'],
 pairs:[['cat','cats'],['book','books'],['car','cars'],['bus','buses']]},
{id:'fd',name:'เสียงท้าย -t / -d',ex:['bad','bat','need','neat'],
 steps:['ท้ายคำต้องแตะลิ้นที่ปุ่มเหงือกเบาๆ','-d: สระก่อนหน้ายาวขึ้นเล็กน้อย','-t: สระสั้นและหยุดเสียงเร็ว'],
 pairs:[['bad','bat'],['bed','bet'],['need','neat'],['card','cart']]},
{id:'cl',name:'เสียงควบกล้ำ (ไม่เติมสระ)',ex:['street','school','spring','stop'],
 steps:['คนไทยมักเติมสระแทรก เช่น “ซะ-ตอป”','พูดพยัญชนะติดกันโดยไม่มีสระคั่น: s-t-o-p','ฝึกช้าๆ แล้วค่อยเร็วขึ้น'],
 pairs:[['sport','support'],['blow','below'],['plight','polite'],['prayed','parade']]}
];
const DEMO={
th1:{m:'θ',w:'think',cmp:[['θ','think'],['s','sink']],yt:'how to pronounce th sound think'},
th2:{m:'ð',w:'this',cmp:[['ð','they'],['d','day']],yt:'how to pronounce voiced th sound this'},
v:{m:'v',w:'very',cmp:[['v','vest'],['w','west']],yt:'how to pronounce v and w sound'},
lr:{m:'l',w:'light',cmp:[['l','light'],['r','right']],yt:'how to pronounce l and r sound'},
sh:{m:'ʃ',w:'she',cmp:[['ʃ','she'],['s','see']],yt:'how to pronounce sh and s sound'},
ch:{m:'tʃ',w:'chair',cmp:[['tʃ','chip'],['ʃ','ship']],yt:'how to pronounce ch and sh sound'},
z:{m:'z',w:'zoo',cmp:[['z','zoo'],['s','sue']],yt:'how to pronounce z sound'},
ii:{m:'iː',w:'sheep',cmp:[['iː','sheep'],['ɪ','ship']],yt:'long ee vs short i sheep ship pronunciation'},
ae:{m:'æ',w:'bad',cmp:[['æ','bad'],['e','bed']],yt:'how to pronounce ae vs e bad bed'},
fs:{m:'s',w:'cats',seq:['æ','t','s'],yt:'how to pronounce final s sound'},
fd:{m:'d',w:'bad',seq:['æ','d'],cmp:[['d','bad'],['t','bat']],yt:'how to pronounce final t and d sounds'},
cl:{m:'s',w:'stop',seq:['s','t','ɒ','p'],yt:'consonant clusters pronunciation st sp'}
};
const VOCAB=[
['ทักทาย','hello','สวัสดี','Hello, my name is Mali.'],['ทักทาย','goodbye','ลาก่อน','Goodbye, see you tomorrow.'],['ทักทาย','please','กรุณา / ได้โปรด','Water, please.'],['ทักทาย','thank you','ขอบคุณ','Thank you very much.'],['ทักทาย','sorry','ขอโทษ (ทำผิด)','Sorry, I am late.'],['ทักทาย','excuse me','ขอโทษนะ (เรียก/ขอทาง)','Excuse me, where is the bank?'],['ทักทาย','yes','ใช่','Yes, I do.'],['ทักทาย','no','ไม่','No, thank you.'],
['ตัวเลข','one','หนึ่ง','I have one bag.'],['ตัวเลข','two','สอง','I have two cats.'],['ตัวเลข','three','สาม','Three eggs, please.'],['ตัวเลข','four','สี่','We are four people.'],['ตัวเลข','five','ห้า','It is five o’clock.'],['ตัวเลข','six','หก','I wake up at six.'],['ตัวเลข','seven','เจ็ด','There are seven days in a week.'],['ตัวเลข','eight','แปด','He is eight years old.'],['ตัวเลข','nine','เก้า','The shop opens at nine.'],['ตัวเลข','ten','สิบ','It costs ten baht.'],
['สี','red','สีแดง','I like the red car.'],['สี','blue','สีน้ำเงิน / ฟ้า','The sky is blue.'],['สี','green','สีเขียว','The tree is green.'],['สี','yellow','สีเหลือง','A banana is yellow.'],['สี','black','สีดำ','My bag is black.'],['สี','white','สีขาว','I have a white shirt.'],
['ครอบครัว','mother','แม่','My mother is a teacher.'],['ครอบครัว','father','พ่อ','My father drives a car.'],['ครอบครัว','brother','พี่ชาย / น้องชาย','My brother is tall.'],['ครอบครัว','sister','พี่สาว / น้องสาว','My sister likes music.'],['ครอบครัว','son','ลูกชาย','Their son is nine.'],['ครอบครัว','daughter','ลูกสาว','Their daughter is ten.'],['ครอบครัว','baby','ทารก','The baby is sleeping.'],['ครอบครัว','family','ครอบครัว','I love my family.'],
['อาหาร','rice','ข้าว','I eat rice every day.'],['อาหาร','water','น้ำ','Can I have some water?'],['อาหาร','egg','ไข่','I want two eggs.'],['อาหาร','fish','ปลา','We eat fish on Friday.'],['อาหาร','chicken','ไก่','Chicken rice, please.'],['อาหาร','fruit','ผลไม้','I buy fruit at the market.'],['อาหาร','coffee','กาแฟ','I drink coffee in the morning.'],['อาหาร','milk','นม','The baby drinks milk.'],
['ของใช้','phone','โทรศัพท์','Where is my phone?'],['ของใช้','bag','กระเป๋า','This bag is new.'],['ของใช้','book','หนังสือ','I read a book.'],['ของใช้','pen','ปากกา','Can I use your pen?'],['ของใช้','car','รถยนต์','The car is red.'],['ของใช้','house','บ้าน','My house is big.'],['ของใช้','door','ประตู','Please close the door.'],['ของใช้','table','โต๊ะ','The book is on the table.']
];
const TH={"think": "คิด", "three": "สาม", "thank": "ขอบคุณ", "bath": "อาบน้ำ", "sink": "จม / อ่างล้างจาน", "tree": "ต้นไม้", "tank": "ถัง", "path": "ทางเดิน", "pass": "ผ่าน", "this": "นี่ / อันนี้", "that": "นั่น / อันนั้น", "mother": "แม่", "they": "พวกเขา", "day": "วัน", "then": "จากนั้น", "den": "ถ้ำสัตว์", "those": "เหล่านั้น", "doze": "งีบหลับ", "breathe": "หายใจ", "breed": "สายพันธุ์", "very": "มาก", "five": "ห้า", "love": "รัก", "van": "รถตู้", "vest": "เสื้อกั๊ก", "west": "ทิศตะวันตก", "vine": "เถาวัลย์", "wine": "ไวน์", "vet": "สัตวแพทย์", "wet": "เปียก", "wary": "ระวังตัว", "light": "แสง / เบา", "right": "ขวา / ถูกต้อง", "glass": "แก้ว", "grass": "หญ้า", "lice": "เหา", "rice": "ข้าว", "lead": "นำ", "read": "อ่าน", "she": "เธอ (ผู้หญิง)", "ship": "เรือ", "shoe": "รองเท้า", "fish": "ปลา", "see": "เห็น", "sip": "จิบ", "sue": "ฟ้องร้อง", "sheet": "แผ่น / ผ้าปู", "seat": "ที่นั่ง", "chair": "เก้าอี้", "cheap": "ราคาถูก", "watch": "นาฬิกา / ดู", "chicken": "ไก่", "chip": "ชิ้นเล็ก / มันฝรั่งทอด", "share": "แบ่งปัน", "sheep": "แกะ", "wash": "ล้าง", "zoo": "สวนสัตว์", "zero": "ศูนย์", "eyes": "ดวงตา", "is": "เป็น / อยู่ / คือ", "zip": "ซิป", "ice": "น้ำแข็ง", "buzz": "เสียงหึ่ง", "bus": "รถเมล์", "leave": "ออกไป", "live": "อาศัยอยู่", "sit": "นั่ง", "feet": "เท้า (หลายข้าง)", "fit": "พอดี", "bad": "แย่ / ไม่ดี", "man": "ผู้ชาย", "cat": "แมว", "apple": "แอปเปิล", "bed": "เตียง", "men": "ผู้ชาย (หลายคน)", "sad": "เศร้า", "said": "พูดแล้ว", "pan": "กระทะ", "pen": "ปากกา", "cats": "แมว (หลายตัว)", "dogs": "สุนัข (หลายตัว)", "books": "หนังสือ (หลายเล่ม)", "buses": "รถเมล์ (หลายคัน)", "book": "หนังสือ", "car": "รถยนต์", "cars": "รถยนต์ (หลายคัน)", "bat": "ไม้ตี / ค้างคาว", "need": "ต้องการ", "neat": "เรียบร้อย", "bet": "เดิมพัน", "card": "บัตร / การ์ด", "cart": "รถเข็น", "street": "ถนน", "school": "โรงเรียน", "spring": "ฤดูใบไม้ผลิ", "stop": "หยุด", "sport": "กีฬา", "support": "สนับสนุน", "blow": "เป่า", "below": "ข้างล่าง", "plight": "สภาพลำบาก", "polite": "สุภาพ", "prayed": "สวดมนต์แล้ว", "parade": "ขบวนพาเหรด"};
const VTH=["สวัสดี ฉันชื่อมะลิ", "ลาก่อน แล้วพบกันพรุ่งนี้", "ขอน้ำหน่อย", "ขอบคุณมาก", "ขอโทษ ฉันมาสาย", "ขอโทษนะ ธนาคารอยู่ที่ไหน", "ใช่ ฉันทำ", "ไม่ล่ะ ขอบคุณ", "ฉันมีกระเป๋าหนึ่งใบ", "ฉันมีแมวสองตัว", "ขอไข่สามฟอง", "พวกเรามีสี่คน", "ตอนนี้เวลาห้านาฬิกา", "ฉันตื่นตอนหกโมง", "หนึ่งสัปดาห์มีเจ็ดวัน", "เขาอายุแปดขวบ", "ร้านเปิดตอนเก้าโมง", "ราคาสิบบาท", "ฉันชอบรถสีแดงคันนั้น", "ท้องฟ้าเป็นสีฟ้า", "ต้นไม้เป็นสีเขียว", "กล้วยเป็นสีเหลือง", "กระเป๋าของฉันเป็นสีดำ", "ฉันมีเสื้อเชิ้ตสีขาว", "แม่ของฉันเป็นครู", "พ่อของฉันขับรถยนต์", "พี่ชาย (น้องชาย) ของฉันตัวสูง", "พี่สาว (น้องสาว) ของฉันชอบดนตรี", "ลูกชายของพวกเขาอายุเก้าขวบ", "ลูกสาวของพวกเขาอายุสิบขวบ", "ทารกกำลังนอนหลับ", "ฉันรักครอบครัวของฉัน", "ฉันกินข้าวทุกวัน", "ขอน้ำหน่อยได้ไหม", "ฉันต้องการไข่สองฟอง", "พวกเรากินปลาในวันศุกร์", "ขอข้าวมันไก่หนึ่งจาน", "ฉันซื้อผลไม้ที่ตลาด", "ฉันดื่มกาแฟตอนเช้า", "ทารกดื่มนม", "โทรศัพท์ของฉันอยู่ที่ไหน", "กระเป๋าใบนี้ใหม่", "ฉันอ่านหนังสือ", "ขอใช้ปากกาของคุณได้ไหม", "รถคันนี้สีแดง", "บ้านของฉันหลังใหญ่", "กรุณาปิดประตู", "หนังสืออยู่บนโต๊ะ"];
const TIPS=[
['จำเป็นกลุ่มสถานการณ์','อย่าจำคำเดี่ยวๆ แบบสุ่ม ให้จำเป็นชุดที่ใช้ด้วยกัน เช่น ชุด “ร้านอาหาร” rice, water, chicken, please สมองจะดึงทั้งชุดออกมาพร้อมกันเมื่ออยู่ในสถานการณ์จริง'],
['ได้ยิน → พูด → เห็น → เขียน','ทุกคำใหม่ให้ฟังเสียงก่อน พูดตามดังๆ 3 ครั้ง แล้วดูตัวสะกด และพิมพ์หรือเขียน 1 ครั้ง ใช้หลายประสาทพร้อมกันจะจำได้นานกว่าการอ่านอย่างเดียว'],
['ทบทวนก่อนลืม (Spaced Repetition)','คนเราลืมคำใหม่เร็วมากในวันแรก การทบทวนในวันที่ 1, 3, 7, 14, 30 ทำให้จำได้ระยะยาว ระบบคลังศัพท์ในแอปนี้จัดรอบให้อัตโนมัติ แค่เข้ามาทบทวนทุกวัน'],
['ผูกกับภาพและเรื่องเล่า','นึกภาพให้ชัดและแปลกๆ เช่น “egg” นึกถึงไข่ใบยักษ์ตกใส่หัว ภาพที่ตลกหรือแปลกจะจำง่ายกว่าภาพธรรมดา'],
['ใช้ในประโยคของตัวเอง','หลังเรียนคำใหม่ แต่งประโยคเกี่ยวกับชีวิตตัวเอง 1 ประโยค เช่น “My daughter likes fruit.” คำที่เกี่ยวกับตัวเราจะติดอยู่ในความจำนานกว่า'],
['พูดกับตัวเองทุกวัน','เห็นของรอบตัวให้พูดชื่อเป็นภาษาอังกฤษในใจหรือออกเสียง เช่น เห็นประตูพูดว่า “door” ใช้เวลาวันละไม่กี่นาทีแต่ได้ฝึกทั้งวัน']
];

g.ES_DATA={SOUNDS,DEMO,VOCAB,TH,VTH,TIPS};
})(typeof window!=="undefined"?window:globalThis);
