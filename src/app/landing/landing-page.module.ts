import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';

@NgModule({
	declarations: [
		LandingPageComponent,
	],
	imports: [
		CommonModule,
		LandingPageRoutingModule,
		SharedModule,
	],
	providers: [],
})
export class LandingPageModule {}
