import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { SpdLibraryFormatPhoneNumberPipe } from './spd-library-format-phone-number.pipe';

@Directive({
  selector: '[formControlName][appPhoneNumberTransform]',
  standalone: false,
})
export class SpdLibraryPhoneNumberTransformDirective implements OnInit {
  private el: any;

  constructor(
    private elementRef: ElementRef,
    private formatPhoneNumberPipe: SpdLibraryFormatPhoneNumberPipe
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
