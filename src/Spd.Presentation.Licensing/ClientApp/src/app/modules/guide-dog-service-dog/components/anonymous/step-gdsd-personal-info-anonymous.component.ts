import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-gdsd-personal-info-anonymous',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Legal Given Name <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Middle Name <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="middleName" maxlength="40" />
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Surname</mat-label>
									<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Date of Birth</mat-label>
									<input
										matInput
										[matDatepicker]="picker"
										formControlName="dateOfBirth"
										[max]="maxBirthDate"
										[min]="minDate"
										[errorStateMatcher]="matcher"
									/>
									<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
									<mat-datepicker #picker startView="multi-year"></mat-datepicker>
									<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
									<mat-error *ngIf="form.get('dateOfBirth')?.hasError('matDatepickerMin')">
										Invalid date of birth
									</mat-error>
									<mat-error *ngIf="form.get('dateOfBirth')?.hasError('matDatepickerMax')">
										This must be on or before {{ maxBirthDate | formatDate }}
									</mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Phone Number</mat-label>
									<input
										matInput
										formControlName="phoneNumber"
										[errorStateMatcher]="matcher"
										maxlength="30"
										appPhoneNumberTransform
									/>
									<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Email Address <span class="optional-label">(optional)</span></mat-label>
									<input
										matInput
										formControlName="emailAddress"
										[errorStateMatcher]="matcher"
										placeholder="name@domain.com"
										maxlength="75"
									/>
									<mat-error *ngIf="form.get('emailAddress')?.hasError('email')">
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
export class StepGdsdPersonalInfoAnonymousComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	applicationTypeCodes = ApplicationTypeCode;
	matcher = new FormErrorStateMatcher();

	maxBirthDate = this.utilService.getBirthDateMax();
	minDate = this.utilService.getDateMin();

	form: FormGroup = this.gdsdApplicationService.gdsdPersonalInformationFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(
		private utilService: UtilService,
		private gdsdApplicationService: GdsdApplicationService
	) {}

	ngOnInit(): void {
		this.title = this.isRenewal ? 'Confirm your Personal Information' : 'Your Personal Information';
		this.subtitle = this.isRenewal ? 'Update any information that has changed since your last application' : '';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileUploaded(): void {
		this.gdsdApplicationService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		this.gdsdApplicationService.hasValueChanged = true;
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}
}
