import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { CommonAliasListComponent } from '@app/modules/personal-licence-application/components/shared/common-step-components/common-alias-list.component';
import { CommonContactInformationComponent } from '@app/modules/personal-licence-application/components/shared/common-step-components/common-contact-information.component';
import { AddressComponent } from '@app/shared/components/address.component';
import { CommonUserProfilePersonalInformationComponent } from './common-user-profile-personal-information.component';

@Component({
	selector: 'app-common-user-profile',
	template: `
		<div class="row mt-3">
			<div class="col-12">
				<mat-accordion>
					<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
						<mat-expansion-panel-header>
							<mat-panel-title>Personal Information</mat-panel-title>
						</mat-expansion-panel-header>

						<div class="my-3">
							<app-common-user-profile-personal-information
								[personalInformationFormGroup]="personalInformationFormGroup"
								[contactFormGroup]="contactFormGroup"
								[isReadonly]="isReadonlyPersonalInfo"
							></app-common-user-profile-personal-information>
						</div>
					</mat-expansion-panel>
				</mat-accordion>
			</div>

			<div class="col-12">
				<mat-accordion>
					<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
						<mat-expansion-panel-header>
							<mat-panel-title>Previous Names or Aliases</mat-panel-title>
						</mat-expansion-panel-header>

						<div class="my-3">
							<app-common-alias-list
								[form]="aliasesFormGroup"
								[isReadonly]="isReadonlyPersonalInfo"
							></app-common-alias-list>
						</div>
					</mat-expansion-panel>
				</mat-accordion>
			</div>

			<div class="col-lg-6 col-md-12">
				<mat-accordion>
					<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
						<mat-expansion-panel-header>
							<mat-panel-title>Residential Address</mat-panel-title>
						</mat-expansion-panel-header>

						<div class="my-3">
							<app-alert type="info" icon="" [showBorder]="false">
								Has your residential address changed?
								<a [href]="addressChangeUrl" target="_blank">Change your address online</a> to update this information
								on your BC Services Card. Any changes you make will then be updated here.
							</app-alert>

							<section>
								<app-address
									[form]="residentialAddressFormGroup"
									[isWizardStep]="false"
									[isReadonly]="true"
								></app-address>
							</section>
						</div>
					</mat-expansion-panel>
				</mat-accordion>
			</div>

			<div class="col-lg-6 col-md-12">
				<mat-accordion>
					<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
						<mat-expansion-panel-header>
							<mat-panel-title>Mailing Address</mat-panel-title>
						</mat-expansion-panel-header>

						<div class="my-3">
							<app-alert type="info" icon="" [showBorder]="false" *ngIf="!isReadonlyMailingAddress">
								Provide your mailing address, if different from your residential address. This cannot be a company
								address.
							</app-alert>

							<app-address-and-is-same-flag
								[form]="mailingAddressFormGroup"
								[isWizardStep]="false"
								[isReadonly]="isReadonlyMailingAddress"
								[isCheckboxReadOnly]="isReadonlyMailingAddress"
								isAddressTheSameLabel="The residential address and mailing address are the same"
							></app-address-and-is-same-flag>
						</div>
					</mat-expansion-panel>
				</mat-accordion>
			</div>
		</div>
	`,
	styles: [],
})
export class CommonUserProfileComponent implements LicenceChildStepperStepComponent {
	addressChangeUrl = SPD_CONSTANTS.urls.addressChangeUrl;

	@ViewChild(CommonUserProfilePersonalInformationComponent)
	personalComponent!: CommonUserProfilePersonalInformationComponent;
	@ViewChild(CommonAliasListComponent) aliasesComponent!: CommonAliasListComponent;
	@ViewChild(CommonContactInformationComponent) contactInformationComponent!: CommonContactInformationComponent;
	@ViewChild(AddressComponent) mailingAddressComponent!: AddressComponent;

	@Input() isReadonlyPersonalInfo!: boolean;
	@Input() isReadonlyMailingAddress!: boolean;
	@Input() personalInformationFormGroup!: FormGroup;
	@Input() contactFormGroup!: FormGroup;
	@Input() aliasesFormGroup!: FormGroup;
	@Input() residentialAddressFormGroup!: FormGroup;
	@Input() mailingAddressFormGroup!: FormGroup;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	isFormValid(): boolean {
		const isValid1 = this.personalComponent.isFormValid();
		const isValid2 = this.isAliasesFormGroupFormValid();
		const isValid3 = this.isMailingAddressFormGroupValid();

		console.debug('[CommonUserProfileComponent] isFormValid', isValid1, isValid2, isValid3);

		return isValid1 && isValid2 && isValid3;
	}

	isAliasesFormGroupFormValid(): boolean {
		this.aliasesFormGroup.markAllAsTouched();
		return this.aliasesFormGroup.valid;
	}

	isMailingAddressFormGroupValid(): boolean {
		this.mailingAddressFormGroup.markAllAsTouched();
		return this.mailingAddressFormGroup.valid;
	}

	get isAddressTheSame(): boolean {
		return this.mailingAddressFormGroup.get('isAddressTheSame')?.value;
	}
}
