import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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

	public static match(controlName: string, checkControlName: string): ValidatorFn {
		return (controls: AbstractControl) => {
			const control = controls.get(controlName);
			const checkControl = controls.get(checkControlName);

			if (checkControl?.errors && !checkControl.errors['nomatch']) {
				return null;
			}

			if (control?.value !== checkControl?.value) {
				controls.get(checkControlName)?.setErrors({ nomatch: true });
				return { nomatch: true };
			} else {
				return null;
			}
		};
	}

	public static atleastonerequired(controlName1: string, controlName2: string): ValidatorFn {
		return (controls: AbstractControl) => {
			const control1 = controls.get(controlName1);
			const control2 = controls.get(controlName2);

			if (!control1?.value && !control2?.value) {
				return { atleastonerequired: true };
			} else {
				return null;
			}
		};
	}
}
