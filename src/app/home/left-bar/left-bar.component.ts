import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../../shared/service/app.service';

@Component({
	selector: 'left-bar',
	templateUrl: './left-bar.component.html',
	styleUrls: ['./left-bar.component.css']
})

export class LeftBarComponent implements OnInit {
	@ViewChild('userInfo') public userInfo: ElementRef;
	@ViewChild('legal') public legal: ElementRef;
	@ViewChild('sidebar') public sidebar: ElementRef;

	constructor(public appState: AppState) {
	}

	public ngOnInit() {}

	public listHeight() {
		let sidebarHeight = Number(this.sidebar.nativeElement.offsetHeight);
		let offsetHeight = (Number(this.userInfo.nativeElement.offsetHeight) + Number(this.legal.nativeElement.offsetHeight));
		let calculateHeight = sidebarHeight - offsetHeight;
		return calculateHeight > 0 ? calculateHeight : 20;
	}
}
