import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import Hls from 'hls.js';
import { Subject } from "rxjs";

@Component({
    selector: 'app-video-player',
    styleUrls: ['./video-player.component.scss'],
    templateUrl: './video-player.component.html',
})
export class VideoPlayer implements OnInit, OnDestroy {

    /**
     * The HLS player adapter
     */
    private hls?: Hls;

    /**
     * Whether or not the video is ready
     */
    public video_ready = false;

    /**
     * Subject emitted when the component is destroyed
     */
    private destroyed$ = new Subject<void>();

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

    /**
     * Called when the component is initialized
     */
    public ngOnInit(): void {

        // // Create an interval
        // interval(1000)
        //     .pipe(filter(() => this.video_ready))
        //     .pipe(map(() => this.video_element.nativeElement.currentTime))
        //     .pipe(scan((prev: number, curr: number) => {
        //         if (prev > -1) {

        //         }
        //         return this.video_element.nativeElement.currentTime;
        //     }, -1))
        //     .pipe(takeUntil(this.destroyed$))
        //     .subscribe();

    }

    /**
     * Called when the component is destroyed
     */
    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    /**
     * Called when the user clicks the "unmute" button
     */
    public unmute(): void {
        if (this.video_element?.nativeElement) {
            this.video_element.nativeElement.muted = false;
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

    public unfreeze(): void {
        this.video_element.nativeElement.src = this.video_element.nativeElement.src;
    }

}
