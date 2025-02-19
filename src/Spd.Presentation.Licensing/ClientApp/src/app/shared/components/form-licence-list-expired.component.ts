/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, Input } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MainLicenceResponse } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-form-licence-list-expired',
	template: `
		<div class="mb-3" *ngIf="expiredLicences.length > 0">
			<div class="text-primary-color fs-5 py-3">{{ title }}</div>
			<div
				class="summary-card-section summary-card-section__red mb-2 px-4 py-3"
				*ngFor="let licence of expiredLicences; let i = index"
			>
				<div class="row">
					<div class="col-lg-3">
						<div class="fs-5" style="color: var(--color-primary);">
							{{ licence.serviceTypeCode | options: 'ServiceTypes' }}
						</div>
					</div>
					<div class="col-lg-9">
						<div class="row">
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Licence Number</div>
								<div class="text-data">{{ licence.licenceNumber }}</div>
							</div>
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Licence Term</div>
								<div class="text-data">{{ licence.licenceTermCode | options: 'LicenceTermTypes' }}</div>
							</div>
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Expiry Date</div>
								<div class="text-data">
									{{ licence.expiryDate | formatDate: formalDateFormat }}
								</div>
							</div>
							<div class="col-lg-3 text-end">
								<mat-chip-option [selectable]="false" class="licence-chip-option mat-chip-red">
									<mat-icon class="licence-chip-option-item">cancel</mat-icon>
									<span class="licence-chip-option-item ms-2 fs-5">Expired</span>
								</mat-chip-option>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.licence-chip-option {
				height: 35px;
			}

			.licence-chip-option-item {
				vertical-align: text-bottom;
			}
		`,
	],
	standalone: false,
})
export class FormLicenceListExpiredComponent {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

	@Input() title = 'Expired Licences/Permits';
	@Input() expiredLicences!: Array<MainLicenceResponse>;
}
