import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take, tap } from 'rxjs';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { LicenceApplicationService } from '../licence-application.service';

export interface ApplicationResponse {
	id?: string;
	licenceAppId?: string;
	workerLicenceTypeCode?: WorkerLicenceTypeCode;
	applicationTypeCode?: ApplicationTypeCode;
	expiresOn?: null | string;
}

@Component({
	selector: 'app-user-applications',
	template: `
		<section class="step-section px-4 py-2">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<h2 class="my-3 fw-normal">Security Licences & Permits</h2>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<ng-container *ngIf="isAuthenticated | async">
						<app-alert type="info">
							We noticed you changed your name recently. Do you want a new licence printed with your new name, for a $20
							fee?
						</app-alert>

						<app-alert type="warning">
							Your armoured vehicle permit is expiring in 71 days. Please renew by December 15, 2023.
						</app-alert>

						<div class="mb-4" *ngIf="incompleteApplications.length > 0">
							<!-- <div class="fs-4 fw-light mb-2">Incomplete Licences/Permits</div> -->
							<div class="card-section mb-2 px-4 py-3" *ngFor="let appl of incompleteApplications; let i = index">
								<div class="row">
									<div class="col-lg-3">
										<div class="fs-4 fw-normal" style="color: var(--color-primary);">
											{{ appl.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }}
										</div>
									</div>
									<div class="col-lg-9">
										<div class="row">
											<div class="col-lg-4">
												<small class="d-block text-muted mt-2 mt-md-0">Application Type</small>
												<div class="text-data">{{ appl.applicationTypeCode | options : 'ApplicationTypes' }}</div>
											</div>
											<div class="col-lg-4">
												<small class="d-block text-muted mt-2 mt-md-0">Create Date</small>
												<div class="text-data">{{ appl.expiresOn | date : constants.date.formalDateFormat }}</div>
											</div>
											<div class="col-lg-4 text-end">
												<mat-chip-option
													[selectable]="false"
													class="mat-chip-yellow"
													style="height: 38px; width: 115px;"
												>
													<mat-icon class="mat-chip-option-icon">warning</mat-icon>
													<span class="mat-chip-option-text my-3 ms-2 fs-6 fw-bold">Draft</span>
												</mat-chip-option>
											</div>
										</div>
										<div class="row">
											<div class="offset-lg-8 col-lg-4 text-end">
												<button mat-flat-button color="primary" class="large mt-3 w-auto" (click)="onResume(appl)">
													<mat-icon>double_arrow</mat-icon>Resume
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="mb-4" *ngIf="activeApplications.length > 0">
							<!-- <div class="fs-4 fw-light mb-2">Active Licences/Permits</div> -->
							<div class="card-section mb-2 px-4 py-3" *ngFor="let appl of activeApplications; let i = index">
								<div class="row">
									<div class="col-lg-2">
										<div class="fs-4 fw-normal" style="color: var(--color-primary);">
											{{ appl.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }}
										</div>
									</div>
									<div class="col-lg-10">
										<div class="row">
											<div class="col-lg-3">
												<small class="d-block text-muted mt-2 mt-md-0">Licence Id</small>
												<div class="text-data">{{ appl.licenceAppId }}</div>
											</div>
											<div class="col-lg-3">
												<small class="d-block text-muted mt-2 mt-md-0">Licence Term</small>
												<div class="text-data">1 Year</div>
											</div>
											<div class="col-lg-3">
												<small class="d-block text-muted mt-2 mt-md-0">Application Type</small>
												<div class="text-data">{{ appl.applicationTypeCode | options : 'ApplicationTypes' }}</div>
											</div>
											<div class="col-lg-3 text-end">
												<mat-chip-option
													[selectable]="false"
													class="mat-chip-green"
													style="height: 38px; width: 115px;"
												>
													<mat-icon class="mat-chip-option-icon">check_circle</mat-icon>
													<span class="mat-chip-option-text my-3 ms-2 fs-6 fw-bold">Active</span>
												</mat-chip-option>
											</div>
											<mat-divider class="my-2"></mat-divider>
										</div>

										<div class="row mb-2">
											<div class="col-lg-3">
												<small class="d-block text-muted mt-2 mt-md-0">Expiry Date</small>
												<div class="text-data">{{ appl.expiresOn | date : constants.date.formalDateFormat }}</div>
											</div>
											<div class="col-lg-4">
												<small class="d-block text-muted mt-2 mt-md-0">Licence Categories</small>
												<div class="text-data">
													<ul class="m-0">
														<li>Armoured Car Guard</li>
														<li>Security Guard</li>
														<li>Security Alarm Installer - Under Supervision</li>
													</ul>
												</div>
											</div>
											<div class="col-lg-5">
												<small class="d-block text-muted mt-2 mt-md-0">Authorization Documents</small>
												<div class="text-data">Authorization to use dogs</div>
												<div>Expires on Nov 23, 2023</div>
												<div>
													<a class="large" (click)="onUpdateAuthorization()"> Update Authorization </a>
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
												<button mat-flat-button class="mat-green-button large w-auto" (click)="onUpdate(appl)">
													<mat-icon>double_arrow</mat-icon>Update
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

						<div class="mb-4" *ngIf="expiredApplications.length > 0">
							<!-- <div class="fs-4 fw-light mb-2">Expired Licences/Permits</div> -->
							<div class="card-section mb-2 px-4 py-3" *ngFor="let appl of expiredApplications; let i = index">
								<div class="row">
									<div class="col-lg-3">
										<div class="fs-4 fw-normal" style="color: var(--color-primary);">
											{{ appl.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }}
										</div>
									</div>
									<div class="col-lg-9">
										<div class="row">
											<div class="col-lg-3">
												<small class="d-block text-muted mt-2 mt-md-0">Licence Id</small>
												<div class="text-data">{{ appl.licenceAppId }}</div>
											</div>
											<div class="col-lg-3">
												<small class="d-block text-muted mt-2 mt-md-0">Licence Term</small>
												<div class="text-data">5 Years</div>
											</div>
											<div class="col-lg-3">
												<small class="d-block text-muted mt-2 mt-md-0">Expiry Date</small>
												<div class="text-data">{{ appl.expiresOn | date : constants.date.formalDateFormat }}</div>
											</div>
											<div class="col-lg-3 text-end">
												<mat-chip-option [selectable]="false" class="mat-chip-red" style="height: 38px; width: 135px;">
													<mat-icon class="mat-chip-option-icon">cancel</mat-icon>
													<span class="mat-chip-option-text my-3 ms-2 fs-6 fw-bold">Expired</span>
												</mat-chip-option>
											</div>
											<!-- <mat-divider class="my-2"></mat-divider> -->
										</div>
										<!-- <div class="row mb-2">
										<div class="col-12 text-end">
											<button mat-flat-button class="mat-red-button large w-auto" (click)="onReapply(appl)">
												<mat-icon>double_arrow</mat-icon>Reapply
											</button>
										</div>
									</div> -->
									</div>
								</div>
							</div>
						</div>
					</ng-container>

					<button mat-flat-button color="primary" class="large w-auto my-4" (click)="onCreateNew()">
						Apply for a New Licence or Permit
					</button>

					<!-- <button
						mat-flat-button
						color="accent"
						class="large w-auto mb-4 mx-4"
						[routerLink]="[licenceApplicationRoutes.path(licenceApplicationRoutes.USER_PROFILE)]"
					>
						User Profile
					</button> -->
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			small {
				color: var(--color-grey-dark);
				line-height: 1.3em;
			}

			.text-data {
				font-weight: 500;
			}

			.mat-chip-option-icon {
				position: relative;
				top: 2px;
			}

			.mat-chip-option-text {
				position: relative;
				top: -5px;
			}

			.card-section {
				background-color: #f6f6f6 !important;
				border-left: 3px solid #38598a;
				border-bottom-width: 1px;
				border-bottom-style: solid;
				border-bottom-color: rgba(0, 0, 0, 0.12);
			}
		`,
	],
})
export class UserApplicationsComponent implements OnInit {
	constants = SPD_CONSTANTS;
	isAuthenticated = this.authProcessService.waitUntilAuthentication$;

