import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CreatorProfileComponent } from './components/creator-profile/creator-profile.component';
import { VideoPlayer } from './components/video-player/video-player.component';
import { ApiService } from './services/api.service';
import { AuthTokenService } from './services/auth_token.service';
import { CreatorsService } from './services/creators.service';
import { PlaybackService } from './services/playback.service';

@NgModule({
	declarations: [
		CreatorProfileComponent,
		VideoPlayer,
	],
	imports: [
		CommonModule,
	],
	exports: [
		CreatorProfileComponent,
		VideoPlayer,
	],
})
export class SharedModule {
	public static forRoot(): ModuleWithProviders<SharedModule> {
		return {
			ngModule: SharedModule,
			providers: [
				ApiService,
				AuthTokenService,
				CreatorsService,
				PlaybackService,
			],
		};
	}
}
