import { Component, OnInit } from '@angular/core';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';

@Component({
	selector: 'app-step-dt-licence-confirmation',
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
export class StepDtLicenceConfirmationComponent implements OnInit {
	private dogTrainerModelData: any = {};

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	ngOnInit() {
		this.dogTrainerModelData = { ...this.dogTrainerApplicationService.dogTrainerModelFormGroup.getRawValue() };
	}

	get originalLicenceHolderName(): string {
		return this.dogTrainerApplicationService.getSummaryoriginalLicenceHolderName(this.dogTrainerModelData);
	}
	get originalLicenceNumber(): string {
		return this.dogTrainerApplicationService.getSummaryoriginalLicenceNumber(this.dogTrainerModelData);
	}
	get originalExpiryDate(): string {
		return this.dogTrainerApplicationService.getSummaryoriginalExpiryDate(this.dogTrainerModelData);
	}
	get originalLicenceTermCode(): string {
		return this.dogTrainerApplicationService.getSummaryoriginalLicenceTermCode(this.dogTrainerModelData);
	}
}
