/* ---------- Narrated audio (Berean Standard Bible) and Memory Verses ---------- */
'use strict';
if(!Array.isArray(S.memory)) S.memory=[];

/* ===== Narrated audio =====
   Full-chapter recordings of the Berean Standard Bible (public domain) from the Free Use Bible API. */
const NARR_ORDER=['souer','hays','gilbert','david'];
const NARR_NAME=k=>k?k.charAt(0).toUpperCase()+k.slice(1):'';
const NP={queue:[],i:0,src:'',links:{},reader:'',audio:null,loading:false};
const narrationWanted=()=>(S.settings.listen||'narr')==='narr';
async function chapterAudio(b,c){
  const k=`a/${b}/${c}`; if(memCache.has(k)) return memCache.get(k);
  const d=await getJSON(`${HELLO}/api/BSB/${USFM[b-1]}/${c}.json`);
  const raw=d.thisChapterAudioLinks||{}, links={};
  Object.keys(raw).forEach(r=>{ if(raw[r]) links[r]=new URL(raw[r],HELLO+'/').href; });
  memCache.set(k,links); return links;
}
function npEl(){
  if($('#np')) return;
  const d=document.createElement('div'); d.id='np'; d.className='np';
  d.innerHTML=`<div class="np-bar"><i id="npBar"></i></div>
    <div class="np-row"><div class="np-t"><b id="npT"></b><span id="npS"></span></div>
    <button class="np-b" id="npBack" aria-label="Back 15 seconds">−15</button>
    <button class="np-b np-play" id="npPlay" aria-label="Pause">Pause</button>
    <button class="np-b" id="npSpeed" aria-label="Speed">1×</button>
    <button class="np-b" id="npX" aria-label="Close">Close</button></div>`;
  document.body.appendChild(d);
  $('#npPlay').onclick=()=>{ const a=NP.audio; if(!a) return; if(a.paused) a.play().catch(()=>{}); else a.pause(); };
  $('#npBack').onclick=()=>{ if(NP.audio) NP.audio.currentTime=Math.max(0,NP.audio.currentTime-15); };
  $('#npSpeed').onclick=()=>{ const sp=[1,1.25,1.5,0.85], cur=S.settings.narrRate||1, nx=sp[(sp.indexOf(cur)+1)%sp.length]; S.settings.narrRate=nx; persist(); if(NP.audio) NP.audio.playbackRate=nx; $('#npSpeed').textContent=`${nx}×`; };
  $('#npX').onclick=npStop;
}
function npStop(){ if(NP.audio){ NP.audio.pause(); NP.audio.src=''; } NP.audio=null; NP.queue=[]; const e=$('#np'); if(e) e.classList.remove('on'); document.body.classList.remove('np-on'); npButtons(); }
function npButtons(){
  const playing=NP.audio&&!NP.audio.paused, cur=NP.queue[NP.i];
  const rl=$('#rListen'); if(rl) rl.classList.toggle('red',!!(NP.audio&&cur&&cur[0]===R.book&&cur[1]===R.ch));
  const dl=$('#dvListen'); if(dl&&NP.src==='devo') dl.textContent=NP.audio?'Stop':'Listen';
  if($('#npPlay')) $('#npPlay').textContent=playing?'Pause':'Play';
}
async function npPlayCurrent(){
  const [b,c]=NP.queue[NP.i]; npEl(); NP.loading=true;
  $('#np').classList.add('on'); document.body.classList.add('np-on');
  $('#npT').textContent=chLabel(b,c); $('#npS').textContent='Loading the narration…'; $('#npBar').style.width='0%';
  let links; try{ links=await chapterAudio(b,c); }catch(e){ links={}; }
  const keys=Object.keys(links);
  if(!keys.length){ NP.loading=false; npStop(); toast('A narrated recording is not available right now. Using the phone voice.'); npFallback(b,c); return; }
  const pick=(S.settings.narrator&&links[S.settings.narrator])?S.settings.narrator:(NARR_ORDER.find(k=>links[k])||keys[0]);
  NP.reader=pick;
  if(!NP.audio){ NP.audio=new Audio(); NP.audio.preload='auto';
    NP.audio.addEventListener('timeupdate',()=>{ const a=NP.audio; if(a&&a.duration) $('#npBar').style.width=`${100*a.currentTime/a.duration}%`; });
    NP.audio.addEventListener('play',npButtons); NP.audio.addEventListener('pause',npButtons);
    NP.audio.addEventListener('ended',npNext);
    NP.audio.addEventListener('error',()=>{ if(!NP.audio||NP.loading) return; toast('The narration could not play. Check the connection.'); npStop(); });
  }
  NP.audio.src=links[pick]; NP.audio.playbackRate=S.settings.narrRate||1;
  $('#npS').textContent=`Berean Standard Bible · read by ${NARR_NAME(pick)}`; $('#npSpeed').textContent=`${S.settings.narrRate||1}×`;
  try{ await NP.audio.play(); }catch(e){ toast('Tap Play to start the narration.'); }
  NP.loading=false; npButtons();
  if('mediaSession' in navigator){ try{
    navigator.mediaSession.metadata=new MediaMetadata({title:chLabel(b,c),artist:`Read by ${NARR_NAME(pick)}`,album:'Daily Word · Berean Standard Bible',artwork:[{src:'icons/icon-512.png',sizes:'512x512',type:'image/png'}]});
    navigator.mediaSession.setActionHandler('play',()=>NP.audio&&NP.audio.play());
    navigator.mediaSession.setActionHandler('pause',()=>NP.audio&&NP.audio.pause());
    navigator.mediaSession.setActionHandler('seekbackward',()=>{ if(NP.audio) NP.audio.currentTime=Math.max(0,NP.audio.currentTime-15); });
    navigator.mediaSession.setActionHandler('nexttrack',npNext);
  }catch(e){} }
}
function nextCh(b,c){ c++; if(c>bookChapters(b)){ b++; c=1; } return b>66?null:[b,c]; }
function npNext(){
  const was=NP.queue[NP.i];
  if(NP.i+1<NP.queue.length){ NP.i++; npPlayCurrent(); return; }
  if(NP.src==='read'&&S.settings.contPlay!==false&&was){ const n=nextCh(was[0],was[1]); if(n){ NP.queue.push(n); NP.i++;
      if(location.hash==='#read'&&R.book===was[0]&&R.ch===was[1]){ R.dir=1; openReader(n[0],n[1]); }
      npPlayCurrent(); return; } }
  npStop();
}
function narrate(queue,src){ if(NP.audio){ NP.audio.pause(); } NP.queue=queue.slice(); NP.i=0; NP.src=src; npPlayCurrent(); }
function narrateToggle(queue,src){
  const cur=NP.queue[NP.i];
  if(NP.audio&&cur&&queue.some(q=>q[0]===cur[0]&&q[1]===cur[1])){ npStop(); return; }
  stopSpeak(); narrate(queue,src);
}
function npFallback(b,c){
  getChapter(S.settings.tr,b,c).then(vs=>{ speak(`${bookName(b)} chapter ${c}. `+vs.map(v=>plain(v.html)).join(' ')); }).catch(()=>{});
}

