import { Component, ElementRef, Input, NgZone, ViewChild } from "@angular/core";
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
    private hls?: Hls;

    /**
     * Whether or not the video is ready
     */
    public video_ready = false;

    /**
     * The video player element on the component
     */
    @ViewChild('video') public video_element!: ElementRef<HTMLVideoElement>;

    /**
     * Sets the source URL for the video to play
     */
    @Input('src') public set src(src: string) {
        setTimeout(() => {
            this.zone.run(() => {
                this.setup_video(src);
            });
        }, 0);
    }

    public constructor(
        private zone: NgZone,
    ) {}

    public unmute(): void {
        if (this.video_element?.nativeElement) {
            this.video_element.nativeElement.muted = false;
            console.log('Unmuted!')
        }
    }

    private setup_video(src: string): void {

        const video = this.video_element.nativeElement;

        const video_ready_handler = () => {
            video.muted = true;
            // video.play();
        };

        video.addEventListener('play', () => this.video_ready = true);

        if (video.canPlayType('application/vnd.apple.mpegurl')) {

            console.log('Native HLS support');
            video.src = src;
            const ready_handler = () => {
                video.removeEventListener('canplay', ready_handler);
                video_ready_handler();
            };
            video.addEventListener('canplay', ready_handler);

        } else if (Hls.isSupported()) {

            console.log('HLS.js polyfill supported');
            this.hls = new Hls({
                initialLiveManifestSize: 5,
                debug: true,
            });
            this.hls.attachMedia(video);
            this.hls.loadSource(src);
            this.hls.on(Hls.Events.MEDIA_ATTACHED, video_ready_handler);

        } else {
            console.log('No browser support for HLS');
        }

    }

}
