import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { PaginationResponse } from 'src/app/api/models';
import * as CodeDescTypes from 'src/app/core/code-types/code-desc-types.models';
import { SelectOptions } from '../code-types/model-desc.models';
import { SPD_CONSTANTS } from '../constants/constants';

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

	getBirthDateStartAt(): Date {
		const today = new Date();
		today.setFullYear(today.getFullYear() - SPD_CONSTANTS.date.birthDateStartAtYears);
		return today;
	}

	getBirthDateMax(): Date {
		const today = new Date();
		today.setFullYear(new Date().getFullYear() - SPD_CONSTANTS.date.birthDateMinAgeYears);
		return today;
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
		return `${params.addressLine1}, ${params.addressLine2 ? params.addressLine2 + ',' : ''} ${params.city}, ${
			params.province
		}, ${params.country}, ${params.postalCode}`;
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
	downloadFile(headers: HttpHeaders, file: Blob): void {
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
			console.error(`fileName ${fileName} is empty`);
		}
	}

	//------------------------------------
	// Misc

	getDateString(date: Date): string {
		let d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [year, month, day].join('-');
	}

	//------------------------------------
	// Sort

	private compareByString(a: any, b: any, ascending: boolean = true) {
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

	compareByStringUpper(a: string | null | undefined, b: string | null | undefined, ascending: boolean = true) {
		const aUpper = a ? a.toUpperCase() : '';
		const bUpper = b ? b.toUpperCase() : '';
		return this.compareByString(aUpper, bUpper, ascending);
	}
}
