import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface IAppState {
    main_creator_username: string;
    telegram_bot_username: string;
}

@Injectable()
export class AppStateService {

    /**
     * The app state fetched from the backend
     */
    public readonly state$ = from(this.api_service.fetch<IAppState>('/v1/app/get-state'))
        .pipe(shareReplay(1));

    public constructor(
        private api_service: ApiService,
    ) {}

}