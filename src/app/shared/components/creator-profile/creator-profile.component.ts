import { Component, Input } from '@angular/core';
import { interval, merge, of, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { CreatorsService } from '../../services/creators.service';
import { PlaybackService } from '../../services/playback.service';

@Component({
	selector: 'app-creator-profile',
	templateUrl: './creator-profile.component.html',
	styleUrls: ['./creator-profile.component.scss']
})
export class CreatorProfileComponent {

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
		.pipe(map(identifier => this.playback_service.getStreamUrl(identifier)))
		.pipe(shareReplay(1));

	/**
	 * The username of the creator profile to load
	 */
	@Input('username') public set u(username: string) {
		this.username$.next(username);
	}

	public constructor(
		private creators_service: CreatorsService,
		private playback_service: PlaybackService,
	) {}

}
