import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApplicationStatisticsResponse, ContactAuthorizationTypeCode, OrgUserResponse } from 'src/app/api/models';
import { ApplicationService, OrgUserService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { ApplicationPortalStatisticsTypeCode } from 'src/app/core/code-types/application-portal-statistics-type.model';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-crrp-home',
	template: `
		<app-crrp-header></app-crrp-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xxl-8 col-xl-10 col-lg-10 col-md-12 col-sm-12">
					<app-applications-banner></app-applications-banner>
				</div>
			</div>

			<div class="row">
				<div class="col-xxl-8 col-xl-10 col-lg-10 col-md-12 col-sm-12">
					<div class="row box-row gy-4">
						<div class="col-xxl-4 col-xl-6 col-lg-12 col-md-12 col-sm-12">
							<div
								class="box mx-auto"
								tabindex="-1"
								[routerLink]="[crrpRoutes.path(crrpRoutes.CRIMINAL_RECORD_CHECKS)]"
							>
								<div class="box__image">
									<img class="box__image__item" src="./assets/dashboard/new_screening.png" alt="New Screening" />
								</div>
								<div class="box__text">
									<div class="d-flex align-items-start flex-column box-text-height">
										<div class="mb-auto p-2 pb-0"><h4 class="mb-0">Request a new criminal record check</h4></div>
										<div class="w-100 p-2 pt-0">
											<div class="d-grid gap-2 d-md-flex justify-content-between">
												<div class="mb-0">Start a new check for one or more applicants</div>
												<mat-icon class="ms-auto box__text__icon d-none d-md-block">arrow_forward_ios</mat-icon>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="col-xxl-4 col-xl-6 col-lg-12 col-md-12 col-sm-12">
							<div class="box mx-auto" tabindex="-1" [routerLink]="[crrpRoutes.path(crrpRoutes.APPLICATION_STATUSES)]">
								<div class="box__image">
									<img class="box__image__item" src="./assets/dashboard/screening_status.png" alt="Screening Status" />
								</div>
								<div class="box__text">
									<div class="d-flex align-items-start flex-column box-text-height">
										<div class="mb-auto p-2 pb-0"><h4 class="mb-0">View application status</h4></div>
										<div class="w-100 p-2 pt-0">
											<div class="d-grid gap-2 d-md-flex justify-content-between">
												<div class="mb-0">See your applicants' criminal record check progress</div>
												<mat-icon class="ms-auto box__text__icon d-none d-md-block">arrow_forward_ios</mat-icon>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="col-xxl-4 col-xl-6 col-lg-12 col-md-12 col-sm-12">
							<div class="box mx-auto" tabindex="-1" [routerLink]="[crrpRoutes.path(crrpRoutes.EXPIRING_CHECKS)]">
								<div class="box__image">
									<img
										class="box__image__item"
										src="./assets/dashboard/expired_screenings.png"
										alt="Expired Screenings"
									/>
								</div>
								<div class="box__text">
									<div class="d-flex align-items-start flex-column box-text-height">
										<div class="mb-auto p-2 pb-0"><h4 class="mb-0">View expiring criminal record checks</h4></div>
										<div class="w-100 p-2 pt-0">
											<div class="d-grid gap-2 d-md-flex justify-content-between">
												<div class="mb-0">See clearances that are expiring soon</div>
												<mat-icon class="ms-auto box__text__icon d-none d-md-block">arrow_forward_ios</mat-icon>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div
							class="col-xxl-4 col-xl-6 col-lg-12 col-md-12 col-sm-12"
							*ngIf="authUserService.bceidUserOrgProfile?.isNotVolunteerOrg ?? false"
						>
							<div class="box mx-auto" tabindex="-1" [routerLink]="[crrpRoutes.path(crrpRoutes.PAYMENTS)]">
								<div class="box__image">
									<img
										class="box__image__item"
										src="./assets/dashboard/outstanding_payments.png"
										alt="Outstanding Payments"
									/>
								</div>
								<div class="box__text">
									<div class="d-flex align-items-start flex-column box-text-height">
										<div class="mb-auto p-2 pb-0"><h4 class="mb-0">Payments</h4></div>
										<div class="w-100 p-2 pt-0">
											<div class="d-grid gap-2 d-md-flex justify-content-between">
												<div class="mb-0">Manage and view payments</div>
												<mat-icon class="ms-auto box__text__icon d-none d-md-block">arrow_forward_ios</mat-icon>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="col-xxl-4 col-xl-6 col-lg-12 col-md-12 col-sm-12">
							<div class="box mx-auto" tabindex="-1" [routerLink]="[crrpRoutes.path(crrpRoutes.USERS)]">
								<div class="box__image">
									<img class="box__image__item" src="./assets/dashboard/authorized_users.png" alt="Users or Profile" />
								</div>
								<div class="box__text">
									<div class="d-flex align-items-start flex-column box-text-height">
										<div class="mb-auto p-2 pb-0">
											<h4 class="mb-0" *ngIf="isUserPrimary === true">Manage authorized users</h4>
											<h4 class="mb-0" *ngIf="isUserPrimary === false">Update profile</h4>
										</div>
										<div class="w-100 p-2 pt-0">
											<div class="d-grid gap-2 d-md-flex justify-content-between">
												<div class="mb-0" *ngIf="isUserPrimary === true">Add or remove team members</div>
												<div class="mb-0" *ngIf="isUserPrimary === false">Edit your personal information</div>
												<mat-icon class="ms-auto box__text__icon d-none d-md-block">arrow_forward_ios</mat-icon>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="col-xxl-4 col-xl-6 col-lg-12 col-md-12 col-sm-12">
							<div class="box mx-auto" tabindex="-1" [routerLink]="[crrpRoutes.path(crrpRoutes.IDENTITY_VERIFICATION)]">
								<div class="box__image">
									<img
										class="box__image__item"
										src="./assets/dashboard/applicant_identity.png"
										alt="Applicant Identity"
									/>
								</div>
								<div class="box__text">
									<div class="d-flex align-items-start flex-column box-text-height">
										<div class="mb-auto p-2 pb-0"><h4 class="mb-0">Confirm applicant identity</h4></div>
										<div class="w-100 p-2 pt-0">
											<div class="d-grid gap-2 d-md-flex justify-content-between">
												<div class="mb-0">See a list of applicants who required ID checks</div>
												<mat-icon class="ms-auto box__text__icon d-none d-md-block">arrow_forward_ios</mat-icon>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<ng-container *ngIf="applicationStatistics$ | async">
				<div class="row mt-4">
					<div class="col-xxl-8 col-xl-10 col-lg-10 col-md-12 col-sm-12">
						<h4>To Do</h4>
						<div class="row gy-4">
							<div
								class="col-xl-3 col-lg-6 col-md-12 col-sm-12"
								*ngIf="authUserService.bceidUserOrgProfile?.isNotVolunteerOrg ?? false"
							>
								<mat-card class="data-card data-card__payment-required">
									<mat-card-header class="data-card__header mb-2">
										<mat-card-title class="data-card__header__title">Payment Required</mat-card-title>
									</mat-card-header>
									<mat-card-content class="data-card__content">
										<p>{{ awaitingPaymentCount }} applications require payment</p>
									</mat-card-content>
									<mat-card-actions class="mt-4">
										<button
											mat-flat-button
											color="primary"
											[routerLink]="[crrpRoutes.path(crrpRoutes.PAYMENTS)]"
											aria-label="Pay now"
										>
											<mat-icon>payment</mat-icon>Pay Now
										</button>
									</mat-card-actions>
								</mat-card>
							</div>
							<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12">
								<mat-card class="data-card data-card__verification-required">
									<mat-card-header class="data-card__header data-card__verification-required__header mb-2">
										<mat-card-title class="data-card__header__title">Verification Required</mat-card-title>
									</mat-card-header>
									<mat-card-content class="data-card__content">
										<p>{{ verifyIdentityCount }} applications require ID verification</p>
									</mat-card-content>
									<mat-card-actions class="mt-4">
										<button
											mat-flat-button
											color="accent"
											[routerLink]="[crrpRoutes.path(crrpRoutes.IDENTITY_VERIFICATION)]"
										>
											<mat-icon>done</mat-icon>Verify Now
										</button>
									</mat-card-actions>
								</mat-card>
							</div>
							<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12">
								<mat-card class="data-card data-card__applications-cleared">
									<mat-card-header class="data-card__header data-card__applications-cleared__header mb-2">
										<mat-card-title class="data-card__header__title">Applications Cleared</mat-card-title>
									</mat-card-header>
									<mat-card-content class="data-card__content">
										<p>{{ completedClearedCount }} applications were cleared in the last week</p>
									</mat-card-content>
									<mat-card-actions class="mt-4">
										<button
											class="data-card__applications-cleared__button"
											mat-flat-button
											[routerLink]="[crrpRoutes.path(crrpRoutes.APPLICATION_STATUSES)]"
										>
											<mat-icon>preview</mat-icon>Review
										</button>
									</mat-card-actions>
								</mat-card>
							</div>
							<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12">
								<mat-card class="data-card data-card__applications-not-cleared">
									<mat-card-header class="data-card__header data-card__applications-not-cleared__header mb-2">
										<mat-card-title class="data-card__header__title">Applications Not Cleared</mat-card-title>
									</mat-card-header>
									<mat-card-content class="data-card__content">
										<p>{{ riskFoundCount }} applications were found at risk in the last week</p>
									</mat-card-content>
									<mat-card-actions class="mt-4">
										<button
											class="data-card__applications-not-cleared__button"
											mat-flat-button
											[routerLink]="[crrpRoutes.path(crrpRoutes.APPLICATION_STATUSES)]"
										>
											<mat-icon>preview</mat-icon>Review
										</button>
									</mat-card-actions>
								</mat-card>
							</div>
						</div>
					</div>
				</div>
			</ng-container>
		</section>
	`,
	styles: [
		`
			.box-text-height {
				height: 110px;
			}
			@media (min-width: 576px) {
				.box-text-height {
					height: 120px;
				}
			}
			@media (min-width: 768px) {
				.box-text-height {
					height: 100px;
				}
			}
			// @media (min-width: 992px) {
			// 	.box-text-height {
			// 		height: 100px;
			// 	}
			// }
			@media (min-width: 1200px) {
				.box-text-height {
					height: 140px;
				}
			}
			@media (min-width: 1400px) {
				.box-text-height {
					height: 170px;
				}
			}
			@media (min-width: 1700px) {
				.box-text-height {
					height: 130px;
				}
			}

			.box {
				cursor: pointer;
				box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
				width: 100%;
				height: 100%;
				margin-bottom: 0.5em;
				margin-left: 2em;
				&:hover {
					transform: scale(1.03);
				}
				&__image {
					width: 100%;
					background-color: #8099b3;
					max-height: 8em;
					text-align: center;
					&__item {
						height: 8em;
					}
				}
				&__text {
					margin: 0.3em 1em 0 1em;
					&__icon {
						color: var(--color-yellow);
						overflow: inherit;
					}
				}
			}

			.data-card {
				border-width: 2px;
				border-style: solid;
				border-color: var(--color-grey-light);
				height: 100%;
				&__header {
					padding: 0.5em;
					font-size: 0.9em;
					background-color: var(--color-primary);
					color: white;
					&__title {
						font-size: 1em;
					}
				}
				&__content {
					height: 100%;
				}
				&__payment-required {
					border-color: var(--color-primary);
				}
				&__verification-required {
					border-color: var(--color-yellow);
					&__header {
						color: unset;
						background-color: var(--color-yellow);
					}
				}
				&__applications-cleared {
					border-color: var(--color-green);
					&__header {
						background-color: var(--color-green);
					}
					&__button {
						background-color: var(--color-green) !important;
						color: var(--color-white) !important;
					}
				}
				&__applications-not-cleared {
					border-color: var(--color-red);
					&__header {
						background-color: var(--color-red);
					}
					&__button {
						background-color: var(--color-red) !important;
						color: var(--color-white) !important;
					}
				}
			}
		`,
	],
})
export class CrrpHomeComponent implements OnInit {
	crrpRoutes = CrrpRoutes;

