import { Component } from '@angular/core';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-metal-dealers-business-address',
	template: `
		<app-step-section title="Business Addresses">
			<div class="row">
				<div class="col-xl-11 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-lg-6 col-md-12">
							<section>
								<mat-accordion>
									<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
										<mat-expansion-panel-header>
											<mat-panel-title>Business Address</mat-panel-title>
										</mat-expansion-panel-header>

										<div class="mt-3">
											<div class="mb-4 text-primary-color">This address is your business address.</div>

											<app-form-address [form]="businessAddressForm" [isWideView]="false"></app-form-address>
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
											<mat-panel-title>Business Mailing Address</mat-panel-title>
										</mat-expansion-panel-header>

										<div class="mt-3">
											<div class="mb-4 text-primary-color">
												Provide your business mailing address, if different from your business address.
											</div>

											<app-form-address-and-is-same-flag
												[form]="businessMailingAddressForm"
												isAddressTheSameLabel="The business address and mailing address are the same"
												[isWideView]="false"
											></app-form-address-and-is-same-flag>
										</div>
									</mat-expansion-panel>
								</mat-accordion>
							</section>
						</div>
					</div>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepMetalDealersBusinessAddressComponent implements LicenceChildStepperStepComponent {
	businessAddressForm = this.metalDealersApplicationService.businessAddressFormGroup;
	businessMailingAddressForm = this.metalDealersApplicationService.businessMailingAddressFormGroup;

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	isFormValid(): boolean {
		this.businessAddressForm.markAllAsTouched();
		this.businessMailingAddressForm.markAllAsTouched();
		return this.businessAddressForm.valid && this.businessMailingAddressForm.valid;
	}
}
