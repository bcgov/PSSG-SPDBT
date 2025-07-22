import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LicenceResponse, ServiceTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { CommonApplicationService, LicenceLookupResult } from '@app/core/services/common-application.service';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { Subject } from 'rxjs';

export interface LookupByLicenceNumberDialogData {
	title: string;
	subtitle?: string;
	notValidSwlMessage?: string;
	lookupServiceTypeCode: ServiceTypeCode;
	typeLabel?: string;
	isExpiredLicenceSearch: boolean;
	isLoggedIn: boolean;
	selectButtonLabel?: string;
}

@Component({
	selector: 'app-modal-lookup-by-licence-number',
	template: `
		<div mat-dialog-title class="mat-dialog-title">{{ title }}</div>
		<mat-dialog-content class="mat-dialog-content" class="pb-0">
			@if (subtitle) {
				<div class="fs-6 fw-normal pb-3">{{ subtitle }}</div>
			}
			<form [formGroup]="form" novalidate>
				@if (isLoggedIn) {
					<app-alert type="info" icon="info"> Enter the {{ typeLabel }} Number and click the search button. </app-alert>
				} @else {
					<app-alert type="info" icon="info">
						Enter the {{ typeLabel }} Number, perform the reCaptcha and then click the search button.
					</app-alert>
				}

				<div class="row">
					<div class="col-lg-12" [ngClass]="isLoggedIn ? 'col-xl-10' : 'col-xl-6'">
						<mat-form-field>
							<mat-label>{{ typeLabel }} Number</mat-label>
							<input
								matInput
								type="search"
								formControlName="licenceNumberLookup"
								oninput="this.value = this.value.toUpperCase()"
								maxlength="10"
								(keydown.enter)="onSearchKeyDown()"
							/>
							<button
								mat-button
								matSuffix
								mat-flat-button
								aria-label="Perform the search"
								matTooltip="Perform the search"
								(click)="onSearch()"
								class="search-icon-button"
							>
								<mat-icon>search</mat-icon>
							</button>
							@if (form.get('licenceNumberLookup')?.hasError('required')) {
								<mat-error>This is required</mat-error>
							}
						</mat-form-field>
					</div>

					@if (!isLoggedIn) {
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
					}
				</div>

				@if (isSearchPerformed) {
					@if (isFound) {
						@if (isFoundValid) {
							<div @showHideTriggerSlideAnimation>
								<div class="my-3">
									<app-alert type="success" icon="">
										<div class="row">
											<div class="col-md-6 col-sm-12">
												<div class="d-block text-muted mt-2">Name</div>
												<div class="text-data">{{ searchResultDisplay?.licenceHolderName }}</div>
											</div>
											<div class="col-md-6 col-sm-12">
												<div class="d-block text-muted mt-2">
													{{ lookupServiceTypeCode | options: 'ServiceTypes' }} Number
												</div>
												<div class="text-data">{{ searchResultDisplay?.licenceNumber }}</div>
											</div>
											<div class="col-md-6 col-sm-12">
												<div class="d-block text-muted mt-2">Expiry Date</div>
												<div class="text-data">{{ searchResultDisplay?.expiryDate }}</div>
											</div>
											<div class="col-md-6 col-sm-12">
												<div class="d-block text-muted mt-2">{{ typeLabel }} Status</div>
												<div class="text-data fw-bold">{{ searchResultDisplay?.licenceStatusCode }}</div>
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
														{{ searchResultDisplay?.serviceTypeCode | options: 'ServiceTypes' }} Number
													</div>
													<div class="text-data">{{ searchResultDisplay?.licenceNumber }}</div>
												</div>
												<div class="col-md-3 col-sm-12">
													<div class="d-block text-muted mt-2">Expiry Date</div>
													<div class="text-data">{{ searchResultDisplay?.expiryDate }}</div>
												</div>
												<div class="col-md-4 col-sm-12">
													<div class="d-block text-muted mt-2">{{ typeLabel }} Status</div>
													<div class="text-data fw-bold">{{ searchResultDisplay?.licenceStatusCode }}</div>
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
			</form>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-md-4 col-sm-12 mb-2">
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
					<div class="offset-md-4 col-md-4 col-sm-12 mb-2">
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
export class ModalLookupByLicenceNumberComponent implements OnInit {
	form = this.commonApplicationService.swlLookupLicenceFormGroup;

	captchaFormGroup = new FormGroup({
		token: new FormControl('', FormControlValidators.required),
	});
	resetRecaptcha: Subject<void> = new Subject<void>();

	title = '';
	subtitle: string | null = null;
	notValidSwlMessage: string | null = null;

	selectButtonLabel = 'Select';
	typeLabel = 'Licence';

	searchResultDisplay: LicenceResponse | null = null;

	isSearchPerformed = false;
	isFoundValid = false;
	isFound = false;

	messageError: string | null = '';
	messageWarn: string | null = '';

	isExpiredLicenceSearch = false;
	isLoggedIn = false;
	lookupServiceTypeCode!: ServiceTypeCode;

	constructor(
		private dialogRef: MatDialogRef<ModalLookupByLicenceNumberComponent>,
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
		this.isLoggedIn = this.dialogData.isLoggedIn;
		this.selectButtonLabel = this.dialogData.selectButtonLabel ?? 'Select';
		this.typeLabel = this.dialogData.typeLabel ?? 'Licence';
	}

	onSearchKeyDown(): void {
		this.onSearch();
	}

	onSearch(): void {
		this.resetFlags();

		this.form.markAllAsTouched();
		const isValidForm = this.form.valid;

		let isValidRecaptcha = true;
		if (!this.isLoggedIn) {
			this.captchaFormGroup.markAllAsTouched();
			isValidRecaptcha = this.captchaFormGroup.valid;
		}

		if (!isValidForm || !isValidRecaptcha) return;

		let recaptchaCode: string | null = null;
		if (!this.isLoggedIn) {
			recaptchaCode = this.captchaFormGroup.get('token')?.value ?? null;
		}

		this.performSearch(this.licenceNumberLookup.value, recaptchaCode);

		this.resetCaptcha();
	}

	private resetCaptcha(): void {
		this.resetRecaptcha.next(); // reset the recaptcha
		this.captchaFormGroup.reset();
	}

	private performSearch(licenceNumberLookup: string, recaptchaCode: string | null) {
		if (recaptchaCode) {
			this.commonApplicationService
				.getLicenceNumberLookupAnonymous(licenceNumberLookup, recaptchaCode)
				.pipe()
				.subscribe((resp: LicenceLookupResult) => {
					if (this.isExpiredLicenceSearch) {
						this.handlexpiredLicenceSearchResults(resp);
					} else {
						this.handleSearchResults(resp);
					}
				});
		} else {
			this.commonApplicationService
				.getLicenceNumberLookup(licenceNumberLookup)
				.pipe()
				.subscribe((resp: LicenceLookupResult) => {
					if (this.isExpiredLicenceSearch) {
						this.handlexpiredLicenceSearchResults(resp);
					} else {
						this.handleSearchResults(resp);
					}
				});
		}
	}

	private handleSearchResults(resp: LicenceLookupResult) {
		this.messageError = this.commonApplicationService.setLicenceLookupMessage(
			resp.searchResult,
			this.lookupServiceTypeCode
		);

		this.isSearchPerformed = true;
		this.isFound = resp.isFound;
		this.messageWarn = null;

		this.searchResultDisplay = resp.searchResult;

		this.isFoundValid = !!this.searchResultDisplay && !resp.isExpired && !this.messageError;
	}

	private handlexpiredLicenceSearchResults(resp: LicenceLookupResult) {
		[this.messageWarn, this.messageError] = this.commonApplicationService.setExpiredLicenceLookupMessage(
			resp.searchResult,
			this.lookupServiceTypeCode,
			resp.isExpired,
			resp.isInRenewalPeriod
		);

		this.isSearchPerformed = true;
		this.isFound = resp.isFound;

		this.searchResultDisplay = resp.searchResult;

		this.isFoundValid = !!this.searchResultDisplay && resp.isExpired && !this.messageWarn && !this.messageError;
	}

	onSave(): void {
		if (!this.isFoundValid) return;

		this.dialogRef.close({
			data: this.searchResultDisplay,
		});
	}

	resetFlags(): void {
		this.searchResultDisplay = null;

		this.isSearchPerformed = false;
		this.isFound = false;
		this.isFoundValid = false;
	}

	get licenceNumberLookup(): FormControl {
		return this.form.get('licenceNumberLookup') as FormControl;
	}
}
