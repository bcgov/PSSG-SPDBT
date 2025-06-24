import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { ViewportScroller } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { UtilService } from '../services/util.service';

@Component({
	selector: 'app-base-wizard',
	template: ``,
	styles: [],
	standalone: false,
})
export class BaseWizardComponent {
	@ViewChild('stepper') stepper!: MatStepper;

	orientation: StepperOrientation = 'vertical';

	constructor(
		protected breakpointObserver: BreakpointObserver,
		protected viewportScroller: ViewportScroller,
		protected utilService: UtilService
	) {}

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
		this.utilService.scrollMainContainer();
	}
}
