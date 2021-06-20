import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudioLoginPageComponent } from './login/login.component';

const routes: Routes = [
	{
		path: 'login',
		component: StudioLoginPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StudioRoutingModule {}
