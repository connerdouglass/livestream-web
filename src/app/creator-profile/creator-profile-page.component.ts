import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, map, shareReplay, takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-creator-profile-page',
	templateUrl: './creator-profile-page.component.html',
	styleUrls: ['./creator-profile-page.component.scss']
})
export class CreatorProfilePageComponent implements OnDestroy {

	/**
	 * Subject emitted when the component is destroyed
	 */
	private destroyed$ = new Subject<void>();

	/**
	 * Observable for the username in the URL
	 */
	public username$ = this.route.params
		.pipe(takeUntil(this.destroyed$))
		.pipe(map(params => params.username as string | undefined))
		.pipe(filter((username): username is string => !!username && typeof username === 'string'))
		.pipe(shareReplay(1));

	public constructor(
		private route: ActivatedRoute,
	) {}

	/**
	 * Called when the component is destroyed
	 */
	public ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

}
