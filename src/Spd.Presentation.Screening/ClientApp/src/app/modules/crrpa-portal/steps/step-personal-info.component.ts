import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { AppInviteOrgData } from '../crrpa.component';
import { ContactInformationComponent } from '../step-components/contact-information.component';
import { MailingAddressComponent } from '../step-components/mailing-address.component';
import { PersonalInformationComponent } from '../step-components/personal-information.component';
import { PreviousNameComponent } from '../step-components/previous-name.component';

@Component({
	selector: 'app-step-personal-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-contact-information *ngIf="orgData" [orgData]="orgData"></app-contact-information>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_CONTACT_INFO)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-personal-information *ngIf="orgData" [orgData]="orgData"></app-personal-information>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_PERSONAL_INFO)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-previous-name></app-previous-name>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_PREVIOUS_NAME)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-mailing-address></app-mailing-address>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_MAILING_ADDRESS)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-summary
					*ngIf="orgData"
					[orgData]="orgData"
					(reEditPersonalInformation)="onReEditPersonalInformation()"
					(reEditCrcInformation)="onReEditCrcInformation()"
				></app-summary>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="goToStepNext(STEP_SUMMARY)">
							Next
						</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepPersonalInfoComponent {
	@ViewChild('childstepper') childstepper!: MatStepper;

	@Input() orgData: AppInviteOrgData | null = null;
	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() reEditCrcData: EventEmitter<boolean> = new EventEmitter();
	@Output() getCrcData: EventEmitter<boolean> = new EventEmitter();

	readonly STEP_CONTACT_INFO: number = 1;
	readonly STEP_PERSONAL_INFO: number = 2;
	readonly STEP_PREVIOUS_NAME: number = 3;
	readonly STEP_MAILING_ADDRESS: number = 4;
	readonly STEP_SUMMARY: number = 5;

	@ViewChild(ContactInformationComponent)
	contactInformationComponent!: ContactInformationComponent;

	@ViewChild(PersonalInformationComponent)
	personalInformationComponent!: PersonalInformationComponent;

	@ViewChild(PreviousNameComponent)
	previousNameComponent!: PreviousNameComponent;

	@ViewChild(MailingAddressComponent)
	mailingAddressComponent!: MailingAddressComponent;

	getStepData(): any {
		return {
			...this.contactInformationComponent.getDataToSave(),
			...this.personalInformationComponent.getDataToSave(),
			...this.previousNameComponent.getDataToSave(),
			...this.mailingAddressComponent.getDataToSave(),
		};
	}

	onFormValidNextStep(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		if (formNumber == this.STEP_MAILING_ADDRESS) {
			this.getCrcData.emit();
		}

		this.childstepper.next();
	}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	goToStepNext(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.nextStepperStep.emit(true);
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}

	onReEditPersonalInformation(): void {
		this.childstepper.selectedIndex = 0;
	}

	onReEditCrcInformation(): void {
		this.reEditCrcData.emit(true);
	}

	private dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_CONTACT_INFO:
				this.contactInformationComponent.form.markAllAsTouched();
				return this.contactInformationComponent.isFormValid();
			case this.STEP_PERSONAL_INFO:
				this.personalInformationComponent.form.markAllAsTouched();
				return this.personalInformationComponent.isFormValid();
			case this.STEP_PREVIOUS_NAME:
				this.previousNameComponent.form.markAllAsTouched();
				return this.previousNameComponent.isFormValid();
			case this.STEP_MAILING_ADDRESS:
				this.mailingAddressComponent.form.markAllAsTouched();
				return this.mailingAddressComponent.isFormValid();
			case this.STEP_SUMMARY:
				return true;

			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
