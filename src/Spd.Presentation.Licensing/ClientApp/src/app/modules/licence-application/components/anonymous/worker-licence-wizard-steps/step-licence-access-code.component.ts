import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { take, tap } from 'rxjs/operators';

@Component({
	selector: 'app-step-licence-access-code',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Provide your access code"
					info="	<p>
						You need both <strong>your licence number</strong> as it appears on your current licence, plus the <strong>access code number</strong>
						provided following your initial security worker application or in your renewal letter from the Registrar,
						Security Services. Enter the two numbers below then click 'Link' to verify.
					</p>
					<p>
						If you do not know your access code, you may call Security Program's Licensing Unit during regular office
						hours and answer identifying questions to get your access code: {{ spdPhoneNumber }}.
					</p>"
				>
				</app-step-title>

				<app-common-access-code-anonymous
					[form]="form"
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
				></app-common-access-code-anonymous>
			</div>
		</section>

		<div class="row wizard-button-row">
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
export class StepLicenceAccessCodeComponent implements OnInit, LicenceChildStepperStepComponent {
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	form: FormGroup = this.licenceApplicationService.accessCodeFormGroup;

	workerLicenceTypeCode!: WorkerLicenceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;

	constructor(private router: Router, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.workerLicenceTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
			'workerLicenceTypeData.workerLicenceTypeCode'
		)?.value;
		this.applicationTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
			'applicationTypeData.applicationTypeCode'
		)?.value;
	}

	onStepPrevious(): void {
		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
				LicenceApplicationRoutes.LICENCE_APPLICATION_TYPE_ANONYMOUS
			)
		);
	}

	onStepNext(): void {
		if (!this.isFormValid()) {
			return;
		}

		const accessCodeData = this.form.value;
		accessCodeData.linkedLicenceId = '172761bb-3fd7-497c-81a9-b953359709a2'; // '468075a7-550e-4820-a7ca-00ea6dde3025'; // TODO hardcoded ID fix

		this.licenceApplicationService
			.loadLicence(accessCodeData.linkedLicenceId, this.applicationTypeCode!)
			.pipe(
				tap((_resp: any) => {
					this.licenceApplicationService.licenceModelFormGroup.patchValue(
						{
							licenceNumber: accessCodeData.licenceNumber,
							licenceExpiryDate: accessCodeData.licenceExpiryDate,
						},
						{ emitEvent: false }
					);

					switch (this.workerLicenceTypeCode) {
						case WorkerLicenceTypeCode.SecurityWorkerLicence: {
							switch (this.applicationTypeCode) {
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
					}
				}),
				take(1)
			)
			.subscribe();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
