import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FormControlValidators {
	/**
	 * @description
	 * Checks the form control value is letters, spaces, hyphens.
	 */
	public static stringalpha(control: AbstractControl): ValidationErrors | null {
		if (!control.value) {
			return null;
		}

		const regExp = /^[a-zA-Z -]+$/i;
		const valid = control.valid && regExp.test(control.value);
		return valid ? null : { stringalpha: true };
	}

	/**
	 * @description
	 * Checks the form control value is letters.
	 */
	public static alpha(control: AbstractControl): ValidationErrors | null {
		if (!control.value) {
			return null;
		}
		const regExp = /^[a-z]+$/i;
		const valid = control.valid && regExp.test(control.value);
		return valid ? null : { alpha: true };
	}

	/**
	 * @description
	 * Checks the form control value is letters or numerals.
	 */
	public static alphanumeric(control: AbstractControl): ValidationErrors | null {
		if (!control.value) {
			return null;
		}
		const regExp = new RegExp(/^[a-zA-Z0-9]*$/);
		const valid = control.valid && regExp.test(control.value);
		return valid ? null : { alphanumeric: true };
	}

	/**
	 * @description
	 * Checks the form control value is a currency.
	 *
	 * 0?               The string can start with a zero if the value is zero, OR
	 * (?![0,])         The string can NOT start with zero or a comma, AND
	 * (,?[\d]{1,3})+   The string must contain numbers and decimals only, commas
	 *                  are prevented from being side-by-side, or coming before
	 *                  a decimal
	 * (\.[\d]{2})?     The string will either have a fraction with a precision
	 *                  of 2, or no fraction
	 */
	public static currency(control: AbstractControl): ValidationErrors | null {
		if (!control.value) {
			return null;
		}
		// Doesn't allow . or .# only .## or no decimal
		const regExp = /^(0?|(?![0,])(,?[\d]{1,3})+)(\.[\d]{2})?$/;
		const valid = control.valid && regExp.test(control.value);
		return valid ? null : { currency: true };
	}

	/**
	 * @description
	 * Checks the form control value is a float.
	 */
	public static float(control: AbstractControl, precision: number = 2): ValidationErrors | null {
		if (!control.value) {
			return null;
		}
		// Doesn't allow . or .# only .##+ or no decimal
		const regExp = /^[-+]?(0?|(?![0,])(,?[\d]{1,3})+)(\.[\d]{2,})?$/;
		const valid = control.valid && regExp.test(control.value);
		return valid ? null : { float: true };
	}

	/**
	 * @description
	 * Checks the form control value is numeric.
	 */
	public static numeric(control: AbstractControl): ValidationErrors | null {
		if (!control.value) {
			return null;
		}
		const regExp = /^[0-9]+$/;
		const valid = control.valid && regExp.test(control.value);
		return valid ? null : { numeric: true };
	}

	/**
	 * @description
	 * Checks the form control value is a percentage.
	 */
	public static percent(control: AbstractControl): ValidationErrors | null {
		if (!control.value) {
			return null;
		}
		const regExp = /^([0-9]|([1-9][0-9])|100)(\.[\d]{0,2})?$/;
		const valid = control.valid && regExp.test(control.value);
		return valid ? null : { percent: true };
	}

	/**
	 * @description
	 * Checks a form control is within a valid length,
	 * if there is no maxLength, it will be assumed to be the same as minLength.
	 */
	public static requiredLength(minLength: number, maxLength?: number): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!control.value) {
				return null;
			}
			if (!maxLength) {
				maxLength = minLength;
			}
			const currentLength = control.value.length;
			const valid = control.valid && currentLength >= minLength && currentLength <= maxLength;
			return valid ? null : { length: true };
		};
	}
}
