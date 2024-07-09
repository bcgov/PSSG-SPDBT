import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { LoginService } from '@app/api/services';
import { AuthUserBceidService } from '@app/core/services/auth-user-bceid.service';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { CommonBusinessTermsComponent } from '../shared/step-components/common-business-terms.component';

@Component({
	selector: 'app-business-first-time-user-terms-of-use',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Terms and Conditions"
					subtitle="Read, download, and accept the Terms of Use to continue"
				></app-step-title>

				<app-common-business-terms
					[form]="form"
					[applicationTypeCode]="applicationTypeCodes.New"
				></app-common-business-terms>

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
export class BusinessFirstTimeUserTermsOfUseComponent implements OnInit, LicenceChildStepperStepComponent {
	form: FormGroup = this.formBuilder.group({
		agreeToTermsAndConditions: new FormControl('', [Validators.requiredTrue]),
		dateSigned: new FormControl({ value: null, disabled: true }, [Validators.requiredTrue]),
	});

	@ViewChild(CommonBusinessTermsComponent) commonTermsComponent!: CommonBusinessTermsComponent;

	@Input() inWizard = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	applicationTypeCodes = ApplicationTypeCode;

	constructor(
		private router: Router,
		private formBuilder: FormBuilder,
		private loginService: LoginService,
		private authUserBceidService: AuthUserBceidService
	) {}

	ngOnInit(): void {
		// do not allow the user to navigate here (eg. back button)
		// if they have already agreed to the terms
		if (!this.authUserBceidService.bceidUserProfile?.isFirstTimeLogin) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessLicence());
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
				this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessLicence());
			});
	}
}
