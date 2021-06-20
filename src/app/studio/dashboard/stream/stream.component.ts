import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators';
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
		.pipe(switchMap(stream_id => this.studio_service.get_stream(stream_id)))
		.pipe(shareReplay(1));

	public constructor(
		private route: ActivatedRoute,
		private studio_service: StudioService,
	) {}

}
