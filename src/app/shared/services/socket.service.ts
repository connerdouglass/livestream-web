import { Injectable } from "@angular/core";
import SocketIOClient from 'socket.io-client';
import { environment } from "src/environments/environment";

@Injectable()
export class SocketService {

    /**
     * The socket connection to the API
     */
    private socket = SocketIOClient(environment.api_baseurl);

    public stuff() {

        this.socket.on('connect', () => {
            console.log('SOCKET CONNECTED');
        });

    }

    public join_stream(stream_id: string) {
        this.socket.emit('stream.join', {
            stream_id,
        });
    }

}