import { Component, EventEmitter, Output } from '@angular/core';
import { faBars, faHome } from '@fortawesome/free-solid-svg-icons';
import { AppStateService } from '../../services/app_state.service';
import { TelegramAuthService } from '../../services/telegram_auth.service';

@Component({
	selector: 'app-drawer',
	templateUrl: './drawer.component.html',
	styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent {

	public readonly icons = {
		drawer: faBars,
		home: faHome,
	};

	@Output('clickedLink') public clickedLink = new EventEmitter<void>();

	public constructor(
		public telegram_auth_service: TelegramAuthService,
		public app_state_service: AppStateService,
	) {}

}
