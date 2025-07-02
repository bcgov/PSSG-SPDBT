import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LicenceBasicResponse, LicenceNumbersRequest } from '@app/api/models';
import { LicenceService } from '@app/api/services';
import { UtilService } from '@app/core/services/util.service';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { Subject } from 'rxjs';
import { SecurityLicenceStatusVerificationRoutes } from '../security-licence-status-verification-routes';

@Component({
	selector: 'app-security-licence-status-verification-swls',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-8 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Verify Many Security Worker Licences</h2>
						</div>

						<div class="col-xl-4 col-lg-4 col-md-12 no-print">
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
								Enter a comma-separated list of security worker <strong>licence numbers</strong> as they appears on the
								licence, below. Press 'Submit' and the results will confirm if the licence numbers are valid and the
								name of the licensee.
								<br />
								<br />
								For example: E123456,E234567,E345678
							</app-alert>
						</div>
					</div>

					<form [formGroup]="form" novalidate>
						<div class="row mb-2">
							<div class="col-12">
								<mat-form-field>
									<mat-label>Worker Licence Numbers</mat-label>
									<textarea
										matInput
										formControlName="licenceNumbers"
										style="min-height: 120px"
										[errorStateMatcher]="matcher"
										maxlength="500"
									></textarea>
									@if (form.get('licenceNumbers')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
									<mat-hint>Maximum 500 characters</mat-hint>
								</mat-form-field>
							</div>
							<div class="col-12 mt-3">
								<div formGroupName="captchaFormGroup">
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
							</div>
						</div>

						<div class="row no-print my-2">
							<div class="col-12 text-end">
								<button mat-flat-button color="primary" class="large w-auto" (click)="onSubmit()">Submit</button>
							</div>
						</div>
					</form>

					<app-security-licence-status-swl-search-results
						[showSearchResults]="showSearchResults"
						[searchResults]="searchResults"
					></app-security-licence-status-swl-search-results>
				</div>
			</div>
		</section>
	`,
	styles: [],
	standalone: false,
})
export class SecurityLicenceStatusVerificationSwlsComponent {
	showSearchResults = false;

	searchResults: Array<any> = [];
	resetRecaptchaControl: Subject<void> = new Subject<void>();

	form = this.formBuilder.group({
		licenceNumbers: new FormControl('', [FormControlValidators.required]),
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

		if (!this.form.valid) return;

		const formValue = this.form.value;
		const licenceNumbers = formValue.licenceNumbers?.trim();

		this.performSearch(licenceNumbers);
	}

	private reset(): void {
		this.searchResults = [];
		this.showSearchResults = false;
	}

	private resetRecaptcha(): void {
		this.resetRecaptchaControl.next(); // reset the recaptcha
		this.captchaFormGroup.reset();
	}

	private performSearch(licenceNumbers: string | undefined): void {
		if (!licenceNumbers) return;

		const formData = this.form.getRawValue();
		const recaptcha = { recaptchaCode: formData.captchaFormGroup.token };

		const body: LicenceNumbersRequest = {
			licenceNumbers,
			recaptcha,
		};

		this.licenceService
			.apiLicencesSecurityWorkerLicenceInBulkPost({ body })
			.subscribe((resps: Array<LicenceBasicResponse>) => {
				if (resps.length > 0) {
					const sortedResps = resps.sort((a, b) => {
						return this.utilService.sortByDirection(a.licenceNumber, b.licenceNumber);
					});

					this.searchResults = sortedResps;
				}

				this.showSearchResults = true;
				this.resetRecaptcha();
			});
	}

	get captchaFormGroup(): FormGroup {
		return this.form.get('captchaFormGroup') as FormGroup;
	}
}
