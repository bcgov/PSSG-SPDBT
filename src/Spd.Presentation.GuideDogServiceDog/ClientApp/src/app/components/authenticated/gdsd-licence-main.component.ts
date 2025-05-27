import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApplicationTypeCode, LicenceStatusCode, ServiceTypeCode } from '@app/api/models';
import { AppRoutes } from '@app/app.routes';
import {
	CommonApplicationService,
	MainApplicationResponse,
	MainLicenceResponse,
} from '@app/core/services/common-application.service';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { UtilService } from '@app/core/services/util.service';
import { forkJoin, Observable, take, tap } from 'rxjs';

@Component({
	selector: 'app-gdsd-licence-main',
	template: `
		<section class="step-section" *ngIf="results$ | async">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-12">
							<h2 class="fs-3 mt-2">Guide Dog and Service Dog Certifications</h2>
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

					<app-gdsd-licence-main-applications-list
						[applicationsDataSource]="applicationsDataSource"
						[applicationIsInProgress]="applicationIsInProgress"
						(resumeApplication)="onResume($event)"
					></app-gdsd-licence-main-applications-list>

					<app-gdsd-licence-main-licences-list
						[activeLicences]="activeLicencesList"
						[applicationIsInProgress]="applicationIsInProgress"
						(replaceLicence)="onReplace($event)"
						(renewLicence)="onRenew($event)"
					></app-gdsd-licence-main-licences-list>

					<div class="summary-card-section mt-4 mb-3 px-4 py-3" *ngIf="!activeOrRenewableGdsdTeamExist">
						<div class="row">
							<div [ngClass]="applicationIsInProgress ? 'col-12' : 'col-xl-6 col-lg-6'">
								<div class="text-data">You don't have an active guide dog and service dog team certification.</div>
							</div>
							<div class="col-xl-6 col-lg-6 text-end" *ngIf="!applicationIsInProgress">
								<button
									mat-flat-button
									color="primary"
									class="large mt-2 mt-lg-0"
									(click)="onNewGuideDogServiceDogTeam()"
								>
									<mat-icon>add</mat-icon>Apply for a New GDSD Team Certification
								</button>
							</div>
							<div class="col-12 mt-3" *ngIf="applicationIsInProgress">
								<app-alert type="info" icon="info">
									A guide dog and service dog team certification cannot be created while an application is in progress.
								</app-alert>
							</div>
						</div>
					</div>

					<div class="summary-card-section mt-4 mb-3 px-4 py-3" *ngIf="!activeOrRenewableRetiredDogExist">
						<div class="row">
							<div [ngClass]="applicationIsInProgress ? 'col-12' : 'col-xl-6 col-lg-6'">
								<div class="text-data">You don't have an active retired dog certification.</div>
							</div>
							<div class="col-xl-6 col-lg-6 text-end" *ngIf="!applicationIsInProgress">
								<button
									mat-flat-button
									color="primary"
									class="large mt-2 mt-lg-0"
									(click)="onNewRetiredServiceDog()"
									aria-label="Apply for a New GDSD Team Certification"
								>
									<mat-icon>add</mat-icon>Apply for a New Retired Dog Certification
								</button>
							</div>
							<div class="col-12 mt-3" *ngIf="applicationIsInProgress">
								<app-alert type="info" icon="info">
									A retired dog certification cannot be created while an application is in progress.
								</app-alert>
							</div>
						</div>
					</div>

					<app-form-licence-list-expired
						[expiredLicences]="expiredLicencesList"
						(renewLicence)="onRenew($event)"
					></app-form-licence-list-expired>
				</div>
			</div>
		</section>
	`,
	styles: [],
	standalone: false,
})
export class GdsdLicenceMainComponent implements OnInit {
	results$!: Observable<any>;
	applicationIsInProgress = false;

	warningMessages: Array<string> = [];
	errorMessages: Array<string> = [];

	activeLicencesList: Array<MainLicenceResponse> = [];
	expiredLicencesList: Array<MainLicenceResponse> = [];

	activeOrRenewableRetiredDogExist = false;
	activeOrRenewableGdsdTeamExist = false;

	applicationsDataSource: MatTableDataSource<MainApplicationResponse> = new MatTableDataSource<MainApplicationResponse>(
		[]
	);

	constructor(
		private router: Router,
		private utilService: UtilService,
		private commonApplicationService: CommonApplicationService,
		private gdsdTeamApplicationService: GdsdTeamApplicationService,
		private retiredDogApplicationService: RetiredDogApplicationService
	) {}

