import { Injectable } from "@angular/core";
import { take } from "rxjs/operators";
import { ApiService } from "./api.service";
import { AppStateService } from "./app_state.service";

@Injectable()
export class NotificationsService {

    public constructor(
        private app_state_service: AppStateService,
        private api_service: ApiService,
    ) {}

    /**
     * Prompts the user to accept or deny push notifications
     */
    public async request_notifications(creator_id: number): Promise<boolean> {

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

        const serviceWorker = register.installing ?? register.waiting ?? register.active;
        // let serviceWorker: any;
        // if (register.installing) {
        //     serviceWorker = register.installing;
        //     // console.log('Service worker installing');
        // } else if (register.waiting) {
        //     serviceWorker = register.waiting;
        //     // console.log('Service worker installed & waiting');
        // } else if (register.active) {
        //     serviceWorker = register.active;
        //     // console.log('Service worker active');
        // }
        if (!serviceWorker) return false;

        const subscribe_func = async () => {

            // Get the app state
            const state = await this.app_state_service.state$
                .pipe(take(1))
                .toPromise();
            console.log(state);

            // Subscribe to notifications
            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(state.vapid_public_key),
            });

            // Send the registration details to the backend
            await this.api_service.fetch('/v1/notifications/subscribe', {
                registration_data: JSON.stringify(subscription.toJSON()),
                creator_id: creator_id,
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
