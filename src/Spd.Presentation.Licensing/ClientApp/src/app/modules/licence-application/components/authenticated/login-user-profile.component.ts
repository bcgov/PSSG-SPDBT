import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '@app/core/services/util.service';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { HotToastService } from '@ngneat/hot-toast';
import { CommonUserProfileComponent } from './user-profile/common-user-profile.component';

@Component({
	selector: 'app-login-user-profile',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Confirm your Profile</h2>
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
						[contactFormGroup]="contactFormGroup"
						[aliasesFormGroup]="aliasesFormGroup"
						[residentialAddressFormGroup]="residentialAddressFormGroup"
						[mailingAddressFormGroup]="mailingAddressFormGroup"
						[isReadonlyPersonalInfo]="isReadonly"
						[isReadonlyMailingAddress]="isReadonly"
					></app-common-user-profile>

					<div class="mt-3">
						<app-alert type="info" icon="" [showBorder]="false">
							<div class="mb-2">COLLECTION NOTICE</div>
							All information regarding this application is collected under the <i>Security Services Act</i> and its
							Regulation and will be used for that purpose. The use of this information will comply with the
							<i>Freedom of Information</i> and <i>Privacy Act</i> and the federal <i>Privacy Act</i>. If you have any
							questions regarding the collection or use of this information, please contact
							<a href="mailto:securitylicensing@gov.bc.ca">securitylicensing&#64;gov.bc.ca</a>
						</app-alert>
					</div>
				</div>
			</div>
		</section>

		<div class="row mt-3" *ngIf="!isReadonly">
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
export class LoginUserProfileComponent implements OnInit {
	@ViewChild(CommonUserProfileComponent) userProfileComponent!: CommonUserProfileComponent;

	isReadonly = true;

	personalInformationFormGroup = this.licenceApplicationService.personalInformationFormGroup;
	contactFormGroup = this.licenceApplicationService.contactInformationFormGroup;
	aliasesFormGroup = this.licenceApplicationService.aliasesFormGroup;
	residentialAddressFormGroup = this.licenceApplicationService.residentialAddressFormGroup;
	mailingAddressFormGroup = this.licenceApplicationService.mailingAddressFormGroup;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private hotToastService: HotToastService,
		private licenceApplicationService: LicenceApplicationService
	) {
		// check if isReadonly was passed from 'LicenceUserApplicationsComponent'
		const state = this.router.getCurrentNavigation()?.extras.state;
		this.isReadonly = state && state['isReadonly'];
	}

	ngOnInit(): void {
		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
		}
	}

	onCancel(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
	}

	onSave(): void {
		const isValid = this.userProfileComponent.isFormValid();

		if (!isValid) {
			this.utilService.scrollToErrorSection();
			return;
		}

		this.licenceApplicationService.saveLoginUserProfile().subscribe({
			next: (_resp: any) => {
				this.hotToastService.success('Your profile has been successfully updated');
				this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
				this.hotToastService.error('An error occurred during the save. Please try again.');
			},
		});
	}
}
