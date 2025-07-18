import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-dt-training-school-info',
	template: `
		<app-step-section [heading]="title" [subheading]="subtitle">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-7 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<app-form-gdsd-accredited-school
							schoolLabel="Name of Assistance Dogs International or International Guide Dog Federation Accredited School"
							[accreditedSchoolIdControl]="accreditedSchoolId"
							[accreditedSchoolNameControl]="accreditedSchoolName"
							[applicationTypeCode]="applicationTypeCode"
						></app-form-gdsd-accredited-school>
					</div>
				</div>

				<div class="row">
					<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<mat-divider class="my-3"></mat-divider>
							<div class="text-minor-heading mb-3">
								Chief Executive Officer/Executive Director of the accredited training school
							</div>

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
									/>
									<mat-hint>A 10 digit phone number</mat-hint>
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
export class StepDtTrainingSchoolInfoComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form: FormGroup = this.dogTrainerApplicationService.trainingSchoolInfoFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	ngOnInit(): void {
		this.title = this.isRenewal
			? 'Confirm accredited training school information'
			: 'Information about the accredited training school';
		this.subtitle = this.isRenewal ? 'Update any information that has changed since your last application' : '';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}

	get accreditedSchoolId(): FormControl {
		return this.form.get('accreditedSchoolId') as FormControl;
	}
	get accreditedSchoolName(): FormControl {
		return this.form.get('accreditedSchoolName') as FormControl;
	}
}
