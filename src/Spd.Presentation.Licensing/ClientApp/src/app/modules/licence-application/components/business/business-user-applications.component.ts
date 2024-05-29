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
	LicenceTermCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { ConfigService } from '@app/core/services/config.service';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import {
	CommonApplicationService,
	UserLicenceResponse,
} from '@app/modules/licence-application/services/common-application.service';
import { Observable, take, tap } from 'rxjs';

@Component({
	selector: 'app-business-user-applications',
	template: `
		<section class="step-section">
			<!-- TODO  *ngIf="results$ | async" -->
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Business Licences</h2>
						</div>

						<div class="col-xl-6 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								<button mat-flat-button color="primary" class="large w-auto me-2 mb-3" (click)="onBusinessProfile()">
									<mat-icon>person</mat-icon>
									{{ businessProfileLabel }}
								</button>
								<button mat-flat-button color="primary" class="large w-auto ms-2 mb-3" (click)="onBusinessManagers()">
									<mat-icon>people</mat-icon>
									Business Managers
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

					<button mat-flat-button color="primary" class="large my-3 w-auto" (click)="onResume()">
						<mat-icon>play_arrow</mat-icon>Resume
						<!-- TODO temp -->
					</button>

					<div class="mb-3" *ngIf="applicationsDataSource.data.length > 0">
						<div class="section-title fs-5 py-3">Applications</div>

						<div class="row summary-card-section summary-card-section__orange m-0">
							<div class="col-12" class="draft-table">
								<mat-table
									[dataSource]="applicationsDataSource"
									class="draft-table pb-3"
									[multiTemplateDataRows]="true"
								>
									<ng-container matColumnDef="workerLicenceTypeCode">
										<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Licence Type</mat-header-cell>
										<mat-cell *matCellDef="let application">
											<span class="mobile-label">Licence Type:</span>
											<span class="my-2">
												{{ application.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }}
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
												class="large my-3 w-auto"
												(click)="onResumex(application)"
												*ngIf="application.applicationPortalStatusCode === applicationPortalStatusCodes.Draft"
											>
												<mat-icon>play_arrow</mat-icon>Resume
											</button>
										</mat-cell>
									</ng-container>

									<ng-container matColumnDef="expandedDetail">
										<mat-cell *matCellDef="let application" [attr.colspan]="columns.length" class="px-0">
											<ng-container *ngIf="application.isErrorMessage || application.isWarningMessage">
												<div
													class="alert d-flex d-inline-flex align-items-center w-100"
													[ngClass]="application.isWarningMessage ? 'draft-warning-message' : 'draft-error-message'"
													role="alert"
												>
													<div class="my-1 px-2">
														You haven't submitted this licence application yet. It will expire on
														{{ application.licenceExpiryDate | formatDate : constants.date.formalDateFormat }}.
													</div>
												</div>
											</ng-container>
										</mat-cell>
									</ng-container>

									<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
									<mat-row class="mat-data-row" *matRowDef="let row; columns: columns"></mat-row>
									<mat-row
										class="mat-data-row"
										*matRowDef="let row; columns: ['expandedDetail']"
										class="expanded-detail-row"
									></mat-row>
								</mat-table>
							</div>
						</div>
					</div>

					<div class="mb-3" *ngIf="activeLicences.length > 0">
						<div class="section-title fs-5 py-3">Valid Licence</div>
						<div
							class="summary-card-section summary-card-section__green mb-3 px-4 py-3"
							*ngFor="let appl of activeLicences; let i = index"
						>
							<div class="row">
								<div class="col-lg-2">
									<div class="fs-5" style="color: var(--color-primary);">
										{{ appl.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }}
									</div>
								</div>
								<div class="col-lg-10">
									<div class="row">
										<div class="col-lg-6">
											<div class="d-block text-muted mt-2 mt-md-0">Licence Number</div>
											<div class="text-data">{{ appl.licenceNumber }}</div>
										</div>
										<div class="col-lg-3">
											<div class="d-block text-muted mt-2 mt-md-0">Licence Term</div>
											<div class="text-data">{{ appl.licenceTermCode | options : 'LicenceTermTypes' }}</div>
										</div>
										<div class="col-lg-3">
											<mat-chip-option [selectable]="false" class="appl-chip-option mat-chip-green">
												<mat-icon class="appl-chip-option-item">check_circle</mat-icon>
												<span class="appl-chip-option-item ms-2 fs-5">Active</span>
											</mat-chip-option>
										</div>
										<mat-divider class="my-2"></mat-divider>
									</div>

									<div class="row mb-2">
										<div class="col-lg-3">
											<div class="d-block text-muted mt-2 mt-md-0">Expiry Date</div>
											<div class="text-data">
												{{ appl.licenceExpiryDate | formatDate : constants.date.formalDateFormat }}
											</div>
										</div>
										<div class="col-lg-4">
											<div class="d-block text-muted mt-2 mt-md-0">Licence Categories</div>
											<div class="text-data">
												<ul class="m-0">
													<li>Armoured Car Guard</li>
													<li>Security Guard</li>
													<li>Security Alarm Installer - Under Supervision</li>
												</ul>
											</div>
										</div>
										<div class="col-lg-5">
											<div class="d-block text-muted mt-2 mt-md-0"></div>
											<div>
												<a
													class="large"
													tabindex="0"
													(click)="onManageMembersAndEmployees()"
													(keydown)="onKeydownManageMembersAndEmployees($event)"
												>
													Manage Controlling Members and Employees
												</a>
											</div>
										</div>
										<mat-divider class="my-2"></mat-divider>
									</div>

									<div class="row mb-2">
										<div class="col-lg-9">
											The following updates have a $20 licence reprint fee:
											<!-- TODO hardcoded payment cost -->
											<ul class="m-0">
												<li>add or remove branch</li>
												<li>change to business trade name</li>
												<li>change to business legal name</li>
												<li>change to business address</li>
												<li>add request for dogs authorization</li>
												<li>update licence category</li>
											</ul>
										</div>
										<div class="col-lg-3 text-end">
											<!--
														*ngIf="appl.isRenewalPeriod"
														(click)="onRenew(appl)"
											-->
											<button mat-flat-button color="primary" class="large my-2">
												<mat-icon>restore</mat-icon>Renew
											</button>
											<button mat-flat-button color="primary" class="large my-2" (click)="onUpdate(appl)">
												<mat-icon>update</mat-icon>Update
											</button>
										</div>
									</div>
								</div>

								<div class="row">
									<ng-container *ngIf="appl.isRenewalPeriod && appl.isRenewalPeriod; else IsNotRenewalPeriod">
										<div class="col-12">
											<mat-divider class="my-2"></mat-divider>
											<span class="fw-semibold">Lost your licence? </span>
											<a class="large" [href]="constants.urls.contactSpdUrl" target="_blank">Contact SPD</a>
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
												(click)="onRequestReplacement(appl)"
												(keydown)="onKeydownRequestReplacement($event, appl)"
												>Request a replacement</a
											>
											and we'll send you a new licence in {{ lostLicenceDaysText }} business days.
										</div>
									</ng-template>
								</div>
							</div>
						</div>
					</div>

					<div class="mb-3" *ngIf="expiredLicences.length > 0">
						<div class="section-title fs-5 py-3">Expired Licences</div>
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
											<div class="text-data">---</div>
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

					<div class="summary-card-section mb-3 px-4 py-3" *ngIf="!activeLicenceExist">
						<div class="row">
							<div class="col-xl-7 col-lg-6">
								<div class="text-data">You don't have an active business licence</div>
							</div>
							<div class="col-xl-5 col-lg-6 text-end">
								<button mat-flat-button color="primary" class="large mt-2 mt-lg-0" (click)="onCreateNew()">
									<mat-icon>add</mat-icon>Apply for a New Business Licence
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
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
export class BusinessUserApplicationsComponent implements OnInit {
	constants = SPD_CONSTANTS;

	results$!: Observable<any>; // TODO implement
	warningMessages: Array<string> = [];
	errorMessages: Array<string> = [];

	// results$!: Observable<any>;
	applicationIsInProgress: boolean | null = null;
	businessProfileLabel = '';
	lostLicenceDaysText: string | null = null;

	activeLicenceExist = false;

	workerLicenceTypeCodes = WorkerLicenceTypeCode;
	applicationPortalStatusCodes = ApplicationPortalStatusCode;

	activeLicences: Array<UserLicenceResponse> = [];
	expiredLicences: Array<UserLicenceResponse> = [];

	licenceApplicationRoutes = LicenceApplicationRoutes;

	applicationsDataSource: MatTableDataSource<UserLicenceResponse> = new MatTableDataSource<UserLicenceResponse>([]);
	columns: string[] = [
		'workerLicenceTypeCode',
		'createdOn',
		'submittedOn',
		'applicationTypeCode',
		'caseNumber',
		'applicationPortalStatusCode',
		'action1',
	];

	constructor(
		private router: Router,
		private configService: ConfigService,
		private businessApplicationService: BusinessApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.lostLicenceDaysText = this.configService.configs?.replacementProcessingTime ?? null;

		this.activeLicences = [
			{
				licenceId: '1',
				licenceNumber: 'TEST-NWQ3X7A',
				licenceTermCode: LicenceTermCode.TwoYears,
				workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityBusinessLicence,
				applicationTypeCode: ApplicationTypeCode.New,
				licenceExpiryDate: '2025-02-13T19:43:25+00:00',
				isRenewalPeriod: true,
				isUpdatePeriod: true,
				isReplacementPeriod: true,
				hasBcscNameChanged: false,
				licenceReprintFee: null,
				licenceStatusCode: LicenceStatusCode.Active,
				dogAuthorization: null,
				restraintAuthorization: null,
			},
		];

		this.applicationIsInProgress = false; // TODO remove hardcoded flag

		this.businessProfileLabel = this.applicationIsInProgress ? 'View Business Profile' : 'Business Profile';

		this.commonApplicationService.setApplicationTitle(WorkerLicenceTypeCode.SecurityBusinessLicence);
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

	onManageMembersAndEmployees(): void {
		this.businessApplicationService
			.getMembersAndEmployees()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathBusinessLicence(
							LicenceApplicationRoutes.BUSINESS_CONTROLLING_MEMBERS_AND_EMPLOYEES
						)
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onKeydownManageMembersAndEmployees(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onManageMembersAndEmployees();
	}

	onRequestReplacement(_appl: UserLicenceResponse): void {
		// if (this.applicationIsInProgress) return;
		// 	this.licenceApplicationService
		// 		.getLicenceWithSelectionAuthenticated(appl.licenceAppId!, ApplicationTypeCode.Replacement, appl)
		// 		.pipe(
		// 			tap((_resp: any) => {
		// 				this.router.navigateByUrl(
		// 					LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
		// 						LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
		// 					),
		// 					{ state: { applicationTypeCode: ApplicationTypeCode.Replacement } }
		// 				);
		// 			}),
		// 			take(1)
		// 		)
		// 		.subscribe();
	}

	onKeydownRequestReplacement(event: KeyboardEvent, appl: UserLicenceResponse) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onRequestReplacement(appl);
	}

	onResume(): void {
		const licenceAppId = '10007484-6a96-4650-8dc6-d6b7548e2dbb';

		this.businessApplicationService
			.getBusinessLicenceToResume(licenceAppId)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.BUSINESS_LICENCE_USER_PROFILE),
						{ state: { applicationTypeCode: _resp.applicationTypeData.applicationTypeCode } }
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onResumex(_appl: LicenceAppListResponse): void {
		// if (appl.workerLicenceTypeCode == WorkerLicenceTypeCode.SecurityWorkerLicence) {
		// 	this.licenceApplicationService
		// 		.getLicenceNew(appl.licenceAppId!)
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
		// } else {
		// 	this.permitApplicationService
		// 		.loadPermit(appl.licenceAppId!, appl.workerLicenceTypeCode!, appl.applicationTypeCode!)
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
		// }
	}

	onUpdate(_appl: UserLicenceResponse): void {
		// if (appl.workerLicenceTypeCode == WorkerLicenceTypeCode.SecurityWorkerLicence) {
		// 	this.licenceApplicationService
		// 		.getLicenceOfType('172761bb-3fd7-497c-81a9-b953359709a2', ApplicationTypeCode.Update) //TODO hardcoded ID
		// 		.pipe(
		// 			tap((_resp: any) => {
		// 				this.router.navigateByUrl(
		// 					LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
		// 						LicenceApplicationRoutes.WORKER_LICENCE_UPDATE_AUTHENTICATED
		// 					)
		// 				);
		// 			}),
		// 			take(1)
		// 		)
		// 		.subscribe();
		// } else {
		// 	this.permitApplicationService
		// 		.loadPermit(appl.licenceAppId!, appl.workerLicenceTypeCode!, appl.applicationTypeCode!)
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
		// }
	}

	onCreateNew(): void {
		this.businessApplicationService
			.createNewBusinessLicenceWithProfile(ApplicationTypeCode.New)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.BUSINESS_LICENCE_USER_PROFILE),
						{ state: { applicationTypeCode: ApplicationTypeCode.New } }
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onBusinessProfile(): void {
		// When a user has started an application but has not submitted it yet,
		// the user can view their Profile page in read-only mode – they can't edit
		// this info while the application is in progress
		this.businessApplicationService
			.createNewBusinessLicenceWithProfile()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.BUSINESS_PROFILE),
						{ state: { isReadonly: this.applicationIsInProgress } }
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onBusinessManagers(): void {
		// this.businessApplicationService
		// 	.loadUserProfile()
		// 	.pipe(
		// 		tap((_resp: any) => {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.BUSINESS_MANAGERS));
		// 		}),
		// 		take(1)
		// 	)
		// 	.subscribe();
	}

	onConnectToExpiredLicence(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.LICENCE_LINK));
	}

	onKeydownConnectToExpiredLicence(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onConnectToExpiredLicence();
	}
}
