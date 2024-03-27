import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { UtilService } from '@app/core/services/util.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-step-worker-licence-review-name-change',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Review updated name"
					subtitle="Your licence will be updated with your new name"
				></app-step-title>

				<div class="row">
					<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div [formGroup]="form">
							<div class="row mt-0 mb-3">
								<div class="col-lg-6 col-md-12">
									<div class="text-label d-block text-muted">New Name</div>
									<div class="summary-text-data">{{ fullname }}</div>
								</div>
								<div class="col-lg-6 col-md-12">
									<div class="text-label d-block text-muted">Previous Name</div>
									<div class="summary-text-data">{{ cardHolderName.value }}</div>
								</div>
							</div>
						</div>

						<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
						<div class="text-minor-heading mb-2">Do you need a new licence printed?</div>

						<div [formGroup]="reprintFormGroup" class="row">
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12">
								<mat-radio-group aria-label="Select an option" formControlName="reprintLicence">
									<div class="d-flex justify-content-start">
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
									</div>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(reprintFormGroup.get('reprintLicence')?.dirty ||
											reprintFormGroup.get('reprintLicence')?.touched) &&
										reprintFormGroup.get('reprintLicence')?.invalid &&
										reprintFormGroup.get('reprintLicence')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceReviewNameChangeComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.personalInformationFormGroup;
	reprintFormGroup: FormGroup = this.licenceApplicationService.reprintLicenceFormGroup;

	booleanTypeCodes = BooleanTypeCode;

	constructor(private utilService: UtilService, private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		this.reprintFormGroup.markAllAsTouched();

		return this.form.valid && this.reprintFormGroup.valid;
	}

	get fullname(): string {
		return this.utilService.getFullNameWithMiddle(
			this.givenName?.value,
			this.middleName1?.value,
			this.middleName2?.value,
			this.surname?.value
		);
	}

	get cardHolderName(): FormControl {
		return this.form.get('cardHolderName') as FormControl;
	}
	get surname(): FormControl {
		return this.form.get('surname') as FormControl;
	}
	get givenName(): FormControl {
		return this.form.get('givenName') as FormControl;
	}
	get middleName1(): FormControl {
		return this.form.get('middleName1') as FormControl;
	}
	get middleName2(): FormControl {
		return this.form.get('middleName2') as FormControl;
	}
}
