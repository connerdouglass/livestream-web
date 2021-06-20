import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { StudioLoginPageComponent } from './login/login.component';
import { StudioRoutingModule } from './studio-routing.module';
import { StudioComponent } from './studio.component';

@NgModule({
	declarations: [
		StudioComponent,
		StudioLoginPageComponent,
	],
	imports: [
		CommonModule,
		StudioRoutingModule,
		SharedModule,
	],
	providers: [],
})
export class StudioModule {}
