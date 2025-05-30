/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MainLicenceResponse } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-personal-licence-main-licence-list',
	template: `
		<div class="mb-3" *ngIf="activeLicences.length > 0">
			<div class="text-minor-heading py-3">Active Licences/Permits</div>
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

						<ng-container
							*ngIf="licence.serviceTypeCode === serviceTypeCodes.SecurityWorkerLicence; else IsPermitContent"
						>
							<div class="row mb-2">
								<div class="col-lg-6">
									<div class="d-block text-muted mt-2 mt-lg-0">Licence Categories</div>
									<div class="text-data">
										<ul class="m-0">
											<ng-container *ngFor="let catCode of licence.licenceCategoryCodes; let i = index">
												<li>{{ catCode | options: 'WorkerCategoryTypes' }}</li>
											</ng-container>
										</ul>
									</div>
								</div>
								<ng-container *ngIf="licence.hasSecurityGuardCategory">
									<div class="col-lg-3">
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
									<div class="col-lg-3">
										<div class="d-block text-muted mt-2">Restraint Authorization</div>
										<div class="text-data">
											<ng-container *ngIf="licence.restraintAuthorization; else noRestraintAuthorization">
												Authorized to use restraints
											</ng-container>
											<ng-template #noRestraintAuthorization> Not authorized to use restraints </ng-template>
										</div>
										<ng-container *ngIf="licence.restraintAuthorizationExpiryDate">
											<div class="d-block text-muted mt-2">Expiry Date</div>
											<div class="text-data">
												{{ licence.restraintAuthorizationExpiryDate | formatDate: formalDateFormat }}
											</div>
										</ng-container>
									</div>
								</ng-container>
							</div>
							<mat-divider class="my-2"></mat-divider>
							<div class="row mb-2">
								<div class="col-lg-9">
									The following updates have a
									{{ licence.licenceReprintFee | currency: 'CAD' : 'symbol-narrow' : '1.0' }} licence reprint fee:
									<ul class="m-0">
										<li>Licence category change</li>
										<li>Authorization for dogs or restraints (e.g., handcuffs)</li>
										<li>Name change</li>
										<li>Licence replacement</li>
									</ul>
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
									<button
										mat-flat-button
										color="primary"
										*ngIf="licence.isUpdatePeriod"
										class="large my-2"
										aria-label="Update the licence"
										(click)="onUpdate(licence)"
									>
										<mat-icon>update</mat-icon>Update
									</button>
								</div>
								<div class="col-12 mt-3" *ngIf="applicationIsInProgress">
									<app-alert type="info" icon="info">
										This {{ licence.serviceTypeCode | options: 'ServiceTypes' }} cannot be renewed, updated or replaced
										while an application is in progress.
									</app-alert>
								</div>
							</div>
						</ng-container>
						<ng-template #IsPermitContent>
							<div class="row mb-2">
								<div class="col-lg-9">
									Permit updates include the following changes:
									<ul class="m-0">
										<li>Name change</li>
										<li>Reason or rationale change</li>
										<li>Employer information change</li>
										<li>Permit replacement</li>
									</ul>
								</div>
								<div class="col-lg-3 text-end" *ngIf="!applicationIsInProgress">
									<button
										mat-flat-button
										color="primary"
										*ngIf="licence.isRenewalPeriod"
										class="large my-2"
										aria-label="Renew the permit"
										(click)="onRenew(licence)"
									>
										<mat-icon>restore</mat-icon>Renew
									</button>
									<button
										mat-flat-button
										color="primary"
										*ngIf="licence.isUpdatePeriod"
										class="large my-2"
										aria-label="Update the permit"
										(click)="onUpdate(licence)"
									>
										<mat-icon>update</mat-icon>Update
									</button>
								</div>
								<div class="col-12 mt-3" *ngIf="applicationIsInProgress">
									<app-alert type="info" icon="info">
										<ng-container *ngIf="licence.isReplacementPeriod; else NoPermitReplacementPeriod">
											This {{ licence.serviceTypeCode | options: 'ServiceTypes' }} cannot be renewed, updated or
											replaced while an application is in progress.
										</ng-container>
										<ng-template #NoPermitReplacementPeriod>
											This {{ licence.serviceTypeCode | options: 'ServiceTypes' }} cannot be renewed or updated while an
											application is in progress.
										</ng-template>
									</app-alert>
								</div>
							</div>
						</ng-template>
					</div>

					<div class="row">
						<ng-container
							*ngIf="licence.serviceTypeCode === serviceTypeCodes.SecurityWorkerLicence; else IsPermitFooter"
						>
							<div class="col-12">
								<mat-divider class="my-2"></mat-divider>
								<span class="fw-semibold">Lost your licence? </span>
								<a *ngIf="applicationIsInProgress" class="large disable">Request a replacement</a>
								<a
									*ngIf="!applicationIsInProgress"
									class="large"
									tabindex="0"
									aria-label="Request a security worker licence replacement"
									(click)="onRequestReplacement(licence)"
									(keydown)="onKeydownRequestReplacement($event, licence)"
									>Request a replacement</a
								>

								<div class="mt-4" *ngIf="licence.originalPhotoOfYourselfExpired">
									<app-alert type="danger" icon="dangerous">
										A replacement for this record is not available at this time. Use update to provide missing
										information and receive a replacement.
									</app-alert>
								</div>
							</div>
						</ng-container>

						<ng-template #IsPermitFooter>
							<div class="col-12">
								<mat-divider class="my-2"></mat-divider>
								<span class="fw-semibold">Lost or stolen permit? </span>
								<a *ngIf="applicationIsInProgress" class="large disable">Request a replacement</a>
								<a
									*ngIf="!applicationIsInProgress"
									class="large"
									tabindex="0"
									aria-label="Request a permit replacement"
									(click)="onRequestReplacement(licence)"
									(keydown)="onKeydownRequestReplacement($event, licence)"
									>Request a replacement</a
								>
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
export class PersonalLicenceMainLicenceListComponent {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

	serviceTypeCodes = ServiceTypeCode;

	@Input() activeLicences!: Array<MainLicenceResponse>;
	@Input() applicationIsInProgress!: boolean;

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
