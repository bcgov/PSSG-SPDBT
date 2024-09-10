import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { GenderTypes } from '@app/core/code-types/model-desc.models';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-controlling-member-personal-info',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<ng-container *ngIf="isReadonly; else notReadonly">
							<app-alert type="info" icon="">
								<div class="row">
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Name</div>
										<div class="summary-text-data">
											{{ fullname }}
										</div>
									</div>
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Email Address</div>
										<div class="summary-text-data">
											{{ emailAddress.value | default }}
										</div>
									</div>
								</div>
							</app-alert>

							<div class="row">
								<div class="col-xl-4 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Date of Birth</mat-label>
										<input
											matInput
											[matDatepicker]="picker"
											formControlName="dateOfBirth"
											[max]="maxBirthDate"
											[errorStateMatcher]="matcher"
										/>
										<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
										<mat-datepicker #picker startView="multi-year"></mat-datepicker>
										<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>

								<div class="col-xl-4 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Sex</mat-label>
										<mat-select formControlName="genderCode" [errorStateMatcher]="matcher">
											<mat-option *ngFor="let gdr of genderTypes; let i = index" [value]="gdr.code">
												{{ gdr.desc }}
											</mat-option>
										</mat-select>
										<mat-error *ngIf="form.get('genderCode')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>

								<div class="col-xl-4 col-lg-6 col-md-12">
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
							</div>
						</ng-container>
						<ng-template #notReadonly>
							<div class="row">
								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Given Name <span class="optional-label">(optional)</span></mat-label>
										<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
									</mat-form-field>
								</div>
								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
										<input matInput formControlName="middleName1" maxlength="40" />
									</mat-form-field>
								</div>
								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
										<input matInput formControlName="middleName2" maxlength="40" />
									</mat-form-field>
								</div>
								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Surname</mat-label>
										<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
										<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
									</mat-form-field>
								</div>
							</div>

							<div class="row">
								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Date of Birth</mat-label>
										<input
											matInput
											[matDatepicker]="picker"
											formControlName="dateOfBirth"
											[max]="maxBirthDate"
											[errorStateMatcher]="matcher"
										/>
										<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
										<mat-datepicker #picker startView="multi-year"></mat-datepicker>
										<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>

								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Sex</mat-label>
										<mat-select formControlName="genderCode" [errorStateMatcher]="matcher">
											<mat-option *ngFor="let gdr of genderTypes; let i = index" [value]="gdr.code">
												{{ gdr.desc }}
											</mat-option>
										</mat-select>
										<mat-error *ngIf="form.get('genderCode')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>
							</div>

							<div class="row">
								<div class="fw-semibold fs-6 my-2">Contact Information</div>
								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Email Address</mat-label>
										<input
											matInput
											formControlName="emailAddress"
											[errorStateMatcher]="matcher"
											placeholder="name@domain.com"
											maxlength="75"
										/>
										<mat-error *ngIf="form.get('emailAddress')?.hasError('required')"> This is required </mat-error>
										<mat-error *ngIf="form.get('emailAddress')?.hasError('email')">
											Must be a valid email address
										</mat-error>
									</mat-form-field>
								</div>

								<div class="col-xl-6 col-lg-6 col-md-12">
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
							</div>
						</ng-template>
					</form>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepControllingMemberPersonalInfoComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	genderTypes = GenderTypes;
	matcher = new FormErrorStateMatcher();

	maxBirthDate = this.utilService.getBirthDateMax();

	@Input() isReadonly!: boolean;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	form: FormGroup = this.controllingMembersService.personalNameAndContactInformationFormGroup;

	constructor(private utilService: UtilService, private controllingMembersService: ControllingMemberCrcService) {}

	ngOnInit(): void {
		this.title = this.isUpdate ? 'Confirm your personal information' : 'Your personal information';

		if (this.isReadonly) {
			this.subtitle =
				'This information is from your BC Services Card. If you need to make any updates, please <a href="https://www.icbc.com/driver-licensing/getting-licensed/Pages/Change-your-address-or-name.aspx" target="_blank">visit ICBC</a>.';

			this.givenName.disable({ emitEvent: false });
			this.middleName1.disable({ emitEvent: false });
			this.middleName2.disable({ emitEvent: false });
			this.surname.disable({ emitEvent: false });
			this.emailAddress.disable({ emitEvent: false });
		} else {
			this.subtitle = this.isUpdate ? 'Update any information that has changed since your last application' : '';

			this.givenName.enable();
			this.middleName1.enable();
			this.middleName2.enable();
			this.surname.enable();
			this.emailAddress.enable();
		}
	}

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
	get dateOfBirth(): FormControl {
		return this.form.get('dateOfBirth') as FormControl;
	}
	get genderCode(): FormControl {
		return this.form.get('genderCode') as FormControl;
	}
	get emailAddress(): FormControl {
		return this.form.get('emailAddress') as FormControl;
	}

	get isUpdate(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Update;
	}
}
