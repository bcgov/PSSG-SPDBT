import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { PayeePreferenceTypeCode } from 'src/app/api/models';
import { AppInviteOrgData } from '../crc.component';
import { AgreementOfTermsComponent } from '../step-components/agreement-of-terms.component';
import { ConsentToCrcComponent } from '../step-components/consentToCrc.component';
import { DeclarationComponent } from '../step-components/declaration.component';

@Component({
	selector: 'app-step-terms-and-cond',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-declaration></app-declaration>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_DECLARATION)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-consent-to-crc [orgData]="orgData"></app-consent-to-crc>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_CONSENT_TO_CRC)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-agreement-of-terms></app-agreement-of-terms>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="goToStepNext(STEP_TERMS)">
							<span *ngIf="payeeType == payeePreferenceTypeCodes.Applicant; else noPay">Pay</span>
							<ng-template #noPay>Submit</ng-template>
						</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepTermsAndCondComponent {
	payeePreferenceTypeCodes = PayeePreferenceTypeCode;

	@Input() orgData!: AppInviteOrgData;
	@ViewChild('childstepper') childstepper!: MatStepper;

	@Input() payeeType!: PayeePreferenceTypeCode;

	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

	readonly STEP_DECLARATION: number = 1;
	readonly STEP_CONSENT_TO_CRC: number = 2;
	readonly STEP_TERMS: number = 3;

	@ViewChild(DeclarationComponent)
	declarationComponent!: DeclarationComponent;

	@ViewChild(ConsentToCrcComponent)
	consentToCrcComponent!: ConsentToCrcComponent;

	@ViewChild(AgreementOfTermsComponent)
	agreementOfTermsComponent!: AgreementOfTermsComponent;

	getStepData(): any {
		return {
			...this.agreementOfTermsComponent.getDataToSave(),
		};
	}

	onFormValidNextStep(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.childstepper.next();
	}

	goToStepNext(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.nextStepperStep.emit(true);
	}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}

	private dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_DECLARATION:
				this.declarationComponent.form.markAllAsTouched();
				return this.declarationComponent.isFormValid();
			case this.STEP_CONSENT_TO_CRC:
				this.consentToCrcComponent.form.markAllAsTouched();
				return this.consentToCrcComponent.isFormValid();
			case this.STEP_TERMS:
				this.agreementOfTermsComponent.form.markAllAsTouched();
				return this.agreementOfTermsComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
