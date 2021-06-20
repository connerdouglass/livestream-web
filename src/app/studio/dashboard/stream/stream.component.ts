import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, merge, of } from 'rxjs';
import { distinct, distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators';
import { PlaybackService } from 'src/app/shared/services/playback.service';
import { StudioService } from 'src/app/shared/services/studio.service';

@Component({
	selector: 'app-studio-dash-stream',
	templateUrl: './stream.component.html',
	styleUrls: ['./stream.component.scss']
})
export class DashStreamComponent {

	public readonly stream$ = this.route.params
		.pipe(map(params => params.stream_id))
		.pipe(distinctUntilChanged())
		.pipe(switchMap(stream_id => {
			return merge(
				of(0),
				interval(2500),
			).pipe(switchMap(() => this.studio_service.get_stream(stream_id)))
		}))
		.pipe(shareReplay(1));

	public readonly stream_url$ = this.stream$
		.pipe(map(stream => stream.identifier))
		.pipe(distinctUntilChanged())
		.pipe(map(identifier => this.playback_service.getStreamUrl(identifier)))
		.pipe(shareReplay(1));

	public constructor(
		private route: ActivatedRoute,
		private studio_service: StudioService,
		private playback_service: PlaybackService,
	) {}

	public async start_stream(
		stream_identifier: string,
	): Promise<void> {
		await this.studio_service.set_stream_status(
			stream_identifier,
			'live',
		);
	}

}
