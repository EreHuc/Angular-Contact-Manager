import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../shared/service/app.service';

@Component({
	selector: 'top-bar',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './top-bar.component.html',
	styleUrls: ['./top-bar.component.css']
})

export class TopBarComponent {
	@ViewChild('navbarCollapse') private el: ElementRef;

	constructor(public appState: AppState, public router: Router) {
	}

	public openSearch() {
		if (this.appState.get('searchBar')) {
			this.closeSearch();
		} else {
			this.appState.set('searchBar', true);
		}
	}

	public closeSearch() {
		this.appState.set('searchBar', false);
	}

	public toogleSettings() {
		this.appState.set('settingsBar', !this.appState.get('settingsBar'));
	}

	public myCollapse() {
		let navBar = this.el.nativeElement;
		if (navBar.classList.contains('open')) {
			navBar.classList.remove('open');
		} else {
			navBar.classList.add('open');
		}
	}

	public toggleLeftBar(event) {
		let icon = event.target;
		let innerHtml = icon.innerHTML;
		if (innerHtml === 'menu') {
			this.appState.set('leftBar', true);
		} else {
			this.appState.set('leftBar', false);
		}
	}
}
