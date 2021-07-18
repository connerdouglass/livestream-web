import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

export interface ICreatorMeta {
    id: number;
    username: string;
    name: string;
    image?: string;
    live_stream: null | {
        id: number;
        identifier: string;
        title: string;
        scheduled_start_date: number;
        current_viewers: number;
        chatroom_url?: string;
    };
    next_stream: null | {
        id: number;
        identifier: string;
        title: string;
        scheduled_start_date: number;
        current_viewers: number;
    };
}

@Injectable()
export class CreatorsService {

    public constructor(
        private api_service: ApiService,
    ) {}

    public getCreatorMeta(username: string): Promise<ICreatorMeta> {
        return this.api_service.fetch('/v1/creator/get-meta', {
            username,
        });
    }

}