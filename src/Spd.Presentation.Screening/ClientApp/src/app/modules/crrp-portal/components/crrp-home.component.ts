import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApplicationStatisticsResponse, ContactAuthorizationTypeCode, OrgUserResponse } from 'src/app/api/models';
import { ApplicationService, OrgUserService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { ApplicationPortalStatisticsTypeCode } from 'src/app/core/code-types/application-portal-statistics-type.model';
import { AuthUserService } from 'src/app/core/services/auth-user.service';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-crrp-home',
	template: `
		<app-crrp-header></app-crrp-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<app-applications-banner></app-applications-banner>
				</div>
			</div>
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<div class="row box-row gy-4">
						<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<div class="box mx-auto" [routerLink]="[crrpRoutes.path(crrpRoutes.CRIMINAL_RECORD_CHECKS)]">
								<div class="box__image">
									<img class="box__image__item" src="/assets/dashboard/new_screening.png" />
								</div>
								<div class="box__text">
									<h4>Request a new criminal record check</h4>
									<div class="d-grid gap-2 d-md-flex justify-content-between">
										<p>Start a new check for one or more applicants</p>
										<mat-icon class="ms-auto box__text__icon">arrow_forward_ios</mat-icon>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<div class="box mx-auto" [routerLink]="[crrpRoutes.path(crrpRoutes.APPLICATION_STATUSES)]">
								<div class="box__image">
									<img class="box__image__item" src="/assets/dashboard/screening_status.png" />
								</div>
								<div class="box__text">
									<h4>View application status</h4>
									<div class="d-grid gap-2 d-md-flex justify-content-between">
										<p>See your applicants' criminal record check progress</p>
										<mat-icon class="ms-auto box__text__icon">arrow_forward_ios</mat-icon>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<div class="box mx-auto" [routerLink]="[crrpRoutes.path(crrpRoutes.EXPIRING_CHECKS)]">
								<div class="box__image">
									<img class="box__image__item" src="/assets/dashboard/expired_screenings.png" />
								</div>
								<div class="box__text">
									<h4>View expiring criminal record checks</h4>
									<div class="d-grid gap-2 d-md-flex justify-content-between">
										<p>See clearances that are expiring soon</p>
										<mat-icon class="ms-auto box__text__icon">arrow_forward_ios</mat-icon>
									</div>
								</div>
							</div>
						</div>
						<div
							class="col-xl-4 col-lg-6 col-md-12 col-sm-12"
							*ngIf="authUserService.bceidUserOrgProfile?.isNotVolunteerOrg ?? false"
						>
							<div class="box mx-auto" [routerLink]="[crrpRoutes.path(crrpRoutes.PAYMENTS)]">
								<div class="box__image">
									<img class="box__image__item" src="/assets/dashboard/outstanding_payments.png" />
								</div>
								<div class="box__text">
									<h4>Payments</h4>
									<div class="d-grid gap-2 d-md-flex justify-content-between">
										<p>Manage and view payments</p>
										<mat-icon class="ms-auto box__text__icon">arrow_forward_ios</mat-icon>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<div class="box mx-auto" [routerLink]="[crrpRoutes.path(crrpRoutes.USERS)]">
								<div class="box__image">
									<img class="box__image__item" src="/assets/dashboard/authorized_users.png" />
								</div>
								<div class="box__text">
									<h4 *ngIf="userPrimary == true">Manage authorized users</h4>
									<h4 *ngIf="userPrimary == false">Update profile</h4>
									<div class="d-grid gap-2 d-md-flex justify-content-between">
										<p *ngIf="userPrimary == true">Add or remove team members</p>
										<p *ngIf="userPrimary == false">Edit your personal information</p>
										<mat-icon class="ms-auto box__text__icon">arrow_forward_ios</mat-icon>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<div class="box mx-auto" [routerLink]="[crrpRoutes.path(crrpRoutes.IDENTITY_VERIFICATION)]">
								<div class="box__image">
									<img class="box__image__item" src="/assets/dashboard/applicant_identity.png" />
								</div>
								<div class="box__text">
									<h4>Confirm applicant identity</h4>
									<div class="d-grid gap-2 d-md-flex justify-content-between">
										<p>See a list of applicants who required ID checks</p>
										<mat-icon class="ms-auto box__text__icon">arrow_forward_ios</mat-icon>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<ng-container *ngIf="applicationStatistics$ | async">
				<div class="row mt-4">
					<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
						<h4>To Do</h4>
						<div class="row gy-4">
							<div
								class="col-xl-3 col-lg-6 col-md-12 col-sm-12"
								*ngIf="authUserService.bceidUserOrgProfile?.isNotVolunteerOrg ?? false"
							>
								<mat-card class="data-card" style="border-color: var(--color-primary);">
									<mat-card-header
										class="data-card__header mb-2"
										style="background-color: var(--color-primary); color: white;"
									>
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
											<mat-icon>paid</mat-icon>Pay Now
										</button>
									</mat-card-actions>
								</mat-card>
							</div>
							<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12">
								<mat-card class="data-card" style="border-color: var(--color-yellow);">
									<mat-card-header class="data-card__header mb-2" style="background-color: var(--color-yellow);">
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
											<mat-icon>send</mat-icon>Verify Now
										</button>
									</mat-card-actions>
								</mat-card>
							</div>
							<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12">
								<mat-card class="data-card" style="border-color: var(--color-green); ">
									<mat-card-header
										class="data-card__header mb-2"
										style="background-color: var(--color-green); color: white;"
									>
										<mat-card-title class="data-card__header__title">Applications Cleared</mat-card-title>
									</mat-card-header>
									<mat-card-content class="data-card__content">
										<p>{{ completedClearedCount }} applications were cleared in the last week</p>
									</mat-card-content>
									<mat-card-actions class="mt-4">
										<button
											mat-flat-button
											[routerLink]="[crrpRoutes.path(crrpRoutes.APPLICATION_STATUSES)]"
											style="background-color: var(--color-green);color: var(--color-white);"
										>
											<mat-icon>preview</mat-icon>Review
										</button>
									</mat-card-actions>
								</mat-card>
							</div>
							<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12">
								<mat-card class="data-card" style="border-color: var(--color-red);">
									<mat-card-header
										class="data-card__header mb-2"
										style="background-color: var(--color-red); color: white;"
									>
										<mat-card-title class="data-card__header__title">Applications Not Cleared</mat-card-title>
									</mat-card-header>
									<mat-card-content class="data-card__content">
										<p>{{ riskFoundCount }} applications were found at risk in the last week</p>
									</mat-card-content>
									<mat-card-actions class="mt-4">
										<button
											mat-flat-button
											[routerLink]="[crrpRoutes.path(crrpRoutes.APPLICATION_STATUSES)]"
											style="background-color: var(--color-red);color: var(--color-white);"
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
					margin: 1em 1em 0 1em;
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
					&__title {
						font-size: 1em;
					}
				}
				&__content {
					height: 100%;
				}
			}
		`,
	],
})
export class CrrpHomeComponent implements OnInit {
	crrpRoutes = CrrpRoutes;

	userPrimary: boolean | null = null;
	awaitingPaymentCount: number = 0;
	verifyIdentityCount: number = 0;
	completedClearedCount: number = 0;
	riskFoundCount: number = 0;

	applicationStatistics$!: Observable<ApplicationStatisticsResponse>;

	constructor(
		protected authUserService: AuthUserService,
		private router: Router,
		private applicationService: ApplicationService,
		private orgUserService: OrgUserService
	) {}

	ngOnInit() {
		const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		const userId = this.authUserService.bceidUserInfoProfile?.userId;

		if (!orgId || !userId) {
			console.debug('CrrpHomeComponent - orgId', orgId, 'userId', userId);
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
				this.userPrimary = res ? res.contactAuthorizationTypeCode == ContactAuthorizationTypeCode.Primary : false;
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
