import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { CommonAddressComponent } from '../../shared/step-components/common-address.component';
import { CommonAliasListComponent } from '../../shared/step-components/common-alias-list.component';
import { CommonContactInformationComponent } from '../../shared/step-components/common-contact-information.component';
import { CommonUserProfilePersonalInformationComponent } from './common-user-profile-personal-information.component';

@Component({
	selector: 'app-common-user-profile',
	template: `
		<div class="text-minor-heading pt-2 pb-3">Personal Information</div>
		<app-common-user-profile-personal-information
			[isReadOnly]="isReadOnly"
		></app-common-user-profile-personal-information>

		<mat-divider class="mat-divider-main"></mat-divider>
		<div class="text-minor-heading pt-2 pb-3">Aliases or Previous Names</div>
		<app-common-alias-list [form]="aliasesFormGroup" [isReadOnly]="isReadOnly"></app-common-alias-list>

		<div class="row mt-3">
			<div class="col-lg-6 col-md-12">
				<mat-divider class="mat-divider-main"></mat-divider>
				<div class="text-minor-heading pt-2 pb-3">Residential Address</div>

				<app-alert type="info" icon="" [showBorder]="false">
					Has your residential address changed?
					<a [href]="addressChangeUrl" target="_blank">Change your address online</a> to update this information on your
					BC Services Card. Any changes you make will then be updated here.
				</app-alert>
			</div>

			<div class="col-lg-6 col-md-12">
				<mat-divider class="mat-divider-main"></mat-divider>
				<div class="text-minor-heading pt-2 pb-3">Mailing Address</div>
				<app-alert type="info" icon="" [showBorder]="false">
					Provide your mailing address, if different from your residential address. This cannot be a company address.
				</app-alert>
			</div>

			<div class="col-lg-6 col-md-12">
				<app-common-residential-address
					[form]="residentialAddressFormGroup"
					[isWizardStep]="false"
					[isReadOnly]="true"
					[isCheckboxReadOnly]="false"
				></app-common-residential-address>
			</div>

			<div class="col-lg-6 col-md-12">
				<ng-container *ngIf="isMailingTheSameAsResidential; else mailingIsDifferentThanResidential">
					<div class="mb-3">
						<mat-icon style="vertical-align: bottom;">label_important</mat-icon> My mailing address is the same as my
						residential address
					</div>
				</ng-container>
				<ng-template #mailingIsDifferentThanResidential>
					<app-common-address
						[form]="mailingAddressFormGroup"
						[isWizardStep]="false"
						[isReadOnly]="false"
					></app-common-address>
				</ng-template>
			</div>
		</div>
	`,
	styles: [],
})
export class CommonUserProfileComponent implements LicenceChildStepperStepComponent {
	addressChangeUrl = SPD_CONSTANTS.urls.addressChangeUrl;

	aliasesFormGroup: FormGroup = this.licenceApplicationService.aliasesFormGroup;
	residentialAddressFormGroup: FormGroup = this.licenceApplicationService.residentialAddressFormGroup;
	mailingAddressFormGroup: FormGroup = this.licenceApplicationService.mailingAddressFormGroup;

	@ViewChild(CommonUserProfilePersonalInformationComponent)
	personalComponent!: CommonUserProfilePersonalInformationComponent;
	@ViewChild(CommonAliasListComponent) aliasesComponent!: CommonAliasListComponent;
	@ViewChild(CommonContactInformationComponent) contactInformationComponent!: CommonContactInformationComponent;
	@ViewChild(CommonAddressComponent) mailingAddressComponent!: CommonAddressComponent;

	isReadOnly = true;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		const valid1 = this.personalComponent.isFormValid();
		const valid2 = this.isAliasesFormGroupFormValid();
		const valid3 = this.isMailingTheSameAsResidential ? true : this.isMailingAddressFormGroupValid();

		return valid1 && valid2 && valid3;
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
