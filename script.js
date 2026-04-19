// STATE
let serverOnline = true;
let currentPath = '/home/server/';
const banned = [];
let notifTimer;

// ==================== NAVIGATION ====================
function goPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const titles = {
    dashboard: '📊 Панель управления',
    console: '💻 Консоль сервера',
    players: '👥 Управление игроками',
    settings: '⚙️ Настройки сервера',
    plugins: '🔌 Плагины',
    mods: '📦 Моды',
    worlds: '🌍 Миры',
    files: '📂 Файловый менеджер',
    editor: '📝 Редактор кода'
  };

  document.getElementById('pageTitle').textContent = titles[id] || id;
  closeSidebar();
}

// ==================== SIDEBAR ====================
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

// ==================== SERVER CONTROLS ====================
function startServer() {
  serverOnline = true;
  updateStatus();
  addConsole('ok', '[INFO] Server started successfully!');
  notify('▶ Сервер запущен!');
}

function stopServer() {
  serverOnline = false;
  updateStatus();
  addConsole('warn', '[INFO] Server stopped.');
  notify('⏹ Сервер остановлен');
}

function restartServer() {
  serverOnline = false;
  updateStatus();
  addConsole('warn', '[INFO] Server restarting...');
  notify('🔄 Перезапуск...');
  setTimeout(() => {
    serverOnline = true;
    updateStatus();
    addConsole('ok', '[INFO] Server restarted successfully!');
    notify('✅ Сервер перезапущен!');
  }, 2000);
}

function updateStatus() {
  const dot = document.getElementById('statusDot');
  const txt = document.getElementById('statusText');
  const dash = document.getElementById('dashStatus');

  if (serverOnline) {
    dot.className = 'status-dot on';
    txt.textContent = 'Онлайн';
    if (dash) { dash.textContent = 'Онлайн'; dash.className = 'value green'; }
  } else {
    dot.className = 'status-dot off';
    txt.textContent = 'Оффлайн';
    if (dash) { dash.textContent = 'Оффлайн'; dash.className = 'value red'; }
  }
}

// ==================== CONSOLE ====================
function addConsole(cls, text) {
  const out = document.getElementById('consoleOutput');
  const d = document.createElement('div');
  d.className = cls;
  d.textContent = text;
  out.appendChild(d);
  out.scrollTop = out.scrollHeight;
}

function clearConsole() {
  document.getElementById('consoleOutput').innerHTML = '';
  notify('🗑️ Консоль очищена');
}

function sendCommand() {
  const inp = document.getElementById('consoleInput');
  const cmd = inp.value.trim();
  if (!cmd) return;
  addConsole('', '> ' + cmd);
  inp.value = '';

  const responses = {
    'help': 'Available: help, list, stop, say, gamemode, difficulty, seed, weather, time, give, tp, ban, kick, op',
    'list': 'There are 3/20 players online: Alex_Gamer, ProBuilder, CraftQueen',
    'stop': 'Stopping the server...',
    'seed': 'Seed: [-123456789]',
    'tps': 'TPS: 20.0, 20.0, 19.8',
    'time set day': 'Set the time to 1000',
    'weather clear': 'Changing to clear weather',
    'plugins': 'Plugins (3): WorldGuard, WorldEdit, EssentialsX',
    'version': 'This server is running Paper version git-Paper-196',
  };

  setTimeout(() => {
    const resp = responses[cmd.toLowerCase()] || `Unknown command: "${cmd}". Type "help" for help.`;
    addConsole(responses[cmd.toLowerCase()] ? 'info' : 'warn', resp);
  }, 300);
}

// ==================== PLAYERS ====================
function kickPlayer(name) {
  addConsole('warn', `[INFO] ${name} was kicked from the game`);
  notify(`🚫 ${name} кикнут!`);
}

function banPlayer() {
  const inp = document.getElementById('banInput');
  const name = inp.value.trim();
  if (!name) { notify('Введи ник!'); return; }
  banned.push(name);
  inp.value = '';
  document.getElementById('banList').innerHTML = banned.map(n =>
    `<div style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04)">🚫 ${n}
     <button class="kick-btn" onclick="unban('${n}',this)" style="margin-left:10px;border-color:rgba(34,197,94,0.25);color:var(--green)">Разбанить</button>
    </div>`
  ).join('');
  addConsole('warn', `[INFO] ${name} was banned`);
  notify(`🚫 ${name} забанен!`);
}

function unban(name, btn) {
  const idx = banned.indexOf(name);
  if (idx > -1) banned.splice(idx, 1);
  btn.closest('div').remove();
  if (banned.length === 0) document.getElementById('banList').textContent = 'Бан-лист пуст';
  addConsole('ok', `[INFO] ${name} was unbanned`);
  notify(`✅ ${name} разбанен`);
}

// ==================== SETTINGS ====================
function saveSettings() {
  updateSrvAddr();
  notify('💾 Настройки сохранены!');
  addConsole('ok', '[INFO] Server settings updated');
}

