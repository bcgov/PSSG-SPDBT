import { Component } from '@angular/core';

@Component({
	selector: 'app-applicant-portal',
	template: `
		<div class="container mt-4">
			<section class="step-section p-4">
				<router-outlet></router-outlet>
			</section>
		</div>
	`,
	styles: [],
})
export class ApplicantPortalComponent {}
