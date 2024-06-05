/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
	ApplicationPortalStatusCode,
	ApplicationTypeCode,
	LicenceAppListResponse,
	LicenceStatusCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { ConfigService } from '@app/core/services/config.service';
import { UtilService } from '@app/core/services/util.service';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { Observable, forkJoin, take, tap } from 'rxjs';
import {
	CommonApplicationService,
	UserApplicationResponse,
	UserLicenceResponse,
} from '../../services/common-application.service';

@Component({
	selector: 'app-licence-user-applications',
	template: `
		<section class="step-section" *ngIf="results$ | async">
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
									{{ yourProfileLabel }}
								</button>
							</div>
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<ng-container *ngFor="let msg of errorMessages; let i = index">
						<app-alert type="danger" icon="error">
							<div [innerHTML]="msg"></div>
						</app-alert>
					</ng-container>

					<ng-container *ngFor="let msg of warningMessages; let i = index">
						<app-alert type="warning" icon="warning">
							<div [innerHTML]="msg"></div>
						</app-alert>
					</ng-container>

					<div class="mb-3" *ngIf="applicationsDataSource.data.length > 0">
						<div class="section-title fs-5 py-3">Applications</div>

						<div class="row summary-card-section summary-card-section__orange m-0">
							<div class="col-12">
								<mat-table [dataSource]="applicationsDataSource" class="draft-table" [multiTemplateDataRows]="true">
									<ng-container matColumnDef="serviceTypeCode">
										<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Licence Type</mat-header-cell>
										<mat-cell *matCellDef="let application">
											<span class="mobile-label">Licence Type:</span>
											<span class="my-2">
												{{ application.serviceTypeCode | options : 'WorkerLicenceTypes' }}
											</span>
										</mat-cell>
									</ng-container>

									<ng-container matColumnDef="createdOn">
										<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Date Started</mat-header-cell>
										<mat-cell *matCellDef="let application">
											<span class="mobile-label">Date Started:</span>
											{{ application.createdOn | formatDate | default }}
										</mat-cell>
									</ng-container>

									<ng-container matColumnDef="submittedOn">
										<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Date Submitted</mat-header-cell>
										<mat-cell *matCellDef="let application">
											<span class="mobile-label">Date Submitted:</span>
											{{ application.submittedOn | formatDate | default }}
										</mat-cell>
									</ng-container>

									<ng-container matColumnDef="applicationTypeCode">
										<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Type</mat-header-cell>
										<mat-cell *matCellDef="let application">
											<span class="mobile-label">Type:</span>
											{{ application.applicationTypeCode | options : 'ApplicationTypes' }}
										</mat-cell>
									</ng-container>

									<ng-container matColumnDef="caseNumber">
										<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Case Number</mat-header-cell>
										<mat-cell *matCellDef="let application">
											<span class="mobile-label">Case Number:</span>
											{{ application.caseNumber }}
										</mat-cell>
									</ng-container>

									<ng-container matColumnDef="applicationPortalStatusCode">
										<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Status</mat-header-cell>
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
										<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
										<mat-cell *matCellDef="let application">
											<button
												mat-flat-button
												color="primary"
												class="large my-2"
												(click)="onResume(application)"
												*ngIf="isResumable(application)"
											>
												<mat-icon>play_arrow</mat-icon>Resume
											</button>
										</mat-cell>
									</ng-container>

									<mat-header-row *matHeaderRowDef="applicationColumns; sticky: true"></mat-header-row>
									<mat-row class="mat-data-row" *matRowDef="let row; columns: applicationColumns"></mat-row>
								</mat-table>
							</div>
						</div>
					</div>

					<div class="mb-3">
						<ng-container *ngIf="activeLicences.length > 0">
							<div class="section-title fs-5 py-3">Active Licences/Permits</div>
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
												<div class="text-data">{{ licence.licenceNumber }}</div>
											</div>
											<div class="col-lg-3">
												<div class="d-block text-muted mt-2 mt-lg-0">Licence Term</div>
												<div class="text-data">{{ licence.licenceTermCode | options : 'LicenceTermTypes' }}</div>
											</div>
											<div class="col-lg-3">
												<div class="d-block text-muted mt-2 mt-lg-0">Case Number</div>
												<div class="text-data">{{ licence.caseNumber }}</div>
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
												<div class="col-lg-3">
													<div class="d-block text-muted mt-2 mt-lg-0">Expiry Date</div>
													<div class="text-data" [ngClass]="licence.isRenewalPeriod ? 'error-color' : ''">
														{{ licence.licenceExpiryDate | formatDate : constants.date.formalDateFormat }}
													</div>
												</div>
												<div class="col-lg-9">
													<div class="d-block text-muted mt-2 mt-lg-0">Licence Categories</div>
													<div class="text-data">
														<ul class="m-0">
															<ng-container *ngFor="let catCode of licence.categoryCodes; let i = index">
																<li>{{ catCode | options : 'WorkerCategoryTypes' }}</li>
															</ng-container>
														</ul>
													</div>
												</div>
												<div class="col-lg-6" *ngIf="licence.dogAuthorization">
													<div class="d-block text-muted mt-2">Dog Authorization Documents</div>
													<div class="text-data">{{ licence.dogAuthorization | options : 'DogDocumentTypes' }}</div>
												</div>
												<div class="col-lg-6" *ngIf="licence.restraintAuthorization">
													<div class="d-block text-muted mt-2">Restraint Authorization Documents</div>
													<div class="text-data">
														{{ licence.restraintAuthorization | options : 'RestraintDocumentTypes' }}
													</div>
												</div>
											</div>
											<mat-divider class="my-2"></mat-divider>
											<div class="row mb-2">
												<div class="col-lg-9">
													The following updates have a
													{{ licence.licenceReprintFee | currency : 'CAD' : 'symbol-narrow' : '1.0' }} licence reprint
													fee:
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
														This {{ licence.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }} cannot be renewed,
														updated or replaced while an application is in progress
													</app-alert>
												</div>
											</div>
										</ng-container>
										<ng-template #IsPermitContent>
											<div class="row mb-2">
												<div class="col-lg-9">
													<div class="d-block text-muted mt-2 mt-lg-0">Expiry Date</div>
													<div class="text-data" [ngClass]="licence.isRenewalPeriod ? 'error-color' : ''">
														{{ licence.licenceExpiryDate | formatDate : constants.date.formalDateFormat }}
													</div>
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
														<ng-container *ngIf="licence.isReplacementPeriod; else NoPermitReplacementPeriod">
															This {{ licence.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }} cannot be
															renewed, updated or replaced while an application is in progress
														</ng-container>
														<ng-template #NoPermitReplacementPeriod>
															This {{ licence.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }} cannot be
															renewed or updated while an application is in progress
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
						</ng-container>

						<div class="summary-card-section mb-3 px-4 py-3" *ngIf="!activeSwlExist">
							<div class="row">
								<div class="col-xl-7 col-lg-6">
									<div class="text-data">You don't have an active Security Worker licence</div>
								</div>
								<div class="col-xl-5 col-lg-6 text-end">
									<button
										mat-flat-button
										color="primary"
										class="large mt-2 mt-lg-0"
										(click)="onNewSecurityWorkerLicence()"
										*ngIf="!applicationIsInProgress"
									>
										<mat-icon>add</mat-icon>Apply for a New Security Worker Licence
									</button>
								</div>
								<div class="col-12 mt-3" *ngIf="applicationIsInProgress">
									<app-alert type="info" icon="info">
										A Security Worker Licence cannot be created while an application is in progress
									</app-alert>
								</div>
							</div>
						</div>

						<div class="summary-card-section mb-3 px-4 py-3" *ngIf="!activeBaPermitExist">
							<div class="row">
								<div class="col-xl-7 col-lg-6">
									<div class="text-data">You don't have an active Body Armour permit</div>
								</div>
								<div class="col-xl-5 col-lg-6 text-end">
									<button
										mat-flat-button
										color="primary"
										class="large mt-2 mt-lg-0"
										(click)="onNewBodyArmourPermit()"
										*ngIf="!applicationIsInProgress"
									>
										<mat-icon>add</mat-icon>Apply for a New Body Amour Permit
									</button>
								</div>
								<div class="col-12 mt-3" *ngIf="applicationIsInProgress">
									<app-alert type="info" icon="info">
										A Body Amour Permit cannot be created while an application is in progress
									</app-alert>
								</div>
							</div>
						</div>

						<div class="summary-card-section mb-3 px-4 py-3" *ngIf="!activeAvPermitExist">
							<div class="row">
								<div class="col-xl-7 col-lg-6">
									<div class="text-data">You don't have an active Armoured Vehicle permit</div>
								</div>
								<div class="col-xl-5 col-lg-6 text-end">
									<button
										mat-flat-button
										color="primary"
										class="large mt-2 mt-lg-0"
										(click)="onNewArmouredVehiclePermit()"
										*ngIf="!applicationIsInProgress"
									>
										<mat-icon>add</mat-icon>Apply for a New Armoured Vehicle Permit
									</button>
								</div>
								<div class="col-12 mt-3" *ngIf="applicationIsInProgress">
									<app-alert type="info" icon="info">
										An Armoured Vehicle Permit cannot be created while an application is in progress
									</app-alert>
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
											<div class="d-block text-muted mt-2 mt-lg-0">Licence Number</div>
											<div class="text-data">{{ appl.licenceNumber }}</div>
										</div>
										<div class="col-lg-3">
											<div class="d-block text-muted mt-2 mt-lg-0">Licence Term</div>
											<div class="text-data">5 Years</div>
										</div>
										<div class="col-lg-3">
											<div class="d-block text-muted mt-2 mt-lg-0">Expiry Date</div>
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

					<div class="mt-4">
						<app-alert type="info" [showBorder]="false" icon="">
							Do you have a security licence, body armour permit, or armoured vehicle permit but it's not showing here?

							<a
								class="fw-normal"
								tabindex="0"
								(click)="onConnectToExpiredLicence()"
								(keydown)="onKeydownConnectToExpiredLicence($event)"
								>Connect a current or expired licence or permit</a
							>
							to your account.
						</app-alert>
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

			.error-color {
				font-weight: 600;
				color: var(--color-red-dark);
			}
		`,
	],
})
export class LicenceUserApplicationsComponent implements OnInit {
	constants = SPD_CONSTANTS;

