import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceLookupResponse } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { EMPTY, Observable } from 'rxjs';
import { LicenceLookupService } from 'src/app/api/services';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-step-licence-expired',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Do you have an expired licence?"
					subtitle="Processing time will be reduced if you provide info from your past licence"
				></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
							<mat-radio-group aria-label="Select an option" formControlName="hasExpiredLicence">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('hasExpiredLicence')?.dirty || form.get('hasExpiredLicence')?.touched) &&
									form.get('hasExpiredLicence')?.invalid &&
									form.get('hasExpiredLicence')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>

					<div class="row mt-4" *ngIf="hasExpiredLicence.value === booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

							<div class="text-minor-heading mb-2">Expired Licence Information</div>
							<div class="row mt-2">
								<div class="col-lg-8 col-md-12 col-sm-12">
									<mat-form-field>
										<mat-label>Expired Licence Number</mat-label>
										<input
											matInput
											type="search"
											formControlName="expiredLicenceNumber"
											oninput="this.value = this.value.toUpperCase()"
											maxlength="20"
											[errorStateMatcher]="matcher"
											(keydown.enter)="onSearchKeyDown($event)"
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
										<mat-error *ngIf="form.get('expiredLicenceNumber')?.hasError('required')">
											This is required
										</mat-error>
									</mat-form-field>
								</div>
								<ng-container *ngIf="isAfterSearch">
									<app-alert type="info" icon="check_circle" *ngIf="isFound && isExpired">
										This is a valid expired licence with an expiry date of
										{{ expiryDate.value | formatDate : constants.date.formalDateFormat }}.
									</app-alert>
									<app-alert type="warning" *ngIf="isFound && !isExpired">
										The licence is still valid. Please renew it when you get your renewal notice in the mail.
									</app-alert>
									<app-alert type="warning" *ngIf="isFound && !isExpired">
										Your licence is still valid, and needs to be renewed. Please exit and
										<a
											href="https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing"
											target="_blank"
											>renew your licence</a
										>.
									</app-alert>
									<app-alert type="danger" icon="error" *ngIf="!isFound">
										This licence number does not match any existing licences.
									</app-alert>
								</ng-container>
							</div>
						</div>
					</div>
				</form>
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class StepLicenceExpiredComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	constants = SPD_CONSTANTS;

	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.licenceApplicationService.expiredLicenceFormGroup;

	isAfterSearch = !!(this.form && this.expiryDate && this.expiryDate.value);
	isFound = !!(this.form && this.expiredLicenceId && this.expiredLicenceId.value);
	isExpired = this.isExpiredDate;

	constructor(
		private utilService: UtilService,
		private licenceLookupService: LicenceLookupService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	public find(licenceNumber: string): Observable<LicenceLookupResponse> {
		if (!licenceNumber || licenceNumber.trim().length == 0) return EMPTY;

		return this.licenceLookupService
			.apiLicenceLookupLicenceNumberGet({
				licenceNumber,
			})
			.pipe();
	}

	onSearchKeyDown(searchEvent: any): void {
		const searchString = searchEvent.target.value;
		this.performSearch(searchString);
	}

	onSearch(): void {
		this.performSearch(this.expiredLicenceNumber.value);
	}

	private performSearch(licenceNumber: string) {
		this.isAfterSearch = false;
		this.isFound = false;
		this.isExpired = false;

		this.form.patchValue({ expiredLicenceId: null, expiryDate: null });

		if (!licenceNumber || licenceNumber.trim().length == 0) return;

		return this.licenceLookupService
			.apiLicenceLookupLicenceNumberGet({
				licenceNumber,
			})
			.pipe()
			.subscribe((resp: LicenceLookupResponse) => {
				this.isFound = !!resp?.expiryDate;
				if (resp?.expiryDate) {
					this.isExpired = !this.utilService.getIsFutureDate(resp.expiryDate);
					if (this.isExpired) {
						this.form.patchValue({ expiredLicenceId: resp.licenceId, expiryDate: resp.expiryDate });
					}
				}
				this.isAfterSearch = true;
			});
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isExpiredDate(): boolean {
		if (!this.expiryDate) {
			return false;
		}

		return !this.utilService.getIsFutureDate(this.expiryDate.value);
	}

	get hasExpiredLicence(): FormControl {
		return this.form.get('hasExpiredLicence') as FormControl;
	}

	get expiredLicenceNumber(): FormControl {
		return this.form.get('expiredLicenceNumber') as FormControl;
	}

	get expiredLicenceId(): FormControl {
		return this.form.get('expiredLicenceId') as FormControl;
	}

	get expiryDate(): FormControl {
		return this.form.get('expiryDate') as FormControl;
	}
}
