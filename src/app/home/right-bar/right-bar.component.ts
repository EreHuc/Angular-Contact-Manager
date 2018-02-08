import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../../shared/service/app.service';

@Component({
	selector: 'right-bar',
	templateUrl: './right-bar.component.html',
	styleUrls: ['./right-bar.component.css']
})

export class RightBarComponent {
	constructor(public appState: AppState) {}
}
