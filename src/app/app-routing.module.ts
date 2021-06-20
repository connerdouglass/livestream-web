import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'studio',
		loadChildren: () => import('./studio/studio.module').then(m => m.StudioModule),
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
