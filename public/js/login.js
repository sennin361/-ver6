const socket = io();

const loginArea = document.getElementById('login-area');
const adminBtn = document.getElementById('admin-btn');
const joinBtn = document.getElementById('join-btn');
const usernameInput = document.getElementById('username');
const roomInput = document.getElementById('room');

const adminLoginArea = document.getElementById('admin-login');
const adminPasswordInput = document.getElementById('admin-password');
const adminLoginBtn = document.getElementById('admin-login-btn');
const adminLoginCancelBtn = document.getElementById('admin-login-cancel');

const adminArea = document.getElementById('admin-area');

joinBtn.onclick = () => {
  const username = usernameInput.value.trim();
  const room = roomInput.value.trim();

  if (!username || !room) {
    alert('ユーザー名とあいことばを入力してください');
    return;
  }

  // ここでチャット画面に遷移（省略、要作成）
  // たとえば location.href = `chat.html?username=${encodeURIComponent(username)}&room=${encodeURIComponent(room)}`;

  alert('チャット画面は未実装です。このままのコードをもとに拡張してください。');
};

adminBtn.onclick = () => {
  loginArea.style.display = 'none';
  adminLoginArea.style.display = 'block';
};

adminLoginCancelBtn.onclick = () => {
  adminLoginArea.style.display = 'none';
  loginArea.style.display = 'block';
};

adminLoginBtn.onclick = () => {
  const pw = adminPasswordInput.value;
  if (pw === 'sennin151522') {
    adminLoginArea.style.display = 'none';
    adminArea.style.display = 'block';
  } else {
    alert('パスワードが違います');
  }
};
