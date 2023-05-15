import { Component } from '@angular/core';

@Component({
	selector: 'app-access-denied',
	template: `
		<div class="container-fluid text-center mt-4">
			<mat-icon>do_not_disturb</mat-icon>
			<h1>Access Denied</h1>
			<h4 class="mt-4">You currently do not currently have permission to access this page.</h4>
		</div>
	`,
	styles: [
		`
			.mat-icon {
				font-size: 50px;
				width: 50px;
				height: 50px;
				vertical-align: bottom;
				margin-right: 4px;
			}
		`,
	],
})
export class AccessDeniedComponent {}
