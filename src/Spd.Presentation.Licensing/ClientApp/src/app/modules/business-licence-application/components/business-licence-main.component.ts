/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApplicationPortalStatusCode, ApplicationTypeCode, BizProfileResponse, ServiceTypeCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import {
	CommonApplicationService,
	MainApplicationResponse,
	MainLicenceResponse,
} from '@app/core/services/common-application.service';
import { UtilService } from '@app/core/services/util.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { Observable, forkJoin, switchMap, take, tap } from 'rxjs';

@Component({
	selector: 'app-business-licence-main',
	template: `
		@if (results$ | async) {
			<section class="step-section">
				<div class="row">
					<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6 my-auto">
								<h2 class="fs-3">Business Licences</h2>
							</div>
							<div class="col-xl-6 col-lg-4 col-md-12">
								<div class="d-flex justify-content-end">
									@if (!isSoleProprietorAppSimultaneousFlow) {
										<button
											mat-flat-button
											color="primary"
											class="large w-auto me-2 mb-3"
											aria-label="Manage the business profile"
											(click)="onBusinessProfile()"
										>
											<mat-icon class="d-none d-md-block">storefront</mat-icon>
											{{ businessProfileLabel }}
										</button>
									}
									<button
										mat-flat-button
										color="primary"
										class="large w-auto ms-2 mb-3"
										aria-label="Manage the portal administrators"
										(click)="onPortalAdministrators()"
									>
										<mat-icon class="d-none d-md-block">people</mat-icon>
										Portal Administrators
									</button>
								</div>
							</div>
						</div>

						<mat-divider class="mat-divider-main mb-3"></mat-divider>
						@if (showManageBusinessStakeholders) {
							<div class="row">
								<div class="col-12 text-end">
									<a
										class="large"
										tabindex="0"
										(click)="onManageBusinessStakeholders()"
										(keydown)="onKeydownManageBusinessStakeholders($event)"
									>
										Controlling Members, Business Managers & Employees
									</a>
								</div>
							</div>
						}

						@if (isAlertsExist()) {
							<div class="mt-4">
								@for (msg of errorMessages; track msg; let i = $index) {
									<app-alert type="danger" icon="dangerous">
										<div [innerHTML]="msg"></div>
									</app-alert>
								}
								@if (isControllingMemberWarning) {
									<app-alert type="warning" icon="warning">
										<div>Your business licence application is pending controlling member criminal record checks.</div>
										<div class="mt-2">
											View <strong>'Controlling Members, Business Managers & Employees'</strong> to see the status of
											each of member.
										</div>
									</app-alert>
								}
								@for (msg of warningMessages; track msg; let i = $index) {
									<app-alert type="warning" icon="warning">
										<div [innerHTML]="msg"></div>
									</app-alert>
								}
							</div>
						}

						<app-business-licence-main-applications-list
							[applicationsDataSource]="applicationsDataSource"
							[isControllingMemberWarning]="isControllingMemberWarning"
							[isSoleProprietor]="isSoleProprietor"
							(resumeApplication)="onResume($event)"
							(payApplication)="onPayNow($event)"
							(cancelApplication)="onDelete($event)"
							(manageBusinessStakeholders)="onManageBusinessStakeholders()"
						></app-business-licence-main-applications-list>

						<app-business-licence-main-licence-list
							[activeLicences]="activeLicencesList"
							[applicationIsInProgress]="applicationIsInProgress"
							[isSoleProprietor]="isSoleProprietor"
							(replaceLicence)="onReplace($event)"
							(updateLicence)="onUpdate($event)"
							(renewLicence)="onRenewal($event)"
						></app-business-licence-main-licence-list>

						@if (!activeLicenceExist) {
							<div class="summary-card-section mt-4 mb-3 px-4 py-3">
								<div class="row">
									<div class="col-xl-7 col-lg-6">
										<div class="text-data">You don't have an active business licence.</div>
										<div class="d-block fw-bold mt-3 mb-2">
											Apply for a new business licence if you have never held one before or if your previous licence has
											expired.
										</div>
									</div>
									<div class="col-xl-5 col-lg-6 text-end">
										<button mat-flat-button color="primary" class="large mt-2 mt-lg-0" (click)="onNewBusinessLicence()">
											<mat-icon>add</mat-icon>Apply for a New Business Licence
										</button>
									</div>
								</div>
							</div>
						}

						<app-form-licence-list-expired [expiredLicences]="expiredLicencesList"></app-form-licence-list-expired>

						<div class="mt-4">
							<app-alert type="info" icon="info">
								Do you have a security business licence that isn’t displayed here?
								<a
									class="fw-normal"
									tabindex="0"
									aria-label="Link a current or expired licence to your account"
									(click)="onConnectToLicence()"
									(keydown)="onKeydownConnectToLicence($event)"
									>Link a current or expired licence</a
								>
								to your account.
							</app-alert>
						</div>
					</div>
				</div>
			</section>
		}
	`,
	styles: [],
	standalone: false,
})
export class BusinessLicenceMainComponent implements OnInit {
	results$!: Observable<any>;
	warningMessages: Array<string> = [];
	errorMessages: Array<string> = [];

	// these are calculated when the data is loaded
	showManageBusinessStakeholders = false;
	isControllingMemberWarning = false;
	applicationIsInProgress = true;
	applicationIsInDraftOrWaitingForPayment = false;
	businessProfileLabel = '';

	activeLicenceExist = false;

