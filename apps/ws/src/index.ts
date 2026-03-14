import {WebSocket, WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";
import JWT_SECRET from '@repo/backend-common/config';
import { prismaClient } from "@repo/db/client";

const PORT = 8080; 
interface User
{
  ws:WebSocket,
  rooms:string[]
  userId:string
} 
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server listening on ws://localhost:${PORT}`);

function userAuthenticated(token:string):string|null{
 try {
    const decode=jwt.verify(token,JWT_SECRET); 
    if(typeof decode=="string")
    {
      console.log('Token is string type, closing connection');
      
      return null;
    }
    if(!decode || !decode.userId)
    {
      console.log('No userId in token, closing connection');
      return null;
    }
    
    console.log('Client connected! UserId:', decode.userId);
    return decode.userId;
  } catch (error) {
    console.log('JWT verification failed:', error);
    return null;
  }
  
}

wss.on('connection', function connection(ws,request) {
  console.log(' New connection attempt...');
   
  const url=request.url;
  if(!url) {
    console.log('No URL provided, closing connection');  
    return;
  }
  
  const queryParams= new URLSearchParams(url.split('?')[1]);
  const token=queryParams.get('token')||"";

  console.log('🔑 Token received:', token.substring(0, 20) + '...');
  
  const userId=userAuthenticated(token);

  if(userId == null)
  {
    ws.close();
    return;
  }
 
  ws.on('error', console.error);

  ws.on('message',async function message(data) {
    let parsedData;
    if(typeof data != 'string')
    {
      parsedData=JSON.parse(data.toString());
    }
    else{
      parsedData=JSON.parse(data);
    }
    const users : User[] =[]
    if(parsedData.type=='join_room')
    {
        const user=users.find(x=>x.ws===ws);
        user?.rooms.push(parsedData.roomId);
    }
    if(parsedData.type=='leave_room')
    {
      const user=users.find(x=>x.ws===ws);
      if(!user)return;
      user.rooms=user?.rooms.filter(x=>x!==parsedData.roomId)
    }
      console.log("message received")
    console.log(parsedData);
    if(parsedData.type=='chat')
    {
      const roomId=parsedData.roomId;
      const message=parsedData.message;
      await prismaClient.chat.create({
        data:{
            roomId:Number(roomId),
            message,
            userId
        }
      });
      users.forEach(user=>{
        if(user.rooms.includes(roomId)){
          user.ws.send(JSON.stringify({
            type:'chat',
            message:message,
            roomId
          }))
        }
      })
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.send('Connected to WebSocket server!');
});