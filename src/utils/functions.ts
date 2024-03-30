import WebSocket from 'ws';
import { messages } from '../data/chat';

export function generateRandomId() {
  return Math.random();
}

export function setMsgTime() {
  const time = new Date();
  const messageHour = time.getHours();
  const messageMinute = time.getMinutes();
  const fullTime = `${messageHour}:${messageMinute}`;
  return fullTime.toString();
}

// Функция получения сообщений по умолчанию
export function getMessages(ws: WebSocket) {
  messages.forEach((message) => {
    ws.send(JSON.stringify(message));
  });
}
