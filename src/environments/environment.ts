// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	site_config: {
		api_baseurl: 'http://localhost:8080',
		hls_baseurl: 'http://localhost:8081',
		rtmp_baseurl: 'rtmp://localhost',
	},
	telegram_user: {
		id: 1,
		first_name: 'Test',
		last_name: 'User',
		username: 'testuser',
		photo_url: undefined,
		auth_date: Math.floor(Date.now() / 1000),
		hash: '',
	},
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
