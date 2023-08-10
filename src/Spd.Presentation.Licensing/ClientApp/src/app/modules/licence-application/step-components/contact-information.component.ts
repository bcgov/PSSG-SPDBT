import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-contact-information',
	template: `
		<div class="step">
			<app-step-title title="Provide your contact information"></app-step-title>
			<div class="step-container row">
				<div class="col-xl-6 col-lg-8 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xl-8 col-lg-8 col-md-12">
								<mat-form-field>
									<mat-label>Email Address</mat-label>
									<input matInput formControlName="emailAddress" [errorStateMatcher]="matcher" maxlength="75" />
									<mat-error *ngIf="form.get('emailAddress')?.hasError('required')"> This is required </mat-error>
									<mat-error *ngIf="form.get('emailAddress')?.hasError('email')">
										Must be a valid email address
									</mat-error>
								</mat-form-field>
							</div>
							<div class="col-xl-4 col-lg-4 col-md-12">
								<mat-form-field>
									<mat-label>Personal Phone Number</mat-label>
									<input
										matInput
										formControlName="phoneNumber"
										[mask]="phoneMask"
										[showMaskTyped]="true"
										[errorStateMatcher]="matcher"
									/>
									<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')"> This is required </mat-error>
									<mat-error *ngIf="form.get('phoneNumber')?.hasError('mask')">This must be 10 digits</mat-error>
								</mat-form-field>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class ContactInformationComponent {
	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form: FormGroup = this.formBuilder.group({
		emailAddress: new FormControl(''),
		phoneNumber: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}
}
