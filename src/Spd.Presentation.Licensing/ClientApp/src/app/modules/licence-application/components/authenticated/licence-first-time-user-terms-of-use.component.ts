import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { LoginService } from '@app/api/services';
import { AuthUserBcscService } from '@app/core/services/auth-user-bcsc.service';
import { CommonSwlPermitTermsComponent } from '@app/modules/licence-application/components/shared/step-components/common-swl-permit-terms.component';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '../../services/licence-application.service';

@Component({
	selector: 'app-licence-first-time-user-terms-of-use',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Terms and Conditions"
					subtitle="Read, download, and accept the Terms of Use to continue"
				></app-step-title>

				<app-common-swl-permit-terms
					[form]="form"
					[applicationTypeCode]="applicationTypeCodes.New"
				></app-common-swl-permit-terms>

				<div class="row">
					<div class="offset-xxl-8 col-xxl-3 offset-xl-7 col-xl-4 offset-lg-7 col-lg-5 col-md-12 col-sm-12 mb-2">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onContinue()">Continue</button>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LicenceFirstTimeUserTermsOfUseComponent implements OnInit, LicenceChildStepperStepComponent {
	form = this.licenceApplicationService.termsAndConditionsFormGroup;

	@ViewChild(CommonSwlPermitTermsComponent) commonTermsComponent!: CommonSwlPermitTermsComponent;

	@Input() inWizard = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	applicationTypeCodes = ApplicationTypeCode;

	constructor(
		private router: Router,
		private loginService: LoginService,
		private authUserBcscService: AuthUserBcscService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		// do not allow the user to navigate here (eg. back button)
		// if they have already agreed to the terms
		if (!this.authUserBcscService.applicantLoginProfile?.isFirstTimeLogin) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated());
			return;
		}
	}

	isFormValid(): boolean {
		return this.commonTermsComponent.isFormValid();
	}

	onContinue(): void {
		this.form.markAllAsTouched();
		if (!this.isFormValid()) return;

		this.loginService
			.apiApplicantApplicantIdTermAgreeGet({
				applicantId: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			})
			.pipe()
			.subscribe((_resp: any) => {
				if (this.authUserBcscService.applicantLoginProfile) {
					this.authUserBcscService.applicantLoginProfile.isFirstTimeLogin = false;
				}

				this.router.navigateByUrl(
					LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
						LicenceApplicationRoutes.LICENCE_FIRST_TIME_USER_SELECTION
					)
				);
			});
	}
}
