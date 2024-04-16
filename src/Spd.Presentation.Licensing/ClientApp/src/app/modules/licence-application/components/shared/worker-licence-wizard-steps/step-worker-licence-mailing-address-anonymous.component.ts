import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AddressRetrieveResponse, ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { Address } from '@app/shared/components/address-autocomplete.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-worker-licence-mailing-address-anonymous',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container *ngIf="applicationTypeCode !== applicationTypeCodes.New">
					<app-common-update-renewal-alert
						[applicationTypeCode]="applicationTypeCode"
					></app-common-update-renewal-alert>
				</ng-container>

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

							<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Replacement">
								<app-alert type="info" icon="" [showBorder]="false">
									<div class="mb-2">COLLECTION NOTICE</div>
									All information regarding this application is collected under the <i>Security Services Act</i> and its
									Regulation and will be used for that purpose. The use of this information will comply with the
									<i>Freedom of Information</i> and <i>Privacy Act</i> and the federal <i>Privacy Act</i>. If you have
									any questions regarding the collection or use of this information, please contact
									<a href="mailto:securitylicensing@gov.bc.ca">securitylicensing&#64;gov.bc.ca</a>
								</app-alert>

								<div formGroupName="captchaFormGroup" *ngIf="displayCaptcha.value">
									<app-captcha-v2 [captchaFormGroup]="captchaFormGroup"></app-captcha-v2>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(captchaFormGroup.get('token')?.dirty || captchaFormGroup.get('token')?.touched) &&
											captchaFormGroup.get('token')?.invalid &&
											captchaFormGroup.get('token')?.hasError('required')
										"
										>This is required</mat-error
									>
								</div>
							</ng-container>
						</div>
					</div>
				</form>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceMailingAddressAnonymousComponent implements OnInit, LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form: FormGroup = this.licenceApplicationService.mailingAddressFormGroup;
	title = '';
	subtitle = '';

	addressAutocompleteFields: AddressRetrieveResponse[] = [];
	applicationTypeCodes = ApplicationTypeCode;

	readonly title_new = 'Provide your mailing address';
	readonly title_subtitle_new =
		'Provide your mailing address, if different from your residential address. This cannot be a company address.';
	readonly title_replacement = 'Review your mailing address';
	readonly title_subtitle_replacement = 'Ensure your mailing address is correct before submitting your application';

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(
		private licenceApplicationService: LicenceApplicationService,
		private authProcessService: AuthProcessService
	) {}

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.Replacement: {
				this.title = this.title_replacement;
				this.subtitle = this.title_subtitle_replacement;

				this.authProcessService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
					this.captchaFormGroup.patchValue({ displayCaptcha: !isLoggedIn });
				});
				break;
			}
			default: {
				this.title = this.title_new;
				this.subtitle = this.title_subtitle_new;
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

	get captchaFormGroup(): FormGroup {
		return this.form.get('captchaFormGroup') as FormGroup;
	}
	get displayCaptcha(): FormControl {
		return this.form.get('captchaFormGroup')?.get('displayCaptcha') as FormControl;
	}
}
