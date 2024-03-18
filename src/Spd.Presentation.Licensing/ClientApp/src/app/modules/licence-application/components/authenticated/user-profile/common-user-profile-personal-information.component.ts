import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GenderTypes } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-common-user-profile-personal-information',
	template: `
		<div [formGroup]="personalInformationFormGroup" class="row mb-3">
			<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 px-3">
				<div class="fs-6 text-muted">Full Name</div>
				<div class="fs-5 summary-text-data">{{ fullname }}</div>
			</div>

			<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12 px-3">
				<div class="fs-6 text-muted mt-2 mt-lg-0">Date of Birth</div>
				<div class="fs-5 summary-text-data">{{ dateOfBirth.value | formatDate : constants.date.formalDateFormat }}</div>
			</div>
		</div>

		<ng-container *ngIf="hasNameChanged">
			<app-alert type="info" icon="" [showBorder]="false">
				Have you changed your name?
				<a href="https://www.icbc.com/driver-licensing/getting-licensed/Change-your-name-or-address" target="_blank"
					>Visit ICBC</a
				>
				to update this information on your BC Services Card. Any changes you make will then be updated here.
			</app-alert>
		</ng-container>

		<ng-container *ngIf="nameHasChanged">
			<app-alert type="info" icon="" [showBorder]="false">
				<div>We noticed you changed your name recently on your BC Services Card.</div>
				<div>Do you want a new licence printed with your new name for a $20 fee?</div>
			</app-alert>
		</ng-container>

		<div class="row mt-3 mb-2">
			<div [formGroup]="personalInformationFormGroup" class="col-xl-4 col-lg-4 col-md-12 col-sm-12">
				<mat-form-field>
					<mat-label>Sex</mat-label>
					<mat-select formControlName="genderCode" [errorStateMatcher]="matcher">
						<mat-option *ngFor="let gdr of genderTypes" [value]="gdr.code">
							{{ gdr.desc }}
						</mat-option>
					</mat-select>
					<mat-error *ngIf="personalInformationFormGroup.get('genderCode')?.hasError('required')"
						>This is required</mat-error
					>
				</mat-form-field>
			</div>

			<div [formGroup]="contactFormGroup" class="col-xl-4 col-lg-4 col-md-12 col-sm-12">
				<mat-form-field>
					<mat-label>Email Address</mat-label>
					<input
						matInput
						formControlName="emailAddress"
						[errorStateMatcher]="matcher"
						placeholder="name@domain.com"
						maxlength="75"
					/>
					<mat-error *ngIf="contactFormGroup.get('emailAddress')?.hasError('required')"> This is required </mat-error>
					<mat-error *ngIf="contactFormGroup.get('emailAddress')?.hasError('email')">
						Must be a valid email address
					</mat-error>
				</mat-form-field>
			</div>
			<div [formGroup]="contactFormGroup" class="col-xl-4 col-lg-4 col-md-12 col-sm-12">
				<mat-form-field>
					<mat-label>Phone Number</mat-label>
					<input matInput formControlName="phoneNumber" [errorStateMatcher]="matcher" [mask]="phoneMask" />
					<mat-error *ngIf="contactFormGroup.get('phoneNumber')?.hasError('required')">This is required</mat-error>
					<mat-error *ngIf="contactFormGroup.get('phoneNumber')?.hasError('mask')"> This must be 10 digits </mat-error>
				</mat-form-field>
			</div>
		</div>
	`,
	styles: [],
})
export class CommonUserProfilePersonalInformationComponent implements LicenceChildStepperStepComponent {
	constants = SPD_CONSTANTS;
	genderTypes = GenderTypes;
	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	hasNameChanged = true;
	nameHasChanged = true;

	title = 'Confirm your personal information';
	subtitle =
		'This information is from your BC Services Card. If you need to make any updates, please <a href="https://www.icbc.com/driver-licensing/getting-licensed/Pages/Change-your-address-or-name.aspx"  target="_blank">visit ICBC</a>.';

	@Input() isReadOnly = false;
	@Input() personalInformationFormGroup!: FormGroup;
	@Input() contactFormGroup!: FormGroup;

	constructor(private utilService: UtilService) {}

	isFormValid(): boolean {
		this.personalInformationFormGroup.markAllAsTouched();
		this.contactFormGroup.markAllAsTouched();

		return this.personalInformationFormGroup.valid && this.contactFormGroup.valid;
	}

	get fullname(): string {
		return this.utilService.getFullNameWithMiddle(
			this.givenName?.value,
			this.middleName1?.value,
			this.middleName2?.value,
			this.surname?.value
		);
	}

	get surname(): FormControl {
		return this.personalInformationFormGroup.get('surname') as FormControl;
	}
	get givenName(): FormControl {
		return this.personalInformationFormGroup.get('givenName') as FormControl;
	}
	get middleName1(): FormControl {
		return this.personalInformationFormGroup.get('middleName1') as FormControl;
	}
	get middleName2(): FormControl {
		return this.personalInformationFormGroup.get('middleName2') as FormControl;
	}
	get dateOfBirth(): FormControl {
		return this.personalInformationFormGroup.get('dateOfBirth') as FormControl;
	}
}
