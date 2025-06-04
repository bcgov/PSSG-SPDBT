import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MainLicenceResponse } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-gdsd-licence-main-licences-list',
	template: `
		<div class="mb-3" *ngIf="activeLicences.length > 0">
			<div class="text-minor-heading py-3">Active Certificates</div>
			<div
				class="summary-card-section summary-card-section__green mb-3 px-4 py-3"
				*ngFor="let licence of activeLicences; let i = index"
			>
				<div class="row">
					<div class="col-lg-2">
						<div class="text-minor-heading">
							{{ licence.serviceTypeCode | options: 'ServiceTypes' }}
						</div>
					</div>
					<div class="col-lg-10">
						<div class="row">
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Certificate Number</div>
								<div class="text-data fw-bold">{{ licence.licenceNumber }}</div>
							</div>
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Certificate Term</div>
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

						<div class="row mt-2">
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Dog Name</div>
								<div class="text-data fw-bold">{{ licence.dogInfo?.dogName | default }}</div>
							</div>
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Date of Birth</div>
								<div class="text-data fw-bold">
									{{ licence.dogInfo?.dogDateOfBirth | formatDate: formalDateFormat | default }}
								</div>
							</div>
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Breed</div>
								<div class="text-data fw-bold">{{ licence.dogInfo?.dogBreed | default }}</div>
							</div>
						</div>

						<div class="row mt-2">
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Colour and Markings</div>
								<div class="text-data fw-bold">{{ licence.dogInfo?.dogColorAndMarkings | default }}</div>
							</div>
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Gender</div>
								<div class="text-data fw-bold">
									{{ licence.dogInfo?.dogGender | options: 'DogGenderTypes' | default }}
								</div>
							</div>
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Microchip Number</div>
								<div class="text-data fw-bold">{{ licence.dogInfo?.microchipNumber | default }}</div>
							</div>

							<div class="col-lg-3 text-end" *ngIf="!applicationIsInProgress">
								<button
									mat-flat-button
									color="primary"
									*ngIf="licence.isRenewalPeriod"
									class="large my-2"
									aria-label="Renew the certificate"
									(click)="onRenew(licence)"
								>
									<mat-icon>restore</mat-icon>Renew
								</button>
							</div>
							<div class="col-12 mt-3" *ngIf="applicationIsInProgress">
								<app-alert type="info" icon="info">
									This {{ licence.serviceTypeCode | options: 'ServiceTypes' }} cannot be renewed or replaced while an
									application is in progress.
								</app-alert>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-12">
							<mat-divider class="my-2"></mat-divider>
							<span class="fw-semibold">Lost your certificate? </span>
							<a *ngIf="applicationIsInProgress" class="large disable">Request a replacement</a>
							<a
								*ngIf="!applicationIsInProgress"
								class="large"
								tabindex="0"
								aria-label="Request a certificate replacement"
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
