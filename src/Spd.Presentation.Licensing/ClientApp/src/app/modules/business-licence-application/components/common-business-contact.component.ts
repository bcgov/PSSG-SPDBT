import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-common-business-contact',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xl-6 col-lg-6 col-md-12">
					<mat-form-field>
						<mat-label>Business Email</mat-label>
						<input
							matInput
							formControlName="emailAddress"
							[errorStateMatcher]="matcher"
							placeholder="name@domain.com"
							maxlength="75"
						/>
						@if (form.get('emailAddress')?.hasError('required')) {
							<mat-error>This is required</mat-error>
						}
						@if (form.get('emailAddress')?.hasError('email')) {
							<mat-error>Must be a valid email address</mat-error>
						}
					</mat-form-field>
				</div>

				<div class="col-xl-6 col-lg-6 col-md-12">
					<mat-form-field>
						<mat-label>Business Phone Number</mat-label>
						<input
							matInput
							formControlName="phoneNumber"
							[errorStateMatcher]="matcher"
							maxlength="30"
							appPhoneNumberTransform
						/>
						@if (form.get('phoneNumber')?.hasError('required')) {
							<mat-error>This is required</mat-error>
						}
					</mat-form-field>
				</div>
			</div>
		</form>
	`,
	styles: [],
	standalone: false,
})
export class CommonBusinessContactComponent implements OnInit, LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	@Input() isReadonly!: boolean;
	@Input() form!: FormGroup;

	ngOnInit(): void {
		if (this.isReadonly) {
			this.emailAddress.disable({ emitEvent: false });
			this.phoneNumber.disable({ emitEvent: false });
		} else {
			this.emailAddress.enable();
			this.phoneNumber.enable();
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get emailAddress(): FormControl {
		return this.form.get('emailAddress') as FormControl;
	}
	get phoneNumber(): FormControl {
		return this.form.get('phoneNumber') as FormControl;
	}
}
