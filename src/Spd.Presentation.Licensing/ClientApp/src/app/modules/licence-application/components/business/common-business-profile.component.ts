import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { CommonBusinessBcBranchesComponent } from './common-business-bc-branches.component';
import { CommonBusinessInformationComponent } from './common-business-information.component';

@Component({
	selector: 'app-common-business-profile',
	template: `
		<div class="text-minor-heading pt-2 pb-3">Business Information</div>
		<section>
			<app-common-business-information [form]="businessInformationFormGroup"></app-common-business-information>
		</section>

		<div class="row mt-3">
			<div class="col-lg-6 col-md-12">
				<mat-divider class="mat-divider-main"></mat-divider>
				<div class="text-minor-heading pt-2 pb-3">Business Address</div>
				<app-alert type="info" icon="" [showBorder]="false">
					This is the address of the business's primary location
				</app-alert>

				<section>
					<app-common-business-address
						[form]="businessAddressFormGroup"
						[isWizardStep]="false"
						[isReadonly]="isReadonly"
					></app-common-business-address>
				</section>
			</div>

			<div class="col-lg-6 col-md-12" *ngIf="businessAddressIsNotInBc">
				<mat-divider class="mat-divider-main"></mat-divider>
				<div class="text-minor-heading pt-2 pb-3">B.C. Business Address</div>
				<app-alert type="info" icon="" [showBorder]="false">
					Provide an address in British Columbia for document service
				</app-alert>

				<section>
					<app-common-address
						[form]="bcBusinessAddressFormGroup"
						[isWizardStep]="false"
						[isReadonly]="isReadonly"
					></app-common-address>
				</section>
			</div>

			<div class="col-lg-6 col-md-12">
				<mat-divider class="mat-divider-main"></mat-divider>
				<div class="text-minor-heading pt-2 pb-3">Mailing Address</div>
				<app-alert type="info" icon="" [showBorder]="false">
					Provide your mailing address, if different from your business address
				</app-alert>

				<ng-container *ngIf="isMailingTheSame; else mailingIsDifferentSection">
					<div class="mb-3">
						<mat-icon style="vertical-align: bottom;">label_important</mat-icon> The business address and mailing
						address are the same
					</div>
				</ng-container>
				<ng-template #mailingIsDifferentSection>
					<section>
						<app-common-address
							[form]="mailingAddressFormGroup"
							[isWizardStep]="false"
							[isReadonly]="isReadonly"
						></app-common-address>
					</section>
				</ng-template>
			</div>
		</div>

		<div class="row mt-3">
			<div class="col-12">
				<mat-divider class="mat-divider-main"></mat-divider>
				<div class="text-minor-heading pt-2 pb-3">Branches in B.C.</div>
				<app-alert type="info" icon="" [showBorder]="false">Branches in B.C. where licenced employees work</app-alert>

				<app-common-business-bc-branches [form]="branchesInBcFormGroup"></app-common-business-bc-branches>
			</div>
		</div>
	`,
	styles: [],
})
export class CommonBusinessProfileComponent implements LicenceChildStepperStepComponent {
	// @Input() isReadonlyPersonalInfo!: boolean;
	// @Input() isReadonlyMailingAddress!: boolean;
	isReadonly = false; //TODO update to support read only mode

	@Input() businessInformationFormGroup!: FormGroup;
	@Input() businessAddressFormGroup!: FormGroup;
	@Input() bcBusinessAddressFormGroup!: FormGroup;
	@Input() mailingAddressFormGroup!: FormGroup;
	@Input() branchesInBcFormGroup!: FormGroup;

	@ViewChild(CommonBusinessInformationComponent) businessInformationComponent!: CommonBusinessInformationComponent;
	@ViewChild(CommonBusinessBcBranchesComponent) businessBcBranchesComponent!: CommonBusinessBcBranchesComponent;

	isFormValid(): boolean {
		const isValid1 = this.businessInformationComponent.isFormValid();
		const isValid2 = this.isFormGroupValid(this.businessAddressFormGroup);
		const isValid3 = this.businessAddressIsNotInBc ? this.isFormGroupValid(this.bcBusinessAddressFormGroup) : true;
		const isValid4 = this.isMailingTheSame ? true : this.isFormGroupValid(this.mailingAddressFormGroup);
		const isValid5 = this.businessBcBranchesComponent.isFormValid();

		console.debug('[CommonBusinessProfileComponent] isFormValid', isValid1, isValid2, isValid3, isValid4, isValid5);

		// return isValid1 && isValid2 && isValid3 && isValid4 && isValid5;
		return true; // TODO remove hardcoded
	}

	private isFormGroupValid(form: FormGroup): boolean {
		form.markAllAsTouched();
		return form.valid;
	}

	get isMailingTheSame(): boolean {
		return this.businessAddressFormGroup.get('isMailingTheSame')?.value ?? false;
	}
	get businessAddressIsNotInBc(): boolean {
		const formValue = this.businessAddressFormGroup.value;
		return formValue.addressSelected && formValue.province != 'British Columbia';
	}
}
