import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';
import { CommonUserProfileComponent } from '@app/modules/licence-application/components/shared/step-components/common-user-profile.component';

@Component({
	selector: 'app-login-user-profile',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<h2 class="fs-3 mb-3">Your Profile</h2>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<app-alert type="warning" icon="warning">Fill out your profile information </app-alert>

					<app-common-user-profile></app-common-user-profile>
				</div>
			</div>
		</section>

		<div class="row mt-3">
			<div class="offset-xl-8 offset-lg-6 col-xl-2 col-lg-3 col-md-6 col-sm-12">
				<button mat-stroked-button color="primary" class="large mb-2" (click)="onCancel()">
					<i class="fa fa-times mr-2"></i>Cancel
				</button>
			</div>
			<div class="col-xl-2 col-lg-3 col-md-6 col-sm-12">
				<button mat-flat-button color="primary" class="large mb-2" (click)="onSave()">Save</button>
			</div>
		</div>
	`,
	styles: [],
})
export class LoginUserProfileComponent implements LicenceChildStepperStepComponent {
	@ViewChild(CommonUserProfileComponent) userProfileComponent!: CommonUserProfileComponent;

	constructor(private router: Router) {}

	onCancel(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
	}

	onSave(): void {
		//TODO save info
	}

	isFormValid(): boolean {
		return this.userProfileComponent.isFormValid();
	}
}
