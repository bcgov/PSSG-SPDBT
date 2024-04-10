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
import { ConfigService } from '@app/core/services/config.service';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { Subscription, take, tap } from 'rxjs';

export interface LicenceInProgress extends LicenceAppListResponse {
	id: string;
	workerLicenceTypeCode: WorkerLicenceTypeCode;
	isWarningMessage: boolean;
	isErrorMessage: boolean;
	isRenewalPeriod: boolean;
	isWithin14Days: boolean;
	expiresOn?: null | string;
	// 	isRenewalPeriod: boolean;
	// 	isWithin14Days: boolean;
	action?: null | string;
}

@Component({
	selector: 'app-business-user-applications',
	template: `
		<section class="step-section">
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
									Business Profile
								</button>
								<button mat-flat-button color="primary" class="large w-auto ms-2 mb-3" (click)="onBusinessManagers()">
									<mat-icon>people</mat-icon>
									Business Managers
								</button>
							</div>
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<!-- 
					<app-alert type="info" icon="info">
						We noticed you changed your name recently. Do you want a new licence printed with your new name, for a $20
						fee?
					</app-alert>

					<app-alert type="warning" icon="warning">
						Your armoured vehicle permit is expiring in 71 days. Please renew by <strong>December 15, 2023</strong>.
					</app-alert>

					<app-alert type="danger" icon="error">
						You haven't submitted your licence application yet. It will expire on <strong>January 12, 2024</strong>
					</app-alert> 
					-->

					<div class="mb-3" *ngIf="inProgressDataSource.data.length > 0">
						<div class="section-title fs-5 py-3">In-Progress Licences/Permits</div>

						<div class="row summary-card-section summary-card-section__orange m-0">
							<div class="col-12" class="draft-table">
								<mat-table [dataSource]="inProgressDataSource" class="draft-table pb-3" [multiTemplateDataRows]="true">
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
												class="large my-3 w-auto"
												(click)="onResume(application)"
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
														{{ application.expiresOn | formatDate : constants.date.formalDateFormat }}.
													</div>
												</div>
											</ng-container>
										</mat-cell>
									</ng-container>

									<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
									<mat-row *matRowDef="let row; columns: columns"></mat-row>
									<mat-row *matRowDef="let row; columns: ['expandedDetail']" class="expanded-detail-row"></mat-row>
								</mat-table>
							</div>
						</div>
					</div>

					<div class="mb-3" *ngIf="activeApplications.length > 0">
						<div class="section-title fs-5 py-3">Active Business Licences</div>
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
										<div class="col-lg-6">
											<div class="d-block text-muted mt-2 mt-md-0">Licence Id</div>
											<div class="text-data">{{ appl.licenceAppId }}</div>
										</div>
										<div class="col-lg-3">
											<div class="d-block text-muted mt-2 mt-md-0">Licence Term</div>
											<div class="text-data">1 Year</div>
										</div>
										<!-- <div class="col-lg-3">
											<div class="d-block text-muted mt-2 mt-md-0">Type</div>
											<div class="text-data">{{ appl.applicationTypeCode | options : 'ApplicationTypes' }}</div>
										</div> -->
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
											<div class="text-data">{{ appl.expiresOn | formatDate : constants.date.formalDateFormat }}</div>
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
													(click)="onManageMembers()"
													(keydown)="onKeydownManageMembers($event)"
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
											<button mat-flat-button color="primary" class="large w-auto" (click)="onUpdate(appl)">
												<mat-icon>play_arrow</mat-icon>Update
												<!--{{ appl.action }}-->
											</button>
										</div>
									</div>
								</div>

								<div class="row">
									<ng-container *ngIf="appl.isRenewalPeriod && appl.isWithin14Days; else IsNotWithin14Days">
										<div class="col-12">
											<mat-divider class="my-2"></mat-divider>
											<span class="fw-semibold">Lost your licence? </span>
											<a class="large" [href]="constants.urls.contactSpdUrl" target="_blank">Contact SPD</a>
											for a digital copy of your current licence before it expires.
										</div>
									</ng-container>
									<ng-template #IsNotWithin14Days>
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
											and we'll send you a new licence in {{ lostLicenceDaysText }} business days.
										</div>
									</ng-template>
								</div>
							</div>
						</div>
					</div>

					<div class="mb-3" *ngIf="expiredApplications.length > 0">
						<div class="section-title fs-5 py-3">Expired Licences/Permits</div>
						<div
							class="summary-card-section summary-card-section__red mb-2 px-4 py-3"
							*ngFor="let appl of expiredApplications; let i = index"
						>
							<div class="row">
								<div class="col-lg-3">
									<div class="fs-5" style="color: var(--color-primary);">
										{{ appl.serviceTypeCode | options : 'WorkerLicenceTypes' }}
									</div>
								</div>
								<div class="col-lg-9">
									<div class="row">
										<div class="col-lg-3">
											<div class="d-block text-muted mt-2 mt-md-0">Licence Id</div>
											<div class="text-data">{{ appl.licenceAppId }}</div>
										</div>
										<div class="col-lg-3">
											<div class="d-block text-muted mt-2 mt-md-0">Licence Term</div>
											<div class="text-data">5 Years</div>
										</div>
										<div class="col-lg-3">
											<div class="d-block text-muted mt-2 mt-md-0">Expiry Date</div>
											<div class="text-data">{{ appl.expiresOn | formatDate : constants.date.formalDateFormat }}</div>
										</div>
										<div class="col-lg-3 text-end">
											<!-- <button mat-flat-button color="primary" class="large w-auto" (click)="onReapply(appl)">
												<mat-icon>play_arrow</mat-icon>Reapply
											</button> -->
											<!-- <mat-chip-option [selectable]="false" class="appl-chip-option mat-chip-red">
													<mat-icon class="appl-chip-option-item">cancel</mat-icon>
													<span class="appl-chip-option-item ms-2 fs-5">Expired</span>
												</mat-chip-option> -->
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- <div class="my-4">
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
					</div> -->

					<!-- <div class="summary-card-section my-4 px-4 py-3" *ngIf="isNoActiveOrExpiredLicences">
						<div class="row">
							<div class="col-lg-6">
								<div class="text-data">You don't have an active licence</div>
							</div>
							<div class="col-lg-6 text-end">
								<button mat-flat-button color="primary" class="large w-auto mt-2 mt-lg-0" (click)="onCreateNew()">
									<mat-icon>add</mat-icon>Apply for a New Business Licence
								</button>
							</div>
						</div>
					</div> -->

					<div class="summary-card-section mb-3 px-4 py-3">
						<div class="row">
							<div class="col-xl-7 col-lg-6">
								<div class="text-data">You don't have an active business licence</div>
							</div>
							<div class="col-xl-5 col-lg-6 text-end">
								<button mat-flat-button color="primary" class="large mt-2 mt-lg-0" (click)="onCreateNew()">
									<mat-icon>add</mat-icon>Apply for a new Business Licence
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
		`,
	],
})
export class BusinessUserApplicationsComponent implements OnInit, OnDestroy {
	constants = SPD_CONSTANTS;

