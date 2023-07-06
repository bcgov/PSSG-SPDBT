import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormControlValidators } from './form-control.validators';

export class FormGroupValidators {
	public static conditionalRequiredValidator =
		(inputName: string, requiredWhen: (form: AbstractControl) => boolean): ValidatorFn =>
		(form: AbstractControl): ValidationErrors | null => {
			let targetInput = form.get(inputName);
			if (targetInput) {
				let isRequired = requiredWhen(form);
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
}
