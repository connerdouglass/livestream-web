import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CreatorProfilePageRoutingModule } from './creator-profile-page-routing.module';
import { CreatorProfilePageComponent } from './creator-profile-page.component';

@NgModule({
	declarations: [
		CreatorProfilePageComponent,
	],
	imports: [
		CommonModule,
		CreatorProfilePageRoutingModule,
		SharedModule,
	],
	providers: [],
})
export class CreatorProfilePageModule {}
