/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MainLicenceResponse } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-business-licence-list-current',
	template: `
		<div class="mb-3" *ngIf="activeLicences.length > 0">
			<div class="text-primary-color fs-5 py-3">Valid Licence</div>
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
								<div class="d-block text-muted mt-2 mt-md-0">Licence Number</div>
								<div class="text-data fw-bold">{{ licence.licenceNumber }}</div>
							</div>
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-md-0">Licence Term</div>
								<div class="text-data fw-bold">{{ licence.licenceTermCode | options: 'LicenceTermTypes' }}</div>
							</div>
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-md-0">Expiry Date</div>
								<div class="text-data">
									<div class="text-data fw-bold" [ngClass]="licence.isRenewalPeriod ? 'error-color' : ''">
										{{ licence.expiryDate | formatDate: formalDateFormat }}
									</div>
								</div>
							</div>
							<div class="col-lg-3 text-end">
								<mat-chip-option [selectable]="false" class="appl-chip-option mat-chip-green">
									<mat-icon class="appl-chip-option-item">check_circle</mat-icon>
									<span class="appl-chip-option-item ms-2 fs-5">Active</span>
								</mat-chip-option>
							</div>
							<mat-divider class="my-2"></mat-divider>
						</div>

						<div class="row mb-2">
							<div class="col-lg-6">
								<div class="d-block text-muted mt-2 mt-md-0">Licence Categories</div>
								<div class="text-data">
									<ul class="m-0">
										<ng-container *ngFor="let catCode of licence.licenceCategoryCodes; let i = index">
											<li>{{ catCode | options: 'WorkerCategoryTypes' }}</li>
										</ng-container>
									</ul>
								</div>
							</div>
							<ng-container *ngIf="licence.hasSecurityGuardCategory">
								<div class="col-lg-6">
									<div class="d-block text-muted mt-2">Dog Authorization</div>
									<div class="text-data">
										<ng-container *ngIf="licence.dogAuthorization; else noDogAuthorization">
											Authorized to use dogs
										</ng-container>
										<ng-template #noDogAuthorization> Not authorized to use dogs </ng-template>
									</div>
									<ng-container *ngIf="licence.dogAuthorizationExpiryDate">
										<div class="d-block text-muted mt-2">Expiry Date</div>
										<div class="text-data">
											{{ licence.dogAuthorizationExpiryDate | formatDate: formalDateFormat }}
										</div>
									</ng-container>
								</div>
							</ng-container>

							<mat-divider class="my-2"></mat-divider>
						</div>

						<div class="row mb-2">
							<div class="col-lg-9">
								The following updates have a
								{{ licence.licenceReprintFee | currency: 'CAD' : 'symbol-narrow' : '1.0' }} licence reprint fee:
								<ul class="m-0">
									<li>add or remove branch</li>
									<li>change to business trade name</li>
									<li>change to business legal name</li>
									<li>change to business address</li>
									<li>add request for dogs authorization</li>
									<li>update licence category</li>
								</ul>
							</div>
							<div class="col-lg-3 text-end" *ngIf="!applicationIsInProgress">
								<button
									mat-flat-button
									color="primary"
									class="large my-2"
									(click)="onRenew(licence)"
									aria-label="Renew the licence"
									*ngIf="licence.isRenewalPeriod && !licence.isSimultaneousFlow"
								>
									<mat-icon>restore</mat-icon>Renew
								</button>

								<button
									mat-flat-button
									color="primary"
									class="large my-2"
									aria-label="Update the licence"
									(click)="onUpdate(licence)"
								>
									<mat-icon>update</mat-icon>Update
								</button>
							</div>
							<div
								class="col-12 mt-3"
								*ngIf="!applicationIsInProgress && licence.isRenewalPeriod && licence.isSimultaneousFlow"
							>
								<app-alert type="warning" icon="warning">
									To renew your {{ licence.serviceTypeCode | options: 'ServiceTypes' }}, please renew your
									{{ swlServiceTypeCode | options: 'ServiceTypes' }} first.
								</app-alert>
							</div>
							<div class="col-12 mt-3" *ngIf="applicationIsInProgress">
								<app-alert type="info" icon="info">
									This {{ licence.serviceTypeCode | options: 'ServiceTypes' }} cannot be renewed, updated or replaced
									while an application is in progress.
								</app-alert>
							</div>
						</div>
					</div>

					<div class="row">
						<ng-container *ngIf="licence.isRenewalPeriod; else IsNotRenewalPeriod">
							<div class="col-12">
								<mat-divider class="my-2"></mat-divider>
								<span class="fw-semibold">Lost your licence? </span>
								<a class="large" [href]="contactSpdUrl" target="_blank">Contact SPD</a>
								for a digital copy of your current licence before it expires.
							</div>
						</ng-container>
						<ng-template #IsNotRenewalPeriod>
							<div class="col-12">
								<mat-divider class="my-2"></mat-divider>
								<span class="fw-semibold">Lost your licence? </span>
								<a *ngIf="applicationIsInProgress" class="large disable">Request a replacement</a>
								<a
									*ngIf="!applicationIsInProgress"
									class="large"
									tabindex="0"
									(click)="onRequestReplacement(licence)"
									(keydown)="onKeydownRequestReplacement($event, licence)"
									>Request a replacement</a
								>
								and we'll send you a new licence in {{ lostLicenceDaysText }} business days.
							</div>
						</ng-template>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.appl-chip-option {
				height: 35px;
				width: 125px;
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
export class BusinessLicenceListCurrentComponent {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;
	contactSpdUrl = SPD_CONSTANTS.urls.contactSpdUrl;

	swlServiceTypeCode = ServiceTypeCode.SecurityWorkerLicence;

	@Input() activeLicences!: Array<MainLicenceResponse>;
	@Input() applicationIsInProgress!: boolean;
	@Input() lostLicenceDaysText!: string;
	@Input() isSoleProprietor!: boolean;

	@Output() replaceLicence: EventEmitter<MainLicenceResponse> = new EventEmitter();
	@Output() updateLicence: EventEmitter<MainLicenceResponse> = new EventEmitter();
	@Output() renewLicence: EventEmitter<MainLicenceResponse> = new EventEmitter();

	onRequestReplacement(licence: MainLicenceResponse): void {
		this.replaceLicence.emit(licence);
	}

	onKeydownRequestReplacement(event: KeyboardEvent, licence: MainLicenceResponse) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onRequestReplacement(licence);
	}

	onUpdate(licence: MainLicenceResponse): void {
		this.updateLicence.emit(licence);
	}

	onRenew(licence: MainLicenceResponse): void {
		this.renewLicence.emit(licence);
	}
}
