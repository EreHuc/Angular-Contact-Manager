import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { encrypt } from './shared/utils/utils';
import { AppState } from './shared/service/app.service';
import { DaoService } from './shared/service/dao.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	public notifOptions = {
		timeOut: 3000,
		showProgressBar: true,
		pauseOnHover: false,
		clickToClose: false,
		preventDuplicates: true
	};

	// public _ = _;

	@ViewChild('content') private el: ElementRef;

	constructor(
		public appState: AppState,
		public apiService: DaoService,
	) {
	}

	public ngOnInit() {
		this.appState.initAppState();
	}

	public hideSettings() {
		this.appState.set('settingsBar', false);
		this.appState.set('leftBar', false);
	}

	@HostListener('window:beforeunload')
	private saveState() {
		let stateMap = this.appState.get();
		localStorage.setItem('stateMap', encrypt(stateMap));
	}
}