import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { LicenceBasicResponse, LicenceNumbersRequest } from '@app/api/models';
import { LicenceService } from '@app/api/services';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { UtilService } from '@app/core/services/util.service';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { Subject } from 'rxjs';
import { SecurityLicenceStatusVerificationRoutes } from '../security-licence-status-verification-routes';

@Component({
	selector: 'app-security-licence-status-verification-swl',
	template: `
		<section class="step-section">
			<div class="row no-print">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-8 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Verify a security worker licence</h2>
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
								Search by a single security worker <strong>licence number</strong>, or the <strong>full name</strong>,
								or multiple security worker <strong>licence numbers</strong>. Select your 'Search by' option to
								continue.
							</app-alert>
						</div>
					</div>

					<div class="row mb-2">
						<form [formGroup]="form" novalidate>
							<div class="col-12">
								<mat-label>Search by</mat-label>
								<mat-radio-group
									aria-label="Select an option"
									formControlName="searchBy"
									(change)="onSearchByChange($event)"
								>
									<div class="d-flex justify-content-start">
										<mat-radio-button value="A">Worker licence number</mat-radio-button>
										<mat-radio-button value="B">Worker licence name</mat-radio-button>
										<mat-radio-button value="C">Bulk worker licence numbers</mat-radio-button>
									</div>
								</mat-radio-group>
								@if ((searchBy.dirty || searchBy.touched) && searchBy.invalid && searchBy.hasError('required')) {
									<mat-error class="mat-option-error">This is required</mat-error>
								}
								<mat-divider class="mt-3 mb-2"></mat-divider>
							</div>
						</form>
					</div>

					@if (searchBy.value === 'A') {
						<div class="row mb-2" @showHideTriggerSlideAnimation>
							<div class="text-minor-heading mb-3">Search by worker licence number</div>
							<div class="col-xl-8 col-lg-12 col-md-12 mb-3">
								Enter a security worker <strong>licence number</strong> as it appears on the licence, below. Press
								'Submit' and the results will confirm if the licence number is valid and the name of the licensee.
							</div>
							<div class="col-xl-4 col-lg-5 col-md-12" [formGroup]="workerLicenceNumberForm">
								<mat-form-field>
									<mat-label>Security Worker Licence Number</mat-label>
									<input
										matInput
										formControlName="workerLicenceNumber"
										oninput="this.value = this.value.toUpperCase()"
										placeholder="E123456"
										[errorStateMatcher]="matcher"
										maxlength="20"
									/>
									@if (workerLicenceNumberForm.get('workerLicenceNumber')?.hasError('required')) {
										<mat-error> This is required </mat-error>
									}
									@if (workerLicenceNumberForm.get('workerLicenceNumber')?.hasError('invalidCharsFormat')) {
										<mat-error>Security worker licence numbers can only include letters and numbers</mat-error>
									}
									@if (workerLicenceNumberForm.get('workerLicenceNumber')?.hasError('invalidStartWith')) {
										<mat-error>Security worker licence numbers must start with an "E"</mat-error>
									}
								</mat-form-field>
								<div formGroupName="captchaFormGroup" class="mt-4">
									<app-captcha-v2
										[captchaFormGroup]="captchaFormGroupA"
										[resetControl]="resetRecaptchaControl"
									></app-captcha-v2>
									@if (
										(captchaFormGroupA.get('token')?.dirty || captchaFormGroupA.get('token')?.touched) &&
										captchaFormGroupA.get('token')?.invalid &&
										captchaFormGroupA.get('token')?.hasError('required')
									) {
										<mat-error class="mat-option-error">This is required </mat-error>
									}
								</div>
							</div>
						</div>
					}

					@if (searchBy.value === 'B') {
						<div class="row mb-2" @showHideTriggerSlideAnimation>
							<div class="text-minor-heading mb-3">Search by worker licence name</div>
							<div class="col-xl-5 col-lg-12 col-md-12 mb-3">
								Enter a security worker <strong>full name</strong> as it appears on the licence, below. Press 'Submit'
								and the results will confirm if the licence number is valid and the name of the licensee.
							</div>
							<div class="col-xl-7 col-lg-6 col-md-12">
								<div class="row" [formGroup]="workerLicenceNameForm">
									@if (!isOneNameOnly.value) {
										<div class="col-xl-6 col-lg-12 col-md-12">
											<mat-form-field>
												<mat-label>First Name</mat-label>
												<input matInput formControlName="firstName" [errorStateMatcher]="matcher" maxlength="40" />
											</mat-form-field>
										</div>
									}

									<div class="col-xl-6 col-lg-12 col-md-12">
										<mat-form-field>
											<mat-label>{{ lastNameLabel }}</mat-label>
											<input matInput formControlName="lastName" [errorStateMatcher]="matcher" maxlength="40" />
											@if (workerLicenceNameForm.get('lastName')?.hasError('required')) {
												<mat-error> This is required </mat-error>
											}
										</mat-form-field>
									</div>

									<div class="col-xl-6 col-lg-12 col-md-12">
										<mat-checkbox formControlName="isOneNameOnly" (click)="onCheckboxChange()"
											>Licence holder has surname only</mat-checkbox
										>
									</div>

									<div class="col-12 mt-4" formGroupName="captchaFormGroup">
										<app-captcha-v2
											[captchaFormGroup]="captchaFormGroupB"
											[resetControl]="resetRecaptchaControl"
										></app-captcha-v2>
										@if (
											(captchaFormGroupB.get('token')?.dirty || captchaFormGroupB.get('token')?.touched) &&
											captchaFormGroupB.get('token')?.invalid &&
											captchaFormGroupB.get('token')?.hasError('required')
										) {
											<mat-error class="mat-option-error">This is required </mat-error>
										}
									</div>
								</div>
							</div>
						</div>
					}

					@if (searchBy.value === 'C') {
						<div class="row mb-2" @showHideTriggerSlideAnimation>
							<div class="text-minor-heading mb-3">Search by bulk worker licence numbers</div>
							<div class="col-xl-5 col-lg-12 col-md-12 mb-3">
								Enter a comma-separated list of security worker <strong>licence numbers</strong> as they appears on the
								licence, below. Press 'Submit' and the results will confirm if the licence numbers are valid and the
								name of the licensee.
								<br />
								<br />
								For example: E123456,E234567,E345678
							</div>
							<div class="col-xl-7 col-lg-6 col-md-12" [formGroup]="bulkWorkerLicenceNumbersForm">
								<mat-form-field>
									<mat-label>Security Worker Licence Numbers</mat-label>
									<textarea
										matInput
										formControlName="licenceNumbers"
										style="min-height: 120px"
										[errorStateMatcher]="matcher"
										maxlength="500"
									></textarea>
									@if (licenceNumbers.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
									@if (licenceNumbers.hasError('invalidCharsFormat')) {
										<mat-error
											>Security worker licence numbers can only include letters and numbers:
											{{ licenceNumbersInvalidCharsItems.join(', ') }}</mat-error
										>
									}
									@if (licenceNumbers.hasError('invalidStartWith')) {
										<mat-error
											>Security worker licence numbers must start with an "E":
											{{ licenceNumbersInvalidStartWithItems.join(', ') }}</mat-error
										>
									}
									<mat-hint>Maximum 500 characters</mat-hint>
								</mat-form-field>
								<div formGroupName="captchaFormGroup" class="mt-4">
									<app-captcha-v2
										[captchaFormGroup]="captchaFormGroupC"
										[resetControl]="resetRecaptchaControl"
									></app-captcha-v2>
									@if (
										(captchaFormGroupC.get('token')?.dirty || captchaFormGroupC.get('token')?.touched) &&
										captchaFormGroupC.get('token')?.invalid &&
										captchaFormGroupC.get('token')?.hasError('required')
									) {
										<mat-error class="mat-option-error">This is required </mat-error>
									}
								</div>
							</div>
						</div>
					}

					<div class="col-12 mt-3 mb-2 text-end">
						<button mat-flat-button color="primary" class="large w-auto" (click)="onSubmit()">Submit</button>
					</div>
				</div>
			</div>

			<app-security-licence-status-swl-search-results
				[showSearchResults]="showSearchResults"
				[searchResultsErrorName]="searchResultsErrorName"
				[searchResults]="searchResults"
			></app-security-licence-status-swl-search-results>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class SecurityLicenceStatusVerificationSwlComponent {
	showSearchResults = false;
	searchResultsErrorName = '';
	lastNameLabel = 'Last Name';

	searchResults: Array<any> = [];
	resetRecaptchaControl: Subject<void> = new Subject<void>();

	form = this.formBuilder.group({
		searchBy: new FormControl('', [FormControlValidators.required]),
	});

	workerLicenceNumberForm = this.formBuilder.group({
		workerLicenceNumber: new FormControl('', [
			FormControlValidators.required,
			FormControlValidators.licenceNumberValidator(),
		]),
		captchaFormGroup: new FormGroup({
			token: new FormControl('', [FormControlValidators.required]),
		}),
	});

	workerLicenceNameForm = this.formBuilder.group({
		firstName: new FormControl(''),
		lastName: new FormControl('', [FormControlValidators.required]),
		isOneNameOnly: new FormControl(false),
		captchaFormGroup: new FormGroup({
			token: new FormControl('', [FormControlValidators.required]),
		}),
	});

	bulkWorkerLicenceNumbersForm = this.formBuilder.group({
		licenceNumbers: new FormControl('', [
			FormControlValidators.required,
			FormControlValidators.commaSeparatedSwlValidator({
				allowEmpty: true,
			}),
		]),
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

		if (this.searchBy.value === 'A') {
			this.performNumberSearch();
		} else if (this.searchBy.value === 'B') {
			this.performNameSearch();
		} else if (this.searchBy.value === 'C') {
			this.performBulkSearch();
		}
	}

	onSearchByChange(_event: MatRadioChange) {
		this.resetRecaptcha();
		this.reset();

		this.workerLicenceNameForm.reset();
		this.workerLicenceNumberForm.reset();
		this.bulkWorkerLicenceNumbersForm.reset();
	}

	onCheckboxChange(): void {
		const data = this.workerLicenceNameForm.value;
		if (data.isOneNameOnly) {
			this.workerLicenceNameForm.controls['firstName'].setValue('');
			this.lastNameLabel = 'Name';
		} else {
			this.lastNameLabel = 'Last Name';
		}
	}

	private reset(): void {
		this.searchResults = [];

		this.showSearchResults = false;
		this.searchResultsErrorName = '';
	}

	private resetRecaptcha(): void {
		this.resetRecaptchaControl.next(); // reset the recaptcha
		this.captchaFormGroupA.reset();
		this.captchaFormGroupB.reset();
		this.captchaFormGroupC.reset();
	}

	private performNumberSearch(): void {
		this.workerLicenceNumberForm.markAllAsTouched();
		if (!this.workerLicenceNumberForm.valid) return;

		const formValue = this.workerLicenceNumberForm.getRawValue();
		const recaptcha = { recaptchaCode: formValue.captchaFormGroup.token };
		const licenceNumber = formValue.workerLicenceNumber?.trim();

		this.licenceService
			.apiLicencesSecurityWorkerLicencePost({
				licenceNumber,
				firstName: undefined,
				lastName: undefined,
				body: recaptcha,
			})
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

	private performNameSearch(): void {
		this.workerLicenceNameForm.markAllAsTouched();
		if (!this.workerLicenceNameForm.valid) return;

		const formValue = this.workerLicenceNameForm.getRawValue();
		const recaptcha = { recaptchaCode: formValue.captchaFormGroup.token };
		const lastName = formValue.lastName?.trim();
		const isOneNameOnly = formValue.isOneNameOnly ?? false;
		const searchFirstName = isOneNameOnly ? '' : formValue.firstName?.trim();

		this.licenceService
			.apiLicencesSecurityWorkerLicencePost({
				licenceNumber: undefined,
				firstName: searchFirstName,
				lastName,
				body: recaptcha,
			})
			.subscribe((resps: Array<LicenceBasicResponse>) => {
				if (resps.length === 0) {
					this.searchResultsErrorName = this.utilService.getFullName(searchFirstName, lastName) ?? '';
				} else {
					const sortedResps = resps.sort((a, b) => {
						return this.utilService.sortByDirection(a.licenceNumber, b.licenceNumber);
					});

					this.searchResults = sortedResps;
				}

				this.showSearchResults = true;
				this.resetRecaptcha();
			});
	}

	private performBulkSearch(): void {
		this.bulkWorkerLicenceNumbersForm.markAllAsTouched();
		if (!this.bulkWorkerLicenceNumbersForm.valid) return;

		const formValue = this.bulkWorkerLicenceNumbersForm.getRawValue();
		const licenceNumbers = formValue.licenceNumbers?.trim();

		if (!licenceNumbers) return;

		const recaptcha = { recaptchaCode: formValue.captchaFormGroup.token };

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

	get searchBy(): FormControl {
		return this.form.get('searchBy') as FormControl;
	}
	get firstName(): FormControl {
		return this.workerLicenceNameForm.get('firstName') as FormControl;
	}
	get isOneNameOnly(): FormControl {
		return this.workerLicenceNameForm.get('isOneNameOnly') as FormControl;
	}
	get captchaFormGroupA(): FormGroup {
		return this.workerLicenceNumberForm.get('captchaFormGroup') as FormGroup;
	}
	get captchaFormGroupB(): FormGroup {
		return this.workerLicenceNameForm.get('captchaFormGroup') as FormGroup;
	}
	get captchaFormGroupC(): FormGroup {
		return this.bulkWorkerLicenceNumbersForm.get('captchaFormGroup') as FormGroup;
	}
	get licenceNumbers(): FormControl {
		return this.bulkWorkerLicenceNumbersForm.get('licenceNumbers') as FormControl;
	}
	get licenceNumbersInvalidCharsItems(): [] {
		return this.licenceNumbers.errors ? this.licenceNumbers.errors['invalidCharsItems'] : [];
	}
	get licenceNumbersInvalidStartWithItems(): [] {
		return this.licenceNumbers.errors ? this.licenceNumbers.errors['invalidStartWithItems'] : [];
	}
}
