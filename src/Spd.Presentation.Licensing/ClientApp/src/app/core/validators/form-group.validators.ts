import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BizTypeCode, LicenceStatusCode, PoliceOfficerRoleCode } from '@app/api/models';
import { BooleanTypeCode } from '../code-types/model-desc.models';
import { SPD_CONSTANTS } from '../constants/constants';
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

	public static nopoliceofficerValidator(controlName: string, checkControlName: string): ValidatorFn {
		return (controls: AbstractControl) => {
			const control = controls.get(controlName);
			const checkControl = controls.get(checkControlName);

			if (checkControl?.value === BooleanTypeCode.Yes && control?.value === PoliceOfficerRoleCode.PoliceOfficer) {
				return { nopoliceofficer: true };
			}
			return null;
		};
	}

	public static licencemustbeactiveValidator(controlName: string, checkControlName: string): ValidatorFn {
		return (controls: AbstractControl) => {
			const control = controls.get(controlName);
			const checkControl = controls.get(checkControlName);

			if (
				checkControl?.value == BizTypeCode.NonRegisteredSoleProprietor ||
				checkControl?.value == BizTypeCode.RegisteredSoleProprietor
			) {
				if (control?.value != LicenceStatusCode.Active) {
					return { licencemustbeactive: true };
				}
			}

			return null;
		};
	}

	public static controllingmembersValidator(controlArrayName1: string, controlArrayName2: string): ValidatorFn {
		return (controls: AbstractControl) => {
			const control1 = controls.get(controlArrayName1);
			const control2 = controls.get(controlArrayName2);

			const value1 = control1?.value;
			const value2 = control2?.value;

			const count = value1.length + value2.length;

			if (count === 0) return { controllingmembersmin: true };
			if (count > SPD_CONSTANTS.maxCount.controllingMembers) return { controllingmembersmax: true };

			return null;
		};
	}

	public static employeesValidator(controlArrayName: string): ValidatorFn {
		return (controls: AbstractControl) => {
			const control = controls.get(controlArrayName);
			const value = control?.value;
			const count = value.length;

			if (count > SPD_CONSTANTS.maxCount.employees) return { employeesmax: true };

			return null;
		};
	}

	public static matchValidator(controlName: string, checkControlName: string): ValidatorFn {
		return (controls: AbstractControl) => {
			const control = controls.get(controlName);
			const checkControl = controls.get(checkControlName);

			if (checkControl?.errors && !checkControl.errors['nomatch']) {
				return null;
			}

			if (control?.value !== checkControl?.value) {
				controls.get(checkControlName)?.setErrors({ nomatch: true });
				return { nomatch: true };
			}
			return null;
		};
	}

	public static atLeastOneTrueValidator =
		(minRequired = 1): ValidatorFn =>
		(form: AbstractControl): ValidationErrors | null => {
			let checked = 0;
			Object.keys(form.value).forEach((key) => {
				const control = form.value[key];

				if (control === true) {
					checked++;
				}
			});

			if (checked < minRequired) {
				return {
					atLeastOneTrue: true,
				};
			}

			return null;
		};

	public static atLeastOneCheckboxValidator =
		(requiredKey: string | null, requiredValue: string | null, minRequired = 1): ValidatorFn =>
		(form: AbstractControl): ValidationErrors | null => {
			// Check if this validation is required:
			if (requiredKey && requiredValue && form.parent?.get(requiredKey)?.value != requiredValue) {
				return null;
			}

			let checked = 0;
			Object.keys(form.value).forEach((key) => {
				const control = form.value[key];

				if (control === true) {
					checked++;
				}
			});

			if (checked < minRequired) {
				return {
					atLeastOneCheckbox: true,
				};
			}

			return null;
		};

	public static atLeastOneCheckboxWhenReqdValidator =
		(childFormGroup: string, requiredKey: string, requiredValue: string, minRequired = 1): ValidatorFn =>
		(form: AbstractControl): ValidationErrors | null => {
			// Check if this validation is required:
			if (requiredKey && requiredValue && form.get(requiredKey)?.value != requiredValue) {
				return null;
			}

			const checkboxFormGroup = form.get(childFormGroup!) as FormGroup;
			if (!checkboxFormGroup) return null;

			let checked = 0;
			Object.keys(checkboxFormGroup.value).forEach((key: any) => {
				const control = checkboxFormGroup.value[key];

				if (control === true) {
					checked++;
				}
			});

			return checked < minRequired ? { atLeastOneCheckboxWhenReqd: true } : null;
		};
}
