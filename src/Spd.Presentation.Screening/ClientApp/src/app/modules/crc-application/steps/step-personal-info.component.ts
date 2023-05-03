import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ContactInformationComponent } from '../step-components/contact-information.component';
import { DeclarationComponent } from '../step-components/declaration.component';
import { MailingAddressComponent } from '../step-components/mailing-address.component';
import { PersonalInformationComponent } from '../step-components/personal-information.component';
import { PreviousNameComponent } from '../step-components/previous-name.component';

@Component({
	selector: 'app-step-personal-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-contact-information></app-contact-information>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(1)">Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-personal-information></app-personal-information>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(2)">Next</button>
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
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(3)">Next</button>
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
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(4)">Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-summary
					(reEditPersonalInformation)="onReEditPersonalInformation()"
					(reEditCrcInformation)="onReEditCrcInformation()"
				></app-summary>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Confirm</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-declaration></app-declaration>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="goToStepNext()">Next</button>
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

	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() reEditCrcData: EventEmitter<boolean> = new EventEmitter();

	@ViewChild(ContactInformationComponent)
	contactInformationComponent!: ContactInformationComponent;

	@ViewChild(PersonalInformationComponent)
	personalInformationComponent!: PersonalInformationComponent;

	@ViewChild(PreviousNameComponent)
	previousNameComponent!: PreviousNameComponent;

	@ViewChild(MailingAddressComponent)
	mailingAddressComponent!: MailingAddressComponent;

	@ViewChild(DeclarationComponent)
	declarationComponent!: DeclarationComponent;

	getStepData(): any {
		return {
			...this.contactInformationComponent.getDataToSave(),
			...this.personalInformationComponent.getDataToSave(),
			...this.previousNameComponent.getDataToSave(),
			...this.mailingAddressComponent.getDataToSave(),
			...this.declarationComponent.getDataToSave(),
		};
	}

	onFormValidNextStep(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.childstepper.next();
	}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	goToStepNext(): void {
		const isValid = this.dirtyForm(5);
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
			case 1:
				this.contactInformationComponent.form.markAllAsTouched();
				return this.contactInformationComponent.isFormValid();
			case 2:
				this.personalInformationComponent.form.markAllAsTouched();
				return this.personalInformationComponent.isFormValid();
			case 3:
				this.previousNameComponent.form.markAllAsTouched();
				return this.previousNameComponent.isFormValid();
			case 4:
				this.mailingAddressComponent.form.markAllAsTouched();
				return this.mailingAddressComponent.isFormValid();
			case 5:
				this.declarationComponent.form.markAllAsTouched();
				return this.declarationComponent.isFormValid();

			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
