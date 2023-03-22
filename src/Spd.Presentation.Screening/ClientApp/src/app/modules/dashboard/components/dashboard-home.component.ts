import { Component } from '@angular/core';
import { DashboardRoutes } from '../dashboard-routing.module';

@Component({
	selector: 'app-dashboard-home',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<div class="alert alert-warning d-flex align-items-center" role="alert">
						<mat-icon class="d-none d-lg-block alert-icon me-2">schedule</mat-icon>
						<div>
							<div>We are currently processing applications that do NOT require follow-up within:</div>
							<div class="fw-semibold">
								10 business days for online applications and 20 business days for manual applications.
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<div class="row box-row gy-4">
						<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<div class="box mx-auto" [routerLink]="[getRoute(dashboardRoutes.NEW_SCREENING)]">
								<div class="box__image">
									<img class="box__image__item" src="/assets/dashboard/new_screening.png" />
								</div>
								<div class="box__text">
									<h4>Request a new screening</h4>
									<div class="d-grid gap-2 d-md-flex justify-content-between">
										<p>Start a new screening for one or more applicants</p>
										<mat-icon class="ms-auto box__text__icon">arrow_forward_ios</mat-icon>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<div class="box mx-auto" [routerLink]="[getRoute(dashboardRoutes.SCREENING_STATUSES)]">
								<div class="box__image">
									<img class="box__image__item" src="/assets/dashboard/screening_status.png" />
								</div>
								<div class="box__text">
									<h4>View a screening status</h4>
									<div class="d-grid gap-2 d-md-flex justify-content-between">
										<p>See your applicants' screening progress</p>
										<mat-icon class="ms-auto box__text__icon">arrow_forward_ios</mat-icon>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<div class="box mx-auto" [routerLink]="[getRoute(dashboardRoutes.EXPIRING_SCREENING)]">
								<div class="box__image">
									<img class="box__image__item" src="/assets/dashboard/expired_screenings.png" />
								</div>
								<div class="box__text">
									<h4>View expiring screenings</h4>
									<div class="d-grid gap-2 d-md-flex justify-content-between">
										<p>See clearances that are expiring soon</p>
										<mat-icon class="ms-auto box__text__icon">arrow_forward_ios</mat-icon>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<div class="box mx-auto">
								<div class="box__image">
									<img class="box__image__item" src="/assets/dashboard/outstanding_payments.png" />
								</div>
								<div class="box__text" [routerLink]="[getRoute(dashboardRoutes.PAYMENTS)]">
									<h4>Outstanding payments</h4>
									<div class="d-grid gap-2 d-md-flex justify-content-between">
										<p>Manage and view payments</p>
										<mat-icon class="ms-auto box__text__icon">arrow_forward_ios</mat-icon>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<div class="box mx-auto" [routerLink]="[getRoute(dashboardRoutes.USERS)]">
								<div class="box__image">
									<img class="box__image__item" src="/assets/dashboard/authorized_users.png" />
								</div>
								<div class="box__text">
									<h4>Manage authorized users</h4>
									<div class="d-grid gap-2 d-md-flex justify-content-between">
										<p>Add or remove team members</p>
										<mat-icon class="ms-auto box__text__icon">arrow_forward_ios</mat-icon>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<div class="box mx-auto" [routerLink]="[getRoute(dashboardRoutes.IDENTITY_VERIFICATION)]">
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
			<div class="row mt-4">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h4>To Do</h4>
					<div class="row gy-4">
						<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12">
							<mat-card class="data-card" style="border-color: var(--color-primary);">
								<mat-card-header
									class="data-card__header mb-2"
									style="background-color: var(--color-primary); color: white;"
								>
									<mat-card-title class="data-card__header__title">Payment Required</mat-card-title>
								</mat-card-header>
								<mat-card-content class="data-card__content">
									<p>16 screenings require payment</p>
								</mat-card-content>
								<mat-card-actions>
									<button mat-flat-button color="primary" [routerLink]="[getRoute(dashboardRoutes.PAYMENTS)]">
										Pay Now
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
									<p>23 screenings require ID verification</p>
								</mat-card-content>
								<mat-card-actions>
									<button
										mat-flat-button
										color="accent"
										[routerLink]="[getRoute(dashboardRoutes.IDENTITY_VERIFICATION)]"
									>
										Verify Now
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
									<mat-card-title class="data-card__header__title">Screenings Cleared</mat-card-title>
								</mat-card-header>
								<mat-card-content class="data-card__content">
									<p>8 screening applications were cleared in the last week</p>
								</mat-card-content>
								<mat-card-actions>
									<button
										mat-flat-button
										[routerLink]="[getRoute(dashboardRoutes.SCREENING_STATUSES)]"
										style="background-color: var(--color-green);color: var(--color-white);"
									>
										Review
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
									<mat-card-title class="data-card__header__title">Screenings Not Cleared</mat-card-title>
								</mat-card-header>
								<mat-card-content class="data-card__content">
									<p>0 screening applications were found at risk in the last week</p>
								</mat-card-content>
								<mat-card-actions>
									<button
										mat-flat-button
										[routerLink]="[getRoute(dashboardRoutes.SCREENING_STATUSES)]"
										style="background-color: var(--color-red);color: var(--color-white);"
									>
										Review
									</button>
								</mat-card-actions>
							</mat-card>
						</div>
					</div>
				</div>
			</div>
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
export class DashboardHomeComponent {
	dashboardRoutes = DashboardRoutes;

	getRoute(route: string): string {
		return DashboardRoutes.dashboardPath(route);
	}
}
