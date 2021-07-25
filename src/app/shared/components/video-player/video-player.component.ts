import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { faCompress, faExpand, faExternalLinkAlt, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import Hls from 'hls.js';
import { Subject } from "rxjs";

@Component({
    selector: 'app-video-player',
    styleUrls: ['./video-player.component.scss'],
    templateUrl: './video-player.component.html',
})
export class VideoPlayer implements OnInit, OnDestroy {

    public readonly icons = {
        mute: faVolumeMute,
        unmute: faVolumeUp,
        fullscreen: faExpand,
        exit_fullscreen: faCompress,
        pip: faExternalLinkAlt,
        exit_pip: faExternalLinkAlt,
    };

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
     * The wrapper element for the video player
     */
    @ViewChild('fullscreen_wrap') public fullscreen_wrap?: ElementRef<HTMLDivElement>;

    /**
     * The video player element on the component
     */
    @ViewChild('video') public video_element?: ElementRef<HTMLVideoElement>;

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

    /**
     * The source URL for the chat box
     */
    @Input('chat-src') public chat_src?: string;

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
            this.video_element.nativeElement.play();
        }
    }

    private setup_video(src: string): void {

        if (!this.video_element) return;

        const video = this.video_element.nativeElement;

        const video_ready_handler = () => {
            video.muted = true;
            video.play();
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

    public is_mobile(): boolean {
        return screen.width < 400;
    }

    public unfreeze(): void {
        if (!this.video_element) return;
        this.video_element.nativeElement.src = this.video_element.nativeElement.src;
    }

    public is_fullscreen(): boolean {
        const fullscreenElement = document.fullscreenElement ?? (document as any).webkitFullscreenElement;
        return !!fullscreenElement && (
            fullscreenElement === this.video_element?.nativeElement ||
            fullscreenElement === this.fullscreen_wrap?.nativeElement
        );
    }

    public enter_fullscreen(): void {

        // The element to request fullscreen
        let element: any;

        // If we're mobile
        if (this.is_mobile()) {
            element = this.video_element?.nativeElement;
        } else {
            element = this.fullscreen_wrap?.nativeElement;
        }

        // Ensure there is actually an element
        if (!element) return;

        // Platform-specific fullscreen call
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen((Element as any).ALLOW_KEYBOARD_INPUT);
        else if (element.webkitEnterFullScreen) element.webkitEnterFullScreen();
        else if (element.msRequestFullscreen) element.msRequestFullscreen();

    }

    public exit_fullscreen(): void {
        if (document.exitFullscreen) document.exitFullscreen();
        else if ((document as any).mozCancelFullScreen) (document as any).mozCancelFullScreen();
        else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
        else if ((document as any).msExitFullscreen) (document as any).msExitFullscreen();
    }

    public supports_pip(): boolean {
        return !!(this.video_element?.nativeElement as any)?.requestPictureInPicture;
    }

    public is_pip(): boolean {
        return !!(document as any).pictureInPictureElement && ((document as any).pictureInPictureElement === this.video_element?.nativeElement);
    }

    public enter_pip(): void {
        if ((document as any).pictureInPictureElement) {
            this.exit_pip();
        }
        (this.video_element?.nativeElement as any)?.requestPictureInPicture?.();
    }

    public exit_pip(): void {
        (document as any).exitPictureInPicture?.()
    }

}
