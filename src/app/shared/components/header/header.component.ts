import { Component, EventEmitter, Output } from '@angular/core';
import { faBars, faSignInAlt, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { AppStateService } from '../../services/app_state.service';
import { TelegramAuthService } from '../../services/telegram_auth.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

	public readonly icons = {
		drawer: faBars,
		default_avatar: faUser,
		login: faSignInAlt,
		login_cancel: faTimes,
	};

	@Output('toggleDrawer') public toggleDrawer = new EventEmitter<void>();

	public show_login_dropdown = false;

	public constructor(
		public telegram_auth_service: TelegramAuthService,
		public app_state_service: AppStateService,
	) {}

	public async clicked_login() {

	}

	public async clicked_user() {}

}
