// Faça seu código aqui

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

const PORT = 3000;

const createNickname = () => {
  const random1 = Math.random().toString(36).substr(2, 8);
  const random2 = Math.random().toString(36).substr(2, 8);
  const createdNickname = `${random1}${random2}`;
  return createdNickname;
  };

io.on('connection', async (socket) => {
  const socketId = socket.id;
  const randomNickname = createNickname();
  io.to(socketId).emit('createNickname', randomNickname);
  console.log(`Alguém se conectou ${randomNickname}`);

  const oldMessages = await messagesModel.getAll();

  oldMessages.map((message) => {
    const messageFormat = `${message.timestamp} - ${message.nickname}: ${message.message}`;
    return io.to(socketId).emit('message', messageFormat);
    });

  const date = moment().format('DD-MM-yyyy HH:mm:ss A');
  // https://www.horadecodar.com.br/2020/05/13/como-formatar-data-no-javascript-date-moment-js/
 
  socket.on('message', async ({ nickname, chatMessage }) => {  
  await messagesModel.create(chatMessage, nickname, date);
  io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
  });
  socket.emit('welcomeMessage', ('Seja bem vindo ao WebChat'));
  // socket.broadcast.emit('message', (`Alguém entrou`))

  socket.on('disconnect', () => {
    console.log('Alguém saiu');
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
