import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, LicenceResponse, ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { ApplicationService } from '@app/core/services/application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { CommonAccessCodeAnonymousComponent } from '@app/modules/personal-licence-application/components/shared/common-step-components/common-access-code-anonymous.component';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { PermitApplicationService } from '@core/services/permit-application.service';

@Component({
	selector: 'app-step-permit-access-code',
	template: `
		<app-step-section
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
			<app-common-access-code-anonymous
				(linkSuccess)="onLinkSuccess($event)"
				[form]="form"
				[serviceTypeCode]="serviceTypeCode"
				[applicationTypeCode]="applicationTypeCode"
			></app-common-access-code-anonymous>
		</app-step-section>

		<app-wizard-footer (previousStepperStep)="onStepPrevious()" (nextStepperStep)="onStepNext()"></app-wizard-footer>
	`,
	styles: [],
})
export class StepPermitAccessCodeComponent implements OnInit, LicenceChildStepperStepComponent {
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	form: FormGroup = this.permitApplicationService.accessCodeFormGroup;

	serviceTypeCode!: ServiceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(CommonAccessCodeAnonymousComponent)
	commonAccessCodeAnonymousComponent!: CommonAccessCodeAnonymousComponent;

	constructor(
		private router: Router,
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: ApplicationService
	) {}

	ngOnInit(): void {
		this.serviceTypeCode = this.permitApplicationService.permitModelFormGroup.get(
			'serviceTypeData.serviceTypeCode'
		)?.value;
		this.applicationTypeCode = this.permitApplicationService.permitModelFormGroup.get(
			'applicationTypeData.applicationTypeCode'
		)?.value;

		this.commonApplicationService.setApplicationTitle(this.serviceTypeCode, this.applicationTypeCode);
	}

	onStepPrevious(): void {
		this.router.navigateByUrl(
			PersonalLicenceApplicationRoutes.pathPermitAnonymous(PersonalLicenceApplicationRoutes.PERMIT_TYPE_ANONYMOUS)
		);
	}

	onStepNext(): void {
		this.commonAccessCodeAnonymousComponent.searchByAccessCode();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onLinkSuccess(permitLicenceData: LicenceResponse): void {
		const accessCodeData = this.form.value;

		this.permitApplicationService
			.getPermitWithAccessCodeDataAnonymous(accessCodeData, this.applicationTypeCode!, permitLicenceData)
			.subscribe((_resp: any) => {
				switch (this.serviceTypeCode) {
					case ServiceTypeCode.ArmouredVehiclePermit:
					case ServiceTypeCode.BodyArmourPermit: {
						switch (this.applicationTypeCode) {
							case ApplicationTypeCode.Update: {
								this.router.navigateByUrl(
									PersonalLicenceApplicationRoutes.pathPermitAnonymous(
										PersonalLicenceApplicationRoutes.PERMIT_UPDATE_ANONYMOUS
									)
								);
								break;
							}
							case ApplicationTypeCode.Renewal: {
								this.router.navigateByUrl(
									PersonalLicenceApplicationRoutes.pathPermitAnonymous(
										PersonalLicenceApplicationRoutes.PERMIT_RENEWAL_ANONYMOUS
									)
								);
								break;
							}
						}
					}
				}
			});
	}
}