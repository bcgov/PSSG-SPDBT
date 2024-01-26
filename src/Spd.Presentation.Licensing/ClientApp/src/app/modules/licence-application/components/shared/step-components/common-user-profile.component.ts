import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { CommonAliasListComponent } from './common-alias-list.component';
import { CommonContactInformationComponent } from './common-contact-information.component';
import { CommonMailingAddressComponent } from './common-mailing-address.component';

@Component({
	selector: 'app-common-user-profile',
	template: `
		<!-- <mat-divider class="mat-divider-main"></mat-divider> -->
		<div class="text-minor-heading pt-2 pb-3">Personal Information</div>
		<app-common-user-profile-personal-information [isReadOnly]="isReadOnly"></app-common-user-profile-personal-information>

		<mat-divider class="mat-divider-main"></mat-divider>
		<div class="text-minor-heading pt-2 pb-3">Aliases or Previous Names</div>
		<app-common-alias-list [form]="aliasesFormGroup" [isReadOnly]="isReadOnly"></app-common-alias-list>

		<mat-divider class="mat-divider-main mt-3"></mat-divider>
		<div class="text-minor-heading pt-2 pb-3">Contact Information</div>
		<app-common-contact-information
			[form]="contactInformationFormGroup"
			[isWizardStep]="false"
			[isReadOnly]="isReadOnly"
		></app-common-contact-information>

		<div class="row">
			<div class="col-lg-6 col-md-12">
				<mat-divider class="mat-divider-main"></mat-divider>
				<div class="text-minor-heading pt-2 pb-3">Residential Address</div>

				<app-alert type="info" icon="" [showBorder]="false">
					Has your residential address changed?
					<a [href]="addressChangeUrl" target="_blank">Change your address online</a> to update this information on your
					BC Services Card. Any changes you make will then be updated here.
				</app-alert>

				<app-common-residential-address
					[form]="residentialAddressFormGroup"
					[isWizardStep]="false"
					[isReadOnly]="true"
				></app-common-residential-address>
			</div>

			<div class="col-lg-6 col-md-12">
				<mat-divider class="mat-divider-main"></mat-divider>
				<div class="text-minor-heading pt-2 pb-3">Mailing Address</div>
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
					<app-common-mailing-address
						[form]="mailingAddressFormGroup"
						[isWizardStep]="false"
						[isReadOnly]="isReadOnly"
					></app-common-mailing-address>
				</ng-template>
			</div>
		</div>
	`,
	styles: [],
})
export class CommonUserProfileComponent implements LicenceChildStepperStepComponent {
	addressChangeUrl = SPD_CONSTANTS.urls.addressChangeUrl;

	contactInformationFormGroup: FormGroup = this.licenceApplicationService.contactInformationFormGroup;
	aliasesFormGroup: FormGroup = this.licenceApplicationService.aliasesFormGroup;
	residentialAddressFormGroup: FormGroup = this.licenceApplicationService.residentialAddressFormGroup;
	mailingAddressFormGroup: FormGroup = this.licenceApplicationService.mailingAddressFormGroup;

	@ViewChild(CommonAliasListComponent) aliasesComponent!: CommonAliasListComponent;
	@ViewChild(CommonContactInformationComponent) contactInformationComponent!: CommonContactInformationComponent;
	@ViewChild(CommonMailingAddressComponent) mailingAddressComponent!: CommonMailingAddressComponent;

	isReadOnly = true;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		const contactIsValid = this.isContactInformationFormGroupFormValid();
		const aliasesIsValid = this.isAliasesFormGroupFormValid();
		const mailingIsValid = this.isMailingTheSameAsResidential ? true : this.isMailingAddressFormGroupValid();

		console.log('UserProfileComponent', contactIsValid, aliasesIsValid, mailingIsValid);
		return contactIsValid && aliasesIsValid && mailingIsValid;
	}

	isContactInformationFormGroupFormValid(): boolean {
		this.contactInformationFormGroup.markAllAsTouched();
		return this.contactInformationFormGroup.valid;
	}

	isAliasesFormGroupFormValid(): boolean {
		this.aliasesFormGroup.markAllAsTouched();
		return this.aliasesFormGroup.valid;
	}

	isMailingAddressFormGroupValid(): boolean {
		this.mailingAddressFormGroup.markAllAsTouched();
		return this.mailingAddressFormGroup.valid;
	}

	get isMailingTheSameAsResidential(): boolean {
		return this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value;
	}
}
