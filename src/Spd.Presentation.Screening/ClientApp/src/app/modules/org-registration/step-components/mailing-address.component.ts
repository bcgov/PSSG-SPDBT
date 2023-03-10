import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AddressRetrieveResponse } from 'src/app/api/models';
import { Address } from 'src/app/shared/components/address-autocomplete.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { RegistrationFormStepComponent } from '../org-registration.component';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'app-mailing-address',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="step">
				<app-step-title title="What is your organization's mailing address?"></app-step-title>
				<div class="row">
					<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
						<app-address-form-autocomplete (autocompleteAddress)="onAddressAutocomplete($event)">
						</app-address-form-autocomplete>
						<mat-error
							*ngIf="
								(form.dirty || form.touched) &&
								form.get('addressSelected')?.invalid &&
								form.get('addressSelected')?.hasError('required')
							"
						>
							This is required
						</mat-error>
					</div>
				</div>

				<section *ngIf="form.get('addressSelected')?.value">
					<div class="row mt-4">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
							<mat-divider class="my-3" style="border-top-color: var(--color-primary-light);"></mat-divider>
							<div class="text-minor-heading fw-semibold mb-2">Address Information</div>
							<mat-form-field>
								<mat-label>Street Address 1</mat-label>
								<input matInput formControlName="mailingAddressLine1" maxlength="100" [errorStateMatcher]="matcher" />
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
								<input matInput formControlName="mailingCity" maxlength="30" />
								<mat-error *ngIf="form.get('mailingCity')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Postal/Zip Code</mat-label>
								<input matInput formControlName="mailingPostalCode" maxlength="20" />
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
			</div>
		</form>
	`,
	styles: [
		`
			.text-minor-heading {
				color: var(--color-primary-light);
			}
		`,
	],
})
export class MailingAddressComponent implements OnInit, RegistrationFormStepComponent {
	form!: FormGroup;
	addressAutocompleteFields: AddressRetrieveResponse[] = [];
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			addressSelected: new FormControl(false, [Validators.requiredTrue]),
			mailingAddressLine1: new FormControl('', [Validators.required]),
			mailingAddressLine2: new FormControl(''),
			mailingCity: new FormControl('', [Validators.required]),
			mailingPostalCode: new FormControl('', [Validators.required]),
			mailingProvince: new FormControl('', [Validators.required]),
			mailingCountry: new FormControl('', [Validators.required]),
		});
	}

	onAddressAutocomplete({ countryCode, provinceCode, postalCode, line1, line2, city }: Address): void {
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

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}

	clearCurrentData(): void {
		this.form.reset();
	}
}
