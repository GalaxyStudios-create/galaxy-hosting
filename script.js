// Глобальные переменные
let serverRunning = false;
let ramUsage = 0;
let cpuUsage = 0;
let playersOnline = 0;
let uptimeSeconds = 0;
let uptimeInterval = null;
let activityInterval = null;

// Модальные окна
function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function showRegister() {
    document.getElementById('registerModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Закрытие модального окна по клику вне его
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Вход в систему
function login(event) {
    event.preventDefault();
    closeModal('loginModal');
    showDashboard();
    addConsoleLog('[GalaxyHosting] Успешный вход в систему');
}

// Регистрация
function register(event) {
    event.preventDefault();
    closeModal('registerModal');
    showDashboard();
    addConsoleLog('[GalaxyHosting] Аккаунт создан! Добро пожаловать!');
}

// Показать панель управления
function showDashboard() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('features').style.display = 'none';
    document.querySelector('.navbar').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
}

// Выход
function logout() {
    if (serverRunning) {
        if (!confirm('Сервер запущен! Вы уверены что хотите выйти?')) {
            return;
        }
    }
    document.getElementById('dashboard').style.display = 'none';
    document.querySelector('.navbar').style.display = 'block';
    document.getElementById('home').style.display = 'block';
    document.getElementById('features').style.display = 'block';
    window.scrollTo(0, 0);
}

// Переключение вкладок
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById('tab-' + tabName).classList.add('active');
}

// Запуск сервера
function startServer() {
    if (serverRunning) {
        alert('⚠️ Сервер уже запущен!');
        return;
    }
    
    serverRunning = true;
    uptimeSeconds = 0;
    updateServerStatus();
    
    addConsoleLog('[GalaxyHosting] ========================================');
    addConsoleLog('[GalaxyHosting] Запуск сервера...');
    addConsoleLog('[GalaxyHosting] IP: play.servername.galaxy');
    
    setTimeout(() => {
        addConsoleLog('[Minecraft] Starting minecraft server version 1.20.4');
        setTimeout(() => {
            addConsoleLog('[Minecraft] Loading libraries, please wait...');
            setTimeout(() => {
                addConsoleLog('[Minecraft] Preparing level "world"');
                setTimeout(() => {
                    addConsoleLog('[Minecraft] Preparing spawn area: 0%');
                    addConsoleLog('[Minecraft] Preparing spawn area: 47%');
                    addConsoleLog('[Minecraft] Preparing spawn area: 83%');
                    addConsoleLog('[Minecraft] Done! Server started successfully');
                    addConsoleLog('[Minecraft] Server is running on *:25565');
                    addConsoleLog('[GalaxyHosting] ✅ Сервер успешно запущен!');
                    addConsoleLog('[GalaxyHosting] Подключайтесь: play.servername.galaxy');
                    startUptimeCounter();
                    simulateServerActivity();
                }, 1500);
            }, 1000);
        }, 1500);
    }, 1000);
}

// Остановка сервера
function stopServer() {
    if (!serverRunning) {
        alert('⚠️ Сервер уже остановлен!');
        return;
    }
    
    addConsoleLog('[GalaxyHosting] Остановка сервера...');
    addConsoleLog('[Minecraft] Stopping server');
    addConsoleLog('[Minecraft] Saving worlds...');
    
    setTimeout(() => {
        addConsoleLog('[Minecraft] Saved the game');
        addConsoleLog('[GalaxyHosting] ✅ Сервер остановлен');
        serverRunning = false;
        playersOnline = 0;
        ramUsage = 0;
        cpuUsage = 0;
        uptimeSeconds = 0;
        stopUptimeCounter();
        stopServerActivity();
        updateServerStatus();
    }, 1500);
}

// Перезапуск сервера
function restartServer() {
    if (!serverRunning) {
        startServer();
        return;
    }
    
    addConsoleLog('[GalaxyHosting] 🔄 Перезапуск сервера...');
    stopServer();
    setTimeout(() => {
        startServer();
    }, 3000);
}

