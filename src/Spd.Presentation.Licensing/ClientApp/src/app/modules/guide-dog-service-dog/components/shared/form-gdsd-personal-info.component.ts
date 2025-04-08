import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-form-gdsd-personal-info',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xxl-8 col-xl-10 mx-auto">
					<ng-container *ngIf="hasBcscNameChanged.value; else hasNameChanged">
						<app-alert type="warning" icon="warning">
							We noticed you changed your name recently on your BC Services Card.
						</app-alert>
					</ng-container>
					<ng-template #hasNameChanged>
						<app-alert type="info" icon="info">
							Have you changed your name?
							<a aria-label="Navigate to change of name or address site" [href]="changeNameOrAddressUrl" target="_blank"
								>Visit ICBC</a
							>
							to update your information. Any changes you make will automatically be updated here.
						</app-alert>
					</ng-template>

					<div class="row mb-3">
						<div class="col-xl-7 col-lg-6 col-md-12 col-sm-12 px-3">
							<div class="fs-6 text-muted">Full Name</div>
							<div class="text-minor-heading">{{ fullname }}</div>
						</div>

						<div class="col-xl-5 col-lg-6 col-md-12 col-sm-12 px-3">
							<div class="fs-6 text-muted mt-2 mt-lg-0">Date of Birth</div>
							<div class="text-minor-heading">
								{{ dateOfBirth.value | formatDate: formalDateFormat }}
							</div>
						</div>
					</div>

					<div class="row mt-3">
						<div class="col-xl-7 col-lg-6 col-md-12 col-sm-12">
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
						<div class="col-xl-5 col-lg-6 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>Phone Number</mat-label>
								<input
									matInput
									formControlName="phoneNumber"
									[mask]="phoneMask"
									[showMaskTyped]="false"
									[errorStateMatcher]="matcher"
								/>
								<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
	standalone: false,
})
export class FormGdsdPersonalInfoComponent implements OnInit {
	changeNameOrAddressUrl = SPD_CONSTANTS.urls.changeNameOrAddressUrl;
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	@Input() isReadonly = false;
	@Input() form!: FormGroup;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private utilService: UtilService) {}

	ngOnInit(): void {
		if (this.isReadonly) {
			this.utilService.disableInputs(this.form);
		} else {
			this.utilService.enableInputs(this.form);
		}
	}

	get fullname(): string | null {
		return this.utilService.getFullNameWithOneMiddle(
			this.givenName?.value,
			this.middleName?.value,
			this.surname?.value
		);
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}
	get surname(): FormControl {
		return this.form.get('surname') as FormControl;
	}
	get givenName(): FormControl {
		return this.form.get('givenName') as FormControl;
	}
	get middleName(): FormControl {
		return this.form.get('middleName') as FormControl;
	}
	get dateOfBirth(): FormControl {
		return this.form.get('dateOfBirth') as FormControl;
	}
	get hasBcscNameChanged(): FormControl {
		return this.form.get('hasBcscNameChanged') as FormControl;
	}
}
