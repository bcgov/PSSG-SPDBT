import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, LicenceResponse, ServiceTypeCode } from '@app/api/models';
import { AppRoutes } from '@app/app.routes';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { FormGdsdLicenceAccessCodeComponent } from '../shared/form-gdsd-licence-access-code.component';

@Component({
	selector: 'app-step-team-licence-access-code',
	template: `
		<app-step-section
			title="Provide access code"
			info="<p>
					To continue, please enter both your <strong>certificate number</strong> as shown on your current certificate and the <strong>access code</strong> provided to you after your initial application or in your renewal letter from the Registrar, Security Services.
				</p>
				<p>
					If you don’t know your access code, you can contact the Security Program's Licensing Unit at {{
				spdPhoneNumber
			}} during regular office hours for assistance.
				</p>"
		>
			<app-form-gdsd-licence-access-code
				(linkSuccess)="onLinkSuccess($event)"
				[form]="form"
				[serviceTypeCode]="serviceTypeGdsdTeam"
				[applicationTypeCode]="applicationTypeCode"
			></app-form-gdsd-licence-access-code>
		</app-step-section>

		<app-wizard-footer (previousStepperStep)="onStepPrevious()" (nextStepperStep)="onStepNext()"></app-wizard-footer>
	`,
	styles: [],
	standalone: false,
})
export class StepTeamLicenceAccessCodeComponent implements OnInit {
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	form: FormGroup = this.gdsdTeamApplicationService.accessCodeFormGroup;

	readonly serviceTypeGdsdTeam = ServiceTypeCode.GdsdTeamCertification;
	applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(FormGdsdLicenceAccessCodeComponent) accessCodeComponent!: FormGdsdLicenceAccessCodeComponent;

	constructor(
		private router: Router,
		private gdsdTeamApplicationService: GdsdTeamApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.applicationTypeCode = this.gdsdTeamApplicationService.gdsdTeamModelFormGroup.get(
			'applicationTypeData.applicationTypeCode'
		)?.value;

		this.commonApplicationService.setGdsdApplicationTitle(this.serviceTypeGdsdTeam, this.applicationTypeCode);
	}

	onStepPrevious(): void {
		this.router.navigateByUrl(AppRoutes.pathGdsdAnonymous(AppRoutes.GDSD_TEAM_APPLICATION_TYPE_ANONYMOUS));
	}

	onStepNext(): void {
		this.accessCodeComponent.searchByAccessCode();
	}

	onLinkSuccess(linkLicence: LicenceResponse): void {
		this.gdsdTeamApplicationService
			.getLicenceWithAccessCodeAnonymous(linkLicence, this.applicationTypeCode!)
			.subscribe((_resp: any) => {
				switch (this.applicationTypeCode) {
					case ApplicationTypeCode.Renewal: {
						this.router.navigateByUrl(AppRoutes.pathGdsdAnonymous(AppRoutes.GDSD_TEAM_RENEWAL_ANONYMOUS));
						break;
					}
					case ApplicationTypeCode.Replacement: {
						this.router.navigateByUrl(AppRoutes.pathGdsdAnonymous(AppRoutes.GDSD_TEAM_REPLACEMENT_ANONYMOUS));
						break;
					}
				}
			});
	}
}
