import { Component, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'datatables.net';
import 'angular-datatables';
import { AppState } from '../shared/service/app.service';
import { DaoService } from '../shared/service/dao.service';

@Component({
	selector: 'dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
	public dataSource;

	constructor(public appState: AppState, private daoService: DaoService) {
	}

	public ngOnInit() {
		this.daoService.getContactList(this.appState.get('userId'))
		.subscribe(data => {
			console.log(data);
		});
	}
}
