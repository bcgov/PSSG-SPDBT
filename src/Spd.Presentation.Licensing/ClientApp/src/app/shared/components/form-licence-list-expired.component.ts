/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MainLicenceResponse } from '@app/core/services/common-application.service';
import { UtilService } from '@app/core/services/util.service';

@Component({
	selector: 'app-form-licence-list-expired',
	template: `
		<div class="mb-3" *ngIf="expiredLicences.length > 0">
			<div class="text-primary-color fs-5 py-3">Expired {{ serviceLabelTitle }}</div>
			<div
				class="summary-card-section summary-card-section__red mb-2 px-4 py-3"
				*ngFor="let licence of expiredLicences; let i = index"
			>
				<div class="row">
					<div [ngClass]="isGdsdRelated ? 'col-lg-2' : 'col-lg-3'">
						<div class="fs-5" style="color: var(--color-primary);">
							{{ licence.serviceTypeCode | options: 'ServiceTypes' }}
						</div>
					</div>
					<div [ngClass]="isGdsdRelated ? 'col-lg-10' : 'col-lg-9'">
						<div class="row">
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">{{ serviceLabel }} Number</div>
								<div class="text-data">{{ licence.licenceNumber }}</div>
							</div>
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">{{ serviceLabel }} Term</div>
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
						<div class="row mt-2" *ngIf="isRenewAllowed(licence)">
							<mat-divider class="my-2"></mat-divider>

							<div class="col-lg-9">
								<div class="text-data fw-bold">
									An expired certificate can be renewed if it is within 6 months of the expiry date.
								</div>
							</div>
							<div class="col-lg-3 text-end">
								<button
									mat-flat-button
									color="primary"
									class="large my-2"
									aria-label="Renew the licence"
									(click)="onRenew(licence)"
								>
									<mat-icon>restore</mat-icon>Renew
								</button>
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
export class FormLicenceListExpiredComponent implements OnInit {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

	serviceLabelTitle = 'Licences/Permits';
	serviceLabel = 'Licence';

	@Input() isGdsdRelated = false;
	@Input() expiredLicences!: Array<MainLicenceResponse>;

	@Output() renewLicence: EventEmitter<MainLicenceResponse> = new EventEmitter();

	constructor(private utilService: UtilService) {}

	ngOnInit(): void {
		if (this.isGdsdRelated) {
			this.serviceLabelTitle = 'Certificates';
			this.serviceLabel = 'Certificate';
		}
	}

	onRenew(licence: MainLicenceResponse): void {
		this.renewLicence.emit(licence);
	}

	isRenewAllowed(licence: MainLicenceResponse): boolean {
		return this.utilService.isExpiredLicenceRenewable(licence.serviceTypeCode!, licence.expiryDate!);
	}
}
