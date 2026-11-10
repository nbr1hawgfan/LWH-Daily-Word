/* ---------- Pastor's Study: passage study, sermon outlines, sermon builder and library ---------- */
'use strict';
const HELLO='https://bible.helloao.org';
const STUDY={tab:'study',ref:'',comm:null,cat:'',q:'',mq:'',mk:''};
const SM={cur:null};
let COMMS=null;
const COMM_PREF=[/clarke/i,/henry/i,/jamieson|fausset/i,/gill/i,/keil|delitzsch/i,/calvin/i,/tyndale/i];
const commRank=c=>{ const i=COMM_PREF.findIndex(r=>r.test(c.id+' '+c.name)); return i<0?99:i; };
const ROMAN=['I','II','III','IV','V','VI','VII','VIII'];
const isoDay=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const niceDay=s=>{ if(!s) return ''; const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString([], {month:'short',day:'numeric',year:'numeric'}); };
if(!Array.isArray(S.sermons)) S.sermons=[];

/* ---- data sources ---- */
async function loadComms(){
  if(COMMS) return COMMS;
  try{
    const d=await getJSON(`${HELLO}/api/available_commentaries.json`);
    COMMS=(d.commentaries||[]).filter(c=>(c.language||'eng')==='eng')
      .map(c=>({id:c.id,name:String(c.englishName||c.name||c.id).replace(/\s*(Bible\s*)?Commentary$/i,'').replace(/\s*Open Study Notes$/i,' Study Notes')}))
      .sort((a,b)=>commRank(a)-commRank(b)||a.name.localeCompare(b.name));
    if(!COMMS.length) throw 0;
  }catch(e){ COMMS=[{id:'adam-clarke',name:'Adam Clarke'}]; }
  return COMMS;
}
const flatText=x=>typeof x==='string'?x:Array.isArray(x)?x.map(flatText).join(' '):(x&&typeof x==='object')?flatText(x.text!==undefined?x.text:(x.content!==undefined?x.content:'')):'';
async function getComm(id,book,ch){
  const k=`c/${id}/${book}/${ch}`; if(memCache.has(k)) return memCache.get(k);
  const d=await getJSON(`${HELLO}/api/c/${encodeURIComponent(id)}/${USFM[book-1]}/${ch}.json`);
  const notes={};
  ((d.chapter&&d.chapter.content)||[]).forEach(c=>{ if(c&&c.type==='verse'){ const t=flatText(c.content).replace(/\s+/g,' ').trim(); if(t) notes[c.number]=(notes[c.number]?notes[c.number]+' ':'')+t; } });
  const out={intro:flatText(d.chapter&&d.chapter.introduction).replace(/\s+/g,' ').trim(),notes};
  memCache.set(k,out); return out;
}
function spurgeonFor(r){
  if(typeof SPURGEON==='undefined') return {here:[],book:[]};
  const lo=r.verses.length?Math.min(...r.verses):0, hi=r.verses.length?Math.max(...r.verses):999;
  const here=SPURGEON.filter(s=>s[2]===r.book&&s[3]===r.ch&&(!r.verses.length||s[4]===0||(s[4]<=hi&&(s[5]||s[4])>=lo)));
  const book=SPURGEON.filter(s=>s[2]===r.book&&!here.includes(s));
  return {here,book};
}
const spLink=n=>`https://www.spurgeongems.org/sermon/chs${n}.pdf`;
const spRef=s=>refLabel(s[2],s[3],s[4]?(s[5]&&s[5]!==s[4]?Array.from({length:s[5]-s[4]+1},(_,i)=>s[4]+i):[s[4]]):[]);
function sermonsOn(r){
  return S.sermons.filter(s=>s.refObj&&s.refObj.book===r.book&&s.refObj.ch===r.ch&&(!r.verses.length||!s.refObj.verses.length||s.refObj.verses.some(v=>r.verses.includes(v))));
}
const lastPreached=s=>(s.preached||[]).slice().sort((a,b)=>a.d<b.d?1:-1)[0];

