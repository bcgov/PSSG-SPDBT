import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { LicenceApplicationService } from '../licence-application.service';
import { ContactInformationComponent } from './contact-information.component';

@Component({
	selector: 'app-user-profile',
	template: `
		<!-- <mat-accordion multi="true">
			<mat-expansion-panel class="mb-2" [expanded]="true">
				<mat-expansion-panel-header>
					<mat-panel-title class="review-panel-title">
						<div class="panel-header fs-4 my-2">Contact Information</div>
					</mat-panel-title>
				</mat-expansion-panel-header>
				<div class="panel-body pt-4">
					<app-contact-information [isWizardStep]="false"></app-contact-information>
				</div>
			</mat-expansion-panel>
		</mat-accordion> -->

		<!-- <div class="row mb-2">
			<div class="col-xl-9 col-lg-8 col-md-12 col-sm-12">
				<h2>User Profile</h2>
			</div>
			<div class="col-xl-3 col-lg-4 col-md-12 col-sm-12 text-end" *ngIf="viewOnly && editable">
				<button mat-flat-button color="primary" class="large w-auto mb-2" (click)="onEditView()">
					Edit Information
				</button>
			</div>
		</div> -->

		<mat-divider class="mat-divider-main2 mt-2"></mat-divider>
		<div class="fs-5 pt-2 pb-3">Personal Information</div>

		<mat-divider class="mat-divider-main2 mt-4"></mat-divider>
		<div class="fs-5 pt-2 pb-3">Aliases or Previous Names</div>
		<app-aliases [isWizardStep]="false"></app-aliases>

		<mat-divider class="mat-divider-main2 mt-4"></mat-divider>
		<div class="fs-5 pt-2 pb-3">Contact Information</div>
		<app-contact-information [isWizardStep]="false"></app-contact-information>

		<div class="row">
			<div class="col-lg-6 col-md-12">
				<mat-divider class="mat-divider-main2 mt-4"></mat-divider>
				<div class="fs-5 pt-2 pb-3">Residential Address</div>
				<div class="mb-3">
					Has your residential address changed?
					<a href="https://www.addresschange.gov.bc.ca/" target="_blank">Change your address online</a> to update this
					information on your BC Services Card. Any changes you make will then be updated here.
				</div>
				<app-residential-address [isWizardStep]="false" [isReadOnly]="true"></app-residential-address>
				<!-- <app-residential-address [isWizardStep]="false"></app-residential-address> -->
			</div>

			<div class="col-lg-6 col-md-12">
				<mat-divider class="mat-divider-main2 mt-4"></mat-divider>
				<div class="fs-5 pt-2 pb-3">Mailing Address</div>
				<div class="mb-3">
					Provide your mailing address, if different from your residential address. This cannot be a company address.
				</div>

				<ng-container *ngIf="isMailingTheSameAsResidential; else mailingIsDifferentThanResidential">
					<div class="mb-3">
						<mat-icon style="vertical-align: bottom;">label_important</mat-icon> My mailing address is the same as my
						business address
					</div>
				</ng-container>
				<ng-template #mailingIsDifferentThanResidential>
					<app-mailing-address [isWizardStep]="false"></app-mailing-address>
				</ng-template>
			</div>
		</div>

		<!-- <div>
			<mat-divider class="mat-divider-main2 mt-4"></mat-divider>
			<div class="fs-5 pt-2 pb-3">Confirmation</div>
			<mat-checkbox formControlName="profileIsUpToDate"> I confirm that this information is up-to-date </mat-checkbox>
			<mat-error
				class="mat-option-error"
				*ngIf="
					(form.get('profileIsUpToDate')?.dirty || form.get('profileIsUpToDate')?.touched) &&
					form.get('profileIsUpToDate')?.invalid &&
					form.get('profileIsUpToDate')?.hasError('required')
				"
			>
				This is required
			</mat-error>
		</div> -->

		<!-- <div class="row" *ngIf="!viewOnly">
			<div class="offset-xl-8 offset-lg-6 col-xl-2 col-lg-3 col-md-6 col-sm-12">
				<button mat-stroked-button color="primary" class="large mb-2" (click)="onCancel()">
					<i class="fa fa-times mr-2"></i>Cancel
				</button>
			</div>
			<div class="col-xl-2 col-lg-3 col-md-6 col-sm-12">
				<button mat-flat-button color="primary" class="large mb-2" (click)="onSave()">Submit</button>
			</div>
		</div> -->
	`,
	styles: [],
})
export class UserProfileComponent implements OnInit, LicenceChildStepperStepComponent {
	@ViewChild(ContactInformationComponent) contactInformationComponent!: ContactInformationComponent;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	// form: FormGroup = this.licenceApplicationService.profileFormGroup;
	residentialForm: FormGroup = this.licenceApplicationService.residentialAddressFormGroup;

	// editable = true;
	// viewOnly = true;
	// initialValues = {};

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		// this.initialValues = this.form.value;
		// this.setFormView();
	}

	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		// this.contactInformationComponent.form.markAllAsTouched();
		// return this.form.valid && this.contactInformationComponent.form.valid;
		return true;
	}

	// onCancel(): void {
	// 	this.viewOnly = true;
	// 	this.form.reset(this.initialValues);
	// 	this.form.disable();
	// }

	// onSave(): void {}

	// onEditView() {
	// 	this.viewOnly = !this.viewOnly;
	// 	this.setFormView();
	// }

	// private setFormView(): void {
	// 	if (this.viewOnly) {
	// 		this.form.disable();
	// 	} else {
	// 		this.form.enable();
	// 	}
	// }

	get isMailingTheSameAsResidential(): boolean {
		return this.residentialForm.get('isMailingTheSameAsResidential')?.value;
	}
}
