import {WebSocket , Server} from 'ws';
import {User} from "./User/index";
import {Room} from "./Room/index";
import {Handler} from "./ConnectionHandler/index"
export class WebSocketServer {
   private wss: Server;
    private users: User[];
    private rooms: Room[];
    private handler: Handler;
    constructor(port : number) {
         this.wss = new Server({port: port});
            this.users = [];
            this.rooms = [];
             this.handler = new Handler(this.users , this.rooms);
            this.init();
        }

    

    private init() {
        this.wss.on("connection" , (ws: WebSocket) => {
              this.handler.handleConnection(ws);
        });

        console.log(`Server started on port ${this.wss.options.port}`);
    }
}

