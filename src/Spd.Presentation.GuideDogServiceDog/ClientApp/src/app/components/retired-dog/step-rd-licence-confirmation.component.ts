import { Component, OnInit } from '@angular/core';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';

@Component({
	selector: 'app-step-rd-licence-confirmation',
	template: `
		<app-step-section heading="Confirm your current certificate information">
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
export class StepRdLicenceConfirmationComponent implements OnInit {
	private retiredDogModelData: any = {};

	constructor(private retiredDogApplicationService: RetiredDogApplicationService) {}

	ngOnInit() {
		this.retiredDogModelData = { ...this.retiredDogApplicationService.retiredDogModelFormGroup.getRawValue() };
	}

	get originalLicenceHolderName(): string {
		return this.retiredDogApplicationService.getSummaryoriginalLicenceHolderName(this.retiredDogModelData);
	}
	get originalLicenceNumber(): string {
		return this.retiredDogApplicationService.getSummaryoriginalLicenceNumber(this.retiredDogModelData);
	}
	get originalExpiryDate(): string {
		return this.retiredDogApplicationService.getSummaryoriginalExpiryDate(this.retiredDogModelData);
	}
	get originalLicenceTermCode(): string {
		return this.retiredDogApplicationService.getSummaryoriginalLicenceTermCode(this.retiredDogModelData);
	}
}
