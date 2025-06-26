import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonBusinessLicenceSummaryComponent } from './common-business-licence-summary.component';

@Component({
	selector: 'app-step-business-licence-summary',
	template: `
		<app-step-section
			heading="Application summary"
			subheading="Review your information before submitting your application"
		>
			<app-common-business-licence-summary
				[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
				[isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
				(editStep)="onEditStep($event)"
			></app-common-business-licence-summary>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepBusinessLicenceSummaryComponent {
	@ViewChild(CommonBusinessLicenceSummaryComponent) summaryComponent!: CommonBusinessLicenceSummaryComponent;

	@Input() isBusinessLicenceSoleProprietor!: boolean;
	@Input() isSoleProprietorSimultaneousFlow!: boolean;
	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	onEditStep(stepNumber: number) {
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.summaryComponent.onUpdateData();
	}
}
