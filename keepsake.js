/* ---------- Keepsakes: Advent devotional, Family Record, Stones of Remembrance ---------- */
'use strict';

/* ===== ADVENT ===== */
const ADV_THEMES=['Hope','Peace','Joy','Love'];
const ADV_WEEKS=['The Promise','Prepare the Way','Good News of Great Joy','God with Us'];
const ADV_CANDLE=['the candle of Hope, sometimes called the Prophecy Candle','the candle of Peace, sometimes called the Bethlehem Candle','the candle of Joy, sometimes called the Shepherds’ Candle','the candle of Love, sometimes called the Angels’ Candle'];
/* Four weeks, Sunday through Saturday, then Christmas Eve and Christmas Day */
const ADVENT=[
 // Week 1 — Hope
 {t:'A Great Light',r:['Isaiah 9:2-7'],c:'Isaiah 9:6',th:'Seven hundred years before Bethlehem, God told a people sitting in darkness that a Child would be born to them. Advent begins here, with a promise spoken into the dark. Whatever darkness you carry into this season, the Light has already been promised and has already come.',q:'Where do you need the light of Christ most this Christmas season?'},
 {t:'The First Promise',r:['Genesis 3:8-15'],c:'Genesis 3:15',th:'The first gospel promise came on the worst day in human history. Before Adam and Eve ever left the garden, God promised that the seed of the woman would crush the serpent’s head. God’s answer to sin was already on its way.',q:'What does it tell you about God that His rescue was promised in the very hour of man’s fall?'},
 {t:'A Blessing for All Nations',r:['Genesis 12:1-3'],c:'Genesis 12:3',th:'God called one man so that every family of the earth could be blessed. The Christmas story was never meant for a few. Whosoever will may come, and that promise reaches all the way to your family and to the people you work beside.',q:'Who in your life most needs to hear that the blessing of Christ is for them too?'},
 {t:'A Branch from Jesse',r:['Isaiah 11:1-10'],c:'Isaiah 11:2',th:'Jesse’s family tree had been cut down to a stump, and it looked like the end. But God said a Branch would grow out of those roots, full of His Spirit. God does His best work where things look finished.',q:'What in your life looks like a stump right now, and how might God bring new growth from it?'},
 {t:'Little Bethlehem',r:['Micah 5:2-5'],c:'Micah 5:2',th:'Bethlehem was too small to count, yet God chose it for the birth of the King. Heaven does not measure the way we do. God is pleased to use small places and ordinary people for His greatest purposes.',q:'Where might God be working in something you have counted as too small to matter?'},
 {t:'Immanuel',r:['Isaiah 7:10-14'],c:'Isaiah 7:14',th:'Immanuel means God with us. Not God watching from far off, and not God waiting for us to climb up to Him. He came down to where we are. That name is still true on every ordinary day of the year.',q:'How would today be different if you lived it fully aware that God is with you?'},
 {t:'The LORD Our Righteousness',r:['Jeremiah 23:5-6'],c:'Jeremiah 23:6',th:'The coming King would be called The LORD Our Righteousness. We could never make ourselves right with God, so He sent One who is our righteousness. The gift of Christmas is a Savior, not a self-improvement plan.',q:'Are you resting in Christ’s righteousness this morning, or still trying to earn your place?'},
 // Week 2 — Peace
 {t:'Comfort Ye My People',r:['Isaiah 40:1-11'],c:'Isaiah 40:11',th:'After long years of warning, God’s first word was comfort. He promised to come like a shepherd, gathering the lambs in His arms. The God who comes at Christmas is strong enough to rule the nations and gentle enough to carry the weak.',q:'What burden would you like the Good Shepherd to carry for you this week?'},
 {t:'My Messenger',r:['Malachi 3:1-4'],c:'Malachi 3:1',th:'After Malachi, heaven was silent for four hundred years. No prophet and no new word, only a promise that a messenger would come. If you are in a silent season, take heart. God keeps His word even when He seems quiet.',q:'Where are you waiting on God right now, and what promise can you hold on to while you wait?'},
 {t:'Zacharias in the Temple',r:['Luke 1:5-17'],c:'Luke 1:13',th:'Zacharias and Elisabeth had prayed for a child for years, and the answer came when they had stopped expecting it. God had not forgotten a single prayer. The angel’s first words were fear not, thy prayer is heard.',q:'What long-standing prayer do you need to bring to God again this morning?'},
 {t:'When God Seems Slow',r:['Luke 1:18-25'],c:'Luke 1:20',th:'Zacharias struggled to believe good news, and he spent months in silence learning to trust. Yet God still kept His promise. Our doubts do not cancel God’s faithfulness, but faith lets us enjoy it sooner.',q:'Where has doubt kept you from rejoicing in what God has promised?'},
 {t:'Beautiful Feet',r:['Isaiah 52:7-10'],c:'Isaiah 52:7',th:'The feet of the one who brings good news are called beautiful. Tired, dusty and worn, they are still beautiful because of the message they carry. Every believer has good tidings of peace to share this season.',q:'Who could you carry a word of peace or encouragement to this week?'},
 {t:'A Voice in the Wilderness',r:['Matthew 3:1-6'],c:'Matthew 3:2',th:'John the Baptist prepared the way for Jesus by calling people to repent. Preparing for Christmas is more than decorating a house. It is making room in the heart, turning from what crowds out the Savior.',q:'What needs to be cleared away in your heart to make room for Christ this Christmas?'},
 {t:'Perfect Peace',r:['Isaiah 26:3-4'],c:'Isaiah 26:3',th:'The season can be busy, loud and costly. God promises perfect peace, not to the one with an empty schedule, but to the one whose mind is stayed on Him. Peace is found in a Person.',q:'What is pulling your mind away from God this week, and how can you set it back on Him?'},
 // Week 3 — Joy
 {t:'Gabriel Comes to Mary',r:['Luke 1:26-33'],c:'Luke 1:33',th:'God sent His angel to a young woman in a forgotten town. She was not famous or powerful, but she was highly favoured of the Lord. God’s grace finds people in ordinary places and gives them a part in His story.',q:'What part might God be asking you to play in His work this season?'},
 {t:'Be It unto Me',r:['Luke 1:34-38'],c:'Luke 1:37',th:'Mary did not understand everything, but she said, be it unto me according to thy word. Faith does not need every answer before it obeys. With God nothing shall be impossible.',q:'Where is God asking you to say yes before you see how it will all work out?'},
 {t:'The Babe Leaped for Joy',r:['Luke 1:39-45'],c:'Luke 1:45',th:'Even before He was born, Jesus brought joy into a room. Elisabeth was filled with the Holy Ghost and blessed Mary for believing. Joy spreads when believers come together and encourage one another in the promises of God.',q:'Who is someone you could encourage in their faith this week?'},
 {t:'Mary’s Song',r:['Luke 1:46-55'],c:'Luke 1:46-47',th:'Mary’s first response to God’s plan was worship. She magnified the Lord and rejoiced in God her Saviour. Even Mary needed a Saviour, and she knew it, and that knowledge filled her with joy.',q:'Write your own few lines of praise. What has God done for you that makes your soul rejoice?'},
 {t:'His Name Is John',r:['Luke 1:57-66'],c:'Luke 1:66',th:'When Zacharias obeyed and named the child John, his tongue was loosed and he praised God. Obedience often opens the door to joy. The neighbours asked, what manner of child shall this be?',q:'Is there a step of obedience you have been putting off?'},
 {t:'The Dayspring from on High',r:['Luke 1:67-79'],c:'Luke 1:78-79',th:'Zacharias sang of the dayspring, the sunrise from heaven, coming to those who sit in darkness. Every sunrise this season can remind us that Christ came to guide our feet into the way of peace.',q:'Where do you need God to guide your feet into the way of peace?'},
 {t:'He Will Rejoice over Thee',r:['Zephaniah 3:14-17'],c:'Zephaniah 3:17',th:'We often think of our joy in God, but here God rejoices over His people with singing. The Lord in the midst of thee is mighty. The joy of Christmas starts with the joy of God, who delights to save.',q:'How does it change your morning to know that God rejoices over you?'},
 // Week 4 — Love
 {t:'Joseph’s Obedience',r:['Matthew 1:18-25'],c:'Matthew 1:21',th:'Joseph was a just man who faced a hard and confusing situation. When God spoke, he obeyed quietly and completely. He took Mary as his wife and named the child Jesus, for He shall save His people from their sins.',q:'What would quiet, faithful obedience look like for you in your home or work this week?'},
 {t:'God So Loved',r:['John 3:16-17'],c:'John 3:16',th:'Christmas is the love of God made visible. He gave His only begotten Son so that whosoever believeth in Him should not perish. That whosoever includes every person you will see today.',q:'How can you show the love of God to someone who would not expect it this week?'},
 {t:'In the Fulness of Time',r:['Galatians 4:4-7'],c:'Galatians 4:4-5',th:'God sent His Son at exactly the right time, not a day early and not a day late. He came to redeem us and make us sons and daughters. God’s timing in your life is just as careful.',q:'Where do you need to trust God’s timing more than your own?'},
 {t:'He Humbled Himself',r:['Philippians 2:5-11'],c:'Philippians 2:7',th:'The One who made the stars was laid in a feed trough. Christ did not cling to His glory but took the form of a servant. Let this mind be in you. The manger teaches us how to lead and how to love.',q:'Where is God calling you to serve someone in humility this week?'},
 {t:'Herein Is Love',r:['1 John 4:9-11'],c:'1 John 4:10',th:'Love did not begin with us loving God. It began with God loving us and sending His Son to be the propitiation for our sins. If God so loved us, we ought also to love one another.',q:'Whom is God asking you to love better this Christmas?'},
 {t:'The Road to Bethlehem',r:['Luke 2:1-5'],c:'Micah 5:2',th:'A Roman emperor issued a tax decree, and without knowing it he moved Mary and Joseph to the exact town the prophet named. God rules over the decisions of kings and the details of our lives.',q:'What circumstance that looks like an inconvenience might be God moving you where He wants you?'},
];
const ADV_EVE={t:'Born This Night',r:['Luke 2:6-14'],c:'Luke 2:11',th:'There was no room in the inn, so the King of glory was born among the animals. The first to hear were shepherds working the night shift. Tonight, make room. Unto you is born this day a Saviour, which is Christ the Lord.',q:'On this Christmas Eve, what would it mean to make room for Christ in every part of your life?'};
const ADV_DAY={t:'The Word Was Made Flesh',r:['Luke 2:15-20','John 1:1-14'],c:'John 1:14',th:'Merry Christmas. The Word that was with God in the beginning became flesh and dwelt among us. The shepherds came with haste, saw the Child, and went home glorifying and praising God. May you do the same today.',q:'Like the shepherds, what have you seen and heard of Jesus that you want to tell others today?'};

