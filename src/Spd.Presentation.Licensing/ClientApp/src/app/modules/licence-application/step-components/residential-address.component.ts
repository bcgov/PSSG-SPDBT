import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AddressRetrieveResponse } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { Address } from 'src/app/shared/components/address-autocomplete.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-residential-address',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="Confirm your residential address" [subtitle]="subtitle"></app-step-title>
				<form [formGroup]="form" novalidate>
					<div class="row" *ngIf="!isLoggedIn">
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
								<div class="text-minor-heading mb-2">Address information:</div>
								<mat-form-field>
									<mat-label>Street Address 1</mat-label>
									<input matInput formControlName="addressLine1" [errorStateMatcher]="matcher" maxlength="100" />
									<mat-error *ngIf="form.get('addressLine1')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
						</div>

						<div class="row">
							<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
								<mat-form-field>
									<mat-label>Street Address 2 <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="addressLine2" maxlength="100" />
								</mat-form-field>
							</div>
						</div>
						<div class="row">
							<div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>City</mat-label>
									<input matInput formControlName="city" maxlength="100" />
									<mat-error *ngIf="form.get('city')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-lg-4 col-md-6 col-sm-12">
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
						</div>
						<div class="row">
							<div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Province/State</mat-label>
									<input matInput formControlName="province" maxlength="100" />
									<mat-error *ngIf="form.get('province')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-lg-4 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Country</mat-label>
									<input matInput formControlName="country" maxlength="100" />
									<mat-error *ngIf="form.get('country')?.hasError('required')">This is required</mat-error>
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
export class ResidentialAddressComponent implements OnInit, LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form: FormGroup = this.licenceApplicationService.residentialAddressFormGroup;

	readonly subtitle_unauth_new = 'This is the address where you currently live';
	readonly subtitle_auth_new =
		'This is the address from your BC Services Card. If you need to make any updates, visit <a href="https://www.addresschange.gov.bc.ca/" target="_blank">addresschange.gov.bc.ca</a>';

	subtitle = '';

	isLoggedIn = false;

	authenticationSubscription!: Subscription;
	addressAutocompleteFields: AddressRetrieveResponse[] = [];

	constructor(
		private authProcessService: AuthProcessService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		this.authenticationSubscription = this.authProcessService.waitUntilAuthentication$.subscribe(
			(isLoggedIn: boolean) => {
				this.isLoggedIn = isLoggedIn;
				if (isLoggedIn) {
					this.subtitle = this.subtitle_auth_new;

					this.addressLine1.disable({ emitEvent: false });
					this.addressLine2.disable({ emitEvent: false });
					this.city.disable({ emitEvent: false });
					this.postalCode.disable({ emitEvent: false });
					this.province.disable({ emitEvent: false });
					this.country.disable({ emitEvent: false });
				} else {
					this.subtitle = this.subtitle_unauth_new;

					this.addressLine1.enable();
					this.addressLine2.enable();
					this.city.enable();
					this.postalCode.enable();
					this.province.enable();
					this.country.enable();
				}
			}
		);
	}

	ngOnDestroy() {
		if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
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
		this.form.markAllAsTouched();
		return this.form.valid;
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
