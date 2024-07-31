import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonAccessCodeAnonymousComponent } from '@app/modules/personal-licence-application/components/shared/common-step-components/common-access-code-anonymous.component';
import { LicenceApplicationService } from '@app/modules/personal-licence-application/licence-application.service';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';
import { CommonApplicationService } from '@app/shared/services/common-application.service';

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
				[workerLicenceTypeCode]="workerLicenceTypeCode"
				[applicationTypeCode]="applicationTypeCode"
			></app-common-access-code-anonymous>
		</app-step-section>

		<app-wizard-footer (previousStepperStep)="onStepPrevious()" (nextStepperStep)="onStepNext()"></app-wizard-footer>
	`,
	styles: [],
})
export class StepWorkerLicenceAccessCodeComponent implements OnInit, LicenceChildStepperStepComponent {
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	form: FormGroup = this.licenceApplicationService.accessCodeFormGroup;

	workerLicenceTypeCode!: WorkerLicenceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(CommonAccessCodeAnonymousComponent)
	commonAccessCodeAnonymousComponent!: CommonAccessCodeAnonymousComponent;

	constructor(
		private router: Router,
		private licenceApplicationService: LicenceApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.workerLicenceTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
			'workerLicenceTypeData.workerLicenceTypeCode'
		)?.value;
		this.applicationTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
			'applicationTypeData.applicationTypeCode'
		)?.value;

		this.commonApplicationService.setApplicationTitle(this.workerLicenceTypeCode, this.applicationTypeCode);
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

		this.licenceApplicationService
			.getLicenceWithAccessCodeDataAnonymous(accessCodeData, this.applicationTypeCode!)
			.subscribe((_resp: any) => {
				switch (this.workerLicenceTypeCode) {
					case WorkerLicenceTypeCode.SecurityWorkerLicence: {
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
