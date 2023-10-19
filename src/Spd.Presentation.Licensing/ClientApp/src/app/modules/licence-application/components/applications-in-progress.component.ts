import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take, tap } from 'rxjs';
import { SwlApplicationTypeCode, SwlTypeCode } from 'src/app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { LicenceApplicationService } from '../licence-application.service';

export interface ApplicationResponse {
	id?: string;
	licenceId?: string;
	licenceTypeCode?: SwlTypeCode;
	applicationTypeCode?: SwlApplicationTypeCode;
	expiresOn?: null | string;
}

@Component({
	selector: 'app-applications-in-progress',
	template: `
		<!--  *ngIf="isAuthenticated | async" -->
		<section class="step-section px-4 py-2">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<h2 class="my-3 fw-normal">Security Licences & Permits</h2>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<app-alert type="info">
						We noticed you changed your name recently. Do you want a new licence printed with your new name, for a $20
						fee?
					</app-alert>

					<div class="mb-4" *ngIf="incompleteApplications.length > 0">
						<div class="fs-5 mb-2">Incomplete Licences/Permits</div>
						<div class="card-section mb-2 px-4 py-3" *ngFor="let appl of incompleteApplications; let i = index">
							<div class="row">
								<div class="col-lg-4">
									<div class="fs-5 fw-normal" style="color: var(--color-primary);">
										{{ appl.licenceTypeCode | options : 'SwlTypes' }}
									</div>
								</div>
								<div class="col-lg-3">
									<small class="d-block text-muted mt-2 mt-md-0">Application Type</small>
									<div class="text-data">{{ appl.applicationTypeCode | options : 'SwlApplicationTypes' }}</div>
								</div>
								<div class="col-lg-2">
									<small class="d-block text-muted mt-2 mt-md-0">Create Date</small>
									<div class="text-data">{{ appl.expiresOn | date : constants.date.formalDateFormat }}</div>
								</div>
								<div class="col-lg-3 text-end">
									<button mat-flat-button color="primary" class="large w-auto" (click)="onResume(appl)">
										<mat-icon>double_arrow</mat-icon>Resume
									</button>
								</div>
							</div>
						</div>
					</div>

					<div class="mb-4" *ngIf="activeApplications.length > 0">
						<div class="fs-5 mb-2">Active Licences/Permits</div>
						<div class="card-section mb-2 px-4 py-3" *ngFor="let appl of activeApplications; let i = index">
							<div class="row">
								<div class="col-lg-2">
									<div class="fs-5 fw-normal" style="color: var(--color-primary);">
										{{ appl.licenceTypeCode | options : 'SwlTypes' }}
									</div>
								</div>
								<div class="col-lg-10">
									<div class="row">
										<div class="col-lg-3">
											<small class="d-block text-muted mt-2 mt-md-0">Licence Id</small>
											<div class="text-data">{{ appl.licenceId }}</div>
										</div>
										<div class="col-lg-3">
											<small class="d-block text-muted mt-2 mt-md-0">Licence Term</small>
											<div class="text-data">1 Year</div>
										</div>
										<div class="col-lg-3">
											<small class="d-block text-muted mt-2 mt-md-0">Application Type</small>
											<div class="text-data">{{ appl.applicationTypeCode | options : 'SwlApplicationTypes' }}</div>
										</div>
										<div class="col-lg-3 text-end">
											<mat-chip-option [selectable]="false" class="mat-chip-green" style="height: 38px; width: 135px;">
												<mat-icon>check_circle</mat-icon>
												<span class="my-3 ms-2 fs-6 fw-bold" style="position: relative; top: -6px;">Active</span>
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
										<span class="fw-semibold">Lost your licence?</span>
										<a class="large" href="http://www.google.ca/" target="_blank"> Request a replacement card </a>
										and we'll send you one in xx-xx business days.
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="mb-4" *ngIf="expiredApplications.length > 0">
						<div class="fs-5 mb-2">Expired Licences/Permits</div>
						<div class="card-section mb-2 px-4 py-3" *ngFor="let appl of expiredApplications; let i = index">
							<div class="row">
								<div class="col-lg-2">
									<div class="fs-5 fw-normal" style="color: var(--color-primary);">
										{{ appl.licenceTypeCode | options : 'SwlTypes' }}
									</div>
								</div>
								<div class="col-lg-10">
									<div class="row">
										<div class="col-lg-3">
											<small class="d-block text-muted mt-2 mt-md-0">Licence Id</small>
											<div class="text-data">{{ appl.licenceId }}</div>
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
												<mat-icon>cancel</mat-icon>
												<span class="my-3 ms-2 fs-6 fw-bold" style="position: relative; top: -6px;">Expired</span>
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

					<button mat-flat-button color="primary" class="large w-auto mb-4" (click)="onCreateNew()">
						Apply for a New Licence or Permit
					</button>

					<button
						mat-flat-button
						color="accent"
						class="large w-auto mb-4 mx-4"
						[routerLink]="[licenceApplicationRoutes.path(licenceApplicationRoutes.USER_PROFILE)]"
					>
						User Profile
					</button>
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

			.card-section {
				background-color: #ededed !important;
				border-left: 3px solid #38598a;
				border-bottom-width: 1px;
				border-bottom-style: solid;
				border-bottom-color: rgba(0, 0, 0, 0.12);
			}
		`,
	],
})
export class ApplicationsInProgressComponent implements OnInit, OnDestroy {
	constants = SPD_CONSTANTS;

