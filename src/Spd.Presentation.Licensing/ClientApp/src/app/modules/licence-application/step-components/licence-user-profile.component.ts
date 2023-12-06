import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { UserProfileComponent } from './user-profile.component';

@Component({
	selector: 'app-licence-user-profile',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Confirm your profile"></app-step-title>
				<div class="step-container">
					<div class="row">
						<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
							<app-alert type="info" icon="info"
								>Make sure your profile information is up-to-date before renewing or updating your licence or permit, or
								starting a new application
							</app-alert>

							<app-user-profile></app-user-profile>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LicenceUserProfileComponent implements LicenceChildStepperStepComponent {
	@ViewChild(UserProfileComponent) userProfileComponent!: UserProfileComponent;

	constructor(private router: Router) {}

	onCancel(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceApplications());
	}

	isFormValid(): boolean {
		return this.userProfileComponent.isFormValid();
	}
}
