import { Component, EventEmitter, Output } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
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
	};

	@Output('toggleDrawer') public toggleDrawer = new EventEmitter<void>();

	public constructor(
		public telegram_auth_service: TelegramAuthService,
		public app_state_service: AppStateService,
	) {}

}
