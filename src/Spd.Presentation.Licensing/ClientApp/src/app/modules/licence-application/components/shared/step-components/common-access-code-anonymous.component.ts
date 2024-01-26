import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, LicenceResponse, LicenceTermCode, WorkerLicenceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';
import { take, tap } from 'rxjs';

@Component({
	selector: 'app-common-access-code-anonymous',
	template: `
		<div class="row">
			<div class="col-xl-8 col-lg-8 col-md-8 col-sm-12 mx-auto">
				<form [formGroup]="form" novalidate>
					<div class="row my-4">
						<div class="col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Current {{ licenceNumberName }} Number</mat-label>
								<input
									matInput
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
									formControlName="accessCode"
									oninput="this.value = this.value.toUpperCase()"
									[errorStateMatcher]="matcher"
									maxlength="10"
								/>
								<mat-error *ngIf="form.get('accessCode')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
						<div class="col-12">
							<div class="mt-2 mb-3" formGroupName="captchaFormGroup">
								<app-captcha-v2 [captchaFormGroup]="captchaFormGroup"></app-captcha-v2>
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

					<app-alert type="danger" icon="error" *ngIf="errorMessage">
						{{ errorMessage }}
					</app-alert>

					<ng-container *ngIf="isExpired">
						<a class="w-auto" tabindex="0" (click)="onCreateNewLicence()" (keydown)="onKeydownCreateNewLicence($event)">
							Apply for a new Licence
						</a>
					</ng-container>
				</form>
			</div>
		</div>
	`,
	styles: [],
})
export class CommonAccessCodeAnonymousComponent implements OnInit {
	matcher = new FormErrorStateMatcher();
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;
	licenceApplicationRoutes = LicenceApplicationRoutes;

	errorMessage: string | null = null;
	isExpired = false;

	licenceNumberName = '';

	@Input() form!: FormGroup;
	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@Output() linkPerformed = new EventEmitter();

	constructor(
		private router: Router,
		private optionsPipe: OptionsPipe,
		private hotToastService: HotToastService,
		private licenceApplicationService: LicenceApplicationService,
		private permitApplicationService: PermitApplicationService
	) {}

	ngOnInit(): void {
		this.licenceNumberName =
			this.workerLicenceTypeCode === WorkerLicenceTypeCode.SecurityWorkerLicence ? 'Licence' : 'Permit';
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
					.getLicenceWithAccessCode(licenceNumber, accessCode, recaptchaCode)
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
					.getPermitWithAccessCode(licenceNumber, accessCode, recaptchaCode)
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

		this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous());
	}

	onKeydownCreateNewLicence(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onCreateNewLicence();
	}

	private handleLookupResponse(resp: LicenceResponse): void {
		const replacementPeriodPreventionDays = SPD_CONSTANTS.periods.replacementPeriodPreventionDays;
		const updatePeriodPreventionDays = SPD_CONSTANTS.periods.updatePeriodPreventionDays;

		const daysBetween = moment(resp.expiryDate).startOf('day').diff(moment().startOf('day'), 'days');

		// Ability to submit Renewals only if current licence term is 1,2,3 or 5 years and expiry date is in 90 days or less.
		// Ability to submit Renewals only if current licence term is 90 days and expiry date is in 60 days or less.
		let renewPeriodDays = SPD_CONSTANTS.periods.renewPeriodDays;
		if (resp.licenceTermCode === LicenceTermCode.NinetyDays) {
			renewPeriodDays = SPD_CONSTANTS.periods.renewPeriodDaysNinetyDayTerm;
		}

		if (!resp) {
			// access code / licence are not found
			this.errorMessage = `This ${this.licenceNumberName} number and access code are not a valid combination.`;
		} else if (resp.workerLicenceTypeCode !== this.workerLicenceTypeCode) {
			//  access code matches licence, but the WorkerLicenceType does not match
			const selWorkerLicenceTypeDesc = this.optionsPipe.transform(this.workerLicenceTypeCode, 'WorkerLicenceTypes');
			this.errorMessage = `This licence is not a ${selWorkerLicenceTypeDesc}.`;
		} else if (moment().isAfter(resp.expiryDate)) {
			// access code matches licence, but the licence is expired
			this.isExpired = true;
			if (this.applicationTypeCode === ApplicationTypeCode.Renewal) {
				this.errorMessage = 'This licence has expired so you can no longer renew it. Please apply for a new licence.';
			} else if (this.applicationTypeCode === ApplicationTypeCode.Update) {
				this.errorMessage = 'This licence has expired so you cannot update it. Please apply for a new licence.';
			} else {
				this.errorMessage = 'This licence has expired so you cannot replace it. Please apply for a new licence.';
			}
		} else if (
			this.applicationTypeCode === ApplicationTypeCode.Replacement &&
			daysBetween <= replacementPeriodPreventionDays
		) {
			// access code matches licence, but the licence is not within the replacement period
			this.errorMessage = 'This licence is too close to its expiry date to allow replacement.';
		} else if (this.applicationTypeCode === ApplicationTypeCode.Update && daysBetween <= updatePeriodPreventionDays) {
			// access code matches licence, but the licence is not within the update period
			this.errorMessage = 'This licence is too close to its expiry date to allow update.';
		} else if (this.applicationTypeCode === ApplicationTypeCode.Renewal && daysBetween > renewPeriodDays) {
			//  Renewal-specific error: access code matches licence, but the licence is not within the expiry period
			this.errorMessage = `This licence is still valid. Please renew it when it is within ${renewPeriodDays} days of the expiry date.`;
		} else {
			this.form.patchValue({
				licenceNumber: resp.licenceNumber,
				linkedLicenceId: resp.licenceId,
				linkedLicenceAppId: resp.licenceAppId,
				linkedExpiryDate: resp.expiryDate,
			});
			this.linkPerformed.emit();

			const workerLicenceTypeDesc = this.optionsPipe.transform(this.workerLicenceTypeCode, 'WorkerLicenceTypes');
			this.hotToastService.success(`The ${workerLicenceTypeDesc} has been found.`);
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
