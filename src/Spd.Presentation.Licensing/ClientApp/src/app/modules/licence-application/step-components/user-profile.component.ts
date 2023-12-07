import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '../services/licence-application.helper';
import { LicenceApplicationService } from '../services/licence-application.service';
import { ContactInformationComponent } from './contact-information.component';

@Component({
	selector: 'app-user-profile',
	template: `
		<mat-divider class="mat-divider-main2 mt-2"></mat-divider>
		<div class="fs-5 pt-2 pb-3">Personal Information</div>
		<app-personal-information></app-personal-information>

		<mat-divider class="mat-divider-main2 mt-4"></mat-divider>
		<div class="fs-5 pt-2 pb-3">Aliases or Previous Names</div>
		<app-alias-list></app-alias-list>

		<mat-divider class="mat-divider-main2 mt-4"></mat-divider>
		<div class="fs-5 pt-2 pb-3">Contact Information</div>
		<app-contact-information [isWizardStep]="false"></app-contact-information>

		<div class="row">
			<div class="col-lg-6 col-md-12">
				<mat-divider class="mat-divider-main2 mt-4"></mat-divider>
				<div class="fs-5 pt-2 pb-3">Residential Address</div>

				<app-alert type="info" icon="">
					Has your residential address changed?
					<a href="https://www.addresschange.gov.bc.ca/" target="_blank">Change your address online</a> to update this
					information on your BC Services Card. Any changes you make will then be updated here.
				</app-alert>

				<app-residential-address [isWizardStep]="false" [isReadOnly]="true"></app-residential-address>
			</div>

			<div class="col-lg-6 col-md-12">
				<mat-divider class="mat-divider-main2 mt-4"></mat-divider>
				<div class="fs-5 pt-2 pb-3">Mailing Address</div>
				<app-alert type="info" icon="">
					Provide your mailing address, if different from your residential address. This cannot be a company address.
				</app-alert>

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
	`,
	styles: [],
})
export class UserProfileComponent implements OnInit, LicenceChildStepperStepComponent {
	@ViewChild(ContactInformationComponent) contactInformationComponent!: ContactInformationComponent;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	// form: FormGroup = this.licenceApplicationService.profileFormGroup;
	residentialForm: FormGroup = this.licenceApplicationService.residentialAddressFormGroup;

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
