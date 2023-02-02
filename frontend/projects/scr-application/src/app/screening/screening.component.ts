import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged } from 'rxjs';

export interface RegistrationFormStepComponent {
	getDataToSave(): any;
	clearCurrentData(): void;
	isFormValid(): boolean;
}

@Component({
	selector: 'app-screening',
	template: ` screening `,
	styles: [],
})
export class ScreeningComponent implements OnInit {
	orientation: StepperOrientation = 'vertical';

	constructor(private breakpointObserver: BreakpointObserver) {}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(
				// tap((value) => console.log(value)),
				distinctUntilChanged()
			)
			.subscribe(() => this.breakpointChanged());
	}

	private breakpointChanged() {
		if (this.breakpointObserver.isMatched(Breakpoints.XLarge) || this.breakpointObserver.isMatched(Breakpoints.Large)) {
			this.orientation = 'horizontal';
		} else {
			this.orientation = 'vertical';
		}
	}
}
