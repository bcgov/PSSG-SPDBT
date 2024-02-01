import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	template: `
		<body class="mat-typography d-flex flex-column h-100">
			<ngx-spinner name="loaderSpinner" type="square-jelly-box" [fullScreen]="true"></ngx-spinner>
			<app-spd-header></app-spd-header>

			<router-outlet></router-outlet>

			<footer class="mt-auto">
				<app-spd-footer></app-spd-footer>
			</footer>
		</body>
	`,
	styles: [],
})
export class AppComponent {}
