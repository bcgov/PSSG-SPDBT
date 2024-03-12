import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
	ApplicationTypeCode,
	BusinessTypeCode,
	LicenceFeeResponse,
	LicenceTermCode,
	PaymentLinkCreateRequest,
	PaymentLinkResponse,
	PaymentMethodCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { PaymentService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { ConfigService } from '@app/core/services/config.service';
import { FileUtilService } from '@app/core/services/file-util.service';
import { BehaviorSubject } from 'rxjs';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';

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
		private fileUtilService: FileUtilService,
		private configService: ConfigService,
		private paymentService: PaymentService,
		private authProcessService: AuthProcessService
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
			switch (workerLicenceTypeCode) {
				case WorkerLicenceTypeCode.SecurityBusinessLicence: {
					title = 'Security Business Licence';
					mobileTitle = 'SBL';
					break;
				}
				case WorkerLicenceTypeCode.SecurityWorkerLicence: {
					title = 'Security Worker Licence';
					mobileTitle = 'SWL';
					break;
				}
				case WorkerLicenceTypeCode.ArmouredVehiclePermit: {
					title = 'Armoured Vehicle Permit';
					mobileTitle = 'AVP';
					break;
				}
				case WorkerLicenceTypeCode.BodyArmourPermit: {
					title = 'Body Armour Permit';
					mobileTitle = 'BAP';
					break;
				}
			}

			if (applicationTypeCode) {
				title += ` - ${applicationTypeCode}`;
				mobileTitle += ` ${applicationTypeCode}`;
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
