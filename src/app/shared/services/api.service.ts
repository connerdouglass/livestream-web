import { Injectable } from "@angular/core";
import { take } from "rxjs/operators";
import { AuthTokenService } from "./auth_token.service";
import { SiteConfigService } from "./site_config.service";

@Injectable()
export class ApiService {

    public constructor(
        private auth_token_service: AuthTokenService,
        private site_config_service: SiteConfigService,
    ) {}

    public async fetch<T = any>(url: string, req?: any): Promise<T> {

        // Get the API base url
        const config = await this.site_config_service.site_config$
            .pipe(take(1))
            .toPromise();

        // Create the object for the headers
        const headers: {[key: string]: string} = {
            'Content-Type': 'application/json',
        };

        // Get the auth token
        const auth_token = this.auth_token_service.getAuthToken();
        if (auth_token) headers['Authorization'] = `Bearer ${this.auth_token_service.getAuthToken()}`;

        // Fetch the response
        const res = await fetch(`${config.api_baseurl}${url}`, {
            method: 'POST',
            headers: headers,
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
