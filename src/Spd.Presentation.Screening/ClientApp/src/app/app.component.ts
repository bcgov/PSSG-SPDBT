import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
	title = 'Security Programs Division';

	constructor(private router: Router) {
		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				map(() => {
					let route: ActivatedRoute = this.router.routerState.root;
					let routeTitle = '';
					while (route.firstChild) {
						route = route.firstChild;
					}
					if (route.snapshot.data['title']) {
						routeTitle = route.snapshot.data['title'];
					}
					return routeTitle;
				})
			)
			.subscribe((title: string) => {
				this.title = title ? title : 'Security Programs Division';
			});
	}
}
