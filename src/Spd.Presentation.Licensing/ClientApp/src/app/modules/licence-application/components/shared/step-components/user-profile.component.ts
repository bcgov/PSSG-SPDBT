import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { CommonAliasListComponent } from './common-alias-list.component';
import { ContactInformationComponent } from './contact-information.component';
import { MailingAddressComponent } from './mailing-address.component';

@Component({
	selector: 'app-user-profile',
	template: `
		<!-- <mat-divider class="mat-divider-main"></mat-divider> -->
		<div class="text-minor-heading pt-2 pb-3">Personal information</div>
		<app-personal-information [isReadOnly]="isReadOnly"></app-personal-information>

		<mat-divider class="mat-divider-main"></mat-divider>
		<div class="text-minor-heading pt-2 pb-3">Aliases or previous names</div>
		<app-common-alias-list [isReadOnly]="isReadOnly"></app-common-alias-list>

		<mat-divider class="mat-divider-main mt-3"></mat-divider>
		<div class="text-minor-heading pt-2 pb-3">Contact information</div>
		<app-contact-information [isWizardStep]="false" [isReadOnly]="isReadOnly"></app-contact-information>

		<div class="row">
			<div class="col-lg-6 col-md-12">
				<mat-divider class="mat-divider-main"></mat-divider>
				<div class="text-minor-heading pt-2 pb-3">Residential address</div>

				<app-alert type="info" icon="" [showBorder]="false">
					Has your residential address changed?
					<a [href]="addressChangeUrl" target="_blank">Change your address online</a> to update this information on your
					BC Services Card. Any changes you make will then be updated here.
				</app-alert>

				<app-residential-address [isWizardStep]="false" [isReadOnly]="true"></app-residential-address>
			</div>

			<div class="col-lg-6 col-md-12">
				<mat-divider class="mat-divider-main"></mat-divider>
				<div class="text-minor-heading pt-2 pb-3">Mailing address</div>
				<app-alert type="info" icon="" [showBorder]="false">
					Provide your mailing address, if different from your residential address. This cannot be a company address.
				</app-alert>

				<ng-container *ngIf="isMailingTheSameAsResidential; else mailingIsDifferentThanResidential">
					<div class="mb-3">
						<mat-icon style="vertical-align: bottom;">label_important</mat-icon> My mailing address is the same as my
						business address
					</div>
				</ng-container>
				<ng-template #mailingIsDifferentThanResidential>
					<app-mailing-address [isWizardStep]="false" [isReadOnly]="isReadOnly"></app-mailing-address>
				</ng-template>
			</div>
		</div>
	`,
	styles: [],
})
export class UserProfileComponent implements LicenceChildStepperStepComponent {
	addressChangeUrl = SPD_CONSTANTS.urls.addressChangeUrl;

	@ViewChild(CommonAliasListComponent) aliasesComponent!: CommonAliasListComponent;
	@ViewChild(ContactInformationComponent) contactInformationComponent!: ContactInformationComponent;
	@ViewChild(MailingAddressComponent) mailingAddressComponent!: MailingAddressComponent;

	isReadOnly = true;

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
