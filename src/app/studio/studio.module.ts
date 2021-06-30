import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
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
		MatSidenavModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatTooltipModule,
		MatRippleModule,
	],
	providers: [],
})
export class StudioModule {}
