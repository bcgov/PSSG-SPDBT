import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressRetrieveResponse } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { Address } from 'src/app/shared/components/address-autocomplete.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-residential-address',
	template: `
		<!-- <section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="Confirm your residential address"
					subtitle="This is the address from your BC Services Card. If you need to make any updates, visit <a href='https://www.addresschange.gov.bc.ca/' target='_blank'>addresschange.gov.bc.ca</a>"
				></app-step-title>
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
		</section> -->

		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="Confirm your residential address"
					subtitle="This is the address from your BC Services Card. If you need to make any updates, visit <a href='https://www.addresschange.gov.bc.ca/' target='_blank'>addresschange.gov.bc.ca</a>"
				></app-step-title>
				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
							<app-address-form-autocomplete
								(autocompleteAddress)="onAddressAutocomplete($event)"
								(enterAddressManually)="onEnterAddressManually()"
							>
							</app-address-form-autocomplete>
							<mat-error
								*ngIf="
									(form.get('addressSelected')?.dirty || form.get('addressSelected')?.touched) &&
									form.get('addressSelected')?.invalid &&
									form.get('addressSelected')?.hasError('required')
								"
							>
								This is required
							</mat-error>
						</div>
					</div>

					<section *ngIf="form.get('addressSelected')?.value">
						<div class="row">
							<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
								<mat-divider class="my-3" style="border-top-color: var(--color-primary-light);"></mat-divider>
								<div class="text-minor-heading fw-semibold mb-2">Address Information</div>
								<mat-form-field>
									<mat-label>Street Address 1</mat-label>
									<input matInput formControlName="mailingAddressLine1" [errorStateMatcher]="matcher" maxlength="100" />
									<mat-error *ngIf="form.get('mailingAddressLine1')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
						</div>

						<div class="row">
							<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
								<mat-form-field>
									<mat-label>Street Address 2 <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="mailingAddressLine2" maxlength="100" />
								</mat-form-field>
							</div>
						</div>
						<div class="row">
							<div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>City</mat-label>
									<input matInput formControlName="mailingCity" maxlength="100" />
									<mat-error *ngIf="form.get('mailingCity')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-lg-4 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Postal/Zip Code</mat-label>
									<input
										matInput
										formControlName="mailingPostalCode"
										oninput="this.value = this.value.toUpperCase()"
										maxlength="20"
									/>
									<mat-error *ngIf="form.get('mailingPostalCode')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
						</div>
						<div class="row">
							<div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Province/State</mat-label>
									<input matInput formControlName="mailingProvince" maxlength="100" />
									<mat-error *ngIf="form.get('mailingProvince')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-lg-4 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Country</mat-label>
									<input matInput formControlName="mailingCountry" maxlength="100" />
									<mat-error *ngIf="form.get('mailingCountry')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
						</div>
					</section>
				</form>
			</div>
		</section>
	`,
	styles: [],
})
export class ResidentialAddressComponent {
	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form: FormGroup = this.formBuilder.group({
		emailAddress: new FormControl(''),
		phoneNumber: new FormControl(''),
	});

	addressAutocompleteFields: AddressRetrieveResponse[] = [];

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			addressSelected: new FormControl(false, [Validators.requiredTrue]),
			mailingAddressLine1: new FormControl('', [FormControlValidators.required]),
			mailingAddressLine2: new FormControl(''),
			mailingCity: new FormControl('', [FormControlValidators.required]),
			mailingPostalCode: new FormControl('', [FormControlValidators.required]),
			mailingProvince: new FormControl('', [FormControlValidators.required]),
			mailingCountry: new FormControl('', [FormControlValidators.required]),
		});
	}

	onAddressAutocomplete(address: Address): void {
		if (!address) {
			this.form.patchValue({
				addressSelected: false,
				mailingAddressLine1: '',
				mailingAddressLine2: '',
				mailingCity: '',
				mailingPostalCode: '',
				mailingProvince: '',
				mailingCountry: '',
			});
			return;
		}

		const { countryCode, provinceCode, postalCode, line1, line2, city } = address;
		this.form.patchValue({
			addressSelected: true,
			mailingAddressLine1: line1,
			mailingAddressLine2: line2,
			mailingCity: city,
			mailingPostalCode: postalCode,
			mailingProvince: provinceCode,
			mailingCountry: countryCode,
		});
	}

	onEnterAddressManually(): void {
		this.form.patchValue({
			addressSelected: true,
		});
	}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		return true; // this.form.valid;
	}

	clearCurrentData(): void {
		this.form.reset();
	}
}
