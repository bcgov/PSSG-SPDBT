import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, WorkerLicenceResponse, WorkerLicenceTypeCode } from '@api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { take, tap } from 'rxjs';

@Component({
	selector: 'app-step-licence-access-code-anonymous',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Provide your access code"
					info="	<p>
							You need both <strong>your licence number</strong> as it appears on your current licence, plus the <strong>access code number</strong>
							provided following your initial security worker application or in your renewal letter from the Registrar,
							Security Services. Enter the two numbers below then click 'Link' to continue.
						</p>
						<p>
							If you do not know your access code, you may call Security Program's Licensing Unit during regular office
							hours and answer identifying questions to get your access code: {{ spdPhoneNumber }}.
						</p>"
				>
				</app-step-title>

				<div class="row">
					<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<div class="row mt-4">
								<div class="col-xxl-4 col-xl-5 col-lg-5 col-md-12">
									<mat-form-field>
										<mat-label>Current Licence Number</mat-label>
										<input
											matInput
											formControlName="currentLicenceNumber"
											oninput="this.value = this.value.toUpperCase()"
											[errorStateMatcher]="matcher"
											maxlength="10"
										/>
										<mat-error *ngIf="form.get('currentLicenceNumber')?.hasError('required')">
											This is required
										</mat-error>
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
										Licence has been found
									</app-alert>
									<app-alert type="danger" icon="error" *ngIf="!linkedLicenceId.value && !doNotMatch">
										This licence number and access code is not valid
									</app-alert>
									<app-alert type="danger" icon="error" *ngIf="doNotMatch">
										{{ doNotMatchMessage }}
									</app-alert>
								</ng-container>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>

		<div class="row mt-4">
			<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
				<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
			</div>
			<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
				<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext()">Next</button>
			</div>
		</div>
	`,
	styles: [],
})
export class StepLicenceAccessCodeAnonymousComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	isAfterSearch = false;
	doNotMatch = false;
	doNotMatchMessage = '';

	form: FormGroup = this.licenceApplicationService.accessCodeFormGroup;

	constructor(
		private optionsPipe: OptionsPipe,
		private router: Router,
		private licenceApplicationService: LicenceApplicationService
	) {}

	onStepPrevious(): void {
		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
				LicenceApplicationRoutes.LICENCE_APPLICATION_TYPE_ANONYMOUS
			)
		);
	}

	onStepNext(): void {
		console.log('this.form', this.form.value);
		console.log('valid', this.isFormValid());
		if (!this.isFormValid()) {
			return;
		}

		const workerLicenceTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
			'workerLicenceTypeData.workerLicenceTypeCode'
		)?.value;
		const applicationTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
			'applicationTypeData.applicationTypeCode'
		)?.value;

		console.log('workerLicenceTypeCode', workerLicenceTypeCode, 'applicationTypeCode', applicationTypeCode);

		switch (workerLicenceTypeCode) {
			case WorkerLicenceTypeCode.SecurityWorkerLicence: {
				switch (applicationTypeCode) {
					case ApplicationTypeCode.Renewal: {
						this.router.navigateByUrl(
							LicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
								LicenceApplicationRoutes.WORKER_LICENCE_RENEWAL_ANONYMOUS
							)
						);
						break;
					}
					case ApplicationTypeCode.Replacement: {
						this.router.navigateByUrl(
							LicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
								LicenceApplicationRoutes.WORKER_LICENCE_REPLACEMENT_ANONYMOUS
							)
						);
						break;
					}
					case ApplicationTypeCode.Update: {
						this.router.navigateByUrl(
							LicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
								LicenceApplicationRoutes.WORKER_LICENCE_UPDATE_ANONYMOUS
							)
						);
						break;
					}
				}
				break;
			}
			case WorkerLicenceTypeCode.ArmouredVehiclePermit: {
				break;
			}
			case WorkerLicenceTypeCode.BodyArmourPermit: {
				break;
			}
		}
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

		const workerLicenceTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
			'workerLicenceTypeData.workerLicenceTypeCode'
		)?.value;
		const applicationTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
			'applicationTypeData.applicationTypeCode'
		)?.value;

		this.licenceApplicationService
			.loadLicenceWithAccessCode(
				workerLicenceTypeCode,
				applicationTypeCode,
				this.currentLicenceNumber.value,
				this.accessCode.value
			)
			.pipe(
				tap((resp: WorkerLicenceResponse) => {
					if (resp.workerLicenceTypeCode !== workerLicenceTypeCode) {
						const respWorkerLicenceType = this.optionsPipe.transform(resp.workerLicenceTypeCode, 'WorkerLicenceTypes');
						const selWorkerLicenceType = this.optionsPipe.transform(workerLicenceTypeCode, 'WorkerLicenceTypes');

						this.isAfterSearch = true;
						this.doNotMatch = true;
						this.doNotMatchMessage = `A licence has been found with this Licence Number and Access Code, but the licence type for this licence (${respWorkerLicenceType}) does not match what has been selected on the previous screen (${selWorkerLicenceType}).`;
						return;
					}
					this.form.patchValue({
						linkedLicenceId: resp.licenceAppId,
					});
					this.isAfterSearch = true;
				}),
				take(1)
			)
			.subscribe();
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
