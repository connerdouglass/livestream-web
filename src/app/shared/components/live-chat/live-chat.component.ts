import { Component, Input } from "@angular/core";
import { scan, shareReplay, tap } from "rxjs/operators";
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

    /**
     * Observable to the messages on the live chat
     */
    public messages$ = this.socket_service.event$('chat.message')
        .pipe(scan((msgs: IMessage[], m: IMessage) => {
            const new_msgs = [ ...msgs, m ];
            while (new_msgs.length > 100) new_msgs.shift();
            return new_msgs;
        }, []))
        .pipe(tap(() => {
            setTimeout(() => {
                this.adjust_scroll();
            }, 0);
        }))
        .pipe(shareReplay(1));

    public constructor(
        private socket_service: SocketService,
    ) {}

    /**
     * Checks if the live chat is locked to the bottom
     */
    private is_bottom_locked(): boolean {
        return true;
    }

    /**
     * Scrolls the live chat box to the bottom
     */
    private scroll_to_bottom(): void {
        
    }

    /**
     * Adjusts the scrolling of the viewport when a new message is received
     */
    private adjust_scroll(): void {

        // If we're locked to the bottom
        if (this.is_bottom_locked()) this.scroll_to_bottom();

    }

}
