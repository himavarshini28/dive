import { WebSocketServer } from 'ws';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server listening on ws://localhost:${PORT}`);

wss.on('connection', function connection(ws) {
  console.log('Client connected');
  
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('Received:', data.toString());
    ws.send(`Echo: ${data}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.send('Connected to WebSocket server!');
});