/* ---- view shell ---- */
function renderStudy(){
  $$('#stTabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===STUDY.tab));
  if(STUDY.tab==='study') renderStudyTab();
  else if(STUDY.tab==='outlines') renderOutlinesTab();
  else if(STUDY.tab==='cer') renderCerTab();
  else renderMineTab();
}
$('#stTabs').onclick=e=>{ const b=e.target.closest('button'); if(!b) return; STUDY.tab=b.dataset.t; renderStudy(); };
function openStudy(ref){ STUDY.tab='study'; if(ref) STUDY.ref=ref; if(location.hash==='#study') renderStudy(); else go('study'); if(ref) setTimeout(()=>doStudy(ref),60); }

/* ---- Study tab ---- */
function renderStudyTab(){
  let recent=[]; try{ recent=JSON.parse(localStorage.getItem(KEY+'.studyRecent')||'[]'); }catch(e){}
  $('#stBody').innerHTML=`<div class="row"><input type="search" class="grow" id="stRef" placeholder="Passage, e.g. Romans 8:28-39" value="${esc(STUDY.ref)}" enterkeyhint="go"><button class="btn red" id="stGo">Study</button></div>
    ${recent.length?`<div class="chips" style="margin-top:10px">${recent.map(r=>`<button class="chip" data-r="${esc(r)}">${esc(r)}</button>`).join('')}</div>`:''}
    <div id="stOut">${STUDY.ref?'':'<div class="empty" style="margin-top:16px">Enter a passage to see its text, cross references, classic commentaries, Spurgeon’s sermons on it and your own past sermons.</div>'}</div>`;
  $('#stGo').onclick=()=>doStudy($('#stRef').value);
  $('#stRef').addEventListener('keydown',e=>{ if(e.key==='Enter') doStudy($('#stRef').value); });
  $$('#stBody [data-r]').forEach(c=>c.onclick=()=>{ $('#stRef').value=c.dataset.r; doStudy(c.dataset.r); });
  if(STUDY.ref) doStudy(STUDY.ref,true);
}
async function doStudy(q,quiet){
  const r=parseRef(q); const out=$('#stOut'); if(!out) return;
  if(!r){ if(!quiet) toast('Enter a passage like John 3:16 or Psalm 23'); return; }
  const label=refLabel(r.book,r.ch,r.verses); STUDY.ref=label; if($('#stRef')) $('#stRef').value=label;
  try{ let rec=JSON.parse(localStorage.getItem(KEY+'.studyRecent')||'[]'); rec=[label,...rec.filter(x=>x!==label)].slice(0,6); localStorage.setItem(KEY+'.studyRecent',JSON.stringify(rec)); }catch(e){}
  const mine=sermonsOn(r), sp=spurgeonFor(r);
  out.innerHTML=`<div class="chead" style="padding:22px 0 10px"><div class="bk">Study</div><div class="num" style="font-size:40px">${esc(label)}</div><div class="orn"><i></i><b></b><i></i></div></div>
    <div class="grid2"><button class="btn red" id="stNew">Start a Sermon Here</button><button class="btn" id="stRead">Open in Reader</button></div>
    ${mine.length?`<h2>Your Sermons on This Passage</h2>${mine.map(s=>{ const lp=lastPreached(s); return `<button class="jcard" data-sm="${s.id}"><div class="meta">${lp?'Preached '+esc(niceDay(lp.d))+(lp.at?' · '+esc(lp.at):''):'Not yet preached'}</div><div class="ttl">${esc(s.title||'Untitled sermon')}</div><div class="meta">${esc(s.ref||'')}</div></button>`; }).join('')}`:''}
    <h2>The Text · ${esc(S.settings.tr)}</h2><div class="card serif" id="stText" style="font-size:calc(var(--fs) + 1px);line-height:1.65"><div class="loading">Loading…</div></div>
    <h2>Cross References</h2><div id="stX"><div class="loading">Finding related passages…</div></div>
    <h2>Classic Commentaries</h2><div class="chips" id="stCm"></div><div id="stCmOut" style="margin-top:12px"></div>
    <h2>Spurgeon on This Text</h2><div id="stSp">${spurgeonHTML(r,sp)}</div>`;
  $('#stNew').onclick=()=>newSermon({ref:label});
  $('#stRead').onclick=()=>openReader(r.book,r.ch,r.verses);
  $$('#stOut [data-sm]').forEach(b=>b.onclick=()=>openSermon(b.dataset.sm));
  // text
  getPassage(S.settings.tr,r).then(vs=>{ const el=$('#stText'); if(el) el.innerHTML=vs.map(v=>`<sup style="color:var(--red);font-weight:700;font-size:.62em">${v.verse}</sup> ${v.html}`).join(' ')||'Not found.'; })
    .catch(()=>{ const el=$('#stText'); if(el) el.textContent='The text could not load. Check your connection.'; });
  // cross references
  studyXrefs(r);
  // commentaries
  const comms=await loadComms(); if(!$('#stCm')) return;
  if(!STUDY.comm||!comms.find(c=>c.id===STUDY.comm)) STUDY.comm=comms[0].id;
  const drawChips=()=>{ $('#stCm').innerHTML=comms.map(c=>`<button class="chip ${c.id===STUDY.comm?'on':''}" data-c="${esc(c.id)}">${esc(c.name)}</button>`).join('');
    $$('#stCm .chip').forEach(b=>b.onclick=()=>{ STUDY.comm=b.dataset.c; drawChips(); showComm(r); }); };
  drawChips(); showComm(r);
}
function spurgeonHTML(r,sp){
  const idx=r.book<=39?'https://www.spurgeongems.org/sindex_ot.pdf':'https://www.spurgeongems.org/sindex_nt.pdf';
  const row=s=>`<a class="xref" style="display:block;text-decoration:none" href="${spLink(s[1])}" target="_blank" rel="noopener"><b>${esc(s[0])}</b><div class="t">${esc(spRef(s))} · Sermon No. ${esc(s[1])}</div></a>`;
  let h='';
  if(sp.here.length) h+=sp.here.map(row).join('');
  else h+=`<p class="small muted" style="margin-top:0">No sermon in this app’s Spurgeon list is on ${esc(bookName(r.book))} ${r.ch}.</p>`;
  if(sp.book.length){ h+=`<details style="margin:6px 0 10px"><summary class="small" style="cursor:pointer;font-weight:700;color:var(--red);padding:6px 0">More Spurgeon sermons from ${esc(bookName(r.book))} (${sp.book.length})</summary>${sp.book.slice(0,25).map(row).join('')}</details>`; }
  h+=`<a class="btn full" style="text-decoration:none;margin-top:4px" href="${idx}" target="_blank" rel="noopener">Spurgeon’s Complete Scripture Index (${r.book<=39?'Old':'New'} Testament)</a>
    <p class="small muted">Sermons open from Spurgeon Gems. Spurgeon’s sermons are in the public domain.</p>`;
  return h;
}
async function studyXrefs(r){
  const box=()=>$('#stX');
  try{
    const m=await getXrefChapter(r.book,r.ch);
    const vs=r.verses.length?r.verses:Object.keys(m).map(Number).slice(0,60);
    const seen=new Set(), list=[];
    vs.forEach(v=>(m[v]||[]).forEach(x=>{ const b=USFM.indexOf(x.book)+1; if(b<1) return; const k=`${b}:${x.chapter}:${x.verse}`; if(seen.has(k)) return; seen.add(k);
      list.push({book:b,ch:x.chapter,v:x.verse,end:x.endVerse||x.verse,score:x.score||0}); }));
    list.sort((a,b)=>b.score-a.score); const top=list.slice(0,12);
    if(!box()) return;
    if(!top.length){ box().innerHTML='<p class="small muted">No cross references are listed for this passage.</p>'; return; }
    const vsOf=x=>{ const a=[]; for(let n=x.v;n<=x.end&&n-x.v<12;n++) a.push(n); return a; };
    const draw=texts=>{ if(!box()) return; box().innerHTML=top.map((x,i)=>`<button class="xref" data-i="${i}"><b>${esc(refLabel(x.book,x.ch,vsOf(x)))}</b>${texts&&texts[i]?`<div class="t">${esc(texts[i])}</div>`:''}</button>`).join('');
      box().querySelectorAll('.xref').forEach(b=>b.onclick=()=>{ const x=top[+b.dataset.i]; openReader(x.book,x.ch,vsOf(x)); }); };
    draw(null);
    try{ const d=await getJSON(`${API}/get-verses/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(top.map(x=>({translation:S.settings.tr,book:x.book,chapter:x.ch,verses:vsOf(x)})))});
      draw(d.map(a=>(a||[]).map(t=>plain(t.text)).join(' '))); }catch(e){}
  }catch(e){ if(box()) box().innerHTML='<p class="small muted">Cross references need an internet connection.</p>'; }
}
async function showComm(r){
  const out=$('#stCmOut'); if(!out) return; const id=STUDY.comm; out.innerHTML='<div class="loading">Opening the commentary…</div>';
  try{
    const c=await getComm(id,r.book,r.ch); if(STUDY.comm!==id||!$('#stCmOut')) return;
    const keys=Object.keys(c.notes).map(Number).sort((a,b)=>a-b);
    const pick=r.verses.length?keys.filter(k=>k>=Math.min(...r.verses)&&k<=Math.max(...r.verses)):keys;
    const near=r.verses.length&&!pick.length?keys.filter(k=>k<Math.min(...r.verses)).slice(-1):[];
    const shown=pick.length?pick:near;
    const note=(t,label)=>{ const long=t.length>700; return `<div class="item"><div class="ref">${label}</div><div class="txt" style="font-size:18px">${esc(long?t.slice(0,700)+'…':t)}</div>${long?`<button class="btn sm" data-more>Read All</button><div style="display:none" class="txt">${esc(t)}</div>`:''}</div>`; };
    let h='';
    if(c.intro&&(!r.verses.length||!shown.length)) h+=note(c.intro,`Introduction to ${esc(bookName(r.book))} ${r.ch}`);
    h+=shown.map(k=>note(c.notes[k],`Verse ${k}${near.length?' (nearest note)':''}`)).join('');
    const credit=/tyndale/i.test(id)?'Tyndale Open Study Notes \u00A9 Tyndale House Publishers, used under CC BY-SA 4.0.':'Public domain commentary.';
    out.innerHTML=(h||'<p class="small muted">This commentary has no notes for this passage. Try another one above.</p>')+`<p class="small muted">${credit} Provided by the Free Use Bible API (bible.helloao.org).</p>`;
    out.querySelectorAll('[data-more]').forEach(b=>b.onclick=()=>{ const it=b.closest('.item'); it.querySelector('.txt').style.display='none'; b.style.display='none'; b.nextElementSibling.style.display=''; });
  }catch(e){ out.innerHTML='<p class="small muted">This commentary does not cover this book, or the connection is down. Try another one above.</p>'; }
}

/* ---- Outlines tab ---- */
function renderOutlinesTab(){
  $('#stBody').innerHTML=`<input type="search" id="olQ" placeholder="Search outlines — grace, Easter, John 14…" value="${esc(STUDY.q)}">
    <div class="chips" id="olCats" style="margin:12px 0"></div><div id="olList"></div>
    <p class="small muted">${OUTLINES.length} original outlines to start from — free to change and make your own.</p>`;
  const draw=()=>{
    $('#olCats').innerHTML=[['','All'],...OUTLINE_CATS.map(c=>[c,c])].map(([k,n])=>`<button class="chip ${STUDY.cat===k?'on':''}" data-k="${esc(k)}">${esc(n)}</button>`).join('');
    $$('#olCats .chip').forEach(c=>c.onclick=()=>{ STUDY.cat=c.dataset.k; draw(); });
    const q=STUDY.q.toLowerCase();
    const list=OUTLINES.filter(o=>(!STUDY.cat||o.cat===STUDY.cat)&&(!q||[o.title,o.text,o.big,o.cat,...o.pts.flat()].join(' ').toLowerCase().includes(q)));
    let h='', grp='';
    list.forEach(o=>{ if(!STUDY.cat&&o.cat!==grp){ grp=o.cat; h+=`<div class="jgroup">${esc(grp)}</div>`; }
      h+=`<button class="jcard" data-o="${o.id}"><div class="ttl">${esc(o.title)}</div><div class="meta">${esc(o.text)}</div><div class="snip">${esc(o.big)}</div></button>`; });
    $('#olList').innerHTML=h||'<div class="empty">No outlines match that search.</div>';
    $$('#olList [data-o]').forEach(b=>b.onclick=()=>outlineSheet(OUTLINES.find(o=>o.id===b.dataset.o)));
  };
  $('#olQ').addEventListener('input',e=>{ STUDY.q=e.target.value; draw(); });
  draw();
}
function outlineText(o){
  return [`TEXT: ${o.text}`,`BIG IDEA: ${o.big}`,'',`INTRODUCTION`,o.intro,'[Your story or illustration]','',
    ...o.pts.flatMap((p,i)=>[`${ROMAN[i]}. ${p[0].toUpperCase()}  (${p[1]})`,`   ${p[2]}`,'   [Illustration or personal example]','']),
    'APPLICATION',o.app,'','INVITATION',o.inv].join('\n');
}
function outlineSheet(o){
  openSheet(`<button class="close" data-x>X</button><div class="small" style="letter-spacing:.18em;text-transform:uppercase;color:var(--red);font-weight:700">${esc(o.cat)}</div>
    <h3 style="margin-top:4px">${esc(o.title)}</h3><div class="muted" style="font-weight:700">${esc(o.text)}</div>
    <div class="dv-verse" style="margin:14px 0"><b>Big Idea.</b> ${esc(o.big)}</div>
    <p class="serif" style="font-size:18px"><b>Introduction.</b> ${esc(o.intro)}</p>
    ${o.pts.map((p,i)=>`<div class="item"><div class="ref">${ROMAN[i]}. ${esc(p[0])}</div><div class="small muted" style="font-weight:700">${esc(p[1])}</div><div class="txt" style="font-size:18px">${esc(p[2])}</div></div>`).join('')}
    <p class="serif" style="font-size:18px"><b>Application.</b> ${esc(o.app)}</p>
    <p class="serif" style="font-size:18px"><b>${o.cat==='Special Services'&&/Wedding/.test(o.intro)?'Closing':'Invitation'}.</b> ${esc(o.inv)}</p>
    <div class="grid2"><button class="btn red" id="olUse">Use This Outline</button><button class="btn" id="olStudy">Study the Text</button></div>`);
  $('#olUse').onclick=()=>{ closeSheet(); newSermon({title:o.title,ref:o.text,topic:o.cat,structure:'outline',body:outlineText(o)}); };
  $('#olStudy').onclick=()=>{ closeSheet(); openStudy(o.text.split(';')[0].trim()); };
}


/* ---- Ceremonies tab ---- */
const KIND_NAME={wedding:'Wedding',funeral:'Funeral'};
function renderCerTab(){
  const card=t=>`<button class="jcard" data-c="${t.id}"><div class="meta"><span class="jtype ${t.kind==='wedding'?'devo':'sermon'}">${esc(t.style)}</span>${esc(t.mins)}</div><div class="ttl">${esc(t.title)}</div><div class="snip">${esc(t.desc)}</div></button>`;
  const mine=S.sermons.filter(x=>x.kind).length;
  $('#stBody').innerHTML=`<p class="small muted" style="margin-top:0">Complete orders of service. Fill in the names once and the whole script is ready to edit, print or read from in Officiate mode.</p>
    <div class="jgroup">Weddings</div>${CEREMONIES.filter(t=>t.kind==='wedding').map(card).join('')}
    <div class="jgroup">Funerals and Memorials</div>${CEREMONIES.filter(t=>t.kind==='funeral').map(card).join('')}
    ${mine?`<button class="btn full" id="cerMine" style="margin-top:8px">Your Saved Services (${mine})</button>`:''}
    <p class="small muted">Traditional services use the historic Book of Common Prayer wording (public domain) with King James readings. Modern services are original and free to change.</p>`;
  $$('#stBody [data-c]').forEach(b=>b.onclick=()=>cerSheet(CEREMONIES.find(t=>t.id===b.dataset.c)));
  if($('#cerMine')) $('#cerMine').onclick=()=>{ STUDY.tab='mine'; STUDY.mk='cer'; renderStudy(); };
}
const cerHeads=t=>t.body.split('\n').map(l=>l.trim()).filter(l=>{ const bare=l.replace(/\{\{[^}]+\}\}/g,'').replace(/\([^)]*\)/g,''); return l.length>3&&!/[a-z]/.test(bare)&&!/^[\[—"]/.test(l)&&/[A-Z]{3}/.test(bare); }).slice(1);
const titleCase=h=>h.replace(/\{\{\w+\}\}['\u2019]S\s+/i,'Life ').replace(/\{\{(\w+)\}\}/g,'').replace(/\s+/g,' ').trim().toLowerCase().replace(/(^|[\s(])(\w)/g,(m,a,c)=>a+c.toUpperCase()).replace(/\b(Of|And|The|A|To|For|At|In|Or)\b/g,(m,w,i)=>i?w.toLowerCase():w).replace(/'s\b/gi,'’s');
function cerSheet(t){
  openSheet(`<button class="close" data-x>X</button><div class="small" style="letter-spacing:.18em;text-transform:uppercase;color:var(--red);font-weight:700">${esc(KIND_NAME[t.kind])} · ${esc(t.style)}</div>
    <h3 style="margin-top:4px">${esc(t.title)}</h3><div class="muted" style="font-weight:700">${esc(t.mins)}</div>
    <p class="serif" style="font-size:18px">${esc(t.desc)}</p>
    <h2>Order of Service</h2><ol class="serif" style="font-size:18px;line-height:1.7;padding-left:24px;margin-top:0">${cerHeads(t).map(h=>`<li>${esc(titleCase(h))}</li>`).join('')}</ol>
    <button class="btn red full" id="cerUse">Use This Service</button>`);
  $('#cerUse').onclick=()=>cerForm(t);
}
function cerForm(t){
  const f=CER_FIELDS[t.kind];
  openSheet(`<button class="close" data-x>X</button><h3>${esc(t.title)}</h3><p class="small muted">Fill in what you know now. Anything left blank shows as a [note] you can fill in later.</p>`+
    f.map(([k,label,def])=>{ const v=k==='Officiant'?(S.settings.name||''):def;
      if(k==='Pron') return `<label class="lbl">${esc(label)}</label><div class="tabs" id="cfPron"><button data-p="he" class="on">He</button><button data-p="she">She</button></div>`;
      if(k==='Family'||k==='Story') return `<label class="lbl">${esc(label)}</label><textarea id="cf_${k}" style="min-height:110px" placeholder="${esc(CER_HINT[k]||'')}"></textarea>`;
      return `<label class="lbl">${esc(label)}</label><input type="text" id="cf_${k}" value="${esc(v)}">`; }).join('')+
    `<button class="btn red full" id="cfGo" style="margin-top:16px">Create the Service</button>`);
  if($('#cfPron')) $('#cfPron').onclick=e=>{ const b=e.target.closest('button'); if(!b) return; $$('#cfPron button').forEach(x=>x.classList.toggle('on',x===b)); };
  $('#cfGo').onclick=async()=>{
    const vals={}; f.forEach(([k])=>{ const el=$('#cf_'+k); if(el) vals[k]=el.value.trim(); });
    if(t.kind==='funeral'){ const on=$('#cfPron .on'); vals.Pron=on?on.dataset.p:'he'; }
    $('#cfGo').disabled=true; $('#cfGo').textContent='Preparing the service…';
    const body=await fillCeremony(t,vals);
    const who=t.kind==='wedding'?[vals.Bride,vals.Groom].filter(Boolean).map(n=>n.split(/\s+/)[0]).join(' & '):vals.Name;
    closeSheet();
    newSermon({title:`${KIND_NAME[t.kind]}${who?' — '+who:''}`,topic:t.title,kind:t.kind,body,structure:t.id});
    setTimeout(()=>saveSermon(true),60);
  };
}
async function fillCeremony(t,v){
  const first=n=>(n||'').trim().split(/\s+/)[0]||'';
  const ph=(k,label)=>v[k]?v[k]:`[${label}]`;
  const she=v.Pron==='she';
  const map={Groom:ph('Groom','groom’s name'),Bride:ph('Bride','bride’s name'),GroomFirst:first(v.Groom)||'[groom]',BrideFirst:first(v.Bride)||'[bride]',
    Date:ph('Date','date'),Place:ph('Place','place'),Giver:v.Giver||'The one giving the bride',State:v.State||'Arkansas',Officiant:ph('Officiant','officiant'),
    Name:ph('Name','full name'),First:v.First||first(v.Name)||'[name]',Born:ph('Born','date of birth'),Died:ph('Died','date of death'),
    Family:v.Family||'[Family members]',Story:v.Story||'[Life story from the family visit]',
    he:she?'she':'he',He:she?'She':'He',his:she?'her':'his',His:she?'Her':'His',him:she?'her':'him',brother:she?'sister':'brother'};
  const reads=[...new Set([...t.body.matchAll(/\{\{read:([^}]+)\}\}/g)].map(m=>m[1]))];
  const tr=t.style==='Traditional'?'KJV':S.settings.tr, texts={};
  await Promise.all(reads.map(async r=>{ try{ texts[r]=await passageText(tr,r); }catch(e){ texts[r]=''; } }));
  let body=t.body.replace(/\{\{read:([^}]+)\}\}(\n— [^\n]+)?/g,(m,r)=>texts[r]?`"${texts[r]}"\n— ${r.replace(/^Psalms (\d+)/,'Psalm $1')} (${tr})`:`[Read ${r}]`);
  // headings stay in capitals even when a name is dropped into them
  body=body.split('\n').map(l=>{ const bare=l.replace(/\{\{\w+\}\}/g,''); const isHead=bare.trim().length>2&&!/[a-z]/.test(bare)&&/[A-Z]{3}/.test(bare)&&!/^[\[—"]/.test(l.trim());
    const out=l.replace(/\{\{(\w+)\}\}/g,(m,k)=>map[k]!==undefined?map[k]:m); return isHead?out.toUpperCase():out; }).join('\n');
  return body;
}

/* ---- My Sermons tab ---- */
function renderMineTab(){
  $('#stBody').innerHTML=`<div class="grid2" style="margin-bottom:12px"><button class="btn red" id="myNew">New Sermon</button><button class="btn" id="myOutline">Start from an Outline</button></div>
    <input type="search" id="myQ" placeholder="Search your sermons and services" value="${esc(STUDY.mq)}">
    <div class="chips" id="myKinds" style="margin-top:12px">${[['','All'],['sermon','Sermons'],['wedding','Weddings'],['funeral','Funerals']].map(([k,n])=>`<button class="chip ${(STUDY.mk==='cer'?'':STUDY.mk)===k?'on':''}" data-k="${k}">${n}</button>`).join('')}</div>
    <div id="myList" style="margin-top:12px"></div>`;
  $$('#myKinds .chip').forEach(c=>c.onclick=()=>{ STUDY.mk=c.dataset.k; renderMineTab(); });
  $('#myNew').onclick=()=>newSermon({});
  $('#myOutline').onclick=()=>{ STUDY.tab='outlines'; renderStudy(); };
  const draw=()=>{
    const q=STUDY.mq.toLowerCase();
    const mk=STUDY.mk, kindOk=s=>!mk||(mk==='sermon'?!s.kind:mk==='cer'?!!s.kind:s.kind===mk);
    const list=S.sermons.filter(s=>kindOk(s)&&(!q||[s.title,s.ref,s.topic,s.body].join(' ').toLowerCase().includes(q))).sort((a,b)=>(b.updated||b.ts)-(a.updated||a.ts));
    $('#myList').innerHTML=list.length?list.map(s=>{ const lp=lastPreached(s), n=(s.preached||[]).length;
      const verb=s.kind?'Officiated':'Preached';
      return `<button class="jcard" data-sm="${s.id}"><div class="meta">${s.kind?`<span class="jtype ${s.kind==='wedding'?'devo':'sermon'}">${KIND_NAME[s.kind]}</span>`:''}${lp?`${verb} ${esc(niceDay(lp.d))}${n>1?` · ${n} times`:''}`:(s.kind?'Not yet held':'Not yet preached')}${s.topic&&!s.kind?' · '+esc(s.topic):''}</div>
        <div class="ttl">${esc(s.title||'Untitled sermon')}</div><div class="meta">${esc(s.ref||'')}</div></button>`; }).join('')
      :`<div class="empty">${S.sermons.length?'No sermons match that search.':'Your sermons will be kept here, searchable by passage and topic, on your phone and computer.'}</div>`;
    $$('#myList [data-sm]').forEach(b=>b.onclick=()=>openSermon(b.dataset.sm));
  };
  $('#myQ').addEventListener('input',e=>{ STUDY.mq=e.target.value; draw(); });
  draw();
}

/* ---- Sermon editor ---- */
const SCAFFOLD={
 expository:r=>`TEXT: ${r}\nBIG IDEA: \n\nCONTEXT\nWho wrote it, to whom, and why: \n\nINTRODUCTION\n[Open with a story, a question or a need]\n\nI.  (verses    )\n   Explain:\n   Illustrate:\n   Apply:\n\nII.  (verses    )\n   Explain:\n   Illustrate:\n   Apply:\n\nIII.  (verses    )\n   Explain:\n   Illustrate:\n   Apply:\n\nCONCLUSION\n\nINVITATION\n`,
 topical:r=>`THEME: \nKEY TEXT: ${r}\nSUPPORTING TEXTS: \n\nINTRODUCTION\n[Why this matters to the people in the pews]\n\nI. \n   Scripture:\n   Illustration:\n\nII. \n   Scripture:\n   Illustration:\n\nIII. \n   Scripture:\n   Illustration:\n\nAPPLICATION\n\nINVITATION\n`,
 narrative:r=>`TEXT: ${r}\n\nTHE SETTING\n\nTHE STRUGGLE\n\nTHE TURNING POINT\n\nTHE OUTCOME\n\nWHAT THIS SHOWS US ABOUT GOD\n\nWHAT THIS SHOWS US ABOUT OURSELVES\n\nAPPLICATION\n\nINVITATION\n`
};
function newSermon(o){
  const s={id:uid(),title:o.title||'',ref:o.ref||'',topic:o.topic||'',structure:o.structure||'',body:o.body||'',preached:[],ts:Date.now(),updated:Date.now()};
  if(o.kind) s.kind=o.kind;
  const r=parseRef(s.ref); s.refObj=r?{book:r.book,ch:r.ch,verses:r.verses}:null;
  SM.cur=s.id; SM.draft=s; if(location.hash==='#sermon') renderSermon(); else go('sermon');
}
function openSermon(id){ SM.cur=id; SM.draft=null; if(location.hash==='#sermon') renderSermon(); else go('sermon'); }
function curSermon(){ return S.sermons.find(x=>x.id===SM.cur)||(SM.draft&&SM.draft.id===SM.cur?SM.draft:null); }
function renderSermon(){
  const s=curSermon(); if(!s){ STUDY.tab='mine'; go('study'); return; }
  $('#smTitle').value=s.title; $('#smRef').value=s.ref; $('#smTopic').value=s.topic; $('#smBody').value=s.body; $('#smStruct').value='';
  $('#smSaved').textContent=S.sermons.includes(s)?'Saved':'';
  $('#smMark').textContent=s.kind?'Mark as Officiated':'Mark as Preached'; $('#smPreach').textContent=s.kind?'Officiate':'Preach';
  $('#smRef').placeholder=s.kind?'Main Scripture (optional)':'Main text, e.g. Romans 8:28-39'; $('#smStruct').style.display=s.kind?'none':''; $('#smTopic').style.gridColumn=s.kind?'1 / -1':'';
  $('#smDel').style.display=S.sermons.includes(s)?'':'none'; $('#smInterim').textContent='';
  if(!s.body&&!s.structure){ $('#smBody').placeholder='Pick a structure above to start with a template, or just begin writing or speaking.'; }
  renderSermonHist(s);
}
function renderSermonHist(s){
  const h=(s.preached||[]).slice().sort((a,b)=>a.d<b.d?1:-1);
  $('#smHist').innerHTML=h.length?`<h2>${s.kind?'Officiated':'Preached'}</h2>${h.map((p,i)=>`<div class="switch"><span>${esc(niceDay(p.d))}${p.at?' · '+esc(p.at):''}</span><button class="btn sm" data-ph="${esc(p.d)}|${esc(p.at||'')}">Remove</button></div>`).join('')}`:'';
  $$('#smHist [data-ph]').forEach(b=>b.onclick=()=>{ const [d,at]=b.dataset.ph.split('|'); const i=s.preached.findIndex(p=>p.d===d&&(p.at||'')===at); if(i>=0){ s.preached.splice(i,1); s.updated=Date.now(); persist(); renderSermonHist(s); } });
}
function saveSermon(silent){
  const s=curSermon(); if(!s) return;
  s.title=$('#smTitle').value.trim(); s.ref=$('#smRef').value.trim(); s.topic=$('#smTopic').value.trim(); s.body=$('#smBody').value;
  const r=parseRef(s.ref); s.refObj=r?{book:r.book,ch:r.ch,verses:r.verses}:null;
  if(!S.sermons.includes(s)){ if(!s.title&&!s.body.trim()&&!s.ref) return; S.sermons.unshift(s); SM.draft=null; $('#smDel').style.display=''; }
  s.updated=Date.now(); persist(); $('#smSaved').textContent='Saved'; if(!silent) toast('Sermon saved');
}
let smT; ['#smTitle','#smRef','#smTopic','#smBody'].forEach(id=>$(id).addEventListener('input',()=>{ $('#smSaved').textContent='Saving…'; clearTimeout(smT); smT=setTimeout(()=>saveSermon(true),800); }));
$('#smStruct').onchange=()=>{ const k=$('#smStruct').value; if(!k) return; const ta=$('#smBody'), tpl=SCAFFOLD[k]($('#smRef').value.trim());
  if(ta.value.trim()&&!confirm('Add this template below what you have already written?')){ $('#smStruct').value=''; return; }
  ta.value=ta.value.trim()?ta.value.replace(/\s+$/,'')+'\n\n'+tpl:tpl; const s=curSermon(); if(s) s.structure=k; $('#smStruct').value=''; saveSermon(true); ta.focus(); };
$('#smBack').onclick=()=>{ saveSermon(true); stopDictation(); STUDY.tab='mine'; go('study'); };
$('#smStudy').onclick=()=>{ const v=$('#smRef').value.trim(); if(!parseRef(v)){ toast('Enter the main text first, like John 3:16'); return; } saveSermon(true); openStudy(v); };
$('#smMic').onclick=()=>{ if(recOn){ stopDictation(); return; } DICT={btn:'#smMic',lbl:'#smMicLbl',ta:'#smBody',interim:'#smInterim',save:()=>saveSermon(true)}; startDictation(); };
$('#smPreach').onclick=()=>{ saveSermon(true); const s=curSermon(); if(!s) return; present([s.title,s.ref].filter(Boolean).join('\n')+'\n\n'+s.body); };
$('#smShare').onclick=()=>{ saveSermon(true); const s=curSermon(); if(!s) return; shareText(s.title||'Sermon',[s.title,s.ref].filter(Boolean).join('\n')+'\n\n'+s.body); };
$('#smDel').onclick=()=>{ const s=curSermon(); if(!s||!confirm('Delete this sermon? This cannot be undone.')) return; S.sermons=S.sermons.filter(x=>x.id!==s.id); persist(); SM.cur=null; STUDY.tab='mine'; go('study'); };
$('#smMark').onclick=()=>{
  saveSermon(true); const s=curSermon(); if(!s||!S.sermons.includes(s)){ toast('Write something first'); return; }
  const lastPlace=S.sermons.flatMap(x=>x.preached||[]).sort((a,b)=>a.d<b.d?1:-1).map(p=>p.at).find(Boolean)||'';
  openSheet(`<button class="close" data-x>X</button><h3>${s.kind?'Mark as Officiated':'Mark as Preached'}</h3>
    <label class="lbl">Date</label><input type="text" id="mpD" value="${isoDay()}" inputmode="numeric" placeholder="YYYY-MM-DD">
    <label class="lbl">Where</label><input type="text" id="mpAt" value="${esc(lastPlace)}" placeholder="Church or event">
    <button class="btn red full" id="mpGo" style="margin-top:14px">Save</button>`);
  try{ $('#mpD').type='date'; }catch(e){}
  $('#mpGo').onclick=()=>{ const d=$('#mpD').value.trim(); if(!/^\d{4}-\d{2}-\d{2}$/.test(d)){ toast('Pick a date'); return; }
    s.preached=s.preached||[]; s.preached.push({d,at:$('#mpAt').value.trim()}); s.updated=Date.now(); persist(); closeSheet(); renderSermonHist(s); toast(s.kind?'Marked as officiated':'Marked as preached'); };
};

/* first render if the app opened on one of these screens */
if(/^#(study|sermon)/.test(location.hash)) route();