	incompleteApplications: Array<ApplicationResponse> = [];
	activeApplications: Array<ApplicationResponse> = [];
	expiredApplications: Array<ApplicationResponse> = [];

	licenceApplicationRoutes = LicenceApplicationRoutes;

	constructor(
		private router: Router,
		private dialog: MatDialog,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		this.incompleteApplications = [
			{
				id: '1',
				licenceId: 'SWL-NWQ3X7Y',
				licenceTypeCode: SwlTypeCode.SecurityWorkerLicence,
				applicationTypeCode: SwlApplicationTypeCode.NewOrExpired,
				expiresOn: '2023-09-26T19:43:25+00:00',
			},
			{
				id: '11',
				licenceId: 'SWL-NWQ3X7Z',
				licenceTypeCode: SwlTypeCode.SecurityWorkerLicence,
				applicationTypeCode: SwlApplicationTypeCode.NewOrExpired,
				expiresOn: '2023-09-26T19:43:25+00:00',
			},
			// {
			// 	id: '2',
			// 	licenceId: 'CSK-RNS2V9K40521m',
			// 	licenceTypeCode: SwlTypeCode.ArmouredVehiclePermit,
			// 	applicationTypeCode: SwlApplicationTypeCode.Renewal,
			// 	expiresOn: '2023-06-11T16:43:25+00:00',
			// },
			// {
			// 	id: '3',
			// 	licenceId: 'CLW-RPC2V8K10521b',
			// 	licenceTypeCode: SwlTypeCode.BodyArmourPermit,
			// 	applicationTypeCode: SwlApplicationTypeCode.Replacement,
			// 	expiresOn: '2023-03-07T19:43:25+00:00',
			// },
			// {
			// 	id: '4',
			// 	licenceId: 'CLW-UPC2V8K10521b',
			// 	licenceTypeCode: SwlTypeCode.SecurityBusinessLicence,
			// 	applicationTypeCode: SwlApplicationTypeCode.Update,
			// 	expiresOn: '2023-03-07T19:43:25+00:00',
			// },
		];

		this.activeApplications = [
			{
				id: '1',
				licenceId: 'SWL-NWQ3X7Y',
				licenceTypeCode: SwlTypeCode.SecurityWorkerLicence,
				applicationTypeCode: SwlApplicationTypeCode.NewOrExpired,
				expiresOn: '2023-09-26T19:43:25+00:00',
			},
		];

		this.expiredApplications = [
			{
				id: '1',
				licenceId: 'SWL-NWQ3AB7Y',
				licenceTypeCode: SwlTypeCode.SecurityWorkerLicence,
				applicationTypeCode: SwlApplicationTypeCode.NewOrExpired,
				expiresOn: '2022-09-26T19:43:25+00:00',
			},
		];
	}

	ngOnDestroy() {
		// this.licenceModelLoadedSubscription.unsubscribe();
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

		if (appl.id == '1') {
			this.licenceApplicationService
				.loadLicenceNew()
				.pipe(
					tap((resp: any) => {
						this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATION));
					}),
					take(1)
				)
				.subscribe();
		} else if (appl.id == '11') {
			this.licenceApplicationService
				.loadLicenceNew2()
				.pipe(
					tap((resp: any) => {
						this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATION));
					}),
					take(1)
				)
				.subscribe();
			// } else if (appl.id == '2') {
			// 	this.licenceApplicationService
			// 		.loadLicenceRenewal()
			// 		.pipe(
			// 			tap((resp: any) => {
			// 				console.log('after2', resp);
			// 				this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATION));
			// 			}),
			// 			take(1)
			// 		)
			// 		.subscribe();
			// } else if (appl.id == '3') {
			// 	this.licenceApplicationService
			// 		.loadLicenceReplacement()
			// 		.pipe(
			// 			tap((resp: any) => {
			// 				console.log('after2', resp);
			// 				this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATION));
			// 			}),
			// 			take(1)
			// 		)
			// 		.subscribe();
			// } else if (appl.id == '4') {
			// 	this.licenceApplicationService
			// 		.loadLicenceUpdate()
			// 		.pipe(
			// 			tap((resp: any) => {
			// 				console.log('after2', resp);
			// 				this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATION));
			// 			}),
			// 			take(1)
			// 		)
			// 		.subscribe();
		}
	}

	onUpdate(appl: ApplicationResponse): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LICENCE_UPDATE));
	}

	onReapply(appl: ApplicationResponse): void {}

	onCreateNew(): void {
		this.licenceApplicationService.reset();

		this.licenceApplicationService
			.createNewLicence()
			.pipe(
				tap((resp: any) => {
					console.log('after3', resp);
					this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LICENCE_SELECTION));
				}),
				take(1)
			)
			.subscribe();
	}
}
