import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, WorkerLicenceResponse, WorkerLicenceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
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
									formControlName="currentLicenceNumber"
									oninput="this.value = this.value.toUpperCase()"
									[errorStateMatcher]="matcher"
									maxlength="10"
								/>
								<mat-error *ngIf="form.get('currentLicenceNumber')?.hasError('required')"> This is required </mat-error>
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
								/>
								<mat-error *ngIf="form.get('accessCode')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
							<button mat-flat-button color="primary" class="large mt-2" (click)="onLink()">
								<mat-icon>link</mat-icon>Link
							</button>
							<!-- <mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('linkedLicenceId')?.dirty || form.get('linkedLicenceId')?.touched) &&
												form.get('linkedLicenceId')?.invalid &&
												form.get('linkedLicenceId')?.hasError('required')
											"
											>This must link to a valid licence</mat-error
										> -->
						</div>

						<ng-container *ngIf="isAfterSearch">
							<app-alert type="info" icon="check_circle" *ngIf="linkedLicenceId.value">
								{{ workerLicenceTypeCode | options : 'WorkerLicenceTypes' }} has been found
							</app-alert>
							<app-alert type="danger" icon="error" *ngIf="!linkedLicenceId.value && !doNotMatch">
								This {{ licenceNumberName }} number and access code is not valid
							</app-alert>
							<app-alert type="danger" icon="error" *ngIf="doNotMatch">
								{{ doNotMatchMessage }}
							</app-alert>
						</ng-container>
					</div>
				</form>
			</div>
		</div>
	`,
	styles: [],
})
export class CommonAccessCodeAnonymousComponent implements OnInit, LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	isAfterSearch = false;
	doNotMatch = false;
	doNotMatchMessage = '';

	licenceNumberName = '';

	@Input() form!: FormGroup;
	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(
		private licenceApplicationService: LicenceApplicationService,
		private permitApplicationService: PermitApplicationService
	) {}

	ngOnInit(): void {
		this.licenceNumberName =
			this.workerLicenceTypeCode === WorkerLicenceTypeCode.SecurityWorkerLicence ? 'Licence' : 'Permit';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onLink(): void {
		this.isAfterSearch = false;
		this.doNotMatch = false;

		this.form.markAllAsTouched();

		if (!this.currentLicenceNumber.value || !this.accessCode.value) {
			return;
		}

		switch (this.workerLicenceTypeCode) {
			case WorkerLicenceTypeCode.SecurityWorkerLicence: {
				this.licenceApplicationService
					.loadLicenceWithAccessCode(
						this.workerLicenceTypeCode,
						this.applicationTypeCode,
						this.currentLicenceNumber.value,
						this.accessCode.value
					)
					.pipe(
						tap((resp: WorkerLicenceResponse) => {
							// if (resp.workerLicenceTypeCode !== workerLicenceTypeCode) {
							// 	const respWorkerLicenceType = this.optionsPipe.transform(resp.workerLicenceTypeCode, 'WorkerLicenceTypes');
							// 	const selWorkerLicenceType = this.optionsPipe.transform(workerLicenceTypeCode, 'WorkerLicenceTypes');

							// 	this.isAfterSearch = true;
							// 	this.doNotMatch = true;
							// 	this.doNotMatchMessage = `A licence has been found with this Licence Number and Access Code, but the licence type for this licence (${respWorkerLicenceType}) does not match what has been selected on the previous screen (${selWorkerLicenceType}).`;
							// 	return;
							// }
							this.form.patchValue({
								linkedLicenceId: resp.licenceAppId,
							});
							this.isAfterSearch = true;
						}),
						take(1)
					)
					.subscribe();
				break;
			}
			case WorkerLicenceTypeCode.ArmouredVehiclePermit:
			case WorkerLicenceTypeCode.BodyArmourPermit: {
				this.permitApplicationService
					.loadPermitWithAccessCode(
						this.workerLicenceTypeCode,
						this.applicationTypeCode,
						this.currentLicenceNumber.value,
						this.accessCode.value
					)
					.pipe(
						tap((resp: WorkerLicenceResponse) => {
							// if (resp.workerLicenceTypeCode !== workerLicenceTypeCode) {
							// 	const respWorkerLicenceType = this.optionsPipe.transform(resp.workerLicenceTypeCode, 'WorkerLicenceTypes');
							// 	const selWorkerLicenceType = this.optionsPipe.transform(workerLicenceTypeCode, 'WorkerLicenceTypes');

							// 	this.isAfterSearch = true;
							// 	this.doNotMatch = true;
							// 	this.doNotMatchMessage = `A licence has been found with this Licence Number and Access Code, but the licence type for this licence (${respWorkerLicenceType}) does not match what has been selected on the previous screen (${selWorkerLicenceType}).`;
							// 	return;
							// }
							this.form.patchValue({
								linkedLicenceId: resp.licenceAppId,
							});
							this.isAfterSearch = true;
						}),
						take(1)
					)
					.subscribe();
				break;
			}
		}
	}

	get currentLicenceNumber(): FormControl {
		return this.form.get('currentLicenceNumber') as FormControl;
	}
	get accessCode(): FormControl {
		return this.form.get('accessCode') as FormControl;
	}
	get linkedLicenceId(): FormControl {
		return this.form.get('linkedLicenceId') as FormControl;
	}
}
