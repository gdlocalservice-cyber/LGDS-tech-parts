const $ = (sel) => document.querySelector(sel);
const app = $('#app');
const money = (n) => `$${Number(n || 0).toFixed(2)}`;
let state = { token: localStorage.getItem('lgds_token') || '', role: localStorage.getItem('lgds_role') || '', data: null, selected: {}, openCats: {}, adminCat: 0, dirty: false, showPassword: false };

function api(path, options = {}) {
  return fetch(`/.netlify/functions/${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}), ...(options.headers || {}) }
  }).then(async (res) => {
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || `Server error ${res.status}`);
    return body;
  });
}

function setSession(token, role) {
  state.token = token; state.role = role;
  localStorage.setItem('lgds_token', token);
  localStorage.setItem('lgds_role', role);
}
function logout(){ localStorage.removeItem('lgds_token'); localStorage.removeItem('lgds_role'); state={...state, token:'', role:'', data:null, selected:{}, dirty:false}; renderLogin(); }

function renderLogin(error='') {
  app.innerHTML = `<main class="login"><section class="login-card">
    <div class="brand"><div class="logo">LG</div><div><h1>Parts Calculator</h1><p>Local Garage Door Service</p></div></div>
    <div class="tabs"><button class="tab ${state.role !== 'admin' ? 'active' : ''}" data-role="tech">Technician</button><button class="tab ${state.role === 'admin' ? 'active' : ''}" data-role="admin">Admin</button></div>
    <form id="loginForm">
      <div class="field"><label>${state.role === 'admin' ? 'Admin password' : 'Technician password'}</label><div class="input-row"><input id="password" type="${state.showPassword ? 'text' : 'password'}" placeholder="Enter password" autocomplete="current-password" autofocus><button type="button" class="eye" id="toggleEye">${state.showPassword ? 'Hide' : 'Show'}</button></div></div>
      <button class="btn" type="submit">Enter</button>
      ${error ? `<div class="error">${error}</div>` : ''}
    </form>
    <p class="muted" style="margin-top:18px;font-size:13px">Private side project. Not listed on the main website.</p>
  </section></main>`;
  document.querySelectorAll('.tab').forEach(btn => btn.onclick = () => { state.role = btn.dataset.role; renderLogin(); });
  $('#toggleEye').onclick = () => { state.showPassword = !state.showPassword; renderLogin(); };
  $('#loginForm').onsubmit = async (e) => { e.preventDefault(); const password = $('#password').value; const role = state.role === 'admin' ? 'admin' : 'tech'; try { const res = await api('login', { method:'POST', body: JSON.stringify({ role, password }) }); setSession(res.token, res.role); await loadData(); } catch(err){ renderLogin(err.message === 'Wrong password' ? 'Wrong password' : err.message); } };
}

async function loadData(){
  app.innerHTML = '<div class="spinner">Loading parts...</div>';
  try { state.data = await api('data'); if (state.role === 'admin') renderAdmin(); else renderTech(); }
  catch(err){ logout(); renderLogin('Please login again'); }
}

function shell(content, subtitle=''){
  return `<header class="topbar"><div class="topbar-in"><div class="top-title"><div class="logo">LG</div><div><h2>LGDS Parts Calculator</h2><span>${subtitle}</span></div></div><button class="logout" id="logoutBtn">Logout</button></div></header>${content}`;
}

function getFlatItems(){ return (state.data?.categories || []).flatMap(c => c.items.map(i => ({...i, catName:c.name}))); }
function calcTotal(){ return getFlatItems().reduce((sum,item)=> sum + (Number(state.selected[item.id] || 0) * Number(item.price || 0)),0); }

function renderTech(){
  const total = calcTotal();
  const selectedRows = getFlatItems().filter(i => Number(state.selected[i.id] || 0) > 0);
  app.innerHTML = shell(`<main class="wrap">
    <section class="summary"><div class="total-card"><p>Total parts cost</p><h3>${money(total)}</h3></div></section>
    <input class="search" id="search" placeholder="Search part..." />
    <div id="categories"></div>
    <section class="cart"><h3>Selected Parts</h3>${selectedRows.length ? selectedRows.map(i => `<div class="cart-row"><div><strong>${i.name}</strong><br><span class="muted">${i.catName} · ${state.selected[i.id]} × ${money(i.price)}</span></div><strong>${money(state.selected[i.id] * i.price)}</strong></div>`).join('') : '<p class="muted">No parts selected yet.</p>'}<button class="btn secondary" id="clearBtn">Clear selection</button></section>
  </main>`, 'Technician mode');
  $('#logoutBtn').onclick = logout; $('#clearBtn').onclick=()=>{state.selected={}; renderTech();}; $('#search').oninput=(e)=>drawTechCategories(e.target.value);
  drawTechCategories('');
}
function drawTechCategories(filter){
  const q = (filter||'').toLowerCase(); const holder = $('#categories');
  holder.innerHTML = state.data.categories.map((cat,idx)=>{
    const items = cat.items.filter(i => !q || i.name.toLowerCase().includes(q) || cat.name.toLowerCase().includes(q));
    if(!items.length) return '';
    const open = q || state.openCats[cat.id];
    return `<section class="category"><button class="cat-head" data-cat="${cat.id}"><div><strong>${cat.name}</strong><br><small>${items.length} parts</small></div><span>⌄</span></button>${open ? `<div class="items">${items.map(item=>`<div class="item"><div><div class="item-name">${item.name}</div><div class="price">${money(item.price)}</div></div><div class="qty"><button data-minus="${item.id}">−</button><input data-qty="${item.id}" value="${state.selected[item.id] || 0}" inputmode="numeric"><button data-plus="${item.id}">+</button></div></div>`).join('')}</div>`:''}</section>`;
  }).join('') || '<p class="muted">No parts found.</p>';
  holder.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{state.openCats[b.dataset.cat]=!state.openCats[b.dataset.cat]; drawTechCategories($('#search').value);});
  holder.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>{const id=b.dataset.plus; state.selected[id]=Number(state.selected[id]||0)+1; renderTech();});
  holder.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>{const id=b.dataset.minus; state.selected[id]=Math.max(0,Number(state.selected[id]||0)-1); if(!state.selected[id]) delete state.selected[id]; renderTech();});
  holder.querySelectorAll('[data-qty]').forEach(inp=>inp.onchange=()=>{const val=Math.max(0,parseInt(inp.value||'0',10)); if(val) state.selected[inp.dataset.qty]=val; else delete state.selected[inp.dataset.qty]; renderTech();});
}

function uid(prefix){return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;}
function markDirty(){ state.dirty=true; renderAdmin(); }
function renderAdmin(){
  const cats = state.data.categories;
  const cat = cats[state.adminCat] || cats[0];
  app.innerHTML = shell(`<main class="wrap"><div class="notice">Admin changes are saved for everyone only after pressing Save Changes.</div><div class="admin-grid"><aside class="panel"><h3>Categories</h3><div class="cat-list">${cats.map((c,i)=>`<button class="${i===state.adminCat?'active':''}" data-catindex="${i}">${c.name}<br><span class="muted">${c.items.length} parts</span></button>`).join('')}</div><button class="btn secondary" id="addCat">+ Add category</button></aside><section class="panel"><h3>Manage Parts</h3>${cat ? `<div class="field"><label>Category name</label><input id="catName" value="${escapeHtml(cat.name)}"></div><div class="admin-actions"><button class="small-btn good" id="addItem">+ Add part</button><button class="small-btn danger" id="deleteCat">Delete category</button></div><div>${cat.items.map((item,i)=>`<div class="edit-row"><input data-name="${i}" value="${escapeHtml(item.name)}"><input data-price="${i}" type="number" step="0.01" value="${item.price}"><select data-active="${i}"><option value="true" ${item.active!==false?'selected':''}>Active</option><option value="false" ${item.active===false?'selected':''}>Hidden</option></select><div class="admin-actions"><button class="small-btn danger" data-delitem="${i}">Delete</button></div></div>`).join('')}</div>` : '<p>No category selected.</p>'}</section></div>${state.dirty ? `<div class="savebar"><strong>Unsaved changes</strong><button id="saveBtn">Save Changes</button></div>` : ''}</main>`, 'Admin mode');
  $('#logoutBtn').onclick = logout;
  document.querySelectorAll('[data-catindex]').forEach(b=>b.onclick=()=>{state.adminCat=Number(b.dataset.catindex); renderAdmin();});
  $('#addCat').onclick=()=>{cats.push({id:uid('category'),name:'New Category',items:[]});state.adminCat=cats.length-1;markDirty();};
  if(cat){
    $('#catName').onchange=(e)=>{cat.name=e.target.value; markDirty();};
    $('#addItem').onclick=()=>{cat.items.push({id:uid('item'),name:'New Part',price:0,active:true});markDirty();};
    $('#deleteCat').onclick=()=>{ if(confirm('Delete this category?')){cats.splice(state.adminCat,1);state.adminCat=Math.max(0,state.adminCat-1);markDirty();}};
    document.querySelectorAll('[data-name]').forEach(inp=>inp.onchange=()=>{cat.items[Number(inp.dataset.name)].name=inp.value;markDirty();});
    document.querySelectorAll('[data-price]').forEach(inp=>inp.onchange=()=>{cat.items[Number(inp.dataset.price)].price=Number(inp.value||0);markDirty();});
    document.querySelectorAll('[data-active]').forEach(sel=>sel.onchange=()=>{cat.items[Number(sel.dataset.active)].active=sel.value==='true';markDirty();});
    document.querySelectorAll('[data-delitem]').forEach(btn=>btn.onclick=()=>{cat.items.splice(Number(btn.dataset.delitem),1);markDirty();});
  }
  const save = $('#saveBtn'); if(save) save.onclick=saveAdmin;
}
async function saveAdmin(){
  const bar = $('.savebar'); if(bar) bar.innerHTML='<strong>Saving...</strong>';
  try{ state.data = await api('save',{method:'POST',body:JSON.stringify(state.data)}); state.dirty=false; renderAdmin(); }
  catch(err){ alert(err.message); renderAdmin(); }
}
function escapeHtml(s){return String(s||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

if(state.token) loadData(); else { state.role = state.role || 'tech'; renderLogin(); }
