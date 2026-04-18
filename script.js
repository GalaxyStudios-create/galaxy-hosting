// ============================================
// 🌌 GALAXY HOSTING — JavaScript
// ============================================

// ===== PARTICLES =====
function createParticles() {
    const container = document.getElementById('particles');
    const count = 50;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.width = (Math.random() * 3 + 1) + 'px';
        particle.style.height = particle.style.width;

        const colors = ['#7c3aed', '#06b6d4', '#f472b6', '#a78bfa', '#ffffff'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(particle);
    }
}
createParticles();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU =====
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
    });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            if (scrollY >= top && scrollY < top + height) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-count'));
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = start + (target - start) * eased;

            if (isDecimal) {
                counter.textContent = current.toFixed(1);
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    });
}

// Intersection Observer for counters
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ===== COPY ADDRESS =====
function copyAddress() {
    const address = document.getElementById('serverAddress').textContent;
    navigator.clipboard.writeText(address).then(() => {
        showNotification('✅ Адрес скопирован: ' + address);
    }).catch(() => {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = address;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('✅ Адрес скопирован!');
    });
}

// ===== NOTIFICATION =====
function showNotification(text) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    notificationText.textContent = text;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ===== PLAN TOGGLE =====
const planToggle = document.getElementById('planToggle');
const monthlyLabel = document.getElementById('monthlyLabel');
const yearlyLabel = document.getElementById('yearlyLabel');

planToggle.addEventListener('change', () => {
    const isYearly = planToggle.checked;

    document.querySelectorAll('.monthly-price').forEach(el => {
        el.style.display = isYearly ? 'none' : 'inline';
    });
    document.querySelectorAll('.yearly-price').forEach(el => {
        el.style.display = isYearly ? 'inline' : 'none';
    });

    monthlyLabel.classList.toggle('active', !isYearly);
    yearlyLabel.classList.toggle('active', isYearly);
});

// ===== FAQ =====
function toggleFaq(button) {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
    });

    // Open clicked (if wasn't active)
    if (!isActive) {
        item.classList.add('active');
    }
}

// ===== SERVER CREATOR =====
const serverNameInput = document.getElementById('serverName');
const gameSelect = document.getElementById('gameSelect');
const ramSlider = document.getElementById('ramSlider');
const slotsSlider = document.getElementById('slotsSlider');

const previewName = document.getElementById('previewName');
const previewServerName = document.getElementById('previewServerName');
const previewRam = document.getElementById('previewRam');
const previewSlots = document.getElementById('previewSlots');
const previewGame = document.getElementById('previewGame');
const previewPrice = document.getElementById('previewPrice');
const ramValue = document.getElementById('ramValue');
const slotsValue = document.getElementById('slotsValue');

const gameNames = {
    'minecraft': 'Minecraft',
    'minecraft-be': 'MC Bedrock',
    'cs2': 'CS 2',
    'rust': 'Rust',
    'dayz': 'DayZ',
    'terraria': 'Terraria',
    'valheim': 'Valheim',
    'ark': 'ARK'
};

function updatePreview() {
    const name = serverNameInput.value || 'Мой крутой сервер';
    const ram = ramSlider.value;
    const slots = slotsSlider.value;
    const game = gameSelect.value;

    previewName.textContent = name;

    // Create server address from name
    const cleanName = serverNameInput.value
        .replace(/[^a-zA-Zа-яА-Я0-9]/g, '')
        .substring(0, 15) || 'MyServer';
    previewServerName.textContent = cleanName;

    previewRam.textContent = ram + ' ГБ';
    previewSlots.textContent = '0/' + slots;
    previewGame.textContent = gameNames[game] || game;

    ramValue.textContent = ram;
    slotsValue.textContent = slots;

    // Calculate price
    const basePrice = 49;
    const ramPrice = ram * 30;
    const slotsPrice = Math.ceil(slots / 10) * 5;
    const totalPrice = basePrice + ramPrice + slotsPrice;
    previewPrice.textContent = totalPrice + '₽/мес';
}

serverNameInput.addEventListener('input', updatePreview);
gameSelect.addEventListener('change', updatePreview);
ramSlider.addEventListener('input', updatePreview);
slotsSlider.addEventListener('input', updatePreview);

// Location selection
document.querySelectorAll('.location-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.location-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
    });
});

// Initial update
updatePreview();

// ===== CREATE SERVER =====
function createServer() {
    const name = serverNameInput.value || 'Мой крутой сервер';
    showNotification(`🚀 Сервер "${name}" создаётся... Это демо-версия!`);

    // Button animation
    const btn = document.querySelector('.btn-create');
    btn.textContent = '⏳ Создаётся...';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        btn.innerHTML = '🚀 Создать сервер';
        btn.style.pointerEvents = 'auto';
        showNotification(`✅ Сервер "${name}" успешно создан! (Демо)`);
    }, 2000);
}

// ===== SEND FORM =====
function sendForm(event) {
    event.preventDefault();
    showNotification('📧 Сообщение отправлено! Мы ответим в течение 24 часов.');
    event.target.reset();
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply to feature cards, plan cards, etc.
document.querySelectorAll('.feature-card, .plan-card, .review-card, .faq-item, .contact-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.1}s`;
    scrollObserver.observe(el);
});

// ===== SMOOTH SCROLL for all anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== GAMES BAR DUPLICATION (for infinite scroll) =====
const gamesScroll = document.querySelector('.games-scroll');
if (gamesScroll) {
    const items = gamesScroll.innerHTML;
    gamesScroll.innerHTML = items + items;
}

// ===== CONSOLE LOG =====
console.log('%c🌌 Galaxy Hosting', 'font-size: 24px; font-weight: bold; color: #7c3aed;');
console.log('%cПривет! Добро пожаловать в Galaxy Hosting!', 'font-size: 14px; color: #06b6d4;');
