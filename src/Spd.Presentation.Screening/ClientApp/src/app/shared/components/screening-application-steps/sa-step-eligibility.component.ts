import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { AppInviteOrgData } from './screening-application.model';

@Component({
	selector: 'app-sa-step-eligibility',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-sa-checklist *ngIf="orgData" [payeeType]="orgData.payeeType"></app-sa-checklist>

				<div class="row mt-4">
					<div class="col-xxl-3 col-lg-4 col-md-4 col-sm-12 mx-auto">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext()">Start</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class SaStepEligibilityComponent {
	@Input() orgData: AppInviteOrgData | null = null;
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

	onStepNext(): void {
		this.nextStepperStep.emit(true);
	}

	onStepSelectionChange(_event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}
}
