/* ---------- Photos: keepsakes tucked in the Bible, In Loving Memory, sermon pages, sermon import ---------- */
'use strict';

/* ===== Storage: on this device (IndexedDB) and private online copy (dw-photos function) ===== */
const PH_FN=`${SB_URL}/functions/v1/dw-photos`;
const PH={db:null,urls:{},busy:false};
function phDB(){ if(PH.db) return PH.db;
  PH.db=new Promise((res,rej)=>{ const r=indexedDB.open('lwhDailyWordPhotos',1); r.onupgradeneeded=()=>r.result.createObjectStore('p'); r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); });
  return PH.db; }
async function idb(mode,fn){ const db=await phDB(); return new Promise((res,rej)=>{ const tx=db.transaction('p',mode), q=fn(tx.objectStore('p')); tx.oncomplete=()=>res(q&&q.result); tx.onerror=()=>rej(tx.error); }); }
const idbGet=id=>idb('readonly',s=>s.get(id)).catch(()=>null);
const idbPut=(id,v)=>idb('readwrite',s=>s.put(v,id));
const idbDel=id=>idb('readwrite',s=>s.delete(id)).catch(()=>{});
const idbKeys=()=>idb('readonly',s=>s.getAllKeys()).catch(()=>[]);
async function phCall(action,data){
  const r=await fetch(PH_FN,{method:'POST',headers:{'apikey':SB_KEY,'Content-Type':'application/json'},body:JSON.stringify(Object.assign({token:SY&&SY.token,action},data||{}))});
  let j=null; try{ j=await r.json(); }catch(e){}
  if(!j) throw new Error('network'); return j;
}
const blob64=b=>new Promise((res,rej)=>{ const f=new FileReader(); f.onload=()=>res(String(f.result).split(',')[1]); f.onerror=rej; f.readAsDataURL(b); });
const DELKEY=KEY+'.phdel';
function phPendingDel(){ try{ return JSON.parse(localStorage.getItem(DELKEY)||'[]'); }catch(e){ return []; } }
async function phSync(){
  if(PH.busy||!SY||!SY.token) return; PH.busy=true;
  try{
    const dels=phPendingDel();
    if(dels.length){ const r=await phCall('del',{ids:dels}); if(r.ok) try{ localStorage.removeItem(DELKEY); }catch(e){} }
    const ids=(await idbKeys()).filter(id=>(S.photos||[]).some(p=>p.id===id));
    for(const id of ids){ const rec=await idbGet(id); if(!rec||rec.up||!rec.full||!rec.thumb) continue;
      const r=await phCall('put',{id,full:await blob64(rec.full),thumb:await blob64(rec.thumb)});
      if(r.ok){ rec.up=true; await idbPut(id,rec); } else if(r.error==='signed_out') break; else if(r.error==='full'){ toast('Your photo space is full'); break; } }
  }catch(e){} finally{ PH.busy=false; phStatus(); }
}
async function phWaiting(){ let n=0; for(const id of await idbKeys()){ const r=await idbGet(id); if(r&&!r.up&&r.full) n++; } return n; }
/* signed links are fetched in batches */
const PHQ={t:new Map(),f:new Map(),timer:null};
function phUrl(id,thumb){ return new Promise(res=>{ const q=thumb?PHQ.t:PHQ.f; if(!q.has(id)) q.set(id,[]); q.get(id).push(res); clearTimeout(PHQ.timer); PHQ.timer=setTimeout(phFlushUrls,40); }); }
async function phFlushUrls(){
  for(const [q,thumb] of [[PHQ.t,true],[PHQ.f,false]]){ if(!q.size) continue; const all=new Map(q); q.clear(); const ids=[...all.keys()];
    for(let i=0;i<ids.length;i+=100){ const part=ids.slice(i,i+100); let urls={}; try{ const r=await phCall('urls',{ids:part,thumb}); urls=(r&&r.urls)||{}; }catch(e){} part.forEach(id=>all.get(id).forEach(f=>f(urls[id]||null))); } }
}
async function phBlob(id,thumb){
  let rec=await idbGet(id), b=rec&&(thumb?rec.thumb:rec.full);
  if(!b&&SY&&SY.token){ const u=await phUrl(id,thumb); if(u){ try{ const r=await fetch(u); if(r.ok){ b=await r.blob(); rec=(await idbGet(id))||{up:true}; rec[thumb?'thumb':'full']=b; await idbPut(id,rec); } }catch(e){} } }
  if(!b&&thumb) return phBlob(id,false);   // fall back to the full picture
  return b||null;
}
async function phSrc(id,thumb){ const k=id+(thumb?':t':':f'); if(PH.urls[k]) return PH.urls[k]; const b=await phBlob(id,thumb); if(!b) return null; return PH.urls[k]=URL.createObjectURL(b); }
const phImg=(id,thumb=true,cls='')=>`<img class="${cls}" data-phid="${esc(id)}" data-t="${thumb?1:0}" alt="">`;
function phHydrate(root){ $$('img[data-phid]:not([data-done])',root||document).forEach(im=>{ im.dataset.done=1; phSrc(im.dataset.phid,im.dataset.t==='1').then(u=>{ if(u) im.src=u; else im.classList.add('ph-missing'); }); }); }
const phAll=()=>(S.photos=S.photos||[]);
const phKeeps=()=>phAll().filter(p=>p.kind!=='page');
const phFor=fam=>phKeeps().filter(p=>p.fam===fam).sort((a,b)=>(a.ts||0)-(b.ts||0));
async function phStore(v,meta){
  const id=uid(), p=Object.assign({id,ts:Date.now(),updated:Date.now(),w:v.w,h:v.h},meta);
  await idbPut(id,{full:v.full,thumb:v.thumb,up:false});
  phAll().push(p); persist();
  try{ if(navigator.storage&&navigator.storage.persist) navigator.storage.persist(); }catch(e){}
  setTimeout(phSync,300); return p;
}
async function phReplace(p,v){ const rec={full:v.full,thumb:v.thumb,up:false}; await idbPut(p.id,rec); delete PH.urls[p.id+':t']; delete PH.urls[p.id+':f']; p.w=v.w; p.h=v.h; p.updated=Date.now(); persist(); setTimeout(phSync,300); }
async function phDelete(p){
  S.photos=phAll().filter(x=>x.id!==p.id); persist(); await idbDel(p.id);
  const d=phPendingDel(); d.push(p.id); try{ localStorage.setItem(DELKEY,JSON.stringify(d)); }catch(e){}
  phSync();
}

/* ===== Pictures: read, crop, rotate, brighten ===== */
function phPick(multiple,accept='image/*'){ return new Promise(res=>{ const i=document.createElement('input'); i.type='file'; i.accept=accept; i.multiple=!!multiple; i.style.display='none';
  i.onchange=()=>{ res([...i.files]); i.remove(); }; document.body.appendChild(i); i.click(); }); }
