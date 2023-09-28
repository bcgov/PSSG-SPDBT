import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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

	public static conditionalDefaultRequiredValidator =
		(inputName: string, requiredWhen: (form: AbstractControl) => boolean): ValidatorFn =>
		(form: AbstractControl): ValidationErrors | null => {
			let targetInput = form.get(inputName);
			if (targetInput) {
				let isRequired = requiredWhen(form);
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

	public static atLeastOneCheckboxValidator =
		(minRequired = 1): ValidatorFn =>
		(form: AbstractControl): ValidationErrors | null => {
			let checked = 0;
			console.log('form', form);
			Object.keys(form.value).forEach((key) => {
				const control = form.value[key];

				if (control === true) {
					checked++;
				}
			});

			if (checked < minRequired) {
				return {
					atLeastOneCheckboxValidator: true,
				};
			}

			return null;
		};
}
