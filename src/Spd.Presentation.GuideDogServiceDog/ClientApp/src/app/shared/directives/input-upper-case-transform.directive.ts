import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
	selector: '[appInputUpperCaseTransform]',
	standalone: false,
})
export class InputUpperCaseTransformDirective {
	constructor(private control: NgControl) {}

	@HostListener('input', ['$event.target.value'])
	onInput(value: string) {
		const upper = value.toUpperCase();
		this.control.control?.setValue(upper, { emitEvent: false });
	}
}
