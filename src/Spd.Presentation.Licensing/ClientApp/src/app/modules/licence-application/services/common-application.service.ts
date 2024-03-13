import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
	ApplicationPortalStatusCode,
	ApplicationTypeCode,
	BusinessTypeCode,
	Document,
	LicenceAppListResponse,
	LicenceDocumentTypeCode,
	LicenceFeeResponse,
	LicenceResponse,
	LicenceTermCode,
	PaymentLinkCreateRequest,
	PaymentLinkResponse,
	PaymentMethodCode,
	PermitLicenceAppResponse,
	WorkerLicenceAppResponse,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import {
	ApplicantLicenceAppService,
	LicenceService,
	PaymentService,
	PermitService,
	SecurityWorkerLicensingService,
} from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { AuthUserBcscService } from '@app/core/services/auth-user-bcsc.service';
import { ConfigService } from '@app/core/services/config.service';
import { FileUtilService } from '@app/core/services/file-util.service';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import * as moment from 'moment';
import { BehaviorSubject, Observable, forkJoin, map, switchMap } from 'rxjs';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';

export interface UserApplicationResponse extends LicenceAppListResponse {
	applicationExpiryDate?: string;
	isExpiryWarning: boolean;
	isExpiryError: boolean;
}

export interface UserLicenceResponse extends WorkerLicenceAppResponse, PermitLicenceAppResponse {
	nameOnCard?: null | string;
	licenceExpiryDate?: string;
	licenceExpiryNumberOfDays?: null | number;
	licenceHolderFirstName?: null | string;
	licenceHolderLastName?: null | string;
	licenceId?: null | string;
	licenceNumber?: null | string;
	licenceReprintFee: null | number;
	isExpired: boolean;
	isRenewalPeriod: boolean;
	isUpdatePeriod: boolean;
	isReplacementPeriod: boolean;
	dogAuthorization: null | LicenceDocumentTypeCode;
	restraintAuthorization: null | LicenceDocumentTypeCode;
}

@Injectable({
	providedIn: 'root',
})
export class CommonApplicationService {
	isLoggedIn = false;

	applicationTitle$: BehaviorSubject<[string, string]> = new BehaviorSubject<[string, string]>([
		'Licensing Application',
		'Licensing Application',
	]);

