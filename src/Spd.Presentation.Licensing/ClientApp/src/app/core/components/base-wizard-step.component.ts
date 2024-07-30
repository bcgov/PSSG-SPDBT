import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { LicenceStepperStepComponent } from '@app/shared/services/common-application.helper';
import { CommonApplicationService } from '@app/shared/services/common-application.service';

@Component({
	selector: 'app-base-wizard-step',
	template: '',
	styles: [],
})
export class BaseWizardStepComponent implements LicenceStepperStepComponent {
	@ViewChild('childstepper') childstepper!: MatStepper;

	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() childNextStep: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() saveAndExit: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() nextReview: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() nextSubmitStep: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() nextPayStep: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(protected commonApplicationService: CommonApplicationService) {}

	onStepSelectionChange(_event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onStepNext(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.nextStepperStep.emit(true);
	}

	onSaveAndExit(_formNumber: number): void {
		this.saveAndExit.emit(true);
	}

	onNoSaveAndExit(): void {
		this.saveAndExit.emit(true);
	}

	onExit(): void {
		this.commonApplicationService.cancelAndLoseChanges();
	}

	onNextReview(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.nextReview.emit(true);
	}

	onGoToPreviousStep() {
		this.childstepper.previous();
	}

	onGoToNextStep() {
		this.childstepper.next();
	}

	onGoToFirstStep() {
		this.childstepper.selectedIndex = 0;
	}

	onGoToLastStep() {
		this.childstepper.selectedIndex = this.childstepper.steps.length - 1;
	}

	onFormValidNextStep(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.childNextStep.emit(true);
	}

	// need to override
	dirtyForm(_step: number): boolean {
		return false;
	}
}
