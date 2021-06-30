import { Component } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { StudioService } from 'src/app/shared/services/studio.service';

@Component({
	selector: 'app-studio-dash-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss']
})
export class DashChatComponent {

	public mute_username = '';

	public constructor(
		public studio_service: StudioService,
	) {}

	public async submit_mute() {

		const username = this.mute_username;
		this.mute_username = '';

		await this.studio_service.mute_chat_username(
			username,
		);

	}

}
