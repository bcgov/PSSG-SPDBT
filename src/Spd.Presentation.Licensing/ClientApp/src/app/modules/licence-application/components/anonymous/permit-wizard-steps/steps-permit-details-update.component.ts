import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { Subscription } from 'rxjs';
import { StepPermitReprintComponent } from '../../shared/permit-wizard-steps/step-permit-reprint.component';
import { StepPermitTermsOfUseComponent } from './step-permit-terms-of-use.component';

@Component({
	selector: 'app-steps-permit-details-update',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="showTermsOfUse">
				<app-step-permit-terms-of-use [applicationTypeCode]="applicationTypeCode"></app-step-permit-terms-of-use>

				<app-wizard-footer (nextStepperStep)="onFormValidNextStep(STEP_TERMS)"></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-checklist-update></app-step-permit-checklist-update>

				<app-wizard-footer (nextStepperStep)="onGoToNextStep()"></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-confirmation></app-step-permit-confirmation>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_PERMIT_CONFIRMATION)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-reprint [applicationTypeCode]="applicationTypeCode"></app-step-permit-reprint>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_PRINT)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsPermitDetailsUpdateComponent extends BaseWizardStepComponent implements OnInit, OnDestroy {
	readonly STEP_TERMS = 0;
	readonly STEP_PERMIT_CONFIRMATION = 1;
	readonly STEP_PRINT = 2;

	private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	isLoggedIn = false;
	isFormValid = false;
	applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(StepPermitTermsOfUseComponent) termsOfUseComponent!: StepPermitTermsOfUseComponent;
	@ViewChild(StepPermitReprintComponent) stepPermitPrintComponent!: StepPermitReprintComponent;

	constructor(
		override commonApplicationService: CommonApplicationService,
		private authProcessService: AuthProcessService,
		private permitApplicationService: PermitApplicationService
	) {
		super(commonApplicationService);
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

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_TERMS:
				return this.termsOfUseComponent.isFormValid();
			case this.STEP_PERMIT_CONFIRMATION:
				return true;
			case this.STEP_PRINT:
				return this.stepPermitPrintComponent.isFormValid();
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
