import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AddressRetrieveResponse } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { Address } from 'src/app/shared/components/address-autocomplete.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import {
	LicenceApplicationService,
	LicenceFormStepComponent,
	LicenceModelSubject,
} from '../licence-application.service';

@Component({
	selector: 'app-mailing-address',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="Provide your mailing address"
					subtitle="Provide your mailing address, if different from your residential address. This can not be a company address."
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
export class MailingAddressComponent implements OnInit, OnDestroy, LicenceFormStepComponent {
	private licenceModelLoadedSubscription!: Subscription;

	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form = this.formBuilder.group({
		addressSelected: new FormControl(false, [Validators.requiredTrue]),
		mailingAddressLine1: new FormControl('', [FormControlValidators.required]),
		mailingAddressLine2: new FormControl(''),
		mailingCity: new FormControl('', [FormControlValidators.required]),
		mailingPostalCode: new FormControl('', [FormControlValidators.required]),
		mailingProvince: new FormControl('', [FormControlValidators.required]),
		mailingCountry: new FormControl('', [FormControlValidators.required]),
	});

	addressAutocompleteFields: AddressRetrieveResponse[] = [];

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: LicenceModelSubject) => {
				if (loaded.isLoaded) {
					this.form.patchValue({
						addressSelected: !!this.licenceApplicationService.licenceModel.mailingAddressLine1,
						mailingAddressLine1: this.licenceApplicationService.licenceModel.mailingAddressLine1,
						mailingAddressLine2: this.licenceApplicationService.licenceModel.mailingAddressLine2,
						mailingCity: this.licenceApplicationService.licenceModel.mailingCity,
						mailingPostalCode: this.licenceApplicationService.licenceModel.mailingPostalCode,
						mailingProvince: this.licenceApplicationService.licenceModel.mailingProvince,
						mailingCountry: this.licenceApplicationService.licenceModel.mailingCountry,
					});
				}
			},
		});
	}

	ngOnDestroy() {
		this.licenceModelLoadedSubscription.unsubscribe();
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
		return this.form.valid;
	}
}
