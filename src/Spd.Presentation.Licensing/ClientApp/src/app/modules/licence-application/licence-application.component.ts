import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'app-licence-application',
	template: `
		<div class="container mt-4">
			<mat-stepper
				linear
				labelPosition="bottom"
				[orientation]="orientation"
				(selectionChange)="onStepSelectionChange($event)"
				#stepper
			>
				<!-- <mat-step completed="true">
					<ng-template matStepLabel>Licence Selection</ng-template>
					<app-licence-selection></app-licence-selection>

					<div class="row mt-4">
						<div class="offset-lg-4 col-lg-4 offset-md-4 col-md-4 col-sm-12">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step> -->

				<!-- <mat-step completed="true">
					<ng-template matStepLabel>Licence Type</ng-template>
					<app-licence-type></app-licence-type>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step> -->

				<!-- <mat-step completed="true">
					<ng-template matStepLabel>Sole Proprietor</ng-template>
					<app-sole-proprietor></app-sole-proprietor>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div> -->

				<!-- <mat-step completed="true">
					<ng-template matStepLabel>Checklist</ng-template>
					<app-checklist></app-checklist>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step> -->
				<!-- 
				<mat-step completed="true">
					<ng-template matStepLabel>Checklist</ng-template>
					<app-personal-information></app-personal-information>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step> -->

				<mat-step completed="true">
					<ng-template matStepLabel>Licence Expired</ng-template>
					<app-licence-expired></app-licence-expired>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>
			</mat-stepper>
		</div>
	`,
	styles: [],
})
export class LicenceApplicationComponent implements OnInit {
	orientation: StepperOrientation = 'vertical';

	@ViewChild('stepper') stepper!: MatStepper;

	constructor(private breakpointObserver: BreakpointObserver) {}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		this.onScrollIntoView();
	}

	private breakpointChanged() {
		if (this.breakpointObserver.isMatched(Breakpoints.XLarge) || this.breakpointObserver.isMatched(Breakpoints.Large)) {
			this.orientation = 'horizontal';
		} else {
			this.orientation = 'vertical';
		}
	}

	private onScrollIntoView(): void {
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
