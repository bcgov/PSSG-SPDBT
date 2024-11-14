import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-form-address-summary',
	template: `
		<div class="text-minor-heading">{{ headingLabel }}</div>
		<ng-container *ngIf="isAddressTheSame; else isDifferent">
			<div class="row mt-2">
				<div class="col-12">
					<div class="summary-text-data">{{ isAddressTheSameLabel }}</div>
				</div>
			</div>
		</ng-container>
		<ng-template #isDifferent>
			<div class="row mt-0">
				<div class="col-lg-4 col-md-12">
					<div class="text-label d-block text-muted">Address Line 1</div>
					<div class="summary-text-data">{{ addressLine1 | default }}</div>
				</div>
				<div class="col-lg-4 col-md-12">
					<div class="text-label d-block text-muted">Address Line 2</div>
					<div class="summary-text-data">{{ addressLine2 | default }}</div>
				</div>
				<div class="col-lg-4 col-md-12">
					<div class="text-label d-block text-muted">City</div>
					<div class="summary-text-data">{{ city | default }}</div>
				</div>
				<div class="col-lg-4 col-md-12">
					<div class="text-label d-block text-muted">Postal Code</div>
					<div class="summary-text-data">{{ postalCode | default }}</div>
				</div>
				<div class="col-lg-4 col-md-12">
					<div class="text-label d-block text-muted">Province</div>
					<div class="summary-text-data">{{ province | default }}</div>
				</div>
				<div class="col-lg-4 col-md-12">
					<div class="text-label d-block text-muted">Country</div>
					<div class="summary-text-data">{{ country | default }}</div>
				</div>
			</div>
		</ng-template>
	`,
	styles: [],
})
export class FormAddressSummaryComponent {
	@Input() formData!: any;
	@Input() headingLabel = 'Address';
	@Input() isAddressTheSame = false;
	@Input() isAddressTheSameLabel = 'Address is the same';

	get addressLine1(): string {
		return this.formData.addressLine1;
	}
	get addressLine2(): string {
		return this.formData.addressLine2;
	}
	get city(): string {
		return this.formData.city;
	}
	get postalCode(): string {
		return this.formData.postalCode;
	}
	get province(): string {
		return this.formData.province;
	}
	get country(): string {
		return this.formData.country;
	}
}
