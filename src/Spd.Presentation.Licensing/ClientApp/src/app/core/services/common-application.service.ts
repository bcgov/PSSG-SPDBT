import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
	ActionResult,
	ApplicationInviteStatusCode,
	ApplicationPortalStatusCode,
	ApplicationTypeCode,
	BizLicAppResponse,
	BizProfileResponse,
	BizTypeCode,
	Document,
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
	ServiceTypeCode,
	WorkerCategoryTypeCode,
} from '@app/api/models';
import {
	BizLicensingService,
	BizMembersService,
	LicenceAppService,
	LicenceService,
	PaymentService,
} from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app-routes';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { GuideDogServiceDogRoutes } from '@app/modules/guide-dog-service-dog/guide-dog-service-dog-routes';
import { MetalDealersAndRecyclersRoutes } from '@app/modules/metal-dealers-and-recyclers/metal-dealers-and-recyclers-routes';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
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
	isSimultaneousFlow: boolean;
}

export interface MainLicenceResponse extends LicenceResponse {
	hasLoginNameChanged: boolean;
	licenceCategoryCodes?: Array<WorkerCategoryTypeCode> | null;
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
	isSimultaneousFlow: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class CommonApplicationService {
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
		private bizLicensingService: BizLicensingService,
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

	public isLicenceActive(licenceStatusCode: LicenceStatusCode | null | undefined): boolean {
		if (!licenceStatusCode) return false;

		return licenceStatusCode === LicenceStatusCode.Active || licenceStatusCode === LicenceStatusCode.Preview;
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
		const currentPath = location.pathname;

		if (this.isLoggedIn) {
			if (this.authProcessService.identityProvider === IdentityProviderTypeCode.BcServicesCard) {
				if (currentPath.includes(GuideDogServiceDogRoutes.MODULE_PATH)) {
					this.router.navigateByUrl(GuideDogServiceDogRoutes.pathGdsdUserApplications());
				} else {
					this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathUserApplications());
				}
				return;
			} else if (this.authProcessService.identityProvider === IdentityProviderTypeCode.BusinessBceId) {
				this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
				return;
			}
		}

		if (currentPath.includes(MetalDealersAndRecyclersRoutes.MODULE_PATH)) {
			this.router.navigateByUrl(MetalDealersAndRecyclersRoutes.path());
		} else if (currentPath.includes(GuideDogServiceDogRoutes.MODULE_PATH)) {
			this.router.navigateByUrl(GuideDogServiceDogRoutes.path());
		} else {
			this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
		}
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

	public onGotoPermitUserProfile(serviceTypeCode: ServiceTypeCode, applicationTypeCode: ApplicationTypeCode): void {
		this.router.navigateByUrl(
			PersonalLicenceApplicationRoutes.pathPermitAuthenticated(
				PersonalLicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
			),
			{ state: { serviceTypeCode, applicationTypeCode } }
		);
	}

	/**
	 * Get the licence fees for the licence and application type and business type
	 * @returns list of fees
	 */
	public getLicenceTermsAndFees(
		serviceTypeCode: ServiceTypeCode | null,
		applicationTypeCode: ApplicationTypeCode | null,
		bizTypeCode: BizTypeCode | null,
		originalLicenceTermCode: LicenceTermCode | undefined = undefined
	): Array<LicenceFeeResponse> {
		// console.debug('getLicenceTermsAndFees', serviceTypeCode, applicationTypeCode, bizTypeCode);

		if (!serviceTypeCode || !applicationTypeCode || !bizTypeCode) {
			return [];
		}

		let hasValidSwl90DayLicence = false;
		if (applicationTypeCode === ApplicationTypeCode.Renewal && originalLicenceTermCode === LicenceTermCode.NinetyDays) {
			hasValidSwl90DayLicence = true;
		}

		const fees = this.configService
			.getLicenceFees()
			.filter(
				(item: LicenceFeeResponse) =>
					item.serviceTypeCode == serviceTypeCode &&
					item.applicationTypeCode == applicationTypeCode &&
					item.bizTypeCode == bizTypeCode &&
					item.hasValidSwl90DayLicence === hasValidSwl90DayLicence
			);

		return fees;
	}

	/**
	 * Get the licence fees for the licence and application type and business type
	 * @returns list of fees
	 */
	public getLicenceFee(
		serviceTypeCode: ServiceTypeCode | null,
		applicationTypeCode: ApplicationTypeCode | null,
		bizTypeCode: BizTypeCode | null,
		licenceTermCode: LicenceTermCode | null,
		originalLicenceTermCode: LicenceTermCode | undefined = undefined
	): LicenceFeeResponse | null {
		// console.debug('getLicenceFee',serviceTypeCode,applicationTypeCode,bizTypeCode,licenceTermCode,originalLicenceTermCode);

		if (!serviceTypeCode || !applicationTypeCode || !bizTypeCode || !licenceTermCode) {
			return null;
		}

		let hasValidSwl90DayLicence = false;
		if (applicationTypeCode === ApplicationTypeCode.Renewal && originalLicenceTermCode === LicenceTermCode.NinetyDays) {
			hasValidSwl90DayLicence = true;
		}

		const fees = this.configService
			.getLicenceFees()
			.find(
				(item: LicenceFeeResponse) =>
					item.serviceTypeCode == serviceTypeCode &&
					item.applicationTypeCode == applicationTypeCode &&
					item.bizTypeCode == bizTypeCode &&
					item.licenceTermCode == licenceTermCode &&
					item.hasValidSwl90DayLicence === hasValidSwl90DayLicence
			);

		return fees ?? null;
	}

	cancelDraftApplication(licenceAppId: string): Observable<ActionResult> {
		return this.licenceAppService.apiApplicationsAppIdDelete({ appId: licenceAppId });
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
						if (this.isLicenceActive(resp.licenceStatusCode)) {
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
			return this.utilService.sortDate(a.expiryDate, b.expiryDate);
		});

		return of(response);
	}

