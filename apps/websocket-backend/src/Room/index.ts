
import { User } from "../User/index";
import { WebSocket } from "ws";

export class Room {
    id: string;
    name: string;
    users: User[];

    constructor(id: string, name: string, users: User[] = []) {
        this.id = id;
        this.name = name;
        this.users = users;
    }

    addUser(user: User) {
        
        if (!this.users.some(u => u.id === user.id)) {
            this.users.push(user);
        }
    }

    removeUser(user: User) {
        this.users = this.users.filter(u => u.id !== user.id);
    }

    
    broadcastMessage(message: string, senderId: string) {
        const sender = this.users.find(u => u.id === senderId);
        const senderName = sender?.name || "Unknown";
       this.users.forEach(user => {
            
            if (user.id !== senderId && user.ws.readyState === WebSocket.OPEN) {
                try {
                    user.ws.send(JSON.stringify({
                        type: "message",
                        roomId: this.id,
                        message: message,
                        from: senderName, 
                        time: new Date().toLocaleTimeString()
                    }));
                    
                } catch (err) {
                    console.error(`Failed to send message to user ${user.name}:`, err);
                    sender?.ws.send(JSON.stringify({
                        type: "error"}) );
                }
            }
        });
    }

   
}