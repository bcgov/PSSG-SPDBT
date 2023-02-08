import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
	Address,
	AddressAutocompleteFindResponse,
} from 'projects/shared/src/lib/components/address-autocomplete.model';
import { FormErrorStateMatcher } from 'projects/shared/src/public-api';
import { ScreeningFormStepComponent } from '../screening.component';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'app-mailing-address',
	template: `
		<section class="step-section pt-4 pb-5 px-3">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<div class="title mb-5">What is your mailing address?</div>

					<div class="row">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12 mb-4">
							<app-address-form-autocomplete (autocompleteAddress)="onAddressAutocomplete($event)">
							</app-address-form-autocomplete>
							<mat-divider class="my-3"></mat-divider>
						</div>
					</div>

					<div class="row">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>Street Address 1</mat-label>
								<input matInput formControlName="mailingAddressLine1" [errorStateMatcher]="matcher" />
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>Street Address 2</mat-label>
								<input matInput formControlName="mailingAddressLine2" />
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="offset-lg-2 col-lg-5 col-md-7 col-sm-12">
							<mat-form-field>
								<mat-label>City</mat-label>
								<input matInput formControlName="mailingCity" maxlength="30" />
							</mat-form-field>
						</div>
						<div class="col-lg-3 col-md-5 col-sm-12">
							<mat-form-field>
								<mat-label>Postal Code</mat-label>
								<input matInput formControlName="mailingPostalCode" />
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Province</mat-label>
								<input matInput formControlName="mailingProvince" />
							</mat-form-field>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Country</mat-label>
								<input matInput formControlName="mailingCountry" />
							</mat-form-field>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [],
})
export class MailingAddressComponent implements OnInit, ScreeningFormStepComponent {
	form!: FormGroup;
	addressAutocompleteFields: AddressAutocompleteFindResponse[] = [];
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			mailingAddressLine1: new FormControl('', [Validators.required]),
			mailingAddressLine2: new FormControl(''),
			mailingCity: new FormControl(''),
			mailingPostalCode: new FormControl(''),
			mailingProvince: new FormControl(''),
			mailingCountry: new FormControl(''),
		});
	}

	onAddressAutocomplete({ countryCode, provinceCode, postalCode, line1, line2, city }: Address): void {
		this.form.patchValue({
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
}