	userBusinessApplicationsList(isSoleProprietorship: boolean): Observable<Array<MainApplicationResponse>> {
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

					if (isSoleProprietorship) {
						const response = applicationResps as Array<MainApplicationResponse>;

						response.sort((a, b) => {
							return this.utilService.sortByDirection(a.serviceTypeCode, b.serviceTypeCode);
						});

						response.forEach((item: MainApplicationResponse) => {
							this.setApplicationFlags(item);
						});

						const draftOrPaymentWaitingAppls = response.filter(
							(item: MainApplicationResponse) =>
								item.applicationPortalStatusCode === ApplicationPortalStatusCode.Draft ||
								item.applicationPortalStatusCode === ApplicationPortalStatusCode.AwaitingPayment
						);

						if (draftOrPaymentWaitingAppls.length > 0) {
							const appl = draftOrPaymentWaitingAppls[0];

							return this.bizLicensingService
								.apiBusinessLicenceApplicationLicenceAppIdGet({ licenceAppId: appl.licenceAppId! })
								.pipe(
									switchMap((resp: BizLicAppResponse) => {
										response.forEach((item: MainApplicationResponse) => {
											item.isSimultaneousFlow = !!resp.soleProprietorSWLAppId;
										});

										return of(response);
									})
								);
						} else {
							return of(response);
						}
					} else {
						return this.bizMembersService.apiBusinessBizIdMembersGet({ bizId }).pipe(
							switchMap((controllingMembersAndEmployees: Members) => {
								const nonSwlControllingMembers = controllingMembersAndEmployees.nonSwlControllingMembers ?? [];
								const incompleteMemberIndex = nonSwlControllingMembers.findIndex(
									(item: NonSwlContactInfo) => item.inviteStatusCode != ApplicationInviteStatusCode.Completed
								);
								const isControllingMemberWarning = nonSwlControllingMembers.length > 0 && incompleteMemberIndex >= 0;

								const response = applicationResps as Array<MainApplicationResponse>;
								response.forEach((item: MainApplicationResponse) => {
									item.isControllingMemberWarning = isControllingMemberWarning;
								});

								return of(response);
							})
						);
					}
				})
			);
	}

	userBusinessLicencesList(businessProfile: BizProfileResponse): Observable<Array<MainLicenceResponse>> {
		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		return this.licenceService
			.apiBizsBizIdLicencesGet({
				bizId,
			})
			.pipe(
				switchMap((basicLicenceResps: Array<LicenceBasicResponse>) => {
					if (basicLicenceResps.length === 0) {
						return of([]);
					}

					const apis: Observable<any>[] = [];
					basicLicenceResps.forEach((resp: LicenceBasicResponse) => {
						if (this.isLicenceActive(resp.licenceStatusCode)) {
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
			return this.utilService.sortDate(a.expiryDate, b.expiryDate, 'desc');
		});

		return of(response);
	}

	setApplicationTitleText(title: string, mobileTitle?: string | null | undefined) {
		this.applicationTitle$.next([title, mobileTitle ? mobileTitle : title]);
	}

	setApplicationTitle(
		serviceTypeCode: ServiceTypeCode | undefined = undefined,
		applicationTypeCode: ApplicationTypeCode | undefined = undefined,
		originalLicenceNumber: string | undefined = undefined
	) {
		let title = '';
		let mobileTitle = '';

		if (serviceTypeCode) {
			title = this.optionsPipe.transform(serviceTypeCode, 'ServiceTypes');
			switch (serviceTypeCode) {
				case ServiceTypeCode.SecurityBusinessLicence: {
					mobileTitle = 'SBL';
					break;
				}
				case ServiceTypeCode.SecurityBusinessLicenceControllingMemberCrc: {
					mobileTitle = 'CM CRC';
					break;
				}
				case ServiceTypeCode.SecurityWorkerLicence: {
					mobileTitle = 'SWL';
					break;
				}
				case ServiceTypeCode.ArmouredVehiclePermit: {
					mobileTitle = 'AVP';
					break;
				}
				case ServiceTypeCode.BodyArmourPermit: {
					mobileTitle = 'BAP';
					break;
				}
			}

			// TODO add support for GDSD title setting

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

	getSubmitSuccessMessage(serviceTypeCode: ServiceTypeCode, applicationTypeCode: ApplicationTypeCode): string {
		let message = '';

		const serviceTypeDesc = this.optionsPipe.transform(serviceTypeCode, 'ServiceTypes');
		switch (applicationTypeCode) {
			case ApplicationTypeCode.New: {
				message = `Your ${serviceTypeDesc} application has been successfully submitted`;
				break;
			}
			default: {
				const applicationTypeDesc = this.optionsPipe.transform(applicationTypeCode, 'ApplicationTypes');
				message = `Your ${serviceTypeDesc} ${applicationTypeDesc} application has been successfully submitted`;
				break;
			}
		}

		console.debug('[getSubmitSuccessMessage]', message);
		return message;
	}

	payNowPersonalLicenceAnonymous(licenceAppId: string): void {
		const body: PaymentLinkCreateRequest = {
			applicationId: licenceAppId,
			paymentMethod: PaymentMethodCode.CreditCard,
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

	payNowPersonalLicenceAuthenticated(licenceAppId: string): void {
		const body: PaymentLinkCreateRequest = {
			applicationId: licenceAppId,
			paymentMethod: PaymentMethodCode.CreditCard,
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

	payNowBusinessLicence(licenceAppId: string): void {
		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;
		const body: PaymentLinkCreateRequest = {
			applicationId: licenceAppId,
			paymentMethod: PaymentMethodCode.CreditCard,
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
					const lookupResp = this.getLicenceSearchFlags(resp);
					return of(lookupResp);
				})
			);
	}

	getLicenceNumberLookup(licenceNumber: string): Observable<LicenceLookupResult> {
		return this.licenceService.apiLicenceLookupLicenceNumberGet({ licenceNumber }).pipe(
			switchMap((resp: LicenceResponse) => {
				const lookupResp = this.getLicenceSearchFlags(resp);
				return of(lookupResp);
			})
		);
	}

	setExpiredLicenceLookupMessage(
		licence: LicenceResponse | null,
		serviceTypeCode: ServiceTypeCode,
		isExpired: boolean,
		isInRenewalPeriod: boolean
	): [string | null, string | null] {
		let messageWarn = null;
		let messageError = null;

		const selServiceTypeCodeDesc = this.optionsPipe.transform(serviceTypeCode, 'ServiceTypes');
		if (licence) {
			if (licence.serviceTypeCode !== serviceTypeCode) {
				messageError = this.getLicenceLookupServiceTypeCodeMismatchErrorMessage(selServiceTypeCodeDesc);
			} else {
				if (!isExpired) {
					const securityIndustryLicensingUrl = SPD_CONSTANTS.urls.securityIndustryLicensingUrl;
					if (isInRenewalPeriod) {
						messageWarn = `Your ${selServiceTypeCodeDesc} is still valid, and needs to be renewed. Please exit and <a href="${securityIndustryLicensingUrl}" target="_blank">renew your ${selServiceTypeCodeDesc}</a>.`;
					} else {
						messageWarn = `This ${selServiceTypeCodeDesc} is still valid. Please renew it when you get your renewal notice in the mail.`;
					}
				}
			}
		} else {
			messageError = this.getLicenceLookupNoMatchErrorMessage(serviceTypeCode, selServiceTypeCodeDesc);
		}

		return [messageWarn, messageError];
	}

	setLicenceLookupMessage(licence: LicenceResponse | null, serviceTypeCode: ServiceTypeCode): string | null {
		let messageError = null;

		const selServiceTypeCodeDesc = this.optionsPipe.transform(serviceTypeCode, 'ServiceTypes');
		if (licence) {
			if (licence.serviceTypeCode !== serviceTypeCode) {
				messageError = this.getLicenceLookupServiceTypeCodeMismatchErrorMessage(selServiceTypeCodeDesc);
			}
		} else {
			messageError = this.getLicenceLookupNoMatchErrorMessage(serviceTypeCode, selServiceTypeCodeDesc);
		}

		return messageError;
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

	getApplicationIsDraft(appls: Array<MainApplicationResponse>): boolean {
		return !!appls.find(
			(item: MainApplicationResponse) => item.applicationPortalStatusCode === ApplicationPortalStatusCode.Draft
		);
	}

	getApplicationIsDraftOrWaitingForPayment(appls: Array<MainApplicationResponse>): boolean {
		return !!appls.find(
			(item: MainApplicationResponse) =>
				item.applicationPortalStatusCode === ApplicationPortalStatusCode.Draft ||
				item.applicationPortalStatusCode === ApplicationPortalStatusCode.AwaitingPayment
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
			const itemLabel = this.optionsPipe.transform(item.serviceTypeCode, 'ServiceTypes');
			const itemExpiry = this.formatDatePipe.transform(item.applicationExpiryDate, SPD_CONSTANTS.date.formalDateFormat);
			if (item.isExpiryWarning) {
				warningMessages.push(
					`You haven't submitted your ${itemLabel} application yet. It will expire on <strong>${itemExpiry}</strong>.`
				);
			} else if (checkControllingMemberWarning && item.isControllingMemberWarning) {
				// applications only wait for controlling member completion on New or Renewal
				if (
					item.applicationTypeCode === ApplicationTypeCode.New ||
					item.applicationTypeCode === ApplicationTypeCode.Renewal
				) {
					// Must have application in Payment Pending status to show this message.
					const awaitingPaymentIndex = applicationsList.findIndex(
						(item: MainApplicationResponse) =>
							item.applicationPortalStatusCode === ApplicationPortalStatusCode.AwaitingPayment
					);
					if (awaitingPaymentIndex >= 0) {
						isControllingMemberWarning = true;
					}
				}
			} else if (item.isExpiryError) {
				errorMessages.push(
					`You haven't submitted your ${itemLabel} application yet. It will expire on <strong>${itemExpiry}</strong>.`
				);
			}
		});

		const renewals = activeLicencesList.filter((item: MainLicenceResponse) => item.isRenewalPeriod);
		renewals.forEach((item: MainLicenceResponse) => {
			const itemLabel = this.optionsPipe.transform(item.serviceTypeCode, 'ServiceTypes');
			const itemExpiry = this.formatDatePipe.transform(item.expiryDate, SPD_CONSTANTS.date.formalDateFormat);

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

	private getLicenceLookupServiceTypeCodeMismatchErrorMessage(selServiceTypeCodeDesc: string): string {
		return `This licence number is not a ${selServiceTypeCodeDesc}.`;
	}

	private getLicenceLookupNoMatchErrorMessage(
		serviceTypeCode: ServiceTypeCode,
		selServiceTypeCodeDesc: string
	): string {
		if (serviceTypeCode === ServiceTypeCode.SecurityBusinessLicence) {
			return `This ${selServiceTypeCodeDesc} number does not match any existing ${selServiceTypeCodeDesc}s for your business in BC.`;
		} else {
			return `This ${selServiceTypeCodeDesc} number does not match any existing ${selServiceTypeCodeDesc}s.`;
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

	private getLicenceSearchFlags(licence: LicenceResponse): LicenceLookupResult {
		const isFound = !!licence;
		let isFoundValid = false;

		if (isFound) {
			isFoundValid = this.isLicenceActive(licence.licenceStatusCode);
		}

		const isExpired = isFound && !isFoundValid;
		const isInRenewalPeriod = !isFoundValid
			? false
			: this.getIsInRenewalPeriod(licence.expiryDate, licence.licenceTermCode);

		const lookupResp: LicenceLookupResult = {
			isFound,
			isFoundValid,
			isExpired,
			isInRenewalPeriod,
			searchResult: licence,
		};

		console.debug('getLicenceSearchFlags lookupResp', lookupResp);

		return lookupResp;
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
		licence.isSimultaneousFlow = false;

		const today = moment().startOf('day');

		licence.licenceExpiryNumberOfDays = moment(licence.expiryDate).startOf('day').diff(today, 'days');
		licence.hasLoginNameChanged = basicLicence.nameOnCard != licence.licenceHolderName;
		licence.licenceCategoryCodes = basicLicence.categoryCodes?.sort() ?? [];

		licence.hasSecurityGuardCategory =
			licence.licenceCategoryCodes.findIndex(
				(item: WorkerCategoryTypeCode) => item === WorkerCategoryTypeCode.SecurityGuard
			) >= 0;

		if (matchingLicence) {
			// expiry dates of both licences must match to be simultaneous
			licence.isSimultaneousFlow = matchingLicence.linkedSoleProprietorExpiryDate === licence.expiryDate;

			if (licence.hasSecurityGuardCategory) {
				licence.dogAuthorization = matchingLicence.useDogs ?? false;
				if (licence.dogAuthorization) {
					const dogDocumentInfos = licence.dogDocumentInfos ?? [];
					if (dogDocumentInfos.length > 0) {
						// get first document with an expiry date
						const doc = dogDocumentInfos.find((item: Document) => item.expiryDate);
						licence.dogAuthorizationExpiryDate = doc?.expiryDate ?? null;
					}
				}

				licence.restraintAuthorization = matchingLicence.carryAndUseRestraints ?? false;
				if (licence.restraintAuthorization) {
					const restraintsDocumentInfos = licence.restraintsDocumentInfos ?? [];
					if (restraintsDocumentInfos.length > 0) {
						// get first document with an expiry date
						const doc = restraintsDocumentInfos.find((item: Document) => item.expiryDate);
						licence.restraintAuthorizationExpiryDate = doc?.expiryDate ?? null;
					}
				}
			}
		}

		if (licence.licenceExpiryNumberOfDays >= 0) {
			if (
				this.isLicenceActive(licence.licenceStatusCode) &&
				today.isBefore(moment(licence.expiryDate).startOf('day').subtract(licenceUpdatePeriodPreventionDays, 'days'))
			) {
				licence.isUpdatePeriod = true;
			}

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

		// get Licence Reprint Fee
		const fee = this.getLicenceFee(
			basicLicence.serviceTypeCode!,
			ApplicationTypeCode.Replacement,
			bizTypeCode,
			basicLicence.licenceTermCode!
		);
		licence.licenceReprintFee = fee?.amount ? fee.amount : null;

		return licence;
	}
}
