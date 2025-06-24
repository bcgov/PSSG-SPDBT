import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { MetalDealersAndRecyclersRoutes } from '../metal-dealers-and-recyclers-routes';

@Component({
	selector: 'app-step-mdra-application-type',
	template: `
		<app-step-section heading="Registration information">
			<div class="row">
				<div class="col-xl-9 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-7 col-lg-8 col-md-12 col-sm-12 mx-auto">
							<form [formGroup]="form" novalidate>
								<mat-radio-group aria-label="Select an option" formControlName="applicationTypeCode">
									<div class="row">
										<div class="col-lg-4">
											<mat-radio-button class="radio-label" [value]="applicationTypeCodes.New">New</mat-radio-button>
										</div>
										<div class="col-lg-8">
											<app-alert type="info" icon=""> Apply for a new registration </app-alert>
										</div>
									</div>
									<mat-divider class="mb-3"></mat-divider>
									<div class="row">
										<div class="col-lg-4">
											<mat-radio-button class="radio-label" [value]="applicationTypeCodes.Renewal"
												>Renewal</mat-radio-button
											>
										</div>
										<div class="col-lg-8">
											<app-alert type="info" icon="">
												Renew your existing registration (within 90 days before it expires)
											</app-alert>
										</div>
									</div>
									<mat-divider class="mb-3"></mat-divider>
									<div class="row">
										<div class="col-lg-4">
											<mat-radio-button class="radio-label" [value]="applicationTypeCodes.Update"
												>Update</mat-radio-button
											>
										</div>
										<div class="col-lg-8">
											<app-alert type="info" icon=""> Update registration information </app-alert>
										</div>
									</div>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('applicationTypeCode')?.dirty || form.get('applicationTypeCode')?.touched) &&
										form.get('applicationTypeCode')?.invalid &&
										form.get('applicationTypeCode')?.hasError('required')
									"
									>An option must be selected</mat-error
								>
							</form>
						</div>
					</div>

					<div class="row" *ngIf="isUpdate" @showHideTriggerSlideAnimation>
						<app-alert type="success" icon="">
							<form [formGroup]="formAgreement" novalidate>
								<p>
									Please proceed only if you wish to update the following information pertaining to your organization:
								</p>
								<ul>
									<li>Company Trading As Name</li>
									<li>Company Legal Name</li>
									<li>Branch Addresses (including main office branch)</li>
								</ul>

								<p>These updates will require a reprint of your current registration at no cost.</p>

								<p>
									For all other updates (i.e. contact information) please contact Security Services Licensing Unit at
									<a
										aria-label="Send email to security licensing"
										href="mailto:securitylicensing@gov.bc.ca"
										class="email-address-link"
										>securitylicensing&#64;gov.bc.ca</a
									>
									or phone us at {{ spdPhoneNumber }} (option 1) Monday to Friday, 9 am to 4 pm. Closed on statutory
									holidays.
								</p>

								<mat-checkbox formControlName="agreeToUpdate">I understand</mat-checkbox>

								<mat-error
									class="mat-option-error"
									*ngIf="
										(formAgreement.get('agreeToUpdate')?.dirty || formAgreement.get('agreeToUpdate')?.touched) &&
										formAgreement.get('agreeToUpdate')?.invalid &&
										formAgreement.get('agreeToUpdate')?.hasError('required')
									"
									>This is required</mat-error
								>
							</form>
						</app-alert>
					</div>
				</div>
			</div>
		</app-step-section>

		<app-wizard-footer (nextStepperStep)="onStepNext()"></app-wizard-footer>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class StepMdraApplicationTypeComponent implements LicenceChildStepperStepComponent {
	applicationTypeCodes = ApplicationTypeCode;
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	form = this.metalDealersApplicationService.applicationTypeFormGroup;
	formAgreement = this.metalDealersApplicationService.updateAgreementFormGroup;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private metalDealersApplicationService: MetalDealersApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();

		if (this.isUpdate) {
			this.formAgreement.markAllAsTouched();
			return this.form.valid && this.formAgreement.valid;
		}
		return this.form.valid;
	}

	onStepNext(): void {
		if (!this.isFormValid()) {
			this.utilService.scrollToErrorSection();
			return;
		}

		const applicationTypeCode = this.applicationTypeCode.value;

		this.commonApplicationService.setApplicationTitle(ServiceTypeCode.Mdra, applicationTypeCode);

		switch (applicationTypeCode) {
			case ApplicationTypeCode.New: {
				this.router.navigateByUrl(MetalDealersAndRecyclersRoutes.path(MetalDealersAndRecyclersRoutes.MDRA_NEW));
				break;
			}
			default: {
				this.router.navigateByUrl(MetalDealersAndRecyclersRoutes.path(MetalDealersAndRecyclersRoutes.MDRA_ACCESS_CODE));
				break;
			}
		}
	}

	get applicationTypeCode(): FormControl {
		return this.form.get('applicationTypeCode') as FormControl;
	}
	get isUpdate(): boolean {
		return this.applicationTypeCode.value === ApplicationTypeCode.Update;
	}
}