	isSoleProprietor = false;
	isSoleProprietorAppSimultaneousFlow = false;

	serviceTypeCodes = ServiceTypeCode;

	activeLicencesList: Array<MainLicenceResponse> = [];
	expiredLicencesList: Array<MainLicenceResponse> = [];

	applicationsDataSource: MatTableDataSource<MainApplicationResponse> = new MatTableDataSource<MainApplicationResponse>(
		[]
	);

	constructor(
		private router: Router,
		private dialog: MatDialog,
		private utilService: UtilService,
		private businessApplicationService: BusinessApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.businessApplicationService.reset(); // prevent back button into wizard

		this.commonApplicationService.setApplicationTitle(ServiceTypeCode.SecurityBusinessLicence);

		this.loadData();
	}

	onManageBusinessStakeholders(): void {
		const isApplExists = this.applicationIsInProgress || this.applicationIsInDraftOrWaitingForPayment;
		const isApplDraftOrWaitingForPayment = this.applicationIsInDraftOrWaitingForPayment;
		const isLicenceExists = this.activeLicencesList.length > 0;

		this.businessApplicationService
			.getBusinessStakeholders()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						BusinessLicenceApplicationRoutes.pathBusinessLicence(
							BusinessLicenceApplicationRoutes.BUSINESS_STAKEHOLDERS
						),
						{
							state: {
								isApplExists,
								isApplDraftOrWaitingForPayment,
								isLicenceExists,
							},
						}
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onKeydownManageBusinessStakeholders(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onManageBusinessStakeholders();
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
			message: 'Are you sure you want to permanently remove this application.',
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
		this.businessApplicationService
			.getBusinessLicenceApplToResume(appl.licenceAppId!, this.isSoleProprietor)
			.pipe(
				tap((resp: any) => {
					// return to the swl sole proprietor / business licence Simultaneous flow
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

	onPayNow(appl: MainApplicationResponse): void {
		this.commonApplicationService.payNowBusinessLicence(appl.licenceAppId!);
	}

	onReplace(licence: MainLicenceResponse): void {
		if (this.applicationIsInProgress) return;

		this.businessApplicationService
			.getBusinessLicenceWithSelection(ApplicationTypeCode.Replacement, licence, this.isSoleProprietor)
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
			.getBusinessLicenceWithSelection(ApplicationTypeCode.Renewal, licence, this.isSoleProprietor)
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
			.getBusinessLicenceWithSelection(ApplicationTypeCode.Update, licence, this.isSoleProprietor)
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

	onNewBusinessLicence(): void {
		const previousExpiredLicence = this.expiredLicencesList.find(
			(item: MainLicenceResponse) => item.serviceTypeCode === ServiceTypeCode.SecurityBusinessLicence
		);

		this.businessApplicationService
			.createNewBusinessLicence(previousExpiredLicence)
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

	onPortalAdministrators(): void {
		this.router.navigateByUrl(
			BusinessLicenceApplicationRoutes.pathBusinessLicence(BusinessLicenceApplicationRoutes.PORTAL_ADMINISTRATORS)
		);
	}

	onConnectToLicence(): void {
		this.router.navigateByUrl(
			BusinessLicenceApplicationRoutes.pathBusinessLicence(BusinessLicenceApplicationRoutes.LICENCE_LINK)
		);
	}

	onKeydownConnectToLicence(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onConnectToLicence();
	}

	private loadData(): void {
		this.results$ = this.businessApplicationService.getBusinessProfile().pipe(
			switchMap((businessProfile: BizProfileResponse) => {
				this.isSoleProprietor = this.businessApplicationService.isSoleProprietor(businessProfile.bizTypeCode!);

				return forkJoin([
					this.commonApplicationService.userBusinessLicencesList(businessProfile),
					this.commonApplicationService.userBusinessApplicationsList(this.isSoleProprietor),
				]).pipe(
					tap((resps: Array<any>) => {
						const businessLicencesList: Array<MainLicenceResponse> = resps[0];
						const businessApplicationsList: Array<MainApplicationResponse> = resps[1];

						// console.debug('businessLicencesList', businessLicencesList);
						// console.debug('businessApplicationsList', businessApplicationsList);
						// console.debug('businessProfile', businessProfile);

						this.isSoleProprietorAppSimultaneousFlow =
							businessApplicationsList.length > 0 ? (businessApplicationsList[0].isSimultaneousFlow ?? false) : false;

						// User Licences/Permits
						const activeBusinessLicencesList = businessLicencesList.filter((item: MainLicenceResponse) =>
							this.utilService.isLicenceActive(item.licenceStatusCode)
						);

						// Only show the manage members and employees when an application or licence exist and is not Sole Proprietor.
						this.showManageBusinessStakeholders = this.isSoleProprietor ? false : businessApplicationsList.length === 0;

						this.expiredLicencesList = this.commonApplicationService.userExpiredLicences(businessLicencesList);

						// User Licence/Permit Applications
						this.applicationsDataSource = new MatTableDataSource(businessApplicationsList ?? []);
						this.applicationIsInProgress =
							this.commonApplicationService.getApplicationIsInProgress(businessApplicationsList);
						this.applicationIsInDraftOrWaitingForPayment =
							this.commonApplicationService.getApplicationIsInDraftOrWaitingForPayment(businessApplicationsList);

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
	}

	isAlertsExist(): boolean {
		return this.isControllingMemberWarning || this.warningMessages.length > 0 || this.errorMessages.length > 0;
	}
}
