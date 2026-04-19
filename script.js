// Глобальные переменные
let serverRunning = false;
let ramUsage = 0;
let cpuUsage = 0;
let playersOnline = 0;
let uptimeSeconds = 0;
let uptimeInterval = null;
let activityInterval = null;
let serverName = 'MyServer';

// Обновление названия сервера и IP
function updateServerName() {
    const nameInput = document.getElementById('server-name');
    serverName = nameInput.value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (!serverName) {
        serverName = 'myserver';
        nameInput.value = 'MyServer';
    }
    
    const serverIP = `play.${serverName}.galaxy`;
    document.getElementById('server-ip').textContent = serverIP;
    
    addConsoleLog(`[GalaxyHosting] IP обновлён: ${serverIP}`);
}

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
    addConsoleLog('[GalaxyHosting] ✅ Успешный вход в систему');
}

// Регистрация
function register(event) {
    event.preventDefault();
    closeModal('registerModal');
    showDashboard();
    addConsoleLog('[GalaxyHosting] ✅ Аккаунт создан! Добро пожаловать!');
    updateServerName();
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
        if (!confirm('⚠️ Сервер запущен! Вы уверены что хотите выйти?')) {
            return;
        }
        stopServer();
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
    
    const version = document.getElementById('mc-version').value;
    const serverType = document.getElementById('server-type').value;
    const serverIP = document.getElementById('server-ip').textContent;
    
    addConsoleLog('[GalaxyHosting] ========================================');
    addConsoleLog('[GalaxyHosting] 🚀 Запуск сервера...');
    addConsoleLog(`[GalaxyHosting] IP: ${serverIP}`);
    addConsoleLog(`[GalaxyHosting] Версия: ${version}`);
    addConsoleLog(`[GalaxyHosting] Тип: ${serverType}`);
    
    setTimeout(() => {
        addConsoleLog(`[${serverType}] Starting minecraft server version ${version}`);
        setTimeout(() => {
            addConsoleLog('[Minecraft] Loading libraries, please wait...');
            setTimeout(() => {
                addConsoleLog('[Minecraft] Preparing level "world"');
                setTimeout(() => {
                    addConsoleLog('[Minecraft] Preparing spawn area: 0%');
                    setTimeout(() => {
                        addConsoleLog('[Minecraft] Preparing spawn area: 47%');
                        setTimeout(() => {
                            addConsoleLog('[Minecraft] Preparing spawn area: 83%');
                            setTimeout(() => {
                                addConsoleLog('[Minecraft] Done! Server started successfully');
                                addConsoleLog('[Minecraft] Server is running on *:25565');
                                addConsoleLog(`[GalaxyHosting] ✅ Сервер успешно запущен!`);
                                addConsoleLog(`[GalaxyHosting] 📌 Подключайтесь: ${serverIP}`);
                                startUptimeCounter();
                                simulateServerActivity();
                            }, 800);
                        }, 600);
                    }, 500);
                }, 1000);
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
    
    addConsoleLog('[GalaxyHosting] 🛑 Остановка сервера...');
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
        updatePlayersList([]);
    }, 1500);
}

// Перезапуск сервера
function restartServer() {
    if (!serverRunning) {
        startServer();
        return;
    }
    
    addConsoleLog('[GalaxyHosting] 🔄 Перезапуск сервера...');
    serverRunning = false;
    stopUptimeCounter();
    stopServerActivity();
    
    setTimeout(() => {
        startServer();
    }, 2000);
}

// Обновление статуса сервера
function updateServerStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.getElementById('server-status-text');
    const ramDisplay = document.getElementById('ram-usage');
    const ramProgress = document.getElementById('ram-progress');
    const playersDisplay = document.getElementById('players-online');
    const playersCount = document.getElementById('players-count');
    const cpuDisplay = document.getElementById('cpu-usage');
    
    if (serverRunning) {
        statusIndicator.classList.remove('offline');
        statusIndicator.classList.add('online');
        statusText.textContent = '🟢 Онлайн';
    } else {
        statusIndicator.classList.remove('online');
        statusIndicator.classList.add('offline');
        statusText.textContent = '🔴 Оффлайн';
    }
    
    ramDisplay.textContent = `${Math.round(ramUsage)} MB / 6144 MB`;
    ramProgress.style.width = (ramUsage / 6144 * 100) + '%';
    playersDisplay.textContent = `${playersOnline}/100`;
    if (playersCount) playersCount.textContent = playersOnline;
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
    // Начальное значение RAM
    ramUsage = 1200 + Math.random() * 300;
    
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
                const playerName = generatePlayerName();
                addConsoleLog(`[Minecraft] ${playerName} joined the game`);
                updatePlayersList('join', playerName);
            } else if (playersOnline < oldPlayers) {
                const playerName = generatePlayerName();
                addConsoleLog(`[Minecraft] ${playerName} left the game`);
                updatePlayersList('leave', playerName);
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

// Генерация имени игрока
function generatePlayerName() {
    const names = ['Steve', 'Alex', 'Notch', 'Herobrine', 'Creeper', 'Enderman', 'Zombie', 'Skeleton'];
    return names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 999);
}

// Обновление списка игроков
let currentPlayers = [];

function updatePlayersList(action, playerName) {
    const playerList = document.getElementById('online-players');
    
    if (action === 'join' && playerName) {
        currentPlayers.push(playerName);
    } else if (action === 'leave' && currentPlayers.length > 0) {
        currentPlayers.pop();
    } else if (Array.isArray(action)) {
        currentPlayers = action;
    }
    
    if (currentPlayers.length === 0) {
        playerList.innerHTML = '<p class="empty-state">Нет игроков онлайн</p>';
    } else {
        playerList.innerHTML = currentPlayers.map(name => 
            `<div style="padding: 0.5rem; background: rgba(108, 99, 255, 0.1); margin: 0.3rem 0; border-radius: 5px;">👤 ${name}</div>`
        ).join('');
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
            if (currentPlayers.length > 0) {
                addConsoleLog(`[Minecraft] Players: ${currentPlayers.join(', ')}`);
            }
        } else if (command.startsWith('say ')) {
            addConsoleLog(`[Server] ${command.substring(4)}`);
        } else if (command === 'help') {
            addConsoleLog('[Minecraft] Available commands:');
            addConsoleLog('  stop, list, say, whitelist, ban, kick, op, gamemode, save-all');
        } else if (command.startsWith('op ')) {
            const player = command.substring(3);
            addConsoleLog(`[Minecraft] Made ${player} a server operator`);
        } else if (command.startsWith('kick ')) {
            const player = command.substring(5);
            addConsoleLog(`[Minecraft] Kicked ${player}`);
            playersOnline = Math.max(0, playersOnline - 1);
            if (currentPlayers.includes(player)) {
                currentPlayers = currentPlayers.filter(p => p !== player);
            } else if (currentPlayers.length > 0) {
                currentPlayers.pop();
            }
            updatePlayersList(currentPlayers);
            updateServerStatus();
        } else if (command === 'save-all') {
            addConsoleLog('[Minecraft] Saving the game (this may take a moment!)');
            setTimeout(() => {
                addConsoleLog('[Minecraft] Saved the game');
            }, 500);
        } else if (command.startsWith('gamemode ')) {
            addConsoleLog('[Minecraft] Set own game mode to ' + command.substring(9));
        } else {
            addConsoleLog('[Minecraft] Command executed successfully');
        }
    }, 200);
    
    input.value = '';
}

// Копирование IP
function copyIP() {
    const ip = document.getElementById('server-ip').textContent;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ip).then(() => {
            alert('✅ IP адрес скопирован: ' + ip);
        }).catch(() => {
            fallbackCopyIP(ip);
        });
    } else {
        fallbackCopyIP(ip);
    }
}

