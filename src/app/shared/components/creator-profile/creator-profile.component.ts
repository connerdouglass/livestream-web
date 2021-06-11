import { Component, Input } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { distinctUntilChanged, shareReplay, switchMap } from 'rxjs/operators';
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
		.pipe(switchMap(username => this.creators_service.getCreatorMeta(username)))
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
