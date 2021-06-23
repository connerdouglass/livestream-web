import { Component } from '@angular/core';
import { AppStateService } from '../shared/services/app_state.service';

@Component({
	selector: 'app-landing-page',
	templateUrl: './landing-page.component.html',
	styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

	public constructor(
		public app_state_service: AppStateService,
	) {}

}