	isUserPrimary: boolean | null = null;
	awaitingPaymentCount = 0;
	verifyIdentityCount = 0;
	completedClearedCount = 0;
	riskFoundCount = 0;

	applicationStatistics$!: Observable<ApplicationStatisticsResponse>;

	constructor(
		private router: Router,
		protected authUserService: AuthUserBceidService,
		private applicationService: ApplicationService,
		private orgUserService: OrgUserService
	) {}

	ngOnInit() {
		const bceidUserInfoProfile = this.authUserService.bceidUserInfoProfile;

		const orgId = bceidUserInfoProfile?.orgId;
		const userId = bceidUserInfoProfile?.userId;

		if (!orgId || !userId) {
			console.debug('CrrpHomeComponent - missing orgId', orgId, 'userId', userId);
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.orgUserService
			.apiOrgsOrgIdUsersUserIdGet({
				orgId: this.authUserService.bceidUserInfoProfile?.orgId!,
				userId: this.authUserService.bceidUserInfoProfile?.userId!,
			})
			.pipe()
			.subscribe((res: OrgUserResponse) => {
				this.isUserPrimary = res ? res.contactAuthorizationTypeCode == ContactAuthorizationTypeCode.Primary : false;
			});

		this.applicationStatistics$ = this.applicationService
			.apiOrgsOrgIdApplicationStatisticsGet({
				orgId: this.authUserService.bceidUserInfoProfile?.orgId!,
			})
			.pipe(
				tap((res: ApplicationStatisticsResponse) => {
					const applicationStatistics = res.statistics ?? {};
					this.awaitingPaymentCount = applicationStatistics[ApplicationPortalStatisticsTypeCode.AwaitingPayment] ?? 0;
					this.verifyIdentityCount = applicationStatistics[ApplicationPortalStatisticsTypeCode.VerifyIdentity] ?? 0;
					this.completedClearedCount =
						applicationStatistics[ApplicationPortalStatisticsTypeCode.ClearedLastSevenDays] ?? 0;
					this.riskFoundCount = applicationStatistics[ApplicationPortalStatisticsTypeCode.NotClearedLastSevenDays] ?? 0;
				})
			);
	}
}
