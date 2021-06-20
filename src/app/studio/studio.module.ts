import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { StudioDashboardComponent } from './dashboard/dashboard.component';
import { DashStreamComponent } from './dashboard/stream/stream.component';
import { DashStreamsComponent } from './dashboard/streams/streams.component';
import { StudioLoginPageComponent } from './login/login.component';
import { StudioRoutingModule } from './studio-routing.module';

@NgModule({
	declarations: [
		StudioLoginPageComponent,
		StudioDashboardComponent,
		DashStreamsComponent,
		DashStreamComponent,
	],
	imports: [
		CommonModule,
		StudioRoutingModule,
		SharedModule,
	],
	providers: [],
})
export class StudioModule {}
