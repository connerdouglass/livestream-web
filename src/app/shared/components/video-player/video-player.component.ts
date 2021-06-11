import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import Hls from 'hls.js';

@Component({
    selector: 'app-video-player',
    styleUrls: ['./video-player.component.scss'],
    templateUrl: './video-player.component.html',
})
export class VideoPlayer {

    /**
     * The HLS player adapter
     */
    private hls = new Hls();

    /**
     * The actual video element on the component
     */
    private video_element?: HTMLVideoElement;

    /**
     * The video player element on the component
     */
    @ViewChild('video') public set v(video_element: ElementRef<HTMLVideoElement> | undefined) {
        this.video_element = video_element?.nativeElement;
        if (this.video_element) {
            this.hls.attachMedia(this.video_element);
        }
    }

    /**
     * Sets the source URL for the video to play
     */
    @Input('src') public set src(src: string) {
        this.hls.loadSource(src);
    }

}
