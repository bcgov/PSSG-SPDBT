import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-dt-dog-trainer-info',
	template: `
		<app-step-section [heading]="title" [subheading]="subtitle">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Legal First Name</mat-label>
									<input matInput formControlName="trainerGivenName" [errorStateMatcher]="matcher" maxlength="40" />
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Middle Name <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="trainerMiddleName" maxlength="40" />
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Surname</mat-label>
									<input matInput formControlName="trainerSurname" [errorStateMatcher]="matcher" maxlength="40" />
									@if (form.get('trainerSurname')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Date of Birth</mat-label>
									<input
										matInput
										type="text"
										formControlName="trainerDateOfBirth"
										[mask]="dateMask"
										[showMaskTyped]="false"
										[errorStateMatcher]="matcher"
										(blur)="onValidateDate()"
										placeholder="YYYY-MM-DD"
										aria-label="Enter the date in the format: year dash month dash day."
									/>
									@if (trainerDateOfBirth.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
									@if (trainerDateOfBirth.hasError('invalidDate')) {
										<mat-error>This date is invalid</mat-error>
									}
									@if (trainerDateOfBirth.hasError('futureDate')) {
										<mat-error>This date cannot be in the future</mat-error>
									}
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Phone Number</mat-label>
									<input
										matInput
										formControlName="trainerPhoneNumber"
										[mask]="phoneMask"
										[showMaskTyped]="false"
										[errorStateMatcher]="matcher"
										placeholder="(123) 456-7890"
										aria-label="Enter the 10 digit phone number."
									/>
									@if (form.get('trainerPhoneNumber')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Email Address <span class="optional-label">(optional)</span></mat-label>
									<input
										matInput
										formControlName="trainerEmailAddress"
										[errorStateMatcher]="matcher"
										placeholder="name@domain.com"
										maxlength="75"
									/>
									@if (form.get('trainerEmailAddress')?.hasError('email')) {
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
export class StepDtDogTrainerInfoComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	matcher = new FormErrorStateMatcher();

	dateMask = SPD_CONSTANTS.date.dateMask;
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form: FormGroup = this.dogTrainerApplicationService.dogTrainerFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(
		private utilService: UtilService,
		private dogTrainerApplicationService: DogTrainerApplicationService
	) {}

	ngOnInit(): void {
		this.title = this.isRenewal ? 'Confirm dog trainer information' : 'Dog trainer information';
		this.subtitle = this.isRenewal ? 'Update any information that has changed since your last application' : '';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onValidateDate(): void {
		const errorKey = this.utilService.getIsInputValidDate(this.trainerDateOfBirth.value, true);
		if (errorKey) {
			this.trainerDateOfBirth.setErrors({ [errorKey]: true });
		}
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}
	get trainerDateOfBirth(): FormControl {
		return this.form.get('trainerDateOfBirth') as FormControl;
	}
}
