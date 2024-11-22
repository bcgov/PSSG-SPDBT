import { Component, Input } from '@angular/core';
import { PermitApplicationService } from '@app/core/services/permit-application.service';

@Component({
	selector: 'app-permit-summary-employer-information',
	template: `
		<div class="text-minor-heading-small">Employer Information</div>
		<div class="row mt-0">
			<div class="col-lg-6 col-md-12">
				<div class="text-label d-block text-muted">Business Name</div>
				<div class="summary-text-data">
					{{ employerName }}
				</div>
			</div>
			<div class="col-lg-6 col-md-12">
				<div class="text-label d-block text-muted">Supervisor's Name</div>
				<div class="summary-text-data">
					{{ supervisorName }}
				</div>
			</div>
			<div class="col-lg-6 col-md-12">
				<div class="text-label d-block text-muted">Phone Number</div>
				<div class="summary-text-data">
					{{ supervisorEmailAddress }}
				</div>
			</div>
			<div class="col-lg-6 col-md-12">
				<div class="text-label d-block text-muted">Email Address</div>
				<div class="summary-text-data">
					{{ supervisorPhoneNumber | formatPhoneNumber }}
				</div>
			</div>
		</div>

		<mat-divider class="mt-3 mb-2"></mat-divider>

		<app-form-address-summary
			[formData]="permitModelData.employerData"
			headingLabel="Business's Primary Address"
			[isAddressTheSame]="false"
		></app-form-address-summary>
	`,
	styles: [],
})
export class PermitSummaryEmployerInformationComponent {
	constructor(private permitApplicationService: PermitApplicationService) {}

	@Input() permitModelData: any;

	get employerName(): string {
		return this.permitApplicationService.getSummaryemployerName(this.permitModelData);
	}
	get supervisorName(): string {
		return this.permitApplicationService.getSummarysupervisorName(this.permitModelData);
	}
	get supervisorEmailAddress(): string {
		return this.permitApplicationService.getSummarysupervisorEmailAddress(this.permitModelData);
	}
	get supervisorPhoneNumber(): string {
		return this.permitApplicationService.getSummarysupervisorPhoneNumber(this.permitModelData);
	}
}
