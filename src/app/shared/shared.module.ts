import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreatorProfileComponent } from './components/creator-profile/creator-profile.component';
import { LiveChat } from './components/live-chat/live-chat.component';
import { StudioLoginForm } from './components/studio-login-form/studio-login-form.component';
import { TelegramLoginButtonComponent } from './components/telegram-login-button/telegram-login-button.component';
import { VideoPlayer } from './components/video-player/video-player.component';
import { AdminRequiredGuard } from './guards/admin-required.guard';
import { AuthRequiredGuard } from './guards/auth-required.guard';
import { UnauthRequiredGuard } from './guards/unauth-required.guard';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { AuthTokenService } from './services/auth_token.service';
import { CreatorsService } from './services/creators.service';
import { PlaybackService } from './services/playback.service';
import { SocketService } from './services/socket.service';
import { StudioService } from './services/studio.service';

@NgModule({
	declarations: [
		CreatorProfileComponent,
		LiveChat,
		VideoPlayer,
		StudioLoginForm,
		TelegramLoginButtonComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		MatInputModule,
		MatButtonModule,
		MatProgressSpinnerModule,
	],
	exports: [
		CreatorProfileComponent,
		LiveChat,
		VideoPlayer,
		StudioLoginForm,
		TelegramLoginButtonComponent,
	],
})
export class SharedModule {
	public static forRoot(): ModuleWithProviders<SharedModule> {
		return {
			ngModule: SharedModule,
			providers: [
				ApiService,
				AuthTokenService,
				AuthService,
				CreatorsService,
				PlaybackService,
				SocketService,
				StudioService,
                AdminRequiredGuard,
                AuthRequiredGuard,
                UnauthRequiredGuard,
			],
		};
	}
}
