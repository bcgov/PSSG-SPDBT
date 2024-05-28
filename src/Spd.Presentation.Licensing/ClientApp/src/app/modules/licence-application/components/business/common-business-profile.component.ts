import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { CommonBusinessBcBranchesComponent } from './common-business-bc-branches.component';
import { CommonBusinessInformationComponent } from './common-business-information.component';

@Component({
	selector: 'app-common-business-profile',
	template: `
		<div class="row mt-3">
			<div class="col-12">
				<mat-accordion>
					<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
						<mat-expansion-panel-header>
							<mat-panel-title>Business Information</mat-panel-title>
						</mat-expansion-panel-header>

						<div class="mt-3">
							<section>
								<app-common-business-information
									[form]="businessInformationFormGroup"
									[isReadonly]="isReadonly"
								></app-common-business-information>
							</section>
						</div>
					</mat-expansion-panel>
				</mat-accordion>
			</div>

			<div class="col-lg-6 col-md-12">
				<mat-accordion>
					<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
						<mat-expansion-panel-header>
							<mat-panel-title>Business Address</mat-panel-title>
						</mat-expansion-panel-header>

						<div class="mt-3">
							<div class="mb-3 text-primary-color">This is the address of the business's primary location</div>

							<section>
								<app-common-business-address
									[form]="businessAddressFormGroup"
									[isWizardStep]="false"
									[isReadonly]="true"
								></app-common-business-address>
							</section>
						</div>
					</mat-expansion-panel>
				</mat-accordion>
			</div>

			<div class="col-lg-6 col-md-12" *ngIf="!isBcBusinessAddress">
				<mat-accordion>
					<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
						<mat-expansion-panel-header>
							<mat-panel-title>B.C. Business Address</mat-panel-title>
						</mat-expansion-panel-header>

						<div class="mt-3">
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
					</mat-expansion-panel>
				</mat-accordion>
			</div>

			<div class="col-lg-6 col-md-12">
				<mat-accordion>
					<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
						<mat-expansion-panel-header>
							<mat-panel-title>Mailing Address</mat-panel-title>
						</mat-expansion-panel-header>

						<div class="mt-3">
							<div class="mb-3 text-primary-color">
								Provide your mailing address, if different from your business address
							</div>
							<!-- <app-alert type="info" icon="" [showBorder]="false">
								Provide your mailing address, if different from your business address
							</app-alert> -->

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
					</mat-expansion-panel>
				</mat-accordion>
			</div>

			<div class="col-12">
				<mat-accordion>
					<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
						<mat-expansion-panel-header>
							<mat-panel-title>Branches in B.C.</mat-panel-title>
						</mat-expansion-panel-header>

						<div class="mt-3">
							<section>
								<app-common-business-bc-branches [form]="branchesInBcFormGroup"></app-common-business-bc-branches>
							</section>
						</div>
					</mat-expansion-panel>
				</mat-accordion>
			</div>
		</div>
	`,
	styles: [],
})
export class CommonBusinessProfileComponent implements LicenceChildStepperStepComponent {
	@Input() businessInformationFormGroup!: FormGroup;
	@Input() businessAddressFormGroup!: FormGroup;
	@Input() bcBusinessAddressFormGroup!: FormGroup;
	@Input() mailingAddressFormGroup!: FormGroup;
	@Input() branchesInBcFormGroup!: FormGroup;
	@Input() isReadonly = true;
	@Input() isBcBusinessAddress = true;

	@ViewChild(CommonBusinessInformationComponent) businessInformationComponent!: CommonBusinessInformationComponent;
	@ViewChild(CommonBusinessBcBranchesComponent) businessBcBranchesComponent!: CommonBusinessBcBranchesComponent;

	isFormValid(): boolean {
		const isValid1 = this.businessInformationComponent.isFormValid();
		const isValid2 = this.isFormGroupValid(this.businessAddressFormGroup);
		const isValid3 = this.isBcBusinessAddress ? true : this.isFormGroupValid(this.bcBusinessAddressFormGroup);
		const isValid4 = this.isMailingTheSame ? true : this.isFormGroupValid(this.mailingAddressFormGroup);
		const isValid5 = this.businessBcBranchesComponent.isFormValid();

		console.debug('[CommonBusinessProfileComponent] isFormValid', isValid1, isValid2, isValid3, isValid4, isValid5);

		return isValid1 && isValid2 && isValid3 && isValid4 && isValid5;
	}

	private isFormGroupValid(form: FormGroup): boolean {
		form.markAllAsTouched();
		return form.valid;
	}

	get isMailingTheSame(): boolean {
		return this.businessAddressFormGroup.get('isMailingTheSame')?.value ?? false;
	}
}
