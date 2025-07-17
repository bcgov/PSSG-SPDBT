import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-mdra-business-owner-update',
	template: `
		<app-step-section heading="Business names" subheading="Confirm your business names">
			<div class="row">
				<div class="col-xxl-9 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Legal Business Name</mat-label>
									<input matInput formControlName="bizLegalName" [errorStateMatcher]="matcher" maxlength="40" />
									@if (form.get('bizLegalName')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
								</mat-form-field>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label
										>Trade or 'Doing Business As' Name <span class="optional-label">(optional)</span></mat-label
									>
									<input matInput formControlName="bizTradeName" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-hint>This is the name commonly used to refer to your business</mat-hint>
									@if (form.get('bizTradeName')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
								</mat-form-field>
							</div>
						</div>
					</form>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepMdraBusinessOwnerUpdateComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	form = this.metalDealersApplicationService.businessOwnerFormGroup;

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.bizLegalName.valid && this.bizTradeName.valid;
	}

	get bizLegalName(): FormControl {
		return this.form.get('bizLegalName') as FormControl;
	}
	get bizTradeName(): FormControl {
		return this.form.get('bizTradeName') as FormControl;
	}
}
