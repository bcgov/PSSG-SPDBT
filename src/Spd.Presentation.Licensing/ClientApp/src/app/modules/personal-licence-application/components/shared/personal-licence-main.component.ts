/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApplicationPortalStatusCode, ApplicationTypeCode, LicenceStatusCode, ServiceTypeCode } from '@app/api/models';
import {
	CommonApplicationService,
	MainApplicationResponse,
	MainLicenceResponse,
} from '@app/core/services/common-application.service';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { UtilService } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';

import { Observable, forkJoin, take, tap } from 'rxjs';

@Component({
	selector: 'app-personal-licence-main',
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
								<button
									mat-flat-button
									color="primary"
									class="large w-auto mb-3"
									(click)="onUserProfile()"
									aria-label="Manage your user profile"
								>
									<mat-icon>person</mat-icon>
									{{ yourProfileLabel }}
								</button>
							</div>
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<ng-container *ngFor="let msg of errorMessages; let i = index">
						<app-alert type="danger" icon="dangerous">
							<div [innerHTML]="msg"></div>
						</app-alert>
					</ng-container>

					<ng-container *ngFor="let msg of warningMessages; let i = index">
						<app-alert type="warning" icon="warning">
							<div [innerHTML]="msg"></div>
						</app-alert>
					</ng-container>

					<app-personal-licence-main-applications-list
						[applicationsDataSource]="applicationsDataSource"
						[applicationIsInProgress]="applicationIsInProgress"
						(resumeApplication)="onResume($event)"
						(payApplication)="onPay($event)"
						(cancelApplication)="onDelete($event)"
					></app-personal-licence-main-applications-list>

					<app-personal-licence-main-licence-list
						[activeLicences]="activeLicences"
						[applicationIsInProgress]="applicationIsInProgress"
						(replaceLicence)="onReplace($event)"
						(updateLicence)="onUpdate($event)"
						(renewLicence)="onRenew($event)"
					></app-personal-licence-main-licence-list>

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
									aria-label="Apply for a new Security Worker Licence"
								>
									<mat-icon>add</mat-icon>Apply for a New Security Worker Licence
								</button>
							</div>
							<div class="col-12 mt-3" *ngIf="applicationIsInProgress">
								<app-alert type="info" icon="info">
									A Security Worker Licence cannot be created while an application is in progress.
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
									aria-label="Apply for a new Body Armour Permit"
								>
									<mat-icon>add</mat-icon>Apply for a New Body Armour Permit
								</button>
							</div>
							<div class="col-12 mt-3" *ngIf="applicationIsInProgress">
								<app-alert type="info" icon="info">
									A Body Armour Permit cannot be created while an application is in progress.
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
									aria-label="Apply for a new Armoured Vehicle Permit"
								>
									<mat-icon>add</mat-icon>Apply for a New Armoured Vehicle Permit
								</button>
							</div>
							<div class="col-12 mt-3" *ngIf="applicationIsInProgress">
								<app-alert type="info" icon="info">
									An Armoured Vehicle Permit cannot be created while an application is in progress.
								</app-alert>
							</div>
						</div>
					</div>

					<app-form-licence-list-expired [expiredLicences]="expiredLicences"></app-form-licence-list-expired>

					<div class="mt-4">
						<app-alert type="info" icon="info">
							Do you have a security licence, body armour permit, or armoured vehicle permit that isn’t displayed here?

							<a
								class="fw-normal"
								tabindex="0"
								aria-label="Link a current or expired licence or permit to your account"
								(click)="onConnectToExpiredLicence()"
								(keydown)="onKeydownConnectToExpiredLicence($event)"
								>Link a current or expired licence or permit</a
							>
							to your account.
						</app-alert>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
	standalone: false,
})
export class PersonalLicenceMainComponent implements OnInit {
	results$!: Observable<any>;
	applicationIsInProgress = false;
	yourProfileLabel = '';

	warningMessages: Array<string> = [];
	errorMessages: Array<string> = [];

	activeLicences: Array<MainLicenceResponse> = [];

	// If the licence holder has a SWL, they can add a new Body Armour and/or Armoured Vehicle permit
	// If the licence holder has a Body Armour permit, they can add a new Armoured Vehicle permit and/or a security worker licence
	// If the licence holder has an Armoured vehicle permit, they can add a new Body Armour permit and/or a security worker licence
	activeSwlExist = false;
	activeAvPermitExist = false;
	activeBaPermitExist = false;

	expiredLicences: Array<MainLicenceResponse> = [];

	applicationsDataSource: MatTableDataSource<MainApplicationResponse> = new MatTableDataSource<MainApplicationResponse>(
		[]
	);

