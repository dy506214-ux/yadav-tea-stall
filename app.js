/* ══════════════════════════════════════════════════════════
   YADAV TEA STALL — APP.JS
   State · Cart · Menu · Reviews · Admin Panel · Animations
══════════════════════════════════════════════════════════ */

/* ── DEFAULT DATA ── */
const DEFAULT_TEA_MENU = [
  { name: 'स्पेशल चाय', emoji: '☕', desc: 'हमारी सिग्नेचर ब्लेंड, ताजे मसालों के साथ', price: '₹15', priceNum: 15, type: 'tea' },
  { name: 'अदरक चाय',   emoji: '🫚', desc: 'ताजे अदरक का तीखा और ताजगी भरा स्वाद',    price: '₹15', priceNum: 15, type: 'tea' },
  { name: 'इलायची चाय', emoji: '🌿', desc: 'सुगंधित इलायची के साथ मीठी और सुखद चाय',  price: '₹15', priceNum: 15, type: 'tea' },
  { name: 'कुल्हड़ चाय', emoji: '🏺', desc: 'मिट्टी के कुल्हड़ में परोसी गई विशेष चाय', price: '₹20', priceNum: 20, type: 'tea' },
  { name: 'मसाला चाय',  emoji: '🌶️', desc: 'मसालों के मिश्रण से बनी पारंपरिक चाय',    price: '₹15', priceNum: 15, type: 'tea' },
  { name: 'दूध चाय',    emoji: '🥛', desc: 'मलाईदार और मीठी भरपूर दूध वाली चाय',     price: '₹12', priceNum: 12, type: 'tea' },
];
const DEFAULT_SNACKS_MENU = [
  { name: 'समोसा',         emoji: '🥟', desc: 'कुरकुरा, तला हुआ और स्वादिष्ट समोसा',   price: '₹10', priceNum: 10, type: 'snacks' },
  { name: 'बिस्किट',       emoji: '🍪', desc: 'चाय के साथ परफेक्ट बिस्किट',            price: '₹5',  priceNum: 5,  type: 'snacks' },
  { name: 'ब्रेड पकौड़ा',   emoji: '🍞', desc: 'गरमागरम मसालेदार ब्रेड पकौड़ा',         price: '₹15', priceNum: 15, type: 'snacks' },
  { name: 'नमकीन',         emoji: '🥜', desc: 'कुरकुरी मिक्स नमकीन और सेव',            price: '₹10', priceNum: 10, type: 'snacks' },
];

const DEFAULT_REVIEWS = [
  { name: 'राहुल वर्मा',    rating: 5, msg: 'बेस्ट चाय इन बरेली! अदरक वाली चाय का स्वाद लाजवाब है। रोज आता हूँ।',    date: '15 मई 2025', approved: true },
  { name: 'प्रिया शर्मा',   rating: 5, msg: 'कुल्हड़ चाय पीकर मज़ा आ गया! बहुत ही शुद्ध और ताज़ी चाय मिलती है यहाँ।', date: '10 मई 2025', approved: true },
  { name: 'अंकित गुप्ता',   rating: 5, msg: 'रात में भी खुला रहता है, यही सबसे बड़ी बात है। चाय मस्त है!',              date: '5 मई 2025',  approved: true },
  { name: 'सीमा पांडे',     rating: 4, msg: 'समोसे के साथ चाय बहुत पसंद आई। अवधेश जी बहुत अच्छे इंसान हैं।',           date: '28 अप्रैल 2025', approved: true },
  { name: 'विकास तिवारी',   rating: 5, msg: 'डिलीवरी बहुत जल्दी हुई। चाय गरमागरम मिली। बढ़िया सेवा!',                date: '20 अप्रैल 2025', approved: true },
  { name: 'नेहा अग्रवाल',   rating: 5, msg: 'बरेली की सबसे अच्छी चाय! इलायची चाय बेहद सुगंधित है।',                   date: '12 अप्रैल 2025', approved: true },
];

