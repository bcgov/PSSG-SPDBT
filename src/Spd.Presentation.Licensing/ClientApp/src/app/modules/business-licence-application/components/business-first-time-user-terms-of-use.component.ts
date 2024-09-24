import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { LoginService } from '@app/api/services';
import { AuthUserBceidService } from '@app/core/services/auth-user-bceid.service';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';

import { CommonBusinessTermsComponent } from './common-business-terms.component';

@Component({
	selector: 'app-business-first-time-user-terms-of-use',
	template: `
		<div class="container px-0 my-0 px-md-2 my-md-3">
			<div class="row">
				<div class="col-12">
					<app-step-section
						title="Terms and Conditions"
						subtitle="Read, download, and accept the Terms of Use to continue"
					>
						<app-common-business-terms
							[form]="form"
							[applicationTypeCode]="applicationTypeCodes.New"
						></app-common-business-terms>

						<div class="row">
							<div class="offset-xxl-8 col-xxl-3 offset-xl-7 col-xl-4 offset-lg-7 col-lg-5 col-md-12 col-sm-12 mb-2">
								<button mat-flat-button color="primary" class="large mb-2" (click)="onContinue()">Continue</button>
							</div>
						</div>
					</app-step-section>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class BusinessFirstTimeUserTermsOfUseComponent implements OnInit, LicenceChildStepperStepComponent {
	form = this.businessApplicationService.termsAndConditionsFormGroup;

	@ViewChild(CommonBusinessTermsComponent) commonTermsComponent!: CommonBusinessTermsComponent;

	@Input() isWizard = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	applicationTypeCodes = ApplicationTypeCode;

	constructor(
		private router: Router,
		private loginService: LoginService,
		private businessApplicationService: BusinessApplicationService,
		private authUserBceidService: AuthUserBceidService
	) {}

	ngOnInit(): void {
		// do not allow the user to navigate here (eg. back button)
		// if they have already agreed to the terms
		if (!this.authUserBceidService.bceidUserProfile?.isFirstTimeLogin) {
			this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessLicence());
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
			.apiBizBizIdManagerBizUserIdTermAgreeGet({
				bizId: this.authUserBceidService.bceidUserProfile?.bizId!,
				bizUserId: this.authUserBceidService.bceidUserProfile?.bizUserId!,
			})
			.pipe()
			.subscribe((_resp: any) => {
				if (this.authUserBceidService.bceidUserProfile) {
					this.authUserBceidService.bceidUserProfile.isFirstTimeLogin = false;
				}
				this.router.navigate([BusinessLicenceApplicationRoutes.pathBusinessLicence()], {
					queryParams: { bizId: this.authUserBceidService.bceidUserProfile?.bizId },
				});
			});
	}
}
