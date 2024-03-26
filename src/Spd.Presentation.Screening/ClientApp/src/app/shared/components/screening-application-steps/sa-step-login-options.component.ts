import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';

@Component({
	selector: 'app-sa-step-login-options',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-sa-log-in-options
					(clickNext)="onStepNext()"
					(registerWithBcServicesCard)="onRegisterWithBcServicesCard()"
					[portal]="portal"
				></app-sa-log-in-options>

				<div class="row mt-4">
					<div class="col-xxl-3 col-lg-4 col-md-4 col-sm-12 mx-auto">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class SaStepLoginOptionsComponent {
	@Input() portal!: PortalTypeCode;

	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() registerWithBcServicesCard: EventEmitter<boolean> = new EventEmitter<boolean>();

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onStepNext(): void {
		this.nextStepperStep.emit(true);
	}

	onStepSelectionChange(_event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}

	onRegisterWithBcServicesCard(): void {
		this.registerWithBcServicesCard.emit(true);
	}
}
