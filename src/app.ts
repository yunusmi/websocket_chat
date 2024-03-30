import WebSocket from 'ws';
import * as dotenv from 'dotenv';
import { server } from './config/ws.config';
import { messages } from './data/chat';
import { MessageBody } from './utils/interfaces';
import { getMessages, setMsgTime, generateRandomId } from './utils/functions';

dotenv.config();

server.on('connection', (ws) => {
  // Отправка текущих сообщений при подключении нового клиента
  getMessages(ws);

  // Обработка входящих сообщений от клиента
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message.toString());
    switch (parsedMessage.type) {
      case 'CREATE_MESSAGE':
        // Добавление нового сообщения в массив и отправка его всем клиентам
        const newMessage: MessageBody = {
          msg_id: generateRandomId(),
          name: parsedMessage.data.name,
          message: parsedMessage.data.message,
          msg_time: setMsgTime(),
        };
        messages.push(newMessage);
        server.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(newMessage));
          }
        });
        console.log(newMessage);
        break;
      case 'DELETE_MESSAGE':
        // Удаление сообщения по его id и отправка информации о удалении всем клиентам
        const msgIdToDelete = parsedMessage.data.msg_id;
        const index = messages.findIndex((msg) => msg.msg_id === msgIdToDelete);
        if (index !== -1) {
          const deletedMessage = messages.splice(index, 1)[0];
          server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: 'MESSAGE_DELETED',
                  data: deletedMessage,
                })
              );
            }
          });
        }
        break;
      default:
        break;
    }
  });
});

server.on('listening', () => {
  console.log(`WebSocket запущен на порту ${process.env.SERVER_PORT}`);
});

server.on('error', (error) => {
  console.error('Ошибка сервера:', error);
});