	incompleteApplications: Array<ApplicationResponse> = [];
	activeApplications: Array<ApplicationResponse> = [];
	expiredApplications: Array<ApplicationResponse> = [];

	licenceApplicationRoutes = LicenceApplicationRoutes;

	constructor(
		private router: Router,
		private dialog: MatDialog,
		private authProcessService: AuthProcessService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		this.incompleteApplications = [
			{
				id: 'fc0c10a3-b6e6-4460-ac80-9b516f3e02a5',
				licenceAppId: 'SWL-NWQ3X7Z',
				workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence,
				applicationTypeCode: ApplicationTypeCode.New,
				expiresOn: '2023-09-15T19:43:25+00:00',
			},
			{
				id: '5a1bcc48-4eab-40c9-a820-ff6846b42d29',
				licenceAppId: 'SWL-CBC3X7Z',
				workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence,
				applicationTypeCode: ApplicationTypeCode.New,
				expiresOn: '2023-11-15T19:43:25+00:00',
			},
		];

		this.activeApplications = [
			{
				id: '1',
				licenceAppId: 'SWL-NWQ3X7Y',
				workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence,
				applicationTypeCode: ApplicationTypeCode.New,
				expiresOn: '2023-09-26T19:43:25+00:00',
			},
			{
				id: '1',
				licenceAppId: 'SWL-NWQ3X7Y',
				workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence,
				applicationTypeCode: ApplicationTypeCode.New,
				expiresOn: '2023-09-26T19:43:25+00:00',
			},
		];

		this.expiredApplications = [
			{
				id: '1',
				licenceAppId: 'SWL-NWQ3AB7Y',
				workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence,
				applicationTypeCode: ApplicationTypeCode.New,
				expiresOn: '2022-09-26T19:43:25+00:00',
			},
		];
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
				}
			});
	}

	onResume(appl: ApplicationResponse): void {
		this.licenceApplicationService.reset();

		this.licenceApplicationService
			.loadExistingLicence(appl.id!)
			.pipe(
				tap((resp: any) => {
					this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicence());
				}),
				take(1)
			)
			.subscribe();
	}

	onUpdate(appl: ApplicationResponse): void {
		this.licenceApplicationService.reset();

		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LICENCE_UPDATE));
	}

	onReapply(appl: ApplicationResponse): void {
		this.licenceApplicationService.reset();
	}

	onCreateNew(): void {
		this.licenceApplicationService.reset();

		this.licenceApplicationService
			.createNewLicence()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathSecurityWorkerLicence(LicenceApplicationRoutes.LICENCE_SELECTION)
					);
				}),
				take(1)
			)
			.subscribe();
	}
}
