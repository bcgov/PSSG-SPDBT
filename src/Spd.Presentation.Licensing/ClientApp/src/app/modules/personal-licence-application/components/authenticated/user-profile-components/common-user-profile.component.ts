import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { CommonAliasListComponent } from '@app/modules/personal-licence-application/components/shared/common-step-components/common-alias-list.component';
import { FormAddressComponent } from '@app/shared/components/form-address.component';
import { FormContactInformationComponent } from '@app/shared/components/form-contact-information.component';
import { FormPersonalInformationComponent } from '@app/shared/components/form-personal-information.component';
import { FormPhysicalCharacteristicsComponent } from '@app/shared/components/form-physical-characteristics.component';

@Component({
	selector: 'app-common-user-profile',
	template: `
		<div class="row">
			<div class="col-12">
				<mat-accordion>
					<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
						<mat-expansion-panel-header>
							<mat-panel-title>Personal Information</mat-panel-title>
						</mat-expansion-panel-header>

						<div class="my-3">
							<app-form-personal-information
								[personalInformationFormGroup]="personalInformationFormGroup"
								[contactInformationFormGroup]="contactInformationFormGroup"
								[isReadonly]="isReadonlyPersonalInfo"
								[isWizardStep]="false"
							></app-form-personal-information>
						</div>
					</mat-expansion-panel>
				</mat-accordion>
			</div>

			<div class="col-12">
				<mat-accordion>
					<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
						<mat-expansion-panel-header>
							<mat-panel-title>Identifying Information</mat-panel-title>
						</mat-expansion-panel-header>

						<div class="my-3">
							<app-form-physical-characteristics
								[form]="characteristicsFormGroup"
								[isReadonly]="isReadonlyPersonalInfo"
								[isWizardStep]="false"
							></app-form-physical-characteristics>
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
							<div class="fs-6 fw-bold mb-4">
								Have you moved?
								<a aria-label="Navigate to address change online site" [href]="addressChangeUrl" target="_blank"
									>Update your address online.</a
								>
								Any changes you make will automatically be updated here.
							</div>

							<section>
								<app-form-address [form]="residentialAddressFormGroup" [isReadonly]="true"></app-form-address>
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
							@if (!isReadonlyMailingAddress) {
								<div class="fs-6 fw-bold mb-4">
									Please provide your mailing address if it differs from your residential address. Note that a company
									address cannot be used.
								</div>
							}

							<app-form-address-and-is-same-flag
								[form]="mailingAddressFormGroup"
								[isReadonly]="isReadonlyMailingAddress"
								[isCheckboxReadOnly]="isReadonlyMailingAddress"
								isAddressTheSameLabel="The residential address and mailing address are the same"
							></app-form-address-and-is-same-flag>
						</div>
					</mat-expansion-panel>
				</mat-accordion>
			</div>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class CommonUserProfileComponent implements LicenceChildStepperStepComponent {
	addressChangeUrl = SPD_CONSTANTS.urls.addressChangeUrl;

	@ViewChild(FormPersonalInformationComponent) personalComponent!: FormPersonalInformationComponent;
	@ViewChild(CommonAliasListComponent) aliasesComponent!: CommonAliasListComponent;
	@ViewChild(FormContactInformationComponent) contactInformationComponent!: FormContactInformationComponent;
	@ViewChild(FormAddressComponent) mailingAddressComponent!: FormAddressComponent;
	@ViewChild(FormPhysicalCharacteristicsComponent) characteristicsComponent!: FormPhysicalCharacteristicsComponent;

	@Input() isReadonlyPersonalInfo!: boolean;
	@Input() isReadonlyMailingAddress!: boolean;
	@Input() personalInformationFormGroup!: FormGroup;
	@Input() contactInformationFormGroup!: FormGroup;
	@Input() aliasesFormGroup!: FormGroup;
	@Input() residentialAddressFormGroup!: FormGroup;
	@Input() mailingAddressFormGroup!: FormGroup;
	@Input() characteristicsFormGroup!: FormGroup;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	isFormValid(): boolean {
		const isValid1 = this.personalComponent.isFormValid();
		const isValid2 = this.isAliasesFormGroupFormValid();
		const isValid3 = this.isMailingAddressFormGroupValid();
		const isValid4 = this.characteristicsComponent.isFormValid();

		console.debug('[CommonUserProfileComponent] isFormValid', isValid1, isValid2, isValid3, isValid4);

		return isValid1 && isValid2 && isValid3 && isValid4;
	}

	isAliasesFormGroupFormValid(): boolean {
		this.aliasesFormGroup.markAllAsTouched();
		return this.aliasesFormGroup.valid;
	}

	isMailingAddressFormGroupValid(): boolean {
		this.mailingAddressFormGroup.markAllAsTouched();
		return this.mailingAddressFormGroup.valid;
	}

	isCharacteristicsFormGroupValid(): boolean {
		this.characteristicsFormGroup.markAllAsTouched();
		return this.characteristicsFormGroup.valid;
	}

	get isAddressTheSame(): boolean {
		return this.mailingAddressFormGroup.get('isAddressTheSame')?.value;
	}
}
