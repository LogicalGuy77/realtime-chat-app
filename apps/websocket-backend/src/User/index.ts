import { WebSocket } from "ws";

export class User{
    id : string
    name : string
    ws : WebSocket
    rooms : string[]
    constructor(id: string, name: string, ws: WebSocket){
        this.id = id;
        this.name = name;
        this.ws = ws;
        this.rooms = [];
    }
    public joinRoom(roomId: string){
        if(!this.rooms.includes(roomId)){
            this.rooms.push(roomId);
        }
        else{
            this.ws.send(JSON.stringify({error: "User already in room"}));
        }
    }

    public leaveRoom(roomId: string){
        this.rooms = this.rooms.filter(room => room !== roomId);
    }

    public createRoom(roomId: string){
        this.rooms.push(roomId);
    }

    
}