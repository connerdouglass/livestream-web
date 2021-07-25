import { Injectable } from "@angular/core";
import { merge, Observable, of, Subject } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { User } from "../components/telegram-login-button/telegram-login-button.component";

@Injectable()
export class TelegramAuthService {

    /**
     * The key used in localstorage to store the Telegram user
     */
    private static readonly TELEGRAM_USER_KEY = 'telegram_user_key';

    /**
     * Subject used to update the current user
     */
    private set_user$ = new Subject<User | null>();

    /**
     * Observable to the user
     */
    public readonly user$: Observable<User | null> = merge(
        of(this.getUser()),
        this.set_user$,
    )
    .pipe(shareReplay(1));

    /**
     * Stores a Telegram user locally, or deletes the local user if null
     * @param user the user to store
     */
    public storeUser(user: User | null): void {
        if (!user) localStorage.removeItem(TelegramAuthService.TELEGRAM_USER_KEY);
        else localStorage.setItem(TelegramAuthService.TELEGRAM_USER_KEY, JSON.stringify(user));
        this.set_user$.next(user);
    }

    /**
     * Gets the Telegram user from local storage
     */
    private getUser(): User | null {
        if ('telegram_user' in environment) return (environment as any).telegram_user;
        const str = localStorage.getItem(TelegramAuthService.TELEGRAM_USER_KEY);
        if (!str) return null;
        try {
            return JSON.parse(str);
        } catch (err) {
            return null;
        }
    }

    /**
     * Logs the user out of the local session
     */
    public logout(): void {
        this.storeUser(null);
        this.set_user$.next(null);
    }

}
