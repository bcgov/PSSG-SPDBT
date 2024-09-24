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
import { Observable, forkJoin, switchMap, take, tap } from 'rxjs';
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

					<div class="row mb-4" *ngIf="showManageMembersAndEmployees">
						<div class="col-12 text-end">
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

					<ng-container *ngFor="let msg of errorMessages; let i = index">
						<app-alert type="danger" icon="error">
							<div [innerHTML]="msg"></div>
						</app-alert>
					</ng-container>

					<ng-container *ngIf="isControllingMemberWarning">
						<app-alert type="warning" icon="warning">
							<p>Your Business Licence application has outstanding controlling member invitations.</p>
							<p>Click on 'Manage Controlling Members and Employees' to see the status of each of the members.</p>
						</app-alert>
					</ng-container>

					<ng-container *ngFor="let msg of warningMessages; let i = index">
						<app-alert type="warning" icon="warning">
							<div [innerHTML]="msg"></div>
						</app-alert>
					</ng-container>

					<app-applications-list-current
						[applicationsDataSource]="applicationsDataSource"
						[isControllingMemberWarning]="isControllingMemberWarning"
						(resumeApplication)="onResume($event)"
					></app-applications-list-current>

					<app-business-licence-list-current
						[activeLicences]="activeLicencesList"
						[applicationIsInProgress]="applicationIsInProgress"
						[isSoleProprietor]="isSoleProprietor"
						[lostLicenceDaysText]="lostLicenceDaysText"
						(replaceLicence)="onReplace($event)"
						(updateLicence)="onUpdate($event)"
						(renewLicence)="onRenewal($event)"
					></app-business-licence-list-current>

					<app-licence-list-expired [expiredLicences]="expiredLicencesList"></app-licence-list-expired>

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

	showManageMembersAndEmployees = false;
	isControllingMemberWarning = false;
	applicationIsInProgress = true;
	businessProfileLabel = '';
	lostLicenceDaysText = 'TBD';

	activeLicenceExist = false;

	isSoleProprietor = false;

	workerLicenceTypeCodes = WorkerLicenceTypeCode;

	activeLicencesList: Array<MainLicenceResponse> = [];
	expiredLicencesList: Array<MainLicenceResponse> = [];

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

		this.results$ = this.businessApplicationService.getBusinessProfile().pipe(
			switchMap((businessProfile: BizProfileResponse) => {
				return forkJoin([
					this.commonApplicationService.userBusinessLicencesList(businessProfile),
					this.commonApplicationService.userBusinessApplicationsList(),
				]).pipe(
					tap((resps: Array<any>) => {
						const businessLicencesList: Array<MainLicenceResponse> = resps[0];
						const businessApplicationsList: Array<MainApplicationResponse> = resps[1];

						// console.debug('businessLicencesList', businessLicencesList);
						// console.debug('businessApplicationsList', businessApplicationsList);
						// console.debug('businessProfile', businessProfile);

						this.isSoleProprietor = this.businessApplicationService.isSoleProprietor(businessProfile.bizTypeCode!);

						// Only show the manage members and employees when an application or licence exist.
						this.showManageMembersAndEmployees = this.isSoleProprietor
							? false
							: businessApplicationsList.length > 0 || businessLicencesList.length > 0;

						// User Licences/Permits
						const activeBusinessLicencesList = businessLicencesList.filter(
							(item: MainLicenceResponse) => item.licenceStatusCode === LicenceStatusCode.Active
						);

						this.expiredLicencesList = businessLicencesList.filter(
							(item: MainLicenceResponse) => item.licenceStatusCode === LicenceStatusCode.Expired
						);

						// User Licence/Permit Applications
						this.applicationsDataSource = new MatTableDataSource(businessApplicationsList ?? []);
						this.applicationIsInProgress =
							this.commonApplicationService.getApplicationIsInProgress(businessApplicationsList);

						// Set flags that determine if NEW licences/permits can be created
						let activeLicenceExist = activeBusinessLicencesList.length > 0;
						if (!activeLicenceExist) {
							activeLicenceExist = businessApplicationsList.length > 0;
						}
						this.activeLicenceExist = activeLicenceExist;

						[this.warningMessages, this.errorMessages, this.isControllingMemberWarning] =
							this.commonApplicationService.getMainWarningsAndErrorBusinessLicence(
								businessApplicationsList,
								activeBusinessLicencesList,
								!this.isSoleProprietor
							);

						this.activeLicencesList = activeBusinessLicencesList;

						this.businessProfileLabel = this.applicationIsInProgress ? 'View Business Profile' : 'Business Profile';
					})
				);
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

	onKeydownManageMembersAndEmployees(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onManageMembersAndEmployees();
	}

	onResume(appl: MainApplicationResponse): void {
		this.businessApplicationService
			.getBusinessLicenceToResume(appl.licenceAppId!)
			.pipe(
				tap((resp: any) => {
					// return to the swl sole proprietor / business licence combo flow
					if (resp.soleProprietorSWLAppId) {
						this.router.navigate([
							BusinessLicenceApplicationRoutes.MODULE_PATH,
							BusinessLicenceApplicationRoutes.BUSINESS_NEW_SOLE_PROPRIETOR,
						]);
						return;
					}

					this.router.navigateByUrl(
						BusinessLicenceApplicationRoutes.pathBusinessLicence(
							BusinessLicenceApplicationRoutes.BUSINESS_LICENCE_APP_PROFILE
						),
						{ state: { applicationTypeCode: resp.applicationTypeData.applicationTypeCode } }
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
							BusinessLicenceApplicationRoutes.BUSINESS_LICENCE_APP_PROFILE
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
							BusinessLicenceApplicationRoutes.BUSINESS_LICENCE_APP_PROFILE
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
							BusinessLicenceApplicationRoutes.BUSINESS_LICENCE_APP_PROFILE
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
			.loadBusinessProfile()
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