/* ── LOCAL STORAGE HELPERS ── */
const LS = {
  get: (key, def) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
    catch { return def; }
  },
  set: (key, val) => {
    try { localStorage.setItem(key, JSON.stringify(val)); }
    catch { console.warn('LS write failed'); }
  },
};

/* ── APP STATE ── */
const State = {
  teaMenu:    LS.get('yts_tea',     DEFAULT_TEA_MENU),
  snacksMenu: LS.get('yts_snacks',  DEFAULT_SNACKS_MENU),
  reviews:    LS.get('yts_reviews', DEFAULT_REVIEWS),
  orders:     LS.get('yts_orders',  []),
  cart:       LS.get('yts_cart',    []),
  adminLoggedIn: false,
  currentTab:    'tea',
  reviewStarVal: 5,

  save() {
    LS.set('yts_tea',     this.teaMenu);
    LS.set('yts_snacks',  this.snacksMenu);
    LS.set('yts_reviews', this.reviews);
    LS.set('yts_orders',  this.orders);
    LS.set('yts_cart',    this.cart);
  },
};

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderMenuGrid('tea');
  renderReviews();
  initNavbar();
  initMobileDrawer();
  initScrollReveal();
  initStarPicker();
  updateCartBadge();
  loadOwnerPhoto();
});

/* ══════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════ */
function initNavbar() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  // Scroll effect
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);

    // Active link highlight
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (!link) return;
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      link.classList.toggle('active', scrollY >= top && scrollY < bottom);
    });
  });
}

/* ══════════════════════════════════════════════════════════
   MOBILE DRAWER
══════════════════════════════════════════════════════════ */
function initMobileDrawer() {
  const btn     = document.getElementById('hamburgerBtn');
  const drawer  = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn= document.getElementById('drawerClose');

  const open = () => {
    drawer.classList.add('open');
    overlay.classList.add('show');
    btn.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    btn.classList.remove('open');
    document.body.style.overflow = '';
  };

  btn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);

  // Close on link click
  document.querySelectorAll('.drawer-link').forEach(a => {
    a.addEventListener('click', close);
  });
}

function closeMobileDrawer() {
  document.getElementById('mobileDrawer')?.classList.remove('open');
  document.getElementById('drawerOverlay')?.classList.remove('show');
  document.getElementById('hamburgerBtn')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.section, .why-card, .menu-card, .review-card, .contact-card, .owner-grid, .gallery-item');
  els.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════════════════
   MENU
══════════════════════════════════════════════════════════ */
function switchTab(tab, el) {
  State.currentTab = tab;
  document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderMenuGrid(tab);
}

function renderMenuGrid(tab) {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;
  const items = tab === 'tea' ? State.teaMenu : State.snacksMenu;
  if (!items.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-m);padding:40px;">कोई आइटम नहीं मिला।</p>';
    return;
  }
  grid.innerHTML = items.map((item, i) => `
    <div class="menu-card reveal" style="animation-delay:${i * 0.06}s">
      <div class="mc-content">
        <div class="mc-emoji">${item.emoji}</div>
        <div class="mc-name">${item.name}</div>
        <div class="mc-leaf">🍂</div>
        <div class="mc-desc">${item.desc}</div>
      </div>
      <div class="mc-divider"></div>
      <div class="mc-footer">
        <span class="mc-price">${item.price}</span>
        <button class="mc-add" onclick="addToCart('${item.name.replace(/'/g, "\\'")}', '${tab}')">+ Add</button>
      </div>
    </div>
  `).join('');

  // Re-observe new cards
  document.querySelectorAll('.menu-card.reveal').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    setTimeout(() => {
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 50);
  });
}

