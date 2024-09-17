import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routing.module';
import { HotToastService } from '@ngneat/hot-toast';
import { CommonUserProfileComponent } from './user-profile-components/common-user-profile.component';

@Component({
	selector: 'app-user-profile',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Your Profile</h2>
						</div>

						<div class="col-xl-6 col-lg-4 col-md-12" *ngIf="isReadonly">
							<div class="d-flex justify-content-end">
								<button
									mat-stroked-button
									color="primary"
									class="large w-auto mb-3"
									aria-label="Back"
									(click)="onCancel()"
								>
									<mat-icon>arrow_back</mat-icon>Back
								</button>
							</div>
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<ng-container *ngIf="!isReadonly">
						<app-alert type="warning" icon="warning">Fill out your profile information </app-alert>
					</ng-container>

					<app-common-user-profile
						[personalInformationFormGroup]="personalInformationFormGroup"
						[contactInformationFormGroup]="contactInformationFormGroup"
						[aliasesFormGroup]="aliasesFormGroup"
						[residentialAddressFormGroup]="residentialAddressFormGroup"
						[mailingAddressFormGroup]="mailingAddressFormGroup"
						[isReadonlyPersonalInfo]="isReadonly"
						[isReadonlyMailingAddress]="isReadonly"
					></app-common-user-profile>

					<div class="mt-3">
						<app-collection-notice></app-collection-notice>
					</div>
				</div>
			</div>
		</section>

		<ng-container *ngIf="!isReadonly">
			<app-wizard-outside-footer
				nextButtonLabel="Save"
				(nextStepperStep)="onSave()"
				(cancel)="onCancel()"
			></app-wizard-outside-footer>
		</ng-container>
	`,
	styles: [],
})
export class UserProfileComponent {
	@ViewChild(CommonUserProfileComponent) userProfileComponent!: CommonUserProfileComponent;

	isReadonly = true;

	personalInformationFormGroup = this.workerApplicationService.personalInformationFormGroup;
	contactInformationFormGroup = this.workerApplicationService.contactInformationFormGroup;
	aliasesFormGroup = this.workerApplicationService.aliasesFormGroup;
	residentialAddressFormGroup = this.workerApplicationService.residentialAddressFormGroup;
	mailingAddressFormGroup = this.workerApplicationService.mailingAddressFormGroup;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private hotToastService: HotToastService,
		private workerApplicationService: WorkerApplicationService
	) {
		// check if isReadonly was passed from 'LicenceUserApplicationsComponent'
		const state = this.router.getCurrentNavigation()?.extras.state;
		this.isReadonly = state && state['isReadonly'];
	}

	onCancel(): void {
		this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathUserApplications());
	}

	onSave(): void {
		const isValid = this.userProfileComponent.isFormValid();

		if (!isValid) {
			this.utilService.scrollToErrorSection();
			return;
		}

		this.workerApplicationService.saveLoginUserProfile().subscribe({
			next: (_resp: any) => {
				this.hotToastService.success('Your profile has been successfully updated');
				this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathUserApplications());
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}
}
