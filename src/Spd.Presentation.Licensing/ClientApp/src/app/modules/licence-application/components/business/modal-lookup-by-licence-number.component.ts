import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LicenceResponse, WorkerLicenceTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import {
	CommonApplicationService,
	LicenceLookupResult,
} from '@app/modules/licence-application/services/common-application.service';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { Subject } from 'rxjs';

export interface LookupByLicenceNumberDialogData {
	title: string;
	subtitle?: string;
	notValidSwlMessage?: string;
	lookupWorkerLicenceTypeCode: WorkerLicenceTypeCode;
	isExpiredLicenceSearch: boolean;
	isLoggedIn: boolean;
}

@Component({
	selector: 'app-modal-lookup-by-licence-number',
	template: `
		<div mat-dialog-title class="mat-dialog-title">{{ title }}</div>
		<mat-dialog-content class="mat-dialog-content" class="pb-0">
			<div class="fs-6 fw-normal pb-3" *ngIf="subtitle">{{ subtitle }}</div>
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Licence Number</mat-label>
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
								aria-label="search"
								(click)="onSearch()"
								class="search-icon-button"
							>
								<mat-icon>search</mat-icon>
							</button>
							<mat-error *ngIf="form.get('licenceNumberLookup')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>
				</div>

				<div class="row">
					<div class="col-xl-6 col-lg-12 mt-2" *ngIf="!isLoggedIn">
						<div formGroupName="captchaFormGroup" class="mb-3">
							<app-captcha-v2 [captchaFormGroup]="captchaFormGroup" [resetControl]="resetRecaptcha"></app-captcha-v2>
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
					</div>
				</div>

				<ng-container *ngIf="isSearchPerformed">
					<ng-container *ngIf="isFound; else IsNotFound">
						<div *ngIf="isFoundValid" @showHideTriggerSlideAnimation>
							<div class="my-3">
								<app-alert type="success" icon="">
									<div class="row">
										<div class="col-md-6 col-sm-12">
											<div class="d-block text-muted mt-2">Name</div>
											<div class="text-data">{{ searchResult.licenceHolderName }}</div>
										</div>
										<div class="col-md-6 col-sm-12">
											<div class="d-block text-muted mt-2">
												{{ lookupWorkerLicenceTypeCode | options : 'WorkerLicenceTypes' }} Number
											</div>
											<div class="text-data">{{ searchResult.licenceNumber }}</div>
										</div>
										<div class="col-md-6 col-sm-12">
											<div class="d-block text-muted mt-2">Expiry Date</div>
											<div class="text-data">{{ searchResult.expiryDate }}</div>
										</div>
										<div class="col-md-6 col-sm-12">
											<div class="d-block text-muted mt-2">Licence Status</div>
											<div class="text-data fw-bold">{{ searchResult.licenceStatusCode }}</div>
										</div>
									</div>
								</app-alert>
							</div>
						</div>

						<div *ngIf="!isFoundValid">
							<ng-container *ngIf="isExpiredLicenceSearch; else LicenceSearchNotValid">
								<div class="mt-3">
									<app-alert type="info" icon="check_circle" *ngIf="messageInfo">
										{{ messageInfo }}
									</app-alert>
									<app-alert type="warning" *ngIf="messageWarn">
										<div [innerHTML]="messageWarn"></div>
									</app-alert>
									<app-alert type="danger" icon="error" *ngIf="messageError">
										{{ messageError }}
									</app-alert>
								</div>
							</ng-container>

							<ng-template #LicenceSearchNotValid>
								<div class="mt-3">
									<app-alert type="warning" icon="">
										<div class="fs-5 mb-2">
											This licence is not valid {{ lookupWorkerLicenceTypeCode | options : 'WorkerLicenceTypes' }}
										</div>

										<div class="row">
											<div class="col-md-5 col-sm-12">
												<div class="d-block text-muted mt-2">
													{{ searchResult.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }} Number
												</div>
												<div class="text-data">{{ searchResult.licenceNumber }}</div>
											</div>
											<div class="col-md-3 col-sm-12">
												<div class="d-block text-muted mt-2">Expiry Date</div>
												<div class="text-data">{{ searchResult.expiryDate }}</div>
											</div>
											<div class="col-md-4 col-sm-12">
												<div class="d-block text-muted mt-2">Licence Status</div>
												<div class="text-data fw-bold">{{ searchResult.licenceStatusCode }}</div>
											</div>
										</div>
										<div class="mt-2" *ngIf="notValidSwlMessage">
											{{ notValidSwlMessage }}
										</div>
									</app-alert>
								</div>
							</ng-template>
						</div>
					</ng-container>

					<ng-template #IsNotFound>
						<app-alert type="danger" icon="error"> This licence number does not match any existing licences </app-alert>
					</ng-template>
				</ng-container>
			</form>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close class="large" color="primary">Cancel</button>
				</div>
				<div class="offset-md-4 col-md-4 col-sm-12 mb-2" *ngIf="isFoundValid">
					<button mat-flat-button color="primary" class="large" (click)="onSave()">Select</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class ModalLookupByLicenceNumberComponent implements OnInit {
	form = this.businessApplicationService.swlLookupLicenceFormGroup;

	captchaFormGroup = new FormGroup({
		token: new FormControl('', FormControlValidators.required),
	});
	resetRecaptcha: Subject<void> = new Subject<void>();

	title = '';
	subtitle: string | null = null;
	notValidSwlMessage: string | null = null;

	searchResult: any = null;
	isSearchPerformed = false;
	isFoundValid = false;
	isFound = false;

	messageInfo: string | null = '';
	messageError: string | null = '';
	messageWarn: string | null = '';
	label = 'licenceTODO';

	isExpiredLicenceSearch = false;
	isLoggedIn = false;
	lookupWorkerLicenceTypeCode!: WorkerLicenceTypeCode;

	constructor(
		private dialogRef: MatDialogRef<ModalLookupByLicenceNumberComponent>,
		private businessApplicationService: BusinessApplicationService,
		private commonApplicationService: CommonApplicationService,
		private formatDatePipe: FormatDatePipe,
		@Inject(MAT_DIALOG_DATA) public dialogData: LookupByLicenceNumberDialogData
	) {}

	ngOnInit(): void {
		this.form.reset();

		this.title = this.dialogData.title;
		this.subtitle = this.dialogData.subtitle ?? null;
		this.notValidSwlMessage = this.dialogData.notValidSwlMessage ?? null;
		this.isExpiredLicenceSearch = this.dialogData.isExpiredLicenceSearch ?? false;
		this.lookupWorkerLicenceTypeCode = this.dialogData.lookupWorkerLicenceTypeCode;
		this.isLoggedIn = this.dialogData.isLoggedIn;
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
		this.isSearchPerformed = true;
		this.isFound = resp.isFound;
		this.isFoundValid = resp.isFoundValid;

		if (resp.searchResult) {
			if (resp.searchResult.workerLicenceTypeCode !== this.lookupWorkerLicenceTypeCode) {
				this.isFoundValid = false;
			}

			this.searchResult = resp.searchResult;
		}
	}

	private handlexpiredLicenceSearchResults(resp: LicenceLookupResult) {
		this.messageInfo = null;
		[this.messageWarn, this.messageError] = this.commonApplicationService.setExpiredLicenceLookupMessage(
			resp.searchResult,
			this.lookupWorkerLicenceTypeCode,
			resp.isExpired,
			resp.isInRenewalPeriod
		);

		this.isSearchPerformed = true;
		this.isFound = resp.isFound;
		this.searchResult = resp.searchResult;

		if (resp.searchResult && resp.isExpired && !this.messageWarn && !this.messageError) {
			this.isFoundValid = true;
			this.handleValidExpiredLicence(resp.searchResult);
		} else {
			this.isFoundValid = false;
		}
	}

	private handleValidExpiredLicence(licence: LicenceResponse): void {
		this.isFound = true;
		this.isFoundValid = true;

		const formattedExpiryDate = this.formatDatePipe.transform(licence.expiryDate, SPD_CONSTANTS.date.formalDateFormat);
		this.messageInfo = `This is a valid expired ${this.label} with an expiry date of ${formattedExpiryDate}.`;
	}

	onSave(): void {
		if (!this.isFoundValid) return;

		this.dialogRef.close({
			data: this.searchResult,
		});
	}

	resetFlags(): void {
		this.searchResult = null;

		this.isSearchPerformed = false;
		this.isFound = false;
		this.isFoundValid = false;
	}

	get licenceNumberLookup(): FormControl {
		return this.form.get('licenceNumberLookup') as FormControl;
	}
}
