import { Component, Input } from "@angular/core";
import { scan, shareReplay } from "rxjs/operators";
import { SocketService } from "../../services/socket.service";

interface IMessage {
    username: string;
    message: string;
}

@Component({
    selector: 'app-live-chat',
    styleUrls: ['./live-chat.component.scss'],
    templateUrl: './live-chat.component.html',
})
export class LiveChat {

    /**
     * The stream identifier whose chat should be presented here
     */
    @Input() public stream_id!: string;

    public messages$ = this.socket_service.event$('chat.message')
        .pipe(scan((msgs: IMessage[], m: IMessage) => {
            const new_msgs = [
                ...msgs,
                m,
            ];
            while (new_msgs.length > 100) new_msgs.shift();
            return new_msgs;
        }, []))
        .pipe(shareReplay(1));

    public constructor(
        private socket_service: SocketService,
    ) {}

}
