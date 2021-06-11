import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable()
export class PlaybackService {

    /**
     * Gets the HLS view URL for a stream
     * @param identifier the identifier of the stream
     */
    public getStreamUrl(identifier: string): string {
        return `${environment.hls_baseurl}/hls/${identifier}/index.m3u8`;
    }

}