function loadImg(file){ return new Promise((res,rej)=>{ const u=URL.createObjectURL(file), im=new Image(); im.onload=()=>res(im); im.onerror=()=>rej(new Error('image')); im.src=u; }); }
function canvasOf(src,maxEdge){ const w=src.naturalWidth||src.width, h=src.naturalHeight||src.height, k=Math.min(1,maxEdge/Math.max(w,h));
  const c=document.createElement('canvas'); c.width=Math.max(1,Math.round(w*k)); c.height=Math.max(1,Math.round(h*k)); c.getContext('2d').drawImage(src,0,0,c.width,c.height); return c; }
function rotated(c,rot){ if(!rot) return c; const o=document.createElement('canvas'), q=rot%180!==0; o.width=q?c.height:c.width; o.height=q?c.width:c.height;
  const x=o.getContext('2d'); x.translate(o.width/2,o.height/2); x.rotate(rot*Math.PI/180); x.drawImage(c,-c.width/2,-c.height/2); return o; }
function cropped(c,r){ const o=document.createElement('canvas'), sx=Math.round(r.x*c.width), sy=Math.round(r.y*c.height); o.width=Math.max(1,Math.round(r.w*c.width)); o.height=Math.max(1,Math.round(r.h*c.height));
  o.getContext('2d').drawImage(c,sx,sy,o.width,o.height,0,0,o.width,o.height); return o; }
/* "bright": stretch faded newsprint and old photos; "bw": clean black and white for pages */
function enhance(c,mode){
  if(!mode||mode==='none') return c; const x=c.getContext('2d'), d=x.getImageData(0,0,c.width,c.height), a=d.data, hist=new Uint32Array(256), n=a.length/4;
  for(let i=0;i<a.length;i+=4) hist[(a[i]*77+a[i+1]*150+a[i+2]*29)>>8]++;
  let lo=0,hi=255,acc=0; while(lo<254&&(acc+=hist[lo])<n*.01) lo++; acc=0; while(hi>1&&(acc+=hist[hi])<n*.02) hi--;
  if(hi-lo<20){ lo=Math.max(0,lo-10); hi=Math.min(255,hi+10); }
  const lut=new Uint8ClampedArray(256); for(let v=0;v<256;v++) lut[v]=Math.pow(Math.min(1,Math.max(0,(v-lo)/(hi-lo))),.92)*255;
  for(let i=0;i<a.length;i+=4){
    if(mode==='bw'){ const g=lut[(a[i]*77+a[i+1]*150+a[i+2]*29)>>8]; a[i]=a[i+1]=a[i+2]=g; }
    else { a[i]=lut[a[i]]; a[i+1]=lut[a[i+1]]; a[i+2]=lut[a[i+2]]; }
  }
  x.putImageData(d,0,0); return c;
}
const toJpeg=(c,q)=>new Promise(r=>c.toBlob(r,'image/jpeg',q));
async function versions(c){ const full=canvasOf(c,1800), th=canvasOf(c,420); return {full:await toJpeg(full,.84),thumb:await toJpeg(th,.78),w:full.width,h:full.height}; }
async function phQuick(file,mode){ const im=await loadImg(file); const c=canvasOf(im,2200); return versions(enhance(c,mode)); }

/* Editor: rotate, crop with corner handles, brighten / black and white */
function phEditor(file,o={}){
  return new Promise(async resolve=>{
    let im; try{ im=await loadImg(file); }catch(e){ toast('That picture could not be opened'); resolve(null); return; }
    const base=canvasOf(im,2400); let rot=0, mode=o.mode||'none', crop={x:0,y:0,w:1,h:1}, disp=null;
    const ov=document.createElement('div'); ov.className='ph-ed'; ov.innerHTML=`<div class="ph-ed-top"><button class="btn sm" data-a="cancel">Cancel</button><b>${esc(o.title||'Adjust the Picture')}</b><button class="btn sm red" data-a="done">Use This</button></div>
      <div class="ph-ed-stage"><div class="ph-ed-wrap"><canvas></canvas><div class="ph-crop"><i data-c="tl"></i><i data-c="tr"></i><i data-c="bl"></i><i data-c="br"></i></div></div></div>
      <p class="ph-ed-tip">Drag the corners to trim the edges.</p>
      <div class="ph-ed-bar"><button class="btn" data-a="rot">Turn</button><button class="btn" data-a="bright">Brighten</button><button class="btn" data-a="bw">Black &amp; White</button><button class="btn" data-a="reset">Reset</button></div>`;
    document.body.appendChild(ov); document.body.classList.add('ph-ed-on');
    const cv=ov.querySelector('canvas'), box=ov.querySelector('.ph-crop'), wrap=ov.querySelector('.ph-ed-wrap');
    const draw=()=>{ const rc=rotated(base,rot), st=ov.querySelector('.ph-ed-stage'), mw=st.clientWidth-8, mh=st.clientHeight-8, k=Math.min(mw/rc.width,mh/rc.height,1);
      disp=document.createElement('canvas'); disp.width=Math.max(1,Math.round(rc.width*k)); disp.height=Math.max(1,Math.round(rc.height*k)); disp.getContext('2d').drawImage(rc,0,0,disp.width,disp.height); enhance(disp,mode);
      cv.width=disp.width; cv.height=disp.height; cv.getContext('2d').drawImage(disp,0,0); wrap.style.width=cv.width+'px'; wrap.style.height=cv.height+'px'; place();
      ov.querySelector('[data-a=bright]').classList.toggle('on',mode==='bright'); ov.querySelector('[data-a=bw]').classList.toggle('on',mode==='bw'); };
    const place=()=>{ Object.assign(box.style,{left:crop.x*100+'%',top:crop.y*100+'%',width:crop.w*100+'%',height:crop.h*100+'%'}); };
    let drag=null;
    box.addEventListener('pointerdown',e=>{ const c=e.target.dataset.c||'move'; drag={c,x:e.clientX,y:e.clientY,start:Object.assign({},crop)}; box.setPointerCapture(e.pointerId); e.preventDefault(); });
    box.addEventListener('pointermove',e=>{ if(!drag) return; const dx=(e.clientX-drag.x)/cv.width, dy=(e.clientY-drag.y)/cv.height, s=drag.start, m=.08; let {x,y,w,h}=s;
      if(drag.c==='move'){ x=Math.min(1-w,Math.max(0,s.x+dx)); y=Math.min(1-h,Math.max(0,s.y+dy)); }
      else { if(drag.c.includes('l')){ x=Math.min(s.x+s.w-m,Math.max(0,s.x+dx)); w=s.x+s.w-x; } if(drag.c.includes('r')) w=Math.min(1-s.x,Math.max(m,s.w+dx));
             if(drag.c.includes('t')){ y=Math.min(s.y+s.h-m,Math.max(0,s.y+dy)); h=s.y+s.h-y; } if(drag.c.includes('b')) h=Math.min(1-s.y,Math.max(m,s.h+dy)); }
      crop={x,y,w,h}; place(); });
    box.addEventListener('pointerup',()=>{ drag=null; });
    const close=v=>{ ov.remove(); document.body.classList.remove('ph-ed-on'); resolve(v); };
    ov.querySelectorAll('[data-a]').forEach(b=>b.onclick=async()=>{ const a=b.dataset.a;
      if(a==='cancel') close(null);
      else if(a==='rot'){ rot=(rot+90)%360; crop={x:0,y:0,w:1,h:1}; draw(); }
      else if(a==='bright'||a==='bw'){ mode=mode===a?'none':a; draw(); }
      else if(a==='reset'){ rot=0; mode='none'; crop={x:0,y:0,w:1,h:1}; draw(); }
      else if(a==='done'){ b.disabled=true; b.textContent='Saving…'; const out=enhance(cropped(rotated(base,rot),crop),mode); close(await versions(out)); } });
    requestAnimationFrame(draw); window.addEventListener('resize',()=>{ if(ov.isConnected) draw(); });
  });
}

