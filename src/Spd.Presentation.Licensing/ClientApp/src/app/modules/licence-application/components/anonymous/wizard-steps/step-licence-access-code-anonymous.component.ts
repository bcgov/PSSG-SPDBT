import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
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
				<div class="step-container">
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
											<input matInput formControlName="accessCode" [errorStateMatcher]="matcher" />
											<mat-error *ngIf="form.get('accessCode')?.hasError('required')"> This is required </mat-error>
										</mat-form-field>
									</div>
									<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
										<button mat-flat-button color="primary" class="large mt-2" (click)="onLink()">
											<mat-icon>link</mat-icon>Link
										</button>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('linkedLicenceId')?.dirty || form.get('linkedLicenceId')?.touched) &&
												form.get('linkedLicenceId')?.invalid &&
												form.get('linkedLicenceId')?.hasError('required')
											"
											>This must link to a valid licence</mat-error
										>
									</div>
								</div>
							</form>
						</div>
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

	form: FormGroup = this.licenceApplicationService.accessCodeFormGroup;

	constructor(private router: Router, private licenceApplicationService: LicenceApplicationService) {}

	onStepPrevious(): void {
		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
				LicenceApplicationRoutes.LICENCE_APPLICATION_TYPE_ANONYMOUS
			)
		);
	}

	onStepNext(): void {
		if (this.isFormValid()) {
			const workerLicenceTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
				'workerLicenceTypeData.workerLicenceTypeCode'
			)?.value;
			const applicationTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
				'applicationTypeData.applicationTypeCode'
			)?.value;

			// CAS-2023-T3X5Q10930
			//'a60af04a-f150-4078-8908-40debd21e7f8'
			// TODO use real values
			this.licenceApplicationService
				.loadLicenceWithAccessCode(workerLicenceTypeCode, applicationTypeCode, 'TEST-01', 'bbb')
				.pipe(
					tap((_resp: any) => {
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
					}),
					take(1)
				)
				.subscribe();
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onLink(): void {
		// TODO search for linked licence
		// this.form.patchValue({ linkedLicenceId: 'Found' });
		this.form.patchValue({
			currentLicenceNumber: 'TDB',
			accessCode: 'TBD',
			linkedLicenceId: 'Found',
		});
	}
}
