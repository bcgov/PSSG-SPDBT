import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { BusinessApplicationService } from '../../services/business-application.service';
import { CommonApplicationService } from '../../services/common-application.service';
import { StepBusinessLicenceConsentAndDeclarationComponent } from './step-business-licence-consent-and-declaration.component';
import { StepBusinessLicenceSummaryComponent } from './step-business-licence-summary.component';

@Component({
	selector: 'app-steps-business-licence-review',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-business-licence-summary (editStep)="onGoToStep($event)"></app-step-business-licence-summary>

				<app-wizard-footer
					[isFormValid]="true"
					[showSaveAndExit]="true"
					(saveAndExit)="onNoSaveAndExit()"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-business-licence-consent-and-declaration
					[applicationTypeCode]="applicationTypeCode"
				></app-step-business-licence-consent-and-declaration>

				<app-wizard-footer
					[isFormValid]="true"
					[showSaveAndExit]="true"
					(saveAndExit)="onNoSaveAndExit()"
					[nextButtonLabel]="submitPayLabel"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onPayNow()"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsBusinessLicenceReviewComponent extends BaseWizardStepComponent implements OnInit {
	submitPayLabel = '';
	workerLicenceTypeCode!: WorkerLicenceTypeCode;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepBusinessLicenceSummaryComponent) summaryReviewComponent!: StepBusinessLicenceSummaryComponent;
	@ViewChild(StepBusinessLicenceConsentAndDeclarationComponent)
	consentAndDeclarationComponent!: StepBusinessLicenceConsentAndDeclarationComponent;

	constructor(
		override commonApplicationService: CommonApplicationService,
		private businessApplicationService: BusinessApplicationService
	) {
		super(commonApplicationService);
	}

	ngOnInit(): void {
		this.submitPayLabel = 'Pay Now'; // TODO handle submit vs pay
		// if (this.applicationTypeCode === ApplicationTypeCode.Update) {
		// this.submitPayLabel = 'Submit';
		// }

		this.workerLicenceTypeCode = this.businessApplicationService.businessModelFormGroup.get(
			'workerLicenceTypeData.workerLicenceTypeCode'
		)?.value;
	}

	onPayNow(): void {
		const isValid = this.consentAndDeclarationComponent.isFormValid();
		if (!isValid) return;

		// if (this.applicationTypeCode === ApplicationTypeCode.Update) { // TODO handle submit vs pay
		// this.nextSubmitStep.emit();
		// } else {
		this.nextPayStep.emit();
		// }
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
