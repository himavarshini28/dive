import { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";
import JWT_SECRET from '@repo/backend-common/config';

const PORT = 8080; 
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server listening on ws://localhost:${PORT}`);

wss.on('connection', function connection(ws,request) {
  console.log('⚡ New connection attempt...');
  
  const url=request.url;
  if(!url) {
    console.log('❌ No URL provided, closing connection');
    return;
  }
  
  const queryParams= new URLSearchParams(url.split('?')[1]);
  const token=queryParams.get('token')||"";
  
  console.log('🔑 Token received:', token.substring(0, 20) + '...');
  
  try {
    const decode=jwt.verify(token,JWT_SECRET); 
    if(typeof decode=="string")
    {
      console.log('❌ Token is string type, closing connection');
      ws.close();
      return;
    }
    if(!decode || !decode.userId)
    {
      console.log('❌ No userId in token, closing connection');
      ws.close();
      return;
    }
    
    console.log('✅ Client connected! UserId:', decode.userId);
  } catch (error) {
    console.log('❌ JWT verification failed:', error);
    ws.close();
    return;
  }
  
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('Received:', data.toString());
    ws.send(`Echo: ${data}`);
  });
  //ws.onopen = () => console.log('Connected!');
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.send('Connected to WebSocket server!');
});