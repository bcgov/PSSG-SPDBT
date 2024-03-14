/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
	ApplicationPortalStatusCode,
	ApplicationTypeCode,
	LicenceAppListResponse,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { Subscription, take, tap } from 'rxjs';
import {
	CommonApplicationService,
	UserApplicationResponse,
	UserLicenceResponse,
} from '../../services/common-application.service';

@Component({
	selector: 'app-licence-user-applications',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Security Licences & Permits</h2>
						</div>

						<div class="col-xl-6 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								<button mat-flat-button color="primary" class="large w-auto mb-3" (click)="onUserProfile()">
									<mat-icon>person</mat-icon>
									Your Profile <span *ngIf="applicationIsInProgress"> (Readonly)</span>
								</button>
							</div>
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<ng-container *ngFor="let msg of warningMessages; let i = index">
						<app-alert type="warning" icon="warning">
							{{ msg }}
						</app-alert>
					</ng-container>

					<!-- 
					<app-alert type="info" icon="info">
						We noticed you changed your name recently. Do you want a new licence printed with your new name, for a $20
						fee?
					</app-alert>

					<app-alert type="danger" icon="error">
						You haven't submitted your licence application yet. It will expire on <strong>January 12, 2024</strong>
					</app-alert> 
					-->

					<!-- <div class="summary-card-section my-4 px-4 py-3" *ngIf="isNoActiveOrExpiredLicences">
						<div class="row">
							<div class="col-lg-6">
								<div class="text-data">You don't have an active licence</div>
							</div>
							<div class="col-lg-6 text-end">
								<button mat-flat-button color="primary" class="large w-auto mt-2 mt-lg-0" (click)="onNew()">
									<mat-icon>add</mat-icon>Apply for a new Licence or Permit
								</button>
							</div>
						</div>
					</div> -->

					<div class="mb-3" *ngIf="applicationsDataSource.data.length > 0">
						<div class="section-title fs-5 py-3">Applications</div>

						<div class="row summary-card-section summary-card-section__orange m-0">
							<div class="col-12" class="draft-table">
								<mat-table
									[dataSource]="applicationsDataSource"
									class="draft-table pb-3"
									[multiTemplateDataRows]="true"
								>
									<ng-container matColumnDef="serviceTypeCode">
										<mat-header-cell *matHeaderCellDef>Licence Type</mat-header-cell>
										<mat-cell *matCellDef="let application">
											<span class="mobile-label">Licence Type:</span>
											<span class="my-2">
												{{ application.serviceTypeCode | options : 'WorkerLicenceTypes' }}
											</span>
										</mat-cell>
									</ng-container>

									<ng-container matColumnDef="createdOn">
										<mat-header-cell *matHeaderCellDef>Date Started</mat-header-cell>
										<mat-cell *matCellDef="let application">
											<span class="mobile-label">Date Started:</span>
											{{ application.createdOn | formatDate | default }}
										</mat-cell>
									</ng-container>

									<ng-container matColumnDef="submittedOn">
										<mat-header-cell *matHeaderCellDef>Date Submitted</mat-header-cell>
										<mat-cell *matCellDef="let application">
											<span class="mobile-label">Date Submitted:</span>
											{{ application.submittedOn | formatDate | default }}
										</mat-cell>
									</ng-container>

									<ng-container matColumnDef="applicationTypeCode">
										<mat-header-cell *matHeaderCellDef>Type</mat-header-cell>
										<mat-cell *matCellDef="let application">
											<span class="mobile-label">Type:</span>
											{{ application.applicationTypeCode | options : 'ApplicationTypes' }}
										</mat-cell>
									</ng-container>

									<ng-container matColumnDef="caseNumber">
										<mat-header-cell *matHeaderCellDef>Case Id</mat-header-cell>
										<mat-cell *matCellDef="let application">
											<span class="mobile-label">Case Id:</span>
											{{ application.caseNumber }}
										</mat-cell>
									</ng-container>

									<ng-container matColumnDef="applicationPortalStatusCode">
										<mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
										<mat-cell *matCellDef="let application">
											<span class="mobile-label">Status:</span>
											<span class="fw-bold" [ngClass]="getStatusClass(application.applicationPortalStatusCode)">
												{{
													application.applicationPortalStatusCode | options : 'ApplicationPortalStatusTypes' | default
												}}
											</span>
										</mat-cell>
									</ng-container>

									<ng-container matColumnDef="action1">
										<mat-header-cell *matHeaderCellDef></mat-header-cell>
										<mat-cell *matCellDef="let application">
											<button
												mat-flat-button
												color="primary"
												class="large my-2"
												(click)="onResume(application)"
												*ngIf="application.applicationPortalStatusCode === applicationPortalStatusCodes.Draft"
											>
												<mat-icon>play_arrow</mat-icon>Resume
											</button>
										</mat-cell>
									</ng-container>

									<ng-container matColumnDef="expandedDetail">
										<mat-cell *matCellDef="let application" [attr.colspan]="applicationColumns.length" class="px-0">
											<ng-container *ngIf="application.isExpiryWarning || application.isExpiryError">
												<div
													class="alert d-flex d-inline-flex align-items-center w-100"
													[ngClass]="application.isExpiryWarning ? 'draft-warning-message' : 'draft-error-message'"
													role="alert"
												>
													<div class="my-1 px-2">
														You haven't submitted this licence application yet. It will expire on
														{{ application.applicationExpiryDate | formatDate : constants.date.formalDateFormat }}.
													</div>
												</div>
											</ng-container>
										</mat-cell>
									</ng-container>

									<mat-header-row *matHeaderRowDef="applicationColumns; sticky: true"></mat-header-row>
									<mat-row *matRowDef="let row; columns: applicationColumns"></mat-row>
									<mat-row *matRowDef="let row; columns: ['expandedDetail']" class="expanded-detail-row"></mat-row>
								</mat-table>
							</div>
						</div>
					</div>

					<ng-container *ngIf="areLicencesLoaded">
						<div class="mb-3">
							<div class="section-title fs-5 py-3">Active Licences/Permits</div>

							<ng-container *ngIf="activeApplications.length > 0">
								<div
									class="summary-card-section summary-card-section__green mb-3 px-4 py-3"
									*ngFor="let appl of activeApplications; let i = index"
								>
									<div class="row">
										<div class="col-lg-2">
											<div class="fs-5" style="color: var(--color-primary);">
												{{ appl.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }}
											</div>
										</div>
										<div class="col-lg-10">
											<div class="row">
												<div class="col-lg-3">
													<div class="d-block text-muted mt-2 mt-md-0">Licence Number</div>
													<div class="text-data">{{ appl.licenceNumber }}</div>
												</div>
												<div class="col-lg-3">
													<div class="d-block text-muted mt-2 mt-md-0">Licence Term</div>
													<div class="text-data">{{ appl.licenceTermCode | options : 'LicenceTermTypes' }}</div>
												</div>
												<div class="col-lg-3">
													<div class="d-block text-muted mt-2 mt-md-0">Case Id</div>
													<div class="text-data">{{ appl.caseNumber }}</div>
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
													appl.workerLicenceTypeCode === workerLicenceTypeCodes.SecurityWorkerLicence;
													else isPermit
												"
											>
												<div class="row mb-2">
													<div class="col-lg-3">
														<div class="d-block text-muted mt-2 mt-md-0">Expiry Date</div>
														<div class="text-data" [ngClass]="appl.isRenewalPeriod ? 'error-color' : ''">
															{{ appl.licenceExpiryDate | formatDate : constants.date.formalDateFormat }}
														</div>
													</div>
													<div class="col-lg-4">
														<div class="d-block text-muted mt-2 mt-md-0">Licence Categories</div>
														<div class="text-data">
															<ul class="m-0">
																<ng-container *ngFor="let catCode of appl.categoryCodes; let i = index">
																	<li>{{ catCode | options : 'WorkerCategoryTypes' }}</li>
																</ng-container>
															</ul>
														</div>
													</div>
													<div class="col-lg-5" *ngIf="appl.dogAuthorization">
														<div class="d-block text-muted mt-2 mt-md-0">Authorization Documents</div>
														<div class="text-data">{{ appl.dogAuthorization | options : 'DogDocumentTypes' }}</div>
													</div>
													<div class="col-lg-5" *ngIf="appl.restraintAuthorization">
														<div class="d-block text-muted mt-2 mt-md-0">Authorization Documents</div>
														<div class="text-data">
															{{ appl.restraintAuthorization | options : 'RestraintDocumentTypes' }}
														</div>
													</div>
												</div>
												<mat-divider class="my-2"></mat-divider>
												<div class="row mb-2">
													<div class="col-lg-9">
														The following updates have a
														{{ appl.licenceReprintFee | currency : 'CAD' : 'symbol-narrow' : '1.0' }} licence reprint
														fee:
														<ul class="m-0">
															<li>changes to licence category</li>
															<li>requests for authorization for dogs or restraints</li>
															<li>changing your name</li>
															<li>replacing your photo</li>
														</ul>
													</div>
													<div class="col-lg-3 text-end">
														<button
															mat-flat-button
															color="primary"
															*ngIf="appl.isRenewalPeriod"
															class="large my-2"
															(click)="onRenew(appl)"
														>
															<mat-icon>restore</mat-icon>Renew
														</button>
														<button
															mat-flat-button
															color="primary"
															*ngIf="appl.isUpdatePeriod"
															class="large my-2"
															(click)="onUpdate(appl)"
														>
															<mat-icon>update</mat-icon>Update
														</button>
													</div>
												</div>
											</ng-container>
											<ng-template #isPermit>
												<div class="row mb-2">
													<div class="col-lg-9">
														<div class="d-block text-muted mt-2 mt-md-0">Expiry Date</div>
														<div class="text-data" [ngClass]="appl.isRenewalPeriod ? 'error-color' : ''">
															{{ appl.licenceExpiryDate | formatDate : constants.date.formalDateFormat }}
														</div>
													</div>
													<div class="col-lg-3 text-end">
														<button
															mat-flat-button
															color="primary"
															*ngIf="appl.isRenewalPeriod"
															class="large my-2"
															(click)="onRenew(appl)"
														>
															<mat-icon>restore</mat-icon>Renew
														</button>
														<button
															mat-flat-button
															color="primary"
															*ngIf="appl.isUpdatePeriod"
															class="large my-2"
															(click)="onUpdate(appl)"
														>
															<mat-icon>update</mat-icon>Update
														</button>
													</div>
												</div>
											</ng-template>
										</div>

										<div class="row">
											<ng-container
												*ngIf="
													appl.workerLicenceTypeCode === workerLicenceTypeCodes.SecurityWorkerLicence;
													else IsPermit
												"
											>
												<ng-container *ngIf="appl.isReplacementPeriod; else IsNotReplacementPeriod">
													<div class="col-12">
														<mat-divider class="my-2"></mat-divider>
														<span class="fw-semibold">Lost your licence? </span>
														<a
															class="large"
															tabindex="0"
															(click)="onRequestReplacement(appl)"
															(keydown)="onKeydownRequestReplacement($event, appl)"
															>Request a replacement</a
														>
														and we'll send you a new licence in xx-xx business days.
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

											<ng-template #IsPermit>
												<ng-container *ngIf="appl.isReplacementPeriod; else IsNotReplacementPeriod">
													<div class="col-12">
														<mat-divider class="my-2"></mat-divider>
														<span class="fw-semibold">Lost or stolen permit? </span>
														<a
															class="large"
															tabindex="0"
															(click)="onRequestReplacement(appl)"
															(keydown)="onKeydownRequestReplacement($event, appl)"
															>Request a replacement</a
														>
														and we'll send you one in xx-xx business days.
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
							</ng-container>

							<div class="summary-card-section mb-3 px-4 py-3" *ngIf="!activeLicencesExist">
								<div class="row">
									<div class="col-lg-6">
										<div class="text-data">You don't have an active licence</div>
									</div>
									<div class="col-lg-6 text-end">
										<button
											mat-flat-button
											color="primary"
											class="large w-auto mt-2 mt-lg-0"
											(click)="onNewSecurityWorkerLicence()"
										>
											<mat-icon>add</mat-icon>Apply for a new Licence
										</button>
									</div>
								</div>
							</div>

							<div class="summary-card-section mb-3 px-4 py-3" *ngIf="!activeBaPermitsExist">
								<div class="row">
									<div class="col-lg-6">
										<div class="text-data">You don't have an active Body Armour permit</div>
									</div>
									<div class="col-lg-6 text-end">
										<button
											mat-flat-button
											color="primary"
											class="large w-auto mt-2 mt-lg-0"
											(click)="onNewSecurityWorkerLicence()"
										>
											<mat-icon>add</mat-icon>Apply for a new Body Amour Permit
										</button>
									</div>
								</div>
							</div>

							<div class="summary-card-section mb-3 px-4 py-3" *ngIf="!activeAvPermitsExist">
								<div class="row">
									<div class="col-lg-6">
										<div class="text-data">You don't have an active Armoured Vehicle permit</div>
									</div>
									<div class="col-lg-6 text-end">
										<button
											mat-flat-button
											color="primary"
											class="large w-auto mt-2 mt-lg-0"
											(click)="onNewSecurityWorkerLicence()"
										>
											<mat-icon>add</mat-icon>Apply for a new Armoured Vehicle Permit
										</button>
									</div>
								</div>
							</div>
						</div>

						<div class="mb-3" *ngIf="expiredLicences.length > 0">
							<div class="section-title fs-5 py-3">Expired Licences/Permits</div>
							<div
								class="summary-card-section summary-card-section__red mb-2 px-4 py-3"
								*ngFor="let appl of expiredLicences; let i = index"
							>
								<div class="row">
									<div class="col-lg-3">
										<div class="fs-5" style="color: var(--color-primary);">
											{{ appl.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }}
										</div>
									</div>
									<div class="col-lg-9">
										<div class="row">
											<div class="col-lg-3">
												<div class="d-block text-muted mt-2 mt-md-0">Licence Number</div>
												<div class="text-data">{{ appl.licenceNumber }}</div>
											</div>
											<div class="col-lg-3">
												<div class="d-block text-muted mt-2 mt-md-0">Licence Term</div>
												<div class="text-data">5 Years</div>
											</div>
											<div class="col-lg-3">
												<div class="d-block text-muted mt-2 mt-md-0">Expiry Date</div>
												<div class="text-data">
													{{ appl.licenceExpiryDate | formatDate : constants.date.formalDateFormat }}
												</div>
											</div>
											<div class="col-lg-3 text-end">
												<mat-chip-option [selectable]="false" class="appl-chip-option mat-chip-red">
													<mat-icon class="appl-chip-option-item">cancel</mat-icon>
													<span class="appl-chip-option-item ms-2 fs-5">Expired</span>
												</mat-chip-option>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</ng-container>

					<div class="mt-4">
						<app-alert type="info" [showBorder]="false" icon="">
							Do you have a security licence but it's not showing here?

							<a
								class="fw-normal"
								tabindex="0"
								(click)="onConnectToExpiredLicence()"
								(keydown)="onKeydownConnectToExpiredLicence($event)"
								>Connect a current or expired licence</a
							>
							account
						</app-alert>
					</div>

					<br /><br /><br />

					<div class="fw-bold">Temp buttons for testing:</div>
					<div class="my-2">
						<button
							mat-flat-button
							color="primary"
							class="large w-auto mt-2 mt-lg-0"
							(click)="onNewSecurityWorkerLicence()"
						>
							<mat-icon>add</mat-icon>Apply for a new Security Worker Licence
						</button>
					</div>

					<div class="my-2">
						<button
							mat-stroked-button
							color="primary"
							class="large w-auto mt-2 mt-lg-0"
							(click)="onRenewSecurityWorkerLicence()"
						>
							Renew Security Worker Licence
						</button>
					</div>

					<div class="my-2">
						<button
							mat-stroked-button
							color="primary"
							class="large w-auto mt-2 mt-lg-0"
							(click)="onUpdateSecurityWorkerLicence()"
						>
							Update Security Worker Licence
						</button>
					</div>

					<div class="my-2">
						<button
							mat-stroked-button
							color="primary"
							class="large w-auto mt-2 mt-lg-0"
							(click)="onReplacmentSecurityWorkerLicence()"
						>
							Replace Security Worker Licence
						</button>
					</div>

					<mat-divider class="my-3"></mat-divider>

					<div class="my-2">
						<button
							mat-flat-button
							color="primary"
							class="large w-auto mt-2 mt-lg-0"
							(click)="onNewArmouredVehiclePermit()"
						>
							<mat-icon>add</mat-icon>Apply for a new Armoured Vehicle Permit
						</button>
					</div>

					<div class="my-2">
						<button
							mat-stroked-button
							color="primary"
							class="large w-auto mt-2 mt-lg-0"
							(click)="onRenewArmouredVehiclePermit()"
						>
							Renew Armoured Vehicle Permit
						</button>
					</div>

					<div class="my-2">
						<button
							mat-stroked-button
							color="primary"
							class="large w-auto mt-2 mt-lg-0"
							(click)="onUpdateArmouredVehiclePermit()"
						>
							Update Armoured Vehicle Permit
						</button>
					</div>

					<mat-divider class="my-3"></mat-divider>

					<div class="my-2">
						<button mat-flat-button color="primary" class="large w-auto mt-2 mt-lg-0" (click)="onNewBodyArmourPermit()">
							<mat-icon>add</mat-icon>Apply for a new Body Armour Permit
						</button>
					</div>

					<div class="my-2">
						<button
							mat-stroked-button
							color="primary"
							class="large w-auto mt-2 mt-lg-0"
							(click)="onRenewBodyArmourPermit()"
						>
							Renew Body Armour Permit
						</button>
					</div>

					<div class="my-2">
						<button
							mat-stroked-button
							color="primary"
							class="large w-auto mt-2 mt-lg-0"
							(click)="onUpdateBodyArmourPermit()"
						>
							Update Body Armour Permit
						</button>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.appl-chip-option {
				height: 35px;
			}

			.appl-chip-option-item {
				vertical-align: text-bottom;
			}

			.mat-column-action1 {
				text-align: right;
				justify-content: flex-end;
				min-width: 160px;
				.table-button {
					min-width: 140px;
				}
			}

			.section-title {
				color: var(--color-primary) !important;
			}

			.status-green {
				color: var(--color-green) !important;
			}

			.status-orange {
				color: var(--color-orange) !important;
			}

			.draft-table {
				background-color: #f6f6f6 !important;
			}

			.draft-error-message {
				color: #721c24;
				background-color: #fceded;
				border-radius: 0;
				border-bottom: 1px solid var(--mat-table-row-item-outline-color, rgba(0, 0, 0, 0.12));
			}

			.draft-warning-message {
				color: #856404;
				background-color: #fff9e5;
				border-radius: 0;
				border-bottom: 1px solid var(--mat-table-row-item-outline-color, rgba(0, 0, 0, 0.12));
			}

			.error-color {
				font-weight: 600;
				color: var(--color-red-dark);
			}
		`,
	],
})
export class LicenceUserApplicationsComponent implements OnInit, OnDestroy {
	constants = SPD_CONSTANTS;

	applicationIsInProgress = false;

	areLicencesLoaded = false;

	warningMessages: Array<string> = [];
	// errorMessages: Array<string> = [];

	workerLicenceTypeCodes = WorkerLicenceTypeCode;
	applicationPortalStatusCodes = ApplicationPortalStatusCode;

	activeApplications: Array<UserLicenceResponse> = [];

	// If the licence holder has a SWL, they can add a new Body Armour and/or Armoured Vehicle permit
	// If the licence holder has a Body Armour permit, they can add a new Armoured Vehicle permit and/or a security worker licence
	// If the licence holder has an Armoured vehicle permit, they can add a new Body Armour permit and/or a security worker licence
	activeLicencesExist = false;
	activeAvPermitsExist = false;
	activeBaPermitsExist = false;

	expiredLicences: Array<UserLicenceResponse> = [];

	authenticationSubscription!: Subscription;
	licenceApplicationRoutes = LicenceApplicationRoutes;

	applicationsDataSource: MatTableDataSource<UserApplicationResponse> = new MatTableDataSource<UserApplicationResponse>(
		[]
	);
	applicationColumns: string[] = [
		'serviceTypeCode',
		'createdOn',
		'submittedOn',
		'applicationTypeCode',
		'caseNumber',
		'applicationPortalStatusCode',
		'action1',
	];

	constructor(
		private router: Router,
		private optionsPipe: OptionsPipe,
		private formatDatePipe: FormatDatePipe,
		private commonApplicationService: CommonApplicationService,
		private permitApplicationService: PermitApplicationService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	async ngOnInit(): Promise<void> {
		this.commonApplicationService.userLicencesList().subscribe((resp: Array<UserLicenceResponse>) => {
			this.activeApplications = resp.filter((item: UserLicenceResponse) => !item.isExpired);
			this.expiredLicences = resp.filter((item: UserLicenceResponse) => item.isExpired);
			const renewals = this.activeApplications.filter((item: UserLicenceResponse) => item.isRenewalPeriod);
			renewals.forEach((item: UserLicenceResponse) => {
				const itemLabel = this.optionsPipe.transform(item.workerLicenceTypeCode, 'WorkerLicenceTypes');
				const itemExpiry = this.formatDatePipe.transform(item.licenceExpiryDate, SPD_CONSTANTS.date.formalDateFormat);
				this.warningMessages.push(
					`Your ${itemLabel} is expiring in ${item.licenceExpiryNumberOfDays} days. Please renew by ${itemExpiry}.`
				);
			});
			this.activeLicencesExist =
				this.activeApplications.findIndex(
					(item: UserLicenceResponse) => item.workerLicenceTypeCode === WorkerLicenceTypeCode.SecurityWorkerLicence
				) >= 0;
			this.activeBaPermitsExist =
				this.activeApplications.findIndex(
					(item: UserLicenceResponse) => item.workerLicenceTypeCode === WorkerLicenceTypeCode.BodyArmourPermit
				) >= 0;
			this.activeAvPermitsExist =
				this.activeApplications.findIndex(
					(item: UserLicenceResponse) => item.workerLicenceTypeCode === WorkerLicenceTypeCode.ArmouredVehiclePermit
				) >= 0;

			this.areLicencesLoaded = true;
		});

		this.commonApplicationService.userApplicationsList().subscribe((resp: Array<UserApplicationResponse>) => {
			this.applicationsDataSource = new MatTableDataSource(resp ?? []);
			this.applicationIsInProgress = !!resp.find(
				(item: UserApplicationResponse) => item.applicationPortalStatusCode === ApplicationPortalStatusCode.InProgress
			);
		});
	}

	ngOnDestroy() {
		if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
	}

	onUserProfile(): void {
		// TODO  When a user has started an application but has not submitted it yet, the user can view their Profile page in read-only mode – they can't edit this info while the application is in progress
		this.licenceApplicationService
			.loadUserProfile()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
							LicenceApplicationRoutes.LICENCE_LOGIN_USER_PROFILE
						)
					);
				}),
				take(1)
			)
			.subscribe();
	}

	getStatusClass(applicationPortalStatusCode: ApplicationPortalStatusCode): string {
		switch (applicationPortalStatusCode) {
			case ApplicationPortalStatusCode.Draft: {
				return 'status-orange';
			}
			case ApplicationPortalStatusCode.InProgress: {
				return 'status-green';
			}
			default: {
				return '';
			}
		}
	}

	// onUpdateAuthorization(): void {
	// 	const data: DialogOptions = {
	// 		icon: 'warning',
	// 		title: 'UpdateAuthorization',
	// 		message: 'UpdateAuthorization',
	// 		actionText: 'Save',
	// 		cancelText: 'Cancel',
	// 	};

	// 	this.dialog
	// 		.open(DialogComponent, { data })
	// 		.afterClosed()
	// 		.subscribe((response: boolean) => {
	// 			if (response) {
	// 				// TODO handle response
	// 			}
	// 		});
	// }

	// onKeydownUpdateAuthorization(event: KeyboardEvent) {
	// 	if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

	// 	this.onUpdateAuthorization();
	// }

	onRequestReplacement(appl: UserLicenceResponse): void {
		console.log('onRequestReplacement', appl);
		if (appl.workerLicenceTypeCode === WorkerLicenceTypeCode.SecurityWorkerLicence) {
			console.log('licenceAppId', appl.licenceAppId!);
			this.licenceApplicationService
				.getLicenceWithSelectionAuthenticated(appl.licenceAppId!, ApplicationTypeCode.Replacement)
				.pipe(
					tap((_resp: any) => {
						this.router.navigateByUrl(
							LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
								LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
							),
							{
								state: {
									applicationTypeCode: ApplicationTypeCode.Replacement,
								},
							}
						);
					}),
					take(1)
				)
				.subscribe();
		}
	}

	onKeydownRequestReplacement(event: KeyboardEvent, appl: UserLicenceResponse) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onRequestReplacement(appl);
	}

	onResume(appl: LicenceAppListResponse): void {
		if (appl.serviceTypeCode == WorkerLicenceTypeCode.SecurityWorkerLicence) {
			this.licenceApplicationService
				.getLicenceToResume(appl.licenceAppId!)
				.pipe(
					tap((_resp: any) => {
						this.router.navigateByUrl(
							LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
								LicenceApplicationRoutes.WORKER_LICENCE_NEW_AUTHENTICATED
							)
						);
					}),
					take(1)
				)
				.subscribe();
			// } else {
			// 	this.permitApplicationService
			// 		.getPermitToResume(appl.licenceAppId!, appl.serviceTypeCode!, appl.applicationTypeCode!)
			// 		.pipe(
			// 			tap((_resp: any) => {
			// 				this.router.navigateByUrl(
			// 					LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
			// 						LicenceApplicationRoutes.WORKER_LICENCE_NEW_AUTHENTICATED
			// 					)
			// 				);
			// 			}),
			// 			take(1)
			// 		)
			// 		.subscribe();
		}
	}

	onUpdate(appl: UserLicenceResponse): void {
		if (appl.workerLicenceTypeCode == WorkerLicenceTypeCode.SecurityWorkerLicence) {
			this.licenceApplicationService
				.getLicenceWithSelectionAuthenticated(appl.licenceAppId!, ApplicationTypeCode.Update)
				.pipe(
					tap((_resp: any) => {
						this.router.navigateByUrl(
							LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
								LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
							),
							{
								state: {
									applicationTypeCode: ApplicationTypeCode.Update,
								},
							}
						);
					}),
					take(1)
				)
				.subscribe();
			// } else {
			// 	this.permitApplicationService
			// 		.loadPermit(appl.licenceAppId!, appl.serviceTypeCode!, appl.applicationTypeCode!)
			// 		.pipe(
			// 			tap((_resp: any) => {
			// 				this.router.navigateByUrl(
			// 					LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
			// 						LicenceApplicationRoutes.PERMIT_NEW_AUTHENTICATED
			// 					)
			// 				);
			// 			}),
			// 			take(1)
			// 		)
			// 		.subscribe();
		}
	}

	onRenew(appl: UserLicenceResponse): void {
		if (appl.workerLicenceTypeCode == WorkerLicenceTypeCode.SecurityWorkerLicence) {
			this.licenceApplicationService
				.getLicenceWithSelectionAuthenticated(appl.licenceAppId!, ApplicationTypeCode.Renewal)
				.pipe(
					tap((_resp: any) => {
						this.router.navigateByUrl(
							LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
								LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
							),
							{
								state: {
									applicationTypeCode: ApplicationTypeCode.Renewal,
								},
							}
						);
					}),
					take(1)
				)
				.subscribe();
		}
	}

	// onReapply(appl: UserLicenceResponse): void {
	// 	this.licenceApplicationService
	// 		.loadLicence('468075a7-550e-4820-a7ca-00ea6dde3025', appl.serviceTypeCode!, ApplicationTypeCode.Renewal)
	// 		.pipe(
	// 			tap((_resp: any) => {
	// 				this.router.navigateByUrl(
	// 					LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
	// 						LicenceApplicationRoutes.WORKER_LICENCE_RENEW_AUTHENTICATED
	// 					)
	// 				);
	// 			}),
	// 			take(1)
	// 		)
	// 		.subscribe();
	// }

	// TEMP
	onRenewSecurityWorkerLicence(): void {
		this.licenceApplicationService
			.getLicenceWithSelectionAuthenticated('34f01518-dc7d-451a-ae64-a7926e515c00', ApplicationTypeCode.Renewal)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
							LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
						),
						{
							state: {
								applicationTypeCode: ApplicationTypeCode.Renewal,
							},
						}
					);
				}),
				take(1)
			)
			.subscribe();
	}

	// TEMP
	onUpdateSecurityWorkerLicence(): void {
		this.licenceApplicationService
			.getLicenceWithSelectionAuthenticated('34f01518-dc7d-451a-ae64-a7926e515c00', ApplicationTypeCode.Update)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
							LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
						),
						{
							state: {
								applicationTypeCode: ApplicationTypeCode.Update,
							},
						}
					);
				}),
				take(1)
			)
			.subscribe();
	}

	// TEMP
	onReplacmentSecurityWorkerLicence(): void {
		this.licenceApplicationService
			.getLicenceWithSelectionAuthenticated('34f01518-dc7d-451a-ae64-a7926e515c00', ApplicationTypeCode.Replacement)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
							LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
						),
						{
							state: {
								applicationTypeCode: ApplicationTypeCode.Replacement,
							},
						}
					);
				}),
				take(1)
			)
			.subscribe();
	}

	// TEMP
	onNewSecurityWorkerLicence(): void {
		this.licenceApplicationService
			.createNewLicenceAuthenticated()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
							LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
						),
						{
							state: {
								applicationTypeCode: ApplicationTypeCode.New,
							},
						}
					);
				}),
				take(1)
			)
			.subscribe();
	}

	// TEMP
	onNewBodyArmourPermit(): void {
		this.permitApplicationService
			.createNewPermitAuthenticated(WorkerLicenceTypeCode.BodyArmourPermit)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathPermitAuthenticated(
							LicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
						),
						{
							state: {
								applicationTypeCode: ApplicationTypeCode.New,
							},
						}
					);
				}),
				take(1)
			)
			.subscribe();
	}

	// TEMP
	onRenewBodyArmourPermit(): void {
		this.permitApplicationService
			.getPermitWithSelectionAuthenticated('f9c7d780-e5a7-405e-9f2d-21aff037c18d', ApplicationTypeCode.Renewal)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathPermitAuthenticated(
							LicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
						),
						{
							state: {
								applicationTypeCode: ApplicationTypeCode.Renewal,
							},
						}
					);
				}),
				take(1)
			)
			.subscribe();
	}

	// TEMP
	onUpdateBodyArmourPermit(): void {
		this.permitApplicationService
			.getPermitWithSelectionAuthenticated('f9c7d780-e5a7-405e-9f2d-21aff037c18d', ApplicationTypeCode.Update)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathPermitAuthenticated(
							LicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
						),
						{
							state: {
								applicationTypeCode: ApplicationTypeCode.Renewal,
							},
						}
					);
				}),
				take(1)
			)
			.subscribe();
	}

	// TEMP
	onNewArmouredVehiclePermit(): void {
		this.permitApplicationService
			.createNewPermitAuthenticated(WorkerLicenceTypeCode.ArmouredVehiclePermit)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathPermitAuthenticated(
							LicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
						),
						{
							state: {
								applicationTypeCode: ApplicationTypeCode.New,
							},
						}
					);
				}),
				take(1)
			)
			.subscribe();
	}

	// TEMP
	onRenewArmouredVehiclePermit(): void {
		this.permitApplicationService
			.getPermitWithSelectionAuthenticated('d402df70-718a-4f84-b5ba-31f45383c1ad', ApplicationTypeCode.Renewal)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathPermitAuthenticated(
							LicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
						),
						{
							state: {
								applicationTypeCode: ApplicationTypeCode.Renewal,
							},
						}
					);
				}),
				take(1)
			)
			.subscribe();
	}

	// TEMP
	onUpdateArmouredVehiclePermit(): void {
		this.permitApplicationService
			.getPermitWithSelectionAuthenticated('d402df70-718a-4f84-b5ba-31f45383c1ad', ApplicationTypeCode.Update)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathPermitAuthenticated(
							LicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
						),
						{
							state: {
								applicationTypeCode: ApplicationTypeCode.Renewal,
							},
						}
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onConnectToExpiredLicence(): void {
		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(LicenceApplicationRoutes.LICENCE_LINK)
		);
	}

	onKeydownConnectToExpiredLicence(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onConnectToExpiredLicence();
	}
}
