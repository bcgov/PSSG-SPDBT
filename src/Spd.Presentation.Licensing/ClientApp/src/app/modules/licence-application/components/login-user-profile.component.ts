import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '../services/licence-application.helper';
import { LicenceUserService } from '../services/licence-user.service';
import { UserProfileComponent } from '../step-components/user-profile.component';

@Component({
	selector: 'app-login-user-profile',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<h2 class="my-3 fs-3 fw-normal">Your Profile</h2>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<ng-container *ngIf="isAuthenticated | async">
						<app-alert type="warning" icon="warning">Fill out your profile information </app-alert>

						<app-user-profile></app-user-profile>

						<mat-divider class="mat-divider-main2 mb-3"></mat-divider>
						<div class="row">
							<div class="offset-xl-8 offset-lg-6 col-xl-2 col-lg-3 col-md-6 col-sm-12">
								<button mat-stroked-button color="primary" class="large mb-2" (click)="onCancel()">
									<i class="fa fa-times mr-2"></i>Cancel
								</button>
							</div>
							<div class="col-xl-2 col-lg-3 col-md-6 col-sm-12">
								<button mat-flat-button color="primary" class="large mb-2" (click)="onSave()">Save</button>
							</div>
						</div>
					</ng-container>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LoginUserProfileComponent implements OnInit, OnDestroy, LicenceChildStepperStepComponent {
	@ViewChild(UserProfileComponent) userProfileComponent!: UserProfileComponent;

	isAuthenticated = this.authProcessService.waitUntilAuthentication$;
	authenticationSubscription!: Subscription;

	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private licenceUserService: LicenceUserService
	) {}

	async ngOnInit(): Promise<void> {
		this.authProcessService.logoutBceid();
		await this.authProcessService.initializeLicencingBCSC();

		this.authenticationSubscription = this.authProcessService.waitUntilAuthentication$.subscribe(
			(isLoggedIn: boolean) => {
				if (isLoggedIn) {
					this.licenceUserService
						.createNewLicenceUser()
						.pipe()
						.subscribe((resp: any) => {
							// TODO fill in
						});
				}
			}
		);
	}

	ngOnDestroy() {
		if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
	}

	onCancel(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceApplications());
	}

	onSave(): void {
		//TODO save info
	}

	isFormValid(): boolean {
		return this.userProfileComponent.isFormValid();
	}
}
