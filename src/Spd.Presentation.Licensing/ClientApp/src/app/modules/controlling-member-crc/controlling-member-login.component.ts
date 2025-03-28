import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
	ApplicationTypeCode,
	ControllingMemberAppInviteTypeCode,
	ControllingMemberAppInviteVerifyResponse,
	ServiceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { UtilService } from '@app/core/services/util.service';
import { take, takeWhile, tap } from 'rxjs';
import { ControllingMemberCrcRoutes } from './controlling-member-crc-routes';

@Component({
	selector: 'app-controlling-member-login',
	template: `
		<div class="container px-0 my-0 px-md-2 my-md-3">
			<app-step-section [title]="title">
				<div class="row">
					<div class="offset-xxl-2 offset-xl-1 col-xxl-8 col-xl-10 col-lg-12">
						<div class="login-selection-container text-start mb-4 mb-lg-5">
							<div class="fw-bold p-2" style="color: white; background-color: var(--color-yellow);">
								Preferred Method
							</div>
							<div class="row p-4">
								<div class="col-lg-8 col-md-10 col-sm-12 mx-auto">
									<div class="fw-bold mb-3">Log in with your BC Services Card account:</div>
									<table>
										<tr>
											<td><mat-icon class="icon me-2">circle</mat-icon></td>
											<td class="pb-2">Save your application and continue it later</td>
										</tr>
										<tr>
											<td><mat-icon class="icon me-2">circle</mat-icon></td>
											<td class="pb-2">Apply faster</td>
										</tr>
										<tr>
											<td><mat-icon class="icon me-2">circle</mat-icon></td>
											<td class="pb-2">See your application progress in real time</td>
										</tr>
									</table>
									<button
										mat-flat-button
										color="primary"
										class="xlarge mt-3"
										aria-label="Log in with your BC Services Card"
										(click)="onRegisterWithBcServicesCard()"
									>
										Log In with <span class="fw-bold">BC Services Card</span>
									</button>
									<div class="mt-3">
										<a
											class="large login-link"
											aria-label="Navigate to BC Services Card site"
											[href]="setupAccountUrl"
											target="_blank"
											>Learn how to set up the BC Services Card account</a
										>
									</div>
								</div>
							</div>
						</div>

						<div class="row m-3">
							<div class="col-12 mb-4">
								If you don’t have a
								<a
									class="large login-link"
									aria-label="Navigate to BC Services Card site"
									[href]="setupAccountUrl"
									target="_blank"
									>BC Services Card account</a
								>, you can still complete the application.
							</div>
							<div class="col-lg-12 col-md-12 col-12 my-auto">
								<div class="my-3 my-lg-0">
									<a
										tabindex="0"
										class="large login-link"
										aria-label="Continue without a BC Services Card account"
										(click)="onContinueAnonymous()"
										(keydown)="onKeydownContinueAnonymous($event)"
									>
										Continue without a BC Services Card account
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
	standalone: false,
})
export class ControllingMemberLoginComponent implements OnInit {
	title!: string;
	setupAccountUrl = SPD_CONSTANTS.urls.setupAccountUrl;

	private subscribeAlive = true;
	private defaultRoute!: string;

	crcInviteData: ControllingMemberAppInviteVerifyResponse | null = null;

	private applicationTypeCode!: ApplicationTypeCode;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private authProcessService: AuthProcessService,
		private commonApplicationService: CommonApplicationService,
		private controllingMembersService: ControllingMemberCrcService,
		private location: Location
	) {}

	async ngOnInit(): Promise<void> {
		this.authProcessService.logoutBceid();

		this.crcInviteData = (this.location.getState() as any).crcInviteData;

		const currentPath = location.pathname;
		// to handle relative urls, look for '/controlling-member-crc/' to get the default route
		const startOfRoute = currentPath.indexOf('/' + ControllingMemberCrcRoutes.MODULE_PATH + '/');
		this.defaultRoute = currentPath.substring(startOfRoute);

		if (!this.crcInviteData) {
			const stateInfo = await this.authProcessService.tryInitializeControllingMemberCrcInviteBcsc(this.defaultRoute);
			if (stateInfo) {
				this.crcInviteData = JSON.parse(stateInfo);
			}
		}

		if (!this.crcInviteData) {
			this.router.navigateByUrl(
				ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_INVITATION)
			);
			return;
		}

		this.applicationTypeCode = this.getCrcApplicationTypeCode(this.crcInviteData!);

		this.title =
			this.applicationTypeCode === ApplicationTypeCode.New
				? 'Log in to submit your consent to a criminal record check'
				: 'Log in to update your profile as a controlling member';

		this.commonApplicationService.setApplicationTitle(
			ServiceTypeCode.SecurityBusinessLicenceControllingMemberCrc,
			this.applicationTypeCode
		);

		this.authProcessService.waitUntilAuthentication$
			.pipe(takeWhile(() => this.subscribeAlive))
			.subscribe((isLoggedIn: boolean) => {
				if (isLoggedIn) {
					this.subscribeAlive = false;

					this.controllingMembersService
						.createOrResumeCrc(this.crcInviteData!, this.applicationTypeCode)
						.pipe(
							tap((_resp: any) => {
								if (this.applicationTypeCode === ApplicationTypeCode.New) {
									this.router.navigateByUrl(
										ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_NEW)
									);
								} else {
									this.router.navigateByUrl(
										ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_UPDATE)
									);
								}
							}),
							take(1)
						)
						.subscribe();
				}
			});
	}

	async onRegisterWithBcServicesCard(): Promise<void> {
		const stateInfo = JSON.stringify({ ...this.crcInviteData });
		this.utilService.setSessionData(this.utilService.CM_CRC_STATE_KEY, stateInfo);

		await this.authProcessService.initializeControllingMemberCrcInviteBcsc(stateInfo, this.defaultRoute);
	}

	onContinueAnonymous(): void {
		this.authProcessService.logoutBceid();
		this.authProcessService.logoutBcsc();

		this.controllingMembersService
			.createNewOrUpdateCrcAnonymous(this.crcInviteData!, this.applicationTypeCode)
			.pipe(
				tap((_resp: any) => {
					if (this.applicationTypeCode === ApplicationTypeCode.New) {
						this.router.navigateByUrl(
							ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_NEW)
						);
					} else {
						this.router.navigateByUrl(
							ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_UPDATE)
						);
					}
				}),
				take(1)
			)
			.subscribe();
	}

	onKeydownContinueAnonymous(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onContinueAnonymous();
	}

	private getCrcApplicationTypeCode(crcInviteData: ControllingMemberAppInviteVerifyResponse): ApplicationTypeCode {
		return crcInviteData.inviteTypeCode === ControllingMemberAppInviteTypeCode.Update
			? ApplicationTypeCode.Update
			: ApplicationTypeCode.New;
	}
}
