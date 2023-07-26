import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppInviteOrgData } from './screening-application.model';
import { SaSecurityInformationComponent } from './step-components/sa-security-information.component';

@Component({
	selector: 'app-sa-step-organization-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)">
			<mat-step>
				<app-sa-security-information *ngIf="orgData" [orgData]="orgData"></app-sa-security-information>

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
export class SaStepOrganizationInfoComponent {
	@Input() orgData: AppInviteOrgData | null = null;
	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

	@ViewChild(SaSecurityInformationComponent)
	securityInformationComponent!: SaSecurityInformationComponent;

	getStepData(): any {
		return {
			...this.securityInformationComponent.getDataToSave(),
		};
	}

	setStepData(data: any): void {
		this.securityInformationComponent.setStepData(data);
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
