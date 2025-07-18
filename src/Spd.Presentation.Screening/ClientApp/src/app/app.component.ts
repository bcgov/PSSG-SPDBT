import { APP_BASE_HREF } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Observable, filter, map } from 'rxjs';
import { ApiConfiguration } from './api/api-configuration';
import { ConfigService } from './core/services/config.service';

@Component({
	selector: 'app-root',
	template: `
		<body class="d-flex flex-column h-100">
		  <ngx-spinner name="loaderSpinner" type="square-jelly-box" [fullScreen]="true"></ngx-spinner>
		  <app-header [title]="title"></app-header>
		
		  @if (configs$ | async) {
		    <router-outlet></router-outlet>
		    <footer class="mt-auto">
		      <app-footer></app-footer>
		    </footer>
		  }
		</body>
		`,
	styles: [],
	standalone: false,
})
export class AppComponent {
	configs$: Observable<any>;
	title = '';

	constructor(
		private apiConfig: ApiConfiguration,
		@Inject(APP_BASE_HREF) href: string,
		private configService: ConfigService,
		private router: Router,
	) {
		apiConfig.rootUrl = `${location.origin}${href}`;
		if (apiConfig.rootUrl.endsWith('/')) {
			apiConfig.rootUrl = apiConfig.rootUrl.substring(0, apiConfig.rootUrl.length - 1);
		}
		console.debug('[API rootUrl]', apiConfig.rootUrl);
		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				map(() => {
					let route: ActivatedRouteSnapshot = this.router.routerState.root.snapshot;
					let routeTitle = '';
					if (route.firstChild) {
						route = route.firstChild;
					}
					if (route.data['title']) {
						routeTitle = route.data['title'];
					}
					return routeTitle;
				}),
			)
			.subscribe((title: string) => {
				this.title = title || 'Criminal Record Checks';
			});
		this.configs$ = this.configService.getConfigs();
	}
}
