import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { UtilService } from '@app/core/services/util.service';
import { StepBusinessLicenceBusinessAddressComponent } from './step-business-licence-business-address.component';
import { StepBusinessLicenceBusinessInformationComponent } from './step-business-licence-business-information.component';
import { StepBusinessLicenceCompanyBrandingComponent } from './step-business-licence-company-branding.component';
import { StepBusinessLicenceEmployeesComponent } from './step-business-licence-employees.component';
import { StepBusinessLicenceExpiredComponent } from './step-business-licence-expired.component';
import { StepBusinessLicenceLiabilityComponent } from './step-business-licence-liability.component';

@Component({
	selector: 'app-steps-business-licence-swl-sp-information',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
		  <mat-step>
		    @if (isNew) {
		      <app-step-business-licence-checklist-new></app-step-business-licence-checklist-new>
		    }
		
		    @if (isRenewal) {
		      <app-step-business-licence-checklist-renew></app-step-business-licence-checklist-renew>
		    }
		
		    <app-wizard-footer
		      [isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
		      [showSaveAndExit]="showSaveAndExit"
		      (saveAndExit)="onSaveAndExit(STEP_LICENCE_CONFIRMATION)"
		      (cancelAndExit)="onCancelAndExit()"
		      cancelAndExitLabel="Cancel"
		      (nextStepperStep)="onGoToNextStep()"
		    ></app-wizard-footer>
		  </mat-step>
		
		  @if (isRenewal) {
		    <mat-step>
		      <app-step-business-licence-confirmation
		        [applicationTypeCode]="applicationTypeCode"
		      ></app-step-business-licence-confirmation>
		      <app-wizard-footer
		        [isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
		        [showSaveAndExit]="showSaveAndExit"
		        (saveAndExit)="onSaveAndExit(STEP_LICENCE_CONFIRMATION)"
		        (cancelAndExit)="onCancelAndExit()"
		        cancelAndExitLabel="Cancel"
		        (previousStepperStep)="onGoToPreviousStep()"
		        (nextStepperStep)="onFormValidNextStep(STEP_LICENCE_CONFIRMATION)"
		      ></app-wizard-footer>
		    </mat-step>
		  }
		
		  @if (isNew) {
		    <mat-step>
		      <app-step-business-licence-expired></app-step-business-licence-expired>
		      <app-wizard-footer
		        [isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
		        [showSaveAndExit]="showSaveAndExit"
		        (saveAndExit)="onSaveAndExit(STEP_LICENCE_EXPIRED)"
		        (cancelAndExit)="onCancelAndExit()"
		        cancelAndExitLabel="Cancel"
		        (previousStepperStep)="onGoToPreviousStep()"
		        (nextStepperStep)="onFormValidNextStep(STEP_LICENCE_EXPIRED)"
		      ></app-wizard-footer>
		    </mat-step>
		  }
		
		  <mat-step>
		    <app-step-business-licence-business-information
		      [isSoleProprietorCombinedFlow]="true"
		    ></app-step-business-licence-business-information>
		
		    <app-wizard-footer
		      [isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
		      [showSaveAndExit]="showSaveAndExit"
		      (saveAndExit)="onSaveAndExit(STEP_LICENCE_INFORMATION)"
		      (cancelAndExit)="onCancelAndExit()"
		      cancelAndExitLabel="Cancel"
		      (previousStepperStep)="onGoToPreviousStep()"
		      (nextStepperStep)="onFormValidNextStep(STEP_LICENCE_INFORMATION)"
		    ></app-wizard-footer>
		  </mat-step>
		
		  <mat-step>
		    <app-step-business-licence-business-address></app-step-business-licence-business-address>
		
		    <app-wizard-footer
		      [isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
		      [showSaveAndExit]="showSaveAndExit"
		      (saveAndExit)="onSaveAndExit(STEP_LICENCE_ADDRESS)"
		      (cancelAndExit)="onCancelAndExit()"
		      cancelAndExitLabel="Cancel"
		      (previousStepperStep)="onGoToPreviousStep()"
		      (nextStepperStep)="onFormValidNextStep(STEP_LICENCE_ADDRESS)"
		    ></app-wizard-footer>
		  </mat-step>
		
		  <mat-step>
		    <app-step-business-licence-company-branding
		      [applicationTypeCode]="applicationTypeCode"
		    ></app-step-business-licence-company-branding>
		
		    <app-wizard-footer
		      [isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
		      [showSaveAndExit]="showSaveAndExit"
		      (saveAndExit)="onSaveAndExit(STEP_LICENCE_BRANDING)"
		      (cancelAndExit)="onCancelAndExit()"
		      cancelAndExitLabel="Cancel"
		      (previousStepperStep)="onGoToPreviousStep()"
		      (nextStepperStep)="onFormValidNextStep(STEP_LICENCE_BRANDING)"
		    ></app-wizard-footer>
		  </mat-step>
		
		  <mat-step>
		    <app-step-business-licence-liability></app-step-business-licence-liability>
		
		    <app-wizard-footer
		      [isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
		      [showSaveAndExit]="showSaveAndExit"
		      (saveAndExit)="onSaveAndExit(STEP_LICENCE_LIABILITY)"
		      (cancelAndExit)="onCancelAndExit()"
		      cancelAndExitLabel="Cancel"
		      (previousStepperStep)="onGoToPreviousStep()"
		      (nextStepperStep)="onFormValidNextStep(STEP_LICENCE_LIABILITY)"
		    ></app-wizard-footer>
		  </mat-step>
		
		  <mat-step>
		    <app-step-business-licence-employees
		      [isBusinessLicenceSoleProprietor]="true"
		      [applicationTypeCode]="applicationTypeCode"
		    ></app-step-business-licence-employees>
		
		    <app-wizard-footer
		      [isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
		      [showSaveAndExit]="showSaveAndExit"
		      (saveAndExit)="onSaveAndExit(STEP_LICENCE_EMPLOYEES)"
		      (cancelAndExit)="onCancelAndExit()"
		      cancelAndExitLabel="Cancel"
		      (previousStepperStep)="onGoToPreviousStep()"
		      (nextStepperStep)="onStepNext(STEP_LICENCE_EMPLOYEES)"
		    ></app-wizard-footer>
		  </mat-step>
		</mat-stepper>
		`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsBusinessLicenceSwlSpInformationComponent extends BaseWizardStepComponent {
	readonly STEP_LICENCE_CONFIRMATION = 0;
	readonly STEP_LICENCE_EXPIRED = 1;
	readonly STEP_LICENCE_INFORMATION = 2;
	readonly STEP_LICENCE_ADDRESS = 3;
	readonly STEP_LICENCE_BRANDING = 4;
	readonly STEP_LICENCE_LIABILITY = 5;
	readonly STEP_LICENCE_EMPLOYEES = 6;

	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isSoleProprietorSimultaneousFlow!: boolean;
	@Input() showSaveAndExit!: boolean;

	@ViewChild(StepBusinessLicenceExpiredComponent) stepExpiredComponent!: StepBusinessLicenceExpiredComponent;
	@ViewChild(StepBusinessLicenceBusinessInformationComponent)
	stepInformationComponent!: StepBusinessLicenceBusinessInformationComponent;
	@ViewChild(StepBusinessLicenceBusinessAddressComponent)
	stepAddressComponent!: StepBusinessLicenceBusinessAddressComponent;
	@ViewChild(StepBusinessLicenceCompanyBrandingComponent)
	stepCompanyBrandingComponent!: StepBusinessLicenceCompanyBrandingComponent;
	@ViewChild(StepBusinessLicenceLiabilityComponent) stepLiabilityComponent!: StepBusinessLicenceLiabilityComponent;
	@ViewChild(StepBusinessLicenceEmployeesComponent) stepEmployeesComponent!: StepBusinessLicenceEmployeesComponent;

	constructor(
		utilService: UtilService,
		private commonApplicationService: CommonApplicationService
	) {
		super(utilService);
	}

	onGotoBusinessProfile(): void {
		this.commonApplicationService.onGotoBusinessProfile(this.applicationTypeCode);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_LICENCE_CONFIRMATION:
				return true;
			case this.STEP_LICENCE_EXPIRED:
				return this.stepExpiredComponent.isFormValid();
			case this.STEP_LICENCE_INFORMATION:
				return this.stepInformationComponent.isFormValid();
			case this.STEP_LICENCE_ADDRESS:
				return this.stepAddressComponent.isFormValid();
			case this.STEP_LICENCE_BRANDING:
				return this.stepCompanyBrandingComponent.isFormValid();
			case this.STEP_LICENCE_LIABILITY:
				return this.stepLiabilityComponent.isFormValid();
			case this.STEP_LICENCE_EMPLOYEES:
				return this.stepEmployeesComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}
}
