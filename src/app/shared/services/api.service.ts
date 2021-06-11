import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { AuthTokenService } from "./auth_token.service";

@Injectable()
export class ApiService {

    public constructor(
        private auth_token_service: AuthTokenService,
    ) {}

    public async fetch<T = any>(url: string, req?: any): Promise<T> {

        // Fetch the response
        const res = await fetch(`${environment.api_baseurl}${url}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.auth_token_service.getAuthToken()}`,
                'Content-Type': 'application/json',
            },
            body: req ? JSON.stringify(req) : '{}',
        })
        .then(r => r.json());

        // If there is an error
        if ('error' in res) {
            throw new Error(res.error);
        }

        // Return the data or nothing
        return res.data ?? {};

    }

}
