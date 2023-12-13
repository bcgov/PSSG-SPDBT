import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { LicenceChildStepperStepComponent } from '../services/licence-application.helper';
import { LicenceApplicationService } from '../services/licence-application.service';
import { AliasListComponent } from './alias-list.component';
import { ContactInformationComponent } from './contact-information.component';
import { MailingAddressComponent } from './mailing-address.component';

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
	`,
	styles: [],
})
export class UserProfileComponent implements LicenceChildStepperStepComponent {
	@ViewChild(AliasListComponent) aliasesComponent!: AliasListComponent;
	@ViewChild(ContactInformationComponent) contactInformationComponent!: ContactInformationComponent;
	@ViewChild(MailingAddressComponent) mailingAddressComponent!: MailingAddressComponent;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		const contactIsValid = this.contactInformationComponent.isFormValid();
		const aliasesIsValid = this.aliasesComponent.isFormValid();
		const mailingIsValid = this.isMailingTheSameAsResidential ? true : this.mailingAddressComponent.isFormValid();

		console.log('UserProfileComponent', contactIsValid, aliasesIsValid, mailingIsValid);
		return contactIsValid && aliasesIsValid && mailingIsValid;
	}

	get isMailingTheSameAsResidential(): boolean {
		return this.licenceApplicationService.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value;
	}
}
