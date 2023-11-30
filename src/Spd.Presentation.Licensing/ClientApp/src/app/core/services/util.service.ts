import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
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

	getBirthDateStartAt(): moment.Moment {
		return moment().subtract(SPD_CONSTANTS.date.birthDateStartAtYears, 'years');
	}

	getBirthDateMax(): moment.Moment {
		return moment().subtract(SPD_CONSTANTS.date.birthDateMinAgeYears, 'years');
	}

	getIsFutureDate(aDate: string): boolean {
		return moment(aDate).isAfter(moment());
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
		return date ? moment(date).format(SPD_CONSTANTS.date.dateFormat) : '';
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
