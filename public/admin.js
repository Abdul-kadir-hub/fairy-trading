let currentData = {};
let savedAdminPassword = "";

async function authenticateAdmin() {
  const entered = document.getElementById('admin-pass-input').value;
  
  const res = await fetch('/api/verify-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: entered })
  });

  if (res.ok) {
    savedAdminPassword = entered;
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
    loadAdminData();
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
}

async function loadAdminData() {
  const res = await fetch('/api/content');
  currentData = await res.json();

  document.getElementById('businessName').value = currentData.businessName || '';
  document.getElementById('heroTitle').value = currentData.heroTitle || '';
  document.getElementById('heroSubtitle').value = currentData.heroSubtitle || '';
  document.getElementById('whatsappNumber').value = currentData.whatsappNumber || '';
  document.getElementById('address').value = currentData.address || '';
  document.getElementById('mapUrl').value = currentData.mapUrl || '';

  renderProductInputs();
  renderGalleryInputs();
  renderStaffInputs();
}

function renderProductInputs() {
  const container = document.getElementById('admin-products');
  container.innerHTML = currentData.products.map((p, index) => `
    <div class="admin-card-row">
      <h4>Buckle Item #${index + 1}</h4>
      <input type="text" placeholder="Title" value="${p.title}" onchange="currentData.products[${index}].title = this.value">
      <textarea placeholder="Description" onchange="currentData.products[${index}].desc = this.value">${p.desc}</textarea>
      <input type="text" placeholder="Image URL" value="${p.image}" onchange="currentData.products[${index}].image = this.value">
      <button type="button" class="btn-delete" onclick="removeProduct(${index})">Remove Buckle</button>
    </div>
  `).join('');
}

function addProduct() {
  currentData.products.push({
    id: Date.now(),
    title: "New Trouser Buckle",
    desc: "Rust-proof, high quality buckle...",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80"
  });
  renderProductInputs();
}

function removeProduct(index) {
  currentData.products.splice(index, 1);
  renderProductInputs();
}

function renderGalleryInputs() {
  const container = document.getElementById('admin-gallery');
  if (!currentData.gallery) currentData.gallery = [];
  container.innerHTML = currentData.gallery.map((imgUrl, index) => `
    <div class="admin-card-row" style="flex-direction:row; align-items:center;">
      <input type="text" placeholder="Image URL" value="${imgUrl}" onchange="currentData.gallery[${index}] = this.value" style="flex:1;">
      <button type="button" class="btn-delete" onclick="removeGalleryImage(${index})">Remove</button>
    </div>
  `).join('');
}

function addGalleryImage() {
  if (!currentData.gallery) currentData.gallery = [];
  currentData.gallery.push("https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80");
  renderGalleryInputs();
}

function removeGalleryImage(index) {
  currentData.gallery.splice(index, 1);
  renderGalleryInputs();
}

function renderStaffInputs() {
  const container = document.getElementById('admin-staff');
  container.innerHTML = currentData.staff.map((s, index) => `
    <div class="admin-card-row">
      <input type="text" placeholder="Staff Name" value="${s.name}" onchange="currentData.staff[${index}].name = this.value">
      <input type="text" placeholder="Role" value="${s.role}" onchange="currentData.staff[${index}].role = this.value">
      <input type="text" placeholder="Phone" value="${s.phone}" onchange="currentData.staff[${index}].phone = this.value">
      <button type="button" class="btn-delete" onclick="removeStaff(${index})">Remove</button>
    </div>
  `).join('');
}

function addStaff() {
  currentData.staff.push({ id: Date.now(), name: "New Staff", role: "Manager", phone: "" });
  renderStaffInputs();
}

function removeStaff(index) {
  currentData.staff.splice(index, 1);
  renderStaffInputs();
}

async function saveAllData() {
  currentData.businessName = document.getElementById('businessName').value;
  currentData.heroTitle = document.getElementById('heroTitle').value;
  currentData.heroSubtitle = document.getElementById('heroSubtitle').value;
  currentData.whatsappNumber = document.getElementById('whatsappNumber').value;
  currentData.address = document.getElementById('address').value;
  currentData.mapUrl = document.getElementById('mapUrl').value;

  const res = await fetch('/api/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: savedAdminPassword, data: currentData })
  });

  if (res.ok) {
    alert("Website content successfully updated!");
  } else {
    alert("Failed to update! Check password.");
  }
}