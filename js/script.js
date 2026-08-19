/* =========================================================
   THIỆP MỜI LỄ KỶ YẾU — script.js
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. MỞ THIỆP ---------- */
  var opening = document.getElementById('opening');
  var btnOpen = document.getElementById('btnOpen');
  var bgm = document.getElementById('bgm');
  var musicToggle = document.getElementById('musicToggle');

  function tryPlay() {
    if (!bgm || !bgm.querySelector('source').src) return;
    bgm.play().then(function () {
      musicToggle.classList.add('playing');
    }).catch(function () {/* trình duyệt chặn autoplay */});
  }

  btnOpen.addEventListener('click', function () {
    opening.classList.add('is-hidden');
    document.body.style.overflow = '';
    tryPlay();
    startPetals();
  });

  /* ---------- 2. NHẠC NỀN ---------- */
  musicToggle.addEventListener('click', function () {
    if (!bgm || !bgm.querySelector('source').src) {
      alert('Chưa gắn file nhạc. Hãy thêm đường dẫn nhạc trong thẻ <source> ở index.html.');
      return;
    }
    if (bgm.paused) {
      bgm.play();
      musicToggle.classList.add('playing');
    } else {
      bgm.pause();
      musicToggle.classList.remove('playing');
    }
  });

  /* ---------- 3. ĐẾM NGƯỢC ---------- */
  var cd = document.getElementById('cd');
  if (cd) {
    var target = new Date(cd.getAttribute('data-date')).getTime();
    var elD = document.getElementById('cdD'), elH = document.getElementById('cdH'),
        elM = document.getElementById('cdM'), elS = document.getElementById('cdS');
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    function tick() {
      var diff = target - Date.now();
      if (diff < 0) diff = 0;
      var d = Math.floor(diff / 86400000);
      var h = Math.floor(diff % 86400000 / 3600000);
      var m = Math.floor(diff % 3600000 / 60000);
      var s = Math.floor(diff % 60000 / 1000);
      elD.textContent = pad(d); elH.textContent = pad(h);
      elM.textContent = pad(m); elS.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 4. REVEAL KHI CUỘN ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---------- 5. CÁNH HOA / CONFETTI RƠI ---------- */
  var petalsBox = document.getElementById('petals');
  var GLYPHS = ['🌿', '✿', '❀', '🎓', '✦', '🍃'];
  var petalTimer = null;
  function startPetals() {
    if (petalTimer) return;
    petalTimer = setInterval(function () {
      var p = document.createElement('span');
      p.className = 'petal';
      p.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      p.style.left = Math.random() * 100 + 'vw';
      var dur = 6 + Math.random() * 6;
      p.style.animationDuration = dur + 's';
      p.style.fontSize = (12 + Math.random() * 16) + 'px';
      petalsBox.appendChild(p);
      setTimeout(function () { p.remove(); }, dur * 1000);
    }, 650);
  }

  /* ---------- 6. GALLERY LIGHTBOX ---------- */
  var figs = Array.prototype.slice.call(document.querySelectorAll('.ph'));
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var curIdx = 0;
  function openLB(i) {
    curIdx = i;
    lbImg.src = figs[i].getAttribute('data-src');
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLB() { lb.hidden = true; document.body.style.overflow = ''; }
  function step(n) { curIdx = (curIdx + n + figs.length) % figs.length; lbImg.src = figs[curIdx].getAttribute('data-src'); }
  figs.forEach(function (f, i) { f.addEventListener('click', function () { openLB(i); }); });
  document.getElementById('lbClose').addEventListener('click', closeLB);
  document.getElementById('lbPrev').addEventListener('click', function () { step(-1); });
  document.getElementById('lbNext').addEventListener('click', function () { step(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  /* ---------- 7. XÁC NHẬN THAM DỰ ---------- */
  var rsvpForm = document.getElementById('rsvpForm');
  var rsvpOk = document.getElementById('rsvpOk');
  rsvpForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('rName').value.trim();
    if (!name) { document.getElementById('rName').focus(); return; }
    // Lưu tạm trong bộ nhớ phiên (chưa gửi đi đâu).
    // Muốn nhận phản hồi thật: nối tới Google Form / Google Sheet / API của bạn.
    var data = {
      name: name,
      phone: document.getElementById('rPhone').value.trim(),
      attend: rsvpForm.querySelector('input[name="attend"]:checked').value,
      guests: document.getElementById('rGuests').value
    };
    console.log('RSVP:', data);
    rsvpForm.querySelectorAll('input,select,button').forEach(function (el) { el.disabled = true; });
    rsvpOk.hidden = false;
  });

  /* ---------- 8. LỜI NHẮN / SỔ LƯU BÚT ---------- */
  var wishForm = document.getElementById('wishForm');
  var wishList = document.getElementById('wishList');
  var seed = [
    { name: 'Minh Anh', msg: 'Nhớ mãi những ngày trốn học đi ăn chè! Hẹn gặp cả lớp nhé 🥹' },
    { name: 'Quốc Bảo', msg: '3 năm thanh xuân rực rỡ. Chắc chắn có mặt đúng giờ!' }
  ];
  function renderWish(w, prepend) {
    var div = document.createElement('div');
    div.className = 'wish';
    var n = document.createElement('p'); n.className = 'wish__name'; n.textContent = w.name;
    var m = document.createElement('p'); m.className = 'wish__msg'; m.textContent = w.msg;
    div.appendChild(n); div.appendChild(m);
    if (prepend) wishList.insertBefore(div, wishList.firstChild);
    else wishList.appendChild(div);
  }
  seed.forEach(function (w) { renderWish(w, false); });
  wishForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('wName').value.trim();
    var msg = document.getElementById('wMsg').value.trim();
    if (!name || !msg) return;
    renderWish({ name: name, msg: msg }, true);
    wishForm.reset();
  });

  /* Khóa cuộn khi còn màn mở thiệp */
  document.body.style.overflow = 'hidden';
});
