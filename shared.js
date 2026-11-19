/* ---------- Shared prayer lists (Supabase dw_list_* functions) ---------- */
'use strict';
const SH_KEY=KEY+'.shared';
let SHC; try{ SHC=JSON.parse(localStorage.getItem(SH_KEY)||'null'); }catch(e){ SHC=null; }
if(!SHC||typeof SHC!=='object') SHC={lists:[],items:{},pending:[]};
const SH={mode:'mine',cur:null,tab:'open',q:'',offline:false};
const saveSHC=()=>{ try{ localStorage.setItem(SH_KEY,JSON.stringify(SHC)); }catch(e){} };
const shSigned=()=>!!(SY&&SY.token);
const shToday=()=>{ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const roleName=r=>r==='owner'?'Leader (started it)':r==='manager'?'Leader':'Member';
const isLeader=r=>r==='owner'||r==='manager';
function shLists(){ return SHC.lists||[]; }
function shListName(id){ const l=shLists().find(x=>x.id===id); return l?l.name:'Shared list'; }
function shItems(id){ return (SHC.items[id]&&SHC.items[id].items)||[]; }
function shRole(id){ return (SHC.items[id]&&SHC.items[id].role)||(shLists().find(x=>x.id===id)||{}).role||'member'; }

/* ---- server ---- */
async function shCall(fn,args){
  const r=await rpc(fn,Object.assign({p_token:SY.token},args||{}));
  if(r&&r.error==='signed_out'){ signOutLocal('Your sync sign-in has ended. Please sign in again.'); throw new Error('signed_out'); }
  return r;
}
async function shFlush(){
  if(!shSigned()||!SHC.pending.length) return;
  const keep=[];
  for(const id of SHC.pending){ try{ const r=await shCall('dw_list_pray',{p_item:id}); if(!r.ok&&r.error!=='not_member') keep.push(id); }catch(e){ keep.push(id); } }
  SHC.pending=keep; saveSHC();
}
async function shRefreshLists(){
  if(!shSigned()) return false;
  try{ await shFlush(); const r=await shCall('dw_lists_mine'); if(r.ok){ SHC.lists=r.lists; saveSHC(); SH.offline=false; return true; } }catch(e){ SH.offline=true; }
  return false;
}
async function shRefreshItems(id){
  if(!shSigned()) return false;
  try{ await shFlush(); const r=await shCall('dw_list_items_get',{p_list:id});
    if(r.ok){ SHC.items[id]={role:r.role,items:r.items,at:Date.now()}; saveSHC(); SH.offline=false; return true; }
    if(r.error==='not_member'){ delete SHC.items[id]; SHC.lists=SHC.lists.filter(l=>l.id!==id); saveSHC(); }
  }catch(e){ SH.offline=true; }
  return false;
}
function shPray(listId,it){
  if(it.today) return;
  if(!it.my_last) it.people=(it.people||0)+1;
  it.times=(it.times||0)+1; it.today=true; it.my_last=shToday(); saveSHC();
  shCall('dw_list_pray',{p_item:it.id}).then(r=>{ if(!r.ok) throw 0; }).catch(()=>{ if(!SHC.pending.includes(it.id)){ SHC.pending.push(it.id); saveSHC(); } });
}
/* For the morning devotional: open requests, least recently prayed by me first */
function shPool(listId){
  const name=shListName(listId);
  return shItems(listId).filter(i=>!i.answered).slice().sort((a,b)=>(a.my_last||'').localeCompare(b.my_last||'')||String(a.created).localeCompare(String(b.created)))
    .map(i=>({id:'s'+i.id,text:i.text,cat:name,pray:()=>shPray(listId,i)}));
}

/* ---- Prayer page mode switch ---- */
$('#prMode').onclick=e=>{ const b=e.target.closest('button'); if(!b) return; SH.mode=b.dataset.m; shSyncMode(); if(SH.mode==='shared') renderShared(true); };
function shSyncMode(){
  $$('#prMode button').forEach(b=>b.classList.toggle('on',b.dataset.m===SH.mode));
  $('#prMine').style.display=SH.mode==='mine'?'':'none';
  $('#prShared').style.display=SH.mode==='shared'?'':'none';
}

/* ---- Shared overview ---- */
async function renderShared(refresh){
  const box=$('#prShared'); if(!box) return;
  if(!shSigned()){
    const pend=localStorage.getItem(KEY+'.join')||'';
    box.innerHTML=`<div class="card" style="margin-top:4px"><b class="serif" style="font-size:21px">Pray together</b>
      <p class="serif" style="font-size:18px;margin:8px 0 14px">Shared prayer lists let a church, a class or a team pray together. Everyone on the list sees the same requests, can add their own, and can tap I Prayed so others know they are being prayed for.</p>
      <p class="small muted">${pend?`You have an invitation (code <b>${esc(pend)}</b>). `:''}Shared lists need an account so your name can be shown with your requests.</p>
      <button class="btn red full" id="shSignIn">Sign In or Create an Account</button></div>`;
    $('#shSignIn').onclick=()=>{ go('settings'); setTimeout(()=>{ const b=$('#syncBox'); b&&b.scrollIntoView({block:'center'}); },250); };
    return;
  }
  if(SH.cur){ renderSharedList(SH.cur,refresh); return; }
  const draw=()=>{
    const ls=shLists();
    box.innerHTML=`<p class="small muted" style="margin-top:0">Pray together with your church, class or team. Everyone on a list sees the same requests.</p>
      <div class="grid2" style="margin-bottom:6px"><button class="btn red" id="shNew">Start a Shared List</button><button class="btn" id="shJoin">Join with a Code</button></div>
      ${SH.offline?'<p class="small muted">Offline — showing your saved copy.</p>':''}
      <div id="shLs">${ls.length?ls.map(l=>`<button class="jcard" data-l="${l.id}"><div class="meta">${isLeader(l.role)?`<span class="jtype devo">${l.role==='owner'?'Your list':'Leader'}</span>`:''}${l.members} member${l.members===1?'':'s'} · ${l.open} request${l.open===1?'':'s'}</div>
        <div class="ttl">${esc(l.name)}</div><div class="meta">Started by ${esc(l.owner||'')}</div></button>`).join('')
        :'<div class="empty">You are not on any shared lists yet. Start one for your church or class, or join one with the code someone gave you.</div>'}</div>`;
    $('#shNew').onclick=shNewSheet; $('#shJoin').onclick=()=>shJoinSheet('');
    $$('#shLs [data-l]').forEach(b=>b.onclick=()=>{ SH.cur=+b.dataset.l; SH.tab='open'; SH.q=''; renderShared(true); window.scrollTo(0,0); });
  };
  draw();
  if(refresh){ await shRefreshLists(); if(SH.mode==='shared'&&!SH.cur&&$('#shLs')) draw(); }
}
function shNewSheet(){
  openSheet(`<button class="close" data-x>X</button><h3>Start a Shared List</h3>
    <p class="small muted">Give it a name people will recognize. You will get a code and a link to invite others.</p>
    <label class="lbl">List name</label><input type="text" id="snName" placeholder="e.g. Freewill Baptist Prayer Chain">
    <button class="btn red full" id="snGo" style="margin-top:14px">Create the List</button>`);
  $('#snGo').onclick=async()=>{ const n=$('#snName').value.trim(); if(!n){ toast('Give the list a name'); return; } $('#snGo').disabled=true;
    try{ const r=await shCall('dw_list_create',{p_name:n}); if(!r.ok){ toast(r.error); $('#snGo').disabled=false; return; }
      await shRefreshLists(); SH.cur=r.id; SHC.items[r.id]={role:'owner',items:[],at:Date.now()}; saveSHC(); closeSheet(); renderShared(true); shInviteSheet(r.id); }
    catch(e){ toast('Could not reach the server. Check the connection.'); $('#snGo').disabled=false; } };
}
function shJoinSheet(code){
  openSheet(`<button class="close" data-x>X</button><h3>Join a Shared List</h3>
    <p class="small muted">Enter the six-letter code from the person who invited you.</p>
    <input type="text" id="sjCode" value="${esc(code)}" placeholder="ABC123" autocapitalize="characters" style="font-size:28px;letter-spacing:.3em;text-transform:uppercase;text-align:center">
    <button class="btn red full" id="sjGo" style="margin-top:14px">Join</button>`);
  $('#sjGo').onclick=()=>shDoJoin($('#sjCode').value);
}
async function shDoJoin(code){
  try{ const r=await shCall('dw_list_join',{p_code:code}); if(!r.ok){ toast(r.error); return; }
    localStorage.removeItem(KEY+'.join'); closeSheet(); toast(`You joined ${r.name}`);
    await shRefreshLists(); SH.mode='shared'; SH.cur=r.id; if(location.hash==='#prayer') renderPrayers(); else go('prayer'); shSyncMode(); renderShared(true);
  }catch(e){ toast('Could not reach the server. Check the connection.'); }
}

/* ---- One shared list ---- */
async function renderSharedList(id,refresh){
  const box=$('#prShared');
  const draw=()=>{
    const l=shLists().find(x=>x.id===id)||{name:'Shared list',members:0,owner:''}, role=shRole(id), all=shItems(id);
    const list=all.filter(i=>(SH.tab==='open'?!i.answered:i.answered)&&(!SH.q||(i.text+' '+(i.by||'')).toLowerCase().includes(SH.q)));
    if(SH.tab==='answered') list.sort((a,b)=>String(b.ans_at).localeCompare(String(a.ans_at)));
    const openN=all.filter(i=>!i.answered).length, prayedToday=all.filter(i=>i.today).length;
    box.innerHTML=`<button class="btn sm" id="slBack">&larr; All Shared Lists</button>
      <div class="serif" style="font-size:28px;font-weight:600;margin:16px 0 2px;line-height:1.2">${esc(l.name)}</div>
      <div class="small muted" style="margin-bottom:14px">Started by ${esc(l.owner||'')} · ${l.members} member${l.members===1?'':'s'} · you are ${isLeader(role)?'a leader':'a member'}${prayedToday?` · you prayed for ${prayedToday} today`:''}</div>
      <div class="grid2" style="margin-bottom:10px"><button class="btn red" id="slAdd">Add a Request</button><button class="btn" id="slBulk">Add Several</button></div>
      ${openN?'<button class="btn dark full" id="slPray">Pray Through This List</button>':''}
      <div class="grid2" style="margin:10px 0 14px"><button class="btn" id="slInvite">Invite People</button><button class="btn" id="slPeople">${isLeader(role)?'Members & Settings':'Members'}</button></div>
      ${SH.offline?'<p class="small muted">Offline — showing your saved copy. Prayers you mark will be sent when you reconnect.</p>':''}
      <input type="search" id="slQ" placeholder="Search this list" value="${esc(SH.q)}">
      <div class="tabs" id="slTabs" style="margin-top:12px"><button data-t="open" class="${SH.tab==='open'?'on':''}">Praying (${openN})</button><button data-t="answered" class="${SH.tab==='answered'?'on':''}">Answered (${all.length-openN})</button></div>
      <div id="slList">${list.length?list.map(i=>`<div class="pr-item" data-i="${i.id}"><div class="tx" data-open>${esc(i.text)}
          <span class="cat" style="margin-top:4px;text-transform:none;letter-spacing:0;font-weight:600">${i.answered?`Answered ${i.ans_at?esc(prShort(i.ans_at)):''}`:`Added by ${esc(i.mine?'you':i.by||'someone')}`}${i.people?` · prayed for by ${i.people} ${i.people===1?'person':'people'}`:''}</span>${i.ans_note?`<div class="note">${esc(i.ans_note)}</div>`:''}</div>
          ${i.answered?'':`<button class="btn sm ${i.today?'done':''}" data-pray>${i.today?'Prayed':'I Prayed'}</button>`}</div>`).join('')
        :`<div class="empty">${all.length?(SH.q?'Nothing matches that search.':'Nothing here yet.'):'No requests yet. Tap Add a Request, or Add Several to enter a list of names.'}</div>`}</div>`;
    $('#slBack').onclick=()=>{ SH.cur=null; renderShared(true); };
    $('#slAdd').onclick=()=>shAddSheet(id,false); $('#slBulk').onclick=()=>shAddSheet(id,true);
    if($('#slPray')) $('#slPray').onclick=()=>shPrayThrough(id);
    $('#slInvite').onclick=()=>shInviteSheet(id); $('#slPeople').onclick=()=>shPeopleSheet(id);
    $('#slQ').addEventListener('input',e=>{ SH.q=e.target.value.toLowerCase(); const pos=e.target.selectionStart; draw(); const q=$('#slQ'); q.focus(); try{ q.setSelectionRange(pos,pos); }catch(_){} });
    $$('#slTabs button').forEach(b=>b.onclick=()=>{ SH.tab=b.dataset.t; draw(); });
    $$('#slList [data-pray]').forEach(b=>b.onclick=()=>{ const it=shItems(id).find(x=>x.id===+b.closest('.pr-item').dataset.i); if(!it||it.today) return; shPray(id,it); draw(); });
    $$('#slList [data-open]').forEach(x=>x.onclick=()=>shItemSheet(id,+x.closest('.pr-item').dataset.i));
  };
  if(!SHC.items[id]) box.innerHTML='<div class="loading">Opening the list…</div>'; else draw();
  if(refresh||!SHC.items[id]){ await shRefreshItems(id); await shRefreshLists(); if(SH.cur===id&&SH.mode==='shared') draw(); }
}
function shAddSheet(id,bulk){
  openSheet(`<button class="close" data-x>X</button><h3>${bulk?'Add Several at Once':'Add a Request'}</h3>
    <p class="small muted">${bulk?'One name or request on each line. Everyone on the list will see them.':'Everyone on this list will see it, with your name.'}</p>
    <textarea id="saText" style="min-height:${bulk?220:110}px" placeholder="${bulk?'The Johnson family\nSister Ruth - recovering from surgery':'Who or what should we pray for?'}"></textarea>
    <button class="btn red full" id="saGo" style="margin-top:14px">Add to the List</button>`);
  $('#saGo').onclick=async()=>{
    const raw=$('#saText').value; const texts=bulk?raw.split('\n').map(x=>x.replace(/^[\s\-•*\d.)]+/,'').trim()).filter(Boolean):[raw.trim()].filter(Boolean);
    if(!texts.length){ toast('Write a name or request first'); return; } $('#saGo').disabled=true;
    try{ const r=await shCall('dw_list_add',{p_list:id,p_texts:texts}); if(!r.ok){ toast(r.error==='not_member'?'You are no longer on this list':r.error); $('#saGo').disabled=false; return; }
      closeSheet(); toast(r.added===texts.length?`Added ${r.added}`:`Added ${r.added} (${texts.length-r.added} already on the list)`); renderSharedList(id,true); }
    catch(e){ toast('Could not reach the server. Check the connection.'); $('#saGo').disabled=false; }
  };
}
function shItemSheet(id,itemId){
  const it=shItems(id).find(x=>x.id===itemId); if(!it) return; const can=it.mine||isLeader(shRole(id));
  openSheet(`<button class="close" data-x>X</button><div class="small muted" style="letter-spacing:.14em;text-transform:uppercase;font-weight:700">${esc(shListName(id))}</div>
    ${can?`<label class="lbl">Request</label><textarea id="siText" style="min-height:100px">${esc(it.text)}</textarea>`:`<div class="serif" style="font-size:26px;font-weight:600;margin:10px 0">${esc(it.text)}</div>`}
    <p class="small muted">Added by ${esc(it.mine?'you':it.by||'someone')} on ${esc(prShort(it.created))}${it.people?` · prayed for by ${it.people} ${it.people===1?'person':'people'}, ${it.times} time${it.times===1?'':'s'}`:''}</p>
    ${it.answered?'':`<button class="btn ${it.today?'done':'red'} full" id="siPray">${it.today?'You Prayed Today':'I Prayed'}</button>`}
    ${can?`<button class="btn full" id="siSave" style="margin-top:10px">Save Changes</button><div class="grid2" style="margin-top:10px">${it.answered?'<button class="btn" id="siReopen">Move Back to Praying</button>':'<button class="btn" id="siAns">Mark Answered</button>'}<button class="btn" id="siDel">Delete</button></div>`:''}`);
  const upd=async(args,msg)=>{ try{ const r=await shCall('dw_list_item_update',Object.assign({p_item:itemId,p_text:null,p_answered:null,p_note:null,p_delete:false},args)); if(!r.ok){ toast(r.error); return; } closeSheet(); if(msg) toast(msg); renderSharedList(id,true); }catch(e){ toast('Could not reach the server. Check the connection.'); } };
  if($('#siPray')) $('#siPray').onclick=()=>{ shPray(id,it); closeSheet(); renderSharedList(id,false); };
  if($('#siSave')) $('#siSave').onclick=()=>upd({p_text:$('#siText').value},'Saved');
  if($('#siAns')) $('#siAns').onclick=()=>{ const n=prompt('How was it answered? (optional)')||''; upd({p_answered:true,p_note:n.trim()||null},'Marked answered — praise God'); };
  if($('#siReopen')) $('#siReopen').onclick=()=>upd({p_answered:false},'Moved back to praying');
  if($('#siDel')) $('#siDel').onclick=()=>{ if(confirm('Delete this request for everyone on the list?')) upd({p_delete:true},'Deleted'); };
}
function shInviteSheet(id){
  const l=shLists().find(x=>x.id===id)||{}, leader=isLeader(shRole(id));
  if(!leader||!l.code){ openSheet(`<button class="close" data-x>X</button><h3>Invite People</h3><p class="serif" style="font-size:18px">Ask a leader of this list (${esc(l.owner||'the person who started it')}) for the invitation code or link.</p><button class="btn red full" data-x>OK</button>`); return; }
  const link=`${appBaseUrl()}?join=${l.code}`;
  openSheet(`<button class="close" data-x>X</button><h3>Invite to ${esc(l.name)}</h3>
    <p class="small muted">People open the link or scan the code, sign in to the app, and they are added to the list.</p>
    <div style="text-align:center;font-family:var(--serif);font-size:44px;font-weight:600;letter-spacing:.28em;color:var(--red);margin:6px 0">${esc(l.code)}</div>
    <div class="gc-qr">${qrSvg(link)}</div>
    <input type="text" readonly value="${esc(link)}" id="siLink" style="font-size:14px;margin-top:10px">
    <div class="grid2" style="margin-top:10px"><button class="btn red" id="siShare">Share</button><button class="btn" id="siCopy">Copy Link</button></div>
    <button class="btn full" id="siNew" style="margin-top:10px">Make a New Code</button>
    <p class="small muted">A new code stops the old one from working. People already on the list stay on it.</p>`);
  const msg=`Join our prayer list "${l.name}" in the Daily Word app.\n${link}\nOr enter code ${l.code} under Prayer List → Shared Lists.`;
  $('#siShare').onclick=()=>shareText(`Join ${l.name}`,msg); $('#siCopy').onclick=()=>copyText(link);
  $('#siLink').onclick=()=>$('#siLink').select();
  $('#siNew').onclick=async()=>{ if(!confirm('Make a new code? The old code and link will stop working.')) return;
    try{ const r=await shCall('dw_list_manage',{p_list:id,p_action:'newcode',p_user:null,p_value:null}); if(!r.ok){ toast(r.error); return; } await shRefreshLists(); shInviteSheet(id); toast('New code made'); }catch(e){ toast('Could not reach the server.'); } };
}
async function shPeopleSheet(id){
  const role=shRole(id), l=shLists().find(x=>x.id===id)||{};
  openSheet(`<button class="close" data-x>X</button><h3>${esc(l.name||'Members')}</h3><div id="spList"><div class="loading">Loading…</div></div>`);
  let r; try{ r=await shCall('dw_list_members_get',{p_list:id}); }catch(e){ $('#spList').innerHTML='<div class="empty">Could not reach the server.</div>'; return; }
  if(!r.ok){ $('#spList').innerHTML='<div class="empty">You are not on this list.</div>'; return; }
  const owner=role==='owner';
  $('#spList').innerHTML=`<div class="small muted" style="margin-bottom:8px">${r.members.length} member${r.members.length===1?'':'s'}. Leaders can invite people, edit or remove any request, and remove members.</div>`+
    r.members.map(m=>`<div class="item" data-u="${m.id}" style="padding:12px 14px"><div class="ref" style="color:var(--ink)">${esc(m.name)}${m.me?' (you)':''}</div><div class="small muted">${roleName(m.role)}</div>
      ${!m.me&&m.role!=='owner'&&(owner||(role==='manager'&&m.role==='member'))?`<div class="tools">${owner?(m.role==='manager'?'<button class="btn sm" data-a="member">Remove as Leader</button>':'<button class="btn sm" data-a="manager">Make a Leader</button>'):''}<button class="btn sm" data-a="remove">Remove</button>${owner?'<button class="btn sm" data-a="owner">Hand Over the List</button>':''}</div>`:''}</div>`).join('')+
    (owner?`<h2>List Settings</h2><div class="grid2"><button class="btn" id="spRename">Rename</button><button class="btn" id="spDelete">Delete List</button></div>`
      :`<button class="btn full" id="spLeave" style="margin-top:14px">Leave This List</button>`);
  $$('#spList [data-a]').forEach(b=>b.onclick=async()=>{
    const uid_=+b.closest('.item').dataset.u, name=r.members.find(m=>m.id===uid_).name, a=b.dataset.a;
    const ask={remove:`Remove ${name} from this list?`,owner:`Hand the list over to ${name}? You will stay on as a leader.`}[a];
    if(ask&&!confirm(ask)) return;
    try{ const x=await shCall('dw_list_manage',{p_list:id,p_action:a,p_user:uid_,p_value:null}); if(!x.ok){ toast(x.error); return; } await shRefreshItems(id); await shRefreshLists(); shPeopleSheet(id); renderSharedList(id,false); }catch(e){ toast('Could not reach the server.'); }
  });
  if($('#spRename')) $('#spRename').onclick=async()=>{ const n=(prompt('New name for the list',l.name||'')||'').trim(); if(!n) return;
    try{ const x=await shCall('dw_list_manage',{p_list:id,p_action:'rename',p_user:null,p_value:n}); if(!x.ok){ toast(x.error); return; } await shRefreshLists(); closeSheet(); renderSharedList(id,false); }catch(e){ toast('Could not reach the server.'); } };
  if($('#spDelete')) $('#spDelete').onclick=async()=>{ if(!confirm(`Delete "${l.name}" for everyone? All of its requests will be removed. This cannot be undone.`)) return;
    try{ const x=await shCall('dw_list_manage',{p_list:id,p_action:'delete',p_user:null,p_value:null}); if(!x.ok){ toast(x.error); return; } delete SHC.items[id]; await shRefreshLists(); closeSheet(); SH.cur=null; renderShared(true); toast('List deleted'); }catch(e){ toast('Could not reach the server.'); } };
  if($('#spLeave')) $('#spLeave').onclick=async()=>{ if(!confirm('Leave this list? You can rejoin later with the code.')) return;
    try{ const x=await shCall('dw_list_leave',{p_list:id}); if(!x.ok){ toast(x.error); return; } delete SHC.items[id]; await shRefreshLists(); closeSheet(); SH.cur=null; renderShared(true); toast('You left the list'); }catch(e){ toast('Could not reach the server.'); } };
}
function shPrayThrough(id){
  const queue=shPool(id); if(!queue.length){ toast('Nothing to pray through yet'); return; }
  let i=0, done=0; const name=shListName(id);
  const draw=()=>{
    if(i>=queue.length){ openSheet(`<div class="dv-done"><div class="seal"></div><div class="dv-eyebrow">${esc(name)}</div><h1>Amen.</h1><p class="dv-p">You prayed for ${done} ${done===1?'request':'requests'}.</p></div><button class="btn red full" data-x>Done</button>`); renderSharedList(id,false); return; }
    const q=queue[i], it=shItems(id).find(x=>'s'+x.id===q.id)||{};
    openSheet(`<button class="close" data-x>X</button>
      <div class="small muted" style="text-align:center;letter-spacing:.14em;text-transform:uppercase;font-weight:700">${i+1} of ${queue.length} · ${esc(name)}</div>
      <div class="progress" style="margin:10px 0 22px"><i style="width:${Math.round(100*i/queue.length)}%"></i></div>
      <div style="text-align:center;min-height:180px"><div class="serif" style="font-size:32px;font-weight:600;line-height:1.3;margin:12px 6px">${esc(q.text)}</div>
        <div class="small muted">Added by ${esc(it.mine?'you':it.by||'someone')}${it.people?` · prayed for by ${it.people} ${it.people===1?'person':'people'}`:''}</div></div>
      <div class="grid2" style="margin-top:18px"><button class="btn" id="ptSkip">Skip</button><button class="btn red" id="ptNext">Prayed — Next</button></div>
      <button class="btn full" id="ptStop" style="margin-top:10px">Finish for Now</button>`);
    $('#ptNext').onclick=()=>{ q.pray(); done++; i++; draw(); };
    $('#ptSkip').onclick=()=>{ i++; draw(); };
    $('#ptStop').onclick=()=>{ i=queue.length; draw(); };
  };
  draw();
}

/* ---- Invitation links (?join=CODE) and background refresh ---- */
(function(){
  const code=URLP.get('join');
  if(code){ localStorage.setItem(KEY+'.join',code.toUpperCase().replace(/[^A-Z0-9]/g,'')); try{ history.replaceState(null,'',location.pathname+location.hash); }catch(e){} }
})();
function shCheckJoin(){
  const code=localStorage.getItem(KEY+'.join'); if(!code) return;
  if(!shSigned()){ SH.mode='shared'; return; }
  shJoinSheet(code);
}
setTimeout(()=>{ shCheckJoin();
  if(shSigned()){ shRefreshLists().then(()=>{ const g=S.settings.devoGroup||''; if(g.startsWith('shared:')) shRefreshItems(+g.slice(7)); }); } },1800);
const _startSession=startSession;
startSession=function(r){ _startSession(r); setTimeout(()=>{ shRefreshLists(); shCheckJoin(); },1500); };
