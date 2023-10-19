import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressRetrieveResponse } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { Address } from 'src/app/shared/components/address-autocomplete.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-residential-address',
	template: `
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
					</div>

					<section *ngIf="form.get('addressSelected')?.value">
						<div class="row">
							<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
								<mat-divider class="my-3" style="border-top-color: var(--color-primary-light);"></mat-divider>
								<div class="text-minor-heading fw-semibold mb-2">Address Information</div>
								<mat-form-field>
									<mat-label>Street Address 1</mat-label>
									<input
										matInput
										formControlName="residentialAddressLine1"
										[errorStateMatcher]="matcher"
										maxlength="100"
									/>
									<mat-error *ngIf="form.get('residentialAddressLine1')?.hasError('required')"
										>This is required</mat-error
									>
								</mat-form-field>
							</div>
						</div>

						<div class="row">
							<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
								<mat-form-field>
									<mat-label>Street Address 2 <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="residentialAddressLine2" maxlength="100" />
								</mat-form-field>
							</div>
						</div>
						<div class="row">
							<div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>City</mat-label>
									<input matInput formControlName="residentialCity" maxlength="100" />
									<mat-error *ngIf="form.get('residentialCity')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-lg-4 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Postal/Zip Code</mat-label>
									<input
										matInput
										formControlName="residentialPostalCode"
										oninput="this.value = this.value.toUpperCase()"
										maxlength="20"
									/>
									<mat-error *ngIf="form.get('residentialPostalCode')?.hasError('required')"
										>This is required</mat-error
									>
								</mat-form-field>
							</div>
						</div>
						<div class="row">
							<div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Province/State</mat-label>
									<input matInput formControlName="residentialProvince" maxlength="100" />
									<mat-error *ngIf="form.get('residentialProvince')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-lg-4 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Country</mat-label>
									<input matInput formControlName="residentialCountry" maxlength="100" />
									<mat-error *ngIf="form.get('residentialCountry')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
						</div>
						<div class="row">
							<div class="offset-lg-2 col-lg-8 col-md-6 col-sm-12">
								<mat-checkbox formControlName="isMailingTheSameAsResidential">
									My residential address and mailing address are the same
								</mat-checkbox>
							</div>
						</div>
					</section>
				</form>
			</div>
		</section>
	`,
	styles: [],
})
export class ResidentialAddressComponent implements LicenceFormStepComponent {
	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form: FormGroup = this.licenceApplicationService.residentialAddressFormGroup;

	addressAutocompleteFields: AddressRetrieveResponse[] = [];

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	onAddressAutocomplete(address: Address): void {
		if (!address) {
			this.form.patchValue({
				addressSelected: false,
				residentialAddressLine1: '',
				residentialAddressLine2: '',
				residentialCity: '',
				residentialPostalCode: '',
				residentialProvince: '',
				residentialCountry: '',
			});
			return;
		}

		const { countryCode, provinceCode, postalCode, line1, line2, city } = address;
		this.form.patchValue({
			addressSelected: true,
			residentialAddressLine1: line1,
			residentialAddressLine2: line2,
			residentialCity: city,
			residentialPostalCode: postalCode,
			residentialProvince: provinceCode,
			residentialCountry: countryCode,
		});
	}

	onEnterAddressManually(): void {
		this.form.patchValue({
			addressSelected: true,
		});
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
