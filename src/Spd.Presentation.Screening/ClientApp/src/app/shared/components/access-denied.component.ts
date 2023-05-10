import { Component } from '@angular/core';

@Component({
	selector: 'app-access-denied',
	template: `
		<div class="container-fluid text-center mt-4">
			<h1>Access Denied</h1>
			<p class="mt-4">
				<strong> You don't currently have permission to access this page. </strong>
			</p>
		</div>
	`,
	styles: [],
})
export class AccessDeniedComponent {}
