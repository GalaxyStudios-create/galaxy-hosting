document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы DOM ---
    const balanceEl = document.getElementById('balance');
    const clickPowerEl = document.getElementById('click-power');
    const autoPerSecondEl = document.getElementById('auto-per-second');
    const bitcoinButton = document.getElementById('bitcoin-button');
    const upgradesListEl = document.getElementById('upgrades-list');
    const rebirthButton = document.getElementById('rebirth-button');
    const rebirthMultiplierEl = document.getElementById('rebirth-multiplier');
    const rebirthCostEl = document.getElementById('rebirth-cost');

    // --- Игровое состояние (сохраняемое) ---
    let gameState = {
        balance: 0.00000001,
        clickPowerBase: 0.00000001,
        autoClickRateBase: 0.0,
        rebirths: 0,
        upgradeLevels: {} // { 'upgrade_id': level }
    };

    // --- Данные об улучшениях ---
    const upgrades = [
        { id: 'click_1', name: 'Улучшенная мышь', type: 'click', power: 0.00000001, baseCost: 0.00001, mult: 1.15 },
        { id: 'auto_1',  name: 'Старый ноутбук',   type: 'auto',  power: 0.0000001,  baseCost: 0.0001,  mult: 1.20 },
        { id: 'click_2', name: 'Игровая клавиатура', type: 'click', power: 0.000001,   baseCost: 0.001,   mult: 1.18 },
        { id: 'auto_2',  name: 'Майнинг-ферма',    type: 'auto',  power: 0.00001,    baseCost: 0.01,    mult: 1.25 },
        { id: 'click_3', name: 'Макросы', type: 'click', power: 0.00001, baseCost: 0.05, mult: 1.22},
        { id: 'auto_3',  name: 'Квантовый компьютер', type: 'auto', power: 0.0001,   baseCost: 0.1,     mult: 1.30 },
        { id: 'auto_4',  name: 'Дата-центр', type: 'auto', power: 0.001,   baseCost: 1.5,     mult: 1.35 }
    ];

    const REBIRTH_BASE_COST = 1.0;

    // --- Вспомогательные функции ---
    const format = (num) => num.toFixed(8);
    const getRebirthMultiplier = () => 1 + gameState.rebirths;
    const getUpgradeLevel = (upgradeId) => gameState.upgradeLevels[upgradeId] || 0;
    const getUpgradeCost = (upgrade) => upgrade.baseCost * Math.pow(upgrade.mult, getUpgradeLevel(upgrade.id));
    const getRebirthCost = () => REBIRTH_BASE_COST * Math.pow(10, gameState.rebirths);

    // --- Функции обновления ---
    function updateDisplay() {
        const multiplier = getRebirthMultiplier();
        
        balanceEl.textContent = format(gameState.balance);
        clickPowerEl.textContent = format(gameState.clickPowerBase * multiplier);
        autoPerSecondEl.textContent = format(gameState.autoClickRateBase * multiplier);

        upgrades.forEach(upgrade => {
            const cost = getUpgradeCost(upgrade);
            document.getElementById(`cost-${upgrade.id}`).textContent = format(cost);
            document.getElementById(`level-${upgrade.id}`).textContent = getUpgradeLevel(upgrade.id);
            document.getElementById(`buy-${upgrade.id}`).disabled = gameState.balance < cost;
        });

        const currentRebirthCost = getRebirthCost();
        rebirthCostEl.textContent = format(currentRebirthCost);
        rebirthMultiplierEl.textContent = `x${multiplier}`;
        rebirthButton.disabled = gameState.balance < currentRebirthCost;
    }
    
    // --- Функции действий ---
    function buyUpgrade(upgradeId) {
        const upgrade = upgrades.find(u => u.id === upgradeId);
        const cost = getUpgradeCost(upgrade);

        if (gameState.balance >= cost) {
            gameState.balance -= cost;
            gameState.upgradeLevels[upgrade.id] = getUpgradeLevel(upgrade.id) + 1;

            if (upgrade.type === 'click') {
                gameState.clickPowerBase += upgrade.power;
            } else if (upgrade.type === 'auto') {
                gameState.autoClickRateBase += upgrade.power;
            }
            updateDisplay();
        }
    }

    function performRebirth() {
        if (gameState.balance >= getRebirthCost()) {
            const oldRebirths = gameState.rebirths;
            // Сброс состояния, сохраняя перерождения
            gameState = {
                balance: 0.00000001,
                clickPowerBase: 0.00000001,
                autoClickRateBase: 0.0,
                rebirths: oldRebirths + 1,
                upgradeLevels: {}
            };
            
            alert(`Поздравляем с перерождением! Ваш множитель дохода теперь x${getRebirthMultiplier()}.`);
            updateDisplay();
        }
    }

    function gameLoop() {
        gameState.balance += gameState.autoClickRateBase * getRebirthMultiplier();
        updateDisplay();
    }
    
    // --- Инициализация игры ---
    function initialize() {
        // Создаем HTML для улучшений
        upgradesListEl.innerHTML = upgrades.map(u => `
            <div class="upgrade-item">
                <div>
                    <p class="upgrade-title">${u.name} (Уровень <span id="level-${u.id}">0</span>)</p>
                    <p class="upgrade-stats">${u.type === 'click' ? 'Доход за клик' : 'Доход в секунду'}: +${format(u.power)}</p>
                </div>
                <button id="buy-${u.id}">
                    Купить за <span id="cost-${u.id}">${format(u.baseCost)}</span>
                </button>
            </div>
        `).join('');
        
        // Назначаем обработчики событий
        bitcoinButton.addEventListener('click', () => {
            gameState.balance += gameState.clickPowerBase * getRebirthMultiplier();
            updateDisplay();
        });
        
        rebirthButton.addEventListener('click', performRebirth);

        upgrades.forEach(u => {
            document.getElementById(`buy-${u.id}`).addEventListener('click', () => buyUpgrade(u.id));
        });

        // Запуск игрового цикла
        setInterval(gameLoop, 1000); // Раз в секунду
        updateDisplay(); // Первоначальное отображение
    }

    initialize();
});
