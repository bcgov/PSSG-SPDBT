import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { PayerPreferenceTypeCode } from 'src/app/api/models';
import { AppInviteOrgData } from '../crrpa.component';
import { AgreementOfTermsComponent } from '../step-components/agreement-of-terms.component';
import { ConsentToCrcComponent } from '../step-components/consentToCrc.component';
import { DeclarationComponent } from '../step-components/declaration.component';

@Component({
	selector: 'app-step-terms-and-cond',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-declaration *ngIf="orgData" [orgData]="orgData"></app-declaration>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onDeclarationNextStep(STEP_DECLARATION)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="agreeToShare">
				<app-consent-to-crc *ngIf="orgData" [orgData]="orgData"></app-consent-to-crc>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onConsentToCrcNextStep(STEP_CONSENT_TO_CRC)"
						>
							Submit
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
						<ng-container *ngIf="orgData?.performPaymentProcess; else noPay">
							<button
								mat-flat-button
								color="primary"
								class="large mb-2"
								(click)="goToStepNext(STEP_TERMS)"
								aria-label="Pay now"
							>
								Pay Now
							</button>
						</ng-container>
						<ng-template #noPay>
							<button
								mat-flat-button
								color="primary"
								class="large mb-2"
								(click)="goToStepNext(STEP_TERMS)"
								aria-label="Submit"
							>
								Submit
							</button>
						</ng-template>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepTermsAndCondComponent {
	payeePreferenceTypeCodes = PayerPreferenceTypeCode;
	agreeToShare: boolean = false;

	@ViewChild('childstepper') childstepper!: MatStepper;

	@Input() orgData: AppInviteOrgData | null = null;
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
			...this.consentToCrcComponent?.getDataToSave(),
			...this.declarationComponent.getDataToSave(),
			...this.agreementOfTermsComponent.getDataToSave(),
		};
	}

	onDeclarationNextStep(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		const declarationData = this.declarationComponent.getDataToSave();
		if (declarationData.agreeToShare) {
			this.orgData!.performPaymentProcess = false;
			this.agreeToShare = true;
		} else {
			this.orgData!.performPaymentProcess = this.orgData?.payeeType == PayerPreferenceTypeCode.Applicant ? true : false;
			this.agreeToShare = false;
		}

		this.childstepper.next();
	}

	onConsentToCrcNextStep(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.nextStepperStep.emit(true);
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
