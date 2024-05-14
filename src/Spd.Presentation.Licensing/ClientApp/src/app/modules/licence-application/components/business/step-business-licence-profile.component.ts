import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { UtilService } from '@app/core/services/util.service';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { BusinessApplicationService } from '../../services/business-application.service';
import { CommonBusinessProfileComponent } from './common-business-profile.component';

@Component({
	selector: 'app-step-business-licence-profile',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Business Profile</h2>
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<!-- <ng-container *ngIf="!isReadonly">
	<app-alert type="warning" icon="warning">Fill out your profile information </app-alert>
</ng-container> -->

					<app-common-business-profile
						[businessInformationFormGroup]="businessInformationFormGroup"
						[businessAddressFormGroup]="businessAddressFormGroup"
						[bcBusinessAddressFormGroup]="bcBusinessAddressFormGroup"
						[mailingAddressFormGroup]="mailingAddressFormGroup"
						[branchesInBcFormGroup]="branchesInBcFormGroup"
						[isReadonly]="false"
					></app-common-business-profile>

					<div class="row mt-3">
						<div class="col-12">
							<app-collection-notice></app-collection-notice>
						</div>
					</div>
				</div>
			</div>
		</section>

		<app-wizard-footer [nextButtonLabel]="saveAndContinueLabel" (nextStepperStep)="onContinue()"></app-wizard-footer>
	`,
	styles: ``,
})
export class StepBusinessLicenceProfileComponent {
	applicationTypeCode: ApplicationTypeCode | null = null;

	saveAndContinueLabel = 'Save & Continue to Application';

	businessInformationFormGroup = this.businessApplicationService.businessInformationFormGroup;
	businessAddressFormGroup = this.businessApplicationService.businessAddressFormGroup;
	bcBusinessAddressFormGroup = this.businessApplicationService.bcBusinessAddressFormGroup;
	mailingAddressFormGroup = this.businessApplicationService.mailingAddressFormGroup;
	branchesInBcFormGroup = this.businessApplicationService.branchesInBcFormGroup;

	@ViewChild(CommonBusinessProfileComponent) businessProfileComponent!: CommonBusinessProfileComponent;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private businessApplicationService: BusinessApplicationService
	) {
		const state = this.router.getCurrentNavigation()?.extras.state;
		this.applicationTypeCode = state && state['applicationTypeCode'];
	}

	ngOnInit(): void {
		if (!this.businessApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessApplications());
		}
	}

	onContinue(): void {
		const isValid = this.businessProfileComponent.isFormValid();

		if (!isValid) {
			this.utilService.scrollToErrorSection();
			return;
		}

		this.businessApplicationService.saveBusinessProfileAndContinue(this.applicationTypeCode!).subscribe();
	}
}
