import { Injectable } from "@angular/core";
import { fromEvent, Observable } from "rxjs";
import { map, shareReplay, switchMap, take } from "rxjs/operators";
import SocketIOClient from 'socket.io-client';
import { User } from "../components/telegram-login-button/telegram-login-button.component";
import { SiteConfigService } from "./site_config.service";

@Injectable({
    providedIn: 'root',
})
export class SocketService {

    /**
     * The socket connection to the API
     */
    private socket$ = this.site_config_service.site_config$
        .pipe(map(config => SocketIOClient(config.api_baseurl)))
        .pipe(shareReplay(1));

    public constructor(
        private site_config_service: SiteConfigService,
    ) {}

    private async use_socket(fn: (socket: SocketIOClient.Socket) => void): Promise<void> {
        const socket = await this.socket$
            .pipe(take(1))
            .toPromise();
        fn(socket);
    }

    public join_stream(stream_id: string): void {
        this.use_socket(socket => {
            socket.emit('stream.join', {
                stream_id,
            });
        });
    }

    public send_message(stream_id: string, message: string, user: User): void {
        this.use_socket(socket => {
            socket.emit('chat.message', {
                stream_id,
                message,
                user,
            });
        });
    }

    public event$<T = any>(event: string): Observable<T> {
        return this.socket$
            .pipe(switchMap(socket => fromEvent<T>(socket, event)));
    }

}