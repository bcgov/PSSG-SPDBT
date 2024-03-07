import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GenderTypes } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-common-user-profile-personal-information',
	template: `
		<form [formGroup]="form" novalidate>
			<app-alert type="info" icon="" [showBorder]="false">
				Have you changed your name?
				<a href="https://www.icbc.com/driver-licensing/getting-licensed/Change-your-name-or-address" target="_blank"
					>Visit ICBC</a
				>
				to update this information on your BC Services Card. Any changes you make will then be updated here.
			</app-alert>

			<div class="row mx-0">
				<div
					class="col-xl-5 col-lg-5 col-md-12 col-sm-12 p-2"
					style="background-color: whitesmoke; height: fit-content;"
				>
					<div class="fs-6 text-muted mt-2 mt-lg-0">Full Name</div>
					<div class="fs-5" style="color: var(--color-primary);">
						{{ fullname }}
					</div>
				</div>

				<div
					class="col-xl-5 col-lg-5 col-md-12 col-sm-12 p-2"
					style="background-color: whitesmoke; height: fit-content;"
				>
					<div class="fs-6 text-muted mt-2 mt-lg-0">Date of Birth</div>
					<div class="fs-5" style="color: var(--color-primary);">
						{{ dateOfBirth.value | formatDate : constants.date.formalDateFormat }}
					</div>
				</div>

				<div class="col-xl-2 col-lg-2 col-md-12 col-sm-12 px-lg-2 px-0">
					<mat-form-field class="mt-2 mt-lg-0">
						<mat-label>Sex</mat-label>
						<mat-select formControlName="genderCode" [errorStateMatcher]="matcher">
							<mat-option *ngFor="let gdr of genderTypes" [value]="gdr.code">
								{{ gdr.desc }}
							</mat-option>
						</mat-select>
						<mat-error *ngIf="form.get('genderCode')?.hasError('required')">This is required</mat-error>
					</mat-form-field>
				</div>
			</div>
		</form>

		<form [formGroup]="formContact" novalidate>
			<div class="row">
				<div class="col-lg-4 col-md-6 col-sm-12">
					<mat-form-field>
						<mat-label>Email Address</mat-label>
						<input
							matInput
							formControlName="contactEmailAddress"
							[errorStateMatcher]="matcher"
							placeholder="name@domain.com"
							maxlength="75"
						/>
						<mat-error *ngIf="form.get('contactEmailAddress')?.hasError('required')"> This is required </mat-error>
						<mat-error *ngIf="form.get('contactEmailAddress')?.hasError('email')">
							Must be a valid email address
						</mat-error>
					</mat-form-field>
				</div>
				<div class="col-lg-4 col-md-6 col-sm-12">
					<mat-form-field>
						<mat-label>Phone Number</mat-label>
						<input matInput formControlName="contactPhoneNumber" [errorStateMatcher]="matcher" [mask]="phoneMask" />
						<mat-error *ngIf="form.get('contactPhoneNumber')?.hasError('required')">This is required</mat-error>
						<mat-error *ngIf="form.get('contactPhoneNumber')?.hasError('mask')"> This must be 10 digits </mat-error>
					</mat-form-field>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class CommonUserProfilePersonalInformationComponent implements LicenceChildStepperStepComponent {
	constants = SPD_CONSTANTS;
	genderTypes = GenderTypes;
	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	title = 'Confirm your personal information';
	subtitle =
		'This information is from your BC Services Card. If you need to make any updates, please <a href="https://www.icbc.com/driver-licensing/getting-licensed/Pages/Change-your-address-or-name.aspx"  target="_blank">visit ICBC</a>.';

	form: FormGroup = this.licenceApplicationService.personalInformationFormGroup;
	formContact: FormGroup = this.licenceApplicationService.contactInformationFormGroup;

	@Input() isReadOnly = false;

	constructor(private utilService: UtilService, private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get fullname(): string {
		return this.utilService.getFullNameWithMiddle(
			this.firstName?.value,
			this.middleName1?.value,
			this.middleName2?.value,
			this.lastName?.value
		);
	}

	get lastName(): FormControl {
		return this.form.get('lastName') as FormControl;
	}
	get firstName(): FormControl {
		return this.form.get('firstName') as FormControl;
	}
	get middleName1(): FormControl {
		return this.form.get('middleName1') as FormControl;
	}
	get middleName2(): FormControl {
		return this.form.get('middleName2') as FormControl;
	}
	get dateOfBirth(): FormControl {
		return this.form.get('dateOfBirth') as FormControl;
	}
}
