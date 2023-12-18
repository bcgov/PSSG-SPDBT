import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
	selector: 'app-base-wizard',
	template: ``,
	styles: ``,
})
export class BaseWizardComponent {
	@ViewChild('stepper') stepper!: MatStepper;

	licenceModelLoadedSubscription!: Subscription;
	isLoaded$ = new BehaviorSubject<boolean>(false);

	orientation: StepperOrientation = 'vertical';

	constructor(protected breakpointObserver: BreakpointObserver) {}

	onScrollIntoView(): void {
		this.scrollIntoView();
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