function fallbackCopyIP(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert('✅ IP адрес скопирован: ' + text);
    } catch (err) {
        alert('IP адрес: ' + text);
    }
    document.body.removeChild(textarea);
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
    addConsoleLog('[GalaxyHosting] Открыт менеджер загрузки файлов');
}

function refreshFiles() {
    addConsoleLog('[GalaxyHosting] Обновление списка файлов...');
    setTimeout(() => {
        addConsoleLog('[GalaxyHosting] ✅ Список файлов обновлён');
        alert('🔄 Список файлов обновлён');
    }, 500);
}

function openFolder(folderName) {
    addConsoleLog(`[GalaxyHosting] Открытие папки: ${folderName}`);
    alert(`📁 Открытие папки: ${folderName}`);
}

function editFile(fileName) {
    addConsoleLog(`[GalaxyHosting] Редактирование: ${fileName}`);
    alert(`📝 Открыт редактор файла: ${fileName}\n\nЗдесь вы можете редактировать содержимое файла.`);
}

// Плагины
function installPlugin() {
    const plugins = [
        '🔌 EssentialsX',
        '✏️ WorldEdit',
        '👥 LuckPerms',
        '💰 Vault',
        '🤖 Citizens',
        '🏠 GriefPrevention',
        '🎨 WorldGuard',
        '⚔️ McMMO',
        '🛒 ChestShop'
    ];
    alert('🔌 Магазин плагинов:\n\n' + plugins.join('\n'));
    addConsoleLog('[GalaxyHosting] Открыт магазин плагинов');
}

function uploadPlugin() {
    alert('📤 Загрузите JAR файл плагина');
    addConsoleLog('[GalaxyHosting] Открыт менеджер загрузки плагинов');
}

function refreshPlugins() {
    addConsoleLog('[GalaxyHosting] Обновление списка плагинов...');
    setTimeout(() => {
        addConsoleLog('[GalaxyHosting] ✅ Список плагинов обновлён');
        alert('🔄 Список плагинов обновлён');
    }, 500);
}

