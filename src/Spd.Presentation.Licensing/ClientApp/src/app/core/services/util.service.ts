import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { SortDirection } from '@angular/material/sort';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import * as CodeDescTypes from 'src/app/core/code-types/code-desc-types.models';
import { SelectOptions } from '../code-types/model-desc.models';

export interface LicenceStepperStepComponent {
	onStepNext(formNumber: number): void;
	onStepPrevious(): void;
	onFormValidNextStep(formNumber: number): void;
	onStepSelectionChange(event: StepperSelectionEvent): void;
	onGoToNextStep(): void;
	onGoToFirstStep(): void;
	onGoToLastStep(): void;
}

export interface LicenceChildStepperStepComponent {
	isFormValid(): boolean;
}

export interface LicenceDocument {
	Documents?: Array<File>;
	LicenceDocumentTypeCode?: LicenceDocumentTypeCode;
}

export class LicenceDocumentsToSave {
	'licenceDocumentTypeCode': LicenceDocumentTypeCode;
	'documents': Array<Blob>;
}

export interface SpdFile extends File {
	name: string;
	documentUrlId?: string | null;
	lastModifiedDate?: string | null;
}

export type SortWeight = -1 | 0 | 1;

@Injectable({ providedIn: 'root' })
export class UtilService {
	constructor(@Inject(DOCUMENT) private document: Document) {}

