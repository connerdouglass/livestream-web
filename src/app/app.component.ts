import { Component } from '@angular/core';
import { TitleService } from './shared/services/title.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	public constructor(
		// Keep this here to make titles appear automatically on site load
		public title_service: TitleService,
	) {}

}
