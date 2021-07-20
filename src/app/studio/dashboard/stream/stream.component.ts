import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, merge, of } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { PlaybackService } from 'src/app/shared/services/playback.service';
import { SiteConfigService } from 'src/app/shared/services/site_config.service';
import { IStream, StudioService } from 'src/app/shared/services/studio.service';

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
			).pipe(switchMap(async () => {
				try {
					return await this.studio_service.get_stream(stream_id);
				} catch (err) {
					console.error(err);
					return null;
				}
			}))
			.pipe(filter((value): value is IStream => !!value))
		}))
		.pipe(shareReplay(1));

	public readonly stream_url$ = this.stream$
		.pipe(map(stream => stream.identifier))
		.pipe(distinctUntilChanged())
		.pipe(switchMap(identifier => this.playback_service.getStreamUrl(identifier)))
		.pipe(shareReplay(1));

	public rtmp_url$ = this.site_config_service.site_config$
		.pipe(map(config => config.rtmp_baseurl));

	public constructor(
		private route: ActivatedRoute,
		private studio_service: StudioService,
		private playback_service: PlaybackService,
		public site_config_service: SiteConfigService,
	) {}

	public async start_stream(
		stream_identifier: string,
	): Promise<void> {
		await this.studio_service.set_stream_status(
			stream_identifier,
			'live',
		);
	}

	public async stop_stream(
		stream_identifier: string,
	): Promise<void> {
		await this.studio_service.set_stream_status(
			stream_identifier,
			'ended',
		);
	}

}
