import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-studio-login-page',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class StudioLoginPageComponent {

	public constructor(
		public router: Router,
	) {}

}
