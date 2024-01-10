import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressRetrieveResponse } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { Address } from '@app/shared/components/address-autocomplete.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-permit-employer-information',
	template: `
		<section class="step-section">
			<div class="step">
				<!-- <ng-container
					*ngIf="
						applicationTypeCode === applicationTypeCodes.Renewal || applicationTypeCode === applicationTypeCodes.Update
					"
				>
					<app-renewal-alert [applicationTypeCode]="applicationTypeCode"></app-renewal-alert>
				</ng-container> -->

				<app-step-title [title]="title"></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
							<div class="row">
								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Business Name </mat-label>
										<input matInput formControlName="businessName" [errorStateMatcher]="matcher" maxlength="40" />
										<mat-error *ngIf="form.get('businessName')?.hasError('required')"> This is required </mat-error>
									</mat-form-field>
								</div>
							</div>

							<div class="text-minor-heading mb-2">Supervisor's Contact Information</div>
							<div class="row">
								<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Supervisor's Name</mat-label>
										<input matInput formControlName="supervisorName" [errorStateMatcher]="matcher" maxlength="40" />
										<mat-error *ngIf="form.get('supervisorName')?.hasError('required')"> This is required </mat-error>
									</mat-form-field>
								</div>

								<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Email Address</mat-label>
										<input
											matInput
											formControlName="supervisorEmailAddress"
											[errorStateMatcher]="matcher"
											placeholder="name@domain.com"
											maxlength="75"
										/>
										<mat-error *ngIf="form.get('supervisorEmailAddress')?.hasError('required')">
											This is required
										</mat-error>
										<mat-error *ngIf="form.get('supervisorEmailAddress')?.hasError('email')">
											Must be a valid email address
										</mat-error>
									</mat-form-field>
								</div>
								<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Phone Number</mat-label>
										<input
											matInput
											formControlName="supervisorPhoneNumber"
											[errorStateMatcher]="matcher"
											[mask]="phoneMask"
										/>
										<mat-error *ngIf="form.get('supervisorPhoneNumber')?.hasError('required')"
											>This is required</mat-error
										>
										<mat-error *ngIf="form.get('supervisorPhoneNumber')?.hasError('mask')">
											This must be 10 digits
										</mat-error>
									</mat-form-field>
								</div>
							</div>

							<div class="text-minor-heading mb-2">Business's Primary Address</div>
							<app-address-form-autocomplete
								(autocompleteAddress)="onAddressAutocomplete($event)"
								(enterAddressManually)="onEnterAddressManually()"
							>
							</app-address-form-autocomplete>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('addressSelected')?.dirty || form.get('addressSelected')?.touched) &&
									form.get('addressSelected')?.invalid &&
									form.get('addressSelected')?.hasError('required')
								"
							>
								This is required
							</mat-error>
						</div>

						<section *ngIf="form.get('addressSelected')?.value">
							<div class="row">
								<div class="col-12">
									<mat-divider class="mat-divider-primary my-3"></mat-divider>
									<div class="text-minor-heading mb-2">Address Information</div>
									<mat-form-field>
										<mat-label>Street Address 1</mat-label>
										<input matInput formControlName="addressLine1" [errorStateMatcher]="matcher" maxlength="100" />
										<mat-error *ngIf="form.get('addressLine1')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>
								<div class="col-12">
									<mat-form-field>
										<mat-label>Street Address 2 <span class="optional-label">(optional)</span></mat-label>
										<input matInput formControlName="addressLine2" maxlength="100" />
									</mat-form-field>
								</div>
								<div class="col-md-6 col-sm-12">
									<mat-form-field>
										<mat-label>City</mat-label>
										<input matInput formControlName="city" maxlength="100" />
										<mat-error *ngIf="form.get('city')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>
								<div class="col-md-6 col-sm-12">
									<mat-form-field>
										<mat-label>Postal/Zip Code</mat-label>
										<input
											matInput
											formControlName="postalCode"
											oninput="this.value = this.value.toUpperCase()"
											maxlength="20"
										/>
										<mat-error *ngIf="form.get('postalCode')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>
								<div class="col-md-6 col-sm-12">
									<mat-form-field>
										<mat-label>Province/State</mat-label>
										<input matInput formControlName="province" maxlength="100" />
										<mat-error *ngIf="form.get('province')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>
								<div class="col-md-6 col-sm-12">
									<mat-form-field>
										<mat-label>Country</mat-label>
										<input matInput formControlName="country" maxlength="100" />
										<mat-error *ngIf="form.get('country')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>
							</div>
						</section>
					</div>
				</form>
			</div>
		</section>
	`,
	styles: ``,
})
export class StepPermitEmployerInformationComponent implements OnInit, LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form: FormGroup = this.permitApplicationService.employerInformationFormGroup;
	title = '';

	addressAutocompleteFields: AddressRetrieveResponse[] = [];
	// applicationTypeCodes = ApplicationTypeCode;

	readonly title_new = 'Provide your employer’s information';
	readonly title_replacement = 'Review your employer’s information';

	// @Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		// switch (this.applicationTypeCode) {
		// 	case ApplicationTypeCode.Replacement: {
		// 		this.title = this.title_replacement;
		// 		this.subtitle = this.title_subtitle_replacement;
		// 		break;
		// 	}
		// 	default: {
		this.title = this.title_new;
		// 		break;
		// 	}
		// }
	}

	onAddressAutocomplete(address: Address): void {
		if (!address) {
			this.form.patchValue({
				addressSelected: false,
				addressLine1: '',
				addressLine2: '',
				city: '',
				postalCode: '',
				province: '',
				country: '',
			});
			return;
		}

		const { countryCode, provinceCode, postalCode, line1, line2, city } = address;
		this.form.patchValue({
			addressSelected: true,
			addressLine1: line1,
			addressLine2: line2,
			city: city,
			postalCode: postalCode,
			province: provinceCode,
			country: countryCode,
		});
	}

	onEnterAddressManually(): void {
		this.form.patchValue({
			addressSelected: true,
		});
	}

	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}
}
