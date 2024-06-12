import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressRetrieveResponse, ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { Address } from 'src/app/shared/components/address-autocomplete.component';

@Component({
	selector: 'app-step-permit-mailing-address',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title [title]="title" [subtitle]="subtitle"></app-step-title>

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

					<div class="row">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
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
					</div>
				</form>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitMailingAddressComponent implements OnInit, LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.permitApplicationService.mailingAddressFormGroup;
	title = '';
	subtitle = '';

	addressAutocompleteFields: AddressRetrieveResponse[] = [];

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.Replacement: {
				this.title = 'Review your mailing address';
				this.subtitle = 'Ensure your mailing address is correct before submitting your application';
				break;
			}
			case ApplicationTypeCode.Renewal:
			case ApplicationTypeCode.Update: {
				this.title = 'Confirm your mailing address';
				this.subtitle = 'Ensure your mailing address is correct before submitting your application';
				break;
			}
			default: {
				this.title = 'Provide your mailing address';
				this.subtitle =
					'Provide your mailing address, if different from your residential address. This cannot be a company address.';
				break;
			}
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

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
