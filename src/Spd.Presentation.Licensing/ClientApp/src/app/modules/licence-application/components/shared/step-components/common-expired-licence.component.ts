import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceResponse, LicenceTermCode, WorkerLicenceTypeCode } from '@app/api/models';
import { LicenceService } from '@app/api/services';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';
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

	titleLabel!: string;
	label!: string;

	messageInfo = '';
	messageWarn = '';
	messageError = '';

	matcher = new FormErrorStateMatcher();
	resetRecaptcha: Subject<void> = new Subject<void>();

	@Input() form!: FormGroup;
	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;

	@Output() validExpiredLicenceData = new EventEmitter();

	constructor(
		private utilService: UtilService,
		private optionsPipe: OptionsPipe,
		private licenceService: LicenceService,
		private formatDatePipe: FormatDatePipe,
		private hotToastService: HotToastService
	) {}

	ngOnInit(): void {
		this.titleLabel = this.workerLicenceTypeCode === WorkerLicenceTypeCode.SecurityWorkerLicence ? 'Licence' : 'Permit';
		this.label = this.titleLabel.toLowerCase();
	}

	onValidateAndSearch(): void {
		if (this.hasExpiredLicence.value === BooleanTypeCode.No) {
			this.validExpiredLicenceData.emit();
			return;
		}

		this.performSearch(this.expiredLicenceNumber.value);
	}

	private performSearch(licenceNumber: string) {
		this.form.markAllAsTouched();

		this.form.patchValue({ expiredLicenceId: null, expiryDate: null });

		const recaptchaCode = this.captchaFormGroup.get('token')?.value;

		if (!licenceNumber || licenceNumber.trim().length == 0 || !recaptchaCode) return;

		return this.licenceService
			.apiLicenceLookupAnonymousLicenceNumberPost({ licenceNumber, body: { recaptchaCode } })
			.pipe()
			.subscribe((resp: LicenceResponse) => {
				const isFound = !!(resp && resp?.expiryDate);
				const isExpired = isFound ? !this.utilService.getIsTodayOrFutureDate(resp?.expiryDate) : false;
				const isInRenewalPeriod = isExpired ? false : this.getIsInRenewalPeriod(resp?.expiryDate, resp.licenceTermCode);

				this.handleLookupResult(resp.workerLicenceTypeCode!, isFound, isExpired, isInRenewalPeriod, resp?.expiryDate);
			});
	}

	private handleLookupResult(
		workerLicenceTypeCode: WorkerLicenceTypeCode,
		isFound: boolean,
		isExpired: boolean,
		isInRenewalPeriod: boolean,
		expiryDate: string | undefined
	): void {
		this.messageInfo = '';
		this.messageWarn = '';
		this.messageError = '';

		if (isFound) {
			if (workerLicenceTypeCode !== this.workerLicenceTypeCode) {
				//   WorkerLicenceType does not match
				const selWorkerLicenceTypeDesc = this.optionsPipe.transform(this.workerLicenceTypeCode, 'WorkerLicenceTypes');
				this.messageError = `This ${this.label} is not a ${selWorkerLicenceTypeDesc}.`;
			} else {
				if (isExpired) {
					const formattedExpiryDate = this.formatDatePipe.transform(expiryDate, SPD_CONSTANTS.date.formalDateFormat);
					this.messageInfo = `This is a valid expired ${this.label} with an expiry date of ${formattedExpiryDate}.`;

					const message = `A valid expired ${this.label} with an expiry date of ${formattedExpiryDate} has been found.`;
					this.hotToastService.success(message);
					this.validExpiredLicenceData.emit();
					return;
				} else {
					if (isInRenewalPeriod) {
						this.messageWarn = `Your ${this.label} is still valid, and needs to be renewed. Please exit and <a href="https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing" target="_blank">renew your ${this.label}</a>.`;
					} else {
						this.messageWarn = `This ${this.label} is still valid. Please renew it when you get your renewal notice in the mail.`;
					}
				}
			}
		} else {
			this.messageError = `This ${this.label} number does not match any existing ${this.label}s.`;
		}

		this.resetRecaptcha.next();
	}

	private getIsInRenewalPeriod(
		expiryDate: string | null | undefined,
		licenceTermCode: LicenceTermCode | undefined
	): boolean {
		if (!expiryDate || !licenceTermCode) {
			return false;
		}

		const daysBetween = moment(expiryDate).startOf('day').diff(moment().startOf('day'), 'days');

		// Ability to submit Renewals only if current licence term is 1,2,3 or 5 years and expiry date is in 90 days or less.
		// Ability to submit Renewals only if current licence term is 90 days and expiry date is in 60 days or less.
		let renewPeriodDays = SPD_CONSTANTS.periods.renewPeriodDays;
		if (licenceTermCode === LicenceTermCode.NinetyDays) {
			renewPeriodDays = SPD_CONSTANTS.periods.renewPeriodDaysNinetyDayTerm;
		}

		return daysBetween > renewPeriodDays ? false : true;
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