	constructor(
		private router: Router,
		private utilService: UtilService,
		private dialog: MatDialog,
		private commonApplicationService: CommonApplicationService,
		private permitApplicationService: PermitApplicationService,
		private workerApplicationService: WorkerApplicationService
	) {}

	ngOnInit(): void {
		this.permitApplicationService.reset(); // prevent back button into wizard
		this.workerApplicationService.reset(); // prevent back button into wizard

		this.commonApplicationService.setApplicationTitle();

		this.loadData();
	}

	onUserProfile(): void {
		// When a user has started an application but has not submitted it yet,
		// the user can view their Profile page in read-only mode – they can't edit
		// this info while the application is in progress
		this.workerApplicationService
			.loadUserProfile()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
							PersonalLicenceApplicationRoutes.LICENCE_LOGIN_USER_PROFILE
						),
						{ state: { isReadonly: this.applicationIsInProgress } }
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onNewSecurityWorkerLicence(): void {
		this.workerApplicationService
			.createNewLicenceAuthenticated()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
							PersonalLicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
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
			.createNewPermitAuthenticated(ServiceTypeCode.BodyArmourPermit)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						PersonalLicenceApplicationRoutes.pathPermitAuthenticated(
							PersonalLicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
						),
						{
							state: {
								serviceTypeCode: ServiceTypeCode.BodyArmourPermit,
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
			.createNewPermitAuthenticated(ServiceTypeCode.ArmouredVehiclePermit)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						PersonalLicenceApplicationRoutes.pathPermitAuthenticated(
							PersonalLicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
						),
						{
							state: {
								serviceTypeCode: ServiceTypeCode.ArmouredVehiclePermit,
								applicationTypeCode: ApplicationTypeCode.New,
							},
						}
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onReplace(licence: MainLicenceResponse): void {
		if (this.applicationIsInProgress) return;

		switch (licence.serviceTypeCode) {
			case ServiceTypeCode.SecurityWorkerLicence: {
				this.workerApplicationService
					.getLicenceWithSelectionAuthenticated(ApplicationTypeCode.Replacement, licence)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
									PersonalLicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
								),
								{ state: { applicationTypeCode: ApplicationTypeCode.Replacement } }
							);
						}),
						take(1)
					)
					.subscribe();
				break;
			}
			case ServiceTypeCode.ArmouredVehiclePermit:
			case ServiceTypeCode.BodyArmourPermit: {
				// There is no Replacement flow for Permit. Send the user to Update flow.
				this.onUpdate(licence);
				break;
			}
		}
	}

	onDelete(appl: MainApplicationResponse): void {
		if (
			appl.applicationPortalStatusCode != ApplicationPortalStatusCode.Draft ||
			appl.applicationTypeCode === ApplicationTypeCode.New
		) {
			return;
		}

		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this application.',
			actionText: 'Remove',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.utilService.toasterSuccess('The application has been successfully removed');

					this.commonApplicationService
						.cancelDraftApplication(appl.licenceAppId!)
						.pipe(
							tap((_resp: any) => {
								this.loadData();
							}),
							take(1)
						)
						.subscribe();
				}
			});
	}

	onResume(appl: MainApplicationResponse): void {
		switch (appl.serviceTypeCode) {
			case ServiceTypeCode.SecurityWorkerLicence: {
				this.workerApplicationService
					.getWorkerLicenceToResume(appl.licenceAppId!)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
									PersonalLicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
								),
								{ state: { applicationTypeCode: _resp.applicationTypeData.applicationTypeCode } }
							);
						}),
						take(1)
					)
					.subscribe();
				break;
			}
			case ServiceTypeCode.ArmouredVehiclePermit:
			case ServiceTypeCode.BodyArmourPermit: {
				this.permitApplicationService
					.getPermitToResume(appl.licenceAppId!)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								PersonalLicenceApplicationRoutes.pathPermitAuthenticated(
									PersonalLicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
								),
								{
									state: {
										serviceTypeCode: appl.serviceTypeCode,
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

	onPay(appl: MainApplicationResponse): void {
		this.commonApplicationService.payNowPersonalLicenceAuthenticated(appl.licenceAppId!);
	}

	onUpdate(licence: MainLicenceResponse): void {
		switch (licence.serviceTypeCode) {
			case ServiceTypeCode.SecurityWorkerLicence: {
				this.workerApplicationService
					.getLicenceWithSelectionAuthenticated(ApplicationTypeCode.Update, licence)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
									PersonalLicenceApplicationRoutes.WORKER_LICENCE_UPDATE_TERMS_AUTHENTICATED
								)
							);
						}),
						take(1)
					)
					.subscribe();
				break;
			}
			case ServiceTypeCode.ArmouredVehiclePermit:
			case ServiceTypeCode.BodyArmourPermit: {
				this.permitApplicationService
					.getPermitWithSelectionAuthenticated(licence.licenceAppId!, ApplicationTypeCode.Update, licence)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								PersonalLicenceApplicationRoutes.pathPermitAuthenticated(
									PersonalLicenceApplicationRoutes.PERMIT_UPDATE_TERMS_AUTHENTICATED
								),
								{ state: { serviceTypeCode: licence.serviceTypeCode } }
							);
						}),
						take(1)
					)
					.subscribe();
			}
		}
	}

	onRenew(licence: MainLicenceResponse): void {
		switch (licence.serviceTypeCode) {
			case ServiceTypeCode.SecurityWorkerLicence: {
				this.workerApplicationService
					.getLicenceWithSelectionAuthenticated(ApplicationTypeCode.Renewal, licence)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
									PersonalLicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
								),
								{ state: { applicationTypeCode: ApplicationTypeCode.Renewal } }
							);
						}),
						take(1)
					)
					.subscribe();
				break;
			}
			case ServiceTypeCode.ArmouredVehiclePermit:
			case ServiceTypeCode.BodyArmourPermit: {
				this.permitApplicationService
					.getPermitWithSelectionAuthenticated(licence.licenceAppId!, ApplicationTypeCode.Renewal, licence)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								PersonalLicenceApplicationRoutes.pathPermitAuthenticated(
									PersonalLicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
								),
								{
									state: {
										serviceTypeCode: licence.serviceTypeCode,
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
			PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
				PersonalLicenceApplicationRoutes.LICENCE_LINK
			)
		);
	}

	onKeydownConnectToExpiredLicence(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onConnectToExpiredLicence();
	}

	private loadData(): void {
		this.results$ = forkJoin([
			this.commonApplicationService.userPersonLicencesList(),
			this.commonApplicationService.userPersonApplicationsList(),
		]).pipe(
			tap((resps: Array<any>) => {
				const userPersonLicencesList: Array<MainLicenceResponse> = resps[0];
				const userPersonApplicationsList: Array<MainApplicationResponse> = resps[1];

				// Swl Licences/ Permits Applications
				this.applicationsDataSource = new MatTableDataSource(userPersonApplicationsList ?? []);
				this.applicationIsInProgress =
					this.commonApplicationService.getApplicationIsInProgress(userPersonApplicationsList);

				// Swl Licences/ Permits
				const activeLicencesList = userPersonLicencesList.filter((item: MainLicenceResponse) =>
					this.utilService.isLicenceActive(item.licenceStatusCode)
				);

				const expiredLicences = userPersonLicencesList.filter(
					(item: MainLicenceResponse) => item.licenceStatusCode === LicenceStatusCode.Expired
				);

				// Set flags that determine if NEW licences/permits can be created
				let activeSwlExist =
					activeLicencesList.findIndex(
						(item: MainLicenceResponse) => item.serviceTypeCode === ServiceTypeCode.SecurityWorkerLicence
					) >= 0;
				if (!activeSwlExist) {
					activeSwlExist =
						userPersonApplicationsList.findIndex(
							(item: MainApplicationResponse) => item.serviceTypeCode === ServiceTypeCode.SecurityWorkerLicence
						) >= 0;
				}
				this.activeSwlExist = activeSwlExist;

				let activeBaPermitExist =
					activeLicencesList.findIndex(
						(item: MainLicenceResponse) => item.serviceTypeCode === ServiceTypeCode.BodyArmourPermit
					) >= 0;
				if (!activeBaPermitExist) {
					activeBaPermitExist =
						userPersonApplicationsList.findIndex(
							(item: MainApplicationResponse) => item.serviceTypeCode === ServiceTypeCode.BodyArmourPermit
						) >= 0;
				}
				this.activeBaPermitExist = activeBaPermitExist;

				let activeAvPermitExist =
					activeLicencesList.findIndex(
						(item: MainLicenceResponse) => item.serviceTypeCode === ServiceTypeCode.ArmouredVehiclePermit
					) >= 0;
				if (!activeAvPermitExist) {
					activeAvPermitExist =
						userPersonApplicationsList.findIndex(
							(item: MainApplicationResponse) => item.serviceTypeCode === ServiceTypeCode.ArmouredVehiclePermit
						) >= 0;
				}
				this.activeAvPermitExist = activeAvPermitExist;

				[this.warningMessages, this.errorMessages] =
					this.commonApplicationService.getMainWarningsAndErrorPersonalLicence(
						userPersonApplicationsList,
						activeLicencesList
					);

				this.activeLicences = activeLicencesList;
				this.expiredLicences = expiredLicences;

				this.yourProfileLabel = this.applicationIsInProgress ? 'View Your Profile' : 'Your Profile';
			})
		);
	}
}
