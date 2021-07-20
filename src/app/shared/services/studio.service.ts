import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { ApiService } from "./api.service";
import { AuthService } from "./auth.service";

export interface IStream {
    id: number;
    identifier: string;
    title: string;
    stream_key: string;
    status: string;
    streaming: boolean;
    scheduled_start_date: number;
    current_viewers: number;
}

@Injectable()
export class StudioService {

    /**
     * Observable to all the streams past, present, and future for the local creator
     */
    public readonly all_streams$ = this.auth_service.active_creator$
        .pipe(switchMap(creator => {
            if (!creator) return of([] as IStream[]);
            return this.list_streams(creator.id);
        }))

    public constructor(
        private auth_service: AuthService,
        private api_service: ApiService,
    ) {}

    /**
     * Lists all streams for the given creator ID
     * @param creator_id the creator id for which to fetch all streams
     */
    public async list_streams(creator_id: number): Promise<IStream[]> {
        const res = await this.api_service.fetch<{ streams: IStream[] }>('/v1/studio/streams/list', {
            creator_id,
        });
        return res.streams;
    }

    public async get_stream(stream_identifier: string): Promise<IStream> {
        return this.api_service.fetch<IStream>('/v1/studio/stream/get', {
            stream_id: stream_identifier,
        });
    }

    public async create_stream(creator_id: number, options: {
        title: string;
        scheduled_start_date: number;
    }): Promise<IStream> {
        return this.api_service.fetch<IStream>('/v1/studio/stream/create', {
            creator_id,
            options,
        });
    }

    public async set_stream_status(stream_identifier: string, status: string): Promise<void> {
        await this.api_service.fetch('/v1/studio/stream/set-status', {
            stream_id: stream_identifier,
            status,
        });
    }

    public async mute_chat_username(/* creator_id: number,*/ username: string): Promise<void> {
        await this.api_service.fetch('/v1/studio/chat/mute', {
            // creator_id,
            username,
        });
    }

    public async unmute_chat_username(/* creator_id: number,*/ username: string): Promise<void> {
        await this.api_service.fetch('/v1/studio/chat/unmute', {
            // creator_id,
            username,
        });
    }

}