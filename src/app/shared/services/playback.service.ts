import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SiteConfigService } from "./site_config.service";

@Injectable()
export class PlaybackService {

    public constructor(
        private site_config_service: SiteConfigService,
    ) {}

    /**
     * Gets the HLS view URL for a stream
     * @param identifier the identifier of the stream
     */
    public getStreamUrl(identifier: string): Observable<string> {
        return this.site_config_service.site_config$
            .pipe(map(config => `${config.hls_baseurl}/hls/${identifier}/index.m3u8`));
    }

}