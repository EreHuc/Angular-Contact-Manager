import { Directive, ElementRef } from '@angular/core';
import * as Wave from 'node-waves';

@Directive({
	selector: '[wave]'
})

export class WaveDirective {
	constructor(private el: ElementRef) {
		Wave.init();
		Wave.attach(el.nativeElement, ['waves-block']);
	}
}

@Directive({
	selector: '[wave-ripple]'
})

export class WaveRippleDirective {
	constructor(private el: ElementRef) {
		el.nativeElement.classList.add('waves-effect');
		Wave.init();
		Wave.ripple(el.nativeElement, {
			wait: 1000, // ms
			position: { // This position relative to HTML element.
				x: 0, // px
				y: 0  // px
			}
		});
	}
}
