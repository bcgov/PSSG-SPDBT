import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

				<div [formGroup]="form">
					<div class="row">
						<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
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
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceReviewNameChangeComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.personalInformationFormGroup;

	constructor(private utilService: UtilService, private licenceApplicationService: LicenceApplicationService) {}

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