/* ===== Keepsakes: add, details, view ===== */
function famOptions(sel){ const all=(S.family||[]).slice().sort((a,b)=>a.names.localeCompare(b.names)); const K={birth:'Birth',marriage:'Marriage',life:'Milestone',death:'Gone home'};
  return `<option value="">No one in particular</option>${all.map(e=>`<option value="${e.id}" ${sel===e.id?'selected':''}>${esc(e.names)} (${K[e.kind]})</option>`).join('')}`; }
async function phAddKeepsake(preset={}){
  const [f]=await phPick(false); if(!f) return;
  const v=await phEditor(f,{title:'Adjust the Picture'}); if(!v) return;
  phDetails(Object.assign({kind:'keep'},preset),v);
}
function phDetails(p,v){
  const isNew=!!v, rs=p.ref||'';
  openSheet(`<button class="close" data-x>X</button><h3>${isNew?'Keep This Picture':'About This Picture'}</h3>
    ${isNew?`<div class="ph-prev"><img id="pdPrev" alt=""></div>`:''}
    <label class="lbl">What is it?</label><input type="text" id="pdCap" value="${esc(p.cap||'')}" placeholder="e.g. Grandma’s obituary, our wedding announcement">
    <label class="lbl">Tuck it in the Bible at a verse (optional)</label><input type="text" id="pdRef" value="${esc(rs)}" placeholder="e.g. Psalm 23:1 or John 14">
    ${typeof R!=='undefined'&&R.book?`<button class="btn sm" id="pdHere" style="margin-top:6px">Use ${esc(bookName(R.book))} ${R.ch}</button>`:''}
    <label class="lbl">Who is it about? (optional)</label><select id="pdFam">${famOptions(p.fam)}</select>
    <label class="lbl">Date (optional)</label><input type="text" id="pdDate" value="${esc(p.date||'')}" placeholder="e.g. August 1987">
    <label class="lbl">A note (optional)</label><textarea id="pdNote" style="min-height:90px">${esc(p.note||'')}</textarea>
    <button class="btn red full" id="pdGo" style="margin-top:14px">${isNew?'Keep It':'Save'}</button>`);
  if(isNew){ const u=URL.createObjectURL(v.thumb); $('#pdPrev').src=u; }
  if($('#pdHere')) $('#pdHere').onclick=()=>{ $('#pdRef').value=`${bookName(R.book)} ${R.ch}`; };
  $('#pdGo').onclick=async()=>{
    const ref=$('#pdRef').value.trim(), r=ref?parseRef(ref):null; if(ref&&!r){ toast('That verse was not recognized. Try something like Psalm 23:1'); return; }
    const m={cap:$('#pdCap').value.trim(),ref:r?refLabel(r.book,r.ch,r.verses):'',refObj:r?{book:r.book,ch:r.ch,verses:r.verses}:null,fam:$('#pdFam').value||null,date:$('#pdDate').value.trim(),note:$('#pdNote').value.trim()};
    $('#pdGo').disabled=true;
    if(isNew){ await phStore(v,Object.assign({kind:p.kind||'keep'},m)); toast(r?`Tucked at ${m.ref}`:'Kept'); }
    else { Object.assign(p,m,{updated:Date.now()}); persist(); toast('Saved'); }
    closeSheet(); phRefresh();
  };
}
function phRefresh(){ const h=location.hash; if(h==='#keeps') renderKeeps(); else if(h==='#memorial') renderMemorial(); else if(h==='#family') renderFamily(); else if(h==='#read') phMarkReader(); else if(h==='#sermon'){ const s=curSermon(); if(s) phRenderPages(s); } }
function phView(id,list){
  const p=phAll().find(x=>x.id===id); if(!p) return; list=list||[p.id]; const i=list.indexOf(id);
  const fam=p.fam&&(S.family||[]).find(e=>e.id===p.fam);
  const ov=document.createElement('div'); ov.className='ph-view';
  ov.innerHTML=`<div class="ph-view-top"><button class="btn sm" data-a="x">Close</button><span>${list.length>1?`${i+1} of ${list.length}`:''}</span><button class="btn sm" data-a="more">${p.kind==='page'?'Options':'Details'}</button></div>
    <div class="ph-view-img">${phImg(p.id,false)}</div>
    <div class="ph-view-cap">${p.kind==='page'?`<b>Page ${(p.pg||0)+1}</b>`:`${p.cap?`<b>${esc(p.cap)}</b>`:''}${p.date?`<span>${esc(p.date)}</span>`:''}${p.note?`<p>${esc(p.note)}</p>`:''}
      <div class="ph-links">${p.ref?`<button class="btn sm" data-a="ref">Open ${esc(p.ref)}</button>`:''}${fam?`<button class="btn sm" data-a="fam">${esc(fam.names)}</button>`:''}</div>`}</div>
    ${list.length>1?`<button class="ph-nav l" data-a="prev" ${i<=0?'disabled':''}>‹</button><button class="ph-nav r" data-a="next" ${i>=list.length-1?'disabled':''}>›</button>`:''}`;
  document.body.appendChild(ov); document.body.classList.add('ph-ed-on'); phHydrate(ov);
  const img=ov.querySelector('.ph-view-img'); img.onclick=()=>img.classList.toggle('zoom');
  const close=()=>{ ov.remove(); document.body.classList.remove('ph-ed-on'); };
  let x0=null; img.addEventListener('touchstart',e=>{ x0=e.touches[0].clientX; },{passive:true});
  img.addEventListener('touchend',e=>{ if(x0===null||img.classList.contains('zoom')) return; const dx=e.changedTouches[0].clientX-x0; x0=null; if(Math.abs(dx)>60){ const j=i+(dx<0?1:-1); if(j>=0&&j<list.length){ close(); phView(list[j],list); } } },{passive:true});
  ov.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{ const a=b.dataset.a;
    if(a==='x') close();
    else if(a==='prev'||a==='next'){ close(); phView(list[i+(a==='next'?1:-1)],list); }
    else if(a==='ref'){ close(); openReader(p.refObj.book,p.refObj.ch,p.refObj.verses); }
    else if(a==='fam'){ close(); fam.kind==='death'?openMemorial(fam.id):go('family'); }
    else if(a==='more'){ close(); phOptions(p); } });
}
function phOptions(p){
  const page=p.kind==='page', fam=p.fam&&(S.family||[]).find(e=>e.id===p.fam&&e.kind==='death');
  openSheet(`<button class="close" data-x>X</button><h3>${page?`Page ${(p.pg||0)+1}`:esc(p.cap||'Picture')}</h3>
    ${page?'':'<button class="btn full" id="poInfo">Change the Details</button>'}
    <button class="btn full" id="poEdit" style="margin-top:10px">Turn, Trim or Brighten</button>
    ${fam?`<button class="btn full" id="poPort" style="margin-top:10px">${fam.portrait===p.id?'This is the main picture':'Use as the Main Picture'}</button>`:''}
    <button class="btn full" id="poShare" style="margin-top:10px">Share</button>
    ${page?'<button class="btn full" id="poUp" style="margin-top:10px">Move Earlier</button>':''}
    <button class="btn full" id="poDel" style="margin-top:10px">${page?'Remove This Page':'Remove This Picture'}</button>`);
  if($('#poInfo')) $('#poInfo').onclick=()=>phDetails(p);
  $('#poEdit').onclick=async()=>{ closeSheet(); const b=await phBlob(p.id,false); if(!b){ toast('The picture is not on this device yet'); return; } const v=await phEditor(b,{mode:'none'}); if(v){ await phReplace(p,v); toast('Saved'); phRefresh(); } };
  if($('#poPort')) $('#poPort').onclick=()=>{ fam.portrait=p.id; fam.updated=Date.now(); persist(); closeSheet(); toast('Main picture set'); phRefresh(); };
  $('#poShare').onclick=async()=>{ const b=await phBlob(p.id,false); if(!b) return; const f=new File([b],(p.cap||'keepsake').replace(/[^\w ]+/g,'').trim()+'.jpg',{type:'image/jpeg'});
    try{ if(navigator.canShare&&navigator.canShare({files:[f]})){ await navigator.share({files:[f],title:p.cap||'Keepsake'}); return; } }catch(e){ return; }
    const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=f.name; a.click(); };
  if($('#poUp')) $('#poUp').onclick=()=>{ const s=phAll().filter(x=>x.serm===p.serm).sort((a,b)=>a.pg-b.pg), i=s.indexOf(p); if(i>0){ const t=s[i-1].pg; s[i-1].pg=p.pg; p.pg=t; s[i-1].updated=p.updated=Date.now(); persist(); } closeSheet(); phRefresh(); };
  $('#poDel').onclick=async()=>{ if(!confirm(page?'Remove this page?':'Remove this picture? It will be removed from all your devices.')) return;
    await phDelete(p); if(page){ phAll().filter(x=>x.serm===p.serm).sort((a,b)=>a.pg-b.pg).forEach((x,i)=>{ if(x.pg!==i){ x.pg=i; x.updated=Date.now(); } }); persist(); }
    (S.family||[]).forEach(e=>{ if(e.portrait===p.id){ delete e.portrait; e.updated=Date.now(); } }); persist(); closeSheet(); phRefresh(); };
}

