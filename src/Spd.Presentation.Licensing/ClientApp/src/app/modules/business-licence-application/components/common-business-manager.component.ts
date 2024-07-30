import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-common-business-manager',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xl-6 col-lg-6 col-md-12">
					<mat-form-field>
						<mat-label>Given Name</mat-label>
						<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
						<mat-error *ngIf="form.get('givenName')?.hasError('required')"> This is required </mat-error>
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
						<mat-error *ngIf="form.get('emailAddress')?.hasError('email')"> Must be a valid email address </mat-error>
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
		</form>
	`,
	styles: [],
})
export class CommonBusinessManagerComponent implements OnInit, LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	@Input() isReadonly!: boolean;
	@Input() form!: FormGroup;

	ngOnInit(): void {
		if (this.isReadonly) {
			this.givenName.disable({ emitEvent: false });
			this.middleName1.disable({ emitEvent: false });
			this.middleName2.disable({ emitEvent: false });
			this.surname.disable({ emitEvent: false });
			this.emailAddress.disable({ emitEvent: false });
			this.phoneNumber.disable({ emitEvent: false });
		} else {
			this.givenName.enable();
			this.middleName1.enable();
			this.middleName2.enable();
			this.surname.enable();
			this.emailAddress.enable();
			this.phoneNumber.enable();
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isBusinessManager(): FormControl {
		return this.form.get('isBusinessManager') as FormControl;
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
	get surname(): FormControl {
		return this.form.get('surname') as FormControl;
	}
	get emailAddress(): FormControl {
		return this.form.get('emailAddress') as FormControl;
	}
	get phoneNumber(): FormControl {
		return this.form.get('phoneNumber') as FormControl;
	}
}
