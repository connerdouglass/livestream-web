import { Injectable } from "@angular/core";

@Injectable()
export class AuthTokenService {

    private static TOKEN_STORAGE_KEY = 'livestream_auth_token';

    /**
     * Gets the auth token for the local account
     */
    public getAuthToken(): string | null {
        return localStorage.getItem(AuthTokenService.TOKEN_STORAGE_KEY);
    }

    /**
     * Sets the value for the auth token
     * @param token the token value to set
     */
    public setAuthToken(token: string | null) {
        if (!token) {
            localStorage.removeItem(AuthTokenService.TOKEN_STORAGE_KEY);
        } else {
            localStorage.setItem(AuthTokenService.TOKEN_STORAGE_KEY, token);
        }
    }

}
