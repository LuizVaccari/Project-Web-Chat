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

app.use(cors());

const PORT = 3000;

io.on('connection', (socket) => {
  console.log('Alguém se conectou');
  const date = moment().format('DD-MM-yyyy HH:mm:ss A');
  // https://www.horadecodar.com.br/2020/05/13/como-formatar-data-no-javascript-date-moment-js/
 
  socket.on('disconnect', () => {
    console.log('Alguém saiu');
  });
  socket.on('message', ({ nickname, chatMessage }) => {
    // const  { nickname, chatMessage } = message
    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
  });
  socket.emit('welcomeMessage', ('Seja bem vindo ao WebChat'));
  // socket.broadcast.emit('message', (`Alguém entrou`))
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
