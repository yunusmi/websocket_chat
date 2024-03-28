import WebSocket from 'ws';
import { messages } from '../data/chat';

// Функция получения сообщений по умолчанию
export function getMessages(ws: WebSocket) {
  messages.forEach((message) => {
    ws.send(JSON.stringify(message));
  });
}
