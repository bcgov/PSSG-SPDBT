import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, LicenceResponse, ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { MetalDealersAndRecyclersRoutes } from '../metal-dealers-and-recyclers-routes';
import { FormMdraLicenceAccessCodeComponent } from './form-mdra-licence-access-code.component';

@Component({
	selector: 'app-step-mdra-licence-access-code',
	template: `
		<app-step-section
			title="Provide your access code"
			info="<p>
						You need both your <strong>registration number</strong> as it appears on your current registration, plus the <strong>access code</strong>
						provided following your initial application or in your renewal letter from the Registrar, Security Services. Enter the two numbers below then click 'Next' to continue.
					</p>
					<p>
						If you do not know your access code, you may call Security Program's Licensing Unit during regular office
						hours and answer identifying questions to get your access code: {{ mdraPhoneNumber }}.
					</p>"
		>
			<app-form-mdra-licence-access-code
				(linkSuccess)="onLinkSuccess($event)"
				[form]="form"
				[serviceTypeCode]="serviceTypeMdraTeam"
				[applicationTypeCode]="applicationTypeCode"
			></app-form-mdra-licence-access-code>
		</app-step-section>

		<app-wizard-footer (previousStepperStep)="onStepPrevious()" (nextStepperStep)="onStepNext()"></app-wizard-footer>
	`,
	styles: [],
	standalone: false,
})
export class StepMdraLicenceAccessCodeComponent implements OnInit {
	mdraPhoneNumber = SPD_CONSTANTS.phone.mdraPhoneNumber;

	form: FormGroup = this.mdraDealersApplicationService.accessCodeFormGroup;

	readonly serviceTypeMdraTeam = ServiceTypeCode.Mdra;
	applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(FormMdraLicenceAccessCodeComponent) accessCodeComponent!: FormMdraLicenceAccessCodeComponent;

	constructor(
		private router: Router,
		private mdraDealersApplicationService: MetalDealersApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.applicationTypeCode = this.mdraDealersApplicationService.metalDealersModelFormGroup.get(
			'applicationTypeData.applicationTypeCode'
		)?.value;

		this.commonApplicationService.setMdraApplicationTitle(this.applicationTypeCode);
	}

	onStepPrevious(): void {
		this.router.navigateByUrl(
			MetalDealersAndRecyclersRoutes.path(MetalDealersAndRecyclersRoutes.MDRA_APPLICATION_TYPE)
		);
	}

	onStepNext(): void {
		this.accessCodeComponent.searchByAccessCode();
	}

	onLinkSuccess(associatedLicence: LicenceResponse): void {
		this.mdraDealersApplicationService
			.getMdraWithAccessCodeData(associatedLicence, this.applicationTypeCode)
			.subscribe((_resp: any) => {
				switch (this.applicationTypeCode) {
					case ApplicationTypeCode.Update: {
						this.router.navigateByUrl(MetalDealersAndRecyclersRoutes.path(MetalDealersAndRecyclersRoutes.MDRA_UPDATE));
						break;
					}
					case ApplicationTypeCode.Renewal: {
						this.router.navigateByUrl(MetalDealersAndRecyclersRoutes.path(MetalDealersAndRecyclersRoutes.MDRA_RENEWAL));
						break;
					}
				}
			});
	}
}
