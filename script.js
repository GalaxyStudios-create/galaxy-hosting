// ========================================
// GalaxyHosting - JavaScript
// ========================================

// ===== Инициализация =====
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    animateCounters();
    loadPlugins();
    loadPlayers();
    initScrollEffects();
});

// ===== Частицы =====
function createParticles() {
    const container = document.getElementById('particles');
    const count = 50;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';

        const colors = ['#6c5ce7', '#00cec9', '#a29bfe', '#81ecec', '#ffffff'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.opacity = Math.random() * 0.4 + 0.1;

        container.appendChild(particle);
    }
}

// ===== Навигация =====
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Скролл навигация
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        // Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll to top button
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        // Animate cards on scroll
        animateOnScroll();
    });

    // Закрыть меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('navLinks').classList.remove('active');
            document.getElementById('hamburger').classList.remove('active');
        });
    });
}

// ===== Анимация при скролле =====
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .plan-card, .step, .faq-item');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.style.opacity = '1';
            el.style.transform = el.classList.contains('plan-card') && el.classList.contains('popular')
                ? 'scale(1.05)'
                : 'translateY(0)';
        }
    });
}

// ===== Счетчики =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const isPercentage = target <= 100;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString() + (isPercentage && target === 99 ? '%' : '+');
    }, 25);
}

// ===== Модальные окна =====
function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
}

// Закрыть по клику на оверлей
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ESC для закрытия модалок
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

// ===== Формы =====
function handleLogin(e) {
    e.preventDefault();
    showNotification('Добро пожаловать! Перенаправление в панель...', 'success');
    closeModal('loginModal');

    setTimeout(() => {
        document.getElementById('panel').scrollIntoView({ behavior: 'smooth' });
    }, 1500);
}

function handleRegister(e) {
    e.preventDefault();
    showNotification('🎉 Аккаунт создан! Ваш сервер запускается...', 'success');
    closeModal('registerModal');

    setTimeout(() => {
        showNotification('✅ Сервер успешно создан! IP: myserver.galaxyhost.net', 'success');
    }, 2000);

    setTimeout(() => {
        document.getElementById('panel').scrollIntoView({ behavior: 'smooth' });
    }, 2500);
}

// ===== Уведомления =====
function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    notification.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
    container.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===== FAQ =====
function toggleFaq(element) {
    const isActive = element.classList.contains('active');

    // Закрыть все
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Открыть текущий (если не был активен)
    if (!isActive) {
        element.classList.add('active');
    }
}

// ===== Панель управления =====

