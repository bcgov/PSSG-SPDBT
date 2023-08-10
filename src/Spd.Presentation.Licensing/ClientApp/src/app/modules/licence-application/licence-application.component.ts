import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'app-licence-application',
	template: `
		<div class="container my-4">
			<mat-stepper
				linear
				labelPosition="bottom"
				[orientation]="orientation"
				(selectionChange)="onStepSelectionChange($event)"
				#stepper
			>
				<mat-step completed="true">
					<ng-template matStepLabel>Licence Selection</ng-template>
					<app-licence-selection></app-licence-selection>

					<div class="row mt-4">
						<div class="offset-lg-4 col-lg-4 offset-md-4 col-md-4 col-sm-12">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>

				<mat-step completed="true">
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
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Sole Proprietor</ng-template>
					<app-sole-proprietor></app-sole-proprietor>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>

				<mat-step completed="true">
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
				</mat-step>

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
				</mat-step>

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

				<mat-step completed="true">
					<ng-template matStepLabel>Police Background</ng-template>
					<app-police-background></app-police-background>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Dogs and Restraints</ng-template>
					<app-dogs-or-restraints></app-dogs-or-restraints>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Mental Health Conditions</ng-template>
					<app-mental-health-conditions></app-mental-health-conditions>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Criminal History</ng-template>
					<app-criminal-history></app-criminal-history>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Fingerprints</ng-template>
					<app-fingerprints></app-fingerprints>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Aliases</ng-template>
					<app-aliases></app-aliases>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Citizenship</ng-template>
					<app-citizenship></app-citizenship>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>BC Driver's Licence</ng-template>
					<app-bc-driver-licence></app-bc-driver-licence>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Height and Weight</ng-template>
					<app-height-and-weight></app-height-and-weight>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Photo</ng-template>
					<app-photo></app-photo>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Contact Information</ng-template>
					<app-contact-information></app-contact-information>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Licence Term</ng-template>
					<app-licence-term></app-licence-term>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Residential Address</ng-template>
					<app-address></app-address>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Summary</ng-template>
					<app-summary-review></app-summary-review>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Consent and Declaration</ng-template>
					<app-consent-and-declaration></app-consent-and-declaration>

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
