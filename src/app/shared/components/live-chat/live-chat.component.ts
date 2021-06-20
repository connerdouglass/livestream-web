import { Component, Input } from "@angular/core";

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

    public constructor(
        // private socket_service: SocketService,
    ) {}

}