/* ===== Tucked in My Bible (view) ===== */
async function phStatus(){ const el=$('#kpStatus'); if(!el) return;
  if(!SY||!SY.token){ el.textContent='Your pictures are saved on this device. To keep them safe and see them on your other devices, sign in under Settings, Sync Across Devices.'; return; }
  const n=await phWaiting(); el.textContent=n?`${n} picture${n===1?' is':'s are'} waiting to be backed up. They will go up the next time you have a connection.`:'All your pictures are backed up and private to you.'; }
function renderKeeps(){
  const box=$('#keepsBody'); if(!box) return; const all=phKeeps();
  const order=p=>p.refObj?p.refObj.book*1e6+p.refObj.ch*1e3+(p.refObj.verses[0]||0):0;
  const tucked=all.filter(p=>p.refObj).sort((a,b)=>order(a)-order(b)), fam=all.filter(p=>!p.refObj&&p.fam), other=all.filter(p=>!p.refObj&&!p.fam).sort((a,b)=>b.ts-a.ts);
  const famName=id=>{ const e=(S.family||[]).find(x=>x.id===id); return e?e.names:''; };
  const card=p=>`<button class="kp-card" data-ph="${p.id}"><span class="kp-img">${phImg(p.id)}</span><span class="t">${esc(p.cap||'Keepsake')}</span><span class="d">${esc(p.ref||famName(p.fam)||p.date||'')}</span></button>`;
  const sec=(t,l)=>l.length?`<div class="sect">${t}</div><div class="kp-grid">${l.map(card).join('')}</div>`:'';
  box.innerHTML=`<p class="dv-p" style="margin-top:-4px">Families have always kept treasures in their Bibles: an obituary, a wedding announcement, a funeral program, a letter, a pressed flower. Take a picture of yours and tuck it in at a verse that means something.</p>
    <button class="btn red full" id="kpAdd">Add a Picture or Clipping</button>
    <p class="small muted" style="text-align:center;margin:6px 0 4px">Take a photo, or choose one you already have</p>
    ${all.length?sec('Tucked in the Pages',tucked)+sec('With the Family Record',fam)+sec('Other Keepsakes',other):'<div class="empty" style="margin-top:16px">Nothing tucked in yet. When you add a clipping at a verse, a corner of it shows in the margin when you read that page.</div>'}
    <p class="small muted" id="kpStatus" style="text-align:center;margin-top:20px"></p>`;
  $('#kpAdd').onclick=()=>phAddKeepsake();
  const ids=[...tucked,...fam,...other].map(p=>p.id);
  $$('#keepsBody .kp-card').forEach(b=>b.onclick=()=>phView(b.dataset.ph,ids));
  phHydrate(box); phStatus();
}