	isNoActiveOrExpiredLicences = true;
	isAllowCreateNew = true;
	lostLicenceDaysText: string | null = null;

	workerLicenceTypeCodes = WorkerLicenceTypeCode;
	applicationPortalStatusCodes = ApplicationPortalStatusCode;

	activeApplications: Array<LicenceInProgress> = [];
	expiredApplications: Array<LicenceInProgress> = [];

	authenticationSubscription!: Subscription;
	licenceApplicationRoutes = LicenceApplicationRoutes;

	inProgressDataSource: MatTableDataSource<LicenceInProgress> = new MatTableDataSource<LicenceInProgress>([]);
	columns: string[] = [
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
		private configService: ConfigService,
		private businessApplicationService: BusinessApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	async ngOnInit(): Promise<void> {
		this.lostLicenceDaysText = this.configService.configs?.replacementProcessingTime ?? null;
		// this.authenticationSubscription = this.authProcessService.waitUntilAuthentication$.subscribe(
		// 	(isLoggedIn: boolean) => {
		// 		if (isLoggedIn) {
		// 			this.securityWorkerLicensingService
		// 				.apiWorkerLicenceApplicationsGet()
		// 				.pipe()
		// 				.subscribe((resp: Array<LicenceAppListResponse>) => {
		// 					const notSubmittedLicenceErrorDays = SPD_CONSTANTS.periods.notSubmittedLicenceErrorDays;
		// 					const notSubmittedLicenceWarningDays = SPD_CONSTANTS.periods.notSubmittedLicenceWarningDays;
		// 					const notSubmittedLicenceHide = SPD_CONSTANTS.periods.notSubmittedLicenceHide;
		// 					// TODO remove when backend updated...
		// 					// If 30 days or more have passed since the last save, the application does not appear in this list
		// 					const inProgressResults = resp.filter(
		// 						(item: LicenceAppListResponse) =>
		// 							item.applicationPortalStatusCode === ApplicationPortalStatusCode.InProgress ||
		// 							// item.applicationPortalStatusCode === ApplicationPortalStatusCode.Draft
		// 							(item.applicationPortalStatusCode === ApplicationPortalStatusCode.Draft &&
		// 								moment().isSameOrBefore(moment(item.createdOn).add(notSubmittedLicenceHide, 'days')))
		// 					);
		// 					const activeResults = resp.filter(
		// 						(item: LicenceAppListResponse) =>
		// 							item.applicationPortalStatusCode === ApplicationPortalStatusCode.InProgress
		// 					);
		// 					const expiredResults = resp.filter(
		// 						(item: LicenceAppListResponse) =>
		// 							item.applicationPortalStatusCode !== ApplicationPortalStatusCode.InProgress
		// 					);
		// 					this.isNoActiveOrExpiredLicences = resp.length === 0;
		// 					this.isAllowCreateNew = true;
		// 					// If the licence holder has all 3 (either valid or expired), hide "Apply for a new licence/permit" button
		// 					inProgressResults.map((item: any) => {
		// 						if (item.applicationPortalStatusCode === ApplicationPortalStatusCode.Draft) {
		// 							item.expiresOn = moment(item.createdOn).add(notSubmittedLicenceHide, 'days');
		// 							item.isWarningMessage = false;
		// 							item.isErrorMessage = false;
		// 							if (moment().isSameOrAfter(moment(item.expiresOn).subtract(notSubmittedLicenceErrorDays, 'days'))) {
		// 								item.isErrorMessage = true;
		// 							} else if (
		// 								moment().isSameOrAfter(moment(item.expiresOn).subtract(notSubmittedLicenceWarningDays, 'days'))
		// 							) {
		// 								item.isWarningMessage = true;
		// 							}
		// 						}
		// 					});
		// 					this.activeApplications = activeResults as Array<LicenceInProgress>;
		// 					this.expiredApplications = expiredResults as Array<LicenceInProgress>;
		// 					this.inProgressDataSource = new MatTableDataSource(
		// 						(inProgressResults as Array<LicenceInProgress>) ?? []
		// 					);
		// 				});
		// 		}
		// 	}
		// );
		this.activeApplications = [
			{
				id: '1',
				licenceAppId: 'TEST-NWQ3X7A',
				workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityBusinessLicence,
				applicationTypeCode: ApplicationTypeCode.New,
				action: ApplicationTypeCode.Update,
				expiresOn: '2025-02-13T19:43:25+00:00',
				isRenewalPeriod: false,
				isWithin14Days: false,
				isWarningMessage: false,
				isErrorMessage: false,
			},
			// {
			// 	id: '2',
			// 	licenceAppId: 'TEST-NWQ3X7B',
			// 	workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityBusinessLicence,
			// 	applicationTypeCode: ApplicationTypeCode.New,
			// 	action: ApplicationTypeCode.Renewal,
			// 	expiresOn: '2024-09-26T19:43:25+00:00',
			// 	isRenewalPeriod: true,
			// 	isWithin14Days: true,
			// 	isWarningMessage: false,
			// 	isErrorMessage: false,
			// },
		];
		// this.expiredApplications = [
		// 	{
		// 		id: '1',
		// 		licenceAppId: 'TEST-NWQ3AB7Y',
		// 		workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityBusinessLicence,
		// 		applicationTypeCode: ApplicationTypeCode.New,
		// 		expiresOn: '2022-09-26T19:43:25+00:00',
		// 		isRenewalPeriod: false,
		// 		isWithin14Days: false,
		// 		isWarningMessage: false,
		// 		isErrorMessage: false,
		// 	},
		// ];
		// TODO Display modal for first time login
		// this.dialog.open(FirstTimeUserModalComponent, {
		// 	width: '800px',
		// });

		this.commonApplicationService.setApplicationTitle(WorkerLicenceTypeCode.SecurityBusinessLicence);
	}

	ngOnDestroy() {
		if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
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

	onManageMembers(): void {
		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.BUSINESS_CONTROLLING_MEMBERS_AND_EMPLOYEES)
		);
	}

	onKeydownManageMembers(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onManageMembers();
	}

	onRequestReplacement(appl: LicenceInProgress): void {
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

	onKeydownRequestReplacement(event: KeyboardEvent, appl: LicenceInProgress) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onRequestReplacement(appl);
	}

	onResume(_appl: LicenceAppListResponse): void {
		// if (appl.serviceTypeCode == WorkerLicenceTypeCode.SecurityWorkerLicence) {
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
		// 		.loadPermit(appl.licenceAppId!, appl.serviceTypeCode!, appl.applicationTypeCode!)
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

	onUpdate(_appl: LicenceInProgress): void {
		// if (appl.serviceTypeCode == WorkerLicenceTypeCode.SecurityWorkerLicence) {
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
		// }
	}

	onCreateNew(): void {
		this.businessApplicationService
			.createNewBusinessLicence()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.BUSINESS_NEW)
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onBusinessProfile(): void {
		this.businessApplicationService
			.loadBusinessProfile()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.BUSINESS_PROFILE)
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
