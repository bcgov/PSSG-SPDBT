import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { ApplicationPortalStatusCode, PaginationResponse } from 'src/app/api/models';
import { SPD_CONSTANTS } from '../constants/constants';
import { ApplicationPortalStatusCodes, SelectOptions } from '../constants/model-desc';

@Injectable({ providedIn: 'root' })
export class UtilService {
	readonly ORG_REG_STATE_KEY = SPD_CONSTANTS.sessionStorage.organizationRegStateKey;

	getFullName(firstName: string | null, lastName: string | null): string {
		return `${firstName ?? ''} ${lastName ?? ''}`.trim();
	}

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

	getDecodedAccessToken(token: string): any {
		try {
			return jwt_decode(token);
		} catch (Error) {
			return null;
		}
	}

	setOrgRegState(data: any): void {
		sessionStorage.setItem(this.ORG_REG_STATE_KEY, data);
	}

	getOrgRegState(): any {
		return sessionStorage.getItem(this.ORG_REG_STATE_KEY);
	}

	clearOrgRegState(): void {
		sessionStorage.removeItem(this.ORG_REG_STATE_KEY);
	}

	removeFirstFromArray<T>(array: T[], toRemove: T): void {
		const index = array.indexOf(toRemove);

		if (index !== -1) {
			array.splice(index, 1);
		}
	}

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
			case ApplicationPortalStatusCode.Incomplete:
			case ApplicationPortalStatusCode.UnderAssessment:
				currClass = 'mat-chip-blue';
				break;
		}

		const desc = (ApplicationPortalStatusCodes.find((item: SelectOptions) => item.code == code)?.desc as string) ?? '';
		return [desc, currClass];
	}
}
