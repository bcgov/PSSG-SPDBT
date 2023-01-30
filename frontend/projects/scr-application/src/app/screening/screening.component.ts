import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { distinctUntilChanged } from 'rxjs';

export interface RegistrationFormStepComponent {
  getDataToSave(): any;
  clearCurrentData(): void;
  isFormValid(): boolean;
}

@Component({
  selector: 'app-screening',
  template: ` screening `,
  styles: [
    `
      .mat-horizontal-stepper-header {
        pointer-events: none !important;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ScreeningComponent implements OnInit {
  orientation: StepperOrientation = 'vertical';

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([
        Breakpoints.Large,
        Breakpoints.Medium,
        Breakpoints.Small,
        '(min-width: 500px)',
      ])
      .pipe(
        // tap((value) => console.log(value)),
        distinctUntilChanged()
      )
      .subscribe(() => this.breakpointChanged());
  }

  private breakpointChanged() {
    if (
      this.breakpointObserver.isMatched(Breakpoints.XLarge) ||
      this.breakpointObserver.isMatched(Breakpoints.Large)
    ) {
      this.orientation = 'horizontal';
    } else {
      this.orientation = 'vertical';
    }

    // if(this.breakpointObserver.isMatched(Breakpoints.Medium)) {
    // 	this.orientation = 'horizontal';
    //   this.currentBreakpoint = Breakpoints.Medium;
    // } else if(this.breakpointObserver.isMatched(Breakpoints.Small)) {
    // 	this.orientation = 'vertical';
    //   this.currentBreakpoint = Breakpoints.Small;
    // } else if(this.breakpointObserver.isMatched('(min-width: 500px)')) {
    //   this.currentBreakpoint = '(min-width: 500px)';
    // }
  }
}
