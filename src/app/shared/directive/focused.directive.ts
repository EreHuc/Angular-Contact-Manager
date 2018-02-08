import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[focusedInput]'
})

export class FocusedDirective {
	constructor(private el: ElementRef) {
	}

	@HostListener('focusin')
	private onFocusIn() {
		let parentElem = this.el.nativeElement.parentElement;
		let parentClassList = parentElem.classList.value;
		if (~parentClassList.indexOf('error')) {
			parentElem.classList.remove('error');
		}
		if (~parentClassList.indexOf('form-line')) {
			parentElem.classList.add('focused');
		}
	}

	@HostListener('focusout')
	private onFocusOut() {
		let parentElem = this.el.nativeElement.parentElement;
		parentElem.classList.remove('focused');
	}
}