function updateSrvAddr() {
  const name = document.getElementById('setName');
  if (!name) return;
  const slug = name.value.trim().toLowerCase().replace(/[^a-z0-9а-яё]/gi, '').slice(0, 20) || 'myserver';
  const addr = 'play.' + slug + '.Galaxy';
  const el = document.getElementById('srvAddr');
  if (el) el.textContent = addr;
}

// ==================== PLUGINS ====================
function handlePluginUpload(files) {
  if (!files || !files.length) return;
  Array.from(files).forEach(f => {
    if (!f.name.endsWith('.jar')) { notify('❌ Нужен .jar файл!'); return; }
    const name = f.name.replace('.jar', '');
    const grid = document.getElementById('pluginList');
    const card = document.createElement('div');
    card.className = 'plugin-card';
    card.innerHTML = `
      <div class="plugin-head">
        <div class="plugin-icon">🔌</div>
        <div>
          <div class="plugin-name">${name}</div>
          <div class="plugin-ver">Загружен <span class="installed-badge">Установлен</span></div>
        </div>
      </div>
      <div class="plugin-desc">Загружен: ${f.name} (${(f.size / 1024).toFixed(1)} КБ)</div>
      <div class="plugin-actions">
        <button class="p-btn p-btn-edit" onclick="openEditor('plugins/${name}/config.yml','${name}')">📝 Настроить</button>
        <button class="p-btn p-btn-remove" onclick="removePlugin('${name}',this)">🗑️ Удалить</button>
      </div>`;
    grid.appendChild(card);
    addConsole('ok', `[INFO] Plugin ${f.name} loaded`);
    notify(`✅ Плагин ${name} установлен!`);
  });
}

function removePlugin(name, btn) {
  btn.closest('.plugin-card').remove();
  addConsole('warn', `[INFO] ${name} removed`);
  notify(`🗑️ ${name} удалён`);
}

function openEditor(path, pluginName) {
  goPage('editor', document.querySelectorAll('.sidebar-btn')[8]);
  document.getElementById('editorFilename').textContent = path;
  document.getElementById('editorLang').textContent = 'yaml';
  document.getElementById('editorArea').value =
    `# ${pluginName} Configuration\n# Galaxy Hosting\n\nenabled: true\ndebug: false\n\nsettings:\n  prefix: "&b[${pluginName}]&r"\n  language: ru\n  auto-save: true\n\nmessages:\n  no-permission: "&cУ тебя нет прав!"\n  reloaded: "&aКонфиг перезагружен!"`;
}

function loadPluginConfig(name) {
  openEditor(`plugins/${name}/config.yml`, name);
}

// ==================== MODS ====================
function handleModUpload(files) {
  if (!files || !files.length) return;
  Array.from(files).forEach(f => {
    if (!f.name.endsWith('.jar')) { notify('❌ Нужен .jar файл!'); return; }
    const name = f.name.replace('.jar', '');
    const grid = document.getElementById('modList');
    const card = document.createElement('div');
    card.className = 'plugin-card';
    card.innerHTML = `
      <div class="plugin-head">
        <div class="plugin-icon">📦</div>
        <div>
          <div class="plugin-name">${name}</div>
          <div class="plugin-ver">Загружен <span class="installed-badge">Установлен</span></div>
        </div>
      </div>
      <div class="plugin-desc">Мод загружен: ${f.name} (${(f.size / 1024).toFixed(1)} КБ)</div>
      <div class="plugin-actions">
        <button class="p-btn p-btn-remove" onclick="removePlugin('${name}',this)">🗑️ Удалить</button>
      </div>`;
    grid.appendChild(card);
    addConsole('ok', `[INFO] Mod ${f.name} loaded`);
    notify(`✅ Мод ${name} установлен!`);
  });
}

// ==================== WORLDS ====================
function handleWorldUpload(files) {
  if (!files || !files.length) return;
  const f = files[0];
  const name = f.name.replace('.zip', '');
  const grid = document.getElementById('worldList');
  const card = document.createElement('div');
  card.className = 'world-card';
  card.innerHTML = `
    <div class="world-icon">🌍</div>
    <div class="world-name">${name}</div>
    <div class="world-info">Загружен • ${(f.size / 1024 / 1024).toFixed(1)} МБ</div>
    <div class="world-actions">
      <button class="p-btn p-btn-install" onclick="notify('🌍 Мир ${name} — основной')">✅ Основной</button>
      <button class="p-btn p-btn-edit" onclick="notify('📥 Скачивание...')">📥 Скачать</button>
      <button class="p-btn p-btn-remove" onclick="deleteWorld('${name}',this.closest('.world-card'))">🗑️ Удалить</button>
    </div>`;
  grid.appendChild(card);
  addConsole('ok', `[INFO] World ${name} uploaded`);
  notify(`✅ Мир ${name} загружен!`);
}

function deleteWorld(name, card) {
  if (card) card.remove();
  addConsole('warn', `[INFO] World ${name} deleted`);
  notify(`🗑️ Мир ${name} удалён`);
}