function adventDates(y){
  const xmas=new Date(y,11,25), dw=xmas.getDay();
  const s4=new Date(y,11,25-(dw===0?7:dw)), s1=new Date(y,11,s4.getDate()-21);
  return {s1,s4,xmas};
}
const dayOnly=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate());
const dayDiff=(a,b)=>Math.round((dayOnly(b)-dayOnly(a))/864e5);
function adventFor(d){
  d=d||(window.ADV_TEST_DATE?new Date(ADV_TEST_DATE):new Date());
  const {s1,xmas}=adventDates(d.getFullYear()), since=dayDiff(s1,d), toX=dayDiff(d,xmas);
  if(since<0) return since>=-14?{soon:true,start:s1,days:-since}:null;
  if(toX<0) return null;
  let e, week=Math.min(3,Math.floor(since/7)), key;
  if(toX===0){ e=ADV_DAY; key='day'; week=4; }
  else if(toX===1){ e=ADV_EVE; key='eve'; week=3; }
  else { e=ADVENT[Math.min(ADVENT.length-1,since)]; key=String(since); }
  const dayNo=since+1, total=dayDiff(s1,xmas)+1;
  return Object.assign({key,week,dayNo,total,toX,theme:week<4?ADV_THEMES[week]:'Christ',weekName:week<4?ADV_WEEKS[week]:'Christmas Day'},e);
}
function adventToday(){ if(S.settings.advent===false) return null; const a=adventFor(); return a&&!a.soon?a:null; }
function advChs(refs){ const out=[]; refs.forEach(x=>{ const r=parseRef(x); if(r&&!out.some(([b,c])=>b===r.book&&c===r.ch)) out.push([r.book,r.ch]); }); return out; }

