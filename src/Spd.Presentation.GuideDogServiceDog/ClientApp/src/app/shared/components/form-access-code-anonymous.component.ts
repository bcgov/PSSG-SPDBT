import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
	ApplicationTypeCode,
	LicenceResponse,
	LicenceStatusCode,
	LicenceTermCode,
	ServiceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService, LicenceResponseExt } from '@app/core/services/common-application.service';
import { UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import moment from 'moment';
import { Subject, take, tap } from 'rxjs';

@Component({
	selector: 'app-form-access-code-anonymous',
	template: `
		<div class="row">
			<div class="col-xl-8 col-lg-8 col-md-8 col-sm-12 mx-auto">
				<form [formGroup]="form" novalidate>
					<div class="row mt-4">
						<div class="col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Current Certificate Number</mat-label>
								<input
									matInput
									type="search"
									formControlName="licenceNumber"
									[errorStateMatcher]="matcher"
									maxlength="10"
									appInputUpperCaseTransform
								/>
								@if (form.get('licenceNumber')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
							</mat-form-field>
						</div>
						<div class="col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Access Code</mat-label>
								<input
									matInput
									type="search"
									formControlName="accessCode"
									[errorStateMatcher]="matcher"
									maxlength="10"
									appInputUpperCaseTransform
								/>
								@if (form.get('accessCode')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
							</mat-form-field>
						</div>
						<div class="col-12">
							<div class="mt-2" formGroupName="captchaFormGroup">
								<app-captcha-v2 [captchaFormGroup]="captchaFormGroup" [resetControl]="resetRecaptcha"></app-captcha-v2>
								@if (
									(captchaFormGroup.get('token')?.dirty || captchaFormGroup.get('token')?.touched) &&
									captchaFormGroup.get('token')?.invalid &&
									captchaFormGroup.get('token')?.hasError('required')
								) {
									<mat-error>Click this button to verify that you are not a robot</mat-error>
								}
							</div>
						</div>
					</div>

					@if (errorMessage) {
						<div class="mt-3">
							<app-alert type="danger" icon="dangerous">
								{{ errorMessage }}
							</app-alert>
						</div>
					}
				</form>
			</div>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class FormAccessCodeAnonymousComponent implements OnInit {
	matcher = new FormErrorStateMatcher();

	resetRecaptcha: Subject<void> = new Subject<void>();
	errorMessage: string | null = null;
	isExpired = false;

	label = '';

	@Input() form!: FormGroup;
	@Input() serviceTypeCode!: ServiceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@Output() linkSuccess = new EventEmitter<LicenceResponse>();

	constructor(
		private optionsPipe: OptionsPipe,
		private utilService: UtilService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		const titleLabel = this.optionsPipe.transform(this.serviceTypeCode, 'ServiceTypes');
		this.label = titleLabel.toLowerCase();
	}

	searchByAccessCode(): void {
		this.isExpired = false;
		this.errorMessage = null;

		this.form.patchValue({
			linkedLicenceId: null,
			linkedLicenceAppId: null,
			licenceExpiryDate: null,
		});

		this.form.markAllAsTouched();

		const licenceNumber = this.licenceNumber.value;
		const accessCode = this.accessCode.value;
		const recaptchaCode = this.captchaFormGroup.get('token')?.value;

		if (!licenceNumber || !accessCode || !recaptchaCode) {
			return;
		}

		switch (this.serviceTypeCode) {
			case ServiceTypeCode.GdsdTeamCertification:
			case ServiceTypeCode.DogTrainerCertification:
			case ServiceTypeCode.RetiredServiceDogCertification: {
				this.commonApplicationService
					.getGDSDLicenceWithAccessCodeAnonymous(licenceNumber, accessCode, recaptchaCode)
					.pipe(
						tap((resp: LicenceResponseExt | null) => {
							this.handleLookupResponse(resp);
						}),
						take(1)
					)
					.subscribe();
				break;
			}
		}
	}

	private handleLookupResponse(resp: LicenceResponseExt | null): void {
		if (!resp) {
			// access code / licence are not found
			this.invalidCombination();
			return;
		}

		const replacementPeriodPreventionDays = SPD_CONSTANTS.periods.licenceReplacementPeriodPreventionDays;

		const today = moment().startOf('day');
		const expiryDate = moment(resp.expiryDate).startOf('day');
		const daysBetween = expiryDate.diff(today, 'days');

		// Ability to submit Renewals only if current licence term is 1,2,3 or 5 years and expiry date is in 90 days or less.
		// Ability to submit Renewals only if current licence term is 90 days and expiry date is in 60 days or less.
		let renewPeriodDays = SPD_CONSTANTS.periods.licenceRenewPeriodDays;
		if (resp.licenceTermCode === LicenceTermCode.NinetyDays) {
			renewPeriodDays = SPD_CONSTANTS.periods.licenceRenewPeriodDaysNinetyDayTerm;
		}

		if (resp.serviceTypeCode !== this.serviceTypeCode) {
			//  access code matches licence, but the ServiceTypeCode does not match
			const selServiceTypeCodeDesc = this.optionsPipe.transform(this.serviceTypeCode, 'ServiceTypes');
			this.errorMessage = `This certificate number is not a ${selServiceTypeCodeDesc}.`;
		} else if (!this.utilService.isLicenceActive(resp.licenceStatusCode)) {
			if (resp.licenceStatusCode === LicenceStatusCode.Expired) {
				// access code matches licence, but the licence is expired
				this.isExpired = true;
				if (this.applicationTypeCode === ApplicationTypeCode.Renewal) {
					this.errorMessage = `This certificate has expired so you can no longer renew it. Please apply for a new ${this.label}.`;
				} else {
					this.errorMessage = `This certificate has expired so you cannot replace it. Please apply for a new ${this.label}.`;
				}
			} else {
				this.invalidCombination();
				return;
			}
		} else if (
			this.applicationTypeCode === ApplicationTypeCode.Replacement &&
			daysBetween <= replacementPeriodPreventionDays
		) {
			// Replacement-specific error: access code matches licence, but the licence is not within the replacement period
			this.errorMessage = `This certificate is too close to its expiry date to allow replacement. Please renew it instead.`;
		} else if (this.applicationTypeCode === ApplicationTypeCode.Renewal && daysBetween > renewPeriodDays) {
			//  Renewal-specific error: access code matches licence, but the licence is not within the expiry period
			this.errorMessage = `This certificate is still valid. Please renew it when it is within ${renewPeriodDays} days of the expiry date.`;
		} else {
			//  access code matches licence, but the licence has application in progress
			if (resp.inProgressApplications) {
				const selServiceTypeCodeDesc = this.optionsPipe.transform(resp.serviceTypeCode, 'ServiceTypes');
				this.errorMessage = `This ${selServiceTypeCodeDesc} cannot be renewed or replaced while an application is in progress.`;
				this.resetCaptcha();
				return;
			}

			this.form.patchValue({
				licenceNumber: resp.licenceNumber,
				linkedLicenceTermCode: resp.licenceTermCode,
				linkedLicenceId: resp.licenceId,
				linkedLicenceAppId: resp.licenceAppId,
				linkedExpiryDate: resp.expiryDate,
				linkedCardHolderName: resp.nameOnCard,
				linkedLicenceHolderId: resp.licenceHolderId,
				linkedLicenceHolderName: resp.licenceHolderName,
			});
			this.linkSuccess.emit(resp);
		}

		if (this.errorMessage) {
			this.resetCaptcha();
		}
	}

	private invalidCombination(): void {
		this.errorMessage = `This certificate number and access code are not a valid combination.`;
		this.resetCaptcha();
	}

	private resetCaptcha(): void {
		this.resetRecaptcha.next(); // reset the recaptcha
		this.captchaFormGroup.reset();
	}

	get licenceNumber(): FormControl {
		return this.form.get('licenceNumber') as FormControl;
	}
	get accessCode(): FormControl {
		return this.form.get('accessCode') as FormControl;
	}
	get linkedLicenceId(): FormControl {
		return this.form.get('linkedLicenceId') as FormControl;
	}
	get captchaFormGroup(): FormGroup {
		return this.form.get('captchaFormGroup') as FormGroup;
	}
}
