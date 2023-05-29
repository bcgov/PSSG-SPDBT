import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { distinctUntilChanged } from 'rxjs';
import { EmployeeInteractionTypeCode } from 'src/app/api/models';
import { EmployeeInteractionTypes } from 'src/app/core/constants/model-desc';
import { StepApplSubmittedComponent } from './steps/step-appl-submitted.component';
import { StepEligibilityComponent } from './steps/step-eligibility.component';
import { StepLoginOptionsComponent } from './steps/step-login-options.component';
import { StepOrganizationInfoComponent } from './steps/step-organization-info.component';
import { StepPersonalInfoComponent } from './steps/step-personal-info.component';
import { StepTermsAndCondComponent } from './steps/step-terms-and-cond.component';

export interface CrcFormStepComponent {
	getDataToSave(): any;
	isFormValid(): boolean;
}

export interface CrcRequestCreateRequest {
	orgId?: string;
	orgName?: string;
	orgPhoneNumber?: string;
	givenName?: string | null;
	middleName1?: string | null;
	middleName2?: string | null;
	surname?: string | null;
	emailAddress?: string | null;
	jobTitle?: string | null;
	phoneNumber?: string | null;
	address?: string | null;
	oneLegalName?: boolean | null;
	facilityNameRequired?: boolean | null;
	vulnerableSectorCategory?: EmployeeInteractionTypeCode | null;
	vulnerableSectorCategoryDesc?: string | null;
}

@Component({
	selector: 'app-crc',
	template: `
		<div class="container mt-4">
			<mat-stepper
				linear
				labelPosition="bottom"
				[orientation]="orientation"
				(selectionChange)="onStepSelectionChange($event)"
				#stepper
			>
				<mat-step completed="false">
					<ng-template matStepLabel>Eligibility Check</ng-template>
					<app-step-eligibility
						[paymentBy]="paymentBy"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
					></app-step-eligibility>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Organization Information</ng-template>
					<app-step-organization-info
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						[orgData]="orgData"
					></app-step-organization-info>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Log In</ng-template>
					<app-step-login-options
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
					></app-step-login-options>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Personal Information</ng-template>
					<app-step-personal-info
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						(reEditCrcData)="onReEditCrcData()"
						(getCrcData)="onGetCrcData()"
						[orgData]="orgData"
						[crcData]="crcData"
					></app-step-personal-info>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Terms and Conditions</ng-template>
					<app-step-terms-and-cond
						[paymentBy]="paymentBy"
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onSaveStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						[orgData]="orgData"
					></app-step-terms-and-cond>
				</mat-step>

				<!-- PAYMENT PROCESS?
				 <mat-step completed="false" *ngIf="paymentBy == 'APP'">
				<ng-template matStepLabel>Pay for Application</ng-template>
				<app-step-pay-for-application
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-step-pay-for-application>
			</mat-step> -->

				<mat-step completed="false">
					<ng-template matStepLabel>Application Submitted</ng-template>
					<app-step-appl-submitted
						[paymentBy]="paymentBy"
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
					></app-step-appl-submitted>
				</mat-step>
			</mat-stepper>
		</div>
	`,
	styles: [],
})
export class CrcComponent implements OnInit {
	orgData!: CrcRequestCreateRequest;
	crcData!: any;
	orientation: StepperOrientation = 'vertical';
	paymentBy!: 'APP' | 'ORG';

	@ViewChild('stepper') stepper!: MatStepper;

	@ViewChild(StepEligibilityComponent)
	stepEligibilityComponent!: StepEligibilityComponent;

	@ViewChild(StepApplSubmittedComponent)
	stepApplSubmittedComponent!: StepApplSubmittedComponent;

	@ViewChild(StepLoginOptionsComponent)
	stepLoginOptionsComponent!: StepLoginOptionsComponent;

	@ViewChild(StepOrganizationInfoComponent)
	stepOrganizationInfoComponent!: StepOrganizationInfoComponent;

	@ViewChild(StepPersonalInfoComponent)
	stepPersonalInfoComponent!: StepPersonalInfoComponent;

	@ViewChild(StepTermsAndCondComponent)
	stepTermsAndCondComponent!: StepTermsAndCondComponent;

