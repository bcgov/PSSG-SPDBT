import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { ApplicationPortalStatusCode, PaginationResponse } from 'src/app/api/models';
import { SPD_CONSTANTS } from '../constants/constants';
import { ApplicationPortalStatusCodes, SelectOptions } from '../constants/model-desc';

@Injectable({ providedIn: 'root' })
export class UtilService {
	//------------------------------------
	// Session storage
	readonly ORG_REG_STATE_KEY: string = SPD_CONSTANTS.sessionStorage.organizationRegStateKey;
	readonly CRC_PORTAL_STATE_KEY: string = SPD_CONSTANTS.sessionStorage.crcPortalStateKey;

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
		this.clearSessionData(this.CRC_PORTAL_STATE_KEY);
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
	getFullName(firstName: string | null | undefined, lastName: string | null | undefined): string {
		return `${firstName ?? ''} ${lastName ?? ''}`.trim();
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

	//------------------------------------
	// Misc
	getApplicationPortalStatus(code: string | null | undefined): [string, string] {
		if (!code) {
			return ['', ''];
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

		const desc = (ApplicationPortalStatusCodes.find((item: SelectOptions) => item.code == code)?.desc as string) ?? '';
		return [desc, currClass];
	}

	geApplicationPortalStatusDesc(code: string): string {
		return (ApplicationPortalStatusCodes.find((item: SelectOptions) => item.code == code)?.desc as string) ?? '';
	}
}
