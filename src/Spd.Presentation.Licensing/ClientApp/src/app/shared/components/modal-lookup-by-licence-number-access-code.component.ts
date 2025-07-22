import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LicenceResponse, ServiceTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { CommonApplicationService, LicenceLookupResult } from '@app/core/services/common-application.service';
import { Subject } from 'rxjs';
import { LookupByLicenceNumberDialogData } from './modal-lookup-by-licence-number.component';

@Component({
	selector: 'app-modal-lookup-by-licence-number-access-code',
	template: `
		<div mat-dialog-title class="mat-dialog-title">{{ title }}</div>
		<mat-dialog-content class="mat-dialog-content" class="pb-0">
			@if (subtitle) {
				<div class="fs-6 fw-normal pb-3">{{ subtitle }}</div>
			}

			<app-alert type="info" icon="info">
				Enter the {{ typeLabel }} Number, access code, perform the reCaptcha and then click the search button.
			</app-alert>

			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-6 col-lg-12">
						<mat-form-field>
							<mat-label>{{ typeLabel }} Number</mat-label>
							<input
								matInput
								type="search"
								formControlName="licenceNumberLookup"
								oninput="this.value = this.value.toUpperCase()"
								maxlength="10"
								(keydown.enter)="onSearchAnonymousKeyDown()"
							/>
							@if (form.get('licenceNumberLookup')?.hasError('required')) {
								<mat-error>This is required</mat-error>
							}
						</mat-form-field>
					</div>

					<div class="col-xl-6 col-lg-12">
						<mat-form-field>
							<mat-label>Access Code</mat-label>
							<input
								matInput
								formControlName="accessCode"
								oninput="this.value = this.value.toUpperCase()"
								maxlength="10"
							/>
							@if (form.get('accessCode')?.hasError('required')) {
								<mat-error>This is required</mat-error>
							}
						</mat-form-field>
					</div>

					<div class="col-xl-6 col-lg-12">
						<div [formGroup]="captchaFormGroup" class="mb-3">
							<app-captcha-v2 [captchaFormGroup]="captchaFormGroup" [resetControl]="resetRecaptcha"></app-captcha-v2>
							@if (
								(captchaFormGroup.get('token')?.dirty || captchaFormGroup.get('token')?.touched) &&
								captchaFormGroup.get('token')?.invalid &&
								captchaFormGroup.get('token')?.hasError('required')
							) {
								<mat-error class="mat-option-error-small">This is required</mat-error>
							}
						</div>
					</div>

					<div class="col-xl-6 col-lg-12">
						<button
							mat-flat-button
							color="primary"
							class="large mt-2"
							aria-label="Perform the search"
							(click)="onSearchAnonymous()"
						>
							Search
						</button>
					</div>
				</div>
			</form>

			@if (isSearchPerformed) {
				@if (isFound) {
					@if (isFoundValid) {
						<div @showHideTriggerSlideAnimation>
							<div class="my-3">
								<app-alert type="success" icon="">
									<div class="row">
										<div class="col-xl-6 col-lg-12">
											<div class="d-block text-muted mt-2">Name</div>
											<div class="text-data">{{ searchLicenceResponse?.licenceHolderName }}</div>
										</div>
										<div class="col-xl-6 col-lg-12">
											<div class="d-block text-muted mt-2">
												{{ lookupServiceTypeCode | options: 'ServiceTypes' }} Number
											</div>
											<div class="text-data">{{ searchLicenceResponse?.licenceNumber }}</div>
										</div>
										<div class="col-xl-6 col-lg-12">
											<div class="d-block text-muted mt-2">Expiry Date</div>
											<div class="text-data">{{ searchLicenceResponse?.expiryDate }}</div>
										</div>
										<div class="col-xl-6 col-lg-12">
											<div class="d-block text-muted mt-2">{{ typeLabel }} Status</div>
											<div class="text-data fw-bold">{{ searchLicenceResponse?.licenceStatusCode }}</div>
										</div>
									</div>
								</app-alert>
							</div>
						</div>
					}
					@if (!isFoundValid) {
						<div>
							@if (isExpiredLicenceSearch) {
								<div class="mt-3">
									@if (messageWarn) {
										<app-alert type="warning">
											<div [innerHTML]="messageWarn"></div>
										</app-alert>
									}
									@if (messageError) {
										<app-alert type="danger" icon="dangerous">
											{{ messageError }}
										</app-alert>
									}
								</div>
							} @else {
								<div class="mt-3">
									<app-alert type="danger" icon="">
										<div class="fs-5 mb-2">
											This {{ typeLabel }} is not valid {{ lookupServiceTypeCode | options: 'ServiceTypes' }}.
										</div>
										<div class="row">
											<div class="col-md-5 col-sm-12">
												<div class="d-block text-muted mt-2">
													{{ searchLicenceResponse?.serviceTypeCode | options: 'ServiceTypes' }} Number
												</div>
												<div class="text-data">{{ searchLicenceResponse?.licenceNumber }}</div>
											</div>
											<div class="col-md-3 col-sm-12">
												<div class="d-block text-muted mt-2">Expiry Date</div>
												<div class="text-data">{{ searchLicenceResponse?.expiryDate }}</div>
											</div>
											<div class="col-md-4 col-sm-12">
												<div class="d-block text-muted mt-2">{{ typeLabel }} Status</div>
												<div class="text-data fw-bold">{{ searchLicenceResponse?.licenceStatusCode }}</div>
											</div>
										</div>
										@if (notValidSwlMessage) {
											<div class="mt-2">
												{{ notValidSwlMessage }}
											</div>
										}
									</app-alert>
								</div>
							}
						</div>
					}
				} @else {
					<app-alert type="danger" icon="dangerous">
						{{ messageError }}
					</app-alert>
				}
			}
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-xl-6 col-lg-12 mb-2">
					<button
						mat-stroked-button
						mat-dialog-close
						class="large"
						color="primary"
						aria-label="Cancel and close the popup"
					>
						Cancel
					</button>
				</div>
				@if (isFoundValid) {
					<div class="col-xl-6 col-lg-12 mb-2">
						<button
							mat-flat-button
							color="primary"
							class="large"
							aria-label="Save and close the popup"
							(click)="onSave()"
						>
							{{ selectButtonLabel }}
						</button>
					</div>
				}
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class ModalLookupByLicenceNumberAccessCodeComponent implements OnInit {
	form = this.commonApplicationService.swlLookupLicenceAnonymousFormGroup;

	resetRecaptcha: Subject<void> = new Subject<void>();

	title = '';
	subtitle: string | null = null;
	notValidSwlMessage: string | null = null;

	selectButtonLabel = 'Select';
	typeLabel = 'Licence';

	searchLicenceResponse: LicenceResponse | null = null;

	isSearchPerformed = false;
	isFoundValid = false;
	isFound = false;

	messageError: string | null = '';
	messageWarn: string | null = '';

	isExpiredLicenceSearch = false;
	lookupServiceTypeCode!: ServiceTypeCode;

	constructor(
		private dialogRef: MatDialogRef<ModalLookupByLicenceNumberAccessCodeComponent>,
		private commonApplicationService: CommonApplicationService,
		@Inject(MAT_DIALOG_DATA) public dialogData: LookupByLicenceNumberDialogData
	) {}

	ngOnInit(): void {
		this.form.reset();

		this.title = this.dialogData.title;
		this.subtitle = this.dialogData.subtitle ?? null;
		this.notValidSwlMessage = this.dialogData.notValidSwlMessage ?? null;
		this.isExpiredLicenceSearch = this.dialogData.isExpiredLicenceSearch ?? false;
		this.lookupServiceTypeCode = this.dialogData.lookupServiceTypeCode;
		this.selectButtonLabel = this.dialogData.selectButtonLabel ?? 'Select';
		this.typeLabel = this.dialogData.typeLabel ?? 'Licence';
	}

	onSearchAnonymousKeyDown(): void {
		this.onSearchAnonymous();
	}

	onSearchAnonymous(): void {
		this.resetFlags();
		this.form.markAllAsTouched();
		const isValidForm = this.form.valid;

		this.captchaFormGroup.markAllAsTouched();
		const isValidRecaptcha = this.captchaFormGroup.valid;

		if (!isValidForm || !isValidRecaptcha) return;

		const recaptchaCode = this.captchaFormGroup.get('token')?.value;

		this.commonApplicationService
			.getLicenceNumberAccessCodeLookupAnonymous(
				this.licenceNumberLookupAnonymous.value,
				this.accessCode.value,
				recaptchaCode
			)
			.pipe()
			.subscribe((resp: LicenceLookupResult) => {
				this.resetCaptcha();

				if (this.isExpiredLicenceSearch) {
					this.handleExpiredLicenceSearchResults(resp);
				} else {
					this.handleSearchResults(resp);
				}
			});
	}

	private resetCaptcha(): void {
		this.resetRecaptcha.next(); // reset the recaptcha
		this.captchaFormGroup.reset();
	}

	private handleSearchResults(resp: LicenceLookupResult) {
		this.messageError = this.commonApplicationService.setLicenceLookupMessage(
			resp.searchResult,
			this.lookupServiceTypeCode,
			true
		);

		this.isSearchPerformed = true;
		this.isFound = resp.isFound;
		this.messageWarn = null;

		this.searchLicenceResponse = resp.searchResult;

		this.isFoundValid = !!this.searchLicenceResponse && !resp.isExpired && !this.messageError;
	}

	private handleExpiredLicenceSearchResults(resp: LicenceLookupResult) {
		[this.messageWarn, this.messageError] = this.commonApplicationService.setExpiredLicenceLookupMessage(
			resp.searchResult,
			this.lookupServiceTypeCode,
			resp.isExpired,
			resp.isInRenewalPeriod,
			true
		);

		this.isSearchPerformed = true;
		this.isFound = resp.isFound;

		this.searchLicenceResponse = resp.searchResult;

		this.isFoundValid = !!this.searchLicenceResponse && resp.isExpired && !this.messageWarn && !this.messageError;
	}

	onSave(): void {
		if (!this.isFoundValid) return;

		this.dialogRef.close({
			data: this.searchLicenceResponse,
		});
	}

	resetFlags(): void {
		this.searchLicenceResponse = null;

		this.isSearchPerformed = false;
		this.isFound = false;
		this.isFoundValid = false;
	}

	get licenceNumberLookupAnonymous(): FormControl {
		return this.form.get('licenceNumberLookup') as FormControl;
	}
	get accessCode(): FormControl {
		return this.form.get('accessCode') as FormControl;
	}
	get captchaFormGroup(): FormGroup {
		return this.form.get('captchaFormGroup') as FormGroup;
	}
}
