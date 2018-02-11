import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppState } from './shared/service/app.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	@ViewChild('content') private el: ElementRef;

	constructor(public appState: AppState) {
	}

	public ngOnInit() {
		this.appState.initAppState();
	}

	public hideSettings() {
		this.appState.set('settingsBar', false);
		this.appState.set('leftBar', false);
	}
}