/* The Advent reading takes the place of the usual reading during the season */
const _devoReadingBase=devoReading;
devoReading=function(){
  const a=adventToday();
  if(a) return {label:a.toX===0?'Christmas Day':a.toX===1?'Christmas Eve':`Advent · Week of ${a.theme} · Day ${a.dayNo}`, refs:a.r, chs:advChs(a.r), advent:a.key};
  return _devoReadingBase();
};

function candlesHTML(a,big){
  const lit=a?(a.week>=4?5:a.week+1):0;
  const cls=['p','p','k','p','w'];
  const order=[0,1,4,2,3];   // four around, Christ candle in the middle
  return `<div class="adv-candles${big?' big':''}" aria-label="${lit} candle${lit===1?'':'s'} lit">${order.map(i=>`<div class="cd ${cls[i]}${i<lit||(i===4&&lit===5)?' lit':''}${i===4?' ch':''}"><i></i><b></b></div>`).join('')}</div>`;
}
function adventStillHTML(a){
  const n=a.week>=4?'Light the Christ Candle':`Light ${ADV_CANDLE[Math.min(a.week,3)].split(',')[0]}`;
  return `<div class="adv-still">${candlesHTML(a,true)}<div class="adv-k">${a.week>=4?'Christmas Day':`Advent · Week of ${esc(a.theme)}`}</div>
    <div class="adv-t">${esc(a.t)}</div><div class="adv-s">${esc(n)}${a.toX>0?` · ${a.toX} day${a.toX===1?'':'s'} until Christmas`:''}</div></div>`;
}
function adventThoughtHTML(a){ return `<div class="adv-th"><div class="lab">A Thought for Today</div><p>${esc(a.th)}</p></div>`; }
function adventCTAExtra(){
  if(S.settings.advent===false) return '';
  const a=adventFor(); if(!a) return '';
  if(a.soon) return `<div class="adv-soon">${candlesHTML(null)}<div><b>Advent begins ${a.days===1?'tomorrow':a.start.toLocaleDateString([], {weekday:'long',month:'long',day:'numeric'})}</b><span>Your morning devotional becomes a daily Advent reading, all the way to Christmas Day.</span></div></div>`;
  return `<div class="adv-bar">${candlesHTML(a)}<div><b>${a.toX===0?'Merry Christmas':a.toX===1?'Christmas Eve':`Week of ${esc(a.theme)}`}</b><span>${a.toX>0?`${a.toX} day${a.toX===1?'':'s'} until Christmas`:'Unto us a Child is born'}</span></div></div>`;
}

