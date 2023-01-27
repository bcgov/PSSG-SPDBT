import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	template: `
		<!-- <app-header></app-header>
		<div class="container-fluid" style="padding: 0;margin: 0;">
			<div class="col-sm-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
				<router-outlet></router-outlet>
			</div>
		</div>
		<app-footer></app-footer> -->

		<body class="d-flex flex-column h-100">
			<app-header></app-header>

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
