import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { ApplicationService } from '@app/core/services/application.service';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { ControllingMembersCrcRoutes } from './controlling-members-crc-routing.module';

@Component({
	selector: 'app-controlling-members-login',
	template: `
		<div class="container px-0 my-0 px-md-2 my-md-3">
			<app-step-section title="Log in to submit your consent to a criminal record check">
				<div class="row">
					<div class="offset-xxl-2 offset-xl-1 col-xxl-8 col-xl-10 col-lg-12">
						<div class="login-selection-container text-start mb-4 mb-lg-5">
							<div class="fw-bold p-2" style="color: white; background-color: var(--color-yellow);">
								Preferred Method
							</div>
							<div class="row p-4">
								<div class="col-lg-8 col-md-10 col-sm-12 mx-auto">
									<div class="fw-bold mb-3">Log in with BC Services Card:</div>
									<table>
										<tr>
											<td>
												<mat-icon class="icon me-2">circle</mat-icon>
											</td>
											<td class="pb-2">Save your progress</td>
										</tr>
										<tr>
											<td>
												<mat-icon class="icon me-2">circle</mat-icon>
											</td>
											<td class="pb-2">See the status of your criminal record check</td>
										</tr>
										<tr>
											<td>
												<mat-icon class="icon me-2">circle</mat-icon>
											</td>
											<td class="pb-2">Manage updates to your profile</td>
										</tr>
									</table>
									<div class="mt-3">
										<button
											mat-flat-button
											color="primary"
											class="xlarge mt-2"
											(click)="onRegisterWithBcServicesCard()"
										>
											Log In with <span class="fw-bold">BC Services Card</span>
										</button>
									</div>
									<div class="mt-3">
										Don't have BC Services Card?
										<a class="large login-link" [href]="setupAccountUrl" target="_blank">Set up your account today</a>
									</div>
								</div>
							</div>
						</div>

						<div class="row m-3">
							<div class="col-12 mb-4">
								If you don't have the BC Services Card app you can still apply, but you will not have access to features
								available to registered users.
							</div>
							<div class="col-lg-6 col-md-12 col-12 my-auto">
								<div class="my-3 my-lg-0">
									<a tabindex="0" class="large login-link" (click)="onContinue()" (keydown)="onKeydownContinue($event)">
										Continue without a BC Services Card
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</app-step-section>
		</div>
	`,
	styles: [
		`
			.login-link {
				font-weight: bold;
				color: var(--color-primary) !important;
			}

			.icon {
				color: var(--color-yellow) !important;
			}

			.image {
				margin-right: 1rem;
				height: 3em;
			}
		`,
	],
})
export class ControllingMembersLoginComponent implements OnInit {
	title!: string;
	setupAccountUrl = SPD_CONSTANTS.urls.setupAccountUrl;

	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private commonApplicationService: ApplicationService
	) {}

	ngOnInit(): void {
		this.title = 'Log in to submit your consent to a criminal record check'; //If process = NEW or RENEWAL
		// this.title = 'Log in to update your profile as a controlling member'; //if process = UPDATE

		this.commonApplicationService.setApplicationTitle(
			WorkerLicenceTypeCode.SecurityBusinessLicenceControllingMemberCrc
		);
	}

	async onRegisterWithBcServicesCard(): Promise<void> {
		this.router.navigateByUrl(
			ControllingMembersCrcRoutes.pathControllingMembers(ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_NEW)
		);
	}

	onContinue(): void {
		// make sure the user is not logged in.
		this.authProcessService.logoutBceid();
		this.authProcessService.logoutBcsc();

		this.router.navigateByUrl(
			ControllingMembersCrcRoutes.pathControllingMembersAnonymous(ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_NEW)
		);

		// this.BusinessApplicationService
		// 	.createNewLicenceAnonymous()
		// 	.pipe(
		// 		tap((_resp: any) => {
		// 			this.router.navigateByUrl(
		// 				ControllingMembersCrcRoutes.pathControllingMembersAnonymous(
		// 					ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_NEW
		// 				)
		// 			);
		// 		}),
		// 		take(1)
		// 	)
		// 	.subscribe();
	}

	onKeydownContinue(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onContinue();
	}
}
