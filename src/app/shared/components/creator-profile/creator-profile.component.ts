import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { interval, merge, of, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { CreatorsService } from '../../services/creators.service';
import { PlaybackService } from '../../services/playback.service';

@Component({
	selector: 'app-creator-profile',
	templateUrl: './creator-profile.component.html',
	styleUrls: ['./creator-profile.component.scss']
})
export class CreatorProfileComponent implements OnInit, OnDestroy {

	/**
	 * Subject for the username string
	 */
	public username$ = new ReplaySubject<string>(1);

	/**
	 * Observable for the metadata about the profile
	 */
	public meta$ = this.username$
		.pipe(distinctUntilChanged())
		.pipe(switchMap(username => {
			return merge(
				of(0),
				interval(5000),
			).pipe(switchMap(() => this.creators_service.getCreatorMeta(username)))
		}))
		.pipe(shareReplay(1));

	/**
	 * Observable for the live stream HLS url
	 */
	public readonly stream_url$ = this.meta$
		.pipe(map(meta => meta.live_stream?.identifier))
		.pipe(filter((identifier): identifier is string => !!identifier))
		.pipe(distinctUntilChanged())
		.pipe(switchMap(identifier => this.playback_service.getStreamUrl(identifier)))
		.pipe(shareReplay(1));

	/**
	 * Observable for the chatroom iframe src URL
	 */
	public readonly chatroom_url$ = this.meta$
		.pipe(map(meta => meta.live_stream?.chatroom_url))
		.pipe(distinctUntilChanged())
		.pipe(map(url => url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : undefined))
		.pipe(shareReplay(1));

	/**
	 * The username of the creator profile to load
	 */
	@Input('username') public set u(username: string) {
		this.username$.next(username);
	}

	/**
	 * Subject emitted when the component is destroyed
	 */
	private destroyed$ = new Subject<void>();

	public constructor(
		private creators_service: CreatorsService,
		private playback_service: PlaybackService,
		private sanitizer: DomSanitizer,
	) {}

	public ngOnInit(): void {}

	public ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

}
