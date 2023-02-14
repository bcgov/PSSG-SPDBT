import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	template: `
		<body class="d-flex flex-column h-100">
			<ngx-spinner name="loaderSpinner" type="square-jelly-box" [fullScreen]="true"></ngx-spinner>
			<app-header title="SPD"></app-header>

			<div class="container">
				<router-outlet></router-outlet>
			</div>

			<footer class="mt-auto pt-3">
				<app-footer></app-footer>
			</footer>
		</body>
	`,
	styles: [],
})
export class AppComponent {
	title = 'SPD';
}
