/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApplicationTypeCode, BizProfileResponse, LicenceStatusCode, WorkerLicenceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import {
	ApplicationService,
	MainApplicationResponse,
	MainLicenceResponse,
} from '@app/core/services/application.service';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { ConfigService } from '@app/core/services/config.service';
import { Observable, forkJoin, take, tap } from 'rxjs';
import { BusinessLicenceApplicationRoutes } from '../business-licence-application-routing.module';

@Component({
	selector: 'app-business-user-applications',
	template: `
		<section class="step-section" *ngIf="results$ | async">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Business Licences</h2>
						</div>

						<div class="col-xl-6 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								<button mat-flat-button color="primary" class="large w-auto me-2 mb-3" (click)="onBusinessProfile()">
									<mat-icon>storefront</mat-icon>
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

					<app-applications-list-current
						[applicationsDataSource]="applicationsDataSource"
						(resumeApplication)="onResume($event)"
					></app-applications-list-current>

					<app-business-licence-list-current
						[activeLicences]="activeLicences"
						[applicationIsInProgress]="applicationIsInProgress"
						[isSoleProprietor]="isSoleProprietor"
						[lostLicenceDaysText]="lostLicenceDaysText"
						(manageControllingMembers)="onManageMembersAndEmployees()"
						(replaceLicence)="onReplace($event)"
						(updateLicence)="onUpdate($event)"
						(renewLicence)="onRenewal($event)"
					></app-business-licence-list-current>

					<app-licence-list-expired [expiredLicences]="expiredLicences"></app-licence-list-expired>

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
		`,
	],
})
export class BusinessUserApplicationsComponent implements OnInit {
	constants = SPD_CONSTANTS;

	results$!: Observable<any>;
	warningMessages: Array<string> = [];
	errorMessages: Array<string> = [];

	applicationIsInProgress = true;
	businessProfileLabel = '';
	lostLicenceDaysText = 'TBD';

	activeLicenceExist = false;

	isSoleProprietor = false;

	workerLicenceTypeCodes = WorkerLicenceTypeCode;

	activeLicences: Array<MainLicenceResponse> = [];
	expiredLicences: Array<MainLicenceResponse> = [];

	applicationsDataSource: MatTableDataSource<MainApplicationResponse> = new MatTableDataSource<MainApplicationResponse>(
		[]
	);

	constructor(
		private router: Router,
		private configService: ConfigService,
		private businessApplicationService: BusinessApplicationService,
		private commonApplicationService: ApplicationService
	) {}

	ngOnInit(): void {
		this.lostLicenceDaysText = this.configService.configs?.replacementProcessingTime ?? 'TBD';

		this.commonApplicationService.setApplicationTitle();

		this.results$ = forkJoin([
			this.commonApplicationService.userBusinessLicencesList(),
			this.commonApplicationService.userBusinessApplicationsList(),
			this.businessApplicationService.getBusinessProfile(),
		]).pipe(
			tap((resps: Array<any>) => {
				const businessLicencesList: Array<MainLicenceResponse> = resps[0];
				const businessApplicationsList: Array<MainApplicationResponse> = resps[1];
				const businessProfile: BizProfileResponse = resps[2];

				// console.debug('businessLicencesList', businessLicencesList);
				// console.debug('businessApplicationsList', businessApplicationsList);
				// console.debug('businessProfile', businessProfile);

				this.isSoleProprietor = this.businessApplicationService.isSoleProprietor(businessProfile.bizTypeCode!);

				// User Licences/Permits
				const activeLicences = businessLicencesList.filter(
					(item: MainLicenceResponse) => item.licenceStatusCode === LicenceStatusCode.Active
				);

				this.expiredLicences = businessLicencesList.filter(
					(item: MainLicenceResponse) => item.licenceStatusCode === LicenceStatusCode.Expired
				);

				// User Licence/Permit Applications
				this.applicationsDataSource = new MatTableDataSource(businessApplicationsList ?? []);
				this.applicationIsInProgress =
					this.commonApplicationService.getApplicationIsInProgress(businessApplicationsList);

				// Set flags that determine if NEW licences/permits can be created
				let activeLicenceExist = activeLicences.length > 0;
				if (!activeLicenceExist) {
					activeLicenceExist = businessApplicationsList.length > 0;
				}
				this.activeLicenceExist = activeLicenceExist;

				[this.warningMessages, this.errorMessages] = this.commonApplicationService.getMainWarningsAndError(
					businessApplicationsList,
					activeLicences
				);

				this.activeLicences = activeLicences;

				this.businessProfileLabel = this.applicationIsInProgress ? 'View Business Profile' : 'Business Profile';
			})
		);

		this.commonApplicationService.setApplicationTitle(WorkerLicenceTypeCode.SecurityBusinessLicence);
	}

	onManageMembersAndEmployees(): void {
		this.businessApplicationService
			.getMembersAndEmployees()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						BusinessLicenceApplicationRoutes.pathBusinessLicence(
							BusinessLicenceApplicationRoutes.BUSINESS_CONTROLLING_MEMBERS_AND_EMPLOYEES
						)
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onResume(appl: MainApplicationResponse): void {
		this.businessApplicationService
			.getBusinessLicenceToResume(appl.licenceAppId!)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						BusinessLicenceApplicationRoutes.pathBusinessLicence(
							BusinessLicenceApplicationRoutes.BUSINESS_LICENCE_USER_PROFILE
						),
						{ state: { applicationTypeCode: _resp.applicationTypeData.applicationTypeCode } }
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onReplace(licence: MainLicenceResponse): void {
		if (this.applicationIsInProgress) return;

		this.businessApplicationService
			.getBusinessLicenceWithSelection(ApplicationTypeCode.Replacement, licence)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						BusinessLicenceApplicationRoutes.pathBusinessLicence(
							BusinessLicenceApplicationRoutes.BUSINESS_LICENCE_USER_PROFILE
						),
						{ state: { applicationTypeCode: ApplicationTypeCode.Replacement } }
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onRenewal(licence: MainLicenceResponse): void {
		if (this.applicationIsInProgress) return;

		this.businessApplicationService
			.getBusinessLicenceWithSelection(ApplicationTypeCode.Renewal, licence)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						BusinessLicenceApplicationRoutes.pathBusinessLicence(
							BusinessLicenceApplicationRoutes.BUSINESS_LICENCE_USER_PROFILE
						),
						{ state: { applicationTypeCode: ApplicationTypeCode.Renewal } }
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onUpdate(licence: MainLicenceResponse): void {
		if (this.applicationIsInProgress) return;

		this.businessApplicationService
			.getBusinessLicenceWithSelection(ApplicationTypeCode.Update, licence)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						BusinessLicenceApplicationRoutes.pathBusinessLicence(
							BusinessLicenceApplicationRoutes.BUSINESS_LICENCE_UPDATE_TERMS
						)
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onCreateNew(): void {
		this.businessApplicationService
			.createNewBusinessLicenceWithProfile(ApplicationTypeCode.New)
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						BusinessLicenceApplicationRoutes.pathBusinessLicence(
							BusinessLicenceApplicationRoutes.BUSINESS_LICENCE_USER_PROFILE
						),
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
						BusinessLicenceApplicationRoutes.pathBusinessLicence(BusinessLicenceApplicationRoutes.BUSINESS_PROFILE),
						{ state: { isReadonly: this.applicationIsInProgress } }
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onBusinessManagers(): void {
		this.router.navigateByUrl(
			BusinessLicenceApplicationRoutes.pathBusinessLicence(BusinessLicenceApplicationRoutes.BUSINESS_MANAGERS)
		);
	}
}