import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { BooleanTypeCode, GenderTypes } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-form-personal-information',
	template: `
		<div [formGroup]="personalInformationFormGroup">
			<div class="row">
				<div class="col-lg-12 col-md-12 col-sm-12" [ngClass]="isWizardStep ? 'col-xxl-10 col-xl-10 mx-auto' : ''">
					@if (hasBcscNameChanged.value) {
						<app-alert type="warning" icon="warning">
							We noticed you changed your name recently on your BC Services Card.
						</app-alert>
					} @else {
						<div class="fs-6 fw-bold mb-4">
							Have you changed your name?
							<a aria-label="Navigate to change of name or address site" [href]="changeNameOrAddressUrl" target="_blank"
								>Visit ICBC</a
							>
							to update your information. Any changes you make will automatically be updated here.
						</div>
					}

					<div class="row mb-3">
						<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12 px-3">
							<div class="fs-6 text-muted">Full Name</div>
							<div class="text-minor-heading">{{ fullname }}</div>
						</div>

						<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 px-3">
							<div class="fs-6 text-muted mt-2 mt-lg-0">Date of Birth</div>
							<div class="text-minor-heading">
								{{ dateOfBirth.value | formatDate: formalDateFormat }}
							</div>
						</div>
					</div>

					<div class="row mt-3">
						<div [formGroup]="personalInformationFormGroup" class="col-xl-3 col-lg-3 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>Sex</mat-label>
								<mat-select
									formControlName="genderCode"
									(selectionChange)="onChangeGender($event)"
									[errorStateMatcher]="matcher"
								>
									@for (gdr of genderTypes; track gdr; let i = $index) {
										<mat-option [value]="gdr.code">{{ gdr.desc }}</mat-option>
									}
								</mat-select>
								@if (personalInformationFormGroup.get('genderCode')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
							</mat-form-field>
						</div>

						<div [formGroup]="contactInformationFormGroup" class="col-xl-5 col-lg-5 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>Email Address</mat-label>
								<input
									matInput
									formControlName="emailAddress"
									[errorStateMatcher]="matcher"
									placeholder="name@domain.com"
									maxlength="75"
								/>
								@if (contactInformationFormGroup.get('emailAddress')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
								@if (contactInformationFormGroup.get('emailAddress')?.hasError('email')) {
									<mat-error>Must be a valid email address</mat-error>
								}
							</mat-form-field>
						</div>
						<div [formGroup]="contactInformationFormGroup" class="col-xl-4 col-lg-4 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>Phone Number</mat-label>
								<input
									matInput
									formControlName="phoneNumber"
									[errorStateMatcher]="matcher"
									maxlength="30"
									appPhoneNumberTransform
								/>
								@if (contactInformationFormGroup.get('phoneNumber')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
							</mat-form-field>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class FormPersonalInformationComponent implements OnInit, LicenceChildStepperStepComponent {
	changeNameOrAddressUrl = SPD_CONSTANTS.urls.changeNameOrAddressUrl;
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;
	genderTypes = GenderTypes;
	booleanTypeCodes = BooleanTypeCode;

	matcher = new FormErrorStateMatcher();

	@Input() isReadonly = false;
	@Input() isWizardStep = true;
	@Input() personalInformationFormGroup!: FormGroup;
	@Input() contactInformationFormGroup!: FormGroup;

	constructor(private utilService: UtilService) {}

	ngOnInit(): void {
		if (this.isReadonly) {
			this.utilService.disableInputs(this.personalInformationFormGroup);
			this.utilService.disableInputs(this.contactInformationFormGroup);
		} else {
			this.utilService.enableInputs(this.personalInformationFormGroup);
			this.utilService.enableInputs(this.contactInformationFormGroup);
		}
	}

	isFormValid(): boolean {
		if (this.isReadonly) {
			return true;
		}

		this.personalInformationFormGroup.markAllAsTouched();
		this.contactInformationFormGroup.markAllAsTouched();

		const isValid1 = this.personalInformationFormGroup.valid;
		const isValid2 = this.contactInformationFormGroup.valid;

		console.debug('[FormPersonalInformationComponent] isFormValid', isValid1, isValid2);

		return isValid1 && isValid2;
	}

	onChangeGender(_event: MatSelectChange): void {
		const hasGenderChanged = this.genderCode.value !== this.origGenderCode.value;
		this.personalInformationFormGroup.patchValue({ hasGenderChanged });
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
	get hasBcscNameChanged(): FormControl {
		return this.personalInformationFormGroup.get('hasBcscNameChanged') as FormControl;
	}
	get genderCode(): FormControl {
		return this.personalInformationFormGroup.get('genderCode') as FormControl;
	}
	get origGenderCode(): FormControl {
		return this.personalInformationFormGroup.get('origGenderCode') as FormControl;
	}
}
