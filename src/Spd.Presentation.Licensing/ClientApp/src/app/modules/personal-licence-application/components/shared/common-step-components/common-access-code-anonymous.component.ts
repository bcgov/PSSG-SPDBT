import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
	ApplicationTypeCode,
	LicenceResponse,
	LicenceStatusCode,
	LicenceTermCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceApplicationService } from '@app/modules/personal-licence-application/licence-application.service';
import { PermitApplicationService } from '@app/modules/personal-licence-application/permit-application.service';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routing.module';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';
import { Subject, take, tap } from 'rxjs';

@Component({
	selector: 'app-common-access-code-anonymous',
	template: `
		<div class="row">
			<div class="col-xl-8 col-lg-8 col-md-8 col-sm-12 mx-auto">
				<form [formGroup]="form" novalidate>
					<div class="row mt-4">
						<div class="col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Current {{ titleLabel }} Number</mat-label>
								<input
									matInput
									type="search"
									formControlName="licenceNumber"
									oninput="this.value = this.value.toUpperCase()"
									[errorStateMatcher]="matcher"
									maxlength="10"
								/>
								<mat-error *ngIf="form.get('licenceNumber')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Access Code</mat-label>
								<input
									matInput
									type="search"
									formControlName="accessCode"
									oninput="this.value = this.value.toUpperCase()"
									[errorStateMatcher]="matcher"
									maxlength="10"
								/>
								<mat-error *ngIf="form.get('accessCode')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
						<div class="col-12">
							<div class="mt-2" formGroupName="captchaFormGroup">
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

					<div class="mt-3" *ngIf="errorMessage">
						<app-alert type="danger" icon="error">
							{{ errorMessage }}
						</app-alert>
					</div>

					<div class="mt-3" *ngIf="isExpired">
						<a class="w-auto" tabindex="0" (click)="onCreateNewLicence()" (keydown)="onKeydownCreateNewLicence($event)">
							Apply for a New Licence
						</a>
					</div>
				</form>
			</div>
		</div>
	`,
	styles: [],
})
export class CommonAccessCodeAnonymousComponent implements OnInit {
	matcher = new FormErrorStateMatcher();
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;
	licenceApplicationRoutes = PersonalLicenceApplicationRoutes;

	resetRecaptcha: Subject<void> = new Subject<void>();
	errorMessage: string | null = null;
	isExpired = false;

	titleLabel = '';
	label = '';

	@Input() form!: FormGroup;
	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@Output() linkSuccess = new EventEmitter<LicenceResponse>();

	constructor(
		private router: Router,
		private optionsPipe: OptionsPipe,
		private hotToastService: HotToastService,
		private licenceApplicationService: LicenceApplicationService,
		private permitApplicationService: PermitApplicationService
	) {}

	ngOnInit(): void {
		this.titleLabel = this.workerLicenceTypeCode === WorkerLicenceTypeCode.SecurityWorkerLicence ? 'Licence' : 'Permit';
		this.label = this.titleLabel.toLowerCase();
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

		switch (this.workerLicenceTypeCode) {
			case WorkerLicenceTypeCode.SecurityWorkerLicence: {
				this.licenceApplicationService
					.getLicenceWithAccessCodeAnonymous(licenceNumber, accessCode, recaptchaCode)
					.pipe(
						tap((resp: LicenceResponse) => {
							this.handleLookupResponse(resp);
						}),
						take(1)
					)
					.subscribe();
				break;
			}
			case WorkerLicenceTypeCode.ArmouredVehiclePermit:
			case WorkerLicenceTypeCode.BodyArmourPermit: {
				this.permitApplicationService
					.getPermitWithAccessCodeAnonymous(licenceNumber, accessCode, recaptchaCode)
					.pipe(
						tap((resp: LicenceResponse) => {
							this.handleLookupResponse(resp);
						}),
						take(1)
					)
					.subscribe();
				break;
			}
		}
	}

	onCreateNewLicence(): void {
		this.form.reset();

		this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous());
	}

	onKeydownCreateNewLicence(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onCreateNewLicence();
	}

	private handleLookupResponse(resp: LicenceResponse): void {
		if (!resp) {
			// access code / licence are not found
			this.errorMessage = `This ${this.label} number and access code are not a valid combination.`;
			this.resetRecaptcha.next(); // reset the recaptcha
			return;
		}

		const replacementPeriodPreventionDays = SPD_CONSTANTS.periods.licenceReplacementPeriodPreventionDays;
		const updatePeriodPreventionDays = SPD_CONSTANTS.periods.licenceUpdatePeriodPreventionDays;

		const today = moment().startOf('day');
		const expiryDate = moment(resp.expiryDate).startOf('day');
		const daysBetween = expiryDate.diff(today, 'days');

		// Ability to submit Renewals only if current licence term is 1,2,3 or 5 years and expiry date is in 90 days or less.
		// Ability to submit Renewals only if current licence term is 90 days and expiry date is in 60 days or less.
		let renewPeriodDays = SPD_CONSTANTS.periods.licenceRenewPeriodDays;
		if (resp.licenceTermCode === LicenceTermCode.NinetyDays) {
			renewPeriodDays = SPD_CONSTANTS.periods.licenceRenewPeriodDaysNinetyDayTerm;
		}

		if (resp.workerLicenceTypeCode !== this.workerLicenceTypeCode) {
			//  access code matches licence, but the WorkerLicenceType does not match
			const selWorkerLicenceTypeDesc = this.optionsPipe.transform(this.workerLicenceTypeCode, 'WorkerLicenceTypes');
			this.errorMessage = `This licence number is not a ${selWorkerLicenceTypeDesc}.`;
		} else if (resp.licenceStatusCode != LicenceStatusCode.Active) {
			// access code matches licence, but the licence is expired
			this.isExpired = true;
			if (this.applicationTypeCode === ApplicationTypeCode.Renewal) {
				this.errorMessage = `This ${this.label} has expired so you can no longer renew it. Please apply for a new ${this.label}.`;
			} else if (this.applicationTypeCode === ApplicationTypeCode.Update) {
				this.errorMessage = `This ${this.label} has expired so you cannot update it. Please apply for a new ${this.label}.`;
			} else {
				this.errorMessage = `This ${this.label} has expired so you cannot replace it. Please apply for a new ${this.label}.`;
			}
		} else if (
			this.applicationTypeCode === ApplicationTypeCode.Replacement &&
			daysBetween <= replacementPeriodPreventionDays
		) {
			// access code matches licence, but the licence is not within the replacement period
			this.errorMessage = `This ${this.label} is too close to its expiry date to allow replacement. Please renew it instead.`;
		} else if (this.applicationTypeCode === ApplicationTypeCode.Update && daysBetween <= updatePeriodPreventionDays) {
			// access code matches licence, but the licence is not within the update period
			this.errorMessage = `This ${this.label} is too close to its expiry date to allow update. Please renew it instead.`;
		} else if (this.applicationTypeCode === ApplicationTypeCode.Renewal && daysBetween > renewPeriodDays) {
			//  Renewal-specific error: access code matches licence, but the licence is not within the expiry period
			this.errorMessage = `This ${this.label} is still valid. Please renew it when it is within ${renewPeriodDays} days of the expiry date.`;
		} else {
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

			const workerLicenceTypeDesc = this.optionsPipe.transform(this.workerLicenceTypeCode, 'WorkerLicenceTypes');
			this.hotToastService.success(`The ${workerLicenceTypeDesc} has been found.`);
		}

		if (this.errorMessage) {
			this.resetRecaptcha.next(); // reset the recaptcha
		}
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
