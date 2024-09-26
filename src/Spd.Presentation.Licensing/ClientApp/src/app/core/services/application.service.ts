import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
	ApplicationInviteStatusCode,
	ApplicationPortalStatusCode,
	ApplicationTypeCode,
	BizProfileResponse,
	BizTypeCode,
	IdentityProviderTypeCode,
	LicenceAppListResponse,
	LicenceBasicResponse,
	LicenceFeeResponse,
	LicenceResponse,
	LicenceStatusCode,
	LicenceTermCode,
	Members,
	NonSwlContactInfo,
	PaymentLinkCreateRequest,
	PaymentLinkResponse,
	PaymentMethodCode,
	WorkerCategoryTypeCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { BizMembersService, LicenceAppService, LicenceService, PaymentService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app-routing.module';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routing.module';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import moment from 'moment';
import { BehaviorSubject, Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { AuthProcessService } from './auth-process.service';
import { AuthUserBceidService } from './auth-user-bceid.service';
import { AuthUserBcscService } from './auth-user-bcsc.service';
import { ConfigService } from './config.service';
import { FileUtilService } from './file-util.service';
import { UtilService } from './util.service';

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
	isControllingMemberWarning?: boolean;
}

export interface MainLicenceResponse extends LicenceResponse {
	hasLoginNameChanged: boolean;
	cardHolderName?: null | string;
	licenceCategoryCodes?: Array<WorkerCategoryTypeCode> | null;
	licenceExpiryDate?: string;
	licenceExpiryNumberOfDays?: null | number;
	licenceReprintFee: null | number;
	isRenewalPeriod: boolean;
	isUpdatePeriod: boolean;
	isReplacementPeriod: boolean;
	hasSecurityGuardCategory: boolean;
	dogAuthorization: boolean;
	dogAuthorizationExpiryDate: string | null;
	restraintAuthorization: boolean;
	restraintAuthorizationExpiryDate: string | null;
}

@Injectable({
	providedIn: 'root',
})
export class ApplicationService {
	isLoggedIn = false;

	private uniqueId = 1;

	applicationTitle$: BehaviorSubject<[string, string]> = new BehaviorSubject<[string, string]>([
		'Licensing Application',
		'Licensing Application',
	]);

	constructor(
		private router: Router,
		private dialog: MatDialog,
		private optionsPipe: OptionsPipe,
		private utilService: UtilService,
		private formatDatePipe: FormatDatePipe,
		private fileUtilService: FileUtilService,
		private configService: ConfigService,
		private paymentService: PaymentService,
		private bizMembersService: BizMembersService,
		private authProcessService: AuthProcessService,
		private authUserBcscService: AuthUserBcscService,
		private authUserBceidService: AuthUserBceidService,
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

	public isBusinessLicenceSoleProprietor(bizTypeCode: BizTypeCode): boolean {
		return (
			bizTypeCode === BizTypeCode.NonRegisteredSoleProprietor || bizTypeCode === BizTypeCode.RegisteredSoleProprietor
		);
	}

	public cancelAndLoseChanges() {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to exit? All unsaved data will be lost.',
			actionText: 'Yes',
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
			if (this.authProcessService.identityProvider === IdentityProviderTypeCode.BcServicesCard) {
				this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathUserApplications());
				return;
			} else if (this.authProcessService.identityProvider === IdentityProviderTypeCode.BusinessBceId) {
				this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
				return;
			}
		}

		this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
	}

	public onGotoBusinessProfile(applicationTypeCode: ApplicationTypeCode): void {
		this.router.navigateByUrl(
			BusinessLicenceApplicationRoutes.pathBusinessLicence(
				BusinessLicenceApplicationRoutes.BUSINESS_LICENCE_APP_PROFILE
			),
			{ state: { applicationTypeCode } }
		);
	}

	public onGotoSwlUserProfile(applicationTypeCode: ApplicationTypeCode): void {
		this.router.navigateByUrl(
			PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
				PersonalLicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
			),
			{ state: { applicationTypeCode } }
		);
	}

	public onGotoPermitUserProfile(
		workerLicenceTypeCode: WorkerLicenceTypeCode,
		applicationTypeCode: ApplicationTypeCode
	): void {
		this.router.navigateByUrl(
			PersonalLicenceApplicationRoutes.pathPermitAuthenticated(
				PersonalLicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
			),
			{ state: { workerLicenceTypeCode, applicationTypeCode } }
		);
	}

	/**
	 * Get the licence fees for the licence and application type and business type
	 * @returns list of fees
	 */
	public getLicenceTermsAndFees(
		workerLicenceTypeCode: WorkerLicenceTypeCode | null,
		applicationTypeCode: ApplicationTypeCode | null,
		bizTypeCode: BizTypeCode | null,
		originalLicenceTermCode: LicenceTermCode | undefined = undefined
	): Array<LicenceFeeResponse> {
		// console.debug(
		// 	'getLicenceTermsAndFees',
		// 	workerLicenceTypeCode,
		// 	applicationTypeCode,
		// 	bizTypeCode,
		// 	originalLicenceTermCode
		// );

		if (!workerLicenceTypeCode || !bizTypeCode) {
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
					item.bizTypeCode == bizTypeCode &&
					(!applicationTypeCode || (applicationTypeCode && item.applicationTypeCode == applicationTypeCode)) &&
					item.hasValidSwl90DayLicence === hasValidSwl90DayLicence
			);
	}

	userPersonApplicationsList(): Observable<Array<MainApplicationResponse>> {
		return this.licenceAppService
			.apiApplicantsApplicantIdLicenceApplicationsGet({
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

	userPersonLicencesList(): Observable<Array<MainLicenceResponse>> {
		return this.licenceService
			.apiApplicantsApplicantIdLicencesGet({
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
							resp.licenceStatusCode === LicenceStatusCode.Active &&
							resp.categoryCodes &&
							resp.categoryCodes.findIndex(
								(item: WorkerCategoryTypeCode) => item === WorkerCategoryTypeCode.SecurityGuard
							) >= 0
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
								return this.processPersonLicenceData(basicLicenceResps, licenceResps);
							})
						);
					} else {
						return this.processPersonLicenceData(basicLicenceResps, null);
					}
				})
			);
	}

	private processPersonLicenceData(
		basicLicenceResps: Array<LicenceBasicResponse>,
		licenceResps: Array<LicenceResponse> | null
	): Observable<Array<MainLicenceResponse>> {
		const response: Array<MainLicenceResponse> = [];
		basicLicenceResps.forEach((basicLicenceResp: LicenceBasicResponse) => {
			const matchingLicence = licenceResps?.find(
				(item: LicenceBasicResponse) => item.licenceAppId === basicLicenceResp.licenceAppId
			);

			const licence = this.getLicence(basicLicenceResp, BizTypeCode.None, matchingLicence);
			response.push(licence);
		});

		response.sort((a, b) => {
			return this.utilService.sortDate(a.licenceExpiryDate, b.licenceExpiryDate);
		});

		return of(response);
	}

	userBusinessApplicationsList(): Observable<Array<MainApplicationResponse>> {
		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		return this.licenceAppService
			.apiBizsBizIdLicenceApplicationsGet({
				bizId,
			})
			.pipe(
				switchMap((applicationResps: Array<LicenceAppListResponse>) => {
					if (applicationResps.length === 0) {
						return of([]);
					}

					return this.bizMembersService.apiBusinessBizIdMembersGet({ bizId }).pipe(
						switchMap((controllingMembersAndEmployees: Members) => {
							const nonSwlControllingMembers = controllingMembersAndEmployees.nonSwlControllingMembers ?? [];
							const incompleteMemberIndex = nonSwlControllingMembers.findIndex(
								(item: NonSwlContactInfo) => item.inviteStatusCode != ApplicationInviteStatusCode.Completed
							);
							const isControllingMemberWarning = nonSwlControllingMembers.length > 0 && incompleteMemberIndex >= 0;

							const response = applicationResps as Array<MainApplicationResponse>;
							response.forEach((item: MainApplicationResponse) => {
								this.setApplicationFlags(item);

								item.isControllingMemberWarning = isControllingMemberWarning;
							});

							response.sort((a, b) => {
								return this.utilService.sortByDirection(a.serviceTypeCode, b.serviceTypeCode);
							});

							return of(response);
						})
					);
				})
			);
	}

	userBusinessLicencesList(businessProfile: BizProfileResponse): Observable<Array<MainLicenceResponse>> {
		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		return this.licenceService
			.apiBizsBizIdLicencesGet({
				bizId: this.authUserBceidService.bceidUserProfile?.bizId!,
			})
			.pipe(
				switchMap((basicLicenceResps: Array<LicenceBasicResponse>) => {
					if (basicLicenceResps.length === 0) {
						return of([]);
					}

					const apis: Observable<any>[] = [];
					basicLicenceResps.forEach((resp: LicenceBasicResponse) => {
						if (
							resp.licenceStatusCode === LicenceStatusCode.Active &&
							resp.categoryCodes &&
							resp.categoryCodes.findIndex(
								(item: WorkerCategoryTypeCode) => item === WorkerCategoryTypeCode.SecurityGuard
							) >= 0
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
								return this.processBusinessLicenceData(businessProfile, basicLicenceResps, licenceResps);
							})
						);
					} else {
						return this.processBusinessLicenceData(businessProfile, basicLicenceResps, null);
					}
				})
			);
	}

	private processBusinessLicenceData(
		businessProfile: BizProfileResponse,
		basicLicenceResps: Array<LicenceBasicResponse>,
		licenceResps: Array<LicenceResponse> | null
	): Observable<Array<MainLicenceResponse>> {
		const response: Array<MainLicenceResponse> = [];

		basicLicenceResps.forEach((basicLicence: LicenceBasicResponse) => {
			const matchingLicence = licenceResps?.find(
				(item: LicenceBasicResponse) => item.licenceId === basicLicence.licenceId
			);
			const licence = this.getLicence(basicLicence, businessProfile.bizTypeCode!, matchingLicence);

			response.push(licence);
		});

		response.sort((a, b) => {
			return this.utilService.sortDate(a.licenceExpiryDate, b.licenceExpiryDate, 'desc');
		});

		return of(response);
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
				case WorkerLicenceTypeCode.SecurityBusinessLicenceControllingMemberCrc: {
					mobileTitle = 'CM CRC';
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

	payNowAnonymous(licenceAppId: string, description: string): void {
		console.debug('[payNowAnonymous] licenceAppId', licenceAppId, description);

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

	payNowPersonalLicenceAuthenticated(licenceAppId: string, description: string): void {
		const body: PaymentLinkCreateRequest = {
			applicationId: licenceAppId,
			paymentMethod: PaymentMethodCode.CreditCard,
			description,
		};
		this.paymentService
			.apiAuthLicenceApplicationIdPaymentLinkPost({
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

	payNowBusinessLicence(licenceAppId: string, description: string): void {
		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		const body: PaymentLinkCreateRequest = {
			applicationId: licenceAppId,
			paymentMethod: PaymentMethodCode.CreditCard,
			description,
		};
		this.paymentService
			.apiBusinessBizIdApplicationsApplicationIdPaymentLinkPost({
				bizId,
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

	downloadManualPaymentFormAuthenticated(licenceAppId: string): void {
		this.paymentService
			.apiAuthLicenceApplicationIdManualPaymentFormGet$Response({
				applicationId: licenceAppId,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.fileUtilService.downloadFile(resp.headers, resp.body);
			});
	}

	downloadManualBusinessPaymentForm(licenceAppId: string): void {
		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;
		this.paymentService
			.apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet$Response({
				bizId,
				applicationId: licenceAppId,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.fileUtilService.downloadFile(resp.headers, resp.body);
			});
	}

	getLicenceNumberLookupAnonymous(licenceNumber: string, recaptchaCode: string): Observable<LicenceLookupResult> {
		return this.licenceService
			.apiLicenceLookupAnonymousLicenceNumberPost({ licenceNumber, body: { recaptchaCode } })
			.pipe(
				switchMap((resp: LicenceResponse) => {
					const isFound = !!resp;
					const isFoundValid = isFound && resp.licenceStatusCode === LicenceStatusCode.Active;
					const isExpired = isFound && resp.licenceStatusCode != LicenceStatusCode.Active;
					const isInRenewalPeriod =
						!isFound || isExpired ? false : this.getIsInRenewalPeriod(resp.expiryDate, resp.licenceTermCode);

					const lookupResp: LicenceLookupResult = {
						isFound,
						isFoundValid,
						isExpired,
						isInRenewalPeriod,
						searchResult: resp,
					};
					return of(lookupResp);
				})
			);
	}

	getLicenceNumberLookup(licenceNumber: string): Observable<LicenceLookupResult> {
		return this.licenceService.apiLicenceLookupLicenceNumberGet({ licenceNumber }).pipe(
			switchMap((resp: LicenceResponse) => {
				const isFound = !!resp;
				const isFoundValid = isFound && resp.licenceStatusCode === LicenceStatusCode.Active;
				const isExpired = isFound && resp.licenceStatusCode != LicenceStatusCode.Active;
				const isInRenewalPeriod =
					!isFound || isExpired ? false : this.getIsInRenewalPeriod(resp.expiryDate, resp.licenceTermCode);

				const lookupResp: LicenceLookupResult = {
					isFound,
					isFoundValid,
					isExpired,
					isInRenewalPeriod,
					searchResult: resp,
				};
				return of(lookupResp);
			})
		);
	}

	setExpiredLicenceLookupMessage(
		licence: LicenceResponse | null,
		workerLicenceTypeCode: WorkerLicenceTypeCode,
		isExpired: boolean,
		isInRenewalPeriod: boolean
	): [string | null, string | null] {
		let messageWarn = null;
		let messageError = null;

		const selWorkerLicenceTypeDesc = this.optionsPipe.transform(workerLicenceTypeCode, 'WorkerLicenceTypes');
		if (licence) {
			if (licence.workerLicenceTypeCode !== workerLicenceTypeCode) {
				//   WorkerLicenceType does not match
				messageError = `This licence number is not a ${selWorkerLicenceTypeDesc}.`;
			} else {
				if (!isExpired) {
					if (isInRenewalPeriod) {
						messageWarn = `Your ${selWorkerLicenceTypeDesc} is still valid, and needs to be renewed. Please exit and <a href="https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing" target="_blank">renew your ${selWorkerLicenceTypeDesc}</a>.`;
					} else {
						messageWarn = `This ${selWorkerLicenceTypeDesc} is still valid. Please renew it when you get your renewal notice in the mail.`;
					}
				}
			}
		} else {
			messageError = `This ${selWorkerLicenceTypeDesc} number does not match any existing ${selWorkerLicenceTypeDesc}s.`;
		}

		return [messageWarn, messageError];
	}

	getApplicationIsInProgress(appls: Array<MainApplicationResponse>): boolean {
		return !!appls.find(
			(item: MainApplicationResponse) =>
				item.applicationPortalStatusCode === ApplicationPortalStatusCode.AwaitingPayment ||
				item.applicationPortalStatusCode === ApplicationPortalStatusCode.AwaitingThirdParty ||
				item.applicationPortalStatusCode === ApplicationPortalStatusCode.InProgress ||
				item.applicationPortalStatusCode === ApplicationPortalStatusCode.AwaitingApplicant ||
				item.applicationPortalStatusCode === ApplicationPortalStatusCode.UnderAssessment ||
				item.applicationPortalStatusCode === ApplicationPortalStatusCode.VerifyIdentity
		);
	}

	getIsInRenewalPeriod(expiryDate: string | null | undefined, licenceTermCode: LicenceTermCode | undefined): boolean {
		if (!expiryDate || !licenceTermCode) {
			return false;
		}

		const daysBetween = moment(expiryDate).startOf('day').diff(moment().startOf('day'), 'days');

		// Ability to submit Renewals only if current licence term is 1,2,3 or 5 years and expiry date is in 90 days or less.
		// Ability to submit Renewals only if current licence term is 90 days and expiry date is in 60 days or less.
		let renewPeriodDays = SPD_CONSTANTS.periods.licenceRenewPeriodDays;
		if (licenceTermCode === LicenceTermCode.NinetyDays) {
			renewPeriodDays = SPD_CONSTANTS.periods.licenceRenewPeriodDaysNinetyDayTerm;
		}

		return daysBetween > renewPeriodDays ? false : true;
	}

	handleDuplicateLicence(): void {
		const data: DialogOptions = {
			icon: 'error',
			title: 'Confirmation',
			message:
				'You already have the same kind of licence or licence application. Do you want to edit this licence information or return to your list?',
			actionText: 'Edit',
			cancelText: 'Go back',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (!response) {
					this.onGoToHome();
				}
			});
	}

	handleDuplicateBusinessLicence(): void {
		const data: DialogOptions = {
			icon: 'error',
			title: 'Confirmation',
			message:
				'You already have the same kind of licence or licence application. You cannot continue with this application. Please contact SPD.',
			cancelText: 'Go back',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((_response: boolean) => {
				this.onGoToHome();
			});
	}

	getMainWarningsAndErrorPersonalLicence(
		applicationsList: Array<MainApplicationResponse>,
		activeLicencesList: Array<MainLicenceResponse>
	): [Array<string>, Array<string>] {
		const [warningMessages, errorMessages, _isControllingMemberWarning] = this.getMainWarningsAndError(
			applicationsList,
			activeLicencesList,
			false
		);
		return [warningMessages, errorMessages];
	}

	getMainWarningsAndErrorBusinessLicence(
		applicationsList: Array<MainApplicationResponse>,
		activeLicencesList: Array<MainLicenceResponse>,
		checkControllingMemberWarning: boolean
	): [Array<string>, Array<string>, boolean] {
		return this.getMainWarningsAndError(applicationsList, activeLicencesList, checkControllingMemberWarning);
	}

	private getMainWarningsAndError(
		applicationsList: Array<MainApplicationResponse>,
		activeLicencesList: Array<MainLicenceResponse>,
		checkControllingMemberWarning: boolean
	): [Array<string>, Array<string>, boolean] {
		const warningMessages: Array<string> = [];
		const errorMessages: Array<string> = [];
		let isControllingMemberWarning = false;

		const applicationNotifications = applicationsList.filter(
			(item: MainApplicationResponse) => item.isExpiryWarning || item.isExpiryError || item.isControllingMemberWarning
		);
		applicationNotifications.forEach((item: MainApplicationResponse) => {
			const itemLabel = this.optionsPipe.transform(item.serviceTypeCode, 'WorkerLicenceTypes');
			const itemExpiry = this.formatDatePipe.transform(item.applicationExpiryDate, SPD_CONSTANTS.date.formalDateFormat);
			if (item.isExpiryWarning) {
				warningMessages.push(
					`You haven't submitted your ${itemLabel} application yet. It will expire on <strong>${itemExpiry}</strong>.`
				);
			} else if (checkControllingMemberWarning && item.isControllingMemberWarning) {
				// Must have application in Payment Pending status to show this message.
				const awaitingPaymentIndex = applicationsList.findIndex(
					(item: MainApplicationResponse) =>
						item.applicationPortalStatusCode === ApplicationPortalStatusCode.AwaitingPayment
				);
				if (awaitingPaymentIndex >= 0) {
					isControllingMemberWarning = true;
				}
			} else if (item.isExpiryError) {
				errorMessages.push(
					`You haven't submitted your ${itemLabel} application yet. It will expire on <strong>${itemExpiry}</strong>.`
				);
			}
		});

		const renewals = activeLicencesList.filter((item: MainLicenceResponse) => item.isRenewalPeriod);
		renewals.forEach((item: MainLicenceResponse) => {
			const itemLabel = this.optionsPipe.transform(item.workerLicenceTypeCode, 'WorkerLicenceTypes');
			const itemExpiry = this.formatDatePipe.transform(item.licenceExpiryDate, SPD_CONSTANTS.date.formalDateFormat);

			if (item.licenceExpiryNumberOfDays != null) {
				if (item.licenceExpiryNumberOfDays < 0) {
					errorMessages.push(`Your ${itemLabel} expired on <strong>${itemExpiry}</strong>.`);
				} else if (item.licenceExpiryNumberOfDays > 7) {
					warningMessages.push(
						`Your ${itemLabel} is expiring in ${item.licenceExpiryNumberOfDays} days. Please renew by <strong>${itemExpiry}</strong>.`
					);
				} else if (item.licenceExpiryNumberOfDays === 0) {
					errorMessages.push(`Your ${itemLabel} is expiring <strong>today</strong>. Please renew now.`);
				} else {
					const dayLabel = item.licenceExpiryNumberOfDays > 1 ? 'days' : 'day';
					errorMessages.push(
						`Your ${itemLabel} is expiring in ${item.licenceExpiryNumberOfDays} ${dayLabel}. Please renew by <strong>${itemExpiry}</strong>.`
					);
				}
			}
		});

		return [warningMessages, errorMessages, isControllingMemberWarning];
	}

	/**
	 * Get the title for the CriminalHistory page
	 * @returns
	 */
	getCriminalHistoryTitle(applicationTypeCode: ApplicationTypeCode | null): string {
		if (applicationTypeCode === ApplicationTypeCode.Update || applicationTypeCode === ApplicationTypeCode.Renewal) {
			return 'Do you have any new criminal charges or convictions?';
		} else {
			return 'Have you previously been charged or convicted of a crime?';
		}
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
		bizTypeCode: BizTypeCode,
		matchingLicence?: LicenceResponse | undefined
	): MainLicenceResponse {
		const licence = { ...basicLicence, ...matchingLicence } as MainLicenceResponse;

		const licenceReplacementPeriodPreventionDays = SPD_CONSTANTS.periods.licenceReplacementPeriodPreventionDays;
		const licenceUpdatePeriodPreventionDays = SPD_CONSTANTS.periods.licenceUpdatePeriodPreventionDays;
		const licenceRenewPeriodDays = SPD_CONSTANTS.periods.licenceRenewPeriodDays;
		const licenceRenewPeriodDaysNinetyDayTerm = SPD_CONSTANTS.periods.licenceRenewPeriodDaysNinetyDayTerm;

		licence.isRenewalPeriod = false;
		licence.isUpdatePeriod = false;
		licence.isReplacementPeriod = false;

		const today = moment().startOf('day');

		licence.cardHolderName = basicLicence.nameOnCard;
		licence.licenceExpiryDate = basicLicence.expiryDate;
		licence.licenceExpiryNumberOfDays = moment(licence.licenceExpiryDate).startOf('day').diff(today, 'days');
		licence.hasLoginNameChanged = basicLicence.nameOnCard != licence.licenceHolderName;
		licence.licenceCategoryCodes = basicLicence.categoryCodes ?? [];

		licence.hasSecurityGuardCategory =
			licence.licenceCategoryCodes.findIndex(
				(item: WorkerCategoryTypeCode) => item === WorkerCategoryTypeCode.SecurityGuard
			) >= 0;

		if (licence.hasSecurityGuardCategory && matchingLicence) {
			licence.dogAuthorization = matchingLicence.useDogs ?? false;
			licence.dogAuthorizationExpiryDate = matchingLicence.dogsDocumentExpiredDate ?? null;
			licence.restraintAuthorization = matchingLicence.carryAndUseRestraints ?? false;
			licence.restraintAuthorizationExpiryDate = matchingLicence.restraintsDocumentExpiredDate ?? null;
		}

		if (licence.licenceExpiryNumberOfDays >= 0) {
			if (
				licence.licenceStatusCode === LicenceStatusCode.Active &&
				today.isBefore(
					moment(licence.licenceExpiryDate).startOf('day').subtract(licenceUpdatePeriodPreventionDays, 'days')
				)
			) {
				licence.isUpdatePeriod = true;
			}

			if (basicLicence.licenceTermCode === LicenceTermCode.NinetyDays) {
				if (
					today.isSameOrAfter(
						moment(licence.licenceExpiryDate).startOf('day').subtract(licenceRenewPeriodDaysNinetyDayTerm, 'days')
					)
				) {
					licence.isRenewalPeriod = true;
				}
			} else {
				if (
					today.isSameOrAfter(moment(licence.licenceExpiryDate).startOf('day').subtract(licenceRenewPeriodDays, 'days'))
				) {
					licence.isRenewalPeriod = true;
				}
			}

			if (
				today.isBefore(
					moment(licence.licenceExpiryDate).startOf('day').subtract(licenceReplacementPeriodPreventionDays, 'days')
				)
			) {
				licence.isReplacementPeriod = true;
			}
		}

		// get Licence Reprint Fee
		const fee = this.getLicenceTermsAndFees(
			basicLicence.workerLicenceTypeCode!,
			ApplicationTypeCode.Replacement,
			bizTypeCode,
			basicLicence.licenceTermCode
		).find((item: LicenceFeeResponse) => item.licenceTermCode === basicLicence.licenceTermCode);
		licence.licenceReprintFee = fee?.amount ? fee.amount : null;

		return licence;
	}
}
