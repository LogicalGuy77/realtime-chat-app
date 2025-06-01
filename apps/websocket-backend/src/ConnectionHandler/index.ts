import { WebSocket, Server} from "ws";
import { User } from "../User/index";
import {Room} from "../Room/index";
import {prisma} from "@repo/database/config"
import jwt, { JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from "@repo/common-backend/config"

export class Handler {
    private users: User[]
    private rooms: Room[]
    
    constructor(users: User[], rooms: Room[]){
        this.users = users;
        this.rooms = rooms;
    }

    public handleConnection(ws: WebSocket){
       ws.on("message", (message: string) => {
        const {command , roomId , msg , roomName , userName , token} = JSON.parse(message);
        let userID;
        try{
            const decoded = jwt.verify(token, JWT_SECRET);
            userID = (decoded as JwtPayload).id;
            if(!decoded){
               ws.send(JSON.stringify({error: "Invalid token"}));
               return;
            }
        } catch (err){
            ws.send(JSON.stringify({err}));
            return;
        }
         
        switch(command){
            case "connect":
                this.handleUserConnection(userID, userName, ws);
                break;
            case "joinRoom":
                this.handleJoinRoom(userID, roomId, ws);
                break;
            case "leaveRoom":
                this.handleLeaveRoom(userID, roomId, ws);
                break;
            case "message":
                this.handleMessage(userID, roomId, msg);
                break;
            default:
                ws.send(JSON.stringify({error: "Invalid command"}));
        }
       });
    }

    private handleUserConnection(userId: string, userName: string, ws: WebSocket) {
        const existingUser = this.users.find(user => user.id === userId);
        
        if(existingUser) {
            existingUser.ws = ws;
            ws.send(JSON.stringify({message: `Welcome back, ${userName}!`}));
            console.log(`User ${userName} (${userId}) reconnected`);
        } else {
            const newUser = new User(userId, userName, ws);
            this.users.push(newUser);
            console.log(`User ${userName} (${userId}) connected, total users: ${this.users.length}`);
            ws.send(JSON.stringify({message: `User ${userName} connected successfully`}));
        }
    }

    private handleJoinRoom(userId: string, roomId: string, ws: WebSocket) {
        console.log(`Join room request: userId=${userId}, roomId=${roomId}`);
        console.log(`Available users: ${this.users.map(u => u.id).join(', ')}`);
        console.log(`Available rooms: ${this.rooms.map(r => r.id).join(', ')}`);
        
        const user = this.users.find(user => user.id === userId);
        const room = this.rooms.find(room => room.id === roomId);
        
        if(!user) {
            console.log(`User ${userId} not found in users list`);
            ws.send(JSON.stringify({error: "User not found"}));
            return;
        }
        
        if(!room) {
            console.log(`Creating new room ${roomId}`);
            const newRoom = new Room(roomId, `Room-${roomId}`, []);
            this.rooms.push(newRoom);
            user.joinRoom(roomId);
            newRoom.addUser(user);
            ws.send(JSON.stringify({message: `Created and joined room ${roomId}`}));
        } else {
            user.joinRoom(roomId);
            room.addUser(user);
            ws.send(JSON.stringify({message: `User ${user.name} joined room ${room.name}`}));
            room.broadcastMessage(`User ${user.name} joined room`, userId);
        }
    }

    private handleLeaveRoom(userId: string, roomId: string, ws: WebSocket){
        const user = this.users.find(user => user.id === userId);
        const room = this.rooms.find(room => room.id === roomId);
        
        if(user && room){
            user.leaveRoom(roomId);
            room.removeUser(user);
            ws.send(JSON.stringify({message: `User ${user.name} left room ${room.name}`}));
            room.broadcastMessage(`User ${user.name} left room`, userId);
        } else {
            ws.send(JSON.stringify({error: "Cannot leave room: user or room not found"}));
        }
    }

    private async handleMessage(userId: string, roomId: string, msg: string){
        const user = this.users.find(user => user.id === userId);
        const room = this.rooms.find(room => room.id === roomId);
        
        if(!user) {
            console.log(`Message failed: User ${userId} not found`);
            return;
        }
        
        if(!room) {
            user.ws.send(JSON.stringify({error: `Room ${roomId} not found`}));
            return;
        }
        
        try {
            const savedMessage = await prisma.messages.create({
                data: {
                    roomId: roomId,
                    content: msg,
                    senderId: userId,
                }
            });
            
            // Broadcast message to all OTHER users in the room
            room.broadcastMessage(msg, userId);
            
            // Send confirmation to sender with message ID but not the message content
            user.ws.send(JSON.stringify({
                type: "message_sent",
                messageId: savedMessage.id,
                status: "delivered",
                time: new Date().toISOString()
            }));
        } catch (error) {
            console.error("Error saving message:", error);
            user.ws.send(JSON.stringify({
                type: "error",
                message: "Error saving message to database"
            }));
        }
    }
}