	ngOnInit(): void {
		this.gdsdTeamApplicationService.reset(); // prevent back button into wizard

		this.commonApplicationService.setGdsdApplicationTitle();

		this.loadData();
	}

	onNewGuideDogServiceDogTeam(): void {
		this.gdsdTeamApplicationService
			.createNewApplAuthenticated(ServiceTypeCode.GdsdTeamCertification)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(AppRoutes.pathGdsdAuthenticated(AppRoutes.GDSD_TEAM_NEW_AUTHENTICATED));
				}),
				take(1)
			)
			.subscribe();
	}

	onNewRetiredServiceDog(): void {
		this.retiredDogApplicationService
			.createNewApplAuthenticated(ServiceTypeCode.RetiredServiceDogCertification)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(AppRoutes.pathGdsdAuthenticated(AppRoutes.RETIRED_DOG_NEW_AUTHENTICATED));
				}),
				take(1)
			)
			.subscribe();
	}

	onResume(appl: MainApplicationResponse): void {
		switch (appl.serviceTypeCode) {
			case ServiceTypeCode.GdsdTeamCertification: {
				this.gdsdTeamApplicationService
					.getGdsdToResume(appl.licenceAppId!)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(AppRoutes.pathGdsdAuthenticated(AppRoutes.GDSD_TEAM_NEW_AUTHENTICATED));
						}),
						take(1)
					)
					.subscribe();
				break;
			}
			case ServiceTypeCode.RetiredServiceDogCertification: {
				this.retiredDogApplicationService
					.getRdToResume(appl.licenceAppId!)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(AppRoutes.pathGdsdAuthenticated(AppRoutes.RETIRED_DOG_NEW_AUTHENTICATED));
						}),
						take(1)
					)
					.subscribe();
			}
		}
	}

	onRenew(licence: MainLicenceResponse): void {
		switch (licence.serviceTypeCode) {
			case ServiceTypeCode.GdsdTeamCertification: {
				this.gdsdTeamApplicationService
					.getLicenceWithSelectionAuthenticated(ApplicationTypeCode.Renewal, licence)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(AppRoutes.pathGdsdAuthenticated(AppRoutes.GDSD_TEAM_RENEWAL_AUTHENTICATED));
						}),
						take(1)
					)
					.subscribe();
				break;
			}
			case ServiceTypeCode.RetiredServiceDogCertification: {
				this.retiredDogApplicationService
					.getLicenceWithSelectionAuthenticated(ApplicationTypeCode.Renewal, licence)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(AppRoutes.pathGdsdAuthenticated(AppRoutes.RETIRED_DOG_RENEWAL_AUTHENTICATED));
						}),
						take(1)
					)
					.subscribe();
				break;
			}
		}
	}

	onReplace(licence: MainLicenceResponse): void {
		switch (licence.serviceTypeCode) {
			case ServiceTypeCode.GdsdTeamCertification: {
				this.gdsdTeamApplicationService
					.getLicenceWithSelectionAuthenticated(ApplicationTypeCode.Replacement, licence)
					.pipe(
						tap((_resp: any) => {
							const originalPhotoOfYourselfExpired = !!this.gdsdTeamApplicationService.gdsdTeamModelFormGroup.get(
								'originalLicenceData.originalPhotoOfYourselfExpired'
							)?.value;

							licence.originalPhotoOfYourselfExpired = originalPhotoOfYourselfExpired;

							// User cannot continue with this flow if the photograph of yourself is missing
							if (originalPhotoOfYourselfExpired) {
								this.gdsdTeamApplicationService.reset();
								return;
							}

							this.router.navigateByUrl(AppRoutes.pathGdsdAuthenticated(AppRoutes.GDSD_TEAM_REPLACEMENT_AUTHENTICATED));
						}),
						take(1)
					)
					.subscribe();
				break;
			}
			case ServiceTypeCode.RetiredServiceDogCertification: {
				this.retiredDogApplicationService
					.getLicenceWithSelectionAuthenticated(ApplicationTypeCode.Replacement, licence)
					.pipe(
						tap((_resp: any) => {
							const originalPhotoOfYourselfExpired = !!this.retiredDogApplicationService.retiredDogModelFormGroup.get(
								'originalLicenceData.originalPhotoOfYourselfExpired'
							)?.value;

							licence.originalPhotoOfYourselfExpired = originalPhotoOfYourselfExpired;

							// User cannot continue with this flow if the photograph of yourself is missing
							if (originalPhotoOfYourselfExpired) {
								this.retiredDogApplicationService.reset();
								return;
							}

							this.router.navigateByUrl(
								AppRoutes.pathGdsdAuthenticated(AppRoutes.RETIRED_DOG_REPLACEMENT_AUTHENTICATED)
							);
						}),
						take(1)
					)
					.subscribe();
				break;
			}
		}
	}

	private loadData(): void {
		this.results$ = forkJoin([
			this.commonApplicationService.userGdsdLicencesList(),
			this.commonApplicationService.userGdsdApplicationsList(),
		]).pipe(
			tap((resps: Array<any>) => {
				const userGdsdLicencesList: Array<MainLicenceResponse> = resps[0];
				const userGdsdApplicationsList: Array<MainApplicationResponse> = resps[1];

				// Gdsd Applications
				this.applicationsDataSource = new MatTableDataSource(userGdsdApplicationsList ?? []);
				this.applicationIsInProgress =
					this.commonApplicationService.getApplicationIsInProgress(userGdsdApplicationsList);
				// Gdsd Licences
				const activeLicencesList = userGdsdLicencesList.filter((item: MainLicenceResponse) =>
					this.utilService.isLicenceActive(item.licenceStatusCode)
				);
				const expiredLicencesList = userGdsdLicencesList.filter(
					(item: MainLicenceResponse) => item.licenceStatusCode === LicenceStatusCode.Expired
				);
				// Set flags that determine if NEW licence can be created
				let activeGdsdTeamExist =
					activeLicencesList.findIndex(
						(item: MainLicenceResponse) => item.serviceTypeCode === ServiceTypeCode.GdsdTeamCertification
					) >= 0;
				if (!activeGdsdTeamExist) {
					activeGdsdTeamExist =
						userGdsdApplicationsList.findIndex(
							(item: MainApplicationResponse) => item.serviceTypeCode === ServiceTypeCode.GdsdTeamCertification
						) >= 0;
				}
				let activeRetiredDogExist =
					activeLicencesList.findIndex(
						(item: MainLicenceResponse) => item.serviceTypeCode === ServiceTypeCode.RetiredServiceDogCertification
					) >= 0;
				if (!activeRetiredDogExist) {
					activeRetiredDogExist =
						userGdsdApplicationsList.findIndex(
							(item: MainApplicationResponse) => item.serviceTypeCode === ServiceTypeCode.RetiredServiceDogCertification
						) >= 0;
				}

				this.activeOrRenewableGdsdTeamExist = activeGdsdTeamExist;
				this.activeOrRenewableRetiredDogExist = activeRetiredDogExist;

				if (activeGdsdTeamExist) {
					// Since there is an active licence or application, make sure expired licence renewal is false
					expiredLicencesList
						.filter((item: MainLicenceResponse) => item.serviceTypeCode === ServiceTypeCode.GdsdTeamCertification)
						.forEach((item: MainLicenceResponse) => {
							item.isExpiredLicenceRenewable = false;
						});
				} else {
					// check if renewable expired licence exists
					this.activeOrRenewableGdsdTeamExist =
						expiredLicencesList.findIndex(
							(item: MainLicenceResponse) =>
								item.serviceTypeCode === ServiceTypeCode.GdsdTeamCertification && item.isExpiredLicenceRenewable
						) >= 0;
				}

				if (activeRetiredDogExist) {
					// Since there is an active licence or application, make sure expired licence renewal is false
					expiredLicencesList
						.filter(
							(item: MainLicenceResponse) => item.serviceTypeCode === ServiceTypeCode.RetiredServiceDogCertification
						)
						.forEach((item: MainLicenceResponse) => {
							item.isExpiredLicenceRenewable = false;
						});
				} else {
					// check if renewable expired licence exists
					this.activeOrRenewableRetiredDogExist =
						expiredLicencesList.findIndex(
							(item: MainLicenceResponse) =>
								item.serviceTypeCode === ServiceTypeCode.RetiredServiceDogCertification &&
								item.isExpiredLicenceRenewable
						) >= 0;
				}

				[this.warningMessages, this.errorMessages] = this.commonApplicationService.getMainWarningsAndErrorLicence(
					userGdsdApplicationsList,
					activeLicencesList
				);
				this.activeLicencesList = activeLicencesList;
				this.expiredLicencesList = expiredLicencesList;
			})
		);
	}
}
