const socket = window.io();
const messageInput = document.querySelector('#messageInput');
const nicknameInput = document.querySelector('#nicknameInput');
const onlineUsersUl = document.querySelector('#onlineUsers');
const messageUl = document.querySelector('#messages');
const messageForm = document.querySelector('#messageForm');
const nicknameForm = document.querySelector('#nicknameForm');

const dataTestId = 'data-testid';

const displayMyNickname = ({ randomNickname, socketId }) => {
  const li = document.createElement('li');
  li.innerHTML = randomNickname;
  li.setAttribute(dataTestId, 'online-user');
  li.setAttribute('id', socketId);
  onlineUsersUl.appendChild(li);
  return socket.emit('randomNickToList', randomNickname);
};

socket.on('createRandomNickname', ({ randomNickname, socketId }) => {
  sessionStorage.setItem('nickname', randomNickname);
  sessionStorage.setItem('socketId', socketId);
  return displayMyNickname({ randomNickname, socketId });
});

const updateMyNickname = (nickname) => {
  const li = document.getElementsByTagName('li')[0];
  li.innerHTML = nickname;
  sessionStorage.setItem('nickname', nickname);
  return socket.emit('updatedNickname', nickname);
};

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nickname = nicknameInput.value;
  nicknameInput.value = '';
  return updateMyNickname(nickname);
});
 
messageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const chatMessage = messageInput.value;
      const nickname = sessionStorage.getItem('nickname');
      socket.emit('message', { chatMessage, nickname }); // envia para o server
      messageInput.value = '';
      return true;
    });

const createMessage = (message) => {
      const li = document.createElement('li');
      li.innerText = message;
      li.setAttribute(dataTestId, 'message');
      return messageUl.appendChild(li);
    };

socket.on('message', (message) => createMessage(message)); // recebe do server e renderiza 

const createOnlineUserList = (onlineUsersList) => {
      onlineUsersUl.innerHTML = '';
      onlineUsersList.forEach((user) => {
        const li = document.createElement('li');
        li.setAttribute(dataTestId, 'online-user');
        li.innerText = user;
        const myNickname = sessionStorage.getItem('nickname');
        if (user === myNickname) {
          return onlineUsersUl.prepend(li);
        }
        return onlineUsersUl.appendChild(li);
      });
    };

    socket.on('onlineUserList', (onlineUsersList) => createOnlineUserList(onlineUsersList));
