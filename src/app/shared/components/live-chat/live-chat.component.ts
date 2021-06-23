import { Component, Input } from "@angular/core";
import { scan, shareReplay, tap } from "rxjs/operators";
import { AppStateService } from "../../services/app_state.service";
import { SocketService } from "../../services/socket.service";
import { TelegramAuthService } from "../../services/telegram_auth.service";
import { User } from "../telegram-login-button/telegram-login-button.component";

interface IMessage {
    username: string;
    photo_url?: string;
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
     * The value of the text field
     */
    public field_value = '';

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
        public app_state_service: AppStateService,
        public telegram_auth_service: TelegramAuthService,
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

    public clicked_send(user: User): void {

        // If the field value is empty
        if (this.field_value.trim().length === 0 || this.field_value.trim().length > 280) return;

        // Send the message
        this.socket_service.send_message(
            this.stream_id,
            this.field_value.trim(),
            user,
        );

        // Clear the field value
        this.field_value = '';

    }

}
