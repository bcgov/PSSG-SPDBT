import { Component } from '@angular/core';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-business-licence-business-address',
	template: `
		<app-step-section title="Do you need to update any of the following address information?">
			<div class="row">
				<div class="col-lg-6 col-md-12">
					<section>
						<mat-accordion>
							<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
								<mat-expansion-panel-header>
									<mat-panel-title>Mailing Address</mat-panel-title>
								</mat-expansion-panel-header>

								<div class="mt-3">
									<div class="mb-4 text-primary-color">
										This address is from your Business BCeID. If you need to make any updates, please
										<a href="https://www.bceid.ca" target="_blank">visit BCeID</a>.
									</div>

									<app-address
										[form]="businessMailingAddressFormGroup"
										[isWizardStep]="false"
										[isReadonly]="true"
									></app-address>
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
										Provide your business address, if different from your mailing address
									</div>

									<app-address-and-is-same-flag
										[form]="businessAddressFormGroup"
										[isWizardStep]="false"
										isAddressTheSameLabel="The business address and mailing address are the same"
									></app-address-and-is-same-flag>
								</div>
							</mat-expansion-panel>
						</mat-accordion>
					</section>
				</div>

				<div class="col-lg-6 col-md-12" *ngIf="!isBcBusinessAddress">
					<section>
						<mat-accordion>
							<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
								<mat-expansion-panel-header>
									<mat-panel-title>B.C. Business Address</mat-panel-title>
								</mat-expansion-panel-header>

								<div class="mt-3">
									<app-alert type="info" icon="" [showBorder]="false">
										Provide an address in British Columbia for document service
									</app-alert>

									<app-address [form]="bcBusinessAddressFormGroup" [isWizardStep]="false"></app-address>
								</div>
							</mat-expansion-panel>
						</mat-accordion>
					</section>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepBusinessLicenceBusinessAddressComponent implements LicenceChildStepperStepComponent {
	businessMailingAddressFormGroup = this.businessApplicationService.businessMailingAddressFormGroup;
	businessAddressFormGroup = this.businessApplicationService.businessAddressFormGroup;
	bcBusinessAddressFormGroup = this.businessApplicationService.bcBusinessAddressFormGroup;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		this.businessAddressFormGroup.markAllAsTouched();
		this.bcBusinessAddressFormGroup.markAllAsTouched();

		const valid1 = this.businessAddressFormGroup.valid;
		const valid2 = this.isBcBusinessAddress ? true : this.bcBusinessAddressFormGroup.valid;
		return valid1 && valid2;
	}

	get isBcBusinessAddress(): boolean {
		if (!this.businessAddressFormGroup.valid) {
			return true;
		}

		return this.businessApplicationService.isBcBusinessAddress();
	}
}
