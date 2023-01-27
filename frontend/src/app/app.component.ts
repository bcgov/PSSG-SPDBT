import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	template: `
		<app-header></app-header>

		<div class="container-fluid" style="padding: 0;margin: 0;">
			<div class="col-sm-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
				<router-outlet></router-outlet>
			</div>
		</div>

		<app-footer></app-footer>

		<!-- 
			<body class="d-flex flex-column h-100">
			<main class="flex-shrink-0">
				<div class="container">
					<router-outlet></router-outlet>
				</div>
			</main>

			<footer class="footer mt-auto py-3 bg-light">
				<div class="container">
					<span class="text-muted">Place sticky footer content here.</span>
				</div>
			</footer>
		</body> -->

		<!-- <body class="d-flex flex-column h-100">
			<main class="flex-shrink-0">
				<div class="container">
					<router-outlet></router-outlet>
				</div>
			</main>

			<footer class="footer mt-auto py-3 bg-light">
				<div class="container">
					<app-footer></app-footer>
				</div>
			</footer>
		</body> -->
	`,
	styles: [],
})
export class AppComponent {
	title = 'SPD';
}
