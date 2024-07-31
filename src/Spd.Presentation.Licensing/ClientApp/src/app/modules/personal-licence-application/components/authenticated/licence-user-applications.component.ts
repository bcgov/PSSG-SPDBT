/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApplicationTypeCode, LicenceStatusCode, WorkerLicenceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import {
	ApplicationService,
	MainApplicationResponse,
	MainLicenceResponse,
} from '@app/core/services/application.service';
import { ConfigService } from '@app/core/services/config.service';
import { LicenceApplicationService } from '@app/core/services/licence-application.service';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routing.module';

import { PermitApplicationService } from '@core/services/permit-application.service';
import { Observable, forkJoin, take, tap } from 'rxjs';

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

					<app-applications-list-current
						[applicationsDataSource]="applicationsDataSource"
						[applicationIsInProgress]="applicationIsInProgress"
						(resumeApplication)="onResume($event)"
					></app-applications-list-current>

					<app-licence-active-swl-permit-licences
						[activeLicences]="activeLicences"
						[applicationIsInProgress]="applicationIsInProgress"
						[lostLicenceDaysText]="lostLicenceDaysText"
						(replaceLicence)="onReplace($event)"
						(updateLicence)="onUpdate($event)"
						(renewLicence)="onRenew($event)"
					></app-licence-active-swl-permit-licences>

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

					<app-licence-list-expired [expiredLicences]="expiredLicences"></app-licence-list-expired>

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

			.error-color {
				font-weight: 600;
				color: var(--color-red-dark);
			}
		`,
	],
})
export class LicenceUserApplicationsComponent implements OnInit {
	constants = SPD_CONSTANTS;
	workerLicenceTypeCodes = WorkerLicenceTypeCode;

	results$!: Observable<any>;
	applicationIsInProgress = false;
	yourProfileLabel = '';
	lostLicenceDaysText = 'TDB';

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
		private configService: ConfigService,
		private commonApplicationService: ApplicationService,
		private permitApplicationService: PermitApplicationService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		this.lostLicenceDaysText = this.configService.configs?.replacementProcessingTime ?? 'TDB';

		this.commonApplicationService.setApplicationTitle();

		this.results$ = forkJoin([
			this.commonApplicationService.userLicencesList(),
			this.commonApplicationService.userApplicationsList(),
		]).pipe(
			tap((resps: Array<any>) => {
				const userLicencesList: Array<MainLicenceResponse> = resps[0];
				const userApplicationsList: Array<MainApplicationResponse> = resps[1];

				// Swl Licences/ Permits Applications
				this.applicationsDataSource = new MatTableDataSource(userApplicationsList ?? []);
				this.applicationIsInProgress = this.commonApplicationService.getApplicationIsInProgress(userApplicationsList);

				// Swl Licences/ Permits
				const activeLicences = userLicencesList.filter(
					(item: MainLicenceResponse) => item.licenceStatusCode === LicenceStatusCode.Active
				);

				const expiredLicences = userLicencesList.filter(
					(item: MainLicenceResponse) => item.licenceStatusCode === LicenceStatusCode.Expired
				);

				// Set flags that determine if NEW licences/permits can be created
				let activeSwlExist =
					activeLicences.findIndex(
						(item: MainLicenceResponse) => item.workerLicenceTypeCode === WorkerLicenceTypeCode.SecurityWorkerLicence
					) >= 0;
				if (!activeSwlExist) {
					activeSwlExist =
						userApplicationsList.findIndex(
							(item: MainApplicationResponse) => item.serviceTypeCode === WorkerLicenceTypeCode.SecurityWorkerLicence
						) >= 0;
				}
				this.activeSwlExist = activeSwlExist;

				let activeBaPermitExist =
					activeLicences.findIndex(
						(item: MainLicenceResponse) => item.workerLicenceTypeCode === WorkerLicenceTypeCode.BodyArmourPermit
					) >= 0;
				if (!activeBaPermitExist) {
					activeBaPermitExist =
						userApplicationsList.findIndex(
							(item: MainApplicationResponse) => item.serviceTypeCode === WorkerLicenceTypeCode.BodyArmourPermit
						) >= 0;
				}
				this.activeBaPermitExist = activeBaPermitExist;

				let activeAvPermitExist =
					activeLicences.findIndex(
						(item: MainLicenceResponse) => item.workerLicenceTypeCode === WorkerLicenceTypeCode.ArmouredVehiclePermit
					) >= 0;
				if (!activeAvPermitExist) {
					activeAvPermitExist =
						userApplicationsList.findIndex(
							(item: MainApplicationResponse) => item.serviceTypeCode === WorkerLicenceTypeCode.ArmouredVehiclePermit
						) >= 0;
				}
				this.activeAvPermitExist = activeAvPermitExist;

				[this.warningMessages, this.errorMessages] = this.commonApplicationService.getMainWarningsAndError(
					userApplicationsList,
					activeLicences
				);

				this.activeLicences = activeLicences;
				this.expiredLicences = expiredLicences;

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
		this.licenceApplicationService
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
			.createNewPermitAuthenticated(WorkerLicenceTypeCode.BodyArmourPermit)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						PersonalLicenceApplicationRoutes.pathPermitAuthenticated(
							PersonalLicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
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
						PersonalLicenceApplicationRoutes.pathPermitAuthenticated(
							PersonalLicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
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

	onReplace(licence: MainLicenceResponse): void {
		if (this.applicationIsInProgress) return;

		switch (licence.workerLicenceTypeCode) {
			case WorkerLicenceTypeCode.SecurityWorkerLicence: {
				this.licenceApplicationService
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
			case WorkerLicenceTypeCode.ArmouredVehiclePermit:
			case WorkerLicenceTypeCode.BodyArmourPermit: {
				// There is no Replacement flow for Permit. Send the user to Update flow.
				this.onUpdate(licence);
				break;
			}
		}
	}

	onResume(appl: MainApplicationResponse): void {
		switch (appl.serviceTypeCode) {
			case WorkerLicenceTypeCode.SecurityWorkerLicence: {
				this.licenceApplicationService
					.getLicenceToResume(appl.licenceAppId!)
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
			case WorkerLicenceTypeCode.ArmouredVehiclePermit:
			case WorkerLicenceTypeCode.BodyArmourPermit: {
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

	onUpdate(licence: MainLicenceResponse): void {
		switch (licence.workerLicenceTypeCode) {
			case WorkerLicenceTypeCode.SecurityWorkerLicence: {
				this.licenceApplicationService
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
			case WorkerLicenceTypeCode.ArmouredVehiclePermit:
			case WorkerLicenceTypeCode.BodyArmourPermit: {
				this.permitApplicationService
					.getPermitWithSelectionAuthenticated(licence.licenceAppId!, ApplicationTypeCode.Update, licence)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								PersonalLicenceApplicationRoutes.pathPermitAuthenticated(
									PersonalLicenceApplicationRoutes.PERMIT_UPDATE_TERMS_AUTHENTICATED
								),
								{ state: { workerLicenceTypeCode: licence.workerLicenceTypeCode } }
							);
						}),
						take(1)
					)
					.subscribe();
			}
		}
	}

	onRenew(licence: MainLicenceResponse): void {
		switch (licence.workerLicenceTypeCode) {
			case WorkerLicenceTypeCode.SecurityWorkerLicence: {
				this.licenceApplicationService
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
			case WorkerLicenceTypeCode.ArmouredVehiclePermit:
			case WorkerLicenceTypeCode.BodyArmourPermit: {
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
										workerLicenceTypeCode: licence.workerLicenceTypeCode,
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
}
