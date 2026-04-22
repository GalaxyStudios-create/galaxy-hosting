// --- Элементы DOM ---
const balanceEl = document.getElementById('balance');
const clickPowerEl = document.getElementById('click-power');
const autoPerSecondEl = document.getElementById('auto-per-second');
const bitcoinButton = document.getElementById('bitcoin-button');
const upgradesListEl = document.getElementById('upgrades-list');
const rebirthButton = document.getElementById('rebirth-button');
const rebirthMultiplierEl = document.getElementById('rebirth-multiplier');
const rebirthCostEl = document.getElementById('rebirth-cost');

// --- Игровое состояние ---
let gameState = {
    balance: 0.00000001,
    clickPower: 0.00000001,
    autoClickRate: 0.0,
    rebirths: 0,
};

// --- Данные об улучшениях ---
const upgrades = [
    {
        id: 'click_power_1',
        name: 'Улучшенная мышь',
        description: 'Увеличивает доход за клик',
        type: 'click',
        baseCost: 0.00001,
        power: 0.00000001,
        level: 0,
        costMultiplier: 1.15
    },
    {
        id: 'autoclick_1',
        name: 'Старый ноутбук',
        description: 'Начинает пассивный майнинг',
        type: 'auto',
        baseCost: 0.0001,
        power: 0.0000001,
        level: 0,
        costMultiplier: 1.20
    },
    {
        id: 'click_power_2',
        name: 'Механическая клавиатура',
        description: 'Значительно увеличивает доход за клик',
        type: 'click',
        baseCost: 0.001,
        power: 0.000001,
        level: 0,
        costMultiplier: 1.18
    },
    {
        id: 'autoclick_2',
        name: 'Майнинг-ферма',
        description: 'Мощный пассивный доход',
        type: 'auto',
        baseCost: 0.01,
        power: 0.00001,
        level: 0,
        costMultiplier: 1.25
    },
    {
        id: 'autoclick_3',
        name: 'Квантовый компьютер',
        description: 'Запредельный пассивный доход',
        type: 'auto',
        baseCost: 0.1,
        power: 0.0001,
        level: 0,
        costMultiplier: 1.3
    }
];

// --- Стоимость перерождения ---
const REBIRTH_BASE_COST = 1.0;

// --- Вспомогательные функции ---
function formatNumber(num) {
    // Используем toFixed(8), чтобы всегда было 8 знаков после запятой, как у биткоина
    return num.toFixed(8);
}

function getRebirthMultiplier() {
    // Каждое перерождение дает +100% к базе (т.е. +1 к множителю)
    return 1 + gameState.rebirths;
}

// --- Функции обновления ---
function updateDisplay() {
    const multiplier = getRebirthMultiplier();
    
    balanceEl.textContent = formatNumber(gameState.balance);
    clickPowerEl.textContent = formatNumber(gameState.clickPower * multiplier);
    autoPerSecondEl.textContent = formatNumber(gameState.autoClickRate * multiplier);

    // Обновляем улучшения
    upgrades.forEach(upgrade => {
        const cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level);
        const button = document.getElementById(`buy-${upgrade.id}`);
        const costEl = document.getElementById(`cost-${upgrade.id}`);
        const levelEl = document.getElementById(`level-${upgrade.id}`);

        if (button) {
            costEl.textContent = formatNumber(cost);
            levelEl.textContent = upgrade.level;
            button.disabled = gameState.balance < cost;
        }
    });

    // Обновляем перерождение
    const currentRebirthCost = REBIRTH_BASE_COST * Math.pow(10, gameState.rebirths);
    rebirthCostEl.textContent = formatNumber(currentRebirthCost);
    rebirthMultiplierEl.textContent = `x${getRebirthMultiplier()}`;
    rebirthButton.disabled = gameState.balance < currentRebirthCost;
}

// --- Функции покупки ---
function buyUpgrade(upgradeId) {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;

    const cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level);

    if (gameState.balance >= cost) {
        gameState.balance -= cost;
        upgrade.level++;

        if (upgrade.type === 'click') {
            gameState.clickPower += upgrade.power;
        } else if (upgrade.type === 'auto') {
            gameState.autoClickRate += upgrade.power;
        }

        updateDisplay();
    }
}

// --- Функция перерождения ---
function performRebirth() {
    const currentRebirthCost = REBIRTH_BASE_COST * Math.pow(10, gameState.rebirths);
    if (gameState.balance >= currentRebirthCost) {
        gameState.rebirths++;
        
        // Сброс состояния
        gameState.balance = 0.00000001;
        gameState.clickPower = 0.00000001;
        gameState.autoClickRate = 0.0;
        upgrades.forEach(u => u.level = 0);
        
        alert(`Поздравляем с перерождением! Ваш множитель дохода теперь x${getRebirthMultiplier()}.`);
        
        updateDisplay();
    }
}


// --- Инициализация игры ---
function initializeGame() {
    // Создаем элементы для улучшений
    upgrades.forEach(upgrade => {
        const item = document.createElement('div');
        item.className = 'upgrade-item';
        item.innerHTML = `
            <p class="upgrade-title">${upgrade.name} (Уровень <span id="level-${upgrade.id}">${upgrade.level}</span>)</p>
            <p class="upgrade-stats">${upgrade.description}: +${formatNumber(upgrade.power)}</p>
            <button id="buy-${upgrade.id}">
                Купить за <span id="cost-${upgrade.id}">${formatNumber(upgrade.baseCost)}</span> BTC
            </button>
        `;
        upgradesListEl.appendChild(item);
    });

    // Добавляем обработчики событий
    upgrades.forEach(upgrade => {
        document.getElementById(`buy-${upgrade.id}`).addEventListener('click', () => buyUpgrade(upgrade.id));
    });

    bitcoinButton.addEventListener('click', () => {
        gameState.balance += gameState.clickPower * getRebirthMultiplier();
        updateDisplay();
    });
    
    rebirthButton.addEventListener('click', performRebirth);

    // Игровой цикл (для пассивного дохода)
    setInterval(() => {
        if (gameState.autoClickRate > 0) {
            gameState.balance += gameState.autoClickRate * getRebirthMultiplier();
            updateDisplay();
        }
    }, 1000); // Каждую секунду

    // Первоначальное отображение
    updateDisplay();
}

// --- Запуск игры ---
initializeGame();
