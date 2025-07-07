import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LicenceBasicResponse, LicenceStatusCode, ServiceTypeCode } from '@app/api/models';
import { LicenceService } from '@app/api/services';
import { UtilService } from '@app/core/services/util.service';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { Subject } from 'rxjs';
import { SecurityLicenceStatusVerificationRoutes } from '../security-licence-status-verification-routes';

@Component({
	selector: 'app-security-licence-status-verification-sbl',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row no-print">
						<div class="col-xl-8 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Verify a security business licence</h2>
						</div>

						<div class="col-xl-4 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								<button
									mat-stroked-button
									color="primary"
									class="large w-auto mb-3"
									aria-label="Back to main page"
									(click)="onBack()"
								>
									<mat-icon>arrow_back</mat-icon>Back
								</button>
							</div>
						</div>

						<mat-divider class="mat-divider-main mb-4"></mat-divider>

						<div class="col-12 mb-3">
							<app-alert type="info" icon="">
								Enter a security business <strong>licence number</strong> or at least the
								<strong>first three (3)</strong> letters of the name of a security business below. The results will
								display the Legal Business Name, the Trade Name, the Licence Number, the Licence Status (valid, not
								valid), and the Licence Type of any businesses matching the search criteria.
							</app-alert>
						</div>
					</div>

					<form [formGroup]="form" novalidate>
						<div class="row no-print mb-2">
							<div class="col-xl-5 col-lg-5 col-md-12">
								<mat-form-field>
									<mat-label>Business Licence Number</mat-label>
									<input
										matInput
										formControlName="businessLicenceNumber"
										oninput="this.value = this.value.toUpperCase()"
										placeholder="B123456"
										[errorStateMatcher]="matcher"
										maxlength="20"
									/>
									@if (businessLicenceNumber.hasError('invalidCharsFormat')) {
										<mat-error>Security business licence numbers can only include letters and numbers</mat-error>
									}
									@if (businessLicenceNumber.hasError('invalidStartWith')) {
										<mat-error>Security business licence numbers must start with a "B"</mat-error>
									}
								</mat-form-field>
							</div>

							<div class="col-xl-1 col-lg-1 col-md-12 text-center">
								<div class="text-minor-heading text-red my-3">OR</div>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Business Name</mat-label>
									<input matInput formControlName="businessName" [errorStateMatcher]="matcher" maxlength="40" />
									@if (businessName.hasError('minLength')) {
										<mat-error>The business name must be at least 3 characters</mat-error>
									}
								</mat-form-field>
							</div>

							<div formGroupName="captchaFormGroup" class="col-12 mb-3 mt-4">
								<app-captcha-v2
									[captchaFormGroup]="captchaFormGroup"
									[resetControl]="resetRecaptchaControl"
								></app-captcha-v2>
								@if (
									(captchaFormGroup.get('token')?.dirty || captchaFormGroup.get('token')?.touched) &&
									captchaFormGroup.get('token')?.invalid &&
									captchaFormGroup.get('token')?.hasError('required')
								) {
									<mat-error class="mat-option-error">This is required </mat-error>
								}
							</div>

							@if (showSearchDataError) {
								<app-alert type="danger" icon="dangerous">
									Enter either a business licence number, OR the business name is required.
								</app-alert>
							}

							<div class="row my-2">
								<div class="col-12 text-end">
									<button mat-flat-button color="primary" class="large w-auto" (click)="onSubmit()">Submit</button>
								</div>
							</div>
						</div>
					</form>

					@if (showSearchResults) {
						@if (searchResults.length > 0) {
							<div class="mb-3">
								<mat-divider class="no-print my-3"></mat-divider>
								<div class="text-minor-heading no-print my-3">Search results</div>
								@for (licence of searchResults; track licence; let i = $index) {
									<div class="summary-card-section summary-card-section__green mb-3 px-4 py-3">
										<div class="row">
											<div class="col-xl-2 col-lg-2">
												<div class="d-block text-muted mt-2 mt-lg-0">Licence Number</div>
												<div class="fs-5" style="color: var(--color-primary);">
													{{ licence.licenceNumber }}
												</div>
											</div>
											<div class="col-xl-8 col-lg-8">
												<div class="row">
													<div class="col-xl-6 col-lg-6">
														<div class="d-block text-muted mt-2 mt-lg-0">Legal Business Name</div>
														<div class="text-data fw-bold">{{ licence.bizLegalName }}</div>
													</div>
													<div class="col-xl-6 col-lg-6">
														<div class="d-block text-muted mt-2 mt-lg-0">Trade Name</div>
														<div class="text-data fw-bold">{{ licence.licenceHolderName }}</div>
													</div>
													<div class="col-xl-12 col-lg-6">
														<div class="d-block text-muted mt-2">Licence Type(s)</div>
														<div class="text-data fw-bold">
															<ul class="m-0">
																@for (category of licence.categoryCodes?.sort(); track category; let i = $index) {
																	<li>{{ category | options: 'WorkerCategoryTypes' }}</li>
																}
															</ul>
														</div>
													</div>
												</div>
											</div>
											<div class="col-xl-2 col-lg-2 text-end">
												<mat-chip-option
													[selectable]="false"
													class="appl-chip-option"
													[ngClass]="getLicenceStatusClass(licence.licenceStatusCode)"
												>
													<span class="appl-chip-option-item mx-2 fs-5">{{
														getLicenceStatus(licence.licenceStatusCode)
													}}</span>
												</mat-chip-option>
											</div>
										</div>
									</div>
								}
							</div>
						} @else {
							<div class="mt-3">
								<app-alert type="danger" icon="dangerous"> No results match your search. </app-alert>
							</div>
						}
					}
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.text-red {
				color: var(--color-red) !important;
			}
		`,
	],
	standalone: false,
})
export class SecurityLicenceStatusVerificationSblComponent {
	showSearchDataError = false;

	showSearchResults = false;
	searchResults: Array<any> = [];
	resetRecaptchaControl: Subject<void> = new Subject<void>();

	form = this.formBuilder.group({
		businessLicenceNumber: new FormControl('', [
			FormControlValidators.licenceNumberValidator(ServiceTypeCode.SecurityBusinessLicence),
		]),
		businessName: new FormControl('', [FormControlValidators.requiredMinLengthValidator()]),
		captchaFormGroup: new FormGroup({
			token: new FormControl('', [FormControlValidators.required]),
		}),
	});

	matcher = new FormErrorStateMatcher();

	constructor(
		private router: Router,
		private utilService: UtilService,
		private formBuilder: FormBuilder,
		private licenceService: LicenceService
	) {}

	onBack(): void {
		this.router.navigateByUrl(SecurityLicenceStatusVerificationRoutes.path());
	}

	onSubmit() {
		this.reset();

		this.form.markAllAsTouched();

		const formValue = this.form.value;

		const businessLicenceNumber = formValue.businessLicenceNumber?.trim();
		const businessName = formValue.businessName?.trim();

		if ((businessLicenceNumber && businessName) || (!businessLicenceNumber && !businessName)) {
			this.showSearchDataError = true;
			return;
		}

		if (!this.form.valid) return;

		this.performSearch(businessLicenceNumber, businessName);
	}

	getLicenceStatusClass(licenceStatusCode: LicenceStatusCode | null | undefined): string {
		return this.utilService.isLicenceActive(licenceStatusCode) ? 'mat-chip-green' : 'mat-chip-red';
	}

	getLicenceStatus(licenceStatusCode: LicenceStatusCode | null | undefined): string {
		return this.utilService.isLicenceActive(licenceStatusCode) ? 'Active' : (licenceStatusCode ?? '---');
	}

	private reset(): void {
		this.searchResults = [];

		this.showSearchDataError = false;
		this.showSearchResults = false;
	}

	private resetRecaptcha(): void {
		this.resetRecaptchaControl.next(); // reset the recaptcha
		this.captchaFormGroup.reset();
	}

	private performSearch(licenceNumber: string | undefined, businessName: string | undefined): void {
		const formValue = this.form.getRawValue();
		const recaptcha = { recaptchaCode: formValue.captchaFormGroup.token };

		this.licenceService
			.apiLicencesBusinessLicencePost({
				licenceNumber,
				businessName,
				body: recaptcha,
			})
			.subscribe((resps: Array<LicenceBasicResponse>) => {
				const sortedResps = resps.sort((a, b) => {
					return this.utilService.sortByDirection(a.licenceNumber, b.licenceNumber);
				});

				this.searchResults = sortedResps;

				this.showSearchResults = true;
				this.resetRecaptcha();
			});
	}

	get captchaFormGroup(): FormGroup {
		return this.form.get('captchaFormGroup') as FormGroup;
	}
	get businessLicenceNumber(): FormControl {
		return this.form.get('businessLicenceNumber') as FormControl;
	}
	get businessName(): FormControl {
		return this.form.get('businessName') as FormControl;
	}
}
