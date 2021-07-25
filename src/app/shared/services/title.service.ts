import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppStateService } from './app_state.service';

type TitleFormatter = (platform: string, page: string | null) => string;

@Injectable({
    providedIn: 'root',
})
export class TitleService {

    /**
     * Observable to the title of the overall platform
     */
    private platform_title$ = this.app_state_service.state$
        .pipe(map(state => state.platform_title));

    /**
     * Subject for the title of the page
     */
    private page_title$ = new BehaviorSubject<string | null>(null);

    /**
     * Subject for the title formatter function
     */
    private title_formatter$ = new BehaviorSubject<TitleFormatter>(
        (platform: string, page: string | null) => {
            let title = platform;
            if (page) {
                title += ` | ${page}`;
            }
            return title;
        }
    );

    /**
     * Observable to the full title
     */
    private full_title$ = combineLatest([
        this.platform_title$,
        this.page_title$,
        this.title_formatter$,
    ])
    .pipe(map(([ platform, page, formatter ]) => formatter(platform, page)));

    public constructor(
        private title: Title,
        private app_state_service: AppStateService,
    ) {

        // Subscribe to the full title
        this.full_title$.subscribe(title => this.title.setTitle(title));

    }

    public set_page_title(page_title: string): void {
        this.page_title$.next(page_title);
    }

    public set_title_formatter(formatter: TitleFormatter): void {
        this.title_formatter$.next(formatter);
    }

}