/* Settings: listening choices */
function renderListenSettings(){
  const box=$('#stListenBox'); if(!box) return; const mode=S.settings.listen||'narr';
  box.innerHTML=`<div class="tabs" id="stListen"><button data-m="narr" class="${mode==='narr'?'on':''}">Narrator</button><button data-m="tts" class="${mode==='tts'?'on':''}">Phone Voice</button></div>
    <p class="small muted" style="margin-top:-4px">${mode==='narr'?'A professional narrator reads the Berean Standard Bible, a modern public-domain translation. The words will differ a little from the translation on your screen.':'The phone voice reads whichever translation you have open.'}</p>
    ${mode==='narr'?`<label class="lbl">Narrator</label><div class="row"><select id="stNarr" class="grow"><option value="">Choose for me</option>${NARR_ORDER.map(k=>`<option value="${k}" ${S.settings.narrator===k?'selected':''}>${NARR_NAME(k)}</option>`).join('')}</select><button class="btn" id="stNarrPlay">Preview</button></div>
    <div class="switch"><span>Keep playing the next chapter</span><input type="checkbox" id="stCont" ${S.settings.contPlay===false?'':'checked'}></div>`:''}`;
  $('#stListen').onclick=e=>{ const b=e.target.closest('button'); if(!b) return; S.settings.listen=b.dataset.m; persist(); renderListenSettings(); };
  if($('#stNarr')) $('#stNarr').onchange=()=>{ S.settings.narrator=$('#stNarr').value; persist(); };
  if($('#stNarrPlay')) $('#stNarrPlay').onclick=()=>{ S.settings.narrator=$('#stNarr').value; persist(); narrateToggle([[19,23]],'preview'); };
  if($('#stCont')) $('#stCont').onchange=()=>{ S.settings.contPlay=$('#stCont').checked; persist(); };
}

/* ===== Memory Verses ===== */
const MV_STEPS=[1,2,4,7,14,30,60];
const MV_STARTERS=['John 3:16','Psalms 119:11','Proverbs 3:5-6','Romans 8:28','Philippians 4:13','Joshua 1:9','Isaiah 40:31','Romans 6:23','Ephesians 2:8-9','1 John 1:9','2 Timothy 3:16-17','Matthew 28:19-20','Psalms 23:1','Romans 12:1-2','Galatians 2:20','Micah 6:8'];
const addDays=n=>{ const d=new Date(); d.setDate(d.getDate()+n); return isoDay(d); };
const mvDue=()=>S.memory.filter(m=>!m.learned&&m.next<=isoDay());
async function memorize(label,text){
  const r=parseRef(label); if(!r){ toast('That verse reference was not recognized'); return null; }
  const lab=refLabel(r.book,r.ch,r.verses);
  if(S.memory.some(m=>m.label===lab)){ toast('Already in your memory verses'); return null; }
  let t=text; if(!t){ try{ t=await passageText(S.settings.tr,lab); }catch(e){} }
  if(!t){ toast('Connect to the internet to add this verse'); return null; }
  const m={id:uid(),label:lab,book:r.book,ch:r.ch,verses:r.verses,tr:S.settings.tr,text:t,stage:0,next:isoDay(),ts:Date.now(),updated:Date.now()};
  S.memory.unshift(m); persist(); toast('Added to Memory Verses'); return m;
}
function renderMemory(){
  const due=mvDue(), learning=S.memory.filter(m=>!m.learned&&!due.includes(m)), learned=S.memory.filter(m=>m.learned);
  const dots=m=>`<span style="letter-spacing:3px;color:var(--gold)">${MV_STEPS.map((_,i)=>i<m.stage?'◆':'◇').join('')}</span>`;
  const card=m=>`<button class="jcard" data-mv="${m.id}"><div class="meta">${m.learned?'Learned':m.next<=isoDay()?'Ready to review':'Next review '+esc(niceDay(m.next))} · ${dots(m)}</div><div class="ttl">${esc(m.label)}</div><div class="snip">${esc(m.text.slice(0,120))}${m.text.length>120?'…':''}</div></button>`;
  $('#mvBody').innerHTML=`<p class="dv-p" style="font-style:italic">“Thy word have I hid in mine heart, that I might not sin against thee.” <span class="small muted" style="font-style:normal">Psalm 119:11</span></p>
    <div class="grid2" style="margin-bottom:6px"><button class="btn red" id="mvAdd">Add a Verse</button><button class="btn dark" id="mvGo" ${due.length?'':'disabled'}>Review ${due.length||''} Now</button></div>
    <p class="small muted">Practice a little each day. Each time you know a verse, it comes back a few days later, then a week, then a month, until it is yours for good.</p>
    ${due.length?`<div class="jgroup">Ready to Review Today</div>${due.map(card).join('')}`:''}
    ${learning.length?`<div class="jgroup">Learning</div>${learning.map(card).join('')}`:''}
    ${learned.length?`<div class="jgroup">Learned</div>${learned.map(card).join('')}`:''}
    ${S.memory.length?'':`<div class="empty">No memory verses yet. Tap Add a Verse, or tap any verse in the Reader and choose Memorize.</div>`}`;
  $('#mvAdd').onclick=mvAddSheet;
  $('#mvGo').onclick=()=>mvPractice(due.map(m=>m.id),0);
  $$('#mvBody [data-mv]').forEach(b=>b.onclick=()=>mvPractice([b.dataset.mv],0));
}
function mvAddSheet(){
  const have=new Set(S.memory.map(m=>m.label));
  openSheet(`<button class="close" data-x>X</button><h3>Add a Memory Verse</h3>
    <div class="row"><input type="text" class="grow" id="mvRef" placeholder="e.g. Proverbs 3:5-6"><button class="btn red" id="mvRefGo">Add</button></div>
    <label class="lbl">Or start with a favorite</label>
    <div class="chips">${MV_STARTERS.map(r=>{ const p=parseRef(r), l=p?refLabel(p.book,p.ch,p.verses):r; return `<button class="chip ${have.has(l)?'on':''}" data-r="${esc(r)}">${esc(r.replace(/^Psalms /,'Psalm '))}</button>`; }).join('')}</div>`);
  $('#mvRefGo').onclick=async()=>{ const m=await memorize($('#mvRef').value); if(m){ closeSheet(); renderMemory(); } };
  $$('#sheetInner [data-r]').forEach(c=>c.onclick=async()=>{ if(c.classList.contains('on')) return; const m=await memorize(c.dataset.r); if(m){ c.classList.add('on'); renderMemory(); } });
}
function mvHints(t){ return t.replace(/([A-Za-z’'])[A-Za-z’'\-]*/g,'$1'); }
function mvBlanks(t,stage,seed){
  const words=t.split(/(\s+)/), ratio=[0.25,0.4,0.55,0.7,0.85,1,1][Math.min(stage,6)]; let n=0;
  return words.map((w,i)=>{ if(/^\s+$/.test(w)||!/[A-Za-z]/.test(w)) return esc(w);
    n++; const hide=((n*7+seed)%100)/100<ratio;
    if(!hide) return esc(w);
    const m=w.match(/^([^A-Za-z]*)(.*?)([^A-Za-z]*)$/);
    return `${esc(m[1])}<span class="mv-blank" data-w="${esc(m[2])}">${'_'.repeat(Math.max(3,Math.min(10,m[2].length)))}</span>${esc(m[3])}`; }).join('');
}
function mvPractice(ids,idx,mode){
  const m=S.memory.find(x=>x.id===ids[idx]); if(!m){ closeSheet(); renderMemory(); return; }
  mode=mode||(m.stage===0?'read':m.stage<3?'blanks':'hints');
  const seed=(m.ts%97);
  const body=mode==='read'?esc(m.text):mode==='hints'?esc(mvHints(m.text)):mvBlanks(m.text,m.stage,seed);
  openSheet(`<button class="close" data-x>X</button><div class="small muted" style="letter-spacing:.14em;text-transform:uppercase;font-weight:700">${ids.length>1?`${idx+1} of ${ids.length} · `:''}Memory Verse</div>
    <h3 style="margin-top:4px">${esc(m.label)}</h3>
    <div class="tabs" id="mvModes"><button data-m="read" class="${mode==='read'?'on':''}">Read</button><button data-m="blanks" class="${mode==='blanks'?'on':''}">Fill In</button><button data-m="hints" class="${mode==='hints'?'on':''}">First Letters</button></div>
    <div class="dv-verse" id="mvText" style="font-size:calc(var(--fs) + 4px);line-height:1.7;min-height:140px">${body}</div>
    <p class="small muted">${mode==='read'?'Read it aloud two or three times.':mode==='blanks'?'Say the whole verse. Tap a blank to peek.':'Each letter starts a word. Say the verse from memory.'}</p>
    <div class="row" style="margin-bottom:10px"><button class="btn sm" id="mvShow">Show the Verse</button><button class="btn sm" id="mvHear">Listen</button><div class="grow"></div><button class="btn sm" id="mvDel">Remove</button></div>
    <div class="grid2"><button class="btn" id="mvAgain">Need More Practice</button><button class="btn red" id="mvKnow">I Know It</button></div>`);
  $$('#mvModes button').forEach(b=>b.onclick=()=>mvPractice(ids,idx,b.dataset.m));
  $$('#mvText .mv-blank').forEach(s=>s.onclick=()=>{ s.textContent=s.dataset.w; s.classList.add('shown'); });
  $('#mvShow').onclick=()=>{ $('#mvText').textContent=m.text; };
  $('#mvHear').onclick=()=>{ if(speaking){ stopSpeak(); return; } speak(`${m.label}. ${m.text}`); };
  $('#mvDel').onclick=()=>{ if(!confirm(`Remove ${m.label} from your memory verses?`)) return; S.memory=S.memory.filter(x=>x.id!==m.id); persist(); closeSheet(); renderMemory(); };
  const next=()=>{ persist(); if(idx+1<ids.length) mvPractice(ids,idx+1); else { closeSheet(); renderMemory(); if(ids.length>1) toast('Review complete'); } };
  $('#mvKnow').onclick=()=>{ m.stage=Math.min(m.stage+1,MV_STEPS.length); if(m.stage>=MV_STEPS.length){ m.learned=true; toast(`${m.label} is learned`); } else m.next=addDays(MV_STEPS[m.stage-1]); m.updated=Date.now(); next(); };
  $('#mvAgain').onclick=()=>{ m.stage=Math.max(0,m.stage-1); m.learned=false; m.next=addDays(1); m.updated=Date.now(); next(); };
}
function renderMemoryHome(){
  const el=$('#homeMemD'); if(!el) return; const d=mvDue().length;
  el.textContent=d?`${d} verse${d===1?'':'s'} ready to review today`:S.memory.length?`${S.memory.filter(m=>m.learned).length} of ${S.memory.length} learned`:'Hide God’s Word in your heart';
}
if(/^#(memory|settings|home)?$/.test(location.hash)) route();
