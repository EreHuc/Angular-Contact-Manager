import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppState } from '../../shared/service/app.service';
import { DaoService } from '../../shared/service/dao.service';
import { USERS } from './mock-users';

@Component({
	selector: 'dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, AfterViewInit {
	public users = USERS;

	constructor(public appState: AppState, private daoService: DaoService) {

	}

	public ngOnInit() {

	}

	public ngAfterViewInit() {

	}
}
/*
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { merge } from 'rxjs/observable/merge';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UserInfo } from '../../user-info';

public displayedColumns = ['profilePicture', 'firstname', 'lastname', 'email'];
public dataSource: MatTableDataSource<UserInfo>;
public resultsLength = 0;
public isLoadingResults = true;
public isRateLimitReached = false;
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

this.dataSource = new MatTableDataSource<UserInfo>();

this.dataSource.sort = this.sort;
		merge(this.paginator.page)
			.pipe(
				startWith({}),
				switchMap(() => {
					this.isLoadingResults = true;
					return this.daoService.getContactList(this.appState.get('userId'));
				}),
				map((userInfo: UserInfo[]) => {
					// Flip flag to show that loading has finished.
					this.isLoadingResults = false;
					this.isRateLimitReached = false;
					this.resultsLength = userInfo.length;

					return userInfo;
				}),
				catchError(() => {
					this.isLoadingResults = false;
					// Catch if the GitHub API has reached its rate limit. Return empty data.
					this.isRateLimitReached = true;
					return of([]);
				})
			).subscribe((userInfo: UserInfo[]) => this.dataSource.data = userInfo);
 */