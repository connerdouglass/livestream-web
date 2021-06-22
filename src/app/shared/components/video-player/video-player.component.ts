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
    private hls = new Hls();

    /**
     * The source URL is always provided before the video element
     */
    private source_url!: string;

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
            if (Hls.isSupported()) {
                this.hls.attachMedia(this.video_element);
                this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                    this.video_element!.muted = true;
                    this.video_element?.play();
                });
            } else {
                this.video_element.src = this.source_url;
                this.video_element.addEventListener('canplay', () => {
                    this.video_element!.muted = true;
                    this.video_element?.play()
                });
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
