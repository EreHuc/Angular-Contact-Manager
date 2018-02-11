import { Component, OnInit } from '@angular/core';
import { AppState } from '../../shared/service/app.service';

@Component({
	selector: 'profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit{
	constructor(public appState: AppState) {
	}

	public ngOnInit() {
		console.log(this.appState);
	}
}
