import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, LicenceLookupResponse, WorkerLicenceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { take, tap } from 'rxjs';

@Component({
	selector: 'app-common-access-code-anonymous',
	template: `
		<div class="row">
			<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12 mx-auto">
				<form [formGroup]="form" novalidate>
					<div class="row mt-4">
						<div class="col-xxl-4 col-xl-5 col-lg-5 col-md-12">
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
						<div class="col-xxl-4 col-xl-4 col-lg-4 col-md-12">
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
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
							<button mat-flat-button color="primary" class="large mt-2" (click)="onLink()">
								<mat-icon>link</mat-icon>Link
							</button>
						</div>

						<app-alert type="info" icon="check_circle" *ngIf="linkedLicenceId.value">
							{{ workerLicenceTypeCode | options : 'WorkerLicenceTypes' }} has been found
						</app-alert>
						<app-alert type="danger" icon="error" *ngIf="errorMessage">
							{{ errorMessage }}
						</app-alert>
						<ng-container *ngIf="isExpired">
							<a
								class="w-auto"
								tabindex="0"
								(click)="onCreateNewLicence()"
								(keydown)="onKeydownCreateNewLicence($event)"
							>
								Apply for a new Licence
							</a>
						</ng-container>

						<div class="col-12 my-3" formGroupName="captchaFormGroup">
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

	constructor(
		private router: Router,
		private licenceApplicationService: LicenceApplicationService,
		private permitApplicationService: PermitApplicationService
	) {}

	ngOnInit(): void {
		this.licenceNumberName =
			this.workerLicenceTypeCode === WorkerLicenceTypeCode.SecurityWorkerLicence ? 'Licence' : 'Permit';
	}

	onLink(): void {
		this.isExpired = false;
		this.errorMessage = null;

		this.form.patchValue({
			linkedLicenceId: null,
			licenceExpiryDate: null,
		});

		this.form.markAllAsTouched();

		let licenceNumber = this.licenceNumber.value;
		let accessCode = this.accessCode.value;

		if (!licenceNumber || !accessCode) {
			return;
		}

		licenceNumber = 'TEST-04'; // TODO remove hardcoded value
		accessCode = 'XJORTDVEU4'; // TODO remove hardcoded value

		switch (this.workerLicenceTypeCode) {
			case WorkerLicenceTypeCode.SecurityWorkerLicence: {
				this.licenceApplicationService
					.getLicenceWithAccessCode(licenceNumber, accessCode)
					.pipe(
						tap((resp: LicenceLookupResponse) => {
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
					.getPermitWithAccessCode(licenceNumber, accessCode)
					.pipe(
						tap((resp: LicenceLookupResponse) => {
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

	private handleLookupResponse(resp: LicenceLookupResponse): void {
		// const replacementPeriodPreventionDays = SPD_CONSTANTS.periods.replacementPeriodPreventionDays;
		// const updatePeriodPreventionDays = SPD_CONSTANTS.periods.updatePeriodPreventionDays;
		// const renewPeriodDays = SPD_CONSTANTS.periods.renewPeriodDays;

		if (!resp) {
			// access code / licence are not found
			this.errorMessage = `This ${this.licenceNumberName} number and access code are not a valid combination.`;
			// } else if (resp.workerLicenceTypeCode !== this.workerLicenceTypeCode) {
			// 	//  access code matches licence, but the WorkerLicenceType does not match
			// 	const selWorkerLicenceTypeDesc = this.optionsPipe.transform(this.workerLicenceTypeCode, 'WorkerLicenceTypes');
			// 	this.errorMessage = `This licence is not a ${selWorkerLicenceTypeDesc}.`;
			// } else if (moment().isAfter(resp.expiryDate)) {
			// 	// access code matches licence, but the licence is expired
			// 	this.isExpired = true;
			// 	if (this.applicationTypeCode === ApplicationTypeCode.Renewal) {
			// 		this.errorMessage = 'This licence has expired so you can no longer renew it. Please apply for a new licence.';
			// 	} else if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			// 		this.errorMessage = 'This licence has expired so you cannot update it. Please apply for a new licence.';
			// 	} else {
			// 		this.errorMessage = 'This licence has expired so you cannot replace it. Please apply for a new licence.';
			// 	}
			// } else if (
			// 	this.applicationTypeCode === ApplicationTypeCode.Replacement &&
			// 	moment().isSameOrBefore(resp.expiryDate) &&
			// 	moment(resp.expiryDate).diff(moment(), 'days') <= replacementPeriodPreventionDays
			// ) {
			// 	// access code matches licence, but the licence is not within the replacement period
			// 	this.errorMessage = 'This licence is too close to its expiry date to allow replacement.';
			// } else if (
			// 	this.applicationTypeCode === ApplicationTypeCode.Update &&
			// 	moment().isSameOrBefore(resp.expiryDate) &&
			// 	moment(resp.expiryDate).diff(moment(), 'days') <= updatePeriodPreventionDays
			// ) {
			// 	// access code matches licence, but the licence is not within the update period
			// 	this.errorMessage = 'This licence is too close to its expiry date to allow update.';
			// } else if (
			// 	this.applicationTypeCode === ApplicationTypeCode.Renewal &&
			// 	moment().diff(resp.expiryDate, 'days') <= renewPeriodDays
			// ) {
			// 	//  Renewal-specific error: access code matches licence, but the licence is not within the expiry period
			// 	this.errorMessage = `This licence is still valid. Please renew it when it is within ${renewPeriodDays} days of the expiry date.`;
		} else {
			this.form.patchValue({
				linkedLicenceId: resp.licenceAppId,
				licenceExpiryDate: resp.expiryDate,
			});
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