// Обновление статуса сервера
function updateServerStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.getElementById('server-status-text');
    const ramDisplay = document.getElementById('ram-usage');
    const ramProgress = document.getElementById('ram-progress');
    const playersDisplay = document.getElementById('players-online');
    const cpuDisplay = document.getElementById('cpu-usage');
    
    if (serverRunning) {
        statusIndicator.classList.remove('offline');
        statusIndicator.classList.add('online');
        statusText.textContent = 'Онлайн';
    } else {
        statusIndicator.classList.remove('online');
        statusIndicator.classList.add('offline');
        statusText.textContent = 'Оффлайн';
    }
    
    ramDisplay.textContent = `${Math.round(ramUsage)} MB / 6144 MB`;
    ramProgress.style.width = (ramUsage / 6144 * 100) + '%';
    playersDisplay.textContent = `${playersOnline}/100`;
    cpuDisplay.textContent = `${cpuUsage}%`;
}

// Счётчик uptime
function startUptimeCounter() {
    uptimeInterval = setInterval(() => {
        uptimeSeconds++;
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = uptimeSeconds % 60;
        const uptimeDisplay = document.getElementById('uptime');
        uptimeDisplay.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function stopUptimeCounter() {
    if (uptimeInterval) {
        clearInterval(uptimeInterval);
        uptimeInterval = null;
        document.getElementById('uptime').textContent = '00:00:00';
    }
}

// Симуляция активности сервера
function simulateServerActivity() {
    activityInterval = setInterval(() => {
        if (!serverRunning) return;
        
        // Симуляция RAM
        ramUsage += Math.random() * 150 - 50;
        ramUsage = Math.max(1200, Math.min(5500, ramUsage));
        
        // Симуляция CPU
        cpuUsage = Math.floor(Math.random() * 40) + 20;
        
        // Симуляция игроков
        if (Math.random() > 0.85) {
            const change = Math.floor(Math.random() * 3) - 1;
            const oldPlayers = playersOnline;
            playersOnline = Math.max(0, Math.min(100, playersOnline + change));
            
            if (playersOnline > oldPlayers) {
                const playerName = `Player${Math.floor(Math.random() * 9999)}`;
                addConsoleLog(`[Minecraft] ${playerName} joined the game`);
            } else if (playersOnline < oldPlayers) {
                const playerName = `Player${Math.floor(Math.random() * 9999)}`;
                addConsoleLog(`[Minecraft] ${playerName} left the game`);
            }
        }
        
        updateServerStatus();
    }, 3000);
}

function stopServerActivity() {
    if (activityInterval) {
        clearInterval(activityInterval);
        activityInterval = null;
    }
}

// Консоль
function addConsoleLog(message) {
    const consoleOutput = document.getElementById('console-output');
    const line = document.createElement('div');
    line.className = 'console-line';
    const time = new Date().toLocaleTimeString();
    line.textContent = `[${time}] ${message}`;
    consoleOutput.appendChild(line);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function handleCommand(event) {
    if (event.key === 'Enter') {
        sendCommand();
    }
}

function sendCommand() {
    const input = document.getElementById('console-command');
    const command = input.value.trim();
    
    if (!command) return;
    
    if (!serverRunning) {
        addConsoleLog('[GalaxyHosting] ⚠️ Сервер не запущен!');
        input.value = '';
        return;
    }
    
    addConsoleLog(`> ${command}`);
    
    setTimeout(() => {
        if (command === 'stop') {
            stopServer();
        } else if (command === 'list') {
            addConsoleLog(`[Minecraft] There are ${playersOnline} of max 100 players online`);
        } else if (command.startsWith('say ')) {
            addConsoleLog(`[Server] ${command.substring(4)}`);
        } else if (command === 'help') {
            addConsoleLog('[Minecraft] Available commands: stop, list, say, whitelist, ban, kick, op, gamemode');
        } else if (command.startsWith('op ')) {
            const player = command.substring(3);
            addConsoleLog(`[Minecraft] Made ${player} a server operator`);
        } else if (command.startsWith('kick ')) {
            const player = command.substring(5);
            addConsoleLog(`[Minecraft] Kicked ${player}`);
            playersOnline = Math.max(0, playersOnline - 1);
            updateServerStatus();
        } else if (command === 'save-all') {
            addConsoleLog('[Minecraft] Saving the game (this may take a moment!)');
            addConsoleLog('[Minecraft] Saved the game');
        } else {
            addConsoleLog('[Minecraft] Command executed successfully');
        }
    }, 200);
    
    input.value = '';
}

// Копирование IP
function copyIP() {
    const ip = document.getElementById('server-ip').textContent;
    navigator.clipboard.writeText(ip).then(() => {
        alert('✅ IP адрес скопирован: ' + ip);
    });
}

// Файловый менеджер
function createFile() {
    const fileName = prompt('Введите имя файла (с расширением):');
    if (fileName) {
        alert('✅ Файл создан: ' + fileName);
        addConsoleLog(`[GalaxyHosting] Файл ${fileName} создан`);
    }
}

function createFolder() {
    const folderName = prompt('Введите имя папки:');
    if (folderName) {
        alert('✅ Папка создана: ' + folderName);
        addConsoleLog(`[GalaxyHosting] Папка ${folderName} создана`);
    }
}

function uploadFile() {
    alert('📤 Перетащите файлы сюда или выберите с компьютера');
}

function refreshFiles() {
    addConsoleLog('[GalaxyHosting] Обновление списка файлов...');
    alert('🔄 Список файлов обновлён');
}

function openFolder(folderName) {
    addConsoleLog(`[GalaxyHosting] Открытие папки: ${folderName}`);
    alert(`📁 Открытие папки: ${folderName}`);
}

function editFile(fileName) {
    addConsoleLog(`[GalaxyHosting] Редактирование: ${fileName}`);
    alert(`📝 Открыт редактор файла: ${fileName}`);
}

// Плагины
function installPlugin() {
    alert('🔌 Магазин плагинов:\n\n- EssentialsX\n- WorldEdit\n- LuckPerms\n- Vault\n- Citizens');
}

function uploadPlugin() {
    alert('📤 Загрузите JAR файл плагина');
}

function refreshPlugins() {
    addConsoleLog('[GalaxyHosting] Обновление списка плагинов...');
    alert('🔄 Список плагинов обновлён');
}

// Игроки
function showWhitelist() {
    alert('📋 Управление белым списком\n\nКоманды:\n/whitelist add <игрок>\n/whitelist remove <игрок>');
}

function showBanlist() {
    alert('🚫 Список забаненных игроков\n\nПусто');
}

function showOps() {
    alert('👑 Список операторов\n\nПусто');
}

function kickAll() {
    if (!serverRunning) {
        alert('⚠️ Сервер не запущен!');
        return;
    }
    if (playersOnline === 0) {
        alert('⚠️ Нет игроков онлайн!');
        return;
    }
    if (confirm(`Кикнуть всех игроков (${playersOnline})?`)) {
        addConsoleLog(`[Minecraft] Kicked ${playersOnline} players`);
        playersOnline = 0;
        updateServerStatus();
    }
}

// Настройки
function saveSettings() {
    const version = document.getElementById('mc-version').value;
    const type = document.getElementById('server-type').value;
    const maxPlayers = document.getElementById('max-players').value;
    const serverName = document.getElementById('server-name').value;
    
    addConsoleLog('[GalaxyHosting] Сохранение настроек...');
    
    setTimeout(() => {
        addConsoleLog(`[GalaxyHosting] Версия: ${version}`);
        addConsoleLog(`[GalaxyHosting] Тип: ${type}`);
        addConsoleLog(`[GalaxyHosting] Макс. игроков: ${maxPlayers}`);
        addConsoleLog('[GalaxyHosting] ✅ Настройки сохранены!');
        alert('✅ Настройки успешно сохранены!\n\nПерезапустите сервер для применения изменений.');
    }, 500);
}

// Бэкапы
function createBackup() {
    addConsoleLog('[GalaxyHosting] Создание бэкапа...');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        addConsoleLog(`[GalaxyHosting] Прогресс: ${progress}%`);
        
        if (progress >= 100) {
            clearInterval(interval);
            const date = new Date().toLocaleString();
            addConsoleLog(`[GalaxyHosting] ✅ Бэкап создан: backup_${Date.now()}.zip`);
            alert(`✅ Бэкап успешно создан!\n\nДата: ${date}\nРазмер: ${Math.floor(Math.random() * 500 + 100)} MB`);
        }
    }, 300);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    updateServerStatus();
    addConsoleLog('[GalaxyHosting] Система загружена');
    addConsoleLog('[GalaxyHosting] Домен: play.servername.galaxy');
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
