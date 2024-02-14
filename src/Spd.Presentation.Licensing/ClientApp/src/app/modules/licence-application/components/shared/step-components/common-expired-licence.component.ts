import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceResponse, WorkerLicenceTypeCode } from '@app/api/models';
import { LicenceService } from '@app/api/services';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-common-expired-licence',
	template: `
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

					<div class="row">
						<div class="col-lg-6 col-md-12 mt-2">
							<mat-form-field>
								<mat-label>Expired {{ titleLabel }} Number</mat-label>
								<input
									matInput
									type="search"
									formControlName="expiredLicenceNumber"
									oninput="this.value = this.value.toUpperCase()"
									[errorStateMatcher]="matcher"
									(keydown.enter)="onSearchKeyDown($event)"
									maxlength="10"
								/>

								<mat-error *ngIf="form.get('expiredLicenceNumber')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-6 col-md-12 mt-2">
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
						<div class="col-lg-6 col-md-12 mt-2">
							<button mat-flat-button color="primary" class="large" aria-label="search" (click)="onSearch()">
								<mat-icon>search</mat-icon> Search
							</button>
						</div>

						<div class="mt-4" *ngIf="isAfterSearch">
							<app-alert type="info" icon="check_circle" *ngIf="isFound && isExpired">
								This is a valid expired {{ label }} with an expiry date of
								{{ expiryDate.value | formatDate : constants.date.formalDateFormat }}.
							</app-alert>
							<app-alert type="warning" *ngIf="isFound && !isExpired">
								The {{ label }} is still valid. Please renew it when you get your renewal notice in the mail.
							</app-alert>
							<app-alert type="warning" *ngIf="isFound && !isExpired">
								Your {{ label }} is still valid, and needs to be renewed. Please exit and
								<a
									href="https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing"
									target="_blank"
									>renew your {{ label }}</a
								>.
							</app-alert>
							<app-alert type="danger" icon="error" *ngIf="!isFound">
								This {{ label }} number does not match any existing licences.
							</app-alert>
						</div>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class CommonExpiredLicenceComponent implements OnInit {
	booleanTypeCodes = BooleanTypeCode;
	constants = SPD_CONSTANTS;

	titleLabel = 'Licence';
	label = 'licence';

	matcher = new FormErrorStateMatcher();
	resetRecaptcha: Subject<void> = new Subject<void>();

	isAfterSearch = false;
	isFound = false;
	isExpired = false;

	@Input() form!: FormGroup;
	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;

	constructor(private utilService: UtilService, private licenceService: LicenceService) {}

	ngOnInit() {
		this.isAfterSearch = !!(this.form && this.expiryDate && this.expiryDate.value);
		this.isFound = !!(this.form && this.expiredLicenceId && this.expiredLicenceId.value);
		this.isExpired = this.getIsExpiredDate(this.expiryDate.value);

		// this.label = this.workerLicenceTypeCode ? WorkerLicenceTypeCode.SecurityWorkerLicence // TODO update label
	}

	onSearchKeyDown(searchEvent: any): void {
		const searchString = searchEvent.target.value;
		this.performSearch(searchString);
	}

	onSearch(): void {
		this.performSearch(this.expiredLicenceNumber.value);
	}

	private performSearch(licenceNumber: string) {
		this.form.markAllAsTouched();

		// reset flags
		this.isAfterSearch = false;
		this.isFound = false;
		this.isExpired = false;

		this.form.patchValue({ expiredLicenceId: null, expiryDate: null });

		const recaptchaCode = this.captchaFormGroup.get('token')?.value;

		if (!licenceNumber || licenceNumber.trim().length == 0 || !recaptchaCode) return;

		return this.licenceService
			.apiLicenceLookupAnonymousLicenceNumberPost({ licenceNumber, body: { recaptchaCode } })
			.pipe()
			.subscribe((resp: LicenceResponse) => {
				this.isFound = !!resp?.expiryDate;
				if (resp?.expiryDate) {
					this.isExpired = this.getIsExpiredDate(resp.expiryDate);
					if (this.isExpired) {
						this.form.patchValue({ expiredLicenceId: resp.licenceId, expiryDate: resp.expiryDate });
					}
				}

				if (!this.isFound || !this.isExpired) {
					this.resetRecaptcha.next(); // reset the recaptcha
				}

				this.isAfterSearch = true;
			});
	}

	getIsExpiredDate(expiryDate: string | null): boolean {
		return !expiryDate ? false : !this.utilService.getIsFutureDate(expiryDate);
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
	get captchaFormGroup(): FormGroup {
		return this.form.get('captchaFormGroup') as FormGroup;
	}
}
