import { Injectable } from "@angular/core";
import { from } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { environment } from "../../../environments/environment";

interface ISiteConfig {
    api_baseurl: string;
    hls_baseurl: string;
}

@Injectable()
export class SiteConfigService {

    /**
     * Observable to the site configuration
     */
    public readonly site_config$ = from(this.get_site_config())
        .pipe(shareReplay(1));

    private async get_site_config(): Promise<ISiteConfig> {

        // If there's config in the Angular environment, use it
        if ('site_config' in environment) return (environment as any).site_config;

        // Otherwise, fetch it from the url
        const res = await fetch('/site.cfg', {
            method: 'GET',
        })
        .then(r => r.text());

        // Separate it up by lines
        return res
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.match(/^(\w+)=(.*)$/))
            .filter((match): match is RegExpMatchArray => !!match)
            .reduce((obj: ISiteConfig, match: RegExpMatchArray) => {
                return {
                    ...obj,
                    [match[1]]: match[2],
                };
            }, {} as ISiteConfig) as ISiteConfig;

    }

}