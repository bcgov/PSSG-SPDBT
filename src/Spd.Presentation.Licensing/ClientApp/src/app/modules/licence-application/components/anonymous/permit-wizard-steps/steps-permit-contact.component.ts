import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { Subscription } from 'rxjs';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { StepPermitContactInformationComponent } from './step-permit-contact-information.component';
import { StepPermitMailingAddressComponent } from './step-permit-mailing-address.component';
import { StepPermitResidentialAddressComponent } from './step-permit-residential-address.component';

@Component({
	selector: 'app-steps-permit-contact',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-permit-residential-address
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-residential-address>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_RESIDENTIAL_ADDRESS)"
							*ngIf="isLoggedIn"
						>
							Save & Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_RESIDENTIAL_ADDRESS)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_RESIDENTIAL_ADDRESS)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showMailingAddressStep">
				<app-step-permit-mailing-address [applicationTypeCode]="applicationTypeCode"></app-step-permit-mailing-address>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_MAILING_ADDRESS)"
							*ngIf="isLoggedIn"
						>
							Save & Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_MAILING_ADDRESS)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_MAILING_ADDRESS)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-permit-contact-information
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-contact-information>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_CONTACT_INFORMATION)"
							*ngIf="isLoggedIn"
						>
							Save & Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_CONTACT_INFORMATION)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_CONTACT_INFORMATION)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsPermitContactComponent extends BaseWizardStepComponent implements OnInit, OnDestroy {
	readonly STEP_RESIDENTIAL_ADDRESS = 1;
	readonly STEP_MAILING_ADDRESS = 2;
	readonly STEP_CONTACT_INFORMATION = 3;

	private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	isLoggedIn = false;
	isFormValid = false;
	showMailingAddressStep!: boolean;

	applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(StepPermitResidentialAddressComponent)
	stepResidentialAddressComponent!: StepPermitResidentialAddressComponent;
	@ViewChild(StepPermitMailingAddressComponent) stepMailingAddressComponent!: StepPermitMailingAddressComponent;
	@ViewChild(StepPermitContactInformationComponent)
	stepContactInformationComponent!: StepPermitContactInformationComponent;

	constructor(
		private authProcessService: AuthProcessService,
		private permitApplicationService: PermitApplicationService
	) {
		super();
	}

	ngOnInit(): void {
		// default it
		this.showMailingAddressStep = !this.permitApplicationService.permitModelFormGroup.get(
			'residentialAddress.isMailingTheSameAsResidential'
		)?.value;

		this.licenceModelChangedSubscription = this.permitApplicationService.permitModelValueChanges$.subscribe(
			(_resp: any) => {
				// console.debug('permitModelValueChanges$', _resp);
				this.isFormValid = _resp;

				this.applicationTypeCode = this.permitApplicationService.permitModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				this.showMailingAddressStep = !this.permitApplicationService.permitModelFormGroup.get(
					'residentialAddress.isMailingTheSameAsResidential'
				)?.value;
			}
		);

		this.authenticationSubscription = this.authProcessService.waitUntilAuthentication$.subscribe(
			(isLoggedIn: boolean) => {
				this.isLoggedIn = isLoggedIn;
			}
		);
	}

	ngOnDestroy() {
		if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	override onFormValidNextStep(_formNumber: number): void {
		const isValid = this.dirtyForm(_formNumber);
		if (!isValid) return;

		this.childNextStep.next(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_RESIDENTIAL_ADDRESS:
				return this.stepResidentialAddressComponent.isFormValid();
			case this.STEP_MAILING_ADDRESS:
				return this.stepMailingAddressComponent.isFormValid();
			case this.STEP_CONTACT_INFORMATION:
				return this.stepContactInformationComponent.isFormValid();
		}
		return false;
	}
}
