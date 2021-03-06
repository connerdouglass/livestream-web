import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faBell, faCheck } from '@fortawesome/free-solid-svg-icons';
import { interval, merge, of, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { AppStateService } from '../../services/app_state.service';
import { BrowserNotificationsService } from '../../services/browser_notifications.service';
import { CreatorsService, ICreatorMeta } from '../../services/creators.service';
import { NotificationsService } from '../../services/notifications.service';
import { PlaybackService } from '../../services/playback.service';
import { TelegramAuthService } from '../../services/telegram_auth.service';
import { TelegramNotificationsService } from '../../services/telegram_notifications.service';

@Component({
	selector: 'app-creator-profile',
	templateUrl: './creator-profile.component.html',
	styleUrls: ['./creator-profile.component.scss']
})
export class CreatorProfileComponent implements OnInit, OnDestroy {

	public readonly icons = {
		notify_bell: faBell,
		notify_checkmark: faCheck,
	};

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
			).pipe(switchMap(async () => {
				try {
					return await this.creators_service.getCreatorMeta(username);
				} catch (err) {
					console.error(err);
					return null;
				}
			}))
			.pipe(filter((value): value is ICreatorMeta => !!value))
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
		public app_state_service: AppStateService,
		public telegram_auth_service: TelegramAuthService,
		private creators_service: CreatorsService,
		private playback_service: PlaybackService,
		public browser_notifications_service: BrowserNotificationsService,
		public telegram_notifications_service: TelegramNotificationsService,
	) {}

	public ngOnInit(): void {}

	public ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	public async clicked_sub_button(
		service: NotificationsService,
		creator_id: number,
	) {
		const subbed = await service.subscribed_to$(creator_id)
			.pipe(take(1))
			.toPromise();
		service.set_subscribed(creator_id, !subbed);
	}

}
