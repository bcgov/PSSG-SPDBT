import { DOCUMENT } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import { ApplicationPortalStatusCode, PaginationResponse, ScreeningTypeCode } from 'src/app/api/models';
import * as CodeDescTypes from 'src/app/core/code-types/code-desc-types.models';
import { CaptchaResponse, CaptchaResponseType } from 'src/app/shared/components/captcha-v2.component';
import { ApplicationPortalStatusTypes, ScreeningTypes, SelectOptions } from '../code-types/model-desc.models';
import { SPD_CONSTANTS } from '../constants/constants';

@Injectable({ providedIn: 'root' })
export class UtilService {
	constructor(@Inject(DOCUMENT) private document: Document, private hotToastService: HotToastService) {}

	//------------------------------------
	// Session storage
	readonly ORG_REG_STATE_KEY: string = SPD_CONSTANTS.sessionStorage.organizationRegStateKey;
	readonly CRRPA_PORTAL_STATE_KEY: string = SPD_CONSTANTS.sessionStorage.crrpaPortalStateKey;
	readonly PSSOA_PORTAL_STATE_KEY: string = SPD_CONSTANTS.sessionStorage.pssoaPortalStateKey;

	setSessionData(key: string, data: any): void {
		sessionStorage.setItem(key, data);
	}

	getSessionData(key: string): any {
		return sessionStorage.getItem(key);
	}

	clearSessionData(key: string): void {
		sessionStorage.removeItem(key);
	}

	clearAllSessionData(): void {
		this.clearSessionData(this.ORG_REG_STATE_KEY);
		this.clearSessionData(this.CRRPA_PORTAL_STATE_KEY);
		this.clearSessionData(this.PSSOA_PORTAL_STATE_KEY);
	}

	//------------------------------------
	// Table config
	getDefaultQueryParams(): any {
		return { page: 0, pageSize: SPD_CONSTANTS.list.defaultPageSize };
	}

	getDefaultTablePaginatorConfig(): PaginationResponse {
		const defaultTableConfig: PaginationResponse = {
			pageSize: SPD_CONSTANTS.list.defaultPageSize,
			pageIndex: 0,
			length: 0,
		};
		return defaultTableConfig;
	}

	//------------------------------------
	// Generic
	getFullName(firstName: string | null | undefined, lastName: string | null | undefined): string | null {
		if (!firstName && !lastName) return null;

		return `${firstName ?? ''} ${lastName ?? ''}`.trim();
	}

	getBirthDateMax(): moment.Moment {
		return moment().subtract(SPD_CONSTANTS.date.birthDateMinAgeYears, 'years');
	}

	removeFirstFromArray<T>(array: T[], toRemove: T): void {
		const index = array.indexOf(toRemove);

		if (index !== -1) {
			array.splice(index, 1);
		}
	}

	getDecodedAccessToken(token: string): any {
		try {
			return jwt_decode(token);
		} catch (Error) {
			return null;
		}
	}

	getAddressString(params: {
		addressLine1: string;
		addressLine2?: string;
		city: string;
		province: string;
		country: string;
		postalCode: string;
	}): string {
		let addrString = params.addressLine1;
		addrString += `${params.addressLine2 ? ', ' + params.addressLine2 : ''}`;
		addrString += `${params.city ? ', ' + params.city : ''}`;
		addrString += `${params.province ? ', ' + params.province : ''}`;
		addrString += `${params.country ? ', ' + params.country : ''}`;
		addrString += `${params.postalCode ? ', ' + params.postalCode : ''}`;

		return addrString;
	}

	//------------------------------------
	// Code Table

	private getCodeDescByType<K extends keyof typeof CodeDescTypes>(key: K): (typeof CodeDescTypes)[K] {
		return CodeDescTypes[key];
	}

	getDescByCode(codeTableName: keyof typeof CodeDescTypes, input: string): string {
		const codeDescs = this.getCodeDescByType(codeTableName);
		return codeDescs ? (codeDescs.find((item: SelectOptions) => item.code == input)?.desc as string) ?? '' : '';
	}

	getCodeDescSorted(codeTableName: keyof typeof CodeDescTypes): SelectOptions[] {
		const codeDescs = this.getCodeDescByType(codeTableName);
		codeDescs.sort((a: SelectOptions, b: SelectOptions) => this.compareByStringUpper(a.desc ?? '', b.desc));
		return codeDescs;
	}

