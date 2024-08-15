import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { AppInviteOrgData } from './screening-application.model';
import { SaAgreementOfTermsComponent } from './step-components/sa-agreement-of-terms.component';
import { SaSecurityInformationComponent } from './step-components/sa-security-information.component';

@Component({
	selector: 'app-sa-step-organization-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-sa-security-information *ngIf="orgData" [orgData]="orgData"></app-sa-security-information>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_SECURITY_INFO)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-sa-agreement-of-terms *ngIf="orgData" [orgData]="orgData"></app-sa-agreement-of-terms>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext()">Next</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class SaStepOrganizationInfoComponent {
	@ViewChild('childstepper') childstepper!: MatStepper;

	@Input() orgData: AppInviteOrgData | null = null;
	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

	readonly STEP_SECURITY_INFO: number = 1;
	readonly STEP_TERMS: number = 2;

	@ViewChild(SaSecurityInformationComponent)
	securityInformationComponent!: SaSecurityInformationComponent;

	@ViewChild(SaAgreementOfTermsComponent)
	agreementOfTermsComponent!: SaAgreementOfTermsComponent;

	getStepData(): any {
		return {
			...this.securityInformationComponent.getDataToSave(),
		};
	}

	setStepData(data: any): void {
		this.securityInformationComponent.setStepData(data);
	}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onFormValidNextStep(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.childstepper.next();
	}

	onStepNext(): void {
		const isValid = this.dirtyForm(this.STEP_TERMS);
		if (!isValid) return;

		this.nextStepperStep.emit(true);
	}

	onStepSelectionChange(_event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}

	onGoToFirstStep() {
		this.childstepper.selectedIndex = 0;
	}

	onGoToLastStep() {
		this.childstepper.selectedIndex = this.childstepper.steps.length - 1;
	}

	private dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_SECURITY_INFO:
				this.securityInformationComponent.form.markAllAsTouched();
				return this.securityInformationComponent.isFormValid();
			case this.STEP_TERMS:
				this.agreementOfTermsComponent.form.markAllAsTouched();
				return this.agreementOfTermsComponent.isFormValid();

			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
