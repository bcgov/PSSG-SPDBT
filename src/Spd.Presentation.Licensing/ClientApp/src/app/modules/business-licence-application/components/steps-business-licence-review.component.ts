import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { UtilService } from '@app/core/services/util.service';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { StepBusinessLicenceConsentAndDeclarationComponent } from './step-business-licence-consent-and-declaration.component';
import { StepBusinessLicenceSummaryComponent } from './step-business-licence-summary.component';

@Component({
	selector: 'app-steps-business-licence-review',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-business-licence-summary
					[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
					[isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
					(editStep)="onGoToStep($event)"
				></app-step-business-licence-summary>

				<app-wizard-footer
					[isFormValid]="true"
					[isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onNoSaveAndExit()"
					(cancelAndExit)="onCancelAndExit()"
					cancelAndExitLabel="Cancel"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-business-licence-consent-and-declaration
					[applicationTypeCode]="applicationTypeCode"
					[isBusinessStakeholdersWithoutSwlExist]="isBusinessStakeholdersWithoutSwlExist"
				></app-step-business-licence-consent-and-declaration>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.New">
					<ng-container *ngIf="isBusinessStakeholdersWithoutSwlExist; else noBusinessStakeholdersWithoutSwlExist">
						<app-wizard-footer
							[isFormValid]="true"
							[showSaveAndExit]="true"
							[isSoleProprietorSimultaneousFlow]="false"
							(saveAndExit)="onNoSaveAndExit()"
							nextButtonLabel="Submit"
							(previousStepperStep)="onGoToPreviousStep()"
							(nextStepperStep)="onInviteAndSubmitStep()"
						></app-wizard-footer>
					</ng-container>
					<ng-template #noBusinessStakeholdersWithoutSwlExist>
						<app-wizard-footer
							[isFormValid]="true"
							[showSaveAndExit]="true"
							[isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
							(saveAndExit)="onNoSaveAndExit()"
							(cancelAndExit)="onCancelAndExit()"
							cancelAndExitLabel="Cancel"
							nextButtonLabel="Pay Now"
							(previousStepperStep)="onGoToPreviousStep()"
							(nextStepperStep)="onPayNow()"
						></app-wizard-footer>
					</ng-template>
				</ng-container>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Update">
					<app-wizard-footer
						[showSaveAndExit]="false"
						nextButtonLabel="Pay Now"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onPayNow()"
					></app-wizard-footer>
				</ng-container>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Renewal">
					<ng-container *ngIf="isBusinessStakeholdersWithoutSwlExist; else noBusinessStakeholdersWithoutSwlExist">
						<app-wizard-footer
							nextButtonLabel="Submit"
							(previousStepperStep)="onGoToPreviousStep()"
							(nextStepperStep)="onInviteAndSubmitStep()"
						></app-wizard-footer>
					</ng-container>
					<ng-template #noBusinessStakeholdersWithoutSwlExist>
						<app-wizard-footer
							nextButtonLabel="Pay Now"
							(previousStepperStep)="onGoToPreviousStep()"
							(nextStepperStep)="onPayNow()"
						></app-wizard-footer>
					</ng-template>
				</ng-container>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsBusinessLicenceReviewComponent extends BaseWizardStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() showSaveAndExit!: boolean;
	@Input() licenceCost = 0;
	@Input() isBusinessLicenceSoleProprietor = false;
	@Input() isSoleProprietorSimultaneousFlow = false;
	@Input() isBusinessStakeholdersWithoutSwlExist = false;

	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepBusinessLicenceSummaryComponent) summaryReviewComponent!: StepBusinessLicenceSummaryComponent;
	@ViewChild(StepBusinessLicenceConsentAndDeclarationComponent)
	consentAndDeclarationComponent!: StepBusinessLicenceConsentAndDeclarationComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	onInviteAndSubmitStep(): void {
		if (!this.consentAndDeclarationComponent.isFormValid()) {
			return;
		}

		this.nextSubmitStep.emit();
	}

	onPayNow(): void {
		const isValid = this.consentAndDeclarationComponent.isFormValid();
		if (!isValid) return;

		this.nextPayStep.emit();
	}

	onGoToStep(step: number): void {
		this.goToStep.emit(step);
	}

	override onStepNext(_formNumber: number): void {
		// unused
	}

	override onFormValidNextStep(_formNumber: number): void {
		// unused
	}

	override onGoToFirstStep() {
		this.childstepper.selectedIndex = 0;
		this.summaryReviewComponent.onUpdateData();
	}
}
