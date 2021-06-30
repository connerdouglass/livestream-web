import { Component } from '@angular/core';
import { StudioService } from 'src/app/shared/services/studio.service';

@Component({
	selector: 'app-studio-dash-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss']
})
export class DashChatComponent {

	public constructor(
		public studio_service: StudioService,
	) {}

}