/* corners of clippings show in the margin while reading */
function phMarkReader(){
  const box=$('#scripture'); if(!box||typeof R==='undefined') return; $$('#scripture .tuck').forEach(t=>t.remove());
  const here=phKeeps().filter(p=>p.refObj&&p.refObj.book===R.book&&p.refObj.ch===R.ch); if(!here.length) return;
  const ids=here.map(p=>p.id);
  here.forEach((p,k)=>{ const v=box.querySelector(`.v[data-v="${p.refObj.verses[0]||1}"]`)||box.querySelector('.v'); if(!v) return;
    const b=document.createElement('button'); b.className='tuck'; b.dataset.ph=p.id; b.style.setProperty('--tilt',(k%2?3:-4)+'deg'); b.setAttribute('aria-label','Tucked here: '+(p.cap||'a keepsake'));
    b.innerHTML=phImg(p.id)+`<span>${esc(p.cap||'Tucked here')}</span>`; b.onclick=e=>{ e.stopPropagation(); phView(p.id,ids); }; v.parentNode.insertBefore(b,v); });
  phHydrate(box);
}
const _renderReaderPh=renderReader;
renderReader=async function(){ const r=await _renderReaderPh.apply(this,arguments); try{ phMarkReader(); }catch(e){} return r; };

/* ===== In Loving Memory ===== */
const COMFORT=[
 {t:'Let not your heart be troubled: ye believe in God, believe also in me. In my Father’s house are many mansions: if it were not so, I would have told you. I go to prepare a place for you.',r:'John 14:1-2'},
 {t:'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.',r:'Revelation 21:4'},
 {t:'Jesus said unto her, I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live.',r:'John 11:25'},
 {t:'For if we believe that Jesus died and rose again, even so them also which sleep in Jesus will God bring with him.',r:'1 Thessalonians 4:14'},
 {t:'Precious in the sight of the LORD is the death of his saints.',r:'Psalm 116:15'},
 {t:'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',r:'Psalm 23:4'},
 {t:'The LORD is nigh unto them that are of a broken heart.',r:'Psalm 34:18'},
];
const comfortFor=id=>{ let h=0; for(const c of String(id)) h=(h*31+c.charCodeAt(0))>>>0; return COMFORT[h%COMFORT.length]; };
const MEM={id:null};
function openMemorial(id){ MEM.id=id; if(location.hash==='#memorial') renderMemorial(); else go('memorial'); }
async function renderMemorial(){
  const box=$('#memBody'); if(!box) return; const e=(S.family||[]).find(x=>x.id===MEM.id); if(!e){ go('family'); return; }
  const ph=phFor(e.id), port=ph.find(p=>p.id===e.portrait)||ph[0], others=ph.filter(p=>p!==port), c=comfortFor(e.id);
  const serms=(S.sermons||[]).filter(s=>s.fam===e.id);
  box.innerHTML=`<div class="mem">
    <div class="mem-frame">${port?`<button class="mem-port${e.portrait===port.id?'':' rect'}" data-ph="${port.id}">${phImg(port.id,false)}</button>`:'<button class="mem-port empty" id="memAddP"><span>Add a Picture</span></button>'}</div>
    <div class="mem-k">In Loving Memory</div><div class="mem-n">${esc(e.names)}</div>
    <div class="mem-d">${e.born?`${esc(e.born)} &ndash; `:''}${esc(frDate(e))}</div>
    ${e.place?`<div class="mem-p">${esc(e.place)}</div>`:''}
    <div class="orn mem-orn"><i></i><b></b><i></i></div>
    ${e.verse?`<div class="mem-v"><div class="lab">A Favorite Verse</div><p id="memVerse">…</p><div class="ref">${esc(e.verse)}</div></div>`:''}
    ${e.story||e.note?`<div class="mem-s">${esc(e.story||e.note).split(/\n{2,}/).map(x=>`<p>${x.replace(/\n/g,'<br>')}</p>`).join('')}</div>`:''}
    ${others.length?`<div class="sect">Keepsakes</div><div class="kp-grid">${others.map(p=>`<button class="kp-card" data-ph="${p.id}"><span class="kp-img">${phImg(p.id)}</span><span class="t">${esc(p.cap||'Keepsake')}</span><span class="d">${esc(p.date||p.ref||'')}</span></button>`).join('')}</div>`:''}
    ${serms.length?`<div class="sect">Services</div>${serms.map(s=>`<button class="jcard" data-sm="${s.id}"><div class="meta">${s.kind==='funeral'?'Funeral service':'Message'}</div><div class="ttl">${esc(s.title||'Untitled')}</div></button>`).join('')}`:''}
    <div class="mem-c"><div class="lab">Words of Comfort</div><p>“${esc(c.t)}”</p><div class="ref">${esc(c.r)}</div></div>
    <div class="grid2"><button class="btn red" id="memAdd">Add a Picture</button><button class="btn" id="memEdit">Write About Them</button></div>
    <button class="btn full" id="memRec" style="margin-top:10px">Change the Record</button>
    <button class="btn full" id="memBack" style="margin-top:10px">Back to the Family Record</button></div>`;
  const ids=ph.map(p=>p.id);
  $$('#memBody [data-ph]').forEach(b=>b.onclick=()=>phView(b.dataset.ph,ids));
  $$('#memBody [data-sm]').forEach(b=>b.onclick=()=>openSermon(b.dataset.sm));
  if($('#memAddP')) $('#memAddP').onclick=()=>phAddKeepsake({fam:e.id,cap:'Photo'});
  $('#memAdd').onclick=()=>phAddKeepsake({fam:e.id});
  $('#memEdit').onclick=()=>memEditSheet(e);
  $('#memRec').onclick=()=>frSheet('death',e);
  $('#memBack').onclick=()=>go('family');
  phHydrate(box);
  if(e.verse){ try{ const t=await passageText(S.settings.tr,e.verse); if($('#memVerse')) $('#memVerse').textContent=t?`“${t}”`:''; }catch(x){ if($('#memVerse')) $('#memVerse').textContent=''; } }
}
function memEditSheet(e){
  openSheet(`<button class="close" data-x>X</button><h3>Write About ${esc(e.names.split(' ')[0])}</h3>
    <label class="lbl">Born (optional)</label><input type="text" id="meBorn" value="${esc(e.born||'')}" placeholder="e.g. March 4, 1931">
    <label class="lbl">A favorite verse (optional)</label><input type="text" id="meVerse" value="${esc(e.verse||'')}" placeholder="e.g. Psalm 23">
    <label class="lbl">Their story, and what you remember</label><textarea id="meStory" style="min-height:200px" placeholder="Where they grew up, the people they loved, what they taught you, a favorite hymn…">${esc(e.story||e.note||'')}</textarea>
    <button class="micbtn" id="meMic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"/></svg><span id="meMicLbl">Tap to Speak</span></button><div class="interim" id="meInterim"></div>
    <button class="btn red full" id="meGo" style="margin-top:14px">Save</button>`);
  $('#meMic').onclick=()=>{ if(typeof recOn!=='undefined'&&recOn){ stopDictation(); return; } DICT={btn:'#meMic',lbl:'#meMicLbl',ta:'#meStory',interim:'#meInterim',save:()=>{}}; startDictation(); };
  $('#meGo').onclick=()=>{ const v=$('#meVerse').value.trim(), r=v?parseRef(v):null; if(v&&!r){ toast('That verse was not recognized'); return; }
    try{ if(typeof recOn!=='undefined'&&recOn) stopDictation(); }catch(x){}
    e.born=$('#meBorn').value.trim(); e.verse=r?refLabel(r.book,r.ch,r.verses):''; e.story=$('#meStory').value.trim(); e.updated=Date.now(); persist(); closeSheet(); toast('Saved'); renderMemorial(); };
}

