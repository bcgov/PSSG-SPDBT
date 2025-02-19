import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, LicenceResponse, ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { FormAccessCodeAnonymousComponent } from '@app/shared/components/form-access-code-anonymous.component';

@Component({
	selector: 'app-step-gdsd-licence-access-code',
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
			<app-form-access-code-anonymous
				(linkSuccess)="onLinkSuccess($event)"
				[form]="form"
				[serviceTypeCode]="serviceTypeCode"
				[applicationTypeCode]="applicationTypeCode"
			></app-form-access-code-anonymous>
		</app-step-section>

		<app-wizard-footer (previousStepperStep)="onStepPrevious()" (nextStepperStep)="onStepNext()"></app-wizard-footer>
	`,
	styles: [],
	standalone: false,
})
export class StepGdsdLicenceAccessCodeComponent implements OnInit, LicenceChildStepperStepComponent {
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	form: FormGroup = this.gdsdApplicationService.accessCodeFormGroup;

	serviceTypeCode!: ServiceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(FormAccessCodeAnonymousComponent)
	commonAccessCodeAnonymousComponent!: FormAccessCodeAnonymousComponent;

	constructor(
		private router: Router,
		private gdsdApplicationService: GdsdApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.serviceTypeCode = this.gdsdApplicationService.gdsdModelFormGroup.get('serviceTypeData.serviceTypeCode')?.value;
		this.applicationTypeCode = this.gdsdApplicationService.gdsdModelFormGroup.get(
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
		this.gdsdApplicationService
			.getLicenceWithAccessCodeDataAnonymous(linkLicence, this.applicationTypeCode!)
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
						}
						break;
					}
				}
			});
	}
}
