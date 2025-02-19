import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApplicationTypeCode, LicenceStatusCode, ServiceTypeCode } from '@app/api/models';
import {
	CommonApplicationService,
	MainApplicationResponse,
	MainLicenceResponse,
} from '@app/core/services/common-application.service';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { UtilService } from '@app/core/services/util.service';
import { GuideDogServiceDogRoutes } from '@app/modules/guide-dog-service-dog/guide-dog-service-dog-routes';
import { forkJoin, Observable, take, tap } from 'rxjs';

@Component({
	selector: 'app-gdsd-licence-main',
	template: `
		<section class="step-section" *ngIf="results$ | async">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-12">
							<h2 class="fs-3 mt-2">Guide Dog & Service Dog Certifications</h2>
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

					<div class="summary-card-section mt-4 mb-3 px-4 py-3" *ngIf="!activeGdsdRetiredExist">
						<div class="row">
							<div class="col-xl-6 col-lg-6">
								<div class="text-data">You don't have an active retired service dog certification.</div>
							</div>
							<div class="col-xl-6 col-lg-6 text-end">
								<button
									mat-flat-button
									color="primary"
									class="large mt-2 mt-lg-0"
									(click)="onNewRetiredServiceDog()"
									aria-label="Apply for a New GDSD Team Certification"
									*ngIf="!applicationIsInProgress"
								>
									<mat-icon>add</mat-icon>Apply for a New Retired Service Dog Certification
								</button>
							</div>
						</div>
					</div>

					<app-form-licence-list-expired
						title="Expired Licences"
						[expiredLicences]="expiredLicencesList"
					></app-form-licence-list-expired>

					<div class="summary-card-section mt-4 mb-3 px-4 py-3" *ngIf="!activeGdsdTeamExist">
						<div class="row">
							<div class="col-xl-6 col-lg-6">
								<div class="text-data">You don't have an active guide dogs/service dogs team certification.</div>
							</div>
							<div class="col-xl-6 col-lg-6 text-end">
								<button
									mat-flat-button
									color="primary"
									class="large mt-2 mt-lg-0"
									(click)="onNewGuideDogServiceDogTeam()"
								>
									<mat-icon>add</mat-icon>Apply for a New GDSD Team Certification
								</button>
							</div>
						</div>
					</div>
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

	activeGdsdRetiredExist = false;
	activeGdsdTeamExist = false;

	applicationsDataSource: MatTableDataSource<MainApplicationResponse> = new MatTableDataSource<MainApplicationResponse>(
		[]
	);

	constructor(
		private router: Router,
		private utilService: UtilService,
		private commonApplicationService: CommonApplicationService,
		private gdsdApplicationService: GdsdApplicationService
	) {}

	ngOnInit(): void {
		this.gdsdApplicationService.reset(); // prevent back button into wizard

		this.commonApplicationService.setApplicationTitle();

		this.loadData();
	}

	onNewGuideDogServiceDogTeam(): void {
		this.gdsdApplicationService
			.createNewLicenceAuthenticated(ServiceTypeCode.GdsdTeamCertification)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						GuideDogServiceDogRoutes.pathGdsdAuthenticated(GuideDogServiceDogRoutes.GDSD_APPLICATION_NEW_AUTHENTICATED)
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onNewRetiredServiceDog(): void {
		// this.router.navigateByUrl(
		// 	GuideDogServiceDogRoutes.pathGdsdAnonymous(GuideDogServiceDogRoutes.GDSD_APPLICATION_TYPE_ANONYMOUS)
		// );
	}

	onResume(appl: MainApplicationResponse): void {
		this.gdsdApplicationService
			.getGdsdToResume(appl.licenceAppId!)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						GuideDogServiceDogRoutes.pathGdsdAuthenticated(GuideDogServiceDogRoutes.GDSD_APPLICATION_NEW_AUTHENTICATED)
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onRenew(licence: MainLicenceResponse): void {
		// switch (licence.serviceTypeCode) {
		// 	case ServiceTypeCode.GdsdTeamCertification: {
		this.gdsdApplicationService
			.getLicenceWithSelectionAuthenticated(ApplicationTypeCode.Renewal, licence)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						GuideDogServiceDogRoutes.pathGdsdAuthenticated(
							GuideDogServiceDogRoutes.GDSD_APPLICATION_RENEWAL_AUTHENTICATED
						)
					);
				}),
				take(1)
			)
			.subscribe();
		// 	break;
		// }
		// case ServiceTypeCode.RetiredServiceDogCertification:
		// case ServiceTypeCode.DogTrainerCertification: {
		// 	// TODO renewal
		// }
		// }
	}

	onReplace(licence: MainLicenceResponse): void {
		// switch (licence.serviceTypeCode) {
		// case ServiceTypeCode.GdsdTeamCertification: {
		this.gdsdApplicationService
			.getLicenceWithSelectionAuthenticated(ApplicationTypeCode.Replacement, licence)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						GuideDogServiceDogRoutes.pathGdsdAuthenticated(
							GuideDogServiceDogRoutes.GDSD_APPLICATION_REPLACEMENT_AUTHENTICATED
						)
					);
				}),
				take(1)
			)
			.subscribe();
		// break;
		// }
		// case ServiceTypeCode.RetiredServiceDogCertification:
		// case ServiceTypeCode.DogTrainerCertification: {
		// 	// TODO replace
		// }
		// }
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
				// TODO gdsd uncomment
				// this.applicationIsInProgress = this.commonApplicationService.getApplicationIsInProgress(userGdsdApplicationsList);
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
				this.activeGdsdTeamExist = activeGdsdTeamExist;
				[this.warningMessages, this.errorMessages] =
					this.commonApplicationService.getMainWarningsAndErrorPersonalLicence(
						userGdsdApplicationsList,
						activeLicencesList
					);
				this.activeLicencesList = activeLicencesList;
				this.expiredLicencesList = expiredLicencesList;
			})
		);
	}
}
