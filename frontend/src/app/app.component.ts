import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	template: `
		<app-header></app-header>

		<div class="container-fluid">
			<div class="col-sm-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
				<router-outlet></router-outlet>
			</div>
		</div>

		<app-footer></app-footer>
	`,
	styles: [],
})
export class AppComponent {
	title = 'SPD';
}
