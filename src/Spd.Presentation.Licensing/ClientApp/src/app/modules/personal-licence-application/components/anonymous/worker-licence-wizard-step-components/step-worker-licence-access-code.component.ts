import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { ApplicationService } from '@app/core/services/application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { CommonAccessCodeAnonymousComponent } from '@app/modules/personal-licence-application/components/shared/common-step-components/common-access-code-anonymous.component';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';

@Component({
	selector: 'app-step-worker-licence-access-code',
	template: `
		<app-step-section
			title="Provide your access code"
			info="<p>
						You need both <strong>your licence number</strong> as it appears on your current licence, plus the <strong>access code number</strong>
						provided following your initial security worker application or in your renewal letter from the Registrar,
						Security Services. Enter the two numbers below then click 'Next' to continue.
					</p>
					<p>
						If you do not know your access code, you may call Security Program's Licensing Unit during regular office
						hours and answer identifying questions to get your access code: {{ spdPhoneNumber }}.
					</p>"
		>
			<app-common-access-code-anonymous
				(linkSuccess)="onLinkSuccess()"
				[form]="form"
				[serviceTypeCode]="serviceTypeCode"
				[applicationTypeCode]="applicationTypeCode"
			></app-common-access-code-anonymous>
		</app-step-section>

		<app-wizard-footer (previousStepperStep)="onStepPrevious()" (nextStepperStep)="onStepNext()"></app-wizard-footer>
	`,
	styles: [],
})
export class StepWorkerLicenceAccessCodeComponent implements OnInit, LicenceChildStepperStepComponent {
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	form: FormGroup = this.workerApplicationService.accessCodeFormGroup;

	serviceTypeCode!: ServiceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(CommonAccessCodeAnonymousComponent)
	commonAccessCodeAnonymousComponent!: CommonAccessCodeAnonymousComponent;

	constructor(
		private router: Router,
		private workerApplicationService: WorkerApplicationService,
		private commonApplicationService: ApplicationService
	) {}

	ngOnInit(): void {
		this.serviceTypeCode = this.workerApplicationService.workerModelFormGroup.get(
			'serviceTypeData.serviceTypeCode'
		)?.value;
		this.applicationTypeCode = this.workerApplicationService.workerModelFormGroup.get(
			'applicationTypeData.applicationTypeCode'
		)?.value;

		this.commonApplicationService.setApplicationTitle(this.serviceTypeCode, this.applicationTypeCode);
	}

	onStepPrevious(): void {
		this.router.navigateByUrl(
			PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
				PersonalLicenceApplicationRoutes.LICENCE_APPLICATION_TYPE_ANONYMOUS
			)
		);
	}

	onStepNext(): void {
		this.commonAccessCodeAnonymousComponent.searchByAccessCode();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onLinkSuccess(): void {
		const accessCodeData = this.form.value;

		this.workerApplicationService
			.getLicenceWithAccessCodeDataAnonymous(accessCodeData, this.applicationTypeCode!)
			.subscribe((_resp: any) => {
				switch (this.serviceTypeCode) {
					case ServiceTypeCode.SecurityWorkerLicence: {
						switch (this.applicationTypeCode) {
							case ApplicationTypeCode.Renewal: {
								this.router.navigateByUrl(
									PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
										PersonalLicenceApplicationRoutes.WORKER_LICENCE_RENEWAL_ANONYMOUS
									)
								);
								break;
							}
							case ApplicationTypeCode.Replacement: {
								this.router.navigateByUrl(
									PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
										PersonalLicenceApplicationRoutes.WORKER_LICENCE_REPLACEMENT_ANONYMOUS
									)
								);
								break;
							}
							case ApplicationTypeCode.Update: {
								this.router.navigateByUrl(
									PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
										PersonalLicenceApplicationRoutes.WORKER_LICENCE_UPDATE_ANONYMOUS
									)
								);
								break;
							}
						}
						break;
					}
				}
			});
	}
}