	constructor(
		private router: Router,
		private optionsPipe: OptionsPipe,
		private fileUtilService: FileUtilService,
		private configService: ConfigService,
		private paymentService: PaymentService,
		private authProcessService: AuthProcessService,
		private authUserBcscService: AuthUserBcscService,
		private applicantLicenceAppService: ApplicantLicenceAppService,
		private securityWorkerLicensingService: SecurityWorkerLicensingService,
		private licenceService: LicenceService,
		private permitService: PermitService
	) {
		this.authProcessService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			this.isLoggedIn = isLoggedIn;
		});
	}

	public onGoToHome(): void {
		if (this.isLoggedIn) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated());
			return;
		}

		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LOGIN_SELECTION));
	}

	/**
	 * Get the licence fees for the licence and application type and business type
	 * @returns list of fees
	 */
	public getLicenceTermsAndFees(
		workerLicenceTypeCode: WorkerLicenceTypeCode | null,
		applicationTypeCode: ApplicationTypeCode | null,
		businessTypeCode: BusinessTypeCode | null,
		originalLicenceTermCode: LicenceTermCode | undefined = undefined
	): Array<LicenceFeeResponse> {
		// console.debug(
		// 	'getLicenceTermsAndFees',
		// 	workerLicenceTypeCode,
		// 	applicationTypeCode,
		// 	businessTypeCode,
		// 	originalLicenceTermCode
		// );

		if (!workerLicenceTypeCode || !businessTypeCode) {
			return [];
		}

		let hasValidSwl90DayLicence = false;
		if (applicationTypeCode === ApplicationTypeCode.Renewal && originalLicenceTermCode === LicenceTermCode.NinetyDays) {
			hasValidSwl90DayLicence = true;
		}

		return this.configService
			.getLicenceFees()
			.filter(
				(item) =>
					item.workerLicenceTypeCode == workerLicenceTypeCode &&
					item.businessTypeCode == businessTypeCode &&
					(!applicationTypeCode || (applicationTypeCode && item.applicationTypeCode == applicationTypeCode)) &&
					item.hasValidSwl90DayLicence === hasValidSwl90DayLicence
			);
	}

	userApplicationsList(): Observable<Array<UserApplicationResponse>> {
		return this.applicantLicenceAppService
			.apiApplicantsApplicantIdLicenceApplicationsGet({
				applicantId: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			})
			.pipe(
				map((_resp: Array<LicenceAppListResponse>) => {
					const applicationNotSubmittedWarningDays = SPD_CONSTANTS.periods.applicationNotSubmittedWarningDays;
					const applicationNotSubmittedErrorDays = SPD_CONSTANTS.periods.applicationNotSubmittedErrorDays;
					const applicationNotSubmittedValidDays = SPD_CONSTANTS.periods.applicationNotSubmittedValidDays;

					const response = _resp as Array<UserApplicationResponse>;
					response.forEach((item: UserApplicationResponse) => {
						item.isExpiryWarning = false;
						item.isExpiryError = false;

						if (item.applicationPortalStatusCode === ApplicationPortalStatusCode.Draft) {
							const applicationExpiryDate = moment(item.createdOn).add(applicationNotSubmittedValidDays, 'days');
							item.applicationExpiryDate = applicationExpiryDate.toString();
							if (
								moment().isSameOrAfter(moment(applicationExpiryDate).subtract(applicationNotSubmittedErrorDays, 'days'))
							) {
								item.isExpiryError = true;
							} else if (
								moment().isSameOrAfter(
									moment(applicationExpiryDate).subtract(applicationNotSubmittedWarningDays, 'days')
								)
							) {
								item.isExpiryWarning = true;
							}
						}
					});

					this.setApplicationTitle();
					return response;
				})
			);
	}

	userLicencesList(): Observable<Array<UserLicenceResponse>> {
		return this.licenceService
			.apiApplicantsApplicantIdLicencesGet({
				applicantId: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			})
			.pipe(
				switchMap((licenceResps: LicenceResponse[]) => {
					const apis: Observable<any>[] = [];
					licenceResps.forEach((appl: LicenceResponse) => {
						if (appl.workerLicenceTypeCode === WorkerLicenceTypeCode.SecurityWorkerLicence) {
							apis.push(
								this.securityWorkerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdGet({
									licenceAppId: appl.licenceAppId!,
								})
							);
						} else {
							apis.push(this.permitService.apiPermitApplicationsLicenceAppIdGet({ licenceAppId: appl.licenceAppId! }));
						}
					});
					return forkJoin(apis).pipe(
						map((resps: Array<WorkerLicenceAppResponse | PermitLicenceAppResponse>) => {
							const response: Array<UserLicenceResponse> = [];
							resps.forEach((resp: WorkerLicenceAppResponse | PermitLicenceAppResponse) => {
								const licence = resp as UserLicenceResponse;

								const licenceReplacementPeriodPreventionDays =
									SPD_CONSTANTS.periods.licenceReplacementPeriodPreventionDays;
								const licenceUpdatePeriodPreventionDays = SPD_CONSTANTS.periods.licenceUpdatePeriodPreventionDays;
								const licenceRenewPeriodDays = SPD_CONSTANTS.periods.licenceRenewPeriodDays;
								const licenceRenewPeriodDaysNinetyDayTerm = SPD_CONSTANTS.periods.licenceRenewPeriodDaysNinetyDayTerm;

								licence.isExpired = false;
								licence.isRenewalPeriod = false;
								licence.isUpdatePeriod = false;
								licence.isReplacementPeriod = false;

								const matchingLicence = licenceResps.find(
									(item: LicenceResponse) => item.licenceAppId === resp.licenceAppId
								);
								if (matchingLicence) {
									licence.nameOnCard = matchingLicence.nameOnCard;
									licence.licenceExpiryDate = matchingLicence.expiryDate;
									licence.licenceExpiryNumberOfDays = moment(licence.licenceExpiryDate).diff(moment(), 'days');
									licence.licenceHolderFirstName = matchingLicence.licenceHolderFirstName;
									licence.licenceHolderLastName = matchingLicence.licenceHolderLastName;
									licence.licenceId = matchingLicence.licenceId;
									licence.licenceNumber = matchingLicence.licenceNumber;

									licence.isExpired = moment().isAfter(moment(licence.licenceExpiryDate));

									if (
										!licence.isExpired &&
										moment().isBefore(
											moment(licence.licenceExpiryDate).subtract(licenceUpdatePeriodPreventionDays, 'days')
										)
									) {
										licence.isUpdatePeriod = true;
									}

									if (resp.licenceTermCode === LicenceTermCode.NinetyDays) {
										if (
											moment().isSameOrAfter(
												moment(licence.licenceExpiryDate).subtract(licenceRenewPeriodDaysNinetyDayTerm, 'days')
											)
										) {
											licence.isRenewalPeriod = true;
										}
									} else {
										if (
											moment().isSameOrAfter(moment(licence.licenceExpiryDate).subtract(licenceRenewPeriodDays, 'days'))
										) {
											licence.isRenewalPeriod = true;
										}
									}

									if (
										moment().isBefore(
											moment(licence.licenceExpiryDate).subtract(licenceReplacementPeriodPreventionDays, 'days')
										)
									) {
										licence.isReplacementPeriod = true;
									}
								}

								// get Licence Reprint Fee
								const fee = this.getLicenceTermsAndFees(
									resp.workerLicenceTypeCode!,
									ApplicationTypeCode.Replacement,
									resp.businessTypeCode!,
									resp.licenceTermCode
								).find((item: LicenceFeeResponse) => item.licenceTermCode === resp.licenceTermCode);
								licence.licenceReprintFee = fee?.amount ? fee.amount : null;

								const hasDogAuthorization = resp.documentInfos?.find(
									(item: Document) =>
										item.licenceDocumentTypeCode === LicenceDocumentTypeCode.CategorySecurityGuardDogCertificate
								);
								licence.dogAuthorization = hasDogAuthorization?.licenceDocumentTypeCode
									? hasDogAuthorization.licenceDocumentTypeCode
									: null;

								const hasRestraintAuthorization = resp.documentInfos?.find(
									(item: Document) =>
										item.licenceDocumentTypeCode === LicenceDocumentTypeCode.CategorySecurityGuardAstCertificate ||
										item.licenceDocumentTypeCode ===
											LicenceDocumentTypeCode.CategorySecurityGuardUseForceEmployerLetter ||
										item.licenceDocumentTypeCode ===
											LicenceDocumentTypeCode.CategorySecurityGuardUseForceEmployerLetterAstEquivalent
								);
								licence.restraintAuthorization = hasRestraintAuthorization?.licenceDocumentTypeCode
									? hasRestraintAuthorization.licenceDocumentTypeCode
									: null;

								// If the licence holder has a SWL, they can add a new Body Armour and/or Armoured Vehicle permit
								// If the licence holder has a Body Armour permit, they can add a new Armoured Vehicle permit and/or a security worker licence
								// If the licence holder has an Armoured vehicle permit, they can add a new Body Armour permit and/or a security worker licence
								// If the licence holder has all 3 (either valid or expired), hide "Apply for a new licence/permit" button

								// If the expiry date is within 90 days, applicant sees "renew" option next to the licence
								// At top of page when renew option is available, add yellow alert: "Your licence is expiring in 71 days. Please renew your licence by July 30, 2023."
								// After day 0, hide Renew button Licence is no longer in the Valid licences & permit section Licence will show in the Expired licences & permit section

								// If the licence term has expired, the licence holder can still see the expired licence. The can see a "Re-apply" button

								// They can request a replacement, even if during renewal period, up until 14 days from expiry date
								// If within 14 days before expiry, do not allow replacement, but inform applicant they can contact SPD to be provided a digital copy of their current licence or permit.
								// "Lost your licence? Contact SPD for a digital copy of your current licence before it expires"
								// "Lost or stolen permit? Contact SPD for a digital copy of your current permit before it expires"
								// links to https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/contact

								// When a user has started an application but has not submitted it yet, the user can view their Profile page in read-only mode – they can't edit this info while the application is in progress

								response.push(licence);
							});

							return response;
						})
					);
				})
			);
	}

	setApplicationTitleText(title: string, mobileTitle?: string | null | undefined) {
		this.applicationTitle$.next([title, mobileTitle ? mobileTitle : title]);
	}

	setApplicationTitle(
		workerLicenceTypeCode: WorkerLicenceTypeCode | undefined = undefined,
		applicationTypeCode: ApplicationTypeCode | undefined = undefined,
		originalLicenceNumber: string | undefined = undefined
	) {
		let title = '';
		let mobileTitle = '';

		if (workerLicenceTypeCode) {
			title = this.optionsPipe.transform(workerLicenceTypeCode, 'WorkerLicenceTypes');
			switch (workerLicenceTypeCode) {
				case WorkerLicenceTypeCode.SecurityBusinessLicence: {
					mobileTitle = 'SBL';
					break;
				}
				case WorkerLicenceTypeCode.SecurityWorkerLicence: {
					mobileTitle = 'SWL';
					break;
				}
				case WorkerLicenceTypeCode.ArmouredVehiclePermit: {
					mobileTitle = 'AVP';
					break;
				}
				case WorkerLicenceTypeCode.BodyArmourPermit: {
					mobileTitle = 'BAP';
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
		} else {
			mobileTitle = title = 'Licensing Application';
		}

		this.applicationTitle$.next([title, mobileTitle]);
	}

	payNowUnauthenticated(licenceAppId: string, description: string): void {
		const body: PaymentLinkCreateRequest = {
			applicationId: licenceAppId,
			paymentMethod: PaymentMethodCode.CreditCard,
			description,
		};
		this.paymentService
			.apiUnauthLicenceApplicationIdPaymentLinkPost({
				applicationId: licenceAppId,
				body,
			})
			.pipe()
			.subscribe((res: PaymentLinkResponse) => {
				if (res.paymentLinkUrl) {
					window.location.assign(res.paymentLinkUrl);
				}
			});
	}

	downloadManualPaymentFormUnauthenticated(licenceAppId: string): void {
		this.paymentService
			.apiUnauthLicenceApplicationIdManualPaymentFormGet$Response({
				applicationId: licenceAppId,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.fileUtilService.downloadFile(resp.headers, resp.body);
			});
	}
}
