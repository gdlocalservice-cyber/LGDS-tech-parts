const API = (name) => `/.netlify/functions/${name}`;
let state = { role: null, data: null, quantities: {}, search: '', pendingSearch: '', adminPassword: '', openCats: {} };

function money(n){ return `$${Number(n||0).toFixed(2)}`; }
function uid(prefix='id'){ return prefix + '-' + Math.random().toString(36).slice(2,9); }
function saveSession(){ /* Keep login only for the current page session so role/password screen stays clear on mobile. */ }
function loadSession(){ state.role = null; state.adminPassword = ''; }
function logout(){ state={ role:null,data:null,quantities:{},search:'',pendingSearch:'',adminPassword:'',openCats:{}}; renderLogin(); }
async function apiPost(name, body){
  const res = await fetch(API(name), { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body||{}) });
  const json = await res.json().catch(()=>({ok:false,message:'Bad server response'}));
  if(!res.ok || !json.ok) throw new Error(json.message || 'Something went wrong');
  return json;
}
async function apiGet(name){
  const res = await fetch(API(name));
  const json = await res.json().catch(()=>({ok:false,message:'Bad server response'}));
  if(!res.ok || !json.ok) throw new Error(json.message || 'Something went wrong');
  return json;
}

async function login(){
  const role = document.querySelector('.tab.active')?.dataset.role || 'tech';
  const password = document.getElementById('password').value.trim();
  const err = document.getElementById('loginError'); err.textContent = '';
  try{
    await apiPost('login', { role, password });
    state.role = role; state.adminPassword = role === 'admin' ? password : ''; saveSession();
    await loadData();
  }catch(e){ err.textContent = e.message === 'Wrong password' ? 'Wrong password' : 'Something went wrong: ' + e.message; }
}
async function loadData(){
  try{ const json = await apiGet('getData'); state.data = json.data; if(json.warning) console.warn(json.warning); renderApp(); }
  catch(e){ logout(); setTimeout(()=>{ const el=document.getElementById('loginError'); if(el) el.textContent='Please login again - data failed to load: '+e.message; },0); }
}
async function saveData(){
  const msg = document.getElementById('saveMsg'); if(msg) msg.textContent='Saving...';
  try{ const json = await apiPost('saveData', { adminPassword: state.adminPassword, data: state.data }); state.data=json.data; if(msg){ msg.textContent='Saved successfully'; msg.style.color='#087443'; } }
  catch(e){ if(msg){ msg.textContent='Save failed: '+e.message; msg.style.color='#b42318'; } }
}

