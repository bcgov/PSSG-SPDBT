import { Component } from '@angular/core';

@Component({
	selector: 'app-licence-selection',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="What licence or permit are you applying for?"></app-step-title>
				<div class="step-container row">
					<div class="col-md-3 col-sm-6 mb-3">
						<div class="step-container__box">
							<div class="px-2 pb-3">
								<div class="icon-container mt-4 d-none d-md-block"><mat-icon>family_restroom</mat-icon></div>
								Security Business License
							</div>
						</div>
					</div>
					<div class="col-md-3 col-sm-6 mb-3">
						<div class="step-container__box">
							<div class="px-2 pb-3">
								<div class="icon-container mt-4 d-none d-md-block"><mat-icon>family_restroom</mat-icon></div>
								Security Worker Licence
							</div>
						</div>
					</div>
					<div class="col-md-3 col-sm-6 mb-3">
						<div class="step-container__box px-2 pb-3">
							<div class="icon-container mt-4 d-none d-md-block"><mat-icon>diversity_3</mat-icon></div>
							Permit to operate an armoured vehicle
						</div>
					</div>
					<div class="col-md-3 col-sm-6 mb-3">
						<div class="step-container__box px-2 pb-3">
							<div class="icon-container mt-4 d-none d-md-block"><mat-icon>person_off</mat-icon></div>
							Permit to possess body armour
						</div>
					</div>
				</div>
				<!-- <mat-error class="mat-option-error" style="text-align: center;" *ngIf="isDirtyAndInvalid"
      >An option must be selected</mat-error
    > -->
			</div>
		</section>
	`,
	styles: [
		`
			.icon-container {
				display: block;
				text-align: center;

				.mat-icon {
					color: var(--color-black);
					font-size: 50px !important;
					height: 50px !important;
					width: 50px !important;
				}
			}
		`,
	],
})
export class LicenceSelectionComponent {
	// onDataChange(_val: EmployeeInteractionTypeCode) {
	// 	this.employeeInteractionFlag = _val;
	// 	const isValid = this.isFormValid();
	// 	this.isDirtyAndInvalid = !isValid;
	// }
}
