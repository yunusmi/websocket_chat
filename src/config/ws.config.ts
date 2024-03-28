import { WebSocket } from 'ws';
import * as dotenv from 'dotenv';

dotenv.config();

// Конфигурация сервера
const serverPort: number = parseInt(process.env.SERVER_PORT!);

export const server = new WebSocket.Server({
  port: serverPort,
});
