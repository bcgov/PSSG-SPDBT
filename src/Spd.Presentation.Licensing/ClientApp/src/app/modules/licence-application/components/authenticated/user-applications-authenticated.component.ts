/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
	ApplicationPortalStatusCode,
	ApplicationTypeCode,
	WorkerLicenceAppListResponse,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { Subscription, take, tap } from 'rxjs';
import { WorkerLicensingService } from 'src/app/api/services';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';

export interface ApplicationResponse {
	id?: string;
	licenceAppId?: string;
	workerLicenceTypeCode?: WorkerLicenceTypeCode;
	applicationTypeCode?: ApplicationTypeCode;
	expiresOn?: null | string;
	action?: null | string;
}

@Component({
	selector: 'app-user-applications-authenticated',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6">
							<h2 class="my-3 fs-3 fw-normal">Security Licences & Permits</h2>
						</div>

						<div class="col-xl-6 col-lg-4 col-md-4 col-sm-6">
							<div class="d-flex justify-content-end">
								<button mat-flat-button color="primary" class="large w-auto" (click)="onUserProfile()">
									<mat-icon>person</mat-icon>
									Your Profile
								</button>
							</div>
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<!-- <app-alert type="info" icon="info">
						We noticed you changed your name recently. Do you want a new licence printed with your new name, for a $20
						fee?
					</app-alert>

					<app-alert type="warning">
						Your armoured vehicle permit is expiring in 71 days. Please renew by <strong>December 15, 2023</strong>.
					</app-alert>

					<app-alert type="danger" icon="error">
						You haven't submitted your licence application yet. It will expire on <strong>January 12, 2024</strong>
					</app-alert> -->

					<ng-container *ngIf="isAuthenticated | async">
						<div class="summary-card-section my-4 px-4 py-3">
							<div class="row">
								<div class="col-lg-6">
									<div class="text-data">You don't have an active licence</div>
								</div>
								<div class="col-lg-6 text-end">
									<button mat-flat-button color="primary" class="large w-auto" (click)="onCreateNew()">
										<mat-icon>add</mat-icon>Apply for a New Licence or Permit
									</button>
								</div>
							</div>
						</div>

						<div class="mb-3" *ngIf="dataSource.data.length > 0">
							<div class="section-title fs-5 py-3">In-Progress Licences/Permits</div>

							<div class="row summary-card-section summary-card-section__orange m-0">
								<div class="col-12" style="background-color: #f6f6f6 !important;">
									<mat-table [dataSource]="dataSource" class="pb-3" style="background-color: #f6f6f6 !important;">
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
											<mat-header-cell *matHeaderCellDef>Application Type</mat-header-cell>
											<mat-cell *matCellDef="let application">
												<span class="mobile-label">Application Type:</span>
												{{ application.applicationTypeCode | options : 'ApplicationTypes' }}
											</mat-cell>
										</ng-container>

										<ng-container matColumnDef="caseNumber">
											<mat-header-cell *matHeaderCellDef>Case ID</mat-header-cell>
											<mat-cell *matCellDef="let application">
												<span class="mobile-label">Case ID:</span>
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

										<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
										<mat-row *matRowDef="let row; columns: columns"></mat-row>
									</mat-table>
								</div>
							</div>
						</div>

						<div class="mb-3" *ngIf="activeApplications.length > 0">
							<div class="section-title fs-5 py-3">Active Licences/Permits</div>
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
												<div class="d-block text-muted mt-2 mt-md-0">Licence Id</div>
												<div class="text-data">{{ appl.licenceAppId }}</div>
											</div>
											<div class="col-lg-3">
												<div class="d-block text-muted mt-2 mt-md-0">Licence Term</div>
												<div class="text-data">1 Year</div>
											</div>
											<div class="col-lg-3">
												<div class="d-block text-muted mt-2 mt-md-0">Application Type</div>
												<div class="text-data">{{ appl.applicationTypeCode | options : 'ApplicationTypes' }}</div>
											</div>
											<div class="col-lg-3 text-end">
												<!-- <mat-chip-option [selectable]="false" class="appl-chip-option mat-chip-green">
													<mat-icon class="appl-chip-option-item">check_circle</mat-icon>
													<span class="appl-chip-option-item ms-2 fs-6 fw-bold">Active</span>
												</mat-chip-option> -->
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
												<div class="d-block text-muted mt-2 mt-md-0">Authorization Documents</div>
												<div class="text-data">Authorization to use dogs</div>
												<div>Expires on Nov 23, 2023</div>
												<div>
													<a
														class="large"
														tabindex="0"
														(click)="onUpdateAuthorization()"
														(keydown)="onKeydownUpdateAuthorization($event)"
													>
														Update Authorization
													</a>
												</div>
											</div>
											<mat-divider class="my-2"></mat-divider>
										</div>

										<div class="row mb-2">
											<div class="col-lg-9">
												The following updates have a $20 licence reprint fee:
												<ul class="m-0">
													<li>changes to licence category</li>
													<li>requests for authorization for dogs or restraints</li>
													<li>changing your name</li>
													<li>replacing your photo</li>
												</ul>
											</div>
											<div class="col-lg-3 text-end">
												<button mat-flat-button color="primary" class="large w-auto" (click)="onUpdate(appl)">
													<mat-icon>play_arrow</mat-icon>{{ appl.action }}
												</button>
											</div>
										</div>
									</div>

									<div class="row">
										<div class="col-12">
											<mat-divider class="my-2"></mat-divider>
											<span class="fw-semibold">Lost your licence? </span>
											<a class="large" href="http://www.google.ca/" target="_blank">Request a replacement card</a>
											and we'll send you one in xx-xx business days.
										</div>
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
											{{ appl.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }}
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
												<!-- <mat-chip-option [selectable]="false" class="appl-chip-option mat-chip-red">
													<mat-icon class="appl-chip-option-item">cancel</mat-icon>
													<span class="appl-chip-option-item ms-2 fs-6 fw-bold">Expired</span>
												</mat-chip-option> -->
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
		`,
	],
})
export class UserApplicationsAuthenticatedComponent implements OnInit, OnDestroy {
	constants = SPD_CONSTANTS;
	isAuthenticated = this.authProcessService.waitUntilAuthentication$;

	activeApplications: Array<ApplicationResponse> = [];
	expiredApplications: Array<ApplicationResponse> = [];

	authenticationSubscription!: Subscription;
	licenceApplicationRoutes = LicenceApplicationRoutes;
	applicationPortalStatusCodes = ApplicationPortalStatusCode;

	dataSource: MatTableDataSource<WorkerLicenceAppListResponse> = new MatTableDataSource<WorkerLicenceAppListResponse>(
		[]
	);
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
		private dialog: MatDialog,
		private authProcessService: AuthProcessService,
		private workerLicensingService: WorkerLicensingService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	async ngOnInit(): Promise<void> {
		this.authProcessService.logoutBceid();

		await this.authProcessService.initializeLicencingBCSC();

		this.authenticationSubscription = this.authProcessService.waitUntilAuthentication$.subscribe(
			(isLoggedIn: boolean) => {
				if (isLoggedIn) {
					this.workerLicensingService
						.apiWorkerLicenceApplicationsGet()
						.pipe()
						.subscribe((resp: Array<WorkerLicenceAppListResponse>) => {
							this.dataSource = new MatTableDataSource(resp ?? []);
						});
				}
			}
		);

		this.activeApplications = [
			{
				id: '1',
				licenceAppId: 'TEST-NWQ3X7A',
				workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence,
				applicationTypeCode: ApplicationTypeCode.New,
				action: ApplicationTypeCode.Update,
				expiresOn: '2023-09-26T19:43:25+00:00',
			},
			{
				id: '2',
				licenceAppId: 'TEST-NWQ3X7B',
				workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence,
				applicationTypeCode: ApplicationTypeCode.New,
				action: ApplicationTypeCode.Renewal,
				expiresOn: '2023-09-26T19:43:25+00:00',
			},
		];

		this.expiredApplications = [
			{
				id: '1',
				licenceAppId: 'TEST-NWQ3AB7Y',
				workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence,
				applicationTypeCode: ApplicationTypeCode.New,
				expiresOn: '2022-09-26T19:43:25+00:00',
			},
		];
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

	onUpdateAuthorization(): void {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'UpdateAuthorization',
			message: 'UpdateAuthorization',
			actionText: 'Save',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					// TODO
				}
			});
	}

	onKeydownUpdateAuthorization(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onUpdateAuthorization();
	}

	onResume(appl: WorkerLicenceAppListResponse): void {
		this.licenceApplicationService
			.loadLicence(appl.licenceAppId!, appl.serviceTypeCode!, appl.applicationTypeCode!)
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
	}

	onUpdate(appl: ApplicationResponse): void {
		if (appl.action === ApplicationTypeCode.Update) {
			this.licenceApplicationService
				.loadUpdateLicence()
				.pipe(
					tap((_resp: any) => {
						this.router.navigateByUrl(
							LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
								LicenceApplicationRoutes.WORKER_LICENCE_UPDATE_AUTHENTICATED
							)
						);
					}),
					take(1)
				)
				.subscribe();
		} else {
			this.licenceApplicationService
				.loadLicence('468075a7-550e-4820-a7ca-00ea6dde3025', appl.workerLicenceTypeCode!, ApplicationTypeCode.Renewal)
				.pipe(
					tap((_resp: any) => {
						this.router.navigateByUrl(
							LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
								LicenceApplicationRoutes.WORKER_LICENCE_RENEW_AUTHENTICATED
							)
						);
					}),
					take(1)
				)
				.subscribe();
		}
	}

	onReapply(_appl: ApplicationResponse): void {
		this.licenceApplicationService.reset();
	}

	onCreateNew(): void {
		this.licenceApplicationService
			.createNewLicenceAuthenticated()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
							LicenceApplicationRoutes.LICENCE_USER_PROFILE_AUTHENTICATED
						)
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onUserProfile(): void {
		this.licenceApplicationService
			.loadUserProfile()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(LicenceApplicationRoutes.LOGIN_USER_PROFILE)
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onConnectToExpiredLicence(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LICENCE_LINK));
	}

	onKeydownConnectToExpiredLicence(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onConnectToExpiredLicence();
	}
}
