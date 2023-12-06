import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { UserProfileComponent } from '../step-components/user-profile.component';

@Component({
	selector: 'app-login-user-profile',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<h2 class="my-3 fs-3 fw-normal">Your Profile</h2>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<app-alert type="info" icon="info">Fill out your profile information </app-alert>

					<app-user-profile></app-user-profile>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LoginUserProfileComponent implements OnInit, LicenceChildStepperStepComponent {
	@ViewChild(UserProfileComponent) userProfileComponent!: UserProfileComponent;

	constructor(private router: Router, private authProcessService: AuthProcessService) {}

	async ngOnInit(): Promise<void> {
		this.authProcessService.logoutBceid();

		await this.authProcessService.initializeLicencingBCSC();
	}

	onCancel(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceApplications());
	}

	isFormValid(): boolean {
		return this.userProfileComponent.isFormValid();
	}
}