	constructor(private breakpointObserver: BreakpointObserver, private location: Location) {}

	ngOnInit(): void {
		this.paymentBy = (this.location.getState() as any).paymentBy;

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(
				// tap((value) => console.log(value)),
				distinctUntilChanged()
			)
			.subscribe(() => this.breakpointChanged());

		this.orgData = {
			orgId: 'abcdef123',
			orgName: 'Anikon Ltd',
			orgPhoneNumber: '2507776655',
			givenName: 'Ann',
			middleName1: 'Amber',
			middleName2: 'Annie',
			surname: 'Anderson',
			emailAddress: 'Ann@two.com',
			jobTitle: 'Aaaa',
			phoneNumber: '2504479898',
			address: '760 Andy Ave, Victoria, BC V8X 2W6, Canada',
			facilityNameRequired: false,
			vulnerableSectorCategory: EmployeeInteractionTypeCode.ChildrenAndAdults,
			oneLegalName: false,
		};

		this.orgData.vulnerableSectorCategoryDesc = EmployeeInteractionTypes.find(
			(item) => item.code == this.orgData.vulnerableSectorCategory
		)?.desc as string;
	}

	onScrollIntoView(): void {
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

	onReEditCrcData(): void {
		this.stepper.selectedIndex = 1;
		this.stepPersonalInfoComponent.childstepper.selectedIndex = 0;
	}

	onGetCrcData(): void {
		this.crcData = { ...this.orgData, ...this.getDataToSave() };
		console.log('onGetCrcData crcData', this.crcData);
	}

	onStepSelectionChange(_event: StepperSelectionEvent) {
		this.onScrollIntoView();
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();
	}

	onNextStepperStep(stepper: MatStepper): void {
		console.log('onNextStepperStep', stepper.selectedIndex);
		// complete the current step
		if (stepper?.selected) stepper.selected.completed = true;

		if (stepper.selectedIndex == 3) {
			// make these steps uneditable...
			// so that after save, user cannot navigate to any of these steps
			for (let i = 0; i <= stepper.selectedIndex; i++) {
				let step = this.stepper.steps.get(i);
				if (step) {
					step.editable = false;
				}
			}
		}

		this.stepper.next();
	}

	// onNextSummaryStepperStep(stepper: MatStepper): void {
	// 	console.log('onNextSummaryStepperStep', stepper.selectedIndex);
	// 	// complete the current step
	// 	if (stepper?.selected) stepper.selected.completed = true;

	// 	this.crcData = { ...this.orgData, ...this.getDataToSave() };
	// 	console.log('onNextSummaryStepperStep crcData', this.crcData);

	// 	// make these steps uneditable...
	// 	// so that after save, user cannot navigate to any of these steps
	// 	for (let i = 0; i <= stepper.selectedIndex; i++) {
	// 		let step = this.stepper.steps.get(i);
	// 		if (step) {
	// 			step.editable = false;
	// 		}
	// 	}

	// 	this.stepper.next();
	// }

	onSaveStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;

		let dataToSave = this.getDataToSave();
		console.log('onSaveStepperStep', dataToSave);

		// make these steps uneditable...
		// so that after save, user cannot navigate to any of these steps
		for (let i = 0; i <= 4; i++) {
			let step = this.stepper.steps.get(i);
			if (step) {
				step.editable = false;
			}
		}
		this.stepper.next();
	}

	private getDataToSave(): any {
		let dataToSave = {};
		if (this.stepOrganizationInfoComponent) {
			dataToSave = { ...dataToSave, ...this.stepOrganizationInfoComponent.getStepData() };
		}
		if (this.stepPersonalInfoComponent) {
			dataToSave = { ...dataToSave, ...this.stepPersonalInfoComponent.getStepData() };
		}
		if (this.stepTermsAndCondComponent) {
			dataToSave = { ...dataToSave, ...this.stepTermsAndCondComponent.getStepData() };
		}
		console.log('onSaveStepperStep', dataToSave);
		return dataToSave;
	}

	private breakpointChanged() {
		if (this.breakpointObserver.isMatched(Breakpoints.XLarge) || this.breakpointObserver.isMatched(Breakpoints.Large)) {
			this.orientation = 'horizontal';
		} else {
			this.orientation = 'vertical';
		}
	}
}
