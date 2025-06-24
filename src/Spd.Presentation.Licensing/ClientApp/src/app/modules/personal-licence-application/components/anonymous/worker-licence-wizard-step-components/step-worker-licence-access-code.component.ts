import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, LicenceResponse, ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { FormAccessCodeAnonymousComponent } from '@app/shared/components/form-access-code-anonymous.component';

@Component({
	selector: 'app-step-worker-licence-access-code',
	template: `
		<app-step-section
			heading="Provide your access code"
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
			<app-form-access-code-anonymous
				(linkSuccess)="onLinkSuccess($event)"
				[form]="form"
				[serviceTypeCode]="serviceTypeCode"
				[applicationTypeCode]="applicationTypeCode"
			></app-form-access-code-anonymous>

			<div class="row">
				<div class="col-xl-8 col-lg-8 col-md-8 col-sm-12 mx-auto">
					<div class="mt-4" *ngIf="originalPhotoOfYourselfExpired">
						<app-alert type="danger" icon="dangerous">
							A replacement for this record is not available at this time. Use update to provide missing information and
							receive a replacement.
						</app-alert>
					</div>
				</div>
			</div>
		</app-step-section>

		<app-wizard-footer (previousStepperStep)="onStepPrevious()" (nextStepperStep)="onStepNext()"></app-wizard-footer>
	`,
	styles: [],
	standalone: false,
})
export class StepWorkerLicenceAccessCodeComponent implements OnInit, LicenceChildStepperStepComponent {
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;
	originalPhotoOfYourselfExpired = false;

	form: FormGroup = this.workerApplicationService.accessCodeFormGroup;

	serviceTypeCode!: ServiceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(FormAccessCodeAnonymousComponent)
	commonAccessCodeAnonymousComponent!: FormAccessCodeAnonymousComponent;

	constructor(
		private router: Router,
		private workerApplicationService: WorkerApplicationService,
		private commonApplicationService: CommonApplicationService
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

	onLinkSuccess(linkLicence: LicenceResponse): void {
		this.workerApplicationService
			.getLicenceWithAccessCodeDataAnonymous(linkLicence, this.applicationTypeCode!)
			.subscribe((resp: any) => {
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
								this.originalPhotoOfYourselfExpired = !!resp.originalLicenceData.originalPhotoOfYourselfExpired;

								if (this.originalPhotoOfYourselfExpired) return;

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
