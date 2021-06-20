import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRequiredGuard } from '../shared/guards/auth-required.guard';
import { UnauthRequiredGuard } from '../shared/guards/unauth-required.guard';
import { StudioDashboardComponent } from './dashboard/dashboard.component';
import { DashStreamComponent } from './dashboard/stream/stream.component';
import { DashStreamsComponent } from './dashboard/streams/streams.component';
import { StudioLoginPageComponent } from './login/login.component';

const routes: Routes = [
	{
		path: 'login',
		component: StudioLoginPageComponent,
		canActivate: [UnauthRequiredGuard],
		data: {
			auth_redirect: '/studio',
		},
	},
	{
		path: '',
		component: StudioDashboardComponent,
		canActivate: [AuthRequiredGuard],
		canActivateChild: [AuthRequiredGuard],
		data: {
			auth_redirect: '/studio/login',
		},
		children: [
			{
				path: '',
				pathMatch: 'full',
				component: DashStreamsComponent,
			},
			{
				path: 'stream/:stream_id',
				component: DashStreamComponent,
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StudioRoutingModule {}
