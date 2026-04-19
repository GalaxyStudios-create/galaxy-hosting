// Переменные
let serverRunning = false;
let ramUsage = 0;
let playersOnline = 0;

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

// Закрытие по клику вне модального окна
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Вход
function login(event) {
    event.preventDefault();
    closeModal('loginModal');
    showDashboard();
}

// Регистрация
function register(event) {
    event.preventDefault();
    closeModal('registerModal');
    showDashboard();
}

// Показать панель управления
function showDashboard() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('features').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
}

// Выход
function logout() {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('home').style.display = 'block';
    document.getElementById('features').style.display = 'block';
    location.reload();
}

// Переключение вкладок
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById('tab-' + tabName).classList.add('active');
}

// Управление сервером
function startServer() {
    if (serverRunning) {
        alert('Сервер уже запущен!');
        return;
    }
    
    serverRunning = true;
    updateServerStatus();
    
    const consoleOutput = document.getElementById('console-output');
    addConsoleLog('[GalaxyHosting] Запуск сервера...');
    
    setTimeout(() => {
        addConsoleLog('[Minecraft] Starting minecraft server version 1.20.4');
        setTimeout(() => {
            addConsoleLog('[Minecraft] Loading libraries, please wait...');
            setTimeout(() => {
                addConsoleLog('[Minecraft] Done! Server started successfully');
                addConsoleLog('[Minecraft] Server is running on *:25565');
                simulateServerActivity();
            }, 2000);
        }, 1500);
    }, 1000);
}

function stopServer() {
    if (!serverRunning) {
        alert('Сервер уже остановлен!');
        return;
    }
    
    serverRunning = false;
    playersOnline = 0;
    ramUsage = 0;
    updateServerStatus();
    addConsoleLog('[GalaxyHosting] Остановка сервера...');
    addConsoleLog('[Minecraft] Server stopped');
}

function restartServer() {
    if (!serverRunning) {
        startServer();
        return;
    }
    
    addConsoleLog('[GalaxyHosting] Перезапуск сервера...');
    stopServer();
    setTimeout(() => {
        startServer();
    }, 2000);
}

function updateServerStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.getElementById('server-status-text');
    const ramDisplay = document.getElementById('ram-usage');
    const ramProgress = document.getElementById('ram-progress');
    const playersDisplay = document.getElementById('players-online');
    
    if (serverRunning) {
        statusIndicator.classList.remove('offline');
        statusIndicator.classList.add('online');
        statusText.textContent = 'Онлайн';
    } else {
        statusIndicator.classList.remove('online');
        statusIndicator.classList.add('offline');
        statusText.textContent = 'Оффлайн';
    }
    
    ramDisplay.textContent = `${ramUsage} MB / 6144 MB`;
    ramProgress.style.width = (ramUsage / 6144 * 100) + '%';
    playersDisplay.textContent = `${playersOnline}/100`;
}

function simulateServerActivity() {
    if (!serverRunning) return;
    
    // Симуляция использования RAM
    setInterval(() => {
        if (serverRunning) {
            ramUsage = Math.min(6144, ramUsage + Math.random() * 100);
            if (Math.random() > 0.7) {
                ramUsage = Math.max(1000, ramUsage - Math.random() * 200);
            }
            updateServerStatus();
        }
    }, 3000);
    
    // Симуляция игроков
    setInterval(() => {
        if (serverRunning && Math.random() > 0.5) {
            const change = Math.floor(Math.random() * 3) - 1;
            playersOnline = Math.max(0, Math.min(100, playersOnline + change));
            
            if (change > 0) {
                addConsoleLog(`[Minecraft] Player${playersOnline} joined the game`);
            } else if (change < 0) {
                addConsoleLog(`[Minecraft] Player${playersOnline} left the game`);
            }
            
            updateServerStatus();
        }
    }, 10000);
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
        addConsoleLog('[GalaxyHosting] Сервер не запущен!');
        input.value = '';
        return;
    }
    
    addConsoleLog(`> ${command}`);
    
    // Обработка команд
    setTimeout(() => {
        if (command === 'stop') {
            stopServer();
        } else if (command === 'list') {
            addConsoleLog(`[Minecraft] There are ${playersOnline} players online`);
        } else if (command.startsWith('say ')) {
            addConsoleLog(`[Server] ${command.substring(4)}`);
        } else {
            addConsoleLog('[Minecraft] Command executed');
        }
    }, 100);
    
    input.value = '';
}

// Копирование IP
function copyIP() {
    const ip = document.getElementById('server-ip').textContent;
    navigator.clipboard.writeText(ip);
    alert('IP адрес скопирован: ' + ip);
}

// Файловый менеджер
function createFile() {
    const fileName = prompt('Введите имя файла:');
    if (fileName) {
        alert('Файл создан: ' + fileName);
        addConsoleLog(`[GalaxyHosting] Файл ${fileName} создан`);
    }
}

function createFolder() {
    const folderName = prompt('Введите имя папки:');
    if (folderName) {
        alert('Папка создана: ' + folderName);
        addConsoleLog(`[GalaxyHosting] Папка ${folderName} создана`);
    }
}

function uploadFile() {
    alert('Откроется окно загрузки файлов');
}

function openFolder(folderName) {
    alert('Открытие папки: ' + folderName);
}

function editFile(fileName) {
    alert('Редактирование файла: ' + fileName);
}

// Плагины
function installPlugin() {
    alert('Откроется магазин плагинов');
}

function uploadPlugin() {
    alert('Загрузите JAR файл плагина');
}

// Игроки
function showWhitelist() {
    alert('Управление белым списком');
}

function showBanlist() {
    alert('Управление банами');
}

function showOps() {
    alert('Управление OP правами');
}

// Настройки
function saveSettings() {
    const version = document.getElementById('mc-version').value;
    const type = document.getElementById('server-type').value;
    
    alert(`Настройки сохранены!\nВерсия: ${version}\nТип: ${type}`);
    addConsoleLog('[GalaxyHosting] Настройки сохранены');
}

// Бэкапы
function createBackup() {
    if (!serverRunning) {
        alert('Остановите сервер перед созданием бэкапа');
        return;
    }
    
    addConsoleLog('[GalaxyHosting] Создание бэкапа...');
    setTimeout(() => {
        addConsoleLog('[GalaxyHosting] Бэкап создан успешно!');
        alert('Бэкап создан успешно!');
    }, 2000);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    updateServerStatus();
});