/* Family Record: thumbnails, memorial pages, pictures on each entry */
const _renderFamilyPh=renderFamily;
renderFamily=function(){ _renderFamilyPh.apply(this,arguments);
  $$('#frBody .fr-e').forEach(b=>{ const e=(S.family||[]).find(x=>x.id===b.dataset.id); if(!e) return; const ph=phFor(e.id), port=ph.find(p=>p.id===e.portrait)||ph[0];
    if(port){ b.classList.add('has-ph'); b.insertAdjacentHTML('afterbegin',phImg(port.id,true,'fr-th')); }
    if(e.kind==='death'){ b.onclick=()=>openMemorial(e.id); b.insertAdjacentHTML('beforeend','<span class="fr-mem">In Loving Memory &rsaquo;</span>'); }
    else if(ph.length>1) b.insertAdjacentHTML('beforeend',`<span class="fr-mem">${ph.length} pictures</span>`); });
  phHydrate($('#frBody'));
};
const _frSheetPh=frSheet;
frSheet=function(kind,e){ _frSheetPh.apply(this,arguments); if(!e||!e.id) return;
  const ph=phFor(e.id), save=$('#feSave'); if(!save) return;
  save.insertAdjacentHTML('beforebegin',`<label class="lbl">Pictures and clippings</label><div class="fe-ph">${ph.map(p=>`<button data-ph="${p.id}">${phImg(p.id)}</button>`).join('')}<button class="fe-add" id="feAddPh">+ Add</button></div>`);
  $$('#sheetInner .fe-ph [data-ph]').forEach(b=>b.onclick=()=>{ closeSheet(); phView(b.dataset.ph,ph.map(p=>p.id)); });
  $('#feAddPh').onclick=()=>{ closeSheet(); phAddKeepsake({fam:e.id}); };
  phHydrate($('#sheetInner'));
};
const _renderFamTodayPh=renderFamToday;
renderFamToday=function(){ _renderFamTodayPh.apply(this,arguments);
  $$('#famToday [data-mem]').forEach(el=>{ const e=(S.family||[]).find(x=>x.id===el.dataset.mem); if(!e) return; const ph=phFor(e.id), port=ph.find(p=>p.id===e.portrait)||ph[0];
    el.classList.add('fam-mem'); if(port) el.insertAdjacentHTML('afterbegin',phImg(port.id,true,'fam-th'));
    const c=comfortFor(e.id); el.insertAdjacentHTML('beforeend',`<span class="fam-c">“${esc(c.t.split(/[:;]/)[0].replace(/[.,]+$/,''))}.” ${esc(c.r)}</span>`);
    el.onclick=()=>openMemorial(e.id); });
  phHydrate($('#famToday'));
};

/* ===== Sermons: original pages, reading the text, import ===== */
function phRenderPages(s){
  const box=$('#smPages'); if(!box) return; const pages=phAll().filter(p=>p.serm===s.id).sort((a,b)=>a.pg-b.pg);
  const deaths=(S.family||[]).filter(e=>e.kind==='death');
  box.innerHTML=`<h2>Original Pages</h2>
    ${pages.length?`<div class="sm-pages">${pages.map((p,i)=>`<button data-ph="${p.id}">${phImg(p.id)}<span>${i+1}</span></button>`).join('')}</div>`:'<p class="small muted" style="margin:0 0 10px">Keep pictures of the printed or handwritten pages with this sermon. Take a picture of each page, or choose scans you already have.</p>'}
    <div class="grid2"><button class="btn" id="smAddPg">${pages.length?'Add More Pages':'Add Pages'}</button>${pages.length?'<button class="btn dark" id="smOcr">Read the Text</button>':'<button class="btn" id="smTpl">Use as a Template</button>'}</div>
    ${pages.length?'<button class="btn full" id="smTpl" style="margin-top:10px">Use as a Template</button>':''}
    ${s.kind==='funeral'&&deaths.length?`<label class="lbl" style="margin-top:14px">This service was for</label><select id="smFam"><option value="">Choose someone from your Family Record</option>${deaths.map(e=>`<option value="${e.id}" ${s.fam===e.id?'selected':''}>${esc(e.names)}</option>`).join('')}</select>`:''}`;
  $$('#smPages [data-ph]').forEach(b=>b.onclick=()=>phView(b.dataset.ph,pages.map(p=>p.id)));
  $('#smAddPg').onclick=()=>phAddPages(s);
  if($('#smOcr')) $('#smOcr').onclick=()=>phOcr(s);
  $('#smTpl').onclick=()=>{ saveSermon(true); newSermon({title:s.title?`${s.title} (new)`:'',ref:s.ref,topic:s.topic,kind:s.kind,body:s.body}); toast('A copy is ready to change. The original is unchanged.'); };
  if($('#smFam')) $('#smFam').onchange=()=>{ s.fam=$('#smFam').value||null; s.updated=Date.now(); persist(); toast(s.fam?'Linked to their memorial page':'Unlinked'); };
  phHydrate(box);
}
async function phAddPages(s){
  if(!S.sermons.includes(s)){ if(!$('#smTitle').value.trim()) $('#smTitle').value=s.kind?'Scanned service':'Scanned sermon'; saveSermon(true); }
  const files=(await phPick(true)).sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true})); if(!files.length) return;
  const start=phAll().filter(p=>p.serm===s.id).length;
  openSheet(`<h3>Adding Pages</h3><p class="dv-p" id="apMsg">Getting page 1 of ${files.length} ready…</p><div class="ap-bar"><i id="apBar"></i></div>`);
  for(let i=0;i<files.length;i++){ $('#apMsg').textContent=`Getting page ${i+1} of ${files.length} ready…`; $('#apBar').style.width=Math.round(i/files.length*100)+'%';
    try{ const v=await phQuick(files[i],'bright'); await phStore(v,{kind:'page',serm:s.id,pg:start+i}); }catch(e){ toast(`Page ${i+1} could not be read`); } }
  closeSheet(); toast(`${files.length} page${files.length===1?'':'s'} added`); phRenderPages(s);
}
function loadScript(src){ return new Promise((res,rej)=>{ if(document.querySelector(`script[data-src="${src}"]`)){ res(); return; } const t=document.createElement('script'); t.src=src; t.dataset.src=src; t.onload=res; t.onerror=()=>rej(new Error('load')); document.head.appendChild(t); }); }
async function ocrWorker(log){
  await loadScript('lib/ocr/tesseract.min.js'); const base=new URL('lib/ocr/',location.href).href;
  return Tesseract.createWorker('eng',1,{workerPath:base+'worker.min.js',corePath:base,langPath:base,gzip:true,logger:log});
}
async function phOcr(s){
  const pages=phAll().filter(p=>p.serm===s.id).sort((a,b)=>a.pg-b.pg); if(!pages.length) return;
  let stop=false;
  openSheet(`<h3>Reading the Pages</h3><p class="dv-p" id="ocMsg">Getting ready. The first time takes a little longer.</p><div class="ap-bar"><i id="ocBar"></i></div>
    <p class="small muted">Typed and printed pages read best. Handwriting usually will not come through clearly, but the pictures stay with the sermon either way.</p><button class="btn full" id="ocStop">Stop</button>`);
  $('#ocStop').onclick=()=>{ stop=true; closeSheet(); };
  let cur=0, worker;
  try{ worker=await ocrWorker(m=>{ if(m.status==='recognizing text'&&$('#ocBar')) $('#ocBar').style.width=Math.round((cur+m.progress)/pages.length*100)+'%'; }); }
  catch(e){ closeSheet(); toast('Text reading could not start. Check your connection and try again.'); return; }
  const out=[];
  for(cur=0;cur<pages.length&&!stop;cur++){ if($('#ocMsg')) $('#ocMsg').textContent=`Reading page ${cur+1} of ${pages.length}…`;
    const b=await phBlob(pages[cur].id,false); if(!b){ out.push(''); continue; }
    try{ const r=await worker.recognize(b); out.push(cleanOcr(r.data.text)); pages[cur].text=out[cur]; }catch(e){ out.push(''); } }
  try{ await worker.terminate(); }catch(e){}
  if(stop) return; closeSheet();
  const text=out.map((t,i)=>pages.length>1?`[Page ${i+1}]\n${t}`:t).join('\n\n').trim();
  if(!text.replace(/\[Page \d+\]/g,'').trim()){ toast('No printed words were found on these pages'); return; }
  const body=$('#smBody'); body.value=body.value.trim()?body.value.replace(/\s+$/,'')+'\n\n— Read from the original pages —\n\n'+text:text;
  const d=detectAll(out.join('\n\n'),'');
  if(!$('#smRef').value.trim()&&d.ref) $('#smRef').value=d.ref;
  if(/^Scanned (sermon|service)$/.test($('#smTitle').value.trim())&&d.title) $('#smTitle').value=d.title;
  saveSermon(true); persist(); toast('The text was added below. Read it over and fix anything that came through wrong.');
}
const cleanOcr=t=>String(t||'').replace(/[ \t]+\n/g,'\n').replace(/-\n(\w)/g,'$1').replace(/([^\n])\n(?!\n)([a-z])/g,'$1 $2').replace(/\n{3,}/g,'\n\n').trim();

