const state = { products: [], users: [], view: 'overview', editing: null, deleting: null };

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const money = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const api = async (path, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const adminKey = sessionStorage.getItem('adminKey');
  if (adminKey) headers['x-admin-key'] = adminKey;

  const response = await fetch(`/admin-api${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));

  if (response.status === 401) {
    const key = window.prompt('Enter the ADMIN_KEY from your .env file:');
    if (key !== null) {
      sessionStorage.setItem('adminKey', key);
      return api(path, options);
    }
  }

  if (!response.ok) throw new Error(payload.message || 'Request failed.');
  return payload;
};

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[character]));

const toast = (message) => {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove('show'), 2600);
};

const showView = (view) => {
  state.view = view;
  $$('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
  $$('.view').forEach((section) => section.classList.toggle('active', section.id === `${view}View`));
  const names = { overview: ['OVERVIEW', 'Control room'], products: ['CATALOG', 'Product inventory'], users: ['COMMUNITY', 'User directory'] };
  $('#sectionLabel').textContent = names[view][0];
  $('#pageTitle').textContent = names[view][1];
  $('#newButton').textContent = view === 'users' ? '+ New user' : '+ New product';
};

const renderProducts = () => {
  const query = $('#productSearch').value.trim().toLowerCase();
  const products = state.products.filter((product) => product.item.toLowerCase().includes(query));
  $('#productRecordCount').textContent = `${products.length} record${products.length === 1 ? '' : 's'}`;
  $('#productEmpty').style.display = products.length ? 'none' : 'block';
  $('#productRows').innerHTML = products.map((product) => `
    <tr>
      <td><div class="identity"><img class="thumb" src="${escapeHtml(product.imageUrl || '/images/logo.png')}" alt="" onerror="this.src='/images/logo.png'"><div><strong>${escapeHtml(product.item)}</strong><small>#${product._id.slice(-6).toUpperCase()}</small></div></div></td>
      <td>${money.format(product.price)}</td>
      <td><span class="stock ${product.quantity < 5 ? 'low' : ''}">${product.quantity} units</span></td>
      <td>${date.format(new Date(product.createdAt))}</td>
      <td class="actions"><button class="icon-btn" data-edit-product="${product._id}" aria-label="Edit ${escapeHtml(product.item)}">Edit</button><button class="icon-btn" data-delete-product="${product._id}" aria-label="Delete ${escapeHtml(product.item)}">×</button></td>
    </tr>`).join('');
};

const renderUsers = () => {
  const query = $('#userSearch').value.trim().toLowerCase();
  const users = state.users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query));
  $('#userRecordCount').textContent = `${users.length} record${users.length === 1 ? '' : 's'}`;
  $('#userEmpty').style.display = users.length ? 'none' : 'block';
  $('#userRows').innerHTML = users.map((user) => `
    <tr>
      <td><div class="identity">${user.picture ? `<img class="thumb avatar" src="${escapeHtml(user.picture)}" alt="">` : `<span class="avatar">${escapeHtml(user.name.charAt(0).toUpperCase())}</span>`}<div><strong>${escapeHtml(user.name)}</strong><small>#${user._id.slice(-6).toUpperCase()}</small></div></div></td>
      <td>${escapeHtml(user.email)}</td><td>${user.age}</td><td>${date.format(new Date(user.createdAt))}</td>
      <td class="actions"><button class="icon-btn" data-edit-user="${user._id}">Edit</button><button class="icon-btn" data-delete-user="${user._id}">×</button></td>
    </tr>`).join('');
};

const renderOverview = (stats) => {
  $('#productCount').textContent = stats.products;
  $('#unitCount').textContent = stats.units;
  $('#userCount').textContent = stats.users;
  $('#inventoryValue').textContent = money.format(stats.inventoryValue);
  const max = Math.max(...state.products.map((product) => product.quantity), 1);
  $('#inventoryPulse').innerHTML = state.products.slice(0, 6).map((product) => `
    <div class="pulse-row ${product.quantity < 5 ? 'low' : ''}"><strong>${escapeHtml(product.item)}</strong><span class="bar"><i style="width:${Math.max(4, product.quantity / max * 100)}%"></i></span><span>${product.quantity}</span></div>
  `).join('') || '<p class="eyebrow">Add your first product to see inventory activity.</p>';
};

const loadData = async () => {
  try {
    const [stats, products, users] = await Promise.all([api('/dashboard'), api('/products'), api('/users')]);
    state.products = products;
    state.users = users;
    renderOverview(stats);
    renderProducts();
    renderUsers();
  } catch (error) {
    toast(error.message);
  }
};

const productFields = (item = {}) => `
  <div class="field full"><label for="item">Product name</label><input id="item" name="item" required value="${escapeHtml(item.item)}"></div>
  <div class="field"><label for="price">Price</label><input id="price" name="price" type="number" min="0" step="0.01" required value="${item.price ?? ''}"></div>
  <div class="field"><label for="quantity">Stock quantity</label><input id="quantity" name="quantity" type="number" min="0" step="1" required value="${item.quantity ?? ''}"></div>
  <div class="field full"><label for="imageUrl">Image URL</label><input id="imageUrl" name="imageUrl" type="url" value="${escapeHtml(item.imageUrl)}" placeholder="https://..."></div>`;

const userFields = (item = {}) => `
  <div class="field full"><label for="name">Full name</label><input id="name" name="name" required value="${escapeHtml(item.name)}"></div>
  <div class="field full"><label for="email">Email</label><input id="email" name="email" type="email" required value="${escapeHtml(item.email)}"></div>
  <div class="field"><label for="age">Age</label><input id="age" name="age" type="number" min="1" required value="${item.age ?? ''}"></div>
  <div class="field"><label for="password">Password ${item._id ? '(leave blank to keep)' : ''}</label><input id="password" name="password" type="password" ${item._id ? '' : 'required'}></div>
  <div class="field full"><label for="picture">Picture URL</label><input id="picture" name="picture" type="url" value="${escapeHtml(item.picture)}" placeholder="https://..."></div>`;

const openEditor = (type, item = {}) => {
  state.editing = { type, id: item._id || null };
  const singular = type === 'products' ? 'product' : 'user';
  $('#dialogEyebrow').textContent = type === 'products' ? 'CATALOG ENTRY' : 'USER RECORD';
  $('#dialogTitle').textContent = `${item._id ? 'Edit' : 'New'} ${singular}`;
  $('#formFields').innerHTML = type === 'products' ? productFields(item) : userFields(item);
  $('#formError').textContent = '';
  $('#editorDialog').showModal();
};

$('#editorForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitter = event.submitter;
  if (submitter?.value === 'cancel') return $('#editorDialog').close();
  if (!event.currentTarget.reportValidity()) return;

  const values = Object.fromEntries(new FormData(event.currentTarget));
  const { type, id } = state.editing;
  try {
    $('#saveButton').disabled = true;
    await api(`/${type}${id ? `/${id}` : ''}`, { method: id ? 'PUT' : 'POST', body: JSON.stringify(values) });
    $('#editorDialog').close();
    toast(`${type === 'products' ? 'Product' : 'User'} ${id ? 'updated' : 'created'}.`);
    await loadData();
  } catch (error) {
    $('#formError').textContent = error.message;
  } finally {
    $('#saveButton').disabled = false;
  }
});

document.addEventListener('click', (event) => {
  const nav = event.target.closest('[data-view], [data-go]');
  if (nav) showView(nav.dataset.view || nav.dataset.go);

  const editProduct = event.target.closest('[data-edit-product]');
  const editUser = event.target.closest('[data-edit-user]');
  if (editProduct) openEditor('products', state.products.find((item) => item._id === editProduct.dataset.editProduct));
  if (editUser) openEditor('users', state.users.find((item) => item._id === editUser.dataset.editUser));

  const deleteProduct = event.target.closest('[data-delete-product]');
  const deleteUser = event.target.closest('[data-delete-user]');
  if (deleteProduct || deleteUser) {
    const type = deleteProduct ? 'products' : 'users';
    const id = (deleteProduct || deleteUser).dataset[deleteProduct ? 'deleteProduct' : 'deleteUser'];
    const item = state[type].find((entry) => entry._id === id);
    state.deleting = { type, id };
    $('#confirmText').textContent = `${item.item || item.name} will be permanently removed.`;
    $('#confirmDialog').showModal();
  }
});

$('#confirmDialog').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (event.submitter?.value === 'cancel') return $('#confirmDialog').close();
  try {
    await api(`/${state.deleting.type}/${state.deleting.id}`, { method: 'DELETE' });
    $('#confirmDialog').close();
    toast('Record deleted.');
    await loadData();
  } catch (error) { toast(error.message); }
});

$('#newButton').addEventListener('click', () => openEditor(state.view === 'users' ? 'users' : 'products'));
$('#keyButton').addEventListener('click', () => {
  const key = window.prompt('Admin key (stored for this browser tab only):', sessionStorage.getItem('adminKey') || '');
  if (key !== null) { sessionStorage.setItem('adminKey', key); loadData(); }
});
$('#productSearch').addEventListener('input', renderProducts);
$('#userSearch').addEventListener('input', renderUsers);

loadData();
