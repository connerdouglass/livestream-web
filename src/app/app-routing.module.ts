import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'studio',
		loadChildren: () => import('./studio/studio.module').then(m => m.StudioModule),
	},
	{
		path: '',
		pathMatch: 'full',
		loadChildren: () => import('./landing/landing-page.module').then(m => m.LandingPageModule),
	},
	{
		path: '',
		loadChildren: () => import('./creator-profile/creator-profile-page.module').then(m => m.CreatorProfilePageModule),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
