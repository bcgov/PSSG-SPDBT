import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { LicenceAppDocumentResponse } from 'src/app/api/models';
import * as CodeDescTypes from 'src/app/core/code-types/code-desc-types.models';
import { SelectOptions } from '../code-types/model-desc.models';
import { SPD_CONSTANTS } from '../constants/constants';

export interface SpdFile extends File {
	name: string;
	documentUrlId?: string | null;
	lastModifiedDate?: string | null;
}

@Injectable({ providedIn: 'root' })
export class UtilService {
	//------------------------------------
	// Table config
	getDefaultQueryParams(): any {
		return { page: 0, pageSize: SPD_CONSTANTS.list.defaultPageSize };
	}

	getDefaultTablePaginatorConfig(): any {
		//PaginationResponse {
		const defaultTableConfig: any = {
			//PaginationResponse = { TODO
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

	getIsFutureDate(aDate: string): boolean {
		const today = new Date();
		const otherDate = new Date(aDate);
		return otherDate.getTime() > today.getTime();
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

	dummyFile(item: LicenceAppDocumentResponse): SpdFile {
		const b: SpdFile = new Blob(undefined, { type: item.documentExtension ?? '' }) as SpdFile;
		b.documentUrlId = item.documentUrlId;
		b.name = item.documentName ?? '';
		return b;
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
