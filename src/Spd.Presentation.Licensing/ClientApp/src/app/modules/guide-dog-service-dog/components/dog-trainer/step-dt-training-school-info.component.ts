import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-dt-training-school-info',
	template: `
		<app-step-section title="Information about the accredited training school">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<app-form-accredited-school
							schoolLabel="Name of Assistance Dogs International or International Guide Dog Federation Accredited School"
							[accreditedSchoolIdControl]="accreditedSchoolId"
							[accreditedSchoolNameControl]="accreditedSchoolName"
						></app-form-accredited-school>
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
									<mat-label>Legal Given Name <span class="optional-label">(optional)</span></mat-label>
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
									<mat-error *ngIf="form.get('schoolDirectorSurname')?.hasError('required')"
										>This is required</mat-error
									>
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Contact Phone Number</mat-label>
									<input
										matInput
										formControlName="schoolDirectorPhoneNumber"
										[mask]="phoneMask"
										[showMaskTyped]="false"
										[errorStateMatcher]="matcher"
									/>
									<mat-error *ngIf="form.get('schoolDirectorPhoneNumber')?.hasError('required')"
										>This is required</mat-error
									>
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Contact Email Address <span class="optional-label">(optional)</span></mat-label>
									<input
										matInput
										formControlName="schoolDirectorEmailAddress"
										[errorStateMatcher]="matcher"
										placeholder="name@domain.com"
										maxlength="75"
									/>
									<mat-error *ngIf="form.get('schoolDirectorEmailAddress')?.hasError('email')">
										Must be a valid email address
									</mat-error>
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
export class StepDtTrainingSchoolInfoComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form: FormGroup = this.dogTrainerApplicationService.trainingSchoolInfoFormGroup;

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get accreditedSchoolId(): FormControl {
		return this.form.get('accreditedSchoolId') as FormControl;
	}
	get accreditedSchoolName(): FormControl {
		return this.form.get('accreditedSchoolName') as FormControl;
	}
}
