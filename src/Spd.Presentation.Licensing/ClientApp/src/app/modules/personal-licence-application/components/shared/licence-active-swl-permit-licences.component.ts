/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MainLicenceResponse } from '@app/core/services/application.service';

@Component({
	selector: 'app-licence-active-swl-permit-licences',
	template: `
		<div class="mb-3" *ngIf="activeLicences.length > 0">
			<div class="text-primary-color fs-5 py-3">Active Licences/Permits</div>
			<div
				class="summary-card-section summary-card-section__green mb-3 px-4 py-3"
				*ngFor="let licence of activeLicences; let i = index"
			>
				<div class="row">
					<div class="col-lg-2">
						<div class="fs-5" style="color: var(--color-primary);">
							{{ licence.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }}
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
								<div class="text-data">{{ licence.licenceTermCode | options : 'LicenceTermTypes' }}</div>
							</div>
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Expiry Date</div>
								<div class="text-data" [ngClass]="licence.isRenewalPeriod ? 'error-color' : ''">
									{{ licence.licenceExpiryDate | formatDate : constants.date.formalDateFormat }}
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
							*ngIf="
								licence.workerLicenceTypeCode === workerLicenceTypeCodes.SecurityWorkerLicence;
								else IsPermitContent
							"
						>
							<div class="row mb-2">
								<div class="col-lg-6">
									<div class="d-block text-muted mt-2 mt-lg-0">Licence Categories</div>
									<div class="text-data">
										<ul class="m-0">
											<ng-container *ngFor="let catCode of licence.licenceCategoryCodes; let i = index">
												<li>{{ catCode | options : 'WorkerCategoryTypes' }}</li>
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
												{{ licence.dogAuthorizationExpiryDate | formatDate : constants.date.formalDateFormat }}
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
												{{ licence.restraintAuthorizationExpiryDate | formatDate : constants.date.formalDateFormat }}
											</div>
										</ng-container>
									</div>
								</ng-container>
							</div>
							<mat-divider class="my-2"></mat-divider>
							<div class="row mb-2">
								<div class="col-lg-9">
									The following updates have a
									{{ licence.licenceReprintFee | currency : 'CAD' : 'symbol-narrow' : '1.0' }} licence reprint fee:
									<ul class="m-0">
										<li>changes to licence category</li>
										<li>requests for authorization for dogs or restraints</li>
										<li>changing your name</li>
										<li>replacing your photo</li>
									</ul>
								</div>
								<div class="col-lg-3 text-end" *ngIf="!applicationIsInProgress">
									<button
										mat-flat-button
										color="primary"
										*ngIf="licence.isRenewalPeriod"
										class="large my-2"
										(click)="onRenew(licence)"
									>
										<mat-icon>restore</mat-icon>Renew
									</button>
									<button
										mat-flat-button
										color="primary"
										*ngIf="licence.isUpdatePeriod"
										class="large my-2"
										(click)="onUpdate(licence)"
									>
										<mat-icon>update</mat-icon>Update
									</button>
								</div>
								<div class="col-12 mt-3" *ngIf="applicationIsInProgress">
									<app-alert type="info" icon="info">
										This {{ licence.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }} cannot be renewed, updated
										or replaced while an application is in progress
									</app-alert>
								</div>
							</div>
						</ng-container>
						<ng-template #IsPermitContent>
							<div class="row mb-2">
								<div class="offset-lg-9 col-lg-3 text-end" *ngIf="!applicationIsInProgress">
									<button
										mat-flat-button
										color="primary"
										*ngIf="licence.isRenewalPeriod"
										class="large my-2"
										(click)="onRenew(licence)"
									>
										<mat-icon>restore</mat-icon>Renew
									</button>
									<button
										mat-flat-button
										color="primary"
										*ngIf="licence.isUpdatePeriod"
										class="large my-2"
										(click)="onUpdate(licence)"
									>
										<mat-icon>update</mat-icon>Update
									</button>
								</div>
								<div class="col-12 mt-3" *ngIf="applicationIsInProgress">
									<app-alert type="info" icon="info">
										<ng-container *ngIf="licence.isReplacementPeriod; else NoPermitReplacementPeriod">
											This {{ licence.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }} cannot be renewed,
											updated or replaced while an application is in progress
										</ng-container>
										<ng-template #NoPermitReplacementPeriod>
											This {{ licence.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }} cannot be renewed or
											updated while an application is in progress
										</ng-template>
									</app-alert>
								</div>
							</div>
						</ng-template>
					</div>

					<div class="row">
						<ng-container
							*ngIf="
								licence.workerLicenceTypeCode === workerLicenceTypeCodes.SecurityWorkerLicence;
								else IsPermitFooter
							"
						>
							<ng-container *ngIf="licence.isReplacementPeriod; else IsNotReplacementPeriod">
								<div class="col-12" *ngIf="lostLicenceDaysText">
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
							</ng-container>
							<ng-template #IsNotReplacementPeriod>
								<div class="col-12">
									<mat-divider class="my-2"></mat-divider>
									<span class="fw-semibold">Lost your licence? </span>
									<a class="large" [href]="constants.urls.contactSpdUrl" target="_blank">Contact SPD</a>
									for a digital copy of your current licence before it expires.
								</div>
							</ng-template>
						</ng-container>

						<ng-template #IsPermitFooter>
							<ng-container *ngIf="licence.isReplacementPeriod; else IsNotReplacementPeriod">
								<div class="col-12" *ngIf="lostLicenceDaysText">
									<mat-divider class="my-2"></mat-divider>
									<span class="fw-semibold">Lost or stolen permit? </span>
									<a *ngIf="applicationIsInProgress" class="large disable">Request a replacement</a>
									<a
										*ngIf="!applicationIsInProgress"
										class="large"
										tabindex="0"
										(click)="onRequestReplacement(licence)"
										(keydown)="onKeydownRequestReplacement($event, licence)"
										>Request a replacement</a
									>
									and we'll send you one in {{ lostLicenceDaysText }} business days.
								</div>
							</ng-container>
							<ng-template #IsNotReplacementPeriod>
								<div class="col-12">
									<mat-divider class="my-2"></mat-divider>
									<span class="fw-semibold">Lost or stolen permit? </span>
									<a class="large" [href]="constants.urls.contactSpdUrl" target="_blank">Contact SPD</a>
									for a digital copy of your current permit before it expires.
								</div>
							</ng-template>
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
})
export class LicenceActiveSwlPermitLicencesComponent {
	constants = SPD_CONSTANTS;

	workerLicenceTypeCodes = WorkerLicenceTypeCode;

	@Input() activeLicences!: Array<MainLicenceResponse>;
	@Input() applicationIsInProgress!: boolean;
	@Input() lostLicenceDaysText!: string;

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
