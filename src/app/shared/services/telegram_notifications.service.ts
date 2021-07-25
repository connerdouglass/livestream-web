import { Injectable } from "@angular/core";
import { merge, Observable, of, Subject } from "rxjs";
import { map, mapTo, scan, shareReplay, switchMap, take } from "rxjs/operators";
import { ApiService } from "./api.service";
import { AppStateService } from "./app_state.service";
import { NotificationsService } from "./notifications.service";
import { TelegramAuthService } from "./telegram_auth.service";

interface ITelegramNotificationSub {
    creator_id: number;
}

interface ITelegramNotificationState {
    registered: boolean;
    subs: ITelegramNotificationSub[];
}

@Injectable()
export class TelegramNotificationsService implements NotificationsService {

    /**
     * Subject where subscription changes are emitted
     */
    private sub_change$ = new Subject<{ creator_id: number; subbed: boolean; }>();

    /**
     * Subject we can use to force registration status when the user is redirected to the bot
     */
    private force_register$ = new Subject<void>();

    /**
     * Observable to the telegram notifications state for the local user
     */
    private loaded_state$ = this.telegram_auth_service.user$
        .pipe(switchMap(async user => {
            try {
                return await this.api_service.fetch<ITelegramNotificationState>('/v1/notifications/telegram/state', {
                    user,
                });
            } catch (err) {
                console.error(err);
                return {
                    registered: false,
                    subs: [],
                };
            }
        }))

    /**
     * Observable to the telegram notifications state for the local user, but allowing us to override
     * the loaded state manually.
     */
    private state$ = merge(
            this.loaded_state$,
            this.force_register$.pipe(mapTo({ registered: true, subs: [] } as ITelegramNotificationState)),
        )
        .pipe(shareReplay(1));

    /**
     * Observable to all of the subscriptions for the current user
     */
    private readonly subscriptions$ = this.state$
        .pipe(map(state => state?.subs ?? []))
        .pipe(switchMap(initial_subs => this.sub_change$.pipe(scan((subs, change) => {

            // Add the sub, if it's not already in the list
            if (change.subbed) {
                if (!subs.some(sub => sub.creator_id === change.creator_id)) {
                    return [
                        ...subs,
                        { creator_id: change.creator_id }
                    ];
                }
                return subs;
            }

            // If the sub is being removed, remove it
            else {
                return subs.filter(sub => sub.creator_id !== change.creator_id);
            }

        }, initial_subs))))
        .pipe(shareReplay(1));

    /**
     * Observable to whether or not the user is registered for Telegram notifications
     */
    public readonly is_registered$ = this.state$
        .pipe(map(state => !!(state?.registered)));

    public constructor(
        private app_state_service: AppStateService,
        private api_service: ApiService,
        private telegram_auth_service: TelegramAuthService,
    ) {}

    public supported$(): Observable<boolean> {
        return this.telegram_auth_service.user$.pipe(map(user => !!user));
    }

    /**
     * Returns an observable to the subscription status of the local user to a creator ID
     * @param creator_id the creator profile ID to check for
     */
    public subscribed_to$(creator_id: number): Observable<boolean> {
        return this.subscriptions$
            .pipe(map(subs => subs.some(sub => sub.creator_id === creator_id)));
    }

    /**
     * Registers the user with the Telegram bot
     */
    public async register(): Promise<void> {

        // Get the app state, which contains the username of the Telegram bot
        const state = await this.app_state_service.state$
            .pipe(take(1))
            .toPromise();

        // Open a new page for the Telegram bot, where the user will "Start" the bot,
        // giving it access to communicate
        window.open(`https://t.me/${state.telegram_bot_username}`, '_blank');

    }

    /**
     * Sets the subscription status for a given creator profile
     * @param creator_id the creator id to subscribe or unsubscribe to
     * @param subscribed the subscription status to set
     */
    public async set_subscribed(creator_id: number, subscribed: boolean): Promise<void> {

        // If we're subscribing
        if (subscribed) {

            // Make sure we're registered
            const registered = await this.is_registered$.pipe(take(1)).toPromise();
            if (!registered) await this.register();

            // Force a pretend registered state, assuming the user did indeed register
            this.force_register$.next();

        }

        // Set the registered state
        this.sub_change$.next({
            creator_id,
            subbed: subscribed,
        });
        
        // Get the telegram user
        const user = await this.telegram_auth_service.user$.pipe(take(1)).toPromise();

        // Send the update to the backend
        await this.api_service.fetch('/v1/notifications/telegram/update-sub', {
            user,
            creator_id,
            subscribed,
        });

    }

}