/* finding the title, Scripture, date and kind in an old file */
const MONTHN={jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,sept:9,oct:10,nov:11,dec:12};
function detectDate(str){
  const ok=(y,m,d)=>y>=1950&&y<=2040&&m>=1&&m<=12&&d>=1&&d<=31?`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`:null;
  let m; const yy=y=>y<100?(y>40?1900+y:2000+y):y;
  if((m=str.match(/\b(19[5-9]\d|20[0-4]\d)[-_. /](\d{1,2})[-_. /](\d{1,2})\b/))) return ok(+m[1],+m[2],+m[3]);
  if((m=str.match(/\b(\d{1,2})[-_. /](\d{1,2})[-_. /](\d{4}|\d{2})\b/))) return ok(yy(+m[3]),+m[1],+m[2]);
  if((m=str.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*\.?[ _-]+(\d{1,2})(?:st|nd|rd|th)?,?[ _-]+(\d{4})\b/i))) return ok(+m[3],MONTHN[m[1].toLowerCase()],+m[2]);
  if((m=str.match(/\b(\d{1,2})(?:st|nd|rd|th)?[ _-]+(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*\.?,?[ _-]+(\d{4})\b/i))) return ok(+m[3],MONTHN[m[2].toLowerCase()],+m[1]);
  return null;
}
function detectRef(str){
  const re=/\b((?:[1-3]|I{1,3})[ \t]?)?([A-Z][a-z]+(?:[ \t](?:of[ \t])?[A-Z][a-z]+)?)\.?[ \t]+(\d{1,3})(?::\s?(\d{1,3})(?:\s?[-–]\s?(\d{1,3}))?)?/g; let m, chOnly=null;
  while((m=re.exec(str))){ const s=m[0].replace(/^I{1,3}\s?/,x=>String(x.trim().length)+' ').replace(/\s+/g,' ').replace('–','-'); const r=parseRef(s);
    if(!r||r.ch>bookChapters(r.book)){ re.lastIndex=m.index+1; continue; } const lab=refLabel(r.book,r.ch,r.verses); if(r.verses.length) return lab; if(!chOnly&&m[4]===undefined&&/^\d+$/.test(m[3])&&m[2].length>3) chOnly=lab; }
  return chOnly;
}
function detectKind(str){ const s=str.toLowerCase();
  if(/\b(funeral|memorial service|home[- ]?going|graveside|committal|celebration of life|obituary|in loving memory)\b/.test(s)) return 'funeral';
  if(/\b(wedding|marriage ceremony|vows|holy matrimony|bride|groom)\b/.test(s)) return 'wedding';
  return ''; }
