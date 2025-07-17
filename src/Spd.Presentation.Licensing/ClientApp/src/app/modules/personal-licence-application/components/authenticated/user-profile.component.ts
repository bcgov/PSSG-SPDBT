import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
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

						<div class="col-xl-6 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								@if (isReadonly) {
									<button
										mat-stroked-button
										color="primary"
										class="large w-auto mb-3"
										aria-label="Back to main page"
										(click)="onCancel()"
									>
										<mat-icon>arrow_back</mat-icon>Back
									</button>
								}
							</div>
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<app-common-user-profile
						[personalInformationFormGroup]="personalInformationFormGroup"
						[contactInformationFormGroup]="contactInformationFormGroup"
						[aliasesFormGroup]="aliasesFormGroup"
						[residentialAddressFormGroup]="residentialAddressFormGroup"
						[mailingAddressFormGroup]="mailingAddressFormGroup"
						[characteristicsFormGroup]="characteristicsFormGroup"
						[isReadonlyPersonalInfo]="isReadonly"
						[isReadonlyMailingAddress]="isReadonly"
					></app-common-user-profile>

					<app-collection-notice></app-collection-notice>

					@if (!isReadonly) {
						<div class="row mt-3">
							<div class="offset-xl-6 col-xl-6 offset-lg-6 col-lg-6 col-md-12">
								<div class="d-flex justify-content-end">
									<button
										mat-stroked-button
										color="primary"
										class="large mx-3 mb-3"
										(click)="onCancel()"
										aria-label="Cancel changes and go back to main page"
									>
										Cancel
									</button>
									<button
										mat-flat-button
										color="primary"
										class="large mx-3 mb-3"
										(click)="onSave()"
										aria-label="Save changes and go back to main page"
									>
										Save
									</button>
								</div>
							</div>
						</div>
					}
				</div>
			</div>
		</section>
	`,
	styles: [],
	standalone: false,
})
export class UserProfileComponent {
	@ViewChild(CommonUserProfileComponent) userProfileComponent!: CommonUserProfileComponent;

	isReadonly = true;

	personalInformationFormGroup = this.workerApplicationService.personalInformationFormGroup;
	contactInformationFormGroup = this.workerApplicationService.contactInformationFormGroup;
	aliasesFormGroup = this.workerApplicationService.aliasesFormGroup;
	residentialAddressFormGroup = this.workerApplicationService.residentialAddressFormGroup;
	mailingAddressFormGroup = this.workerApplicationService.mailingAddressFormGroup;
	characteristicsFormGroup = this.workerApplicationService.characteristicsFormGroup;

	constructor(
		private router: Router,
		private utilService: UtilService,
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
				this.utilService.toasterSuccess('Your profile has been successfully updated');
				this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathUserApplications());
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}
}
