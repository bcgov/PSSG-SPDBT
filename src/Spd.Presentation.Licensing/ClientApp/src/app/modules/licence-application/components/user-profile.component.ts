import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-user-profile',
	template: `
		<!-- <section class="step-section">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<h2 class="my-3 fw-normal">User Profile</h2>
					<mat-divider class="mat-divider-main mb-3"></mat-divider> -->

		<!-- <app-alert type="info" icon="info">
			We noticed you changed your name recently. Do you want a new licence printed with your new name, for a $20 fee?
		</app-alert> -->
		<!-- </div>
			</div>
		</section> -->
	`,
	styles: [],
})
export class UserProfileComponent {
	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();
}