// Переключение табов
function switchTab(event, tabName) {
    event.preventDefault();

    // Деактивировать все навигационные элементы
    document.querySelectorAll('.panel-nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Активировать текущий
    event.currentTarget.classList.add('active');

    // Скрыть все табы
    document.querySelectorAll('.panel-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Показать нужный таб
    document.getElementById('tab-' + tabName).classList.add('active');
}

// Консоль
function handleConsoleInput(event) {
    if (event.key === 'Enter') {
        sendCommand();
    }
}

function sendCommand() {
    const input = document.getElementById('consoleInput');
    const output = document.getElementById('consoleOutput');
    const command = input.value.trim();

    if (!command) return;

    // Добавить команду
    const cmdLine = document.createElement('div');
    cmdLine.className = 'console-line command';
    cmdLine.textContent = `> ${command}`;
    output.appendChild(cmdLine);

    // Обработать команду
    setTimeout(() => {
        const response = processCommand(command);
        const responseLine = document.createElement('div');
        responseLine.className = `console-line ${response.type}`;
        responseLine.textContent = response.text;
        output.appendChild(responseLine);
        output.scrollTop = output.scrollHeight;
    }, 200);

    input.value = '';
    output.scrollTop = output.scrollHeight;
}

function processCommand(cmd) {
    const command = cmd.toLowerCase();

    const responses = {
        'help': { text: '[Server] Команды: help, list, say, time, weather, gamemode, tp, give, op, ban, kick, stop, restart', type: 'info' },
        'list': { text: '[Server] Онлайн (12/50): Player123, Steve, Alex, Notch, Dream, Technoblade, Herobrine, xXGamerXx, CoolBuilder, RedstoneKing, DiamondMiner, ProPvP', type: 'info' },
        'stop': { text: '[Server] Останавливаем сервер...', type: 'warn' },
        'restart': { text: '[Server] Перезапуск сервера...', type: 'warn' },
        'time set day': { text: '[Server] Время установлено на 1000 (день)', type: 'success' },
        'time set night': { text: '[Server] Время установлено на 13000 (ночь)', type: 'success' },
        'weather clear': { text: '[Server] Погода изменена на ясную', type: 'success' },
        'weather rain': { text: '[Server] Погода изменена на дождливую', type: 'success' },
        'seed': { text: '[Server] Сид мира: -4823947291038571', type: 'info' },
        'difficulty': { text: '[Server] Текущая сложность: Normal', type: 'info' },
        'tps': { text: '[Server] TPS: 19.98 (отлично)', type: 'success' },
        'gc': { text: '[Server] Сборка мусора... Освобождено 234 MB', type: 'success' },
        'plugins': { text: '[Server] Плагины (8): EssentialsX, WorldEdit, WorldGuard, Vault, LuckPerms, PlaceholderAPI, ViaVersion, SkinsRestorer', type: 'info' },
        'version': { text: '[Server] Paper 1.20.4 (Git-123abc)', type: 'info' },
        'whitelist list': { text: '[Server] Whitelist отключен. 0 игроков в белом списке.', type: 'info' },
        'ban herobrine': { text: '[Server] Игрок Herobrine забанен.', type: 'success' },
        'kick herobrine': { text: '[Server] Игрок Herobrine кикнут.', type: 'success' },
    };

    // Проверяем say
    if (command.startsWith('say ')) {
        return { text: `[Server] [Server] ${cmd.substring(4)}`, type: 'info' };
    }

    // Проверяем gamemode
    if (command.startsWith('gamemode ')) {
        const mode = command.split(' ')[1];
        const modes = { 'survival': 'Survival', 'creative': 'Creative', 'adventure': 'Adventure', 'spectator': 'Spectator', '0': 'Survival', '1': 'Creative', '2': 'Adventure', '3': 'Spectator' };
        if (modes[mode]) {
            return { text: `[Server] Режим игры изменён на ${modes[mode]}`, type: 'success' };
        }
    }

    // Проверяем op
    if (command.startsWith('op ')) {
        return { text: `[Server] Игрок ${cmd.split(' ')[1]} теперь оператор`, type: 'success' };
    }

    if (responses[command]) {
        return responses[command];
    }

    return { text: `[Server] Неизвестная команда: "${cmd}". Введите "help" для помощи.`, type: 'error' };
}

// Действия с сервером
function serverAction(action) {
    const statusElement = document.querySelector('.server-status');
    const statusText = statusElement.querySelector('span:last-child');

    switch (action) {
        case 'start':
            statusElement.className = 'server-status starting';
            statusText.textContent = 'Запускается...';
            showNotification('Сервер запускается...', 'info');
            setTimeout(() => {
                statusElement.className = 'server-status online';
                statusText.textContent = 'Онлайн';
                showNotification('Сервер запущен!', 'success');
            }, 3000);
            break;
        case 'stop':
            statusElement.className = 'server-status offline';
            statusText.textContent = 'Оффлайн';
            showNotification('Сервер остановлен', 'warning');
            break;
        case 'restart':
            statusElement.className = 'server-status starting';
            statusText.textContent = 'Перезапуск...';
            showNotification('Сервер перезапускается...', 'info');
            setTimeout(() => {
                statusElement.className = 'server-status online';
                statusText.textContent = 'Онлайн';
                showNotification('Сервер перезапущен!', 'success');
            }, 4000);
            break;
    }
}

// ===== Плагины =====
const pluginsData = [
    { name: 'EssentialsX', icon: '⚡', version: 'v2.20.1', desc: 'Базовые команды для сервера: телепорт, дом, варп, экономика и многое другое', downloads: '12.5M', installed: true },
    { name: 'WorldEdit', icon: '🏗️', version: 'v7.2.15', desc: 'Мощный инструмент для редактирования мира прямо в игре', downloads: '8.3M', installed: true },
    { name: 'WorldGuard', icon: '🛡️', version: 'v7.0.9', desc: 'Защита регионов от гриферов. Настройка флагов и прав', downloads: '7.1M', installed: false },
    { name: 'Vault', icon: '💰', version: 'v1.7.3', desc: 'API для экономики и прав. Необходим для многих плагинов', downloads: '9.8M', installed: true },
    { name: 'LuckPerms', icon: '🔑', version: 'v5.4.102', desc: 'Продвинутая система прав и групп с веб-редактором', downloads: '6.2M', installed: true },
    { name: 'PlaceholderAPI', icon: '📝', version: 'v2.11.5', desc: 'API для плейсхолдеров. Используется множеством плагинов', downloads: '5.4M', installed: false },
    { name: 'ViaVersion', icon: '🔄', version: 'v4.9.2', desc: 'Поддержка подключения с разных версий клиента', downloads: '4.7M', installed: false },
    { name: 'SkinsRestorer', icon: '👤', version: 'v15.0.7', desc: 'Восстановление скинов для пиратских клиентов', downloads: '3.8M', installed: false },
    { name: 'Citizens', icon: '🤖', version: 'v2.0.33', desc: 'Создание NPC для квестов, магазинов и декораций', downloads: '3.2M', installed: false },
    { name: 'mcMMO', icon: '⚔️', version: 'v2.1.226', desc: 'RPG система прокачки навыков для Minecraft', downloads: '2.9M', installed: false },
    { name: 'GriefPrevention', icon: '🏠', version: 'v16.18.1', desc: 'Защита построек через систему клеймов', downloads: '4.1M', installed: false },
    { name: 'Dynmap', icon: '🗺️', version: 'v3.6', desc: 'Интерактивная веб-карта вашего мира в реальном времени', downloads: '2.7M', installed: false },
    { name: 'AuthMe', icon: '🔐', version: 'v5.6.0', desc: 'Система авторизации для пиратских серверов', downloads: '5.1M', installed: false },
    { name: 'Multiverse-Core', icon: '🌐', version: 'v4.3.12', desc: 'Управление несколькими мирами на одном сервере', downloads: '3.5M', installed: false },
    { name: 'HolographicDisplays', icon: '✨', version: 'v3.0.1', desc: 'Создание голографических надписей в мире', downloads: '2.3M', installed: false },
    { name: 'TAB', icon: '📊', version: 'v4.0.9', desc: 'Настройка TAB-списка, префиксов и суффиксов', downloads: '1.8M', installed: false },
];

function loadPlugins() {
    const grid = document.getElementById('pluginsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    pluginsData.forEach(plugin => {
        const card = document.createElement('div');
        card.className = 'plugin-card';
        card.innerHTML = `
            <div class="plugin-header">
                <div class="plugin-icon">${plugin.icon}</div>
                <div>
                    <div class="plugin-name">${plugin.name}</div>
                    <div class="plugin-version">${plugin.version}</div>
                </div>
            </div>
            <div class="plugin-desc">${plugin.desc}</div>
            <div class="plugin-footer">
                <span class="plugin-downloads"><i class="fas fa-download"></i> ${plugin.downloads}</span>
                <button class="plugin-install-btn ${plugin.installed ? 'installed' : ''}" 
                        onclick="installPlugin(this, '${plugin.name}')"
                        ${plugin.installed ? 'disabled' : ''}>
                    ${plugin.installed ? '✓ Установлен' : 'Установить'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function installPlugin(btn, name) {
    if (btn.classList.contains('installed')) return;

    btn.textContent = 'Установка...';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = '✓ Установлен';
        btn.classList.add('installed');
        showNotification(`Плагин ${name} успешно установлен!`, 'success');

        // Добавить в консоль
        const output = document.getElementById('consoleOutput');
        const line = document.createElement('div');
        line.className = 'console-line success';
        line.textContent = `[Server] Плагин ${name} установлен. Перезагрузка не требуется.`;
        output.appendChild(line);
    }, 1500);
}

function searchPlugins() {
    const query = document.getElementById('pluginSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.plugin-card');

    cards.forEach((card, index) => {
        const name = pluginsData[index].name.toLowerCase();
        const desc = pluginsData[index].desc.toLowerCase();
        if (name.includes(query) || desc.includes(query)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== Игроки =====
const playersData = [
    { name: 'Player123', ping: 23, op: true },
    { name: 'Steve', ping: 45 },
    { name: 'Alex', ping: 67 },
    { name: 'Notch', ping: 12 },
    { name: 'Dream', ping: 89 },
    { name: 'Technoblade', ping: 34 },
    { name: 'Herobrine', ping: 666 },
    { name: 'xXGamerXx', ping: 56 },
    { name: 'CoolBuilder', ping: 78 },
    { name: 'RedstoneKing', ping: 43 },
    { name: 'DiamondMiner', ping: 29 },
    { name: 'ProPvP', ping: 91 },
];

function loadPlayers() {
    const list = document.getElementById('playersList');
    if (!list) return;
    list.innerHTML = '';

    playersData.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
            <div class="player-head">${player.name[0]}</div>
            <div class="player-info">
                <div class="player-name">${player.name} ${player.op ? '⭐' : ''}</div>
                <div class="player-details">Пинг: ${player.ping}ms</div>
            </div>
            <div class="player-actions">
                <button class="player-action-btn" title="Кикнуть" onclick="kickPlayer('${player.name}')">
                    <i class="fas fa-times"></i>
                </button>
                <button class="player-action-btn" title="Забанить" onclick="banPlayer('${player.name}')">
                    <i class="fas fa-ban"></i>
                </button>
            </div>
        `;
        list.appendChild(card);
    });
}

function kickPlayer(name) {
    showNotification(`Игрок ${name} кикнут с сервера`, 'warning');

    const output = document.getElementById('consoleOutput');
    const line = document.createElement('div');
    line.className = 'console-line warn';
    line.textContent = `[Server] ${name} was kicked from the game`;
    output.appendChild(line);
}

function banPlayer(name) {
    showNotification(`Игрок ${name} забанен`, 'error');

    const output = document.getElementById('consoleOutput');
    const line = document.createElement('div');
    line.className = 'console-line error';
    line.textContent = `[Server] Banned player ${name}`;
    output.appendChild(line);
}

// ===== Бэкапы =====
function createBackup() {
    showNotification('Создание резервной копии...', 'info');

    setTimeout(() => {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10);
        const timeStr = now.toTimeString().slice(0, 5).replace(':', '-');
        const name = `backup_${dateStr}_${timeStr}.zip`;

        showNotification(`Резервная копия ${name} создана!`, 'success');

        // Добавить в список
        const list = document.querySelector('.backups-list');
        if (list) {
            const item = document.createElement('div');
            item.className = 'backup-item';
            item.style.animation = 'slideIn 0.3s ease';
            item.innerHTML = `
                <div class="backup-info">
                    <i class="fas fa-archive"></i>
                    <div>
                        <span class="backup-name">${name}</span>
                        <span class="backup-size">${(Math.random() * 50 + 130).toFixed(1)} MB • Ручной</span>
                    </div>
                </div>
                <div class="backup-actions">
                    <button class="btn btn-small btn-outline"><i class="fas fa-download"></i></button>
                    <button class="btn btn-small btn-outline"><i class="fas fa-undo"></i></button>
                    <button class="btn btn-small btn-danger"><i class="fas fa-trash"></i></button>
                </div>
            `;
            list.prepend(item);
        }
    }, 2000);
}

// ===== Плавный скролл =====
function scrollTo(selector) {
    document.querySelector(selector).scrollIntoView({ behavior: 'smooth' });
}

// ===== Инициализация начальных стилей для анимации =====
document.querySelectorAll('.feature-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
});

// Trigger initial animation check
setTimeout(animateOnScroll, 100);
