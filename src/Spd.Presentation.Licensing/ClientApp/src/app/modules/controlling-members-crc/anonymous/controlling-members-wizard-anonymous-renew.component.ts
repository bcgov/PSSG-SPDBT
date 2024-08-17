import { Component } from '@angular/core';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';

@Component({
	selector: 'app-controlling-members-wizard-anonymous-renew',
	template: `
		<mat-stepper
			linear
			labelPosition="bottom"
			[orientation]="orientation"
			(selectionChange)="onStepSelectionChange($event)"
			#stepper
		>
			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel>Personal Information</ng-template>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Citizenship & Residency</ng-template>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Background</ng-template>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review</ng-template>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Submit</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
})
export class ControllingMembersWizardAnonymousRenewComponent extends BaseWizardComponent {
	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;
}
