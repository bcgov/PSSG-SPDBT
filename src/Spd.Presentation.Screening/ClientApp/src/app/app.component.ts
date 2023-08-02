import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
	selector: 'app-root',
	template: `
		<body class="d-flex flex-column h-100">
			<ngx-spinner name="loaderSpinner" type="square-jelly-box" [fullScreen]="true"></ngx-spinner>
			<app-header [title]="title"></app-header>

			<router-outlet></router-outlet>

			<footer class="mt-auto">
				<app-footer></app-footer>
			</footer>
		</body>
	`,
	styles: [],
})
export class AppComponent {
	title = '';

	constructor(private router: Router) {
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
				})
			)
			.subscribe((title: string) => {
				this.title = title ? title : 'Criminal Record Checks';
			});
	}
}
