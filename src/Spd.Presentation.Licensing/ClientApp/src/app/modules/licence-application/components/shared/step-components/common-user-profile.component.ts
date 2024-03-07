import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { CommonAddressComponent } from './common-address.component';
import { CommonAliasListComponent } from './common-alias-list.component';
import { CommonContactInformationComponent } from './common-contact-information.component';

@Component({
	selector: 'app-common-user-profile',
	template: `
		<!-- <mat-divider class="mat-divider-main"></mat-divider> -->
		<div class="text-minor-heading pt-2 pb-3">Personal Information</div>
		<app-common-user-profile-personal-information
			[isReadOnly]="isReadOnly"
		></app-common-user-profile-personal-information>

		<!-- <div class="text-minor-heading pt-2 pb-3">Contact Information</div> -->
		<!-- <app-common-contact-information
			[form]="contactInformationFormGroup"
			[isWizardStep]="false"
			[isReadOnly]="isReadOnly"
		></app-common-contact-information> -->

		<mat-divider class="mat-divider-main"></mat-divider>
		<div class="text-minor-heading pt-2 pb-3">Aliases or Previous Names</div>
		<app-common-alias-list [form]="aliasesFormGroup" [isReadOnly]="isReadOnly"></app-common-alias-list>

		<!-- <mat-divider class="mat-divider-main mt-3"></mat-divider>
		<div class="text-minor-heading pt-2 pb-3">Contact Information</div>
		<app-common-contact-information
			[form]="contactInformationFormGroup"
			[isWizardStep]="false"
			[isReadOnly]="isReadOnly"
		></app-common-contact-information> -->

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
				></app-common-residential-address>
			</div>

			<div class="col-lg-6 col-md-12">
				<ng-container *ngIf="isMailingTheSameAsResidential; else mailingIsDifferentThanResidential">
					<div class="mb-3">
						<mat-icon style="vertical-align: bottom;">label_important</mat-icon> My mailing address is the same as my
						business address
					</div>
				</ng-container>
				<ng-template #mailingIsDifferentThanResidential>
					<app-common-address
						[form]="mailingAddressFormGroup"
						[isWizardStep]="false"
						[isReadOnly]="isReadOnly"
					></app-common-address>
				</ng-template>
			</div>

			<div class="col-12 mt-3">
				<mat-divider class="mat-divider-main"></mat-divider>
				<div class="mt-3">
					<app-alert type="info" icon="" [showBorder]="false">
						<div class="mb-2">COLLECTION NOTICE</div>
						All information regarding this application is collected under the <i>Security Services Act</i> and its
						Regulation and will be used for that purpose. The use of this information will comply with the
						<i>Freedom of Information</i> and <i>Privacy Act</i> and the federal <i>Privacy Act</i>. If you have any
						questions regarding the collection or use of this information, please contact
						<a href="mailto:securitylicensing@gov.bc.ca">securitylicensing&#64;gov.bc.ca</a>
					</app-alert>
				</div>
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
	@ViewChild(CommonAddressComponent) mailingAddressComponent!: CommonAddressComponent;

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
