import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-dt-training-school-ceo',
	template: `
		<app-step-section [heading]="title" [subheading]="subtitle">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Legal First Name</mat-label>
									<input
										matInput
										formControlName="schoolDirectorGivenName"
										[errorStateMatcher]="matcher"
										maxlength="40"
									/>
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Legal Middle Name <span class="optional-label">(optional)</span></mat-label>
									<input
										matInput
										formControlName="schoolDirectorMiddleName"
										[errorStateMatcher]="matcher"
										maxlength="40"
									/>
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Legal Surname</mat-label>
									<input
										matInput
										formControlName="schoolDirectorSurname"
										[errorStateMatcher]="matcher"
										maxlength="40"
									/>
									@if (form.get('schoolDirectorSurname')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Contact Phone Number</mat-label>
									<input
										matInput
										formControlName="schoolContactPhoneNumber"
										[mask]="phoneMask"
										[showMaskTyped]="false"
										[errorStateMatcher]="matcher"
										placeholder="(123) 456-7890"
										aria-label="Enter the 10 digit phone number."
									/>
									@if (form.get('schoolContactPhoneNumber')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Contact Email Address <span class="optional-label">(optional)</span></mat-label>
									<input
										matInput
										formControlName="schoolContactEmailAddress"
										[errorStateMatcher]="matcher"
										placeholder="name@domain.com"
										maxlength="75"
									/>
									@if (form.get('schoolContactEmailAddress')?.hasError('email')) {
										<mat-error>Must be a valid email address</mat-error>
									}
								</mat-form-field>
							</div>
						</div>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepDtTrainingSchoolCeoComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form: FormGroup = this.dogTrainerApplicationService.trainingSchoolCeoFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	ngOnInit(): void {
		this.title = this.isRenewal
			? 'Confirm Chief Executive Officer/Executive Director of the accredited training school'
			: 'Chief Executive Officer/Executive Director of the accredited training school';
		this.subtitle = this.isRenewal ? 'Update any information that has changed since your last application' : '';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}
}
