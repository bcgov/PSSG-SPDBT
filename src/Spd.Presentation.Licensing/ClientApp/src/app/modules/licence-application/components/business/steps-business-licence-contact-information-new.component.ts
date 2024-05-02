import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '../../services/common-application.service';
import { StepBusinessLicenceManagerInformationComponent } from './step-business-licence-manager-information.component';

@Component({
	selector: 'app-steps-business-licence-contact-information-new',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-business-licence-manager-information></app-step-business-licence-manager-information>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onStepNext(STEP_LICENCE_MANAGER_INFORMATION)"
					(nextReviewStepperStep)="onNextReview(STEP_LICENCE_MANAGER_INFORMATION)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsBusinessLicenceContactInformationNewComponent extends BaseWizardStepComponent {
	readonly STEP_LICENCE_MANAGER_INFORMATION = 1;

	isFormValid = false;
	applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(StepBusinessLicenceManagerInformationComponent)
	stepManagerInformationComponent!: StepBusinessLicenceManagerInformationComponent;

	constructor(override commonApplicationService: CommonApplicationService) {
		super(commonApplicationService);
	}

	// ngOnInit(): void {
	// this.licenceModelChangedSubscription = this.permitApplicationService.permitModelValueChanges$.subscribe(
	// 	(_resp: any) => {
	// 		// console.debug('permitModelValueChanges$', _resp);
	// 		this.isFormValid = _resp;
	// 		this.applicationTypeCode = this.permitApplicationService.permitModelFormGroup.get(
	// 			'applicationTypeData.applicationTypeCode'
	// 		)?.value;
	// 	}
	// );
	// }

	// ngOnDestroy() {
	// 	// if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	// }

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_LICENCE_MANAGER_INFORMATION:
				return this.stepManagerInformationComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
