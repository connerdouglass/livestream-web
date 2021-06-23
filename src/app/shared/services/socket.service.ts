import { Injectable } from "@angular/core";
import { fromEvent, Observable } from "rxjs";
import SocketIOClient from 'socket.io-client';
import { environment } from "src/environments/environment";
import { User } from "../components/telegram-login-button/telegram-login-button.component";

@Injectable({
    providedIn: 'root',
})
export class SocketService {

    /**
     * The socket connection to the API
     */
    private socket = SocketIOClient(environment.api_baseurl);

    public constructor() {
        this.socket.on('connected', () => {
            console.log('SOCKET CONNECTED');
        });
    }

    public join_stream(stream_id: string): void {
        this.socket.emit('stream.join', {
            stream_id,
        });
    }

    public send_message(stream_id: string, message: string, user: User): void {
        this.socket.emit('chat.message', {
            stream_id,
            message,
            user,
        });
    }

    public event$<T = any>(event: string): Observable<T> {
        return fromEvent(this.socket, event);
    }

}