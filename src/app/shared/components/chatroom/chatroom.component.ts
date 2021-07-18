import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { AppStateService } from '../../services/app_state.service';
import { TelegramAuthService } from '../../services/telegram_auth.service';
import { User } from '../telegram-login-button/telegram-login-button.component';

@Component({
	selector: 'app-chatroom',
	templateUrl: './chatroom.component.html',
	styleUrls: ['./chatroom.component.scss']
})
export class ChatRoomComponent implements OnInit, OnDestroy {

	/**
	 * Subject for the source URL
	 */
	public src$ = new ReplaySubject<string>(1);

	/**
	 * Observable for the chatroom iframe src URL
	 */
	public readonly chatroom_url$ = this.src$
		.pipe(distinctUntilChanged())
		.pipe(map(url => url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : undefined))
		.pipe(shareReplay(1));

	/**
	 * The username of the creator profile to load
	 */
	@Input('src') public set src(src: string) {
		this.src$.next(src);
	}

	/**
	 * Subject emitted when the component is destroyed
	 */
	private destroyed$ = new Subject<void>();

	/**
	 * The chatroom frame on the component
	 */
	@ViewChild('chatroom') public chatroom_frame?: ElementRef<HTMLIFrameElement>;

	public constructor(
		public telegram_auth_service: TelegramAuthService,
		public app_state_service: AppStateService,
		private sanitizer: DomSanitizer,
	) {}

	public ngOnInit(): void {}

	public ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	public logged_in(user: User): void {
		this.telegram_auth_service.storeUser(user);
		this.chatroom_frame?.nativeElement.contentWindow?.postMessage({
			type: 'auth',
			user: user,
		}, '*')
	}

}
