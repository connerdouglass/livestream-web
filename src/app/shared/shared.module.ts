import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChatRoomComponent } from './components/chatroom/chatroom.component';
import { CreatorProfileComponent } from './components/creator-profile/creator-profile.component';
import { StudioLoginForm } from './components/studio-login-form/studio-login-form.component';
import { TelegramLoginButtonComponent } from './components/telegram-login-button/telegram-login-button.component';
import { VideoPlayer } from './components/video-player/video-player.component';
import { AdminRequiredGuard } from './guards/admin-required.guard';
import { AuthRequiredGuard } from './guards/auth-required.guard';
import { UnauthRequiredGuard } from './guards/unauth-required.guard';
import { ApiService } from './services/api.service';
import { AppStateService } from './services/app_state.service';
import { AuthService } from './services/auth.service';
import { AuthTokenService } from './services/auth_token.service';
import { BrowserNotificationsService } from './services/browser_notifications.service';
import { CreatorsService } from './services/creators.service';
import { PlaybackService } from './services/playback.service';
import { SiteConfigService } from './services/site_config.service';
import { StudioService } from './services/studio.service';
import { TelegramAuthService } from './services/telegram_auth.service';
import { TelegramNotificationsService } from './services/telegram_notifications.service';

@NgModule({
	declarations: [
		CreatorProfileComponent,
		VideoPlayer,
		StudioLoginForm,
		TelegramLoginButtonComponent,
		ChatRoomComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		FontAwesomeModule,
		MatInputModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		MatSlideToggleModule,
	],
	exports: [
		CreatorProfileComponent,
		VideoPlayer,
		StudioLoginForm,
		TelegramLoginButtonComponent,
		ChatRoomComponent,
	],
})
export class SharedModule {
	public static forRoot(): ModuleWithProviders<SharedModule> {
		return {
			ngModule: SharedModule,
			providers: [
				ApiService,
				AppStateService,
				AuthTokenService,
				AuthService,
				CreatorsService,
				PlaybackService,
				SiteConfigService,
				StudioService,
				TelegramAuthService,
                AdminRequiredGuard,
                AuthRequiredGuard,
                UnauthRequiredGuard,
				BrowserNotificationsService,
				TelegramNotificationsService,
			],
		};
	}
}
