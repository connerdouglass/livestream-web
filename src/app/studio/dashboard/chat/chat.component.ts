import { Component } from '@angular/core';
import { StudioService } from 'src/app/shared/services/studio.service';

@Component({
	selector: 'app-studio-dash-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss']
})
export class DashChatComponent {

	public mute_username = '';
	public unmute_username = '';

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

	public async submit_unmute() {

		const username = this.unmute_username;
		this.unmute_username = '';

		await this.studio_service.unmute_chat_username(
			username,
		);

	}

}
