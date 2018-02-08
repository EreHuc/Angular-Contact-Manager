import { Component } from '@angular/core';
import { AppState } from '../../shared/service/app.service';

@Component({
	selector: 'congrat',
	templateUrl: './congrat.component.html',
	styleUrls: ['./congrat.component.css']
})

export class CongratComponent {
	constructor(public appState: AppState) {}
}
