import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AddressRetrieveResponse } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { Address } from './address-autocomplete.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-address',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row" *ngIf="!isReadonly">
				<div class="" [ngClass]="isWizardStep ? 'offset-lg-2 col-lg-8 col-md-12 col-sm-12' : 'col-12'">
					<app-address-form-autocomplete
						[isWizardStep]="isWizardStep"
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

			<div class="row">
				<div class="col-md-12 col-sm-12" [ngClass]="isWizardStep ? 'offset-lg-2 col-lg-8' : ''">
					<section *ngIf="form.get('addressSelected')?.value">
						<div class="row">
							<div class="col-12">
								<mat-divider class="mat-divider-primary mb-3" *ngIf="!isReadonly"></mat-divider>
								<div class="text-minor-heading mb-2" *ngIf="isWizardStep">Address information</div>
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
									<mat-error *ngIf="form.get('province')?.hasError('requiredValue')"
										>This must be '{{ provinceOfBC }}'</mat-error
									>
								</mat-form-field>
							</div>
							<div class="col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Country</mat-label>
									<input matInput formControlName="country" maxlength="100" />
									<mat-error *ngIf="form.get('country')?.hasError('required')">This is required</mat-error>
									<mat-error *ngIf="form.get('country')?.hasError('requiredValue')">This must be 'Canada'</mat-error>
								</mat-form-field>
							</div>
						</div>
					</section>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class AddressComponent implements OnInit {
	matcher = new FormErrorStateMatcher();
	provinceOfBC = SPD_CONSTANTS.address.provinceBC;

	addressAutocompleteFields: AddressRetrieveResponse[] = [];

	@Input() form!: FormGroup;
	@Input() isWizardStep = true;
	@Input() isReadonly = false;

	ngOnInit(): void {
		if (this.isReadonly) {
			this.addressLine1.disable({ emitEvent: false });
			this.addressLine2.disable({ emitEvent: false });
			this.city.disable({ emitEvent: false });
			this.postalCode.disable({ emitEvent: false });
			this.province.disable({ emitEvent: false });
			this.country.disable({ emitEvent: false });
		} else {
			this.addressLine1.enable();
			this.addressLine2.enable();
			this.city.enable();
			this.postalCode.enable();
			this.province.enable();
			this.country.enable();
		}
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

	get addressLine1(): FormControl {
		return this.form.get('addressLine1') as FormControl;
	}
	get addressLine2(): FormControl {
		return this.form.get('addressLine2') as FormControl;
	}
	get city(): FormControl {
		return this.form.get('city') as FormControl;
	}
	get postalCode(): FormControl {
		return this.form.get('postalCode') as FormControl;
	}
	get province(): FormControl {
		return this.form.get('province') as FormControl;
	}
	get country(): FormControl {
		return this.form.get('country') as FormControl;
	}
}
