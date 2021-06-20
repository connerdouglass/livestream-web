import { Injectable } from "@angular/core";
import { Subject, Observable, merge, of } from "rxjs";
import { shareReplay, map } from "rxjs/operators";
import { ApiService } from "./api.service";
import { AuthTokenService } from "./auth_token.service";

interface ICreatorProfile {
    id: number;
    username: string;
    name: string;
}

export interface IWhoAmI {
    id: number;
    username: string;
    token: string;
    creators: ICreatorProfile[];
}

@Injectable()
export class AuthService {

    /**
     * Subject emitted whenever the user has logged out
     */
    private readonly set_whoami$: Subject<IWhoAmI | null> = new Subject<IWhoAmI | null>();

    /**
     * Observable to the local user's identity.
     */
    public readonly whoami$: Observable<IWhoAmI | null> = merge(
        this.set_whoami$,
        new Observable<IWhoAmI | null>(sub => {
            (async () => {

                // If there is no auth token, skip this entirely
                if (!this.auth_token_service.getAuthToken()) {
                    sub.next(null);
                    return;
                }

                try {

                    // Check the authentication for the token
                    const res = await this.api_service.fetch<IWhoAmI>('/v1/auth/whoami');

                    // If there is a new token, use it
                    if (res?.token) {
                        this.auth_token_service.setAuthToken(res.token);
                    }

                    // Return the user data
                    sub.next(res ?? null);
    
                } catch (err) {
    
                    // Log the error
                    console.error('whoami error: ', err);
                    console.error('Treating as logged out');
    
                    // Treat as though we're just logged out
                    sub.next(null);
    
                }

            })();
        })
    )
    .pipe(shareReplay(1));

    /**
     * Observable to the login status of the local user
     */
    public readonly logged_in$: Observable<boolean> = this.whoami$
        .pipe(map(me => me !== null))
        .pipe(shareReplay(1));

    /**
     * Observable to whether or not the logged in user is an admin. Currently disabled
     */
    public readonly is_admin$: Observable<boolean> = of(false);

    /**
     * Observable to the currently selected creator profile controlled by the local user
     */
    public readonly active_creator$: Observable<ICreatorProfile | null> = this.whoami$
        .pipe(map(me => {
            if (!me) return null;
            if (me.creators.length === 0) return null;
            return me.creators[0];
        }))
        .pipe(shareReplay(1));

    public constructor(
        private auth_token_service: AuthTokenService,
        private api_service: ApiService,
    ) {}
 
    /**
     * Sends a login email to the provided email address
     * @param email the email address to send to
     */
    public async login(email: string, password: string): Promise<IWhoAmI | null> {

        try {

            // Send the request to login
            const res = await this.api_service.fetch<IWhoAmI>('/v1/auth/login', {
                email,
                password,
            });

            // Set the whoami
            this.set_whoami$.next(res);

            // Set the token
            this.auth_token_service.setAuthToken(res.token);

            // Return the details
            return res;

        } catch (err) {
            console.error(err);
        }

        // Return false if there's an error
        return null;

    }
 
    /**
     * Logs the local user out of the current session
     */
    public async logout(): Promise<void> {
        this.set_whoami$.next(null);
        this.auth_token_service.setAuthToken(null);
    }

}
