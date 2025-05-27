import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import moment from 'moment';
import { FormControlValidators } from './form-control.validators';

export class FormGroupValidators {
	public static conditionalRequiredValidator =
		(inputName: string, requiredWhen: (form: AbstractControl) => boolean): ValidatorFn =>
		(form: AbstractControl): ValidationErrors | null => {
			const targetInput = form.get(inputName);
			if (targetInput) {
				const isRequired = requiredWhen(form);
				if (isRequired != targetInput.hasValidator(FormControlValidators.required)) {
					if (isRequired) {
						targetInput.addValidators(FormControlValidators.required);
					} else {
						targetInput.removeValidators(FormControlValidators.required);
					}
					targetInput.updateValueAndValidity({ onlySelf: true });
				}
			}
			return null;
		};

	public static conditionalDefaultRequiredTrueValidator =
		(inputName: string, requiredWhen: (form: AbstractControl) => boolean): ValidatorFn =>
		(form: AbstractControl): ValidationErrors | null => {
			const targetInput = form.get(inputName);
			if (targetInput) {
				const isRequired = requiredWhen(form);
				if (isRequired != targetInput.hasValidator(Validators.requiredTrue)) {
					if (isRequired) {
						targetInput.addValidators(Validators.requiredTrue);
					} else {
						targetInput.removeValidators(Validators.requiredTrue);
					}
					targetInput.updateValueAndValidity({ onlySelf: true });
				}
			}
			return null;
		};

	public static conditionalDefaultRequiredValidator =
		(inputName: string, requiredWhen: (form: AbstractControl) => boolean): ValidatorFn =>
		(form: AbstractControl): ValidationErrors | null => {
			const targetInput = form.get(inputName);
			if (targetInput) {
				const isRequired = requiredWhen(form);
				if (isRequired != targetInput.hasValidator(Validators.required)) {
					if (isRequired) {
						targetInput.addValidators(Validators.required);
					} else {
						targetInput.removeValidators(Validators.required);
					}
					targetInput.updateValueAndValidity({ onlySelf: true });
				}
			}
			return null;
		};

	public static daterangeValidator(controlName1: string, controlName2: string): ValidatorFn {
		return (controls: AbstractControl) => {
			const control1 = controls.get(controlName1);
			const control2 = controls.get(controlName2);
			if (!control1 || !control2) return null;

			const value1 = control1?.value;
			const value2 = control2?.value;
			if (!value1 || !value2) return null;

			const value1Date = moment(value1).startOf('day');
			const value2Date = moment(value2).startOf('day');
			if (!value1Date || !value2Date) return null;

			if (value1Date.isAfter(value2Date)) return { daterange: true };

			return null;
		};
	}
}