function detectTitle(text,fname){
  const lines=text.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,8);
  for(const l of lines){ if(l.length<3||l.length>90) continue; if(detectDate(l)&&l.length<30) continue; if(/^(text|scripture|date|sermon|preached|by|pastor|rev\.?)\b[:\s]*$/i.test(l)) continue;
    const r=detectRef(l); if(r&&l.replace(/[^A-Za-z]/g,'').length<=r.replace(/[^A-Za-z]/g,'').length+6) continue;
    return l.replace(/^(title|sermon|message)\s*[:\-–]\s*/i,'').replace(/[“”"]/g,'').trim(); }
  return fname.replace(/\.[^.]+$/,'').replace(/[_]+/g,' ').replace(/\b(19|20)\d\d[-_. ]\d{1,2}[-_. ]\d{1,2}\b/,'').replace(/\s{2,}/g,' ').trim();
}
function detectAll(text,fname){ const head=text.slice(0,1800);
  return {title:detectTitle(text,fname||''),ref:detectRef(head)||detectRef(fname||'')||'',date:detectDate(fname||'')||detectDate(head.slice(0,700))||'',kind:detectKind((fname||'')+' '+head)}; }

async function phImportSheet(){
  openSheet(`<button class="close" data-x>X</button><h3>Bring In Old Sermons and Services</h3>
    <p class="dv-p">Choose one file or many at once. The title, main Scripture and date are filled in for you when they can be found, and you can check them before anything is saved.</p>
    <button class="btn red full" id="imDocs">Word or Text Files</button><p class="small muted" style="margin:6px 0 14px">Word files saved as .docx, or plain .txt files. Older .doc files can be opened in Word and saved as .docx first.</p>
    <button class="btn full" id="imPics">Pictures of Printed or Handwritten Pages</button><p class="small muted" style="margin:6px 0 0">Choose all the pages of one sermon. They are kept with it, and the printed words can be read in.</p>`);
  $('#imPics').onclick=()=>{ closeSheet(); newSermon({title:'Scanned sermon'}); setTimeout(()=>{ const s=curSermon(); if(s) phAddPages(s); },350); };
  $('#imDocs').onclick=async()=>{ const files=await phPick(true,'.docx,.txt,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain'); if(!files.length) return; phImportFiles(files); };
}
async function phImportFiles(files){
  openSheet(`<h3>Reading Your Files</h3><p class="dv-p" id="ifMsg">Opening…</p><div class="ap-bar"><i id="ifBar"></i></div>`);
  const rows=[], skipped=[];
  if(files.some(f=>/\.docx$/i.test(f.name))){ try{ await loadScript('lib/mammoth.browser.min.js'); }catch(e){ closeSheet(); toast('Could not open the Word reader. Check your connection.'); return; } }
  for(let i=0;i<files.length;i++){ const f=files[i]; $('#ifMsg').textContent=`Reading ${i+1} of ${files.length}: ${f.name}`; $('#ifBar').style.width=Math.round(i/files.length*100)+'%';
    try{ let text='';
      if(/\.docx$/i.test(f.name)){ const r=await mammoth.extractRawText({arrayBuffer:await f.arrayBuffer()}); text=r.value; }
      else if(/\.txt$/i.test(f.name)||f.type==='text/plain') text=await f.text();
      else { skipped.push(f.name); continue; }
      text=text.replace(/\r/g,'').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim(); if(!text){ skipped.push(f.name); continue; }
      const d=detectAll(text,f.name), dup=(S.sermons||[]).some(s=>s.title===d.title&&(s.body||'').trim()===text);
      rows.push(Object.assign({fname:f.name,text,dup,on:!dup},d));
    }catch(e){ skipped.push(f.name); } }
  rows.sort((a,b)=>(a.date||'9')<(b.date||'9')?-1:1);
  const K={'':'Sermon',wedding:'Wedding',funeral:'Funeral'};
  openSheet(`<button class="close" data-x>X</button><h3>Check Before Saving</h3>
    <p class="small muted">${rows.length} file${rows.length===1?'':'s'} read${skipped.length?`. Not readable: ${esc(skipped.join(', '))}`:''}. Fix anything that looks wrong, then save.</p>
    ${rows.map((r,i)=>`<div class="im-row${r.on?'':' off'}" data-i="${i}">
      <label class="im-on"><input type="checkbox" ${r.on?'checked':''}> <span>${esc(r.fname)}${r.dup?' (already in your sermons)':''}</span></label>
      <input type="text" class="im-t" value="${esc(r.title)}" placeholder="Title">
      <div class="im-g"><select class="im-k">${Object.keys(K).map(k=>`<option value="${k}" ${r.kind===k?'selected':''}>${K[k]}</option>`).join('')}</select><input type="text" class="im-r" value="${esc(r.ref)}" placeholder="Scripture"><input type="text" class="im-d" value="${esc(r.date)}" placeholder="YYYY-MM-DD"></div>
      <input type="text" class="im-a" placeholder="Where (optional)"></div>`).join('')}
    <button class="btn red full" id="imSave" style="margin-top:14px">Save ${rows.filter(r=>r.on).length}</button>`);
  const count=()=>{ const n=$$('#sheetInner .im-row input[type=checkbox]').filter(c=>c.checked).length; $('#imSave').textContent=`Save ${n}`; };
  $$('#sheetInner .im-row input[type=checkbox]').forEach(c=>c.onchange=()=>{ c.closest('.im-row').classList.toggle('off',!c.checked); count(); });
  $('#imSave').onclick=()=>{ let n=0;
    $$('#sheetInner .im-row').forEach(el=>{ const r=rows[+el.dataset.i]; if(!el.querySelector('input[type=checkbox]').checked) return;
      const title=el.querySelector('.im-t').value.trim()||r.fname, kind=el.querySelector('.im-k').value, ref=el.querySelector('.im-r').value.trim(), d=el.querySelector('.im-d').value.trim(), at=el.querySelector('.im-a').value.trim();
      const pr=parseRef(ref), s={id:uid(),title,ref:pr?ref:'',topic:'',structure:'',body:r.text,preached:/^\d{4}-\d{2}-\d{2}$/.test(d)?[{d,at}]:[],ts:Date.now()-n,updated:Date.now(),imported:r.fname};
      if(kind) s.kind=kind; s.refObj=pr?{book:pr.book,ch:pr.ch,verses:pr.verses}:null; S.sermons.push(s); n++; });
    persist(); closeSheet(); toast(`${n} saved to My Sermons`); if(typeof renderStudy==='function'&&location.hash==='#study') renderStudy(); };
}

/* hooks into the sermon editor and My Sermons */
const _renderSermonPh=renderSermon;
renderSermon=function(){ _renderSermonPh.apply(this,arguments); const s=curSermon(); if(s) phRenderPages(s); };
const _renderStudyPh=renderStudy;
renderStudy=function(){ _renderStudyPh.apply(this,arguments); phImportBtn(); };
function phImportBtn(){ const g=$('#myNew'); if(!g||$('#myImport')) return; g.parentNode.insertAdjacentHTML('afterend','<button class="btn full" id="myImport" style="margin-bottom:12px">Bring In Old Sermons and Services</button>'); $('#myImport').onclick=phImportSheet; }
document.addEventListener('click',e=>{ if(e.target.closest&&e.target.closest('#stTabs, [data-tab]')) setTimeout(phImportBtn,30); });
(function(){ const del=$('#smDel'), old=del.onclick; del.onclick=function(){ const s=curSermon(), id=s&&s.id; old.call(this); if(id&&!S.sermons.some(x=>x.id===id)) phAll().filter(p=>p.serm===id).forEach(p=>phDelete(p)); }; })();

/* reader verse sheet: tuck a picture here */
function phTuckHere(label){ const r=parseRef(label); phAddKeepsake(r?{ref:refLabel(r.book,r.ch,r.verses)}:{}); }

/* sign-in and start-up */
const _startSessionPh=startSession;
startSession=function(r){ _startSessionPh(r); setTimeout(phSync,2500); };
setTimeout(phSync,4000);
window.addEventListener('online',()=>setTimeout(phSync,1500));
if(/^#(keeps|memorial)/.test(location.hash)) route();
