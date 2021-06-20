import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudioService } from 'src/app/shared/services/studio.service';

@Component({
	selector: 'app-studio-dash-create-stream',
	templateUrl: './create-stream.component.html',
	styleUrls: ['./create-stream.component.scss']
})
export class DashCreateStreamComponent {

	public constructor(
		private router: Router,
		private studio_service: StudioService,
	) {}

}
