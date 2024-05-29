import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LicenceResponse, WorkerLicenceTypeCode } from '@app/api/models';
import { LicenceService } from '@app/api/services';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
import {
	CommonApplicationService,
	LicenceLookupResult,
} from '@app/modules/licence-application/services/common-application.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-common-expired-licence-anonymous',
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
				<div class="col-xxl-8 col-xl-10 col-lg-8 col-md-8 col-sm-12 mx-auto">
					<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

					<div class="row">
						<div class="col-xl-6 col-lg-12 mt-2">
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

						<div class="col-xl-6 col-lg-12 mt-2">
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
export class CommonExpiredLicenceAnonymousComponent implements OnInit {
	booleanTypeCodes = BooleanTypeCode;
	constants = SPD_CONSTANTS;

	titleLabel!: string;
	label!: string;

	messageInfo: string | null = null;
	messageWarn: string | null = null;
	messageError: string | null = null;

	matcher = new FormErrorStateMatcher();
	resetRecaptcha: Subject<void> = new Subject<void>();

	@Input() form!: FormGroup;
	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;

	@Output() validExpiredLicenceData = new EventEmitter();

	constructor(
		private dialog: MatDialog,
		private utilService: UtilService,
		private optionsPipe: OptionsPipe,
		private licenceService: LicenceService,
		private formatDatePipe: FormatDatePipe,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.titleLabel = this.optionsPipe.transform(this.workerLicenceTypeCode, 'WorkerLicenceTypes');
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

		this.form.patchValue({ expiredLicenceId: null, expiredLicenceNumber: null, expiryDate: null });

		const recaptchaCode = this.captchaFormGroup.get('token')?.value;

		if (!licenceNumber || licenceNumber.trim().length == 0 || !recaptchaCode) return;

		this.commonApplicationService
			.getLicenceNumberLookupAnonymous(licenceNumber, recaptchaCode)
			.pipe()
			.subscribe((resp: LicenceLookupResult) => {
				this.messageInfo = null;
				[this.messageWarn, this.messageError] = this.commonApplicationService.setExpiredLicenceLookupMessage(
					resp.searchResult,
					this.workerLicenceTypeCode,
					resp.isExpired,
					resp.isInRenewalPeriod
				);

				if (resp.searchResult && resp.isExpired && !this.messageWarn && !this.messageError) {
					this.handleValidExpiredLicence(resp.searchResult, recaptchaCode);
				}
			});
	}

	private handleValidExpiredLicence(licence: LicenceResponse, recaptchaCode: string): void {
		const name = licence.licenceHolderName;

		const formattedExpiryDate = this.formatDatePipe.transform(licence.expiryDate, SPD_CONSTANTS.date.formalDateFormat);
		this.messageInfo = `This is a valid expired ${this.label} with an expiry date of ${formattedExpiryDate}.`;

		const message = `A valid expired ${this.label} with an expiry date of ${formattedExpiryDate} and with name "${name}" has been found. If this is correct then continue.`;

		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: message,
			actionText: 'Continue',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.form.patchValue({
						expiredLicenceId: licence.licenceId,
						expiredLicenceNumber: licence.licenceNumber,
						expiryDate: licence.expiryDate,
						captchaFormGroup: { token: recaptchaCode },
					});
					this.validExpiredLicenceData.emit();
				}
			});
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
