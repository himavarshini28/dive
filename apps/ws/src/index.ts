import { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";
import JWT_SECRET from '@repo/backend-common/config';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server listening on ws://localhost:${PORT}`);

wss.on('connection', function connection(ws,request) {
  const url=request.url;
  if(!url) return;
  const queryParams= new URLSearchParams(url.split('?')[1]);
  const token=queryParams.get('token')||"";
  const decode=jwt.verify(token,JWT_SECRET); 
  if(typeof decode=="string")
  {
    ws.close();
    return;
  }
  if(!decode || !decode.userId)
    {
      ws.close();
      return;
    } 
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