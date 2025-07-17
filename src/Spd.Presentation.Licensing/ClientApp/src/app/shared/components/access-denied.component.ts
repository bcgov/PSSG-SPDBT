import { Component } from '@angular/core';

@Component({
	selector: 'app-access-denied',
	template: `
		<div class="container-fluid text-center mt-4">
			<mat-icon>do_not_disturb</mat-icon>
			<h2 class="my-4">Access Denied</h2>
			<p class="fs-4 my-4">You currently do not have permission to access this page.</p>
		</div>
	`,
	styles: [
		`
			.mat-icon {
				font-size: 80px;
				width: 80px;
				height: 80px;
				vertical-align: bottom;
				margin-right: 4px;
			}
		`,
	],
	standalone: false,
})
export class AccessDeniedComponent {}
