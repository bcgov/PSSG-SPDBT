import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormatPhoneNumberPipe } from '@app/shared/pipes/phone-number.pipe';

@Directive({
	selector: '[formControlName][appPhoneNumberTransform]',
})
export class PhoneNumberTransformDirective implements OnInit {
	private el: any;

	constructor(
		public ngControl: NgControl,
		private elementRef: ElementRef,
		private formatPhoneNumberPipe: FormatPhoneNumberPipe
	) {
		this.el = this.elementRef.nativeElement;
	}

	ngOnInit() {
		this.el.value = this.transform(this.el.value);
	}

	@HostListener('blur') onChange() {
		const oldval = this.el.value;
		this.el.value = this.transform(oldval);
		this.el.dispatchEvent(new Event('input'));
	}

	transform(value: any) {
		return this.formatPhoneNumberPipe.transform(value);
	}
}
