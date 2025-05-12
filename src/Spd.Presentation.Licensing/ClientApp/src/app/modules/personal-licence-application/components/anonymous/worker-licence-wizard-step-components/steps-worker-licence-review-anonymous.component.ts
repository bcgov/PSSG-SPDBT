import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepWorkerLicenceConsentAndDeclarationComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-consent-and-declaration.component';
import { StepWorkerLicenceSummaryAnonymousComponent } from './step-worker-licence-summary-anonymous.component';

@Component({
	selector: 'app-steps-worker-licence-review-anonymous',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-worker-licence-summary-anonymous
					(editStep)="onGoToStep($event)"
					[showCitizenshipStep]="showCitizenshipStep"
				></app-step-worker-licence-summary-anonymous>

				<app-wizard-footer
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-consent-and-declaration
					[applicationTypeCode]="applicationTypeCode"
					[isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
					[isAnonymous]="true"
				></app-step-worker-licence-consent-and-declaration>

				<ng-container *ngIf="isSoleProprietorSimultaneousFlow; else IsNotSoleProprietor">
					<app-wizard-footer
						nextButtonLabel="Save & Continue to Business Licence Application"
						[isWidestNext]="true"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onSaveSoleProprietor()"
					></app-wizard-footer>
				</ng-container>
				<ng-template #IsNotSoleProprietor>
					<app-wizard-footer
						[nextButtonLabel]="submitButtonName"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onSubmitNow()"
					></app-wizard-footer>
				</ng-template>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode === applicationTypeCodes.Update">
				<app-step-worker-licence-update-fee [licenceCost]="licenceCost"></app-step-worker-licence-update-fee>

				<app-wizard-footer
					[showExit]="false"
					nextButtonLabel="Pay Now"
					(nextStepperStep)="onPayNow()"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsWorkerLicenceReviewAnonymousComponent extends BaseWizardStepComponent implements OnInit {
	applicationTypeCodes = ApplicationTypeCode;
	submitButtonName = 'Pay Now';

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() licenceCost = 0;
	@Input() isSoleProprietorSimultaneousFlow = false;
	@Input() showCitizenshipStep = true;

	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepWorkerLicenceSummaryAnonymousComponent)
	summaryReviewComponent!: StepWorkerLicenceSummaryAnonymousComponent;
	@ViewChild(StepWorkerLicenceConsentAndDeclarationComponent)
	consentAndDeclarationComponent!: StepWorkerLicenceConsentAndDeclarationComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	ngOnInit(): void {
		if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			this.submitButtonName = 'Submit';
		}
	}

	onSubmitNow(): void {
		if (!this.consentAndDeclarationComponent.isFormValid()) {
			return;
		}

		// Update is a special case. The change might not require a payment
		// so just submit at this point
		if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			this.nextSubmitStep.emit();
		} else {
			this.nextPayStep.emit();
		}
	}

	onPayNow(): void {
		if (!this.consentAndDeclarationComponent.isFormValid()) {
			return;
		}

		this.nextPayStep.emit();
	}

	onSaveSoleProprietor(): void {
		if (!this.consentAndDeclarationComponent.isFormValid()) {
			return;
		}

		this.nextSubmitStep.emit();
	}

	onGoToStep(step: number): void {
		this.goToStep.emit(step);
	}

	override onGoToFirstStep() {
		this.childstepper.selectedIndex = 0;
		this.summaryReviewComponent.onUpdateData();
	}

	override onStepNext(_formNumber: number): void {
		// unused
	}

	override onFormValidNextStep(_formNumber: number): void {
		// unused
	}
}
