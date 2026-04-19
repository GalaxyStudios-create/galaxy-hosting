const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const btnRestart = document.getElementById('btn-restart');
const statusText = document.getElementById('status-text');
const statusIndicator = document.getElementById('status-indicator');
const consoleBody = document.getElementById('console');
const ramProgress = document.getElementById('ram-progress');
const cpuProgress = document.getElementById('cpu-progress');

function addLog(text, type = 'info') {
    const p = document.createElement('p');
    const time = new Date().toLocaleTimeString();
    p.textContent = `[${time}] ${text}`;
    if(type === 'success') p.style.color = '#2ecc71';
    if(type === 'error') p.style.color = '#e74c3c';
    consoleBody.appendChild(p);
    consoleBody.scrollTop = consoleBody.scrollHeight;
}

btnStart.onclick = () => {
    btnStart.disabled = true;
    statusText.innerText = "Запуск...";
    addLog("Загрузка ядра Paper 1.20.1...", 'info');
    
    setTimeout(() => {
        addLog("Подготовка мира (0%)...", 'info');
        ramProgress.style.width = "40%";
    }, 1000);

    setTimeout(() => {
        statusText.innerText = "Онлайн";
        statusIndicator.className = "status-indicator status-on";
        btnStop.disabled = false;
        btnRestart.disabled = false;
        addLog("Сервер успешно запущен на порту 25565!", 'success');
        addLog("Выделено RAM: 6144MB", 'success');
        cpuProgress.style.width = "15%";
        document.getElementById('cpu-load').innerText = "15%";
    }, 3000);
};

btnStop.onclick = () => {
    btnStop.disabled = true;
    btnRestart.disabled = true;
    statusText.innerText = "Выключение...";
    addLog("Сохранение игроков и мира...", 'info');
    
    setTimeout(() => {
        statusText.innerText = "Оффлайн";
        statusIndicator.className = "status-indicator status-off";
        btnStart.disabled = false;
        ramProgress.style.width = "0%";
        cpuProgress.style.width = "0%";
        document.getElementById('cpu-load').innerText = "0%";
        addLog("Сервер остановлен.", 'error');
    }, 2000);
};

// Симуляция ввода команд
document.getElementById('cmd-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addLog(`> ${this.value}`);
        if(this.value === 'op admin') addLog("Игрок admin теперь является оператором", 'success');
        this.value = '';
    }
});