function recreateWorld() {
  const seed = document.getElementById('newSeed').value.trim() || Math.floor(Math.random() * 999999999);
  addConsole('warn', '[INFO] Deleting old world...');
  setTimeout(() => addConsole('ok', `[INFO] New world created. Seed: ${seed}`), 800);
  notify(`🔄 Мир пересоздан! Сид: ${seed}`);
}

// ==================== FILES ====================
function openFolder(name) {
  currentPath += name + '/';
  document.getElementById('filePath').textContent = '📂 ' + currentPath;
  notify('📂 ' + name);
}

function goBack() {
  const parts = currentPath.split('/').filter(Boolean);
  if (parts.length > 2) {
    parts.pop();
    currentPath = '/' + parts.join('/') + '/';
  } else {
    currentPath = '/home/server/';
  }
  document.getElementById('filePath').textContent = '📂 ' + currentPath;
}

function openFile(name) {
  goPage('editor', document.querySelectorAll('.sidebar-btn')[8]);
  document.getElementById('editorFilename').textContent = name;
  const ext = name.split('.').pop();
  document.getElementById('editorLang').textContent = ext;

  const contents = {
    'server.properties': '# Minecraft server properties\nserver-port=25565\ngamemode=survival\ndifficulty=normal\nmax-players=20\nmotd=\\u00a7b\\u00a7lGalaxy Server\nonline-mode=false\npvp=true\nenable-command-block=false\nallow-flight=false\nview-distance=10\nlevel-name=world\nwhite-list=false',
    'bukkit.yml': '# Bukkit Configuration\nsettings:\n  allow-end: true\n  warn-on-overload: true\n  permissions-file: permissions.yml\n  connection-throttle: 4000\n  shutdown-message: Server closed',
    'spigot.yml': '# Spigot Configuration\nsettings:\n  bungeecord: false\n  timeout-time: 60\n  restart-on-crash: true\n  log-villager-deaths: true',
    'eula.txt': '# Minecraft EULA\neula=true',
  };

  document.getElementById('editorArea').value = contents[name] || `# ${name}\n# Редактируй файл здесь`;
}

function saveFile() {
  const name = document.getElementById('editorFilename').textContent;
  addConsole('ok', `[INFO] File saved: ${name}`);
  notify(`💾 ${name} сохранён!`);
}

function handleFileUpload(files) {
  if (!files || !files.length) return;
  const list = document.getElementById('fileList');
  Array.from(files).forEach(f => {
    const li = document.createElement('li');
    li.className = 'file-item';
    li.ondblclick = () => openFile(f.name);
    li.innerHTML = `
      <span class="file-icon">📄</span>
      <span class="file-name">${f.name}</span>
      <span class="file-size">${(f.size / 1024).toFixed(1)} КБ</span>
      <div class="file-actions">
        <button class="kick-btn" onclick="event.stopPropagation();openFile('${f.name}')" style="border-color:rgba(124,58,237,0.25);color:var(--primary)">📝</button>
        <button class="kick-btn" onclick="event.stopPropagation();this.closest('.file-item').remove();notify('🗑️ Удалён')">🗑️</button>
      </div>`;
    list.appendChild(li);
    addConsole('ok', `[INFO] Uploaded: ${f.name}`);
  });
  notify(`📤 ${files.length} файл(ов) загружено`);
}

function deleteFile(name) {
  notify(`🗑️ ${name} удалён`);
  addConsole('warn', `[INFO] Deleted: ${name}`);
}

function createNewFile() {
  const name = prompt('Имя нового файла:');
  if (!name) return;
  const list = document.getElementById('fileList');
  const li = document.createElement('li');
  li.className = 'file-item';
  li.ondblclick = () => openFile(name);
  li.innerHTML = `
    <span class="file-icon">📄</span>
    <span class="file-name">${name}</span>
    <span class="file-size">0 КБ</span>
    <div class="file-actions">
      <button class="kick-btn" onclick="event.stopPropagation();openFile('${name}')" style="border-color:rgba(124,58,237,0.25);color:var(--primary)">📝</button>
      <button class="kick-btn" onclick="event.stopPropagation();this.closest('.file-item').remove()">🗑️</button>
    </div>`;
  list.appendChild(li);
  notify(`📄 Файл ${name} создан`);
}

function createNewFolder() {
  const name = prompt('Имя новой папки:');
  if (!name) return;
  const list = document.getElementById('fileList');
  const li = document.createElement('li');
  li.className = 'file-item';
  li.ondblclick = () => openFolder(name);
  li.innerHTML = `
    <span class="file-icon">📁</span>
    <span class="file-name">${name}/</span>
    <span class="file-size">—</span>
    <div class="file-actions">
      <button class="kick-btn" onclick="event.stopPropagation();this.closest('.file-item').remove()">🗑️</button>
    </div>`;
  list.prepend(li);
  notify(`📁 Папка ${name} создана`);
}

// ==================== NOTIFY ====================
function notify(msg) {
  const el = document.getElementById('notif');
  document.getElementById('notifText').textContent = msg;
  el.classList.add('show');
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  updateSrvAddr();

  const nameInput = document.getElementById('setName');
  if (nameInput) nameInput.addEventListener('input', updateSrvAddr);
});
