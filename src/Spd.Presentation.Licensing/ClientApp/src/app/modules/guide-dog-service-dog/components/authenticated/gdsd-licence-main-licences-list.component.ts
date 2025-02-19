import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MainLicenceResponse } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-gdsd-licence-main-licences-list',
	template: `
		<div class="mb-3">
			<div class="text-primary-color fs-5 py-3">Active Licences</div>
			<div
				class="summary-card-section summary-card-section__green mb-3 px-4 py-3"
				*ngFor="let licence of activeLicences; let i = index"
			>
				<div class="row">
					<div class="col-lg-2">
						<div class="fs-5" style="color: var(--color-primary);">
							{{ licence.serviceTypeCode | options: 'ServiceTypes' }}
						</div>
					</div>
					<div class="col-lg-10">
						<div class="row">
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Licence Number</div>
								<div class="text-data fw-bold">{{ licence.licenceNumber }}</div>
							</div>
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Licence Term</div>
								<div class="text-data fw-bold">{{ licence.licenceTermCode | options: 'LicenceTermTypes' }}</div>
							</div>
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Expiry Date</div>
								<div class="text-data fw-bold" [ngClass]="licence.isRenewalPeriod ? 'error-color' : ''">
									{{ licence.expiryDate | formatDate: formalDateFormat }}
								</div>
							</div>
							<div class="col-lg-3 text-end">
								<mat-chip-option [selectable]="false" class="appl-chip-option mat-chip-green">
									<mat-icon class="appl-chip-option-item">check_circle</mat-icon>
									<span class="appl-chip-option-item mx-2 fs-5">Active</span>
								</mat-chip-option>
							</div>
							<mat-divider class="my-2"></mat-divider>
						</div>

						<div class="row mb-2">
							<div class="col-lg-4">
								<div class="d-block text-muted mt-2 mt-lg-0">Label</div>
								<div class="text-data">Data</div>
							</div>
							<div class="col-lg-4">
								<div class="d-block text-muted mt-2 mt-lg-0">Label</div>
								<div class="text-data">Data</div>
							</div>
							<div class="col-lg-4">
								<div class="d-block text-muted mt-2 mt-lg-0">Label</div>
								<div class="text-data">Data</div>
							</div>
						</div>
						<mat-divider class="my-2"></mat-divider>
						<div class="row mb-2">
							<div class="col-lg-9">
								<div class="d-block text-muted mt-2 mt-lg-0">Label</div>
								<div class="text-data">Data</div>
							</div>

							<div class="col-lg-3 text-end" *ngIf="!applicationIsInProgress">
								<button
									mat-flat-button
									color="primary"
									*ngIf="licence.isRenewalPeriod"
									class="large my-2"
									aria-label="Renew the licence"
									(click)="onRenew(licence)"
								>
									<mat-icon>restore</mat-icon>Renew
								</button>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-12">
							<mat-divider class="my-2"></mat-divider>
							<span class="fw-semibold">Lost your licence? </span>
							<a *ngIf="applicationIsInProgress" class="large disable">Request a replacement</a>
							<a
								*ngIf="!applicationIsInProgress"
								class="large"
								tabindex="0"
								aria-label="Request a gdsd licence replacement"
								(click)="onRequestReplacement(licence)"
								(keydown)="onKeydownRequestReplacement($event, licence)"
								>Request a replacement</a
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.appl-chip-option {
				height: 35px;
			}

			.appl-chip-option-item {
				vertical-align: text-bottom;
			}

			.error-color {
				font-weight: 600;
				color: var(--color-red-dark);
			}
		`,
	],
	standalone: false,
})
export class GdsdLicenceMainLicencesListComponent {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

	@Input() activeLicences!: Array<MainLicenceResponse>;
	@Input() applicationIsInProgress!: boolean;

	@Output() replaceLicence: EventEmitter<MainLicenceResponse> = new EventEmitter();
	@Output() renewLicence: EventEmitter<MainLicenceResponse> = new EventEmitter();

	onRequestReplacement(licence: MainLicenceResponse): void {
		this.replaceLicence.emit(licence);
	}

	onKeydownRequestReplacement(event: KeyboardEvent, licence: MainLicenceResponse) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onRequestReplacement(licence);
	}

	onRenew(licence: MainLicenceResponse): void {
		this.renewLicence.emit(licence);
	}
}
