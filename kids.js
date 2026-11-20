/* ---------- Children's Bible: storybook with original illustrations ---------- */
'use strict';

/* ===== Illustration kit (all drawn in SVG, original artwork) ===== */
let KG=0; const kid=()=>'kg'+(++KG);
let kSeed=1; const krand=()=>{ kSeed=(kSeed*9301+49297)%233280; return kSeed/233280; };
const ART=inner=>`<svg viewBox="0 0 400 280" class="kart" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
const sky=(a,b)=>{ const id=kid(); return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="280" fill="url(#${id})"/>`; };
const glow=(x,y,r,c,o=.8)=>{ const id=kid(); return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${o}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id})"/>`; };
const sun=(x,y,r=24)=>`${glow(x,y,r*2.6,'#fff2b8',.9)}<circle cx="${x}" cy="${y}" r="${r}" fill="#f7c948"/>`;
const moon=(x,y,r,bg)=>`${glow(x,y,r*2.4,'#fff6d8',.35)}<circle cx="${x}" cy="${y}" r="${r}" fill="#f6edcf"/><circle cx="${x+r*.45}" cy="${y-r*.25}" r="${r*.85}" fill="${bg}"/>`;
const stars=(n,seed,ymax=170,x0=0,x1=400)=>{ kSeed=seed; let h=''; for(let i=0;i<n;i++){ const x=x0+krand()*(x1-x0), y=krand()*ymax, r=.8+krand()*1.8; h+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#fff8d8" opacity="${(.6+krand()*.4).toFixed(2)}"/>`; } return h; };
const cloud=(x,y,s=1,c='#ffffff',o=1)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="${c}" opacity="${o}"><circle cx="0" cy="0" r="16"/><circle cx="20" cy="-10" r="21"/><circle cx="42" cy="-2" r="17"/><circle cx="58" cy="6" r="11"/><rect x="-10" y="0" width="72" height="16" rx="8"/></g>`;
const hills=(y,c1,c2)=>`<path d="M0 ${y} C70 ${y-46} 150 ${y-38} 220 ${y-10} S350 ${y-44} 400 ${y-18} V280 H0Z" fill="${c1}"/><path d="M0 ${y+30} C90 ${y} 170 ${y+8} 250 ${y+26} S360 ${y+6} 400 ${y+18} V280 H0Z" fill="${c2}"/>`;
const ground=(y,c)=>`<rect x="0" y="${y}" width="400" height="${280-y}" fill="${c}"/>`;
const wave=(y,c,amp=6,len=40,ph=0)=>{ let d=`M0 ${y}`; for(let x=0;x<=400+len;x+=len) d+=` Q${x+len/4+ph} ${y-amp} ${x+len/2+ph} ${y} T${x+len+ph} ${y}`; return `<path d="${d} V280 H0Z" fill="${c}"/>`; };
const sea=(y,c1,c2)=>wave(y,c1,5,46,0)+wave(y+14,c2,5,38,12);
const tree=(x,y,s=1,c='#5f9e5a')=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-34" width="8" height="34" fill="#8a5a36"/><circle cx="0" cy="-48" r="20" fill="${c}"/><circle cx="-14" cy="-38" r="14" fill="${c}"/><circle cx="14" cy="-38" r="14" fill="${c}"/><circle cx="-6" cy="-54" r="9" fill="#ffffff" opacity=".12"/></g>`;
const fruitTree=(x,y,s=1)=>tree(x,y,s,'#4f9150')+`<g transform="translate(${x} ${y}) scale(${s})" fill="#e2533f"><circle cx="-10" cy="-44" r="3.4"/><circle cx="9" cy="-52" r="3.4"/><circle cx="14" cy="-36" r="3.4"/><circle cx="-2" cy="-36" r="3.4"/></g>`;
const palm=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-3 0 Q-8 -40 4 -78 L9 -77 Q0 -40 5 0Z" fill="#8a5f3a"/><g fill="#4f9150"><path d="M6 -78 Q-20 -92 -42 -74 Q-18 -80 6 -74Z"/><path d="M6 -78 Q30 -96 52 -78 Q28 -82 6 -74Z"/><path d="M6 -78 Q-6 -104 -26 -104 Q-6 -94 4 -76Z"/><path d="M6 -78 Q22 -106 40 -100 Q20 -92 8 -76Z"/></g></g>`;
const bush=(x,y,s=1,c='#4f8f4e')=>`<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><circle cx="-18" cy="-10" r="14"/><circle cx="0" cy="-18" r="18"/><circle cx="18" cy="-10" r="14"/><rect x="-30" y="-10" width="60" height="10"/></g>`;
const flowers=(n,seed,y0,y1)=>{ kSeed=seed; let h=''; const cs=['#f2c14e','#e26d5c','#f6f0e4','#c58fd0','#f49ac1']; for(let i=0;i<n;i++){ const x=krand()*400, y=y0+krand()*(y1-y0), c=cs[Math.floor(krand()*cs.length)]; h+=`<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><path d="M0 0 V-7" stroke="#3f7a3f" stroke-width="1.4"/><circle cx="0" cy="-8" r="3" fill="${c}"/><circle cx="0" cy="-8" r="1.1" fill="#f7d774"/></g>`; } return h; };
const rainbow=(cx,cy,r)=>['#e05a4f','#f08a3c','#f5c84b','#6dbb5e','#4f95d6','#7a62c9'].map((c,i)=>`<path d="M${cx-r+i*9} ${cy} A${r-i*9} ${r-i*9} 0 0 1 ${cx+r-i*9} ${cy}" stroke="${c}" stroke-width="9" fill="none" opacity=".9"/>`).join('');
const rain=(n,seed,c='#cfe3f2')=>{ kSeed=seed; let h=`<g stroke="${c}" stroke-width="2" stroke-linecap="round" opacity=".75">`; for(let i=0;i<n;i++){ const x=krand()*420-10, y=krand()*260; h+=`<path d="M${x.toFixed(0)} ${y.toFixed(0)} l-5 14"/>`; } return h+'</g>'; };
const bolt=(x,y,s=1)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0 0 L-12 30 L-2 30 L-10 58 L14 22 L3 22 L12 0Z" fill="#ffe27a"/>`;
const stonesPile=(x,y)=>`<g transform="translate(${x} ${y})" fill="#a8a39a" stroke="#7d786f" stroke-width="1"><ellipse cx="0" cy="0" rx="7" ry="5"/><ellipse cx="15" cy="2" rx="6" ry="4.5"/><ellipse cx="29" cy="0" rx="7" ry="5"/><ellipse cx="8" cy="-7" rx="6" ry="4.5"/><ellipse cx="22" cy="-7" rx="6" ry="4.5"/></g>`;
const bigStar=(x,y,r)=>{ let d=''; for(let i=0;i<16;i++){ const a=Math.PI*i/8-Math.PI/2, rr=i%2?r*.32:(i%4?r*.62:r); d+=`${i?'L':'M'}${(x+Math.cos(a)*rr).toFixed(1)} ${(y+Math.sin(a)*rr).toFixed(1)} `; } return glow(x,y,r*3,'#fff3c4',.75)+`<path d="${d}Z" fill="#fff4c8"/>`; };
const house=(x,y,w,h,c,dome)=>`<g transform="translate(${x} ${y})"><rect x="0" y="${-h}" width="${w}" height="${h}" fill="${c}"/>${dome?`<path d="M${w*.2} ${-h} A${w*.3} ${w*.3} 0 0 1 ${w*.8} ${-h}Z" fill="${c}"/>`:`<rect x="-2" y="${-h-4}" width="${w+4}" height="4" fill="rgba(0,0,0,.12)"/>`}<rect x="${w*.4}" y="${-h*.45}" width="${w*.2}" height="${h*.45}" fill="rgba(60,40,25,.55)"/><rect x="${w*.15}" y="${-h*.8}" width="${w*.16}" height="${w*.16}" fill="${dome==='night'?'#ffd56b':'rgba(60,40,25,.45)'}"/></g>`;
const town=(y,night)=>{ const cs=night?['#5a4e6e','#4d4361','#62567a']:['#e6cfa6','#d9bd8f','#ecd9b6']; const f=night?'night':0; return house(250,y,34,30,cs[0],f||1)+house(280,y-6,28,40,cs[1],f)+house(304,y,38,26,cs[2],f||1)+house(338,y-4,26,34,cs[0],f)+house(360,y,30,24,cs[1],f||1); };

/* People: feet at (x,y); o = {robe,sash,skin,hair,cover,beard,arms,face,kneel,crown,helmet,scale} */
const SK=['#f0c39b','#d9a27a','#b97e56','#8f5b3c'];
function person(x,y,s,o){
  o=Object.assign({robe:'#7d9cc4',sash:'#e2b24a',skin:SK[1],hair:'#4a3221',arms:'down',face:'smile'},o);
  const k=o.kneel?12:0, R=o.robe, sk=o.skin;
  const arm=(fx,fy,tx,ty)=>`<path d="M${fx} ${fy+k} L${tx} ${ty+k}" stroke="${R}" stroke-width="8" stroke-linecap="round"/><path d="M${fx} ${fy+k} L${tx} ${ty+k}" stroke="#000" stroke-opacity=".08" stroke-width="8" stroke-linecap="round"/><circle cx="${tx}" cy="${ty+k}" r="3.8" fill="${sk}"/>`;
  const P={down:[[-18,-24],[18,-24]],up:[[-25,-77],[25,-77]],out:[[-31,-52],[31,-52]],pray:[[-3,-38],[3,-38]],wave:[[-18,-24],[26,-74]],point:[[-18,-24],[33,-58]],hold:[[-8,-32],[8,-32]],staff:[[-18,-24],[18,-36]],sling:[[-18,-24],[20,-82]],hammer:[[-18,-26],[24,-72]],cheer:[[-25,-77],[25,-77]]}[o.arms]||[[-18,-24],[18,-24]];
  let h=`<g transform="translate(${x} ${y}) scale(${s})${o.flip?' scale(-1 1)':''}${o.rot?` rotate(${o.rot})`:''}">`;
  if(o.wings) h+=`<path d="M-6 ${-46+k} Q-52 ${-78+k} -44 ${-16+k} Q-28 ${-32+k} -6 ${-28+k}Z" fill="#fffaf0" stroke="#e9c86a" stroke-width="1.5"/><path d="M6 ${-46+k} Q52 ${-78+k} 44 ${-16+k} Q28 ${-32+k} 6 ${-28+k}Z" fill="#fffaf0" stroke="#e9c86a" stroke-width="1.5"/>`;
  if(o.staff) h+=`<path d="M19 -86 Q30 -92 28 -80 M19 -86 V0" stroke="#7b5232" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  h+=o.kneel?`<path d="M-21 0 L-11 -38 Q0 -44 11 -38 L23 0Z" fill="${R}"/>`:`<path d="M-17 0 L-11 -50 Q0 -56 11 -50 L17 0Z" fill="${R}"/>`;
  h+=`<path d="M-17 0 L17 0 L16 -4 L-16 -4Z" fill="#000" opacity=".1"/>`;
  if(!o.kneel) h+=`<ellipse cx="-7" cy="1" rx="5.5" ry="2.6" fill="#6b4a2f"/><ellipse cx="7" cy="1" rx="5.5" ry="2.6" fill="#6b4a2f"/>`;
  if(o.armor) h+=`<path d="M-12 ${-49+k} Q0 ${-55+k} 12 ${-49+k} L13 ${-24+k} L-13 ${-24+k}Z" fill="#a9adb3"/><path d="M-13 ${-24+k} L13 ${-24+k} L14 ${-14+k} L-14 ${-14+k}Z" fill="#8d9096"/>`;
  h+=`<rect x="-12.5" y="${-31+k}" width="25" height="5" fill="${o.sash}"/>`;
  if(o.cover) h+=`<path d="M-13 ${-60+k} Q-15 ${-80+k} 0 ${-80+k} Q15 ${-80+k} 13 ${-60+k} L16 ${-46+k} L-16 ${-46+k}Z" fill="${o.cover}"/>`;
  if(o.longHair) h+=`<path d="M-11 ${-66+k} Q-15 ${-50+k} -8 ${-46+k} L-6 ${-60+k}Z M11 ${-66+k} Q15 ${-50+k} 8 ${-46+k} L6 ${-60+k}Z" fill="${o.hair}"/>`;
  h+=arm(-11,-48,P[0][0],P[0][1])+arm(11,-48,P[1][0],P[1][1]);
  if(o.arms==='hammer') h+=`<g transform="translate(24 ${-72+k}) rotate(-30)"><rect x="-1.5" y="-14" width="3" height="16" fill="#7b5232"/><rect x="-6" y="-18" width="12" height="6" fill="#6f7378"/></g>`;
  if(o.arms==='sling') h+=`<path d="M20 ${-82+k} Q34 ${-104+k} 46 ${-88+k}" stroke="#7b5232" stroke-width="1.6" fill="none"/><circle cx="46" cy="${-88+k}" r="3.5" fill="#a8a39a"/>`;
  h+=`<circle cx="0" cy="${-64+k}" r="11" fill="${sk}"/>`;
  if(o.cover) h+=`<path d="M-12 ${-65+k} Q-12 ${-79+k} 0 ${-79+k} Q12 ${-79+k} 12 ${-65+k} Q6 ${-72+k} 0 ${-72+k} Q-6 ${-72+k} -12 ${-65+k}Z" fill="${o.cover}"/>${o.band?`<rect x="-12" y="${-71+k}" width="24" height="3" fill="${o.band}"/>`:''}`;
  else if(o.helmet) h+=`<path d="M-12.5 ${-64+k} Q-12 ${-80+k} 0 ${-80+k} Q12 ${-80+k} 12.5 ${-64+k}Z" fill="#9aa0a6"/><path d="M-3 ${-80+k} Q0 ${-92+k} 3 ${-80+k}Z" fill="${o.plume||'#b23a3a'}"/>`;
  else h+=`<path d="M-11 ${-65+k} Q-11 ${-77+k} 0 ${-77+k} Q11 ${-77+k} 11 ${-65+k} Q6 ${-71+k} 0 ${-71+k} Q-6 ${-71+k} -11 ${-65+k}Z" fill="${o.hair}"/>`;
  if(o.beard) h+=`<path d="M-10 ${-62+k} Q-8 ${-47+k} 0 ${-46+k} Q8 ${-47+k} 10 ${-62+k} Q4 ${-56+k} 0 ${-57+k} Q-4 ${-56+k} -10 ${-62+k}Z" fill="${o.beard}"/>`;
  const e=-66+k, ink='#3a2a20';
  if(o.face==='sleep') h+=`<path d="M-6 ${e} q2 2 4 0 M2 ${e} q2 2 4 0" stroke="${ink}" stroke-width="1.2" fill="none"/>`;
  else if(o.face==='scared') h+=`<circle cx="-4" cy="${e}" r="2.2" fill="#fff"/><circle cx="4" cy="${e}" r="2.2" fill="#fff"/><circle cx="-4" cy="${e}" r="1.1" fill="${ink}"/><circle cx="4" cy="${e}" r="1.1" fill="${ink}"/>${o.beard?'':`<ellipse cx="0" cy="${e+6}" rx="1.8" ry="2.2" fill="${ink}"/>`}`;
  else if(o.face==='frown') h+=`<path d="M-7 ${e-4} L-2 ${e-2} M7 ${e-4} L2 ${e-2}" stroke="${ink}" stroke-width="1.6"/><circle cx="-4" cy="${e}" r="1.4" fill="${ink}"/><circle cx="4" cy="${e}" r="1.4" fill="${ink}"/>${o.beard?'':`<path d="M-3.5 ${e+6} Q0 ${e+4} 3.5 ${e+6}" stroke="${ink}" stroke-width="1.2" fill="none"/>`}`;
  else if(o.face==='wow') h+=`<circle cx="-4" cy="${e}" r="1.5" fill="${ink}"/><circle cx="4" cy="${e}" r="1.5" fill="${ink}"/><ellipse cx="0" cy="${e+6}" rx="2.2" ry="2.6" fill="${ink}" opacity="${o.beard?0:1}"/>`;
  else h+=`<circle cx="-4" cy="${e}" r="1.4" fill="${ink}"/><circle cx="4" cy="${e}" r="1.4" fill="${ink}"/>${o.beard?'':`<path d="M-3.5 ${e+4.5} Q0 ${e+7} 3.5 ${e+4.5}" stroke="${ink}" stroke-width="1.2" fill="none"/>`}<circle cx="-7.5" cy="${e+3.5}" r="2.2" fill="#e88a7a" opacity=".35"/><circle cx="7.5" cy="${e+3.5}" r="2.2" fill="#e88a7a" opacity=".35"/>`;
  if(o.crown) h+=`<path d="M-9 ${-74+k} L-9 ${-82+k} L-4.5 ${-77+k} L0 ${-84+k} L4.5 ${-77+k} L9 ${-82+k} L9 ${-74+k}Z" fill="#f2c14e"/>`;
  return h+'</g>';
}
const angel=(x,y,s,arms='up')=>glow(x,y-40*s,70*s,'#fff6d6',.85)+person(x,y,s,{robe:'#fffaf0',sash:'#f0cf6b',hair:'#e8c068',skin:SK[0],arms,wings:1,longHair:1});
const baby=(x,y,s=1,sk=SK[1])=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="2" cy="0" rx="15" ry="7.5" fill="#f6efdf" stroke="#e0d3b8"/><circle cx="-12" cy="-3" r="6.5" fill="${sk}"/><path d="M-15 -3 q1.5 1.5 3 0 M-11 -3 q1.5 1.5 3 0" stroke="#3a2a20" stroke-width=".9" fill="none"/></g>`;

/* Animals: feet at (x,y) */
const sheep=(x,y,s=1,f)=>`<g transform="translate(${x} ${y}) scale(${f?-s:s} ${s})"><g fill="#3d3530"><rect x="-11" y="-8" width="3.5" height="8"/><rect x="-4" y="-8" width="3.5" height="8"/><rect x="4" y="-8" width="3.5" height="8"/><rect x="10" y="-8" width="3.5" height="8"/></g><g fill="#fbf8f0"><circle cx="-10" cy="-16" r="9"/><circle cx="0" cy="-20" r="10"/><circle cx="10" cy="-16" r="9"/><circle cx="0" cy="-12" r="9"/><circle cx="-3" cy="-14" r="10"/></g><ellipse cx="17" cy="-20" rx="6.5" ry="5.5" fill="#3d3530"/><ellipse cx="13" cy="-24" rx="3.5" ry="2" fill="#3d3530"/><circle cx="19" cy="-21" r="1" fill="#fff"/></g>`;
const lion=(x,y,s=1,f)=>`<g transform="translate(${x} ${y}) scale(${f?-s:s} ${s})"><g fill="#d09a3e"><rect x="-17" y="-12" width="6" height="12"/><rect x="-7" y="-12" width="6" height="12"/><rect x="5" y="-12" width="6" height="12"/><rect x="14" y="-12" width="6" height="12"/></g><path d="M-22 -18 Q-36 -22 -34 -36" stroke="#d09a3e" stroke-width="3" fill="none"/><circle cx="-34" cy="-37" r="3.5" fill="#a8612a"/><ellipse cx="0" cy="-19" rx="23" ry="12" fill="#e0aa4c"/><circle cx="21" cy="-27" r="14" fill="#b9662a"/><circle cx="22" cy="-27" r="9" fill="#e7b45b"/><circle cx="19" cy="-29" r="1.3" fill="#3a2a20"/><circle cx="25" cy="-29" r="1.3" fill="#3a2a20"/><path d="M20 -24 h4 l-2 2z" fill="#6b3d22"/></g>`;
const elephant=(x,y,s=1,f)=>`<g transform="translate(${x} ${y}) scale(${f?-s:s} ${s})"><g fill="#8e98a1"><rect x="-22" y="-16" width="10" height="16"/><rect x="-8" y="-16" width="10" height="16"/><rect x="6" y="-16" width="10" height="16"/><rect x="18" y="-16" width="10" height="16"/></g><ellipse cx="2" cy="-30" rx="30" ry="20" fill="#9aa4ad"/><path d="M-27 -30 q-8 4 -6 12" stroke="#8e98a1" stroke-width="2.5" fill="none"/><circle cx="30" cy="-36" r="14" fill="#9aa4ad"/><path d="M40 -32 Q48 -16 42 -4" stroke="#9aa4ad" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="23" cy="-35" rx="9" ry="12" fill="#8a949c"/><circle cx="34" cy="-40" r="1.4" fill="#2f2f2f"/><path d="M37 -29 l8 3" stroke="#fffaf0" stroke-width="2.5" stroke-linecap="round"/></g>`;
const giraffe=(x,y,s=1,f)=>`<g transform="translate(${x} ${y}) scale(${f?-s:s} ${s})"><g fill="#e3b04f"><rect x="-16" y="-40" width="5" height="40"/><rect x="-7" y="-40" width="5" height="40"/><rect x="6" y="-40" width="5" height="40"/><rect x="14" y="-40" width="5" height="40"/></g><ellipse cx="2" cy="-46" rx="22" ry="11" fill="#eec05a"/><path d="M12 -52 L28 -98 L36 -96 L24 -46Z" fill="#eec05a"/><ellipse cx="36" cy="-101" rx="10" ry="6" fill="#eec05a"/><path d="M31 -106 v-6 M37 -107 v-6" stroke="#a8682a" stroke-width="2.4" stroke-linecap="round"/><circle cx="37" cy="-103" r="1.3" fill="#3a2a20"/><g fill="#c9822f"><circle cx="-8" cy="-48" r="3.5"/><circle cx="4" cy="-44" r="3"/><circle cx="12" cy="-50" r="2.6"/><circle cx="-14" cy="-43" r="2.4"/><circle cx="22" cy="-64" r="2.6"/><circle cx="27" cy="-80" r="2.4"/></g></g>`;
const rabbit=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="#cdbfae"><ellipse cx="0" cy="-8" rx="10" ry="8"/><circle cx="9" cy="-14" r="6"/><ellipse cx="7" cy="-25" rx="2.2" ry="7"/><ellipse cx="11" cy="-25" rx="2.2" ry="7"/><circle cx="-9" cy="-9" r="3" fill="#fff"/><circle cx="11" cy="-15" r="1" fill="#3a2a20"/></g>`;
const dove=(x,y,s=1,leaf)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-20 2 L-30 -4 L-28 6Z" fill="#f4f1ea"/><ellipse cx="0" cy="0" rx="20" ry="9" fill="#fbfaf6"/><circle cx="18" cy="-5" r="7" fill="#fbfaf6"/><path d="M24 -5 l7 1.5 -7 1.5z" fill="#e59a3c"/><circle cx="20" cy="-6.5" r="1.1" fill="#3a2a20"/><path d="M-6 -4 Q-2 -30 12 -26 Q6 -10 8 -2Z" fill="#ffffff" stroke="#e2ddd2"/>${leaf?`<path d="M30 -3 q8 -8 16 -3 q-8 6 -16 3z" fill="#6aa84f"/><path d="M30 -3 l16 -3" stroke="#3f7a3f" stroke-width=".8"/>`:''}</g>`;
const bird=(x,y,s=1,c='#4a4a4a')=>`<path transform="translate(${x} ${y}) scale(${s})" d="M-10 0 Q-5 -7 0 0 Q5 -7 10 0" stroke="${c}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
const songbird=(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="9" ry="6" fill="${c}"/><circle cx="8" cy="-4" r="4.5" fill="${c}"/><path d="M12 -4 l4 1 -4 1z" fill="#e59a3c"/><path d="M-8 -1 l-7 -4 1 7z" fill="${c}"/><path d="M-3 -2 Q2 -10 6 -2" fill="#fff" opacity=".35"/><circle cx="9" cy="-5" r=".9" fill="#222"/></g>`;
const fish=(x,y,s=1,c='#f08a3c',f)=>`<g transform="translate(${x} ${y}) scale(${f?-s:s} ${s})"><path d="M-14 0 L-24 -8 L-24 8Z" fill="${c}"/><ellipse cx="0" cy="0" rx="15" ry="8" fill="${c}"/><circle cx="8" cy="-2" r="1.6" fill="#1d2b3a"/><path d="M-2 -7 Q2 0 -2 7" stroke="#fff" stroke-opacity=".4" fill="none"/></g>`;
const donkey=(x,y,s=1,f)=>`<g transform="translate(${x} ${y}) scale(${f?-s:s} ${s})"><g fill="#7f6d5d"><rect x="-18" y="-16" width="5" height="16"/><rect x="-9" y="-16" width="5" height="16"/><rect x="8" y="-16" width="5" height="16"/><rect x="16" y="-16" width="5" height="16"/></g><path d="M-22 -24 q-8 2 -8 12" stroke="#7f6d5d" stroke-width="2.5" fill="none"/><ellipse cx="0" cy="-26" rx="24" ry="12" fill="#8d7b6a"/><path d="M18 -32 L30 -50 L38 -46 L28 -26Z" fill="#8d7b6a"/><ellipse cx="38" cy="-46" rx="9" ry="6" fill="#8d7b6a"/><ellipse cx="44" cy="-44" rx="4" ry="3.5" fill="#bfae9c"/><path d="M30 -51 l-4 -14 4 1 3 12z M35 -51 l0 -14 4 2 -1 12z" fill="#7f6d5d"/><circle cx="37" cy="-48" r="1.2" fill="#2f2620"/></g>`;
const camelRider=(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><rect x="-16" y="-26" width="4" height="26"/><rect x="-6" y="-26" width="4" height="26"/><rect x="8" y="-26" width="4" height="26"/><rect x="16" y="-26" width="4" height="26"/><path d="M-22 -28 Q-20 -46 -6 -44 Q0 -60 10 -46 Q18 -44 22 -34 L22 -26 L-22 -26Z"/><path d="M18 -36 Q30 -44 30 -60 L36 -62 Q40 -56 34 -52 Q34 -40 24 -28Z"/><path d="M-4 -52 L-8 -74 Q0 -82 8 -74 L4 -52Z"/><circle cx="0" cy="-80" r="6"/><path d="M-6 -84 L0 -92 L6 -84Z"/></g>`;

/* Things */
const ark=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-96 -32 L96 -32 L76 0 L-76 0Z" fill="#9a6a3c"/><path d="M-90 -22 L90 -22 M-84 -12 L84 -12" stroke="#7b5230" stroke-width="2"/><rect x="-54" y="-64" width="108" height="32" fill="#b8834e"/><path d="M-62 -64 L0 -88 L62 -64Z" fill="#7b4f2b"/><g fill="#ffd56b"><rect x="-42" y="-56" width="14" height="10"/><rect x="-14" y="-56" width="14" height="10"/><rect x="14" y="-56" width="14" height="10"/></g><rect x="34" y="-58" width="12" height="26" fill="#6b4426"/></g>`;
const boat=(x,y,s=1,tilt=0,sail=true)=>`<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${s})"><path d="M-62 -18 L62 -18 L46 0 L-46 0Z" fill="#8a5a33"/><path d="M-58 -12 H58" stroke="#6b4426" stroke-width="2"/>${sail?`<path d="M0 -18 V-92" stroke="#6b4426" stroke-width="3"/><path d="M3 -88 Q36 -60 40 -24 L3 -24Z" fill="#efe6d2"/>`:''}</g>`;
const stable=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-90" y="-96" width="180" height="96" fill="#5e432a"/><rect x="-90" y="-96" width="180" height="96" fill="url(#none)"/><path d="M-104 -92 L0 -132 L104 -92 L96 -86 L0 -122 L-96 -86Z" fill="#c9a25a"/><path d="M-100 -90 L0 -128 L100 -90" stroke="#9c7a3e" stroke-width="3" fill="none"/><rect x="-92" y="-96" width="7" height="96" fill="#8a5f3a"/><rect x="85" y="-96" width="7" height="96" fill="#8a5f3a"/><path d="M-90 0 Q-40 -10 0 -4 Q40 -10 90 0Z" fill="#e2c46b"/></g>`;
const manger=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-26 0 L-16 -20 M26 0 L16 -20 M-26 -20 L-16 0 M26 -20 L16 0" stroke="#7b5232" stroke-width="3"/><path d="M-30 -32 L30 -32 L22 -16 L-22 -16Z" fill="#9a6a3c"/><path d="M-28 -32 Q-14 -40 0 -34 Q14 -40 28 -32" stroke="#e8c96d" stroke-width="4" fill="none"/>${baby(2,-36,1.05)}</g>`;
const soldier=(x,y,s,f,face='scared')=>person(x,y,s,{robe:'#8c5a4a',sash:'#5c3b30',skin:SK[1+Math.round(x)%3],helmet:1,plume:'#c9a25a',arms:'hold',face,flip:f})+`<ellipse cx="${x+(f?-8:8)*s}" cy="${y-30*s}" rx="${10*s}" ry="${14*s}" fill="#b08d3c" stroke="#7d6328" stroke-width="${1.5*s}"/>`;

/* Recurring characters */
const NOAH={robe:'#8c6a4a',sash:'#d8b46a',skin:SK[1],hair:'#f2efe8',beard:'#f2efe8'};
const MARY={robe:'#5f86b8',sash:'#f2e3c0',skin:SK[1],cover:'#a9c4e0',longHair:1,hair:'#4a3221'};
const JOSEPH={robe:'#9a7650',sash:'#5e8a5a',skin:SK[2],cover:'#d7c08f',band:'#5e8a5a',beard:'#4a3221',hair:'#4a3221'};
const DAVID={robe:'#c9783a',sash:'#7b4f2b',skin:SK[1],hair:'#8a4b22'};
const JESUS={robe:'#f5efe2',sash:'#a8142c',skin:SK[2],hair:'#4a3221',beard:'#4a3221',longHair:1};
const DISC=[{robe:'#6f8fb5',sash:'#c9a25a',skin:SK[2],hair:'#2f2018',beard:'#2f2018'},{robe:'#8aa06a',sash:'#7b4f2b',skin:SK[1],hair:'#6a4428',beard:'#6a4428'},{robe:'#b56f5a',sash:'#e2b24a',skin:SK[3],hair:'#1f1510',beard:'#1f1510'},{robe:'#9b88b8',sash:'#f2e3c0',skin:SK[0],hair:'#a86a3a'}];

/* ===== The stories ===== */
const KSTORIES=[
 {id:'creation',title:'In the Beginning',sub:'God Made Everything',ref:'Genesis 1–2',cover:5,
  verse:{t:'In the beginning God created the heaven and the earth.',r:'Genesis 1:1'},
  qs:['What was your favorite thing that God made?','Who made you?','What can you thank God for today?'],
  prayer:'Dear God, thank You for making the whole world, and thank You for making me. Help me take care of everything You made. In Jesus’ name, Amen.',
  pages:[
   {x:'In the very beginning, there was nothing at all. No sun. No trees. No animals. No people. Only God was there, and God had a wonderful plan.',a:()=>ART(sky('#0f1430','#232a52')+stars(40,3,280))},
   {x:'God said, “Let there be light!” And just like that, there was light! God called the light Day, and He called the darkness Night.',a:()=>ART(sky('#141a3c','#2c3366')+stars(20,7,280)+glow(200,140,190,'#fff1b8',1)+glow(200,140,90,'#ffffff',.9))},
   {x:'Next God made the big blue sky way up high, and the deep waters down below. Fluffy clouds floated across the sky.',a:()=>ART(sky('#8fd0ee','#d9f0f8')+cloud(40,70,1.1)+cloud(250,50,1.3)+cloud(160,120,.8,'#fff',.85)+sea(190,'#4f9fcc','#3d86b5'))},
   {x:'Then God gathered the waters together, and dry land appeared. God made grass, flowers and trees full of fruit. Everything began to grow!',a:()=>ART(sky('#9fd8f0','#e6f5fa')+cloud(290,56,.9)+hills(180,'#8cc47a','#6cad62')+fruitTree(80,214,1.2)+tree(330,206,1)+bush(220,232,.8)+flowers(30,11,222,276)+wave(258,'#4f9fcc',4,40))},
   {x:'God put the bright sun in the sky to shine in the day. He made the moon and the twinkling stars to glow at night. He even knows every star by name!',a:()=>ART(`<rect width="200" height="280" fill="#a9dcf2"/><rect x="200" width="200" height="280" fill="#1d2550"/>`+sun(100,96,32)+moon(300,92,26,'#1d2550')+stars(28,5,200,206,400)+hills(222,'#7ab86c','#5f9e5a'))},
   {x:'God filled the waters with fish, big and small. He filled the sky with birds that sing and fly. Splash! Tweet! Swoosh!',a:()=>ART(sky('#a6dcf2','#e3f4fa')+cloud(36,56,.8)+songbird(110,80,1.6,'#e2533f')+songbird(170,60,1.3,'#f2c14e')+bird(260,50,1.4)+bird(300,70,1)+bird(330,40,1.2)+wave(150,'#5aaad4',6,50)+fish(90,200,1.3,'#f08a3c')+fish(220,180,1.1,'#f2c14e',1)+fish(310,226,1.5,'#e26d5c')+fish(160,246,.9,'#9fd06a',1)+`<path d="M40 280 q6 -30 0 -50 M48 280 q-6 -24 4 -40" stroke="#3f8a5a" stroke-width="4" fill="none"/>`)},
   {x:'Then God made all the animals. Lions that roar, elephants that stomp, tall giraffes, fluffy sheep and hoppy rabbits. God made every one of them!',a:()=>ART(sky('#a9dcf2','#eef7f0')+sun(340,60,22)+hills(170,'#9dcd7c','#7ab86c')+palm(36,236,1)+giraffe(300,236,1.1)+elephant(150,240,1.05)+lion(60,250,.9)+sheep(240,252,1.1,1)+rabbit(352,258,1)+flowers(14,21,248,276))},
   {x:'Last of all, God made the first man and woman, Adam and Eve. God made people to know Him and love Him. God looked at everything He had made, and it was very good!',a:()=>ART(sky('#b4e0f2','#f1f7e8')+sun(60,56,20)+hills(176,'#9dcd7c','#7ab86c')+fruitTree(330,226,1.3)+person(170,238,1.15,{robe:'#e3cfa2',sash:'#8ab06a',skin:SK[2],hair:'#3a2618',arms:'wave'})+person(226,240,1.1,{robe:'#e9d7b0',sash:'#e2867a',skin:SK[1],hair:'#5a3620',longHair:1,arms:'down'})+bush(196,262,1.3,'#5f9e5a')+sheep(80,262,1)+flowers(18,31,250,278))},
   {x:'On the seventh day, God rested. He had made a beautiful world, and He made you too. God loves you very much!',a:()=>ART(sky('#f4b87a','#fbe3b0')+sun(200,170,40)+hills(190,'#d39a6a','#b9805a')+tree(70,236,1.1,'#7a8f4e')+sheep(140,258,1)+sheep(170,262,.9,1)+`<g opacity=".8">${bird(260,80,1.2,'#7a4a3a')+bird(290,96,1,'#7a4a3a')}</g>`)},
  ]},
 {id:'noah',title:'Noah and the Big Boat',sub:'God Keeps His Promises',ref:'Genesis 6–9',cover:6,
  verse:{t:'But Noah found grace in the eyes of the LORD.',r:'Genesis 6:8'},
  qs:['Why did God tell Noah to build the ark?','How many of each animal went into the ark?','What does the rainbow remind us of?'],
  prayer:'Dear God, thank You for always keeping Your promises. Help me listen to You and obey, just like Noah. In Jesus’ name, Amen.',
  pages:[
   {x:'A long time ago, people forgot about God and did many wrong things. But one man, named Noah, loved God and obeyed Him.',a:()=>ART(sky('#a9dcf2','#eef6ee')+cloud(260,60,1)+hills(186,'#9dcd7c','#7ab86c')+tree(330,230,1)+person(170,246,1.4,Object.assign({},NOAH,{arms:'pray'}))+sheep(240,256,.9,1))},
   {x:'God told Noah, “Build a big boat called an ark.” So Noah built and built. Bang! Bang! Bang! It took a very long time, but Noah kept obeying God.',a:()=>ART(sky('#a9dcf2','#f3efe0')+sun(60,50,20)+ground(222,'#c9b07a')+ark(240,232,1.05)+person(92,248,1.25,Object.assign({},NOAH,{arms:'hammer'}))+`<g fill="#b8834e"><rect x="30" y="252" width="50" height="6"/><rect x="36" y="244" width="40" height="6"/></g>`)},
   {x:'Then God sent the animals to Noah, two by two. Elephants and giraffes, lions and sheep, a mommy and a daddy of every kind. In they went!',a:()=>ART(sky('#b9d9ea','#efe9d8')+cloud(300,46,.8,'#e8eef2')+ground(220,'#c9b07a')+ark(250,222,1)+`<path d="M200 222 L130 256 L150 256 L214 222Z" fill="#8a5f3a"/>`+giraffe(100,254,.7)+giraffe(70,258,.66)+elephant(40,268,.7)+sheep(150,250,.7)+sheep(170,246,.6)+lion(110,270,.6)+lion(150,274,.55))},
   {x:'When everyone was safe inside, God shut the door. Then the rain began. Drip, drop, splash! It rained for forty days and forty nights.',a:()=>ART(sky('#56677e','#8b9aac')+cloud(10,40,1.4,'#6c7a8c')+cloud(170,30,1.6,'#5f6d80')+cloud(300,52,1.2,'#6c7a8c')+rain(90,9)+wave(208,'#4d7fa6',8,50)+ark(200,214,1)+wave(222,'#3f6d93',7,44,18))},
   {x:'The water covered everything, but the ark floated safely on top. God took care of Noah, his family and every animal inside.',a:()=>ART(sky('#1e2a52','#3a4a78')+moon(320,70,22,'#22305a')+stars(30,13,150)+wave(196,'#2f5a86',6,56)+ark(180,206,.95)+wave(214,'#284d75',6,44,20))},
   {x:'One day the rain stopped. Noah sent out a dove. It came back with a fresh green olive leaf! That meant the land was drying, and the trees were growing again.',a:()=>ART(sky('#9fd2ee','#e4f3f8')+sun(70,60,22)+cloud(250,70,.9)+`<path d="M260 200 L320 150 L380 200Z" fill="#7ab86c"/>`+wave(200,'#5aaad4',5,48)+ark(150,210,.8)+dove(210,104,1.5,1))},
   {x:'Noah and his family came out and thanked God. Then God put a beautiful rainbow in the sky. It was God’s promise to never flood the whole earth again. God always keeps His promises!',a:()=>ART(sky('#9fd2ee','#eef7f0')+rainbow(200,210,180)+cloud(10,200,1.2)+cloud(330,196,1.1)+hills(200,'#9dcd7c','#7ab86c')+ark(300,222,.6)+person(150,252,1.2,Object.assign({},NOAH,{arms:'cheer'}))+person(195,254,1.05,{robe:'#b56f7a',sash:'#f2e3c0',cover:'#e8c0a0',skin:SK[1],longHair:1,arms:'up'})+sheep(80,262,.9)+elephant(260,268,.6,1)+dove(110,150,.8))},
  ]},
 {id:'david',title:'David and the Giant',sub:'God Is Bigger',ref:'1 Samuel 17',cover:4,
  verse:{t:'The battle is the LORD’s.',r:'1 Samuel 17:47'},
  qs:['Why wasn’t David afraid of the giant?','How many stones did David pick up?','What is something that feels big and scary to you? Who can help you?'],
  prayer:'Dear God, when I feel scared, help me remember that You are bigger than anything. Help me be brave and trust You. In Jesus’ name, Amen.',
  pages:[
   {x:'David was a shepherd boy. Every day he took care of his father’s sheep. He kept them safe from lions and bears, and he sang songs to God.',a:()=>ART(sky('#a9dcf2','#f3f2e2')+sun(320,56,20)+hills(176,'#a5d07e','#83bd6a')+tree(50,226,.9)+person(180,246,1.25,Object.assign({},DAVID,{arms:'staff',staff:1}))+sheep(110,254,1)+sheep(250,250,.9,1)+sheep(290,262,1.05)+sheep(80,270,.8,1)+flowers(14,41,244,276))},
   {x:'One day an army came to fight God’s people. They had a giant named Goliath. He was taller than anyone you have ever seen! He shouted, “Who will fight me?”',a:()=>ART(sky('#c6d8e2','#ece3cc')+hills(196,'#c9b07a','#b39a68')+`<path d="M300 210 l18 -30 18 30Z M340 214 l14 -24 14 24Z" fill="#d9cfb8"/>`+person(200,262,2.25,{robe:'#7a6a58',sash:'#5c4a3a',skin:SK[2],armor:1,helmet:1,plume:'#7a2a2a',arms:'out',face:'frown',beard:'#2f2018',hair:'#2f2018'})+`<path d="M272 30 V262" stroke="#6b4a2f" stroke-width="5"/><path d="M266 30 L272 12 L278 30Z" fill="#9aa0a6"/>`)},
   {x:'Everyone in King Saul’s army was afraid. Nobody wanted to fight the giant. But David said, “I’m not afraid. God has helped me before, and God will help me now!”',a:()=>ART(sky('#c6dde8','#efe8d4')+hills(200,'#bfb07a','#a99a66')+`<g opacity=".95">${soldier(70,250,.95,0)}${soldier(115,254,.9,0)}${soldier(330,252,.95,1)}</g>`+person(220,256,1.2,Object.assign({},DAVID,{arms:'out'}))+`<path d="M150 266 q30 -26 56 -8" stroke="#7b5232" stroke-width="0" fill="none"/>`)},
   {x:'David went down to a little stream. He picked up five smooth stones and put them in his bag. He took his sling. He did not take a sword or armor. He trusted God.',a:()=>ART(sky('#acdcf0','#eef5e6')+hills(170,'#a5d07e','#83bd6a')+`<path d="M0 230 Q120 210 200 236 T400 226 V262 Q300 250 200 270 T0 258Z" fill="#6fb3d8"/><path d="M40 244 q20 -4 40 0 M220 252 q20 -4 40 0" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/>`+stonesPile(110,262)+person(200,240,1.2,Object.assign({},DAVID,{kneel:1,arms:'hold'}))+bush(330,224,.7))},
   {x:'David ran toward Goliath. He put a stone in his sling and swung it around and around. Whoosh! The stone flew through the air!',a:()=>ART(sky('#b9dcea','#f1e9d2')+hills(200,'#c9b07a','#b39a68')+person(90,258,1.2,Object.assign({},DAVID,{arms:'sling'}))+`<path d="M140 110 Q230 40 300 96" stroke="#fff" stroke-width="2.5" stroke-dasharray="4 8" fill="none"/><circle cx="300" cy="96" r="5" fill="#a8a39a"/>`+person(330,262,1.75,{robe:'#7a6a58',sash:'#5c4a3a',skin:SK[2],armor:1,helmet:1,plume:'#7a2a2a',arms:'down',face:'wow',beard:'#2f2018',hair:'#2f2018'}))},
   {x:'The stone hit Goliath, and down he fell. Thud! God’s people cheered! David showed everyone that God is bigger than any giant.',a:()=>ART(sky('#a9dcf2','#f3f0dc')+sun(330,56,22)+hills(196,'#c9b07a','#b39a68')+person(250,252,1.5,{robe:'#7a6a58',sash:'#5c4a3a',skin:SK[2],armor:1,helmet:1,plume:'#7a2a2a',arms:'down',face:'sleep',beard:'#2f2018',hair:'#2f2018',rot:90})+person(140,256,1.25,Object.assign({},DAVID,{arms:'cheer'}))+`<g>${soldier(44,262,.8,0,'smile')}${soldier(80,266,.75,0,'smile')}</g>`)},
  ]},
 {id:'christmas',title:'The First Christmas',sub:'Jesus Is Born',ref:'Luke 1–2; Matthew 2',cover:3,
  verse:{t:'For unto you is born this day in the city of David a Saviour, which is Christ the Lord.',r:'Luke 2:11'},
  qs:['Where was baby Jesus born?','What did the angels tell the shepherds?','Why is Jesus the best gift of all?'],
  prayer:'Dear God, thank You for sending baby Jesus to be our Savior. Help me love Him and tell others about Him. In Jesus’ name, Amen.',
  pages:[
   {x:'One day God sent an angel named Gabriel to a young woman named Mary. “Don’t be afraid,” the angel said. “You will have a baby boy, and you will name Him Jesus. He is God’s own Son!”',a:()=>ART(`<rect width="400" height="280" fill="#ead8b8"/><rect y="226" width="400" height="54" fill="#c9a77a"/><rect x="40" y="50" width="70" height="80" fill="#9fc6e0"/><path d="M75 50 V130 M40 90 H110" stroke="#8a6a44" stroke-width="5"/>`+angel(270,226,1.4,'out')+person(140,238,1.25,Object.assign({},MARY,{kneel:1,arms:'pray'})))},
   {x:'Mary married a kind man named Joseph. Before the baby was born, they had to go on a long trip to the town of Bethlehem. Clip-clop, clip-clop went the little donkey.',a:()=>ART(sky('#f0a978','#f8dcaa')+sun(330,150,30)+hills(190,'#c79a6a','#ad845c')+town(178,0)+`<path d="M0 262 Q200 240 400 258 V280 H0Z" fill="#d9bd8f"/>`+donkey(170,262,1.25)+person(170,236,1,Object.assign({},MARY,{kneel:1,arms:'hold'}))+person(90,262,1.2,Object.assign({},JOSEPH,{arms:'staff',staff:1})))},
   {x:'Bethlehem was full of people. There was no room for them at the inn. So Mary and Joseph stayed in a stable, where the animals slept.',a:()=>ART(sky('#1d2550','#3a3f72')+stars(36,17,140)+moon(60,60,18,'#1f2754')+hills(206,'#3c3a5e','#2f2d4c')+town(218,1)+stable(150,268,.85)+person(130,262,1,Object.assign({},JOSEPH,{arms:'hold'}))+person(170,262,.95,Object.assign({},MARY,{arms:'hold'}))+donkey(96,268,.7,1))},
   {x:'That night, baby Jesus was born! Mary wrapped Him in soft cloths and laid Him in a manger, a box where the animals ate their hay. God’s Son had come to earth.',a:()=>ART(sky('#141a3c','#262c5a')+stars(30,23,120)+bigStar(200,36,16)+`<path d="M200 46 L140 200 L260 200Z" fill="#fff4c8" opacity=".12"/>`+stable(200,276,1.45)+glow(200,236,90,'#ffe9a8',.55)+manger(200,268,1.25)+person(120,272,1.15,Object.assign({},MARY,{kneel:1,arms:'pray'}))+person(285,272,1.2,Object.assign({},JOSEPH,{arms:'staff',staff:1}))+sheep(70,276,.9)+donkey(340,276,.75,1))},
   {x:'Out in the fields, shepherds were watching their sheep. Suddenly angels filled the sky! “Good news!” they said. “A Savior is born today! Glory to God in the highest!”',a:()=>ART(sky('#141a3c','#2a3266')+stars(40,29,200)+angel(110,130,1,'up')+angel(290,110,1.1,'up')+angel(200,90,.85,'up')+hills(206,'#3a4a4a','#2e3d3d')+person(140,262,1.1,{robe:'#8a6a4a',sash:'#c9a25a',skin:SK[3],cover:'#c9b48a',band:'#7b4f2b',beard:'#1f1510',arms:'up',face:'wow',staff:1})+person(240,264,1,{robe:'#6f7f5a',sash:'#d9c08a',skin:SK[1],hair:'#6a4428',arms:'out',face:'wow'})+sheep(70,266,.9)+sheep(310,268,.85,1))},
   {x:'Far away, wise men saw a special star. They followed it all the way to Jesus and brought Him gifts. Jesus is the best gift of all, God’s gift to the whole world!',a:()=>ART(sky('#141a3c','#3a3266')+stars(46,37,180)+bigStar(300,60,22)+`<path d="M0 230 Q100 200 220 226 T400 214 V280 H0Z" fill="#c79a6a" opacity=".55"/><path d="M0 250 Q140 226 260 248 T400 240 V280 H0Z" fill="#2a2440"/>`+camelRider(110,256,1.05,'#2a2440')+camelRider(190,252,.95,'#2a2440')+camelRider(262,250,.85,'#2a2440'))},
  ]},
 {id:'storm',title:'Jesus Calms the Storm',sub:'Jesus Is with Us',ref:'Mark 4:35-41',cover:4,
  verse:{t:'What time I am afraid, I will trust in thee.',r:'Psalm 56:3'},
  qs:['What was Jesus doing when the storm came?','What did Jesus say to the wind and the waves?','When you feel afraid, what can you do?'],
  prayer:'Dear Jesus, thank You that You are always with me. When I am scared, help me trust You. You are stronger than any storm. Amen.',
  pages:[
   {x:'Jesus taught the people by the Sea of Galilee. So many people came to hear Him! He told them about God’s love all day long.',a:()=>ART(sky('#a6daf0','#eaf5f2')+sun(340,50,20)+wave(150,'#5aaad4',4,60)+`<path d="M0 170 Q200 150 400 176 V280 H0Z" fill="#d9c08a"/>`+boat(320,168,.6,0,false)+person(200,240,1.35,Object.assign({},JESUS,{arms:'out'}))+[60,100,280,330].map((x,i)=>person(x,268,.95,Object.assign({},DISC[i],{arms:i%2?'pray':'down',face:'smile'}))).join(''))},
   {x:'That evening Jesus said, “Let’s go over to the other side of the lake.” So Jesus and His friends got into a boat and set sail.',a:()=>ART(sky('#f2a36f','#f9d6a3')+sun(300,170,34)+wave(180,'#d38f6a',4,60)+wave(200,'#c27a5c',5,44,10)+boat(190,206,1.2)+person(160,188,.62,Object.assign({},JESUS,{arms:'point'}))+person(205,188,.6,DISC[0])+person(235,188,.6,DISC[1])+bird(80,70,1.2,'#7a4a3a'))},
   {x:'Jesus was tired, so He lay down in the back of the boat and fell asleep. Then a great storm came! The wind blew and blew. Big waves crashed into the boat!',a:()=>ART(sky('#2d3850','#4f5c76')+cloud(0,40,1.6,'#3d4862')+cloud(200,30,1.8,'#36415a')+bolt(310,40,1.2)+rain(80,51,'#a8b9cc')+`<g transform="translate(200 206) rotate(-12)">`+person(-44,-16,.62,Object.assign({},DISC[2],{arms:'up',face:'scared'}))+person(-14,-16,.62,Object.assign({},DISC[0],{arms:'up',face:'scared'}))+person(18,-31,.55,Object.assign({},JESUS,{face:'sleep',rot:90}))+boat(0,0,1.15,0)+'</g>'+wave(206,'#2e5f86',16,70)+wave(226,'#24506f',12,52,22))},
   {x:'The friends were very afraid. They woke Jesus up. “Teacher! Don’t You care? We’re going to sink!” they cried.',a:()=>ART(sky('#2d3850','#4f5c76')+rain(70,61,'#a8b9cc')+boat(200,236,2,-6,false)+person(150,196,1.05,Object.assign({},DISC[1],{arms:'out',face:'scared'}))+person(215,190,1.05,Object.assign({},DISC[3],{arms:'up',face:'scared'}))+person(286,198,1,Object.assign({},JESUS,{kneel:1,arms:'hold'}))+wave(238,'#2e5f86',12,64)+wave(256,'#24506f',10,50,20))},
   {x:'Jesus stood up. He spoke to the wind and the waves: “Peace, be still.” And right away, the wind stopped and the water became calm. Everything was quiet.',a:()=>ART(sky('#58698a','#c8d6e2')+glow(200,120,140,'#fff4d0',.5)+cloud(280,50,1.1,'#8696ae',.8)+wave(200,'#4c86b0',3,70)+boat(200,212,1.2)+person(200,192,.75,Object.assign({},JESUS,{arms:'out'}))+person(150,192,.6,Object.assign({},DISC[0],{face:'wow'}))+person(248,192,.6,Object.assign({},DISC[2],{face:'wow'}))+wave(222,'#3f76a0',2,60,16))},
   {x:'The friends were amazed. “Who is this? Even the wind and the waves obey Him!” Jesus is God’s Son. He is with us, and we never have to be afraid.',a:()=>ART(sky('#1e2a52','#3e4f82')+moon(320,70,24,'#22305a')+stars(34,71,150)+wave(196,'#2f5a86',3,70)+`<path d="M300 200 h40" stroke="#f6edcf" stroke-opacity=".4" stroke-width="3"/>`+boat(190,210,1.2)+person(190,190,.7,Object.assign({},JESUS,{arms:'down'}))+person(140,190,.6,Object.assign({},DISC[1],{arms:'pray'}))+person(240,190,.6,Object.assign({},DISC[3],{arms:'cheer'}))+wave(220,'#284d75',2,56,14))},
  ]},
];

/* ===== Shelf ===== */
function renderKids(){
  const box=$('#kidsBody'); if(!box) return; const done=S.kids||{};
  const n=KSTORIES.filter(s=>done[s.id]).length;
  box.innerHTML=`<p class="dv-p" style="margin-top:-4px">Bible stories with pictures for little ones. Tap a story to begin, then tap <b>Read to Me</b> to hear it.</p>
    ${n?`<div class="k-stars">${KSTORIES.map(s=>`<span class="${done[s.id]?'on':''}"></span>`).join('')}<b>${n} of ${KSTORIES.length} stories read</b></div>`:''}
    <div class="k-shelf">${KSTORIES.map(s=>`<button class="k-book" data-id="${s.id}"><div class="k-cov">${s.pages[s.cover].a()}${done[s.id]?'<span class="k-badge" aria-label="Finished"></span>':''}</div>
      <span class="t">${esc(s.title)}</span><span class="d">${esc(s.sub)} · ${s.pages.length} pages</span></button>`).join('')}</div>
    <p class="small muted" style="text-align:center;margin-top:18px">Stories retold for young children, with pictures drawn for this Bible. Each story lists where to find it in Scripture.</p>`;
  $$('#kidsBody .k-book').forEach(b=>b.onclick=()=>kOpen(b.dataset.id));
}

/* ===== Story reader ===== */
const KS={id:null,page:0,auto:false,timer:null};
function kStory(){ return KSTORIES.find(s=>s.id===KS.id); }
function kOpen(id){ KS.id=id; KS.page=0; KS.auto=false; if(typeof npStop==='function'&&typeof NP!=='undefined'&&NP.audio) npStop(); if(typeof stopSpeak==='function') stopSpeak(); if(location.hash==='#kidstory') renderKidStory(); else go('kidstory'); }
function kStop(){ clearTimeout(KS.timer); KS.timer=null; KS.reading=false; try{ if('speechSynthesis' in window) speechSynthesis.cancel(); }catch(e){} $$('#kText .w.on').forEach(w=>w.classList.remove('on')); kBtns(); }
function kWords(t){ let i=0; return t.split(/(\s+)/).map(p=>{ const st=i; i+=p.length; return /^\s+$/.test(p)?p:`<span class="w" data-s="${st}" data-e="${i}">${esc(p)}</span>`; }).join(''); }
function renderKidStory(){
  const s=kStory(); if(!s){ go('kids'); return; }
  const last=s.pages.length, end=KS.page>=last, box=$('#kStage');
  $('#kTitle').textContent=s.title;
  $('#kDots').innerHTML=[...s.pages,0].map((_,i)=>`<i class="${i<KS.page?'on':i===KS.page?'cur':''}"></i>`).join('');
  if(!end){
    const p=s.pages[KS.page];
    box.innerHTML=`<div class="k-page"><div class="k-pic">${p.a()}</div><div class="k-text" id="kText">${kWords(p.x)}</div></div>`;
  } else {
    S.kids=S.kids||{}; if(!S.kids[s.id]){ S.kids[s.id]=Date.now(); persist(); }
    box.innerHTML=`<div class="k-end"><div class="k-bigstar"></div><h2>You finished the story!</h2>
      <div class="k-verse"><div class="lab">Verse to Learn</div><p>“${esc(s.verse.t)}”</p><div class="ref">${esc(s.verse.r)}</div></div>
      <div class="k-talk"><div class="lab">Talk About It</div><ol>${s.qs.map(q=>`<li>${esc(q)}</li>`).join('')}</ol></div>
      <div class="k-talk"><div class="lab">Let’s Pray</div><p>${esc(s.prayer)}</p></div>
      <div class="grid2"><button class="btn" id="kAgain">Read Again</button><button class="btn red" id="kMore">More Stories</button></div>
      <button class="btn full" id="kBible" style="margin-top:10px">For Grown-ups: Read ${esc(s.ref)}</button></div>`;
    $('#kAgain').onclick=()=>{ KS.page=0; renderKidStory(); };
    $('#kMore').onclick=()=>go('kids');
    $('#kBible').onclick=()=>{ const r=parseRef(s.ref.split(/[–;]/)[0].replace(/\s+$/,'')); if(r) openReader(r.book,r.ch,r.verses); };
  }
  kBtns(); window.scrollTo(0,0);
  if(KS.auto&&!end) KS.timer=setTimeout(kRead,500);
}
function kBtns(){
  const s=kStory(); if(!s) return; const end=KS.page>=s.pages.length;
  $('#kPrev').style.visibility=KS.page>0?'':'hidden';
  $('#kNext').style.visibility=end?'hidden':'';
  $('#kNext').textContent=KS.page===s.pages.length-1?'The End':'Next';
  const r=$('#kRead'); r.style.visibility=end?'hidden':'';
  r.querySelector('span').textContent=KS.reading||KS.auto?'Stop':'Read to Me'; r.classList.toggle('on',!!(KS.reading||KS.auto));
}
function kRead(){
  const s=kStory(); if(!s||KS.page>=s.pages.length) return;
  if(!('speechSynthesis' in window)){ toast('Reading aloud is not available on this device'); KS.auto=false; kBtns(); return; }
  speechSynthesis.cancel();
  const text=s.pages[KS.page].x, words=$$('#kText .w'), u=new SpeechSynthesisUtterance(text), v=pickVoice();
  if(v) u.voice=v; u.rate=Math.max(.7,(+S.settings.rate||.95)*.9); u.pitch=1.05;
  let got=false; const page=KS.page;
  u.onboundary=e=>{ if(e.name&&e.name!=='word') return; got=true; const i=e.charIndex; words.forEach(w=>w.classList.toggle('on',+w.dataset.s<=i&&i<+w.dataset.e)); };
  u.onend=()=>{ words.forEach(w=>w.classList.remove('on')); KS.reading=false;
    if(KS.auto&&KS.page===page&&location.hash==='#kidstory'){ KS.timer=setTimeout(()=>{ KS.page++; renderKidStory(); },1100); } else kBtns(); };
  u.onerror=u.onend;
  KS.reading=true; kBtns(); speechSynthesis.speak(u);
}
function kGo(d){ const s=kStory(); if(!s) return; const auto=KS.auto; kStop(); KS.auto=auto; KS.page=Math.max(0,Math.min(s.pages.length,KS.page+d)); renderKidStory(); }
$('#kPrev').onclick=()=>{ KS.auto=false; kGo(-1); };
$('#kNext').onclick=()=>{ KS.auto=false; kGo(1); };
$('#kRead').onclick=()=>{ if(KS.reading||KS.auto){ KS.auto=false; kStop(); return; } KS.auto=true; kRead(); };
$('#kClose').onclick=()=>{ KS.auto=false; kStop(); go('kids'); };
(function(){ let x0=null,y0=null; const el=$('#kStage');
  el.addEventListener('touchstart',e=>{ x0=e.touches[0].clientX; y0=e.touches[0].clientY; },{passive:true});
  el.addEventListener('touchend',e=>{ if(x0===null) return; const dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0; x0=null;
    if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.4){ KS.auto=false; kGo(dx<0?1:-1); } },{passive:true});
})();

/* if the app opened straight to these pages */
if(/^#kid/.test(location.hash)) route();
