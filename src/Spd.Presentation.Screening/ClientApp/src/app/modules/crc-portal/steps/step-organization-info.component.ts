import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CrcRequestCreateRequest } from '../crc.component';
import { SecurityInformationComponent } from '../step-components/security-information.component';

@Component({
	selector: 'app-step-organization-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)">
			<mat-step>
				<app-security-information [orgData]="orgData"></app-security-information>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext()">Next</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepOrganizationInfoComponent {
	@Input() orgData!: CrcRequestCreateRequest;

	@Input() paymentBy!: 'APP' | 'ORG';
	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

	@ViewChild(SecurityInformationComponent)
	securityInformationComponent!: SecurityInformationComponent;

	getStepData(): any {
		return {
			...this.securityInformationComponent.getDataToSave(),
		};
	}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onStepNext(): void {
		this.securityInformationComponent.form.markAllAsTouched();
		const isValid = this.securityInformationComponent.isFormValid();
		if (!isValid) return;

		this.nextStepperStep.emit(true);
	}

	onStepSelectionChange(_event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}
}
