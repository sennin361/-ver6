const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const ADMIN_PASSWORD = 'sennin151522';

app.use(express.static(path.join(__dirname, 'public')));

const rooms = {};

io.on('connection', (socket) => {
  console.log('ユーザー接続:', socket.id);

  socket.on('join', ({ username, room }) => {
    if (!rooms[room]) {
      rooms[room] = { chatHistory: [], bannedUsers: new Set() };
    }

    if (rooms[room].bannedUsers.has(username)) {
      socket.emit('banned');
      socket.disconnect();
      return;
    }

    socket.username = username;
    socket.room = room;
    socket.join(room);

    socket.emit('chat history', rooms[room].chatHistory);
    io.to(room).emit('system message', `${username} さんが入室しました`);
  });

  socket.on('chat message', (msg) => {
    if (!socket.username || !socket.room) return;
    const time = new Date().toLocaleTimeString();
    const messageData = { username: socket.username, msg, time };
    rooms[socket.room].chatHistory.push(messageData);
    io.to(socket.room).emit('chat message', messageData);
  });

  socket.on('disconnect', () => {
    if (socket.username && socket.room) {
      io.to(socket.room).emit('system message', `${socket.username} さんが退室しました`);
      socket.leave(socket.room);
    }
  });

  socket.on('ban user', (data) => {
    if (data.password !== ADMIN_PASSWORD) return;
    const room = data.room;
    if (!rooms[room]) return;
    rooms[room].bannedUsers.add(data.username);
    io.to(room).emit('system message', `${data.username} は垢バンされました`);
    for (const [id, s] of io.sockets.sockets) {
      if (s.username === data.username && s.room === room) {
        s.emit('banned');
        s.disconnect();
      }
    }
  });

  socket.on('reset server', (password) => {
    if (password !== ADMIN_PASSWORD) return;
    for (const room in rooms) {
      rooms[room].chatHistory = [];
      rooms[room].bannedUsers.clear();
      io.to(room).emit('system message', `サーバーがリセットされました`);
    }
  });

  socket.on('broadcast', (data) => {
    if (data.password !== ADMIN_PASSWORD) return;
    const room = data.room;
    if (!rooms[room]) return;
    io.to(room).emit('system message', `管理者から: ${data.message}`);
  });

  socket.on('request history', (data) => {
    if (data.password !== ADMIN_PASSWORD) return;
    const room = data.room;
    if (!rooms[room]) return;
    socket.emit('chat history', rooms[room].chatHistory);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`サーバー起動中 port:${PORT}`);
});
