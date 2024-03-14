import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
	selector: 'app-base-wizard',
	template: ``,
	styles: [],
})
export class BaseWizardComponent {
	@ViewChild('stepper') stepper!: MatStepper;

	orientation: StepperOrientation = 'vertical';

	constructor(protected breakpointObserver: BreakpointObserver) {}

	onScrollIntoView(): void {
		this.scrollIntoView();
	}

	onStepSelectionChange(_event: StepperSelectionEvent) {
		this.onScrollIntoView();
	}

	breakpointChanged() {
		if (this.breakpointObserver.isMatched(Breakpoints.XLarge) || this.breakpointObserver.isMatched(Breakpoints.Large)) {
			this.orientation = 'horizontal';
		} else {
			this.orientation = 'vertical';
		}
	}

	scrollIntoView(): void {
		const stepIndex = this.stepper.selectedIndex;
		const stepId = this.stepper._getStepLabelId(stepIndex);
		const stepElement = document.getElementById(stepId);
		// console.debug('scrollIntoView', 'stepIndex', stepIndex, 'stepId', stepId, 'stepElement', stepElement);

		if (stepElement) {
			setTimeout(() => {
				stepElement.scrollIntoView({
					block: 'start',
					inline: 'nearest',
					behavior: 'smooth',
				});
			}, 250);
		}
	}
}