	//------------------------------------
	// Download File
	downloadFile(headers: HttpHeaders, file: Blob, notFoundMessage?: string | undefined): void {
		let fileName = 'download-file';
		const contentDisposition = headers.get('Content-Disposition');
		if (contentDisposition) {
			const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
			const matches = fileNameRegex.exec(contentDisposition);
			if (matches != null && matches[1]) {
				fileName = matches[1].replace(/['"]/g, '');
			}
		}

		if (file?.size > 0) {
			const url = window.URL.createObjectURL(file);
			const anchor = document.createElement('a');
			anchor.href = url;
			anchor.download = fileName;
			document.body.appendChild(anchor);
			anchor.click();
			document.body.removeChild(anchor);
		} else {
			this.hotToastService.error(
				notFoundMessage ? notFoundMessage : 'File could not be found. Please try again later.'
			);
			console.error(`fileName ${fileName} is empty`);
		}
	}

	//------------------------------------
	// Misc
	getApplicationPortalStatusClass(code: string | null | undefined): string {
		if (!code) {
			return '';
		}

		let currClass = 'mat-chip-grey';

		switch (code) {
			case ApplicationPortalStatusCode.InProgress:
				currClass = 'mat-chip-green';
				break;
			case ApplicationPortalStatusCode.VerifyIdentity:
			case ApplicationPortalStatusCode.AwaitingPayment:
			case ApplicationPortalStatusCode.AwaitingThirdParty:
			case ApplicationPortalStatusCode.AwaitingApplicant:
				currClass = 'mat-chip-yellow';
				break;
			case ApplicationPortalStatusCode.RiskFound:
				currClass = 'mat-chip-red';
				break;
			case ApplicationPortalStatusCode.Draft:
			case ApplicationPortalStatusCode.Incomplete:
			case ApplicationPortalStatusCode.UnderAssessment:
				currClass = 'mat-chip-blue';
				break;
		}

		return currClass;
	}

	getApplicationPortalStatusDesc(code: string): string {
		return (ApplicationPortalStatusTypes.find((item: SelectOptions) => item.code == code)?.desc as string) ?? '';
	}

	getApplicationPortalStatusHint(code: string): string {
		return (ApplicationPortalStatusTypes.find((item: SelectOptions) => item.code == code)?.extra as string) ?? '';
	}

	getDateString(date: Date): string {
		return date ? moment(date).format(SPD_CONSTANTS.date.dateFormat) : '';
	}

	getShowScreeningType(
		licenseesNeedVulnerableSectorScreening: boolean,
		contractorsNeedVulnerableSectorScreening: boolean
	): boolean {
		if (!licenseesNeedVulnerableSectorScreening && !contractorsNeedVulnerableSectorScreening) {
			return false;
		}

		return true;
	}

	getScreeningTypes(
		licenseesNeedVulnerableSectorScreening: boolean,
		contractorsNeedVulnerableSectorScreening: boolean
	): SelectOptions[] {
		if (!licenseesNeedVulnerableSectorScreening && contractorsNeedVulnerableSectorScreening) {
			return ScreeningTypes.filter((item) => item.code != ScreeningTypeCode.Licensee);
		} else if (licenseesNeedVulnerableSectorScreening && !contractorsNeedVulnerableSectorScreening) {
			return ScreeningTypes.filter((item) => item.code != ScreeningTypeCode.Contractor);
		}

		return ScreeningTypes; // show all values
	}

	captchaTokenResponse(captchaResponse: CaptchaResponse): boolean {
		return !!(captchaResponse.type === CaptchaResponseType.success && captchaResponse.resolved);
	}

	/**
	 * @description
	 * Scroll to the top of the mat-sidenav container.
	 */
	public scrollTop() {
		const contentContainer = this.document.querySelector('.mat-sidenav-content') || window;
		contentContainer.scroll({ top: 0, left: 0, behavior: 'smooth' });
	}

	/**
	 * @description
	 * Scroll to have the element in view.
	 */
	public scrollTo(el: Element | null): void {
		if (el) {
			el.scrollIntoView({
				block: 'start',
				inline: 'nearest',
				behavior: 'smooth',
			});
		}
	}

	/**
	 * @description
	 * Scroll to a material form field that is invalid, and if contained
	 * within a <section> scroll to the section instead.
	 */
	public scrollToErrorSection(): void {
		const firstElementWithError =
			document.querySelector('mat-form-field.ng-invalid') ||
			document.querySelector('mat-radio-group.ng-invalid') ||
			document.querySelector('mat-checkbox.ng-invalid');

		if (firstElementWithError) {
			const element =
				firstElementWithError.closest('section') == null
					? firstElementWithError
					: firstElementWithError.closest('section');

			this.scrollTo(element);
		} else {
			this.scrollTop();
		}
	}

	/**
	 * @description
	 * Scroll to a material form checkbox field that is invalid.
	 */
	public scrollToCheckbox(): void {
		const firstElementWithError = document.querySelector('mat-checkbox.ng-invalid');

		if (firstElementWithError) {
			this.scrollTo(firstElementWithError);
		} else {
			this.scrollTop();
		}
	}

	//------------------------------------
	// Sort

	private compareByString(a: any, b: any, ascending = true) {
		if (ascending) {
			if (a < b) {
				return -1;
			}
			if (a > b) {
				return 1;
			}
		} else {
			if (a < b) {
				return 1;
			}
			if (a > b) {
				return -1;
			}
		}
		return 0;
	}

	compareByStringUpper(a: string | null | undefined, b: string | null | undefined, ascending = true) {
		const aUpper = a ? a.toUpperCase() : '';
		const bUpper = b ? b.toUpperCase() : '';
		return this.compareByString(aUpper, bUpper, ascending);
	}
}
