import { Injectable } from "@angular/core";
import { from, merge, Observable, of, Subject } from "rxjs";
import { map, scan, shareReplay, switchMap, take } from "rxjs/operators";
import { ApiService } from "./api.service";
import { AppStateService } from "./app_state.service";
import { NotificationsService } from './notifications.service';

interface IBrowserNotificationSub {
    creator_id: number;
}

interface IBrowserNotificationState {
    registered: boolean;
    subs: IBrowserNotificationSub[];
}

@Injectable()
export class BrowserNotificationsService implements NotificationsService {

    /**
     * Subject where subscription changes are emitted
     */
    private sub_change$ = new Subject<{ creator_id: number; subbed: boolean; }>();

    /**
     * Subject we can use to force registration status when the user is redirected to the bot
     */
    private set_reg_data$ = new Subject<string>();

    /**
     * Observable to the registration data for the local user
     */
    private reg_data$: Observable<string | null> = merge(
        this.set_reg_data$,
        from((async () => {
            if (!('serviceWorker' in navigator)) return null;
            const registration = await navigator.serviceWorker.getRegistration('/sw.js')
            if (!registration) return null;
            if (!registration.pushManager) return null;
            const sub = await registration.pushManager.getSubscription();
            if (!sub) return null;
            return JSON.stringify(sub.toJSON());
        })())
    )
    .pipe(shareReplay(1));

    /**
     * Observable to the telegram notifications state for the local user
     */
    public state$ = this.reg_data$
        .pipe(switchMap(async registration_data => {
            if (!registration_data) return {
                registered: false,
                subs: [],
            };
            try {
                return await this.api_service.fetch<IBrowserNotificationState>('/v1/notifications/browser/state', {
                    registration_data,
                });
            } catch (err) {
                console.error(err);
                return {
                    registered: false,
                    subs: [],
                };
            }
        }))
        .pipe(shareReplay(1));

    /**
     * Observable to all of the subscriptions for the current user
     */
    public readonly subscriptions$ = this.state$
        .pipe(map(state => state.subs))
        .pipe(switchMap(initial_subs => merge(
            of(initial_subs),
            this.sub_change$.pipe(scan((subs, change) => {

                // Add the sub, if it's not already in the list
                if (change.subbed) {
                    return [
                        ...subs,
                        { creator_id: change.creator_id }
                    ];
                }
    
                // If the sub is being removed, remove it
                else {
                    return subs.filter(sub => sub.creator_id !== change.creator_id);
                }
    
            }, initial_subs))))
        )
        .pipe(shareReplay(1));

    /**
     * Observable to whether or not the user is registered for Telegram notifications
     */
    public readonly is_registered$ = this.state$
        .pipe(map(state => !!(state?.registered)));

    public constructor(
        private app_state_service: AppStateService,
        private api_service: ApiService,
    ) {}

    /**
     * Returns an observable to the subscription status of the local user to a creator ID
     * @param creator_id the creator profile ID to check for
     */
    public subscribed_to$(creator_id: number): Observable<boolean> {
        return this.subscriptions$
            .pipe(map(subs => subs.some(sub => sub.creator_id === creator_id)));
    }

    /**
     * Determines if browser notifications are supported on the platform
     */
    public supported$(): Observable<boolean> {
        return of(
            ('serviceWorker' in navigator) && ('PushManager' in window)
        );
    }
    
    /**
     * Checks if the service worker for notifications is registered
     */
    public async is_registered(): Promise<boolean> {
        if (!('serviceWorker' in navigator)) return false;
        const registration = await navigator.serviceWorker.getRegistration('/sw.js')
        return !!registration;
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
            if (!registered) {
                const success = await this.register();
                if (!success) return;
            }

        }

        // Get the registration data
        const registration_data = await this.reg_data$.pipe(take(1)).toPromise();
        if (!registration_data) return;

        // Set the registered state
        this.sub_change$.next({
            creator_id,
            subbed: subscribed,
        });

        // Send the update to the backend
        await this.api_service.fetch('/v1/notifications/browser/update-sub', {
            registration_data,
            creator_id,
            subscribed,
        });

    }

    /**
     * Prompts the user to accept or deny push notifications
     */
    public async register(): Promise<boolean> {

        // If the browser doesn't support service workers, bail out
        if (!('serviceWorker' in navigator)) {
            console.error('Service workers are not supported in this browser');
            return false;
        }

        // Begin the registration of the service worker
        const register: ServiceWorkerRegistration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });

        // If there is no ability to do notifications, bail out
        if (!('pushManager' in register)) {
            //@ts-ignore
            await register.unregister();
            return false;
        }

        // Get the service worker from the registration, regardless of its state
        const serviceWorker = register.installing ?? register.waiting ?? register.active;
        if (!serviceWorker) return false;

        const subscribe_func = async () => {

            // Get the app state
            const state = await this.app_state_service.state$
                .pipe(take(1))
                .toPromise();

            // Subscribe to notifications
            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(state.vapid_public_key),
            });

            // Set the new registration data
            this.set_reg_data$.next(JSON.stringify(subscription.toJSON()));

            // Send the registration details to the backend
            await this.api_service.fetch('/v1/notifications/browser/register', {
                registration_data: JSON.stringify(subscription.toJSON()),
            });

        };

        // If it's already activated
        if (serviceWorker.state === 'activated') {
            await subscribe_func();
            return true;
        }

        return new Promise<boolean>((resolve, reject) => {

            //@ts-ignore
            serviceWorker.addEventListener("statechange", async (e: any) => {
                console.log("sw statechange : ", e.target.state);
                if (e.target.state == "activated") {
                    
                    await subscribe_func();
                    resolve(true);
                    
                }
            });

        });
    }

}

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}
