import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VideoPlayer } from './components/video-player/video-player.component';

@NgModule({
	declarations: [
		VideoPlayer,
	],
	imports: [
		CommonModule,
	],
	providers: [],
	exports: [
		VideoPlayer,
	],
})
export class SharedModule {}