/* ══════════════════════════════════════════════════════════
   CART
══════════════════════════════════════════════════════════ */
function addToCart(itemName, type) {
  const all = [...State.teaMenu, ...State.snacksMenu];
  const item = all.find(i => i.name === itemName);
  if (!item) return;

  const existing = State.cart.find(c => c.name === itemName);
  if (existing) {
    existing.qty++;
  } else {
    State.cart.push({ ...item, qty: 1 });
  }
  State.save();
  updateCartBadge();
  showToast(`✅ ${itemName} कार्ट में जोड़ा गया!`);
  openCart();
}

function removeFromCart(itemName) {
  State.cart = State.cart.filter(c => c.name !== itemName);
  State.save();
  updateCartBadge();
  renderCart();
}

function changeQty(itemName, delta) {
  const item = State.cart.find(c => c.name === itemName);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(itemName);
    return;
  }
  State.save();
  renderCart();
}

function updateCartBadge() {
  const total = State.cart.reduce((s, c) => s + c.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.textContent = total;
    b.style.display = total > 0 ? 'flex' : 'none';
  });
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const totalEl   = document.getElementById('totalPrice');
  const submitBtn = document.getElementById('btnSubmitOrder');
  const checkoutForm = document.getElementById('checkoutForm');

  if (!container) return;

  if (!State.cart.length) {
    container.innerHTML = '<div class="cart-empty">🛒 आपकी कार्ट खाली है।<br>मेन्यू से कुछ आइटम जोड़ें।</div>';
    if (totalEl) totalEl.textContent = '₹0';
    if (submitBtn) submitBtn.style.display = 'none';
    if (checkoutForm) checkoutForm.style.display = 'none';
    return;
  }

  const total = State.cart.reduce((s, c) => s + c.priceNum * c.qty, 0);
  container.innerHTML = State.cart.map(item => `
    <div class="cart-item-row">
      <span class="ci-emoji">${item.emoji}</span>
      <span class="ci-name">${item.name}</span>
      <div class="ci-qty-ctrl">
        <button class="ci-qty-btn" onclick="changeQty('${item.name.replace(/'/g, "\\'")}', -1)">−</button>
        <span class="ci-qty">${item.qty}</span>
        <button class="ci-qty-btn" onclick="changeQty('${item.name.replace(/'/g, "\\'")}', 1)">+</button>
      </div>
      <span class="ci-price">₹${item.priceNum * item.qty}</span>
    </div>
  `).join('');

  if (totalEl) totalEl.textContent = `₹${total}`;
  if (checkoutForm) checkoutForm.style.display = 'block';
  if (submitBtn) submitBtn.style.display = 'flex';
}

function openCart() {
  renderCart();
  document.getElementById('cartModal')?.classList.add('open');
}
function closeCart() {
  document.getElementById('cartModal')?.classList.remove('open');
}

function submitOrder() {
  const name    = document.getElementById('custName')?.value.trim();
  const phone   = document.getElementById('custPhone')?.value.trim();
  const address = document.getElementById('custAddress')?.value.trim();
  const payment = document.getElementById('paymentMethod')?.value;

  if (!name)    { showToast('⚠️ कृपया अपना नाम दर्ज करें।', 'warn'); return; }
  if (!phone || phone.length < 10) { showToast('⚠️ सही मोबाइल नंबर दर्ज करें।', 'warn'); return; }
  if (!address) { showToast('⚠️ डिलीवरी का पता दर्ज करें।', 'warn'); return; }
  if (!State.cart.length) { showToast('⚠️ कार्ट खाली है।', 'warn'); return; }

  const orderId = 'YTS-' + Date.now();
  const total = State.cart.reduce((s, c) => s + c.priceNum * c.qty, 0);

  const itemsText = State.cart.map(c => `• ${c.emoji} ${c.name} ×${c.qty} = ₹${c.priceNum * c.qty}`).join('\n');
  const msg = encodeURIComponent(
    `🛒 *नया ऑर्डर – यादव टी स्टॉल*\n\n` +
    `📋 *ऑर्डर ID:* ${orderId}\n` +
    `👤 *नाम:* ${name}\n` +
    `📞 *फ़ोन:* ${phone}\n` +
    `📍 *पता:* ${address}\n` +
    `💳 *भुगतान:* ${payment}\n\n` +
    `🍵 *ऑर्डर आइटम्स:*\n${itemsText}\n\n` +
    `💰 *कुल: ₹${total}*\n\n` +
    `धन्यवाद! 🙏`
  );

  // Save order
  const order = {
    id: orderId, name, phone, address, payment,
    items: [...State.cart],
    total, status: 'pending',
    time: new Date().toLocaleString('hi-IN'),
  };
  State.orders.push(order);

  // Clear cart
  State.cart = [];
  State.save();
  updateCartBadge();

  // Open WhatsApp
  window.open(`https://wa.me/917310231534?text=${msg}`, '_blank');

  closeCart();

  // Show tracking
  setTimeout(() => {
    document.getElementById('trackingOrderId').textContent = orderId;
    resetTrackingSteps();
    document.getElementById('track-1').classList.add('done');
    document.getElementById('trackingModal')?.classList.add('open');
  }, 500);

  showToast('🎉 ऑर्डर WhatsApp पर भेजा जा रहा है!', 'success');
}

