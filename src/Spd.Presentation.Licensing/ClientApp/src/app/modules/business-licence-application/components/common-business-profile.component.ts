import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BizTypeCode } from '@app/api/models';
import { BusinessLicenceTypes } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { BusinessBcBranchesComponent } from './business-bc-branches.component';

@Component({
	selector: 'app-common-business-profile',
	template: `
		<div class="row">
			<div class="col-12">
				<section>
					<mat-accordion>
						<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
							<mat-expansion-panel-header>
								<mat-panel-title>Business Information</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="mt-3">
								<app-common-business-information
									[form]="businessInformationFormGroup"
									[isReadonly]="isReadonly"
								></app-common-business-information>
							</div>
						</mat-expansion-panel>
					</mat-accordion>
				</section>
			</div>

			<div class="col-12" *ngIf="!isBusinessLicenceSoleProprietor">
				<section>
					<mat-accordion>
						<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
							<mat-expansion-panel-header>
								<mat-panel-title>Business Manager</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="mt-3">
								<app-common-business-manager
									[form]="businessManagerFormGroup"
									[isReadonly]="isReadonly"
								></app-common-business-manager>
							</div>
						</mat-expansion-panel>
					</mat-accordion>
				</section>
			</div>

			<div class="col-lg-6 col-md-12">
				<section>
					<mat-accordion>
						<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
							<mat-expansion-panel-header>
								<mat-panel-title>Mailing Address</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="mt-3">
								<div class="mb-4 text-primary-color">
									To update your mailing address, please <a [href]="bceidUrl" target="_blank">visit BCeID</a>.
								</div>

								<app-form-address [form]="businessMailingAddressFormGroup" [isReadonly]="true"></app-form-address>
							</div>
						</mat-expansion-panel>
					</mat-accordion>
				</section>
			</div>

			<div class="col-lg-6 col-md-12">
				<section>
					<mat-accordion>
						<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
							<mat-expansion-panel-header>
								<mat-panel-title>Business Address</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="mt-3">
								<div class="mb-4 text-primary-color">
									Provide your business address, if different from your mailing address.
								</div>

								<app-form-address-and-is-same-flag
									[form]="businessAddressFormGroup"
									[isReadonly]="isReadonly"
									[isCheckboxReadOnly]="isReadonly"
									isAddressTheSameLabel="The business address and mailing address are the same"
								></app-form-address-and-is-same-flag>
							</div>
						</mat-expansion-panel>
					</mat-accordion>
				</section>
			</div>

			<div class="col-12" *ngIf="!showBcBusinessAddress">
				<section>
					<mat-accordion>
						<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
							<mat-expansion-panel-header>
								<mat-panel-title>B.C. Business Address</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="mt-3">
								<app-alert type="info" icon="" [showBorder]="false">
									Provide an address in British Columbia for document service.
								</app-alert>

								<app-form-address
									[form]="bcBusinessAddressFormGroup"
									[isWideView]="true"
									[isReadonly]="isReadonly"
								></app-form-address>
							</div>
						</mat-expansion-panel>
					</mat-accordion>
				</section>
			</div>

			<div class="col-12" *ngIf="!isBusinessLicenceSoleProprietor">
				<section>
					<mat-accordion>
						<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
							<mat-expansion-panel-header>
								<mat-panel-title>Branches in B.C.</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="mt-3">
								<app-business-bc-branches
									[form]="branchesInBcFormGroup"
									[isReadonly]="isReadonly"
								></app-business-bc-branches>
							</div>
						</mat-expansion-panel>
					</mat-accordion>
				</section>
			</div>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class CommonBusinessProfileComponent implements LicenceChildStepperStepComponent {
	bceidUrl = SPD_CONSTANTS.urls.bceidUrl;

	businessTypes = BusinessLicenceTypes;

	@Input() businessInformationFormGroup!: FormGroup;
	@Input() businessManagerFormGroup!: FormGroup;
	@Input() businessAddressFormGroup!: FormGroup;
	@Input() bcBusinessAddressFormGroup!: FormGroup;
	@Input() businessMailingAddressFormGroup!: FormGroup;
	@Input() branchesInBcFormGroup!: FormGroup;
	@Input() isReadonly = true;
	@Input() isBcBusinessAddress = true;

	@ViewChild(BusinessBcBranchesComponent) businessBcBranchesComponent!: BusinessBcBranchesComponent;

	isFormValid(): boolean {
		const isValid1 = this.isFormGroupValid(this.businessInformationFormGroup);
		const isValid2 = this.isFormGroupValid(this.businessAddressFormGroup);
		const isValid3 = this.isBcBusinessAddress ? true : this.isFormGroupValid(this.bcBusinessAddressFormGroup);
		const isValid4 = this.isFormGroupValid(this.businessAddressFormGroup);
		const isValid5 = this.isBusinessLicenceSoleProprietor ? true : this.businessBcBranchesComponent.isFormValid();
		const isValid6 = this.isBusinessLicenceSoleProprietor ? true : this.isFormGroupValid(this.businessManagerFormGroup);

		console.debug(
			'[CommonBusinessProfileComponent] isFormValid',
			isValid1,
			isValid2,
			isValid3,
			isValid4,
			isValid5,
			isValid6
		);

		return isValid1 && isValid2 && isValid3 && isValid4 && isValid5 && isValid6;
	}

	private isFormGroupValid(form: FormGroup): boolean {
		form.markAllAsTouched();
		return form.valid;
	}

	get showBcBusinessAddress(): boolean {
		if (!this.businessAddressFormGroup.valid) {
			return true;
		}

		return this.isBcBusinessAddress;
	}

	get isBusinessLicenceSoleProprietor(): boolean {
		return (
			this.bizTypeCode.value === BizTypeCode.NonRegisteredSoleProprietor ||
			this.bizTypeCode.value === BizTypeCode.RegisteredSoleProprietor
		);
	}
	get bizTypeCode(): FormControl {
		return this.businessInformationFormGroup.get('bizTypeCode') as FormControl;
	}
}
