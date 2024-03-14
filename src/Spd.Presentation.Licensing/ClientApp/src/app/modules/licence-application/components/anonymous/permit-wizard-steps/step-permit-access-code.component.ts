import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { CommonAccessCodeAnonymousComponent } from '../../shared/step-components/common-access-code-anonymous.component';

@Component({
	selector: 'app-step-permit-access-code',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Provide your access code"
					info="	
					<p>
						You need both your permit number as it appears on your current permit, 
						plus the access code number provided following your initial security worker 
						application and in your renewal letter from the Registrar, Security Services. 
						Enter the two numbers below then click 'Next' to continue.
					</p>
					<p>
						If you do not know your access code, you may call Security Program's Licensing Unit during regular office
						hours and answer identifying questions to get your access code: {{ spdPhoneNumber }}.
					</p>"
				>
				</app-step-title>

				<app-common-access-code-anonymous
					(linkSuccess)="onLinkSuccess()"
					[form]="form"
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
				></app-common-access-code-anonymous>
			</div>
		</section>

		<div class="row outside-wizard-button-row">
			<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
				<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
			</div>
			<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
				<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext()">Next</button>
			</div>
		</div>
	`,
	styles: [],
})
export class StepPermitAccessCodeComponent implements OnInit, LicenceChildStepperStepComponent {
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	form: FormGroup = this.permitApplicationService.accessCodeFormGroup;

	workerLicenceTypeCode!: WorkerLicenceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(CommonAccessCodeAnonymousComponent)
	commonAccessCodeAnonymousComponent!: CommonAccessCodeAnonymousComponent;

	constructor(
		private router: Router,
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.workerLicenceTypeCode = this.permitApplicationService.permitModelFormGroup.get(
			'workerLicenceTypeData.workerLicenceTypeCode'
		)?.value;
		this.applicationTypeCode = this.permitApplicationService.permitModelFormGroup.get(
			'applicationTypeData.applicationTypeCode'
		)?.value;

		this.commonApplicationService.setApplicationTitle(this.workerLicenceTypeCode, this.applicationTypeCode);
	}

	onStepPrevious(): void {
		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathPermitAnonymous(LicenceApplicationRoutes.PERMIT_TYPE_ANONYMOUS)
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

		this.permitApplicationService
			.getPermitWithAccessCodeDataAnonymous(accessCodeData, this.applicationTypeCode!)
			.subscribe((_resp: any) => {
				switch (this.workerLicenceTypeCode) {
					case WorkerLicenceTypeCode.ArmouredVehiclePermit:
					case WorkerLicenceTypeCode.BodyArmourPermit: {
						switch (this.applicationTypeCode) {
							case ApplicationTypeCode.Update: {
								this.router.navigateByUrl(
									LicenceApplicationRoutes.pathPermitAnonymous(LicenceApplicationRoutes.PERMIT_UPDATE_ANONYMOUS)
								);
								break;
							}
							case ApplicationTypeCode.Renewal: {
								this.router.navigateByUrl(
									LicenceApplicationRoutes.pathPermitAnonymous(LicenceApplicationRoutes.PERMIT_RENEWAL_ANONYMOUS)
								);
								break;
							}
						}
					}
				}
			});
	}
}