function resetTrackingSteps() {
  ['track-1','track-2','track-3','track-4'].forEach(id => {
    document.getElementById(id)?.classList.remove('done');
  });
}
function closeTracking() {
  document.getElementById('trackingModal')?.classList.remove('open');
}

/* ══════════════════════════════════════════════════════════
   REVIEWS
══════════════════════════════════════════════════════════ */
function initStarPicker() {
  const stars = document.querySelectorAll('#starPicker .star');
  stars.forEach((star, i) => {
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, j) => s.classList.toggle('lit', j <= i));
    });
    star.addEventListener('mouseleave', () => {
      const val = parseInt(document.getElementById('reviewStarVal')?.value || 5);
      stars.forEach((s, j) => s.classList.toggle('lit', j < val));
    });
  });
  setReviewStar(5);
}

function setReviewStar(val) {
  State.reviewStarVal = val;
  const input = document.getElementById('reviewStarVal');
  if (input) input.value = val;
  const ratingSelect = document.getElementById('reviewRating');
  if (ratingSelect) ratingSelect.value = Math.min(val, 5);
  document.querySelectorAll('#starPicker .star').forEach((s, i) => {
    s.classList.toggle('lit', i < val);
  });
}

function renderReviews() {
  const grid = document.getElementById('reviewsGrid');
  if (!grid) return;
  const approved = State.reviews.filter(r => r.approved);
  if (!approved.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-m);">अभी तक कोई समीक्षा नहीं है।</p>';
    return;
  }
  grid.innerHTML = approved.map(r => `
    <div class="review-card">
      <div class="rc-top">
        <div class="rc-avatar">${r.name.charAt(0)}</div>
        <div>
          <div class="rc-name">${r.name}</div>
          <div class="rc-stars">${'⭐'.repeat(r.rating)}</div>
        </div>
      </div>
      <p class="rc-msg">"${r.msg}"</p>
      <div class="rc-date">📅 ${r.date}</div>
    </div>
  `).join('');
}

function submitReview(e) {
  e.preventDefault();
  const name   = document.getElementById('reviewName')?.value.trim();
  const rating = parseInt(document.getElementById('reviewRating')?.value || State.reviewStarVal);
  const msg    = document.getElementById('reviewMsg')?.value.trim();

  if (!name || !msg) { showToast('⚠️ कृपया सभी फ़ील्ड भरें।', 'warn'); return; }

  const review = {
    name, rating, msg,
    date: new Date().toLocaleDateString('hi-IN', { day:'numeric', month:'long', year:'numeric' }),
    approved: false,
  };
  State.reviews.push(review);
  State.save();

  e.target.reset();
  setReviewStar(5);
  showToast('🙏 समीक्षा सबमिट की गई! एडमिन की स्वीकृति के बाद दिखेगी।', 'success');
}

