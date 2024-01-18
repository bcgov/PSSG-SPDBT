import { Component, Input, OnInit } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-renewal-alert',
	template: `
		<div class="row">
			<div class="col-md-8 col-sm-12 mx-auto">
				<div class="alert-confirm mb-3 p-2">
					<div class="row mt-0 mx-3 mb-2" *ngIf="showLicenceData">
						<div class="col-lg-4 col-md-12 mt-lg-2">
							<div class="text-label text-center d-block text-muted mt-2 mt-lg-0">Licence Number</div>
							<div class="summary-text-data text-center">{{ licenceNumber }}</div>
						</div>
						<div class="col-lg-4 col-md-12 mt-lg-2">
							<div class="text-label text-center d-block text-muted mt-2 mt-lg-0">Current Licence Expiry Date</div>
							<div class="summary-text-data text-center">
								{{ licenceExpiryDate | formatDate : constants.date.formalDateFormat }}
							</div>
						</div>
						<div class="col-lg-4 col-md-12 mt-lg-2">
							<div class="text-label text-center d-block text-muted mt-2 mt-lg-0">Term</div>
							<div class="summary-text-data text-center">{{ licenceTermCode | options : 'LicenceTermTypes' }}</div>
						</div>
						<mat-divider class="my-2" *ngIf="title"></mat-divider>
					</div>
					<div class="title lh-base">
						<div class="fs-3" [innerHtml]="title"></div>
						<div class="fs-6 mt-1" *ngIf="subtitle" [innerHtml]="subtitle"></div>
					</div>
				</div>
			</div>
		</div>
		<!-- <div class="row">
			<div class="col-md-8 col-sm-12 mx-auto">
				<div class="alert" role="alert" class="alert-info py-2 mb-3">
					<div class="row mt-0 mx-3 mb-2" *ngIf="showLicenceData">
						<div class="col-lg-4 col-md-12 mt-lg-2">
							<div class="text-label text-center d-block text-muted mt-2 mt-lg-0">Licence Number</div>
							<div class="summary-text-data text-center">{{ licenceNumber }}</div>
						</div>
						<div class="col-lg-4 col-md-12 mt-lg-2">
							<div class="text-label text-center d-block text-muted mt-2 mt-lg-0">Current Licence Expiry Date</div>
							<div class="summary-text-data text-center">
								{{ licenceExpiryDate | formatDate : constants.date.formalDateFormat }}
							</div>
						</div>
						<div class="col-lg-4 col-md-12 mt-lg-2">
							<div class="text-label text-center d-block text-muted mt-2 mt-lg-0">Term</div>
							<div class="summary-text-data text-center">{{ licenceTermCode | options : 'LicenceTermTypes' }}</div>
						</div>
						<mat-divider class="my-2" *ngIf="title"></mat-divider>
					</div>
					<div class="title lh-base">
						<div class="fs-3" [innerHtml]="title"></div>
						<div class="fs-6 mt-3" *ngIf="subtitle" [innerHtml]="subtitle"></div>
					</div>
				</div>
			</div>
		</div> -->
	`,
	styles: [
		`
			.alert-info {
				color: #0c5460;
				border-color: #fcba19;
				border-width: 2px;
				border-style: solid;
				border-radius: 0;
			}

			.alert-confirm {
				color: #0c5460;
				background-color: #eef8fa;
				border: 1px solid #0c5460;
				border-radius: 0;
			}
		`,
	],
})
export class RenewalAlertComponent implements OnInit {
	title = '';
	subtitle = '';

	licenceModelData: any = {};
	constants = SPD_CONSTANTS;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() showLicenceData = false;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit() {
		if (this.showLicenceData) {
			this.licenceModelData = { ...this.licenceApplicationService.licenceModelFormGroup.getRawValue() };
		}

		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.Replacement:
			case ApplicationTypeCode.Update: {
				this.title = 'Confirm this information';
				this.subtitle = 'Update any information that has changed';
				break;
			}
			case ApplicationTypeCode.Renewal: {
				this.title = 'Confirm this information';
				this.subtitle = 'Update any information that has changed since your last application';
				break;
			}
		}
	}

	get licenceNumber(): string {
		return this.licenceModelData.licenceNumber ?? '';
	}
	get licenceExpiryDate(): string {
		return this.licenceModelData.licenceExpiryDate ?? '';
	}
	get licenceTermCode(): string {
		return this.licenceModelData.licenceTermData.licenceTermCode ?? '';
	}
}
