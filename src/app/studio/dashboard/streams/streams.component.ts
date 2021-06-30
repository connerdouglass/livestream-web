import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { StudioService } from 'src/app/shared/services/studio.service';

@Component({
	selector: 'app-studio-dash-streams',
	templateUrl: './streams.component.html',
	styleUrls: ['./streams.component.scss']
})
export class DashStreamsComponent {

	public live_streams$ = this.studio_service.all_streams$
		.pipe(map(streams => streams.filter(s => s.status === 'live')));

	public upcoming_streams$ = this.studio_service.all_streams$
		.pipe(map(streams => streams.filter(s => s.status === 'upcoming')));

	public ended_streams$ = this.studio_service.all_streams$
		.pipe(map(streams => streams.filter(s => s.status === 'ended')));

	public constructor(
		public auth_service: AuthService,
		public studio_service: StudioService,
	) {}

}
