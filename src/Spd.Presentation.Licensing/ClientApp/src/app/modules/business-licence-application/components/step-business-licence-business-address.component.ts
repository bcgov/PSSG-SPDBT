import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-business-licence-business-address',
	template: `
		<app-step-section heading="Do you need to update any of the following address information?">
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
										To update your mailing address, please
										<a aria-label="Navigate to BCeID site" [href]="bceidUrl" target="_blank">visit BCeID</a>.
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
										isAddressTheSameLabel="The business address and mailing address are the same"
									></app-form-address-and-is-same-flag>
								</div>
							</mat-expansion-panel>
						</mat-accordion>
					</section>
				</div>

				@if (showBcBusinessAddress) {
					<div class="col-12">
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
										<app-form-address [form]="bcBusinessAddressFormGroup" [isWideView]="true"></app-form-address>
									</div>
								</mat-expansion-panel>
							</mat-accordion>
						</section>
					</div>
				}
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepBusinessLicenceBusinessAddressComponent implements LicenceChildStepperStepComponent {
	bceidUrl = SPD_CONSTANTS.urls.bceidUrl;

	businessMailingAddressFormGroup = this.businessApplicationService.businessMailingAddressFormGroup;
	businessAddressFormGroup = this.businessApplicationService.businessAddressFormGroup;
	bcBusinessAddressFormGroup = this.businessApplicationService.bcBusinessAddressFormGroup;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		this.businessAddressFormGroup.markAllAsTouched();
		this.bcBusinessAddressFormGroup.markAllAsTouched();

		const valid1 = this.businessAddressFormGroup.valid;
		const valid2 = this.showBcBusinessAddress ? this.bcBusinessAddressFormGroup.valid : true;
		return valid1 && valid2;
	}

	get showBcBusinessAddress(): boolean {
		if (!this.businessAddressFormGroup.valid) {
			return false;
		}

		return !this.businessApplicationService.isBcBusinessAddress();
	}
}
