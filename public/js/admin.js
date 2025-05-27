const socket = io();

const adminRoomInput = document.getElementById('admin-room');
const adminFetchHistoryBtn = document.getElementById('admin-fetch-history');
const adminHistoryDiv = document.getElementById('admin-history');

const adminBanUsernameInput = document.getElementById('admin-ban-username');
const adminBanBtn = document.getElementById('admin-ban-btn');

const adminBroadcastMessageInput = document.getElementById('admin-broadcast-message');
const adminBroadcastBtn = document.getElementById('admin-broadcast-btn');

const adminResetBtn = document.getElementById('admin-reset-btn');
const adminLogoutBtn = document.getElementById('admin-logout-btn');

const ADMIN_PASSWORD = 'sennin151522';

adminFetchHistoryBtn.onclick = () => {
  const room = adminRoomInput.value.trim();
  if (!room) {
    alert('部屋名を入力してください');
    return;
  }
  socket.emit('request history', {
