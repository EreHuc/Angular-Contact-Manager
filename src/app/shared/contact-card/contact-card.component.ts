import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-contact-card',
	templateUrl: './contact-card.component.html',
	styleUrls: ['./contact-card.component.css']
})
export class ContactCardComponent implements OnInit {
	@Input() user;

	constructor() {
		console.log('contact-card.component.ts:12 - ', this.user);
	}

	ngOnInit() {
	}

}
