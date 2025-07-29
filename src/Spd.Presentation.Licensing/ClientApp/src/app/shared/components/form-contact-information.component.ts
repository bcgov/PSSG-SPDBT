import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-form-contact-information',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-lg-4 col-md-6 col-sm-12" [ngClass]="isWizardStep ? 'offset-lg-2' : ''">
					<mat-form-field>
						<mat-label>Email Address</mat-label>
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
				<div class="col-lg-4 col-md-6 col-sm-12">
					<mat-form-field>
						<mat-label>Phone Number</mat-label>
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
export class FormContactInformationComponent {
	matcher = new FormErrorStateMatcher();

	@Input() form!: FormGroup;
	@Input() isWizardStep = true;
	@Input() isReadonly = false;
}