	//------------------------------------
	// Session storage
	readonly CM_CRC_STATE_KEY: string = SPD_CONSTANTS.sessionStorage.cmCrcStateKey;

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
		this.clearSessionData(this.CM_CRC_STATE_KEY);
	}

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
	getFullName(givenName: string | null | undefined, surname: string | null | undefined): string | null {
		const userNameArray: string[] = [];
		if (givenName) {
			userNameArray.push(givenName);
		}
		if (surname) {
			userNameArray.push(surname);
		}
		return userNameArray.join(' ');
	}

	getFullNameWithMiddle(
		givenName: string | null | undefined,
		middleName1: string | null | undefined,
		middleName2: string | null | undefined,
		surname: string | null | undefined
	): string {
		const userNameArray: string[] = [];
		if (givenName) {
			userNameArray.push(givenName);
		}
		if (middleName1) {
			userNameArray.push(middleName1);
		}
		if (middleName2) {
			userNameArray.push(middleName2);
		}
		if (surname) {
			userNameArray.push(surname);
		}
		return userNameArray.join(' ');
	}

	getBirthDateMax(): moment.Moment {
		return moment().startOf('day').subtract(SPD_CONSTANTS.date.birthDateMinAgeYears, 'years');
	}

	getIsFutureDate(aDate: string | null | undefined): boolean {
		if (!aDate) return false;
		return moment(aDate).startOf('day').isAfter(moment().startOf('day'), 'day');
	}

	getIsTodayOrFutureDate(aDate: string | null | undefined): boolean {
		if (!aDate) return false;
		return moment(aDate).startOf('day').isSameOrAfter(moment().startOf('day'), 'day');
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

	/**
	 * @description
	 * Generic sorting of a JSON object by direction.
	 */
	public sortByDirection<T>(a: T, b: T, direction: SortDirection = 'asc', withTrailingNull = true): SortWeight {
		let result: SortWeight;

		if (a === null && withTrailingNull) {
			result = -1;
		} else if (b === null && withTrailingNull) {
			result = 1;
		} else {
			result = this.sort(a, b);
		}

		if (direction === 'desc') {
			result *= -1;
		}

		return result as SortWeight;
	}

	/**
	 * @description
	 * Generic sorting of a JSON object by key.
	 */
	public sort<T>(a: T, b: T): SortWeight {
		return a > b ? 1 : a < b ? -1 : 0;
	}

	public sortDate(a: string | null | undefined, b: string | null | undefined): SortWeight {
		if (!a) {
			return -1;
		}
		if (!b) {
			return 1;
		}

		const aDate = moment(a).startOf('day');
		const bDate = moment(b).startOf('day');

		return aDate.isAfter(bDate) ? 1 : aDate.isBefore(bDate) ? -1 : 0;
	}

	//------------------------------------
	// Misc

	getDateString(date: Date): string {
		return date ? moment(date).format(SPD_CONSTANTS.date.dateFormat) : '';
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
			document.querySelector('mat-checkbox.ng-invalid') ||
			document.querySelector('form.ng-invalid');

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
	 * Convert BooleanTypeCode to boolean
	 * @param value
	 * @returns
	 */
	booleanTypeToBoolean(value: BooleanTypeCode | null): boolean | null {
		if (!value) return null;

		if (value == BooleanTypeCode.Yes) return true;
		return false;
	}

	/**
	 * Convert boolean to BooleanTypeCode
	 * @param value
	 * @returns
	 */
	public booleanToBooleanType(value: boolean | null | undefined): BooleanTypeCode | null {
		const isBooleanType = typeof value === 'boolean';
		if (!isBooleanType) return null;

		return value ? BooleanTypeCode.Yes : BooleanTypeCode.No;
	}

	public isBcAddress(province: string | null | undefined, country: string | null | undefined): boolean {
		return province === SPD_CONSTANTS.address.provinceBC && country === SPD_CONSTANTS.address.countryCanada;
	}

	public getPermitShowAdditionalGovIdData(
		isCanadianCitizen: boolean,
		isCanadianResident: boolean,
		canadianCitizenProofTypeCode: LicenceDocumentTypeCode | null,
		proofOfResidentStatusCode: LicenceDocumentTypeCode | null,
		proofOfCitizenshipCode: LicenceDocumentTypeCode | null
	): boolean {
		const canadianCitizenProof = canadianCitizenProofTypeCode ?? LicenceDocumentTypeCode.CanadianPassport;
		const proofOfResidentStatus = proofOfResidentStatusCode ?? LicenceDocumentTypeCode.PermanentResidentCard;
		const proofOfCitizenship = proofOfCitizenshipCode ?? LicenceDocumentTypeCode.NonCanadianPassport;

		return (
			(isCanadianCitizen && canadianCitizenProof != LicenceDocumentTypeCode.CanadianPassport) ||
			(!isCanadianCitizen &&
				isCanadianResident &&
				proofOfResidentStatus != LicenceDocumentTypeCode.PermanentResidentCard) ||
			(!isCanadianCitizen && !isCanadianResident && proofOfCitizenship != LicenceDocumentTypeCode.NonCanadianPassport)
		);
	}

	public getSwlShowAdditionalGovIdData(
		isCanadianCitizen: boolean,
		canadianCitizenProofTypeCode: LicenceDocumentTypeCode | null,
		notCanadianCitizenProofTypeCode: LicenceDocumentTypeCode | null
	): boolean {
		return this.getSwlOrControllingMemberCrcShowAdditionalGovIdData(
			isCanadianCitizen,
			canadianCitizenProofTypeCode,
			notCanadianCitizenProofTypeCode
		);
	}

	public getControllingMemberCrcShowAdditionalGovIdData(
		isCanadianCitizen: boolean,
		canadianCitizenProofTypeCode: LicenceDocumentTypeCode | null,
		notCanadianCitizenProofTypeCode: LicenceDocumentTypeCode | null
	): boolean {
		return this.getSwlOrControllingMemberCrcShowAdditionalGovIdData(
			isCanadianCitizen,
			canadianCitizenProofTypeCode,
			notCanadianCitizenProofTypeCode
		);
	}

	private getSwlOrControllingMemberCrcShowAdditionalGovIdData(
		isCanadianCitizen: boolean,
		canadianCitizenProofTypeCode: LicenceDocumentTypeCode | null,
		notCanadianCitizenProofTypeCode: LicenceDocumentTypeCode | null
	): boolean {
		const canadianCitizenProof = canadianCitizenProofTypeCode
			? canadianCitizenProofTypeCode
			: LicenceDocumentTypeCode.CanadianPassport;
		const notCanadianCitizenProof = notCanadianCitizenProofTypeCode
			? notCanadianCitizenProofTypeCode
			: LicenceDocumentTypeCode.PermanentResidentCard;

		return (
			(isCanadianCitizen && canadianCitizenProof != LicenceDocumentTypeCode.CanadianPassport) ||
			(!isCanadianCitizen && notCanadianCitizenProof != LicenceDocumentTypeCode.PermanentResidentCard)
		);
	}

	//------------------------------------
	// Form related

	enableInputs(form: FormGroup) {
		Object.keys(form.controls).forEach((control: string) => {
			const typedControl: AbstractControl = form.controls[control];
			typedControl.enable({ emitEvent: false });
		});
	}

	disableInputs(form: FormGroup) {
		Object.keys(form.controls).forEach((control: string) => {
			const typedControl: AbstractControl = form.controls[control];
			typedControl.disable({ emitEvent: false });
		});
	}

	enableFormArrayInputs(formArray: FormArray) {
		formArray.controls.forEach((control) => {
			control.enable({ emitEvent: false });
		});
	}

	disableFormArrayInputs(formArray: FormArray) {
		formArray.controls.forEach((control) => {
			control.disable({ emitEvent: false });
		});
	}
}
