import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { combineLatest, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, takeUntil } from 'rxjs/operators';
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

	/**
	 * Subject emitted when the chatroom is ready
	 */
	private chatroom_ready$ = new Subject<void>();

	public constructor(
		public telegram_auth_service: TelegramAuthService,
		public app_state_service: AppStateService,
		private sanitizer: DomSanitizer,
	) {}

	@HostListener('window:message', ['$event'])
	public onWindowMessage(event: MessageEvent<any>): void {

		// If this is a chatroom ready event
		if (event.data?.type === 'chatroom-ready') this.chatroom_ready$.next();

	}

	public ngOnInit(): void {
		combineLatest([
				this.telegram_auth_service.user$,
				this.chatroom_ready$,	
			])
			.pipe(takeUntil(this.destroyed$))
			.subscribe(([ user, _ ]) => {
				if (!user) return;
				this.chatroom_frame?.nativeElement.contentWindow?.postMessage({
					type: 'auth',
					user: {
						username: this.format_username(user),
						photo_url: user.photo_url,
						moderator: false,//user.username && new [].includes(user.username),
					},
				}, '*');
			});
	}

	private format_username(user: User | null): string {
		if (!user) return 'User';
		if (user.username && user.username.length > 0) return user.username;
		const parts: string[] = [];
		if (user.first_name && user.first_name.length > 0) parts.push(user.first_name);
		if (user.last_name && user.last_name.length > 0) parts.push(user.last_name);
		if (parts.length > 0) return parts.join(' ');
		return 'User';
	}

	public ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

}
