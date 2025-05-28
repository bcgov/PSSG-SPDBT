import { Component, OnInit } from '@angular/core';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';

@Component({
	selector: 'app-step-team-licence-confirmation',
	template: `
		<app-step-section title="Confirm your current licence information">
			<app-form-gdsd-licence-confirmation
				[originalLicenceHolderName]="originalLicenceHolderName"
				[originalLicenceNumber]="originalLicenceNumber"
				[originalExpiryDate]="originalExpiryDate"
				[originalLicenceTermCode]="originalLicenceTermCode"
			></app-form-gdsd-licence-confirmation>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepTeamLicenceConfirmationComponent implements OnInit {
	private gdsdModelData: any = {};

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	ngOnInit() {
		this.gdsdModelData = { ...this.gdsdTeamApplicationService.gdsdTeamModelFormGroup.getRawValue() };
	}

	get originalLicenceHolderName(): string {
		return this.gdsdTeamApplicationService.getSummaryoriginalLicenceHolderName(this.gdsdModelData);
	}
	get originalLicenceNumber(): string {
		return this.gdsdTeamApplicationService.getSummaryoriginalLicenceNumber(this.gdsdModelData);
	}
	get originalExpiryDate(): string {
		return this.gdsdTeamApplicationService.getSummaryoriginalExpiryDate(this.gdsdModelData);
	}
	get originalLicenceTermCode(): string {
		return this.gdsdTeamApplicationService.getSummaryoriginalLicenceTermCode(this.gdsdModelData);
	}
}
