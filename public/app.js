/* ═══════════════════════════════════════════
   NOVA DASHBOARD — app.js
   Client-side logic: API calls, animations
═══════════════════════════════════════════ */

// ─── Particle Canvas ────────────────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;
  const COLORS = ['rgba(56,189,248,', 'rgba(129,140,248,', 'rgba(52,211,153,'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.r  = Math.random() * 2 + 0.5;
      this.dx = (Math.random() - 0.5) * 0.4;
      this.dy = (Math.random() - 0.5) * 0.4;
      this.a  = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.dx; this.y += this.dy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.a + ')';
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56,189,248,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  animate();
})();

// ─── Uptime Clock ────────────────────────────────────────────────────────────
let serverStartTime = Date.now();

function formatUptime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function updateUptimeClock(serverUptime) {
  if (serverUptime !== undefined) {
    serverStartTime = Date.now() - serverUptime * 1000;
  }
  const elapsed = Math.floor((Date.now() - serverStartTime) / 1000);
  document.getElementById('uptimeDisplay').textContent = formatUptime(elapsed);
}

setInterval(() => updateUptimeClock(), 1000);

// ─── Footer Clock ─────────────────────────────────────────────────────────────
function updateFooterTime() {
  const now = new Date();
  document.getElementById('footerTime').textContent =
    now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) +
    ' — ' + now.toLocaleTimeString('en-IN');
}
updateFooterTime();
setInterval(updateFooterTime, 1000);

// ─── Toast Notification ───────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

// ─── Load Stats from API ──────────────────────────────────────────────────────
async function loadStats() {
  const btn = document.querySelector('.btn-refresh');
  if (btn) btn.disabled = true;

  try {
    const res = await fetch('/api/stats');
    const json = await res.json();

    if (!json.success) throw new Error('API error');

    const { data } = json;

    animateValue('stat-node',   data.nodeVersion);
    animateValue('stat-uptime', data.uptime);
    animateValue('stat-mem',    data.memoryUsage.used + ' MB');
    animateValue('stat-msgs',   data.totalMessages);

    updateUptimeClock(data.uptime);

    const d = new Date(data.serverTime);
    document.getElementById('lastUpdated').textContent =
      'Updated at ' + d.toLocaleTimeString('en-IN');

    showToast('Stats refreshed ✓', 'success');
  } catch (err) {
    showToast('Failed to load stats', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

function animateValue(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.transform = 'scale(0.8)';
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = target;
    el.style.transition = 'all 0.3s ease';
    el.style.transform = 'scale(1)';
    el.style.opacity = '1';
  }, 150);
}

// ─── Messages CRUD ────────────────────────────────────────────────────────────

// Character counter
document.getElementById('msgInput').addEventListener('input', function () {
  document.getElementById('charCount').textContent = `${this.value.length} / 300`;
});

// Enter key to send (Shift+Enter = newline)
document.getElementById('msgInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

async function loadMessages() {
  const list = document.getElementById('messagesList');
  list.innerHTML = `<div class="loading-msg"><div class="spinner"></div><span>Loading messages...</span></div>`;

  try {
    const res = await fetch('/api/messages');
    const json = await res.json();
    renderMessages(json.data || []);
  } catch {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not connect to server</p></div>`;
  }
}

function renderMessages(msgs) {
  const list = document.getElementById('messagesList');

  if (!msgs.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p>No messages yet. Send the first one!</p>
      </div>`;
    return;
  }

  list.innerHTML = msgs.reverse().map(msg => `
    <div class="message-item" id="msg-${msg.id}">
      <div class="msg-body">
        <p class="msg-text">${escapeHtml(msg.text)}</p>
        <span class="msg-time">${formatTime(msg.time)}</span>
      </div>
      <button class="msg-delete" onclick="deleteMessage(${msg.id})" title="Delete">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </div>
  `).join('');
}

async function sendMessage() {
  const input = document.getElementById('msgInput');
  const btn   = document.getElementById('sendBtn');
  const text  = input.value.trim();

  if (!text) {
    showToast('Please enter a message', 'error');
    input.focus();
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const json = await res.json();

    if (!json.success) throw new Error(json.error);

    input.value = '';
    document.getElementById('charCount').textContent = '0 / 300';
    showToast('Message sent! 🚀', 'success');
    await loadMessages();
    await loadStats();
  } catch (err) {
    showToast('Failed to send: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send`;
  }
}

async function deleteMessage(id) {
  const el = document.getElementById(`msg-${id}`);
  if (el) {
    el.style.opacity = '0.4';
    el.style.transform = 'translateX(20px)';
    el.style.transition = 'all 0.3s';
  }

  try {
    const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.success) throw new Error();
    showToast('Message deleted', 'info');
    await loadMessages();
    await loadStats();
  } catch {
    if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
    showToast('Delete failed', 'error');
  }
}

// ─── Hamburger Menu ────────────────────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ─── Active Nav on Scroll ──────────────────────────────────────────────────────
const sections = ['dashboard', 'stats', 'messages', 'about'];

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.offsetTop <= scrollY && el.offsetTop + el.offsetHeight > scrollY) {
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) link.classList.add('active');
    }
  });
});

// ─── Scroll to Section ─────────────────────────────────────────────────────────
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

// ─── Init ──────────────────────────────────────────────────────────────────────
loadStats();
loadMessages();