	results$!: Observable<any>;
	applicationIsInProgress: boolean | null = null;
	yourProfileLabel = '';
	lostLicenceDaysText: string | null = null;

	warningMessages: Array<string> = [];
	errorMessages: Array<string> = [];

	workerLicenceTypeCodes = WorkerLicenceTypeCode;
	applicationPortalStatusCodes = ApplicationPortalStatusCode;

	activeLicences: Array<UserLicenceResponse> = [];

	// If the licence holder has a SWL, they can add a new Body Armour and/or Armoured Vehicle permit
	// If the licence holder has a Body Armour permit, they can add a new Armoured Vehicle permit and/or a security worker licence
	// If the licence holder has an Armoured vehicle permit, they can add a new Body Armour permit and/or a security worker licence
	activeSwlExist = false;
	activeAvPermitExist = false;
	activeBaPermitExist = false;

	expiredLicences: Array<UserLicenceResponse> = [];

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
		private configService: ConfigService,
		private utilService: UtilService,
		private commonApplicationService: CommonApplicationService,
		private permitApplicationService: PermitApplicationService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		this.lostLicenceDaysText = this.configService.configs?.replacementProcessingTime ?? null;

		this.results$ = forkJoin([
			this.commonApplicationService.userLicencesList(),
			this.commonApplicationService.userApplicationsList(),
		]).pipe(
			tap((resps: Array<any>) => {
				const userLicencesList: Array<UserLicenceResponse> = resps[0];
				const userApplicationsList: Array<UserApplicationResponse> = resps[1];

				// User Applications
				const draftNotifications = userApplicationsList.filter(
					(item: UserApplicationResponse) => item.isExpiryWarning || item.isExpiryError
				);
				draftNotifications.forEach((item: UserApplicationResponse) => {
					const itemLabel = this.optionsPipe.transform(item.serviceTypeCode, 'WorkerLicenceTypes');
					const itemExpiry = this.formatDatePipe.transform(
						item.applicationExpiryDate,
						SPD_CONSTANTS.date.formalDateFormat
					);
					if (item.isExpiryWarning) {
						this.warningMessages.push(
							`You haven't submitted your ${itemLabel} application yet. It will expire on <strong>${itemExpiry}</strong>.`
						);
					} else {
						this.errorMessages.push(
							`You haven't submitted your ${itemLabel} application yet. It will expire on <strong>${itemExpiry}</strong>.`
						);
					}
				});

				// User Licences/Permits
				const activeLicences = userLicencesList.filter(
					(item: UserLicenceResponse) => item.licenceStatusCode === LicenceStatusCode.Active
				);

				this.expiredLicences = userLicencesList.filter(
					(item: UserLicenceResponse) => item.licenceStatusCode === LicenceStatusCode.Expired
				);

				const renewals = activeLicences.filter((item: UserLicenceResponse) => item.isRenewalPeriod);
				renewals.forEach((item: UserLicenceResponse) => {
					const itemLabel = this.optionsPipe.transform(item.workerLicenceTypeCode, 'WorkerLicenceTypes');
					const itemExpiry = this.formatDatePipe.transform(item.licenceExpiryDate, SPD_CONSTANTS.date.formalDateFormat);

					if (item.licenceExpiryNumberOfDays != null) {
						if (item.licenceExpiryNumberOfDays < 0) {
							this.errorMessages.push(`Your ${itemLabel} expired on <strong>${itemExpiry}</strong>.`);
						} else if (item.licenceExpiryNumberOfDays > 7) {
							this.warningMessages.push(
								`Your ${itemLabel} is expiring in ${item.licenceExpiryNumberOfDays} days. Please renew by <strong>${itemExpiry}</strong>.`
							);
						} else if (item.licenceExpiryNumberOfDays === 0) {
							this.errorMessages.push(`Your ${itemLabel} is expiring <strong>today</strong>. Please renew now.`);
						} else {
							const dayLabel = item.licenceExpiryNumberOfDays > 1 ? 'days' : 'day';
							this.errorMessages.push(
								`Your ${itemLabel} is expiring in ${item.licenceExpiryNumberOfDays} ${dayLabel}. Please renew by <strong>${itemExpiry}</strong>.`
							);
						}
					}
				});

				// User Licence/Permit Applications
				this.applicationsDataSource = new MatTableDataSource(userApplicationsList ?? []);
				this.applicationIsInProgress = !!userApplicationsList.find(
					(item: UserApplicationResponse) =>
						item.applicationPortalStatusCode === ApplicationPortalStatusCode.AwaitingThirdParty ||
						item.applicationPortalStatusCode === ApplicationPortalStatusCode.InProgress ||
						item.applicationPortalStatusCode === ApplicationPortalStatusCode.AwaitingApplicant ||
						item.applicationPortalStatusCode === ApplicationPortalStatusCode.UnderAssessment ||
						item.applicationPortalStatusCode === ApplicationPortalStatusCode.VerifyIdentity
				);

				// Set flags that determine if NEW licences/permits can be created
				let activeSwlExist =
					activeLicences.findIndex(
						(item: UserLicenceResponse) => item.workerLicenceTypeCode === WorkerLicenceTypeCode.SecurityWorkerLicence
					) >= 0;

				if (!activeSwlExist) {
					activeSwlExist =
						userApplicationsList.findIndex(
							(item: UserApplicationResponse) => item.serviceTypeCode === WorkerLicenceTypeCode.SecurityWorkerLicence
						) >= 0;
				}
				this.activeSwlExist = activeSwlExist;

				let activeBaPermitExist =
					activeLicences.findIndex(
						(item: UserLicenceResponse) => item.workerLicenceTypeCode === WorkerLicenceTypeCode.BodyArmourPermit
					) >= 0;
				if (!activeBaPermitExist) {
					activeBaPermitExist =
						userApplicationsList.findIndex(
							(item: UserApplicationResponse) => item.serviceTypeCode === WorkerLicenceTypeCode.BodyArmourPermit
						) >= 0;
				}
				this.activeBaPermitExist = activeBaPermitExist;

				let activeAvPermitExist =
					activeLicences.findIndex(
						(item: UserLicenceResponse) => item.workerLicenceTypeCode === WorkerLicenceTypeCode.ArmouredVehiclePermit
					) >= 0;
				if (!activeAvPermitExist) {
					activeAvPermitExist =
						userApplicationsList.findIndex(
							(item: UserApplicationResponse) => item.serviceTypeCode === WorkerLicenceTypeCode.ArmouredVehiclePermit
						) >= 0;
				}
				this.activeAvPermitExist = activeAvPermitExist;

				this.activeLicences = [...activeLicences].sort((a, b) => {
					return this.utilService.sortDate(a.licenceExpiryDate, b.licenceExpiryDate);
				});

				this.yourProfileLabel = this.applicationIsInProgress ? 'View Your Profile' : 'Your Profile';
			})
		);
	}

	onUserProfile(): void {
		// When a user has started an application but has not submitted it yet,
		// the user can view their Profile page in read-only mode – they can't edit
		// this info while the application is in progress
		this.licenceApplicationService
			.loadUserProfile()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
							LicenceApplicationRoutes.LICENCE_LOGIN_USER_PROFILE
						),
						{ state: { isReadonly: this.applicationIsInProgress } }
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

	onNewSecurityWorkerLicence(): void {
		this.licenceApplicationService
			.createNewLicenceAuthenticated()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
							LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
						),
						{ state: { applicationTypeCode: ApplicationTypeCode.New } }
					);
				}),
				take(1)
			)
			.subscribe();
	}

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
								workerLicenceTypeCode: WorkerLicenceTypeCode.BodyArmourPermit,
								applicationTypeCode: ApplicationTypeCode.New,
							},
						}
					);
				}),
				take(1)
			)
			.subscribe();
	}

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
								workerLicenceTypeCode: WorkerLicenceTypeCode.ArmouredVehiclePermit,
								applicationTypeCode: ApplicationTypeCode.New,
							},
						}
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onRequestReplacement(appl: UserLicenceResponse): void {
		if (this.applicationIsInProgress) return;

		switch (appl.workerLicenceTypeCode) {
			case WorkerLicenceTypeCode.SecurityWorkerLicence: {
				this.licenceApplicationService
					.getLicenceWithSelectionAuthenticated(appl.licenceAppId!, ApplicationTypeCode.Replacement, appl)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
									LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
								),
								{ state: { applicationTypeCode: ApplicationTypeCode.Replacement } }
							);
						}),
						take(1)
					)
					.subscribe();
				break;
			}
			case WorkerLicenceTypeCode.ArmouredVehiclePermit:
			case WorkerLicenceTypeCode.BodyArmourPermit: {
				// There is no Replacement flow for Permit. Send the user to Update flow.
				this.onUpdate(appl);
				break;
			}
		}
	}

	onKeydownRequestReplacement(event: KeyboardEvent, appl: UserLicenceResponse) {
		if (this.applicationIsInProgress) return;

		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onRequestReplacement(appl);
	}

	onResume(appl: LicenceAppListResponse): void {
		switch (appl.serviceTypeCode) {
			case WorkerLicenceTypeCode.SecurityWorkerLicence: {
				this.licenceApplicationService
					.getLicenceToResume(appl.licenceAppId!)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
									LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
								),
								{ state: { applicationTypeCode: _resp.applicationTypeData.applicationTypeCode } }
							);
						}),
						take(1)
					)
					.subscribe();
				break;
			}
			case WorkerLicenceTypeCode.ArmouredVehiclePermit:
			case WorkerLicenceTypeCode.BodyArmourPermit: {
				this.permitApplicationService
					.getPermitToResume(appl.licenceAppId!)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								LicenceApplicationRoutes.pathPermitAuthenticated(
									LicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
								),
								{
									state: {
										workerLicenceTypeCode: appl.serviceTypeCode,
										applicationTypeCode: _resp.applicationTypeData.applicationTypeCode,
									},
								}
							);
						}),
						take(1)
					)
					.subscribe();
				break;
			}
		}
	}

	onUpdate(appl: UserLicenceResponse): void {
		switch (appl.workerLicenceTypeCode) {
			case WorkerLicenceTypeCode.SecurityWorkerLicence: {
				this.licenceApplicationService
					.getLicenceWithSelectionAuthenticated(appl.licenceAppId!, ApplicationTypeCode.Update, appl)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
									LicenceApplicationRoutes.WORKER_LICENCE_UPDATE_TERMS_AUTHENTICATED
								)
							);
						}),
						take(1)
					)
					.subscribe();
				break;
			}
			case WorkerLicenceTypeCode.ArmouredVehiclePermit:
			case WorkerLicenceTypeCode.BodyArmourPermit: {
				this.permitApplicationService
					.getPermitWithSelectionAuthenticated(appl.licenceAppId!, ApplicationTypeCode.Update, appl)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								LicenceApplicationRoutes.pathPermitAuthenticated(
									LicenceApplicationRoutes.PERMIT_UPDATE_TERMS_AUTHENTICATED
								),
								{ state: { workerLicenceTypeCode: appl.workerLicenceTypeCode } }
							);
						}),
						take(1)
					)
					.subscribe();
			}
		}
	}

	onRenew(appl: UserLicenceResponse): void {
		switch (appl.workerLicenceTypeCode) {
			case WorkerLicenceTypeCode.SecurityWorkerLicence: {
				this.licenceApplicationService
					.getLicenceWithSelectionAuthenticated(appl.licenceAppId!, ApplicationTypeCode.Renewal, appl)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
									LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
								),
								{ state: { applicationTypeCode: ApplicationTypeCode.Renewal } }
							);
						}),
						take(1)
					)
					.subscribe();
				break;
			}
			case WorkerLicenceTypeCode.ArmouredVehiclePermit:
			case WorkerLicenceTypeCode.BodyArmourPermit: {
				this.permitApplicationService
					.getPermitWithSelectionAuthenticated(appl.licenceAppId!, ApplicationTypeCode.Renewal, appl)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								LicenceApplicationRoutes.pathPermitAuthenticated(
									LicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
								),
								{
									state: {
										workerLicenceTypeCode: appl.workerLicenceTypeCode,
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

	isResumable(appl: LicenceAppListResponse): boolean {
		return (
			appl.applicationTypeCode === ApplicationTypeCode.New &&
			appl.applicationPortalStatusCode === ApplicationPortalStatusCode.Draft
		);
	}
}
