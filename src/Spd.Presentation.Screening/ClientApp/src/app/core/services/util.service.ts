import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { PaginationResponse } from 'src/app/api/models';
import { SPD_CONSTANTS } from '../constants/constants';

@Injectable({ providedIn: 'root' })
export class UtilService {
	readonly ORG_REG_STATE_KEY = SPD_CONSTANTS.sessionStorage.organizationRegStateKey;

	getFullName(firstName: string | null, lastName: string | null): string {
		return `${firstName ?? ''} ${lastName ?? ''}`;
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

	removeFirst<T>(array: T[], toRemove: T): void {
		const index = array.indexOf(toRemove);

		if (index !== -1) {
			array.splice(index, 1);
		}
	}
}
