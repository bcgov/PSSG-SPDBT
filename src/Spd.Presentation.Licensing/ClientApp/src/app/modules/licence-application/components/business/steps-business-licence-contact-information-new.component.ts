import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { Subscription } from 'rxjs';
import { BusinessApplicationService } from '../../services/business-application.service';
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
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_LICENCE_MANAGER_INFORMATION)"
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
export class StepsBusinessLicenceContactInformationNewComponent extends BaseWizardStepComponent implements OnInit {
	readonly STEP_LICENCE_MANAGER_INFORMATION = 1;

	isFormValid = false;
	showSaveAndExit = false;

	@ViewChild(StepBusinessLicenceManagerInformationComponent)
	stepManagerInformationComponent!: StepBusinessLicenceManagerInformationComponent;

	private licenceModelChangedSubscription!: Subscription;

	constructor(
		override commonApplicationService: CommonApplicationService,
		private businessApplicationService: BusinessApplicationService
	) {
		super(commonApplicationService);
	}

	ngOnInit(): void {
		this.licenceModelChangedSubscription = this.businessApplicationService.businessModelValueChanges$.subscribe(
			(_resp: any) => {
				this.isFormValid = _resp;

				this.showSaveAndExit = this.businessApplicationService.isAutoSave();
			}
		);
	}

	ngOnDestroy() {
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

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
