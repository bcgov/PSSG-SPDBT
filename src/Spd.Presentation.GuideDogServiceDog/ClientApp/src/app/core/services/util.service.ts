import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from '@angular/material/sort';
import { LicenceDocumentTypeCode, LicenceStatusCode, ServiceTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { HotToastService } from '@ngxpert/hot-toast';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import * as CodeDescTypes from 'src/app/core/code-types/code-desc-types.models';
import { SelectOptions } from '../code-types/model-desc.models';
import { MainLicenceResponse } from './common-application.service';

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
	isFormValid(): any;
}

export class LicenceDocumentsToSave {
	'licenceDocumentTypeCode': LicenceDocumentTypeCode;
	'documents': Array<Blob>;
}

export type SortWeight = -1 | 0 | 1;

@Injectable({ providedIn: 'root' })
export class UtilService {
	constructor(
		@Inject(DOCUMENT) private document: Document,
		private dialog: MatDialog,
		private formatDatePipe: FormatDatePipe,
		private hotToastService: HotToastService
	) {}

	//------------------------------------
	// Session storage
	setSessionData(key: string, data: any): void {
		sessionStorage.setItem(key, data);
	}

	getSessionData(key: string): any {
		return sessionStorage.getItem(key);
	}

	clearSessionData(key: string): void {
		sessionStorage.removeItem(key);
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

	getFullNameWithOneMiddle(
		givenName: string | null | undefined,
		middleName: string | null | undefined,
		surname: string | null | undefined
	): string | null {
		const userNameArray: string[] = [];
		if (givenName) {
			userNameArray.push(givenName);
		}
		if (middleName) {
			userNameArray.push(middleName);
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

	getToday(): moment.Moment {
		return moment().startOf('day');
	}

	getBirthDateMax(): moment.Moment {
		return moment().startOf('day').subtract(SPD_CONSTANTS.date.birthDateMinAgeYears, 'years');
	}

	getDateMin(): moment.Moment {
		return moment('1800-01-01');
	}

	getDogBirthDateMax(): moment.Moment {
		return moment().startOf('day').subtract(6, 'months');
	}

	getDogDateMin(): moment.Moment {
		return moment().startOf('day').subtract(50, 'years');
	}

	getIsFutureDate(aDate: string | null | undefined): boolean {
		if (!aDate) return false;
		return moment(aDate).startOf('day').isAfter(moment().startOf('day'), 'day');
	}

	getIsTodayOrFutureDate(aDate: string | null | undefined): boolean {
		if (!aDate) return false;
		return moment(aDate).startOf('day').isSameOrAfter(moment().startOf('day'), 'day');
	}

	getIsDate5YearsOrOlder(aDate: string | null | undefined): boolean {
		if (!aDate) return false;

		const dateDay = moment(aDate).startOf('day');

		const today = moment().startOf('day');
		const yearsDiff = today.diff(dateDay, 'years');
		return yearsDiff >= 5;
	}

	getIsDateMonthsOrOlder(aDate: string | null | undefined, periodMonths: number): boolean {
		if (!aDate) return false;

		const dateDay = moment(aDate).startOf('day');

		const today = moment().startOf('day');
		const monthsDiff = today.diff(dateDay, 'months', true);
		return monthsDiff > periodMonths;
	}

	removeFirstFromArray<T>(array: T[], toRemove: T): void {
		const index = array.indexOf(toRemove);

		if (index !== -1) {
			array.splice(index, 1);
		}
	}

	getStringOrNull(value: any): string | null {
		if (!value) return null;
		return value;
	}

	getDecodedAccessToken(token: string): any {
		try {
			return jwtDecode(token);
		} catch (_error: any) {
			return null;
		}
	}

	getAddressString(params: {
		addressLine1: string | null | undefined;
		addressLine2?: string | null | undefined;
		city: string | null | undefined;
		province: string | null | undefined;
		country: string | null | undefined;
		postalCode: string | null | undefined;
	}): string {
		const addressArray: string[] = [];
		if (params.addressLine1) {
			addressArray.push(params.addressLine1);
		}
		if (params.addressLine2) {
			addressArray.push(params.addressLine2);
		}
		if (params.city) {
			addressArray.push(params.city);
		}
		if (params.province) {
			addressArray.push(params.province);
		}
		if (params.country) {
			addressArray.push(params.country);
		}
		if (params.postalCode) {
			addressArray.push(params.postalCode);
		}
		return addressArray.join(' ');
	}

	//------------------------------------
	// Code Table

	private getCodeDescByType<K extends keyof typeof CodeDescTypes>(key: K): (typeof CodeDescTypes)[K] {
		return CodeDescTypes[key];
	}

	getDescByCode(codeTableName: keyof typeof CodeDescTypes, input: string): string {
		const codeDescs = this.getCodeDescByType(codeTableName);
		return codeDescs ? ((codeDescs.find((item: SelectOptions) => item.code == input)?.desc as string) ?? '') : '';
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

	public sortDate(
		a: string | null | undefined,
		b: string | null | undefined,
		direction: SortDirection = 'asc'
	): SortWeight {
		if (!a) {
			return -1;
		}
		if (!b) {
			return 1;
		}

		const aDate = moment(a).startOf('day');
		const bDate = moment(b).startOf('day');

		if (direction === 'asc') {
			return aDate.isAfter(bDate) ? 1 : aDate.isBefore(bDate) ? -1 : 0;
		} else {
			return aDate.isAfter(bDate) ? -1 : aDate.isBefore(bDate) ? 1 : 0;
		}
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
	 * Has a boolean value (true/false)... is not null or undefined
	 * @param value
	 * @returns
	 */
	public hasBooleanValue(value: boolean | null | undefined): boolean {
		const isBooleanType = typeof value === 'boolean';
		return isBooleanType;
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
		return (
			(province === SPD_CONSTANTS.address.provinceBC || province === SPD_CONSTANTS.address.provinceBritishColumbia) &&
			(country === SPD_CONSTANTS.address.countryCA || country === SPD_CONSTANTS.address.countryCanada)
		);
	}

	/**
	 * Convert date to format for DB
	 * @param value
	 * @returns
	 */
	public dateToDbDate(value: string | null | undefined): string | null {
		if (!value) return null;

		return this.formatDatePipe.transform(value, SPD_CONSTANTS.date.backendDateFormat);
	}

	/**
	 * Convert date to format
	 * @param value
	 * @returns
	 */
	public dateToDateFormat(
		value: string | null | undefined,
		format = SPD_CONSTANTS.date.formalDateFormat
	): string | null {
		if (!value) return null;

		return this.formatDatePipe.transform(value, format);
	}

	isLicenceActive(licenceStatusCode: LicenceStatusCode | null | undefined): boolean {
		if (!licenceStatusCode) return false;

		return licenceStatusCode === LicenceStatusCode.Active;
	}

	isExpiredLicenceRenewable(licence: MainLicenceResponse): boolean {
		if (
			licence.licenceStatusCode != LicenceStatusCode.Expired ||
			(licence.serviceTypeCode != ServiceTypeCode.GdsdTeamCertification &&
				licence.serviceTypeCode != ServiceTypeCode.RetiredServiceDogCertification)
		) {
			return false;
		}

		const period = SPD_CONSTANTS.periods.gdsdLicenceRenewAfterExpiryPeriodMonths;
		return !this.getIsDateMonthsOrOlder(licence.expiryDate, period);
	}

	//------------------------------------
	// Form related

	enableInputs(form: FormGroup) {
		Object.keys(form.controls).forEach((control: string) => {
			const typedControl: AbstractControl = form.controls[control];
			typedControl.enable({ emitEvent: false });
		});
	}

	disableInputs(form: FormGroup, doNotIncludeControlNames: Array<string> | null = null) {
		Object.keys(form.controls).forEach((control: string) => {
			if (!doNotIncludeControlNames?.includes(control)) {
				const typedControl: AbstractControl = form.controls[control];
				typedControl.disable({ emitEvent: false });
			}
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

	toasterSuccess(msg: string): void {
		this.hotToastService.success(msg, { ariaLive: 'polite' });
	}

	dialogSuccess(msg: string): void {
		const data: DialogOptions = {
			icon: 'info',
			title: 'Success',
			message: msg,
			cancelText: 'OK',
		};

		this.dialog.open(DialogComponent, { data });
	}

	dialogError(msg: string): void {
		const data: DialogOptions = {
			icon: 'dangerous',
			title: 'Error',
			message: msg,
			cancelText: 'OK',
		};

		this.dialog.open(DialogComponent, { data });
	}
}