function render(){ renderLogin(); }
function renderLogin(){
  document.getElementById('app').innerHTML = `<div class="login"><div class="brand"><div class="logo">LG</div><div><h1>Parts Calculator</h1><p>Local Garage Door Service</p></div></div><div class="loginHint">Choose login type:</div><div class="tabs"><button class="tab active" data-role="tech">Technician</button><button class="tab" data-role="admin">Admin</button></div><div class="field"><label id="passLabel">Technician password</label><div class="passrow"><input id="password" type="password" placeholder="Enter password" autocomplete="current-password" /><button class="showbtn" id="showPass">Show</button></div></div><button class="btn primary full" id="enterBtn">Enter</button><div id="loginError" class="error"></div><p class="small">Private side project. Not listed on the main website.</p></div>`;
  document.querySelectorAll('.tab').forEach(btn=>btn.onclick=()=>{ document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); document.getElementById('passLabel').textContent=(btn.dataset.role==='admin'?'Admin':'Technician')+' password'; });
  document.getElementById('showPass').onclick=()=>{ const p=document.getElementById('password'); p.type=p.type==='password'?'text':'password'; document.getElementById('showPass').textContent=p.type==='password'?'Show':'Hide'; };
  document.getElementById('enterBtn').onclick=login;
  document.getElementById('password').addEventListener('keydown', e=>{ if(e.key==='Enter') login(); });
}
function renderApp(){ state.role === 'admin' ? renderAdmin() : renderTech(); }
function normalizeSearch(s){
  return String(s || '').toLowerCase().replace(/[-_/()]/g, ' ').replace(/\s+/g, ' ').trim();
}
function itemMatchesSearch(item, cat, q){
  if(!q) return true;
  const text = normalizeSearch(`${item.name} ${cat.name} ${Number(item.price||0)} $${Number(item.price||0)}`);
  const originalText = `${item.name} ${cat.name}`.toLowerCase();
  const terms = normalizeSearch(q).split(' ').filter(Boolean);
  return terms.every(term => text.includes(term) || originalText.includes(term));
}
function visibleCategories(){
  const q = state.search.trim();
  return state.data.categories
    .map(cat=>({ ...cat, items: cat.items.filter(i=> i.active !== false && itemMatchesSearch(i, cat, q)) }))
    .filter(cat=>cat.items.length || !q);
}
function runSearch(){
  state.search = (document.getElementById('search')?.value || state.pendingSearch || '').trim();
  state.pendingSearch = state.search;
  if(state.search){
    state.data.categories.forEach(cat=>{ state.openCats[cat.id] = true; });
  }
  renderTech();
}
function clearSearch(){
  state.search = '';
  state.pendingSearch = '';
  renderTech();
}
function renderTech(){
  const cats = visibleCategories();
  const searchValue = state.pendingSearch || state.search || '';
  const resultCount = cats.reduce((sum, cat)=>sum + cat.items.length, 0);
  document.getElementById('app').innerHTML = `<div class="wrap"><div class="topbar"><div><h1>Parts Calculator</h1><p class="small"><span class="rolePill">Technician</span> Parts selection</p></div><div class="tools techTools"><div class="searchrow"><input class="input search" id="search" placeholder="Search part, category, price..." value="${escapeAttr(searchValue)}"/><button class="btn primary searchBtn" id="searchBtn">Search</button><button class="btn" id="clearSearch">Clear search</button></div><button class="btn" id="clearQty">Clear quantities</button><button class="btn danger" id="logout">Logout</button></div></div>${state.search ? `<div class="searchStatus">Showing ${resultCount} result${resultCount===1?'':'s'} for: <b>${escapeHtml(state.search)}</b></div>` : ''}<div id="cats"></div><div class="summary"><div id="summaryLines"></div><div class="total" id="total">$0.00</div></div></div>`;
  document.getElementById('logout').onclick=logout;
  document.getElementById('clearQty').onclick=()=>{state.quantities={}; renderTech();};
  document.getElementById('clearSearch').onclick=clearSearch;
  document.getElementById('searchBtn').onclick=runSearch;
  document.getElementById('search').oninput=(e)=>{state.pendingSearch=e.target.value;};
  document.getElementById('search').addEventListener('keydown', e=>{ if(e.key==='Enter') runSearch(); });
  const wrap=document.getElementById('cats');
  if(!cats.length){ wrap.innerHTML = `<div class="card empty">No parts found. Try a different search.</div>`; renderSummary(); return; }
  cats.forEach(cat=>{ if(state.openCats[cat.id]===undefined) state.openCats[cat.id]=true; const open=state.search ? true : state.openCats[cat.id]; const div=document.createElement('div'); div.className='card'; div.innerHTML=`<div class="cathead" data-id="${cat.id}"><h2>${escapeHtml(cat.name)}</h2><b>${open?'▲':'▼'}</b></div><div class="items ${open?'':'hidden'}"></div>`; div.querySelector('.cathead').onclick=()=>{state.openCats[cat.id]=!state.openCats[cat.id]; renderTech();}; const items=div.querySelector('.items'); cat.items.forEach(item=>{ const qty=state.quantities[item.id]||0; const row=document.createElement('div'); row.className='item'; row.innerHTML=`<div><div class="itemname">${highlightMatch(item.name)}</div><div class="small">${escapeHtml(cat.name)}</div></div><div class="price">${money(item.price)}</div><div class="qty"><button data-act="minus">−</button><span>${qty}</span><button data-act="plus">+</button></div>`; row.querySelector('[data-act="minus"]').onclick=()=>{state.quantities[item.id]=Math.max(0,(state.quantities[item.id]||0)-1); renderTech();}; row.querySelector('[data-act="plus"]').onclick=()=>{state.quantities[item.id]=(state.quantities[item.id]||0)+1; renderTech();}; items.appendChild(row); }); wrap.appendChild(div); }); renderSummary(); }