/* All the Advent readings, to browse or preach from */
function adventSheet(){
  const y=new Date().getFullYear(), {s1,xmas}=adventDates(y), total=dayDiff(s1,xmas)+1, today=adventFor();
  let h='';
  for(let i=0;i<total;i++){
    const d=new Date(s1.getFullYear(),s1.getMonth(),s1.getDate()+i), a=adventFor(d);
    if(i===0||d.getDay()===0||a.toX<=1) h+=a.toX===0?'<div class="jgroup">Christmas Day</div>':a.toX===1?'<div class="jgroup">Christmas Eve</div>':d.getDay()===0?`<div class="jgroup">Week ${a.week+1} · ${esc(a.theme)} · ${esc(a.weekName)}</div>`:'';
    const cur=today&&!today.soon&&today.key===a.key;
    h+=`<button class="adv-row${cur?' cur':''}" data-r="${esc(a.r[0])}"><span class="dt">${d.toLocaleDateString([], {month:'short',day:'numeric'})}</span><span class="tx"><b>${esc(a.t)}</b><span>${esc(a.r.join('; '))}</span></span></button>`;
  }
  openSheet(`<button class="close" data-x>X</button><h3>Advent and Christmas</h3>
    <p class="small muted">A reading for every day from the first Sunday of Advent (${s1.toLocaleDateString([], {month:'long',day:'numeric'})}) through Christmas Day. During the season these become your Morning Devotional. Tap one to read it.</p>${h}
    <div class="switch"><span>Use these for my Morning Devotional during Advent</span><input type="checkbox" id="advOn" ${S.settings.advent===false?'':'checked'}></div>`);
  $$('#sheetInner .adv-row').forEach(b=>b.onclick=()=>{ const r=parseRef(b.dataset.r); closeSheet(); openReader(r.book,r.ch,r.verses); });
  $('#advOn').onchange=()=>{ S.settings.advent=$('#advOn').checked; persist(); DV.date=''; renderDevoCTA(); };
}

