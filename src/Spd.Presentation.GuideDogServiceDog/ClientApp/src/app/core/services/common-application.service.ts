import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
	ApplicationPortalStatusCode,
	ApplicationTypeCode,
	LicenceAppListResponse,
	LicenceBasicResponse,
	LicenceResponse,
	LicenceTermCode,
	ServiceTypeCode,
} from '@app/api/models';
import { ApplicantProfileService, LicenceAppService, LicenceService } from '@app/api/services';
import { AppRoutes } from '@app/app.routes';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import moment from 'moment';
import { BehaviorSubject, Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { AuthProcessService } from './auth-process.service';
import { AuthUserBcscService } from './auth-user-bcsc.service';
import { UtilService } from './util.service';

export interface LicenceResponseExt extends LicenceResponse {
	inProgressApplications: boolean;
}

export class LicenceLookupResult {
	'isFound': boolean;
	'isFoundValid': boolean;
	'isExpired': boolean;
	'isInRenewalPeriod': boolean;
	'searchResult': LicenceResponse | null;
}

export interface MainApplicationResponse extends LicenceAppListResponse {
	applicationExpiryDate?: string;
	isExpiryWarning: boolean;
	isExpiryError: boolean;
}

export interface MainLicenceResponse extends LicenceResponse {
	hasLoginNameChanged: boolean;
	licenceExpiryNumberOfDays?: null | number;
	isRenewalPeriod: boolean;
	isReplacementPeriod: boolean;
	isExpiredLicenceRenewable: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class CommonApplicationService {
	isLoggedIn = false;

	private uniqueId = 1;

	applicationTitle$: BehaviorSubject<[string, string]> = new BehaviorSubject<[string, string]>([
		'Security Services Application',
		'Security Services Application',
	]);

	constructor(
		private dialog: MatDialog,
		private router: Router,
		private optionsPipe: OptionsPipe,
		private utilService: UtilService,
		private applicantProfileService: ApplicantProfileService,
		private authProcessService: AuthProcessService,
		private authUserBcscService: AuthUserBcscService,
		private licenceAppService: LicenceAppService,
		private licenceService: LicenceService
	) {
		this.authProcessService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			this.isLoggedIn = isLoggedIn;
		});
	}

	public getUniqueId(): string {
		this.uniqueId = this.uniqueId + 1;
		return `ID${this.uniqueId}`;
	}

	public cancelAndLoseChanges() {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to exit? All unsaved data will be lost.',
			actionText: 'Exit',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.onGoToHome();
				}
			});
	}

	public onGoToHome(): void {
		if (this.isLoggedIn) {
			this.router.navigateByUrl(AppRoutes.pathGdsdMainApplications());
			return;
		}
		this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
	}

	userGdsdApplicationsList(): Observable<Array<LicenceAppListResponse>> {
		return this.licenceAppService
			.apiApplicantsApplicantIdDogCertificationApplicationsGet({
				applicantId: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			})
			.pipe(
				map((_resp: Array<LicenceAppListResponse>) => {
					const response = _resp as Array<MainApplicationResponse>;
					response.forEach((item: MainApplicationResponse) => {
						this.setApplicationFlags(item);
					});

					response.sort((a, b) => {
						return this.utilService.sortByDirection(a.serviceTypeCode, b.serviceTypeCode);
					});

					return response;
				})
			);
	}

	userGdsdLicencesList(): Observable<Array<MainLicenceResponse>> {
		return this.licenceService
			.apiApplicantsApplicantIdGdsdCertificationsGet({
				applicantId: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			})
			.pipe(
				switchMap((basicLicenceResps: LicenceBasicResponse[]) => {
					if (basicLicenceResps.length === 0) {
						return of([]);
					}

					const apis: Observable<any>[] = [];
					basicLicenceResps.forEach((resp: LicenceBasicResponse) => {
						if (
							this.utilService.isLicenceActive(resp.licenceStatusCode) ||
							this.utilService.isExpiredLicenceRenewable(resp as MainLicenceResponse)
						) {
							apis.push(
								this.licenceService.apiLicencesLicenceIdGet({
									licenceId: resp.licenceId!,
								})
							);
						}
					});

					if (apis.length > 0) {
						return forkJoin(apis).pipe(
							switchMap((licenceResps: LicenceResponse[]) => {
								return this.processLicenceData(basicLicenceResps, licenceResps);
							})
						);
					} else {
						return this.processLicenceData(basicLicenceResps, null);
					}
				})
			);
	}

	setGdsdApplicationTitle(
		serviceTypeCode: ServiceTypeCode | undefined = undefined,
		applicationTypeCode: ApplicationTypeCode | undefined = undefined,
		originalLicenceNumber: string | undefined = undefined
	) {
		let title = 'Guide Dog Service Dog';
		let mobileTitle = 'GDSD';

		if (serviceTypeCode) {
			({ title, mobileTitle } = this.getApplicationTitle(serviceTypeCode, applicationTypeCode, originalLicenceNumber));
		}

		this.applicationTitle$.next([title, mobileTitle]);
	}

	private getApplicationTitle(
		serviceTypeCode: ServiceTypeCode | undefined = undefined,
		applicationTypeCode: ApplicationTypeCode | undefined = undefined,
		originalLicenceNumber: string | undefined = undefined
	): {
		title: string;
		mobileTitle: string;
	} {
		if (!serviceTypeCode) {
			return { title: 'Security Services Application', mobileTitle: 'SSA' };
		}

		let title = this.optionsPipe.transform(serviceTypeCode, 'ServiceTypes');
		let mobileTitle: string = serviceTypeCode;

		switch (serviceTypeCode) {
			case ServiceTypeCode.GdsdTeamCertification: {
				mobileTitle = 'GDSD Team';
				break;
			}
			case ServiceTypeCode.DogTrainerCertification: {
				mobileTitle = 'Dog Trainer';
				break;
			}
			case ServiceTypeCode.RetiredServiceDogCertification: {
				mobileTitle = 'Retired Dog';
				break;
			}
		}

		if (applicationTypeCode) {
			const applicationTypeDesc = this.optionsPipe.transform(applicationTypeCode, 'ApplicationTypes');
			title += ` - ${applicationTypeDesc}`;
			mobileTitle += ` ${applicationTypeDesc}`;
		}

		if (originalLicenceNumber) {
			title += ` - ${originalLicenceNumber}`;
			mobileTitle += ` ${originalLicenceNumber}`;
		}

		return { title, mobileTitle };
	}

	getApplicationIsInProgress(appls: Array<MainApplicationResponse>): boolean {
		return !!appls.find(
			(item: MainApplicationResponse) =>
				(item.applicationPortalStatusCode === ApplicationPortalStatusCode.Draft &&
					item.applicationTypeCode != ApplicationTypeCode.New) ||
				item.applicationPortalStatusCode === ApplicationPortalStatusCode.AwaitingPayment ||
				item.applicationPortalStatusCode === ApplicationPortalStatusCode.AwaitingThirdParty ||
				item.applicationPortalStatusCode === ApplicationPortalStatusCode.InProgress ||
				item.applicationPortalStatusCode === ApplicationPortalStatusCode.AwaitingApplicant ||
				item.applicationPortalStatusCode === ApplicationPortalStatusCode.UnderAssessment ||
				item.applicationPortalStatusCode === ApplicationPortalStatusCode.VerifyIdentity
		);
	}

	getMainWarningsAndErrorLicence(
		applicationsList: Array<MainApplicationResponse>,
		activeLicencesList: Array<MainLicenceResponse>
	): [Array<string>, Array<string>] {
		const [warningMessages, errorMessages] = this.getMainWarningsAndError(applicationsList, activeLicencesList);
		return [warningMessages, errorMessages];
	}

	/**
	 * Search for an existing gdsd certificate using access code
	 * @param licenceNumber
	 * @param accessCode
	 * @param recaptchaCode
	 * @returns
	 */
	getGDSDLicenceWithAccessCodeAnonymous(
		licenceNumber: string,
		accessCode: string,
		recaptchaCode: string
	): Observable<LicenceResponseExt | null> {
		return this.licenceService
			.apiLicenceLookupAnonymousLicenceNumberPost({ licenceNumber, accessCode, body: { recaptchaCode } })
			.pipe(
				switchMap((resp: LicenceResponse) => {
					if (!resp) {
						// lookup does not match a licence
						return of(null);
					}

					return this.applicantProfileService.apiApplicantsAnonymousDogCertificationApplicationsGet().pipe(
						map((appls: Array<LicenceAppListResponse>) => {
							return {
								inProgressApplications: appls.length > 0,
								...resp,
							} as LicenceResponseExt;
						})
					);
				})
			);
	}

	private getMainWarningsAndError(
		applicationsList: Array<MainApplicationResponse>,
		activeLicencesList: Array<MainLicenceResponse>
	): [Array<string>, Array<string>] {
		const warningMessages: Array<string> = [];
		const errorMessages: Array<string> = [];

		const applicationNotifications = applicationsList.filter(
			(item: MainApplicationResponse) => item.isExpiryWarning || item.isExpiryError
		);
		applicationNotifications.forEach((item: MainApplicationResponse) => {
			const itemLabel = this.optionsPipe.transform(item.serviceTypeCode, 'ServiceTypes');
			const itemExpiry = this.utilService.dateToDateFormat(item.applicationExpiryDate);
			if (item.isExpiryWarning) {
				warningMessages.push(
					`You haven't submitted your ${itemLabel} application yet. It will expire on <strong>${itemExpiry}</strong>.`
				);
			} else if (item.isExpiryError) {
				errorMessages.push(
					`You haven't submitted your ${itemLabel} application yet. It will expire on <strong>${itemExpiry}</strong>.`
				);
			}
		});

		const renewalApplicationExists =
			applicationsList.findIndex(
				(item: MainApplicationResponse) => item.applicationTypeCode === ApplicationTypeCode.Renewal
			) >= 0;

		if (!renewalApplicationExists) {
			// show any renewal related warning/error messages
			const renewals = activeLicencesList.filter((item: MainLicenceResponse) => item.isRenewalPeriod);
			renewals.forEach((item: MainLicenceResponse) => {
				const itemLabel = this.optionsPipe.transform(item.serviceTypeCode, 'ServiceTypes');
				const itemExpiry = this.utilService.dateToDateFormat(item.expiryDate);

				if (item.licenceExpiryNumberOfDays != null) {
					if (item.licenceExpiryNumberOfDays < 0) {
						errorMessages.push(`Your ${itemLabel} expired on <strong>${itemExpiry}</strong>.`);
					} else if (item.licenceExpiryNumberOfDays > 7) {
						warningMessages.push(
							`Your ${itemLabel} expires in ${item.licenceExpiryNumberOfDays} days. Please renew by <strong>${itemExpiry}</strong>.`
						);
					} else if (item.licenceExpiryNumberOfDays === 0) {
						errorMessages.push(`Your ${itemLabel} expires <strong>today</strong>. Please renew now.`);
					} else {
						const dayLabel = item.licenceExpiryNumberOfDays > 1 ? 'days' : 'day';
						errorMessages.push(
							`Your ${itemLabel} expires in ${item.licenceExpiryNumberOfDays} ${dayLabel}. Please renew by <strong>${itemExpiry}</strong>.`
						);
					}
				}
			});
		}

		return [warningMessages, errorMessages];
	}

	private processLicenceData(
		basicLicenceResps: Array<LicenceBasicResponse>,
		licenceResps: Array<LicenceResponse> | null
	): Observable<Array<MainLicenceResponse>> {
		const response: Array<MainLicenceResponse> = [];
		basicLicenceResps.forEach((basicLicenceResp: LicenceBasicResponse) => {
			const matchingLicence = licenceResps?.find(
				(item: LicenceBasicResponse) => item.licenceAppId === basicLicenceResp.licenceAppId
			);

			const licence = this.getLicence(basicLicenceResp, matchingLicence);
			response.push(licence);
		});

		response.sort((a, b) => {
			return this.utilService.sortDate(a.expiryDate, b.expiryDate);
		});

		return of(response);
	}

	private setApplicationFlags(item: MainApplicationResponse) {
		const applicationNotSubmittedWarningDays = SPD_CONSTANTS.periods.applicationNotSubmittedWarningDays;
		const applicationNotSubmittedErrorDays = SPD_CONSTANTS.periods.applicationNotSubmittedErrorDays;
		const applicationNotSubmittedValidDays = SPD_CONSTANTS.periods.applicationNotSubmittedValidDays;

		item.isExpiryWarning = false;
		item.isExpiryError = false;

		if (
			item.applicationPortalStatusCode === ApplicationPortalStatusCode.Draft &&
			item.applicationTypeCode === ApplicationTypeCode.New
		) {
			const today = moment().startOf('day');
			const applicationExpiryDate = moment(item.updatedOn).startOf('day').add(applicationNotSubmittedValidDays, 'days');

			item.applicationExpiryDate = applicationExpiryDate.toString();
			if (today.isSameOrAfter(moment(applicationExpiryDate).subtract(applicationNotSubmittedErrorDays, 'days'))) {
				item.isExpiryError = true;
			} else if (
				today.isSameOrAfter(moment(applicationExpiryDate).subtract(applicationNotSubmittedWarningDays, 'days'))
			) {
				item.isExpiryWarning = true;
			}
		}
	}

	private getLicence(
		basicLicence: LicenceBasicResponse,
		matchingLicence?: LicenceResponse | undefined
	): MainLicenceResponse {
		const licence = { ...basicLicence, ...matchingLicence } as MainLicenceResponse;

		const licenceReplacementPeriodPreventionDays = SPD_CONSTANTS.periods.licenceReplacementPeriodPreventionDays;
		const licenceRenewPeriodDays = SPD_CONSTANTS.periods.licenceRenewPeriodDays;
		const licenceRenewPeriodDaysNinetyDayTerm = SPD_CONSTANTS.periods.licenceRenewPeriodDaysNinetyDayTerm;

		licence.isRenewalPeriod = false;
		licence.isReplacementPeriod = false;
		licence.isExpiredLicenceRenewable = this.utilService.isExpiredLicenceRenewable(licence);

		const today = moment().startOf('day');

		const nameOnCard = basicLicence.nameOnCard?.toUpperCase().trim();
		const licenceHolderName = licence.licenceHolderName?.toUpperCase().trim();

		licence.licenceExpiryNumberOfDays = moment(licence.expiryDate).startOf('day').diff(today, 'days');
		licence.hasLoginNameChanged = nameOnCard != licenceHolderName;

		if (licence.licenceExpiryNumberOfDays >= 0) {
			if (basicLicence.licenceTermCode === LicenceTermCode.NinetyDays) {
				if (
					today.isSameOrAfter(
						moment(licence.expiryDate).startOf('day').subtract(licenceRenewPeriodDaysNinetyDayTerm, 'days')
					)
				) {
					licence.isRenewalPeriod = true;
				}
			} else {
				if (today.isSameOrAfter(moment(licence.expiryDate).startOf('day').subtract(licenceRenewPeriodDays, 'days'))) {
					licence.isRenewalPeriod = true;
				}
			}

			if (
				today.isBefore(
					moment(licence.expiryDate).startOf('day').subtract(licenceReplacementPeriodPreventionDays, 'days')
				)
			) {
				licence.isReplacementPeriod = true;
			}
		}

		return licence;
	}
}
