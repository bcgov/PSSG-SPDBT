import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { PermitApplicationService } from '@core/services/permit-application.service';

@Component({
	selector: 'app-step-permit-review-name-change',
	template: `
		<app-step-section title="Review your updated name" subtitle="Your permit will be updated with your new name">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div [formGroup]="form">
						<div class="row mt-0 mb-3">
							<div class="offset-lg-3 col-lg-9 col-md-12">
								<div class="text-label d-block text-muted">New Name</div>
								<div class="summary-text-data">{{ fullname }}</div>
							</div>
							<div class="offset-lg-3 col-lg-9 col-md-12">
								<div class="text-label d-block text-muted">Previous Name</div>
								<div class="summary-text-data">{{ cardHolderName.value }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepPermitReviewNameChangeComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.permitApplicationService.personalInformationFormGroup;

	booleanTypeCodes = BooleanTypeCode;

	constructor(private utilService: UtilService, private permitApplicationService: PermitApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
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
