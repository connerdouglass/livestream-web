import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { StudioService } from 'src/app/shared/services/studio.service';

@Component({
	selector: 'app-studio-dash-streams',
	templateUrl: './streams.component.html',
	styleUrls: ['./streams.component.scss']
})
export class DashStreamsComponent {

	public constructor(
		public auth_service: AuthService,
		public studio_service: StudioService,
	) {}

}
