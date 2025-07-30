import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode, ServiceTypeCode } from '@app/api/models';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { CommonApplicationService, LicenceLookupResult } from '@app/core/services/common-application.service';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-step-rd-gdsd-certificate',
	template: `
		<app-step-section heading="Guide dog or service dog certification">
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="text-minor-heading mb-2">Current Certificate Number</div>
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xxl-4 col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Certificate #</mat-label>
									<input
										matInput
										formControlName="currentGDSDCertificateNumber"
										[errorStateMatcher]="matcher"
										maxlength="40"
										appInputUpperCaseTransform
									/>
									@if (form.get('currentGDSDCertificateNumber')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
								</mat-form-field>
							</div>

							@if (isDisplayCaptcha) {
								<div class="col-xxl-4 col-xl-4 col-lg-12 col-md-12">
									<div [formGroup]="captchaFormGroup">
										<app-captcha-v2
											[captchaFormGroup]="captchaFormGroup"
											[resetControl]="resetRecaptcha"
										></app-captcha-v2>
										@if (
											(captchaFormGroup.get('token')?.dirty || captchaFormGroup.get('token')?.touched) &&
											captchaFormGroup.get('token')?.invalid &&
											captchaFormGroup.get('token')?.hasError('required')
										) {
											<mat-error class="mat-option-error"
												>Click this button to verify that you are not a robot</mat-error
											>
										}
									</div>
								</div>
							}

							<div class="col-xxl-4 col-xl-4 col-lg-12 col-md-12">
								<button mat-flat-button color="primary" class="large w-auto mt-2" (click)="onSearch()">
									Verify GDSD Certificate Number
								</button>
								@if (isInvalidSearchState) {
									<mat-error class="mat-option-error mt-2"
										>Click this button to verify the GDSD Certificate Number</mat-error
									>
								}
							</div>
						</div>

						@if (isSearchPerformed) {
							<div class="my-2">
								@if (isFound) {
									<app-alert type="success" icon=""> {{ messageInfo }} </app-alert>
								} @else {
									<app-alert type="danger" icon="dangerous">{{ messageInfo }}</app-alert>
								}
							</div>
						}
					</form>

					<form [formGroup]="dogGdsdCertificateFormGroup" novalidate>
						<div class="text-minor-heading my-2">Attach your current Guide or Service Dog Certificate</div>
						<app-file-upload
							(fileUploaded)="onFileUploaded($event)"
							(fileRemoved)="onFileRemoved()"
							[control]="attachments"
							[maxNumberOfFiles]="10"
							[files]="attachments.value"
							[previewImage]="true"
							ariaFileUploadLabel="Upload your current Guide or Service Dog Certificate"
						></app-file-upload>
						@if (
							(dogGdsdCertificateFormGroup.get('attachments')?.dirty ||
								dogGdsdCertificateFormGroup.get('attachments')?.touched) &&
							dogGdsdCertificateFormGroup.get('attachments')?.invalid &&
							dogGdsdCertificateFormGroup.get('attachments')?.hasError('required')
						) {
							<mat-error>This is required</mat-error>
						}
					</form>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepRdGdsdCertficateComponent implements OnInit, LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	isDisplayCaptcha = false;
	isSearchPerformed = false;
	isFound: boolean = false;
	messageInfo: string | null = null;

	form: FormGroup = this.retiredDogApplicationService.dogGdsdCertificateNumberFormGroup;
	dogGdsdCertificateFormGroup: FormGroup = this.retiredDogApplicationService.dogGdsdCertificateFormGroup;
	captchaFormGroup: FormGroup = this.retiredDogApplicationService.captchaFormGroup;

	resetRecaptcha: Subject<void> = new Subject<void>();

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private authProcessService: AuthProcessService,
		private commonApplicationService: CommonApplicationService,
		private retiredDogApplicationService: RetiredDogApplicationService
	) {}

	ngOnInit(): void {
		this.authProcessService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			this.isDisplayCaptcha = !isLoggedIn;
			this.captchaFormGroup.patchValue({ displayCaptcha: this.isDisplayCaptcha });
		});
	}

	onFileUploaded(file: File): void {
		this.retiredDogApplicationService.fileUploaded(
			LicenceDocumentTypeCode.GdsdCertificate,
			file,
			this.attachments,
			this.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.retiredDogApplicationService.fileRemoved();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		this.dogGdsdCertificateFormGroup.markAllAsTouched();

		if (this.isInvalidSearchState) {
			this.captchaFormGroup.markAllAsTouched();
			return false;
		}

		return this.form.valid && this.dogGdsdCertificateFormGroup.valid;
	}

	onSearch(): void {
		this.resetFlags();

		if (!this.isSearchFormValid()) return;

		let recaptchaCode: string | null = null;
		if (this.isDisplayCaptcha) {
			this.captchaFormGroup.markAllAsTouched();
			if (!this.captchaFormGroup.valid) return;

			recaptchaCode = this.captchaFormGroup.get('token')?.value ?? null;
		}

		this.performSearch(this.currentGDSDCertificateNumber.value, recaptchaCode);

		this.resetCaptcha();
	}

	private resetFlags(): void {
		this.isSearchPerformed = false;
		this.isFound = false;
		this.messageInfo = null;
	}

	private isSearchFormValid(): boolean {
		this.form.markAllAsTouched();
		this.captchaFormGroup.markAllAsTouched();

		const licenceNumberSearch = this.form.get('currentGDSDCertificateNumber')?.value;

		return licenceNumberSearch && this.captchaFormGroup.valid;
	}

	private resetCaptcha(): void {
		this.resetRecaptcha.next(); // reset the recaptcha
		this.captchaFormGroup.patchValue({ displayCaptcha: this.isDisplayCaptcha });

		// reset form state (so validation error does not show)
		this.captchaFormGroup.markAsPristine(); // Marks entire form as pristine
		this.captchaFormGroup.markAsUntouched(); // Optional: if you also want it to look untouched
		this.captchaFormGroup.updateValueAndValidity(); // Recalculate validation state
	}

	private performSearch(licenceNumberLookup: string, recaptchaCode: string | null) {
		if (recaptchaCode) {
			this.commonApplicationService
				.getLicenceNumberLookupAnonymous(licenceNumberLookup, recaptchaCode)
				.pipe()
				.subscribe((resp: LicenceLookupResult) => {
					this.handleSearchResults(resp);
				});
		} else {
			this.commonApplicationService
				.getLicenceNumberLookup(licenceNumberLookup)
				.pipe()
				.subscribe((resp: LicenceLookupResult) => {
					this.handleSearchResults(resp);
				});
		}
	}

	private handleSearchResults(resp: LicenceLookupResult) {
		this.isSearchPerformed = true;

		if (resp.searchResult && resp.searchResult.serviceTypeCode === ServiceTypeCode.GdsdTeamCertification) {
			this.isFound = true;
			this.messageInfo = `${resp.searchResult.licenceNumber} has been verified.`;
			this.form.patchValue({
				verifiedLicenceNumber: resp.searchResult.licenceNumber,
			});
			return;
		}

		this.messageInfo = 'The GDSD Certification number you entered is not an existing GDSD Team Certification.';
		this.form.patchValue({
			verifiedLicenceNumber: null,
		});
	}

	get isInvalidSearchState(): boolean {
		// displayed licence number and verified licence number must match
		const licenceNumber1 = this.form.get('currentGDSDCertificateNumber')?.value;
		const licenceNumber2 = this.form.get('verifiedLicenceNumber')?.value;
		const isInvalidState = licenceNumber1 != licenceNumber2;
		return isInvalidState;
	}

	get displayCaptcha(): FormControl {
		return this.captchaFormGroup.get('displayCaptcha') as FormControl;
	}
	get currentGDSDCertificateNumber(): FormControl {
		return this.form.get('currentGDSDCertificateNumber') as FormControl;
	}
	get attachments(): FormControl {
		return this.dogGdsdCertificateFormGroup.get('attachments') as FormControl;
	}
}
