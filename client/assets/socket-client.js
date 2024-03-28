const chatContainer = document.getElementById('chat-container');
const messageForm = document.getElementById('message-form');
const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');

// Измените значение адреса сервера, если поменялись в файле конф-ции .env
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  console.log('WebSocket connection established.');
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === 'MESSAGE_DELETED') {
    deleteMessageFromUI(message.data.msg_id);
  } else if (message.msg_id && message.name && message.message) {
    displayMessage(message);
  } else {
    console.error('Received invalid message:', message);
  }
};

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  if (name && message) {
    sendMessage(name, message);
    messageInput.value = '';
  }
});

function sendMessage(name, message) {
  const data = {
    type: 'CREATE_MESSAGE',
    data: { name, message },
  };
  ws.send(JSON.stringify(data));
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function displayMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.className = 'alert alert-primary mb-2';
  messageElement.innerHTML = `
        <div id="message-${message.msg_id}">
          <strong>${message.name}:</strong> ${message.message}
          <button onclick="deleteMessage(${message.msg_id})" class="btn btn-danger btn-sm ms-2"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
  chatContainer.appendChild(messageElement);
  scrollToBottom();
}

function deleteMessage(msgId) {
  const data = {
    type: 'DELETE_MESSAGE',
    data: { msg_id: msgId },
  };
  ws.send(JSON.stringify(data));
}

function deleteMessageFromUI(msgId) {
  const messageElement = document.getElementById(`message-${msgId}`);
  if (messageElement) {
    messageElement.innerHTML = '<em>Сообщение удалено</em>';
  }
}
