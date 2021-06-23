import { Injectable } from "@angular/core";
import { User } from "../components/telegram-login-button/telegram-login-button.component";

@Injectable()
export class TelegramAuthService {

    private static readonly TELEGRAM_USER_KEY = 'telegram_user_key';

    public storeUser(user: User | null): void {
        if (!user) localStorage.removeItem(TelegramAuthService.TELEGRAM_USER_KEY);
        else localStorage.setItem(TelegramAuthService.TELEGRAM_USER_KEY, JSON.stringify(user));
    }

    public getUser(): User | null {
        const str = localStorage.getItem(TelegramAuthService.TELEGRAM_USER_KEY);
        if (!str) return null;
        try {
            return JSON.stringify(str) as any;
        } catch (err) {
            return null;
        }
    }

}
