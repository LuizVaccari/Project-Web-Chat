// Faça seu código aqui
// https://makeschool.org/mediabook/oa/tutorials/make-chat/saving-and-destroying-users/
// https://newbedev.com/socket-io-determine-if-a-user-is-online-or-offline
// https://www.horadecodar.com.br/2020/05/13/como-formatar-data-no-javascript-date-moment-js/
const express = require('express');
const cors = require('cors');
const moment = require('moment');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const messagesModel = require('./models/messagesModel');

app.use(cors());

app.use('/', express.static('./views'));
app.set('view engine', 'ejs');
app.set('views', './views');

const PORT = 3000;

 // cria nickname randomico de 16 caracteres
const createNickname = () => {
  const random1 = Math.random().toString(36).substr(2, 8);
  const random2 = Math.random().toString(36).substr(2, 8);
  const createdNickname = `${random1}${random2}`;
  return createdNickname;
  };

// lista de usuários
const usersList = {};

const createRandonNickname = (socketId, randomNickname, socket) => {
  io.to(socketId).emit('createRandomNickname', { randomNickname, socketId });
  socket.on('randomNickToList', (randomNick) => {
    usersList[socket.id] = randomNick;
    io.emit('onlineUserList', Object.values(usersList));
});
}; 

io.on('connection', async (socket) => {
  const socketId = socket.id.toString(); const randomNickname = createNickname();
  createRandonNickname(socketId, randomNickname, socket);
  socket.on('disconnect', () => {
    delete usersList[socket.id]; io.emit('onlineUserList', Object.values(usersList));
  });
  socket.on('updatedNickname', (nickname) => {
    usersList[socket.id] = nickname; io.emit('onlineUserList', Object.values(usersList));
  });
  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = moment().format('DD-MM-yyyy HH:mm:ss A');
    io.emit('message', (`${date} - ${nickname}: ${chatMessage}`));
    await messagesModel.create({ chatMessage, nickname, date });
  });
  const getOldMessages = async () => { 
    const oldMessages = await messagesModel.getAll();
    return oldMessages;
  };
    io.emit('oldMessages', await getOldMessages());
});

app.get('/', (req, res) => {
  res.render(path.join(__dirname, '/views'));
}); 
server.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
