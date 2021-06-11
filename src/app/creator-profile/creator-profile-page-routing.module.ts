import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatorProfilePageComponent } from './creator-profile-page.component';

const routes: Routes = [
	{
		path: ':username',
		component: CreatorProfilePageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CreatorProfilePageRoutingModule {}
