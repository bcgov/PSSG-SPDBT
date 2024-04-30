import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BusinessLicenceTypes } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-common-business-information',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-md-12 col-sm-12">
					<div class="row">
						<div class="col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Legal Business Name</mat-label>
								<input matInput formControlName="legalBusinessName" [errorStateMatcher]="matcher" maxlength="160" />
								<mat-error *ngIf="form.get('legalBusinessName')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>

						<div class="col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Trade Name</mat-label>
								<input matInput formControlName="doingBusinessAsName" maxlength="160" />
								<mat-error *ngIf="form.get('doingBusinessAsName')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>

						<div class="col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Business Type</mat-label>
								<mat-select formControlName="businessTypeCode" [errorStateMatcher]="matcher">
									<mat-option
										class="proof-option"
										*ngFor="let item of businessTypes; let i = index"
										[value]="item.code"
									>
										{{ item.desc }}
									</mat-option>
								</mat-select>
								<mat-error *ngIf="form.get('businessTypeCode')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>

						<!-- <div class="row">
					<div class="col-xxl-4 col-xl-4 col-lg-5 col-md-12 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<mat-radio-group aria-label="Select an option" formControlName="businessTypeCode">
								<ng-container *ngFor="let item of businessTypeCodes; let i = index">
									<mat-radio-button class="radio-label" [value]="item.code">{{ item.desc }}</mat-radio-button>
								</ng-container>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('businessTypeCode')?.dirty || form.get('businessTypeCode')?.touched) &&
									form.get('businessTypeCode')?.invalid &&
									form.get('businessTypeCode')?.hasError('required')
								"
								>An option must be selected</mat-error
							>
						</form>
					</div>
				</div> -->

						<div class="col-lg-6 col-md-12">
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

						<div class="col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Phone Number</mat-label>
								<input matInput formControlName="phoneNumber" [errorStateMatcher]="matcher" [mask]="phoneMask" />
								<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('phoneNumber')?.hasError('mask')"> This must be 10 digits </mat-error>
							</mat-form-field>
						</div>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class CommonBusinessInformationComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	businessTypes = BusinessLicenceTypes;

	@Input() form!: FormGroup;

	isFormValid(): boolean {
		this.form.markAllAsTouched();

		return this.form.valid;
	}
}
