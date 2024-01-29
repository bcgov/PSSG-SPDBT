import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	template: `
		<body class="mat-typography d-flex flex-column h-100">
			<ngx-spinner name="loaderSpinner" type="square-jelly-box" [fullScreen]="true"></ngx-spinner>
			<app-header></app-header>

			<router-outlet></router-outlet>

			<footer class="mt-auto">
				<app-footer></app-footer>
			</footer>
		</body>
	`,
	styles: [],
})
export class AppComponent {}
