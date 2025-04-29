import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { StepBusinessLicenceEmployeesComponent } from './step-business-licence-employees.component';

@Component({
	selector: 'app-steps-business-licence-sp-employees',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-business-licence-employees
					[isBusinessLicenceSoleProprietor]="true"
					[applicationTypeCode]="applicationTypeCode"
				></app-step-business-licence-employees>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_EMPLOYEES)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onStepNext(STEP_EMPLOYEES)"
					(nextReviewStepperStep)="onNextReview(STEP_EMPLOYEES)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsBusinessLicenceSpEmployeesComponent extends BaseWizardStepComponent {
	readonly STEP_EMPLOYEES = 0;

	@Input() isFormValid!: boolean;
	@Input() showSaveAndExit!: boolean;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepBusinessLicenceEmployeesComponent) stepEmployeesComponent!: StepBusinessLicenceEmployeesComponent;

	constructor(
		utilService: UtilService,
		private router: Router
	) {
		super(utilService);
	}

	onStepClose(): void {
		this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_EMPLOYEES:
				return this.stepEmployeesComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