function renderSummary(){
  let total=0, lines=[]; state.data.categories.forEach(cat=>cat.items.forEach(item=>{ const qty=state.quantities[item.id]||0; if(qty>0){ const sub=qty*Number(item.price||0); total+=sub; lines.push(`<div class="summaryline"><span>${escapeHtml(item.name)} × ${qty}</span><b>${money(sub)}</b></div>`); }}));
  document.getElementById('summaryLines').innerHTML=lines.join('') || '<p class="small" style="text-align:center">Select parts and quantities</p>'; document.getElementById('total').textContent=money(total);
}
function renderAdmin(){
  document.getElementById('app').innerHTML = `<div class="wrap"><div class="topbar"><div><h1>Admin - Parts & Prices</h1><p class="small"><span class="rolePill adminPill">Admin</span> Changes are saved for all technicians</p></div><div class="tools"><button class="btn green" id="addCat">+ Add category</button><button class="btn primary" id="save">Save Changes</button><button class="btn danger" id="logout">Logout</button></div></div><div id="saveMsg" class="small"></div><div class="adminGrid" id="adminGrid"></div></div>`;
  document.getElementById('logout').onclick=logout; document.getElementById('save').onclick=saveData; document.getElementById('addCat').onclick=()=>{ state.data.categories.push({id:uid('cat'),name:'New Category',items:[]}); renderAdmin(); };
  const grid=document.getElementById('adminGrid'); state.data.categories.forEach((cat,ci)=>{ const box=document.createElement('div'); box.className='card adminCat'; box.innerHTML=`<div class="adminCatHeader"><input class="input" value="${escapeAttr(cat.name)}" data-cat-name="${ci}"/><button class="iconbtn" data-add="${ci}">+ Part</button><button class="iconbtn" data-delcat="${ci}">Delete</button></div><div class="adminItems"></div>`; box.querySelector('[data-cat-name]').oninput=e=>cat.name=e.target.value; box.querySelector('[data-add]').onclick=()=>{cat.items.push({id:uid('item'),name:'New Part',price:0,active:true});renderAdmin();}; box.querySelector('[data-delcat]').onclick=()=>{ if(confirm('Delete this category?')){state.data.categories.splice(ci,1);renderAdmin();} }; const items=box.querySelector('.adminItems'); cat.items.forEach((item,ii)=>{ const row=document.createElement('div'); row.className='adminItem'; row.innerHTML=`<input value="${escapeAttr(item.name)}" data-name/><input type="number" step="0.01" value="${Number(item.price||0)}" data-price/><button class="iconbtn" data-active>${item.active===false?'Off':'On'}</button><button class="iconbtn" data-del>🗑</button>`; row.querySelector('[data-name]').oninput=e=>item.name=e.target.value; row.querySelector('[data-price]').oninput=e=>item.price=Number(e.target.value||0); row.querySelector('[data-active]').onclick=()=>{item.active=item.active===false?true:false;renderAdmin();}; row.querySelector('[data-del]').onclick=()=>{cat.items.splice(ii,1);renderAdmin();}; items.appendChild(row); }); grid.appendChild(box); });
}
function highlightMatch(text){
  const safe = escapeHtml(text);
  const q = normalizeSearch(state.search).split(' ').filter(t=>t.length > 1)[0];
  if(!q) return safe;
  const idx = safe.toLowerCase().indexOf(q.toLowerCase());
  if(idx < 0) return safe;
  return safe.slice(0, idx) + '<mark>' + safe.slice(idx, idx + q.length) + '</mark>' + safe.slice(idx + q.length);
}
function escapeHtml(s){ return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function escapeAttr(s){ return escapeHtml(s); }
render();
