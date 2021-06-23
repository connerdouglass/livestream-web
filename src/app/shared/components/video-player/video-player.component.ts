import { Component, ElementRef, HostListener, Input, ViewChild } from "@angular/core";
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
    private hls = new Hls({
        initialLiveManifestSize: 5,
        debug: true,
    });

    /**
     * The source URL is always provided before the video element
     */
    private source_url!: string;

    /**
     * The actual video element on the component
     */
    private video_element?: HTMLVideoElement;

    /**
     * Whether or not the video is ready
     */
    public video_ready = false;

    /**
     * The video player element on the component
     */
    @ViewChild('video') public set v(video_element: ElementRef<HTMLVideoElement> | undefined) {
        this.video_element = video_element?.nativeElement;
        const video_ready_handler = () => {
            this.video_element!.muted = true;
            // this.video_element!.play();
        };
        if (this.video_element) {
            this.video_element.addEventListener('play', () => this.video_ready = true);
            if (Hls.isSupported()) {
                console.log('HLS.js polyfill supported');
                this.hls.attachMedia(this.video_element);
                this.hls.on(Hls.Events.MEDIA_ATTACHED, video_ready_handler);
            } else if (this.video_element.canPlayType('application/vnd.apple.mpegurl')) {
                console.log('Native HLS support');
                this.video_element.src = this.source_url;
                this.video_element.addEventListener('canplay', video_ready_handler);
            } else {
                console.log('No browser support for HLS');
            }
        }
    }

    /**
     * Sets the source URL for the video to play
     */
    @Input('src') public set src(src: string) {
        this.hls.loadSource(src);
        this.source_url = src;
    }

    public unmute(): void {
        if (this.video_element) {
            this.video_element.muted = false;
        }
    }

}