/* ══════════════════════════════════════════════════════════
   TOAST NOTIFICATIONS
══════════════════════════════════════════════════════════ */
let toastTimer = null;
function showToast(msg, type = 'info') {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.style.cssText = `
      position:fixed; bottom:calc(var(--bticker-h) + 16px); left:50%;
      transform:translateX(-50%) translateY(20px);
      background:#1E0F06; color:#fff;
      padding:13px 28px; border-radius:50px;
      font-size:14px; font-weight:600;
      box-shadow:0 8px 32px rgba(43,27,16,.3);
      z-index:9999; opacity:0;
      transition:all .3s ease;
      white-space:nowrap;
      font-family:'Noto Sans Devanagari','Mukta',sans-serif;
      max-width:90vw; text-align:center;
    `;
    document.body.appendChild(toast);
  }
  if (type === 'success') toast.style.background = '#1B5E20';
  else if (type === 'warn') toast.style.background = '#E65100';
  else toast.style.background = '#2B1B10';

  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3200);
}

/* ══════════════════════════════════════════════════════════
   ADMIN PORTAL
══════════════════════════════════════════════════════════ */
function openAdminPortal() {
  const overlay = document.getElementById('adminOverlay');
  if (!overlay) return;
  overlay.classList.add('open');

  if (State.adminLoggedIn) {
    showAdminDashboard();
  } else {
    document.getElementById('adminLoginPanel').style.display = 'flex';
    document.getElementById('adminPanelBody').style.display = 'none';
    document.getElementById('btnLogoutAdmin').style.display = 'none';
  }
}
function closeAdminPortal() {
  document.getElementById('adminOverlay')?.classList.remove('open');
}

function handleAdminLogin(e) {
  e.preventDefault();
  const user = document.getElementById('adminUser')?.value.trim();
  const pass = document.getElementById('adminPass')?.value.trim();
  if (user === 'admin' && pass === 'admin') {
    State.adminLoggedIn = true;
    showAdminDashboard();
  } else {
    showToast('❌ गलत यूजरनेम या पासवर्ड!', 'warn');
  }
}

function handleAdminLogout() {
  State.adminLoggedIn = false;
  document.getElementById('adminLoginPanel').style.display = 'flex';
  document.getElementById('adminPanelBody').style.display = 'none';
  document.getElementById('btnLogoutAdmin').style.display = 'none';
  document.getElementById('adminUser').value = '';
  document.getElementById('adminPass').value = '';
}

function showAdminDashboard() {
  document.getElementById('adminLoginPanel').style.display = 'none';
  document.getElementById('adminPanelBody').style.display = 'flex';
  document.getElementById('btnLogoutAdmin').style.display = 'block';
  refreshAdminStats();
  renderAdminOrders();
  renderAdminMenu();
  renderAdminReviews();
  renderAnalyticsChart();
}

function refreshAdminStats() {
  const totalOrders  = State.orders.length;
  const totalRevenue = State.orders.reduce((s, o) => s + (o.total || 0), 0);
  const pendingRev   = State.reviews.filter(r => !r.approved).length;
  const totalMenu    = State.teaMenu.length + State.snacksMenu.length;

  setText('statTotalOrders',   totalOrders);
  setText('statTotalRevenue',  `₹${totalRevenue}`);
  setText('statPendingReviews',pendingRev);
  setText('statTotalMenu',     totalMenu);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function switchAdminPane(e, pane) {
  document.querySelectorAll('.admin-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.asb-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`pane-${pane}`)?.classList.add('active');
  e.currentTarget.classList.add('active');

  if (pane === 'orders')    renderAdminOrders();
  if (pane === 'menu')      renderAdminMenu();
  if (pane === 'reviews')   renderAdminReviews();
  if (pane === 'analytics') renderAnalyticsChart();
  if (pane === 'dashboard') refreshAdminStats();
}

/* ── Admin Orders ── */
function renderAdminOrders() {
  const tbody = document.getElementById('adminOrdersTableBody');
  if (!tbody) return;
  if (!State.orders.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-m);">कोई ऑर्डर नहीं मिला।</td></tr>';
    return;
  }
  tbody.innerHTML = State.orders.slice().reverse().map(o => {
    const itemStr = o.items?.map(i => `${i.emoji} ${i.name} ×${i.qty}`).join(', ') || '—';
    return `
      <tr>
        <td><strong>${o.id}</strong><br><span style="font-size:11px;color:var(--text-m)">${o.time || ''}</span></td>
        <td>${o.name}<br><a href="tel:${o.phone}" style="color:var(--gold-500);font-size:12px;">${o.phone}</a></td>
        <td style="max-width:200px;font-size:12px;">${itemStr}</td>
        <td><strong>₹${o.total}</strong></td>
        <td><span class="status-badge status-${o.status === 'pending' ? 'pending' : o.status === 'accepted' ? 'accepted' : 'delivered'}">${statusLabel(o.status)}</span></td>
        <td>
          <select onchange="updateOrderStatus('${o.id}', this.value)" style="font-size:12px;padding:5px;border:1px solid var(--border);border-radius:6px;background:var(--bg2);">
            <option value="pending"   ${o.status==='pending'   ?'selected':''}>⏳ Pending</option>
            <option value="accepted"  ${o.status==='accepted'  ?'selected':''}>✅ Accepted</option>
            <option value="preparing" ${o.status==='preparing' ?'selected':''}>👨‍🍳 Preparing</option>
            <option value="delivered" ${o.status==='delivered' ?'selected':''}>🚀 Delivered</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');
}

function statusLabel(s) {
  const m = {pending:'⏳ Pending', accepted:'✅ Accepted', preparing:'👨‍🍳 Preparing', delivered:'🚀 Delivered'};
  return m[s] || s;
}

function updateOrderStatus(orderId, newStatus) {
  const order = State.orders.find(o => o.id === orderId);
  if (order) { order.status = newStatus; State.save(); }
  showToast(`✅ ऑर्डर ${orderId} अपडेट किया गया।`, 'success');
  refreshAdminStats();
}

/* ── Admin Menu ── */
function renderAdminMenu() {
  const tbody = document.getElementById('adminMenuTableBody');
  if (!tbody) return;
  const all = [...State.teaMenu, ...State.snacksMenu];
  tbody.innerHTML = all.map(item => `
    <tr>
      <td>${item.emoji}</td>
      <td><strong>${item.name}</strong></td>
      <td>${item.type === 'tea' ? '🍵 चाय' : '🥟 स्नैक्स'}</td>
      <td>${item.price}</td>
      <td>
        <button onclick="openEditMenuModal('${item.name.replace(/'/g,"\\'")}','${item.type}')" style="padding:5px 12px;background:var(--gold-100);color:var(--gold-500);border:1px solid var(--gold-300);border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;margin-right:6px;">✏️ संपादित</button>
        <button onclick="deleteMenuItem('${item.name.replace(/'/g,"\\'")}','${item.type}')" style="padding:5px 12px;background:var(--saffron-lt);color:var(--saffron);border:1px solid rgba(217,74,56,.2);border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">🗑️ हटाएं</button>
      </td>
    </tr>
  `).join('');
}

function openAddMenuModal() {
  document.getElementById('menuModalTitle').textContent = '➕ नया आइटम जोड़ें';
  document.getElementById('menuForm').reset();
  document.getElementById('oldItemName').value = '';
  document.getElementById('oldItemType').value = '';
  document.getElementById('menuItemModal').classList.add('open');
}

function openEditMenuModal(name, type) {
  const arr = type === 'tea' ? State.teaMenu : State.snacksMenu;
  const item = arr.find(i => i.name === name);
  if (!item) return;
  document.getElementById('menuModalTitle').textContent = '✏️ आइटम संपादित करें';
  document.getElementById('oldItemName').value = name;
  document.getElementById('oldItemType').value = type;
  document.getElementById('menuItemName').value  = item.name;
  document.getElementById('menuItemEmoji').value = item.emoji;
  document.getElementById('menuItemType').value  = item.type;
  document.getElementById('menuItemPrice').value    = item.price;
  document.getElementById('menuItemPriceNum').value = item.priceNum;
  document.getElementById('menuItemDesc').value  = item.desc;
  document.getElementById('menuItemModal').classList.add('open');
}

function closeAddMenuModal() {
  document.getElementById('menuItemModal').classList.remove('open');
}

function saveMenuItem(e) {
  e.preventDefault();
  const oldName = document.getElementById('oldItemName').value;
  const oldType = document.getElementById('oldItemType').value;
  const newItem = {
    name:     document.getElementById('menuItemName').value.trim(),
    emoji:    document.getElementById('menuItemEmoji').value.trim(),
    type:     document.getElementById('menuItemType').value,
    price:    document.getElementById('menuItemPrice').value.trim(),
    priceNum: parseInt(document.getElementById('menuItemPriceNum').value),
    desc:     document.getElementById('menuItemDesc').value.trim(),
  };

  if (oldName) {
    // Edit mode
    const arr = oldType === 'tea' ? State.teaMenu : State.snacksMenu;
    const idx = arr.findIndex(i => i.name === oldName);
    if (idx !== -1) {
      if (newItem.type !== oldType) {
        arr.splice(idx, 1);
        (newItem.type === 'tea' ? State.teaMenu : State.snacksMenu).push(newItem);
      } else {
        arr[idx] = newItem;
      }
    }
  } else {
    // Add mode
    (newItem.type === 'tea' ? State.teaMenu : State.snacksMenu).push(newItem);
  }

  State.save();
  closeAddMenuModal();
  renderAdminMenu();
  renderMenuGrid(State.currentTab);
  refreshAdminStats();
  showToast(`✅ आइटम "${newItem.name}" सुरक्षित किया गया!`, 'success');
}

function deleteMenuItem(name, type) {
  if (!confirm(`क्या आप "${name}" को हटाना चाहते हैं?`)) return;
  if (type === 'tea') {
    State.teaMenu = State.teaMenu.filter(i => i.name !== name);
  } else {
    State.snacksMenu = State.snacksMenu.filter(i => i.name !== name);
  }
  State.save();
  renderAdminMenu();
  renderMenuGrid(State.currentTab);
  refreshAdminStats();
  showToast(`🗑️ "${name}" हटाया गया।`, 'info');
}

/* ── Admin Reviews ── */
function renderAdminReviews() {
  const tbody = document.getElementById('adminReviewsTableBody');
  if (!tbody) return;
  if (!State.reviews.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text-m);">कोई समीक्षा नहीं।</td></tr>';
    return;
  }
  tbody.innerHTML = State.reviews.slice().reverse().map((r, i) => {
    const realIdx = State.reviews.length - 1 - i;
    return `
      <tr>
        <td><strong>${r.name}</strong></td>
        <td>${'⭐'.repeat(r.rating)}</td>
        <td style="max-width:240px;font-size:12.5px;">"${r.msg}"</td>
        <td><span class="status-badge ${r.approved ? 'status-approved' : 'status-pending-r'}">${r.approved ? '✅ स्वीकृत' : '⏳ लंबित'}</span></td>
        <td>
          ${!r.approved ? `<button onclick="approveReview(${realIdx})" style="padding:5px 12px;background:var(--green-lt);color:var(--green);border:1px solid rgba(46,125,50,.2);border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;margin-right:6px;">✅ स्वीकृत</button>` : ''}
          <button onclick="deleteReview(${realIdx})" style="padding:5px 12px;background:var(--saffron-lt);color:var(--saffron);border:1px solid rgba(217,74,56,.2);border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">🗑️ हटाएं</button>
        </td>
      </tr>
    `;
  }).join('');
}

function approveReview(idx) {
  if (State.reviews[idx]) {
    State.reviews[idx].approved = true;
    State.save();
    renderAdminReviews();
    renderReviews();
    refreshAdminStats();
    showToast('✅ समीक्षा स्वीकृत की गई!', 'success');
  }
}

function deleteReview(idx) {
  if (!confirm('क्या आप इस समीक्षा को हटाना चाहते हैं?')) return;
  State.reviews.splice(idx, 1);
  State.save();
  renderAdminReviews();
  renderReviews();
  refreshAdminStats();
  showToast('🗑️ समीक्षा हटाई गई।', 'info');
}

/* ── Analytics Chart ── */
function renderAnalyticsChart() {
  const box = document.getElementById('analyticsChartBox');
  if (!box) return;

  const byDay = {};
  State.orders.forEach(o => {
    const d = (o.time || '').split(',')[0] || 'अज्ञात';
    byDay[d] = (byDay[d] || 0) + (o.total || 0);
  });

  const entries = Object.entries(byDay).slice(-7);
  const maxVal = Math.max(...entries.map(e => e[1]), 1);

  if (!entries.length) {
    box.innerHTML = `<div style="text-align:center;padding:60px;color:var(--text-m);">
      <div style="font-size:48px;margin-bottom:16px;">📊</div>
      <p>अभी तक कोई ऑर्डर डेटा उपलब्ध नहीं है।<br><small>ऑर्डर मिलने पर यहाँ चार्ट दिखेगा।</small></p>
    </div>`;
    return;
  }

  box.innerHTML = `
    <h3 style="margin-bottom:24px;font-family:var(--font-hi);color:var(--text-h);">📈 पिछले ${entries.length} दिनों की बिक्री</h3>
    <div style="display:flex;align-items:flex-end;gap:12px;height:200px;padding-bottom:32px;position:relative;border-bottom:2px solid var(--border);">
      ${entries.map(([day, rev]) => `
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;">
          <span style="font-size:12px;font-weight:700;color:var(--gold-500);">₹${rev}</span>
          <div style="width:100%;height:${Math.round((rev/maxVal)*150)}px;background:linear-gradient(180deg,var(--gold-400),var(--gold-500));border-radius:6px 6px 0 0;transition:all .5s ease;"></div>
          <span style="font-size:10px;color:var(--text-m);margin-top:6px;">${day}</span>
        </div>
      `).join('')}
    </div>
  `;
}

/* ── Settings / Photo Upload ── */
function loadOwnerPhoto() {
  const photoBase64 = LS.get('yts_ownerPhoto', '');
  const imgEl = document.getElementById('ownerPhotoDisplay');
  const phEl = document.getElementById('ownerPlaceholder');
  if (!imgEl || !phEl) return;

  if (photoBase64) {
    imgEl.src = photoBase64;
    imgEl.style.display = 'block';
    phEl.style.display = 'none';
  } else {
    imgEl.src = '';
    imgEl.style.display = 'none';
    phEl.style.display = 'flex';
  }
}

function saveOwnerPhoto() {
  const fileInput = document.getElementById('ownerPhotoUpload');
  if (!fileInput.files || !fileInput.files[0]) {
    showToast('⚠️ कृपया पहले कोई फोटो चुनें।', 'warn');
    return;
  }
  
  const file = fileInput.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const base64 = e.target.result;
    LS.set('yts_ownerPhoto', base64);
    loadOwnerPhoto();
    showToast('✅ फोटो सफलता से अपडेट हो गई!', 'success');
  };
  
  reader.onerror = function() {
    showToast('❌ फोटो अपलोड करने में त्रुटि आई।', 'warn');
  };
  
  reader.readAsDataURL(file);
}

function removeOwnerPhoto() {
  if(!confirm('क्या आप अपनी फोटो हटाना चाहते हैं?')) return;
  localStorage.removeItem('yts_ownerPhoto');
  loadOwnerPhoto();
  showToast('🗑️ फोटो हटा दी गई।', 'info');
}