/* ===== FAMILY RECORD ===== */
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const FR=[
  {k:'birth',t:'Births',one:'a Birth',names:'Full name',ph:'e.g. Emma Grace Moore',place:'Where born',note:'Parents, or a note'},
  {k:'marriage',t:'Marriages',one:'a Marriage',names:'Husband and wife',ph:'e.g. Doug Moore and Linda Smith',place:'Church or place',note:'Who married them, or a note'},
  {k:'life',t:'New Life in Christ',one:'a Spiritual Milestone',names:'Name',ph:'Who',place:'Church',note:'A note or testimony',subs:['Saved','Baptized','Joined the church','Called to preach','Ordained','Dedicated to the Lord']},
  {k:'death',t:'Gone Home to Be with the Lord',one:'a Home-going',names:'Name',ph:'Full name',place:'Resting place',note:'A remembrance, or a favorite verse'},
];
const SUBV={'Saved':'was saved','Baptized':'was baptized','Joined the church':'joined the church','Called to preach':'was called to preach','Ordained':'was ordained','Dedicated to the Lord':'was dedicated to the Lord'};
function frDate(e){ if(!e.y&&!e.m) return ''; if(!e.m) return String(e.y); return `${MONTHS[e.m-1]}${e.d?' '+e.d:''}${e.y?(e.d?', ':' ')+e.y:''}`; }
const frSortKey=e=>(e.y||9999)*10000+(e.m||0)*100+(e.d||0);
function frFamilyName(){ if(S.pres&&S.pres.family) return S.pres.family; const n=(S.settings.name||'').trim().split(/\s+/); return n.length>1?n[n.length-1]:''; }
function renderFamily(){
  const box=$('#frBody'); if(!box) return; const fam=frFamilyName(), all=S.family||[];
  box.innerHTML=`<div class="prespage fr-title"><div class="ttl">Family Record</div><div class="rule"></div>
      <div class="cap">The Family of</div><div class="val" id="frFam">${fam?esc(fam):'<span class="muted">Tap to add</span>'}</div>
      <div class="rule"></div><div class="bless" style="font-style:italic">“But as for me and my house, we will serve the LORD.”</div><div class="bref">Joshua 24:15</div></div>
    ${FR.map(s=>{ const list=all.filter(e=>e.kind===s.k).sort((a,b)=>frSortKey(a)-frSortKey(b));
      return `<div class="fr-sec"><div class="fr-h"><span>${esc(s.t)}</span></div>
        ${list.length?list.map(e=>`<button class="fr-e" data-id="${e.id}"><span class="nm">${esc(e.names)}</span>
          <span class="mt">${[s.k==='life'&&e.sub?esc(e.sub):'',esc(frDate(e)),e.place?esc(e.place):''].filter(Boolean).join(' · ')}</span>
          ${e.note?`<span class="nt">${esc(e.note)}</span>`:''}</button>`).join(''):`<div class="fr-blank">${'<i></i>'.repeat(2)}</div>`}
        <button class="btn sm fr-add" data-k="${s.k}">Add ${esc(s.one)}</button></div>`; }).join('')}
    <p class="small muted" style="text-align:center;margin-top:18px">Birthdays, anniversaries and other dates appear on your Home page when they come around.</p>`;
  $('#frFam').onclick=()=>{ const n=prompt('Family name (for example: Moore, or Robertson)',fam); if(n===null) return; S.pres.family=n.trim(); persist(); renderFamily(); };
  $$('#frBody .fr-add').forEach(b=>b.onclick=()=>frSheet(b.dataset.k));
  $$('#frBody .fr-e').forEach(b=>b.onclick=()=>{ const e=all.find(x=>x.id===b.dataset.id); if(e) frSheet(e.kind,e); });
}
function frSheet(kind,e){
  const s=FR.find(x=>x.k===kind), isNew=!e; e=e||{};
  openSheet(`<button class="close" data-x>X</button><h3>${isNew?'Add '+esc(s.one):esc(s.t)}</h3>
    ${s.subs?`<label class="lbl">What happened</label><select id="feSub">${s.subs.map(x=>`<option ${e.sub===x?'selected':''}>${esc(x)}</option>`).join('')}</select>`:''}
    <label class="lbl">${esc(s.names)}</label><input type="text" id="feName" placeholder="${esc(s.ph)}" value="${esc(e.names||'')}">
    <label class="lbl">Date</label>
    <div class="fe-date"><select id="feM"><option value="">Month</option>${MONTHS.map((m,i)=>`<option value="${i+1}" ${e.m===i+1?'selected':''}>${m}</option>`).join('')}</select>
      <input type="text" inputmode="numeric" id="feD" placeholder="Day" maxlength="2" value="${e.d||''}"><input type="text" inputmode="numeric" id="feY" placeholder="Year" maxlength="4" value="${e.y||''}"></div>
    <p class="small muted" style="margin:6px 0 0">Leave the day or month blank if you only know the year.</p>
    <label class="lbl">${esc(s.place)}</label><input type="text" id="fePlace" value="${esc(e.place||'')}">
    <label class="lbl">${esc(s.note)}</label><textarea id="feNote" style="min-height:90px">${esc(e.note||'')}</textarea>
    <button class="btn red full" id="feSave" style="margin-top:14px">${isNew?'Add to the Record':'Save'}</button>
    ${isNew?'':'<button class="btn full" id="feDel" style="margin-top:10px">Remove from the Record</button>'}`);
  $('#feSave').onclick=()=>{
    const names=$('#feName').value.trim(); if(!names){ toast('Enter a name'); return; }
    const num=(id,lo,hi)=>{ const v=parseInt($(id).value,10); return v>=lo&&v<=hi?v:null; };
    const m=+$('#feM').value||null, d=num('#feD',1,31), y=num('#feY',1700,2200);
    if(!m&&!y){ toast('Enter at least the year'); return; }
    const rec=Object.assign(e,{kind,names,m,d:m?d:null,y,place:$('#fePlace').value.trim(),note:$('#feNote').value.trim(),updated:Date.now()});
    if(s.subs) rec.sub=$('#feSub').value;
    if(isNew){ rec.id=uid(); rec.ts=Date.now(); (S.family=S.family||[]).push(rec); }
    persist(); closeSheet(); toast(isNew?'Added to your Family Record':'Saved'); renderFamily();
  };
  if($('#feDel')) $('#feDel').onclick=()=>{ if(!confirm('Remove this from your Family Record?')) return; S.family=S.family.filter(x=>x.id!==e.id); persist(); closeSheet(); renderFamily(); };
}
function frPhrase(e,yrs,when){
  const n=yrs>0?yrs:0, Y=n?`${n} year${n===1?'':'s'}`:'';
  if(e.kind==='birth') return n?`${e.names} ${when==='today'?'turns':'will turn'} ${n}`:`${e.names}’s birthday`;
  if(e.kind==='marriage') return n?`${e.names}: ${Y} married`:`${e.names}: wedding anniversary`;
  if(e.kind==='life') return n?`${Y} since ${e.names} ${SUBV[e.sub]||'was saved'}`:`${e.names} ${SUBV[e.sub]||'was saved'} on this day`;
  return n?`Remembering ${e.names}, who went home ${Y} ago`:`Remembering ${e.names}`;
}
function renderFamToday(){
  const box=$('#famToday'); if(!box) return; const list=(S.family||[]).filter(e=>e.m&&e.d);
  if(!list.length){ box.innerHTML=''; return; }
  const now=dayOnly(new Date()), rows=[];
  for(let i=0;i<=7;i++){ const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i);
    list.filter(e=>e.m===d.getMonth()+1&&e.d===d.getDate()).forEach(e=>rows.push({e,i,d,yrs:e.y?d.getFullYear()-e.y:0})); }
  if(!rows.length){ box.innerHTML=''; return; }
  const today=rows.filter(r=>r.i===0), soon=rows.filter(r=>r.i>0).slice(0,3);
  box.innerHTML=`<div class="card fam-card"><div class="lab">${today.length?'Today in Your Family':'Coming Up in Your Family'}</div>
    ${today.map(r=>`<div class="fl">${esc(frPhrase(r.e,r.yrs,'today'))}</div>`).join('')}
    ${soon.map(r=>`<div class="fs">${esc(r.i===1?'Tomorrow':r.d.toLocaleDateString([], {weekday:'long'}))}: ${esc(frPhrase(r.e,r.yrs,'soon'))}</div>`).join('')}
    <button class="btn sm" style="margin-top:10px" data-go="family">Family Record</button></div>`;
}

