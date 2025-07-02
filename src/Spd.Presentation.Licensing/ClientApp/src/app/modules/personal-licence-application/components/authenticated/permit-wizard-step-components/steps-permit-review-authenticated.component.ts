import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepPermitConsentAndDeclarationComponent } from '@app/modules/personal-licence-application/components/anonymous/permit-wizard-step-components/step-permit-consent-and-declaration.component';
import { StepPermitSummaryAuthenticatedComponent } from '@app/modules/personal-licence-application/components/authenticated/permit-wizard-step-components/step-permit-summary-authenticated.component';
import { StepPermitSummaryUpdateAuthenticatedComponent } from './step-permit-summary-update-authenticated.component';

@Component({
	selector: 'app-steps-permit-review-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
		  <mat-step>
		    @if (applicationTypeCode === applicationTypeCodes.Update) {
		      <app-step-permit-summary-update-authenticated
		        [showEmployerInformation]="showEmployerInformation"
		      ></app-step-permit-summary-update-authenticated>
		    } @else {
		      <app-step-permit-summary-authenticated
		        [showEmployerInformation]="showEmployerInformation"
		        (editStep)="onGoToStep($event)"
		      ></app-step-permit-summary-authenticated>
		    }
		
		    @if (applicationTypeCode === applicationTypeCodes.New) {
		      <app-wizard-footer
		        [isFormValid]="true"
		        [showSaveAndExit]="true"
		        (saveAndExit)="onNoSaveAndExit()"
		        (previousStepperStep)="onStepPrevious()"
		        (nextStepperStep)="onGoToNextStep()"
		      ></app-wizard-footer>
		    } @else {
		      <app-wizard-footer
		        (previousStepperStep)="onStepPrevious()"
		        (nextStepperStep)="onGoToNextStep()"
		      ></app-wizard-footer>
		    }
		  </mat-step>
		
		  <mat-step>
		    <app-step-permit-consent-and-declaration
		      [serviceTypeCode]="serviceTypeCode"
		      [applicationTypeCode]="applicationTypeCode"
		    ></app-step-permit-consent-and-declaration>
		
		    @if (applicationTypeCode === applicationTypeCodes.New) {
		      <app-wizard-footer
		        [isFormValid]="true"
		        [showSaveAndExit]="true"
		        (saveAndExit)="onNoSaveAndExit()"
		        [nextButtonLabel]="submitPayLabel"
		        (previousStepperStep)="onGoToPreviousStep()"
		        (nextStepperStep)="onPayNow()"
		      ></app-wizard-footer>
		    } @else {
		      <app-wizard-footer
		        [nextButtonLabel]="submitPayLabel"
		        (previousStepperStep)="onGoToPreviousStep()"
		        (nextStepperStep)="onPayNow()"
		      ></app-wizard-footer>
		    }
		  </mat-step>
		</mat-stepper>
		`,
    styles: [],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class StepsPermitReviewAuthenticatedComponent extends BaseWizardStepComponent implements OnInit {
	submitPayLabel = '';
	applicationTypeCodes = ApplicationTypeCode;

	@Input() serviceTypeCode!: ServiceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() showEmployerInformation!: boolean;

	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepPermitSummaryAuthenticatedComponent)
	summaryReviewComponent!: StepPermitSummaryAuthenticatedComponent;
	@ViewChild(StepPermitSummaryUpdateAuthenticatedComponent)
	summaryReviewUpdateComponent!: StepPermitSummaryUpdateAuthenticatedComponent;
	@ViewChild(StepPermitConsentAndDeclarationComponent)
	consentAndDeclarationComponent!: StepPermitConsentAndDeclarationComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	ngOnInit(): void {
		this.submitPayLabel = 'Pay Now';
		if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			this.submitPayLabel = 'Submit';
		}
	}

	onPayNow(): void {
		const isValid = this.consentAndDeclarationComponent.isFormValid();
		if (!isValid) return;

		if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			this.nextSubmitStep.emit();
		} else {
			this.nextPayStep.emit();
		}
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
		if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			this.summaryReviewUpdateComponent.onUpdateData();
		} else {
			this.summaryReviewComponent.onUpdateData();
		}
	}
}