// Игроки
function showWhitelist() {
    alert('📋 Управление белым списком\n\nКоманды:\n/whitelist add <игрок>\n/whitelist remove <игрок>\n/whitelist on\n/whitelist off');
    addConsoleLog('[GalaxyHosting] Открыт whitelist');
}

function showBanlist() {
    alert('🚫 Список забаненных игроков\n\nПусто\n\nКоманды:\n/ban <игрок>\n/unban <игрок>');
    addConsoleLog('[GalaxyHosting] Открыт banlist');
}

function showOps() {
    alert('👑 Список операторов\n\nПусто\n\nКоманды:\n/op <игрок>\n/deop <игрок>');
    addConsoleLog('[GalaxyHosting] Открыт список операторов');
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
    if (confirm(`⚠️ Кикнуть всех игроков (${playersOnline})?`)) {
        addConsoleLog(`[Minecraft] Kicked ${playersOnline} players from the server`);
        playersOnline = 0;
        currentPlayers = [];
        updatePlayersList([]);
        updateServerStatus();
        alert('✅ Все игроки кикнуты');
    }
}

// Настройки
function saveSettings() {
    const version = document.getElementById('mc-version').value;
    const type = document.getElementById('server-type').value;
    const maxPlayers = document.getElementById('max-players').value;
    const serverNameInput = document.getElementById('server-name').value;
    const motd = document.getElementById('motd').value;
    const gamemode = document.getElementById('gamemode').value;
    const difficulty = document.getElementById('difficulty').value;
    
    addConsoleLog('[GalaxyHosting] 💾 Сохранение настроек...');
    
    updateServerName();
    
    setTimeout(() => {
        addConsoleLog(`[GalaxyHosting] Версия: ${version}`);
        addConsoleLog(`[GalaxyHosting] Тип: ${type}`);
        addConsoleLog(`[GalaxyHosting] Макс. игроков: ${maxPlayers}`);
        addConsoleLog(`[GalaxyHosting] Режим: ${gamemode}`);
        addConsoleLog(`[GalaxyHosting] Сложность: ${difficulty}`);
        addConsoleLog('[GalaxyHosting] ✅ Настройки сохранены!');
        
        document.getElementById('current-version').textContent = version;
        
        alert('✅ Настройки успешно сохранены!\n\n⚠️ Перезапустите сервер для применения изменений.');
    }, 500);
}

// Бэкапы
let backupList = [];

function createBackup() {
    addConsoleLog('[GalaxyHosting] 💾 Создание бэкапа...');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        addConsoleLog(`[GalaxyHosting] Прогресс: ${progress}%`);
        
        if (progress >= 100) {
            clearInterval(interval);
            const date = new Date();
            const backupName = `backup_${date.toLocaleDateString()}_${date.toLocaleTimeString().replace(/:/g, '-')}`;
            const backupSize = Math.floor(Math.random() * 500 + 100);
            
            backupList.push({
                name: backupName,
                date: date.toLocaleString(),
                size: backupSize
            });
            
            addConsoleLog(`[GalaxyHosting] ✅ Бэкап создан: ${backupName}.zip`);
            alert(`✅ Бэкап успешно создан!\n\nИмя: ${backupName}.zip\nДата: ${date.toLocaleString()}\nРазмер: ${backupSize} MB`);
            
            updateBackupList();
        }
    }, 300);
}

function updateBackupList() {
    const backupListElement = document.getElementById('backup-list');
    
    if (backupList.length === 0) {
        backupListElement.innerHTML = '<h3>Список бэкапов</h3><p class="empty-state">Бэкапы отсутствуют</p>';
    } else {
        let html = '<h3>Список бэкапов</h3>';
        backupList.forEach((backup, index) => {
            html += `
                <div style="background: rgba(108, 99, 255, 0.1); padding: 1rem; margin: 0.5rem 0; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>💾 ${backup.name}.zip</strong><br>
                            <small>📅 ${backup.date} | 💿 ${backup.size} MB</small>
                        </div>
                        <button onclick="downloadBackup(${index})" style="padding: 0.5rem 1rem; background: var(--primary); border: none; border-radius: 5px; color: white; cursor: pointer;">⬇️ Скачать</button>
                    </div>
                </div>
            `;
        });
        backupListElement.innerHTML = html;
    }
}

function downloadBackup(index) {
    const backup = backupList[index];
    alert(`⬇️ Скачивание бэкапа: ${backup.name}.zip\n\nРазмер: ${backup.size} MB`);
    addConsoleLog(`[GalaxyHosting] Скачивание бэкапа: ${backup.name}.zip`);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    updateServerStatus();
    updateServerName();
    addConsoleLog('[GalaxyHosting] 🌌 Система загружена');
    addConsoleLog('[GalaxyHosting] 📌 Готов к работе!');
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
