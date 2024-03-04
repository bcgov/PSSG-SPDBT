import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { Subscription } from 'rxjs';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { StepPermitTermsOfUseComponent } from './step-permit-terms-of-use.component';

@Component({
	selector: 'app-steps-permit-details-renewal',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="showTermsOfUse">
				<app-step-permit-terms-of-use [applicationTypeCode]="applicationTypeCode"></app-step-permit-terms-of-use>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12 mx-auto">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_TERMS)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-permit-checklist-renewal></app-step-permit-checklist-renewal>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12 mx-auto">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-permit-confirmation></app-step-permit-confirmation>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_PERMIT_CONFIRMATION)">
							Next
						</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsPermitDetailsRenewalComponent extends BaseWizardStepComponent implements OnInit, OnDestroy {
	readonly STEP_TERMS = 0;
	readonly STEP_PERMIT_CONFIRMATION = 1;

	private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	isLoggedIn = false;
	isFormValid = false;
	applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(StepPermitTermsOfUseComponent) termsOfUseComponent!: StepPermitTermsOfUseComponent;

	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private permitApplicationService: PermitApplicationService
	) {
		super();
	}

	ngOnInit(): void {
		this.authenticationSubscription = this.authProcessService.waitUntilAuthentication$.subscribe(
			(isLoggedIn: boolean) => {
				this.isLoggedIn = isLoggedIn;
			}
		);

		this.licenceModelChangedSubscription = this.permitApplicationService.permitModelValueChanges$.subscribe(
			(_resp: any) => {
				// console.debug('permitModelValueChanges$', _resp);
				this.isFormValid = _resp;
				this.applicationTypeCode = this.permitApplicationService.permitModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;
			}
		);
	}

	ngOnDestroy() {
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
		if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
	}

	onCancel(): void {
		this.router.navigate([LicenceApplicationRoutes.pathPermitAnonymous()]);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_TERMS:
				return this.termsOfUseComponent.isFormValid();
			case this.STEP_PERMIT_CONFIRMATION:
				return true;
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get showTermsOfUse(): boolean {
		// authenticated: agree everytime for Update
		// anonymous: agree everytime for all
		return (this.isLoggedIn && this.applicationTypeCode === ApplicationTypeCode.Update) || !this.isLoggedIn;
	}
}