/* ===== STONES OF REMEMBRANCE ===== */
function stWait(a,b){ if(!a||!b) return ''; const d=Math.round((b-a)/864e5);
  if(d<1) return 'the same day'; if(d<14) return `after ${d} day${d===1?'':'s'}`; if(d<60) return `after ${Math.round(d/7)} weeks`;
  if(d<730) return `after ${Math.round(d/30.4)} months`; return `after ${Math.round(d/365)} years`; }
const stFmt=t=>new Date(t).toLocaleDateString([], {month:'long',day:'numeric',year:'numeric'});
function stoneItems(){
  const out=[];
  S.prayers.filter(p=>p.answered).forEach(p=>out.push({src:'p',id:p.id,text:p.text,cat:p.cat,asked:p.ts,at:p.ansTs||p.updated||p.ts,note:p.ansNote,times:p.prayedCount||0}));
  if(typeof SHC!=='undefined'&&SHC&&SHC.items) Object.keys(SHC.items).forEach(lid=>{ const name=shListName(+lid);
    (SHC.items[lid].items||[]).filter(i=>i.answered).forEach(i=>out.push({src:'s',id:'s'+i.id,text:i.text,cat:name,by:i.by,asked:Date.parse(i.created)||0,at:Date.parse(i.ans_at||i.created)||Date.now(),note:i.ans_note,people:i.people||0,times:i.times||0})); });
  (S.stones||[]).forEach(s=>out.push({src:'m',id:s.id,text:s.text,cat:'Testimony',at:s.at||s.ts,note:s.note,ref:s.ref}));
  return out.sort((a,b)=>b.at-a.at);
}
function renderStones(){
  const box=$('#stoneBody'); if(!box) return; const all=stoneItems();
  const yrs=[...new Set(all.map(s=>new Date(s.at).getFullYear()))];
  box.innerHTML=`<div class="st-hero"><div class="st-mark"></div>
      <p>“Then Samuel took a stone, and set it between Mizpeh and Shen, and called the name of it Ebenezer, saying, Hitherto hath the LORD helped us.”</p><div class="ref">1 Samuel 7:12</div></div>
    <p class="dv-p" style="text-align:center;font-size:18px">A record of what God has done. Every answered prayer is kept here, so you can look back on a hard day and remember.</p>
    ${all.length?`<div class="st-count">${all.length} stone${all.length===1?'':'s'} of remembrance</div>`:''}
    <button class="btn red full" id="stRaise">Raise a Stone</button>
    <p class="small muted" style="text-align:center;margin:6px 0 18px">For something God has done that was never on your list</p>
    ${all.length?yrs.map(y=>`<div class="st-yr">${y}</div><div class="st-line">${all.filter(s=>new Date(s.at).getFullYear()===y).map(s=>`<button class="st-it" data-id="${esc(s.id)}">
        <span class="dt">${new Date(s.at).toLocaleDateString([], {month:'long',day:'numeric'})}</span>
        <span class="tx">${esc(s.text)}</span>
        <span class="mt">${esc(stMeta(s))}</span>
        ${s.note?`<span class="nt">${esc(s.note)}</span>`:''}</button>`).join('')}</div>`).join('')
      :'<div class="empty">When you mark a prayer as answered, it is set here as a stone of remembrance.</div>'}`;
  $('#stRaise').onclick=()=>stoneSheet();
  $$('#stoneBody .st-it').forEach(b=>b.onclick=()=>{ const s=all.find(x=>x.id===b.dataset.id); if(s) stoneView(s); });
}
function stMeta(s){
  if(s.src==='m') return ['Testimony',s.ref].filter(Boolean).join(' · ');
  const w=stWait(s.asked,s.at), parts=[s.cat];
  if(w) parts.push(w==='the same day'?'answered the same day':`answered ${w}`);
  if(s.src==='s'&&s.people) parts.push(`${s.people} ${s.people===1?'person':'people'} prayed`);
  else if(s.times) parts.push(`prayed ${s.times} time${s.times===1?'':'s'}`);
  return parts.join(' · ');
}
function stoneView(s){
  const share=`A stone of remembrance: ${s.text}${s.note?`\n${s.note}`:''}\n${s.src==='m'?'':`Prayed for since ${stFmt(s.asked)}. `}Answered ${stFmt(s.at)}.\n“Hitherto hath the LORD helped us.” 1 Samuel 7:12`;
  openSheet(`<button class="close" data-x>X</button><div class="st-hero sm"><div class="st-mark"></div></div>
    <h3 style="text-align:center">${esc(s.text)}</h3>
    <p class="small muted" style="text-align:center">${s.src==='m'?'':`Asked ${esc(stFmt(s.asked))}<br>`}${s.src==='m'?'':'Answered '}${esc(stFmt(s.at))}${s.src==='s'?`<br>${esc(s.cat)}`:''}</p>
    ${s.note?`<div class="adv-th"><div class="lab">${s.src==='m'?'What God Did':'How God Answered'}</div><p>${esc(s.note)}</p></div>`:''}
    ${s.ref?`<button class="btn full" id="svRef" style="margin-bottom:10px">Read ${esc(s.ref)}</button>`:''}
    <div class="grid2"><button class="btn red" id="svShare">Share</button>${s.src==='s'?'<button class="btn" data-x>Close</button>':'<button class="btn" id="svEdit">Edit</button>'}</div>`);
  $('#svShare').onclick=()=>shareText('Stone of Remembrance',share);
  if($('#svRef')) $('#svRef').onclick=()=>{ const r=parseRef(s.ref); if(r){ closeSheet(); openReader(r.book,r.ch,r.verses); } };
  if($('#svEdit')) $('#svEdit').onclick=()=>{ if(s.src==='m') stoneSheet((S.stones||[]).find(x=>x.id===s.id)); else { const p=S.prayers.find(x=>x.id===s.id); closeSheet(); if(p) stoneNoteSheet(p); } };
}
function stoneNoteSheet(p){
  openSheet(`<button class="close" data-x>X</button><h3>How God Answered</h3><p class="serif" style="font-size:19px">${esc(p.text)}</p>
    <textarea id="snNote" style="min-height:140px" placeholder="What happened, and how you saw God at work">${esc(p.ansNote||'')}</textarea>
    <button class="btn red full" id="snSave" style="margin-top:12px">Save</button><button class="btn full" id="snBack" style="margin-top:10px">Move Back to Praying</button>`);
  $('#snSave').onclick=()=>{ p.ansNote=$('#snNote').value.trim(); p.updated=Date.now(); persist(); closeSheet(); renderStones(); };
  $('#snBack').onclick=()=>{ p.answered=false; delete p.ansNote; p.updated=Date.now(); persist(); closeSheet(); renderStones(); toast('Moved back to your prayer list'); };
}
function stoneSheet(s){
  const isNew=!s; s=s||{}; const d=new Date(s.at||Date.now());
  openSheet(`<button class="close" data-x>X</button><h3>${isNew?'Raise a Stone':'Stone of Remembrance'}</h3>
    <p class="small muted">Something God has done: a provision, a healing, a door opened, a life changed.</p>
    <label class="lbl">What God did</label><input type="text" id="skText" value="${esc(s.text||'')}" placeholder="e.g. Brought our family through a hard winter">
    <label class="lbl">When</label><input type="date" id="skAt" value="${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}">
    <label class="lbl">The story</label><textarea id="skNote" style="min-height:120px">${esc(s.note||'')}</textarea>
    <label class="lbl">A verse to go with it (optional)</label><input type="text" id="skRef" value="${esc(s.ref||'')}" placeholder="e.g. Psalm 34:4">
    <button class="btn red full" id="skGo" style="margin-top:14px">${isNew?'Set This Stone':'Save'}</button>
    ${isNew?'':'<button class="btn full" id="skDel" style="margin-top:10px">Remove</button>'}`);
  $('#skGo').onclick=()=>{ const t=$('#skText').value.trim(); if(!t){ toast('Write what God did'); return; }
    const ref=$('#skRef').value.trim(), pr=ref?parseRef(ref):null; if(ref&&!pr){ toast('That verse reference was not recognized'); return; }
    const [y,m,dd]=($('#skAt').value||'').split('-').map(Number), at=y?new Date(y,m-1,dd,12).getTime():Date.now();
    Object.assign(s,{text:t,at,note:$('#skNote').value.trim(),ref:pr?refLabel(pr.book,pr.ch,pr.verses):'',updated:Date.now()});
    if(isNew){ s.id=uid(); s.ts=Date.now(); (S.stones=S.stones||[]).push(s); }
    persist(); closeSheet(); toast(isNew?'Your stone is set':'Saved'); renderStones(); };
  if($('#skDel')) $('#skDel').onclick=()=>{ if(!confirm('Remove this stone?')) return; S.stones=S.stones.filter(x=>x.id!==s.id); persist(); closeSheet(); renderStones(); };
}

/* ---- wiring ---- */
$('#moreAdvent').onclick=adventSheet;
