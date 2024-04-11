import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';

@Component({
	selector: 'app-common-business-profile',
	template: `
		<section>
			<div class="text-minor-heading pt-2 pb-3">Business Information</div>
			<!-- <app-common-user-profile-personal-information
				[personalInformationFormGroup]="personalInformationFormGroup"
				[contactFormGroup]="contactFormGroup"
				[isReadonly]="isReadonlyPersonalInfo"
			></app-common-user-profile-personal-information> -->
		</section>

		<div class="row mt-3">
			<div class="col-lg-6 col-md-12">
				<mat-divider class="mat-divider-main"></mat-divider>
				<div class="text-minor-heading pt-2 pb-3">Business Address</div>
				<app-alert type="info" icon="" [showBorder]="false">
					This is the address of the business's primary location
				</app-alert>

				<!-- <app-alert type="info" icon="" [showBorder]="false">
					Has your residential address changed?
					<a [href]="addressChangeUrl" target="_blank">Change your address online</a> to update this information on your
					BC Services Card. Any changes you make will then be updated here.
				</app-alert> -->

				<section>
					<!-- <app-common-residential-address
						[form]="residentialAddressFormGroup"
						[isWizardStep]="false"
						[isReadonly]="true"
						[isCheckboxReadOnly]="isReadonlyMailingAddress"
					></app-common-residential-address> -->
				</section>
			</div>

			<div class="col-lg-6 col-md-12">
				<mat-divider class="mat-divider-main"></mat-divider>
				<div class="text-minor-heading pt-2 pb-3">B.C. Business Address</div>
				<app-alert type="info" icon="" [showBorder]="false">
					Provide an address in British Columbia for document service
				</app-alert>

				<ng-template #mailingIsDifferentThanResidential>
					<section>
						<!-- <app-common-address
							[form]="mailingAddressFormGroup"
							[isWizardStep]="false"
							[isReadonly]="isReadonlyMailingAddress"
						></app-common-address> -->
					</section>
				</ng-template>
			</div>

			<div class="col-lg-6 col-md-12">
				<mat-divider class="mat-divider-main"></mat-divider>
				<div class="text-minor-heading pt-2 pb-3">Mailing Address</div>
				<app-alert type="info" icon="" [showBorder]="false">
					Provide your mailing address, if different from your business address
				</app-alert>

				<ng-container *ngIf="isMailingTheSameAsResidential; else mailingIsDifferentThanResidential">
					<div class="mb-3">
						<mat-icon style="vertical-align: bottom;">label_important</mat-icon> My mailing address is the same as my
						business address
					</div>
				</ng-container>

				<!-- <app-alert type="info" icon="" [showBorder]="false">
					Has your residential address changed?
					<a [href]="addressChangeUrl" target="_blank">Change your address online</a> to update this information on your
					BC Services Card. Any changes you make will then be updated here.
				</app-alert> -->

				<section>
					<!-- <app-common-residential-address
						[form]="residentialAddressFormGroup"
						[isWizardStep]="false"
						[isReadonly]="true"
						[isCheckboxReadOnly]="isReadonlyMailingAddress"
					></app-common-residential-address> -->
				</section>
			</div>
		</div>

		<div class="row mt-3">
			<div class="col-12">
				<mat-divider class="mat-divider-main"></mat-divider>
				<div class="text-minor-heading pt-2 pb-3">Branches in B.C.</div>
				<app-alert type="info" icon="" [showBorder]="false"> Branches in B.C. where licenced employees work </app-alert>

				<app-common-business-bc-branches [form]="branchesInBcFormGroup"></app-common-business-bc-branches>
			</div>
		</div>
	`,
	styles: [],
})
export class CommonBusinessProfileComponent implements LicenceChildStepperStepComponent {
	addressChangeUrl = SPD_CONSTANTS.urls.addressChangeUrl;

	// @ViewChild(CommonUserProfilePersonalInformationComponent)
	// personalComponent!: CommonUserProfilePersonalInformationComponent;
	// @ViewChild(CommonAliasListComponent) aliasesComponent!: CommonAliasListComponent;
	// @ViewChild(CommonContactInformationComponent) contactInformationComponent!: CommonContactInformationComponent;
	// @ViewChild(CommonAddressComponent) mailingAddressComponent!: CommonAddressComponent;

	@Input() isReadonlyPersonalInfo!: boolean;
	@Input() isReadonlyMailingAddress!: boolean;

	@Input() branchesInBcFormGroup!: FormGroup;

	// @Input() personalInformationFormGroup!: FormGroup;
	// @Input() contactFormGroup!: FormGroup;
	@Input() residentialAddressFormGroup!: FormGroup;
	@Input() mailingAddressFormGroup!: FormGroup;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	isFormValid(): boolean {
		// const isValid1 = this.personalComponent.isFormValid();
		// const isValid2 = this.isAliasesFormGroupFormValid();
		// const isValid3 = this.isMailingTheSameAsResidential ? true : this.isMailingAddressFormGroupValid();

		// console.debug('[CommonUserProfileComponent] isFormValid', isValid1, isValid2, isValid3);

		// return isValid1 && isValid2 && isValid3;
		return true;
	}

	// isAliasesFormGroupFormValid(): boolean {
	// 	this.aliasesFormGroup.markAllAsTouched();
	// 	return this.aliasesFormGroup.valid;
	// }

	isMailingAddressFormGroupValid(): boolean {
		this.mailingAddressFormGroup.markAllAsTouched();
		return this.mailingAddressFormGroup.valid;
	}

	get isMailingTheSameAsResidential(): boolean {
		return false;
		// return this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value;
	}
}
