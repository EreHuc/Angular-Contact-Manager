import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DaoService } from '../../shared/service/dao.service';
import { AppState } from '../../shared/service/app.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

// import { NotificationsService } from 'angular2-notifications/dist';

@Component({
	selector: 'verify',
	templateUrl: './verify.component.html',
	styleUrls: ['./verify.component.css'],
	providers: [DaoService]
})

export class VerifyComponent implements OnInit {
	public verify;
	public loading = true;
	public submit = false;
	public nameTaken = false;
	verifyForm: FormGroup;

	constructor(public appState: AppState,
				private daoService: DaoService,
				private route: ActivatedRoute,
				private router: Router,
				private snackBar: MatSnackBar
	) {
		this.verifyForm = this.buildForm();
	}

	public ngOnInit() {
		this.route.params.subscribe(param => {
			this.daoService.verifyUser(param.hash)
				.subscribe(user => {
					this.verify = !!user._id;
					this.loading = false;
					if (this.verify) {
						this.appState.set('userInfo', user.userInfos || {});
						this.appState.set('userId', user._id);
					}
				}, err => {
					this.verify = false;
					this.loading = false;
				});
		});
	}

	public submitUsername(username): void {
		this.submit = true;
		if (!this.nameTaken) {
			this.daoService.setUsername(username.trim().toLowerCase(), this.appState.get('userId'))
				.subscribe(data => {
					this.submit = false;
					this.appState.set('username', data.username);
					this.appState.set('connected', true);
					this.router.navigateByUrl(`/profile/${data}`);
				}, err => {
					//todo notification ici
					console.error(err);
					let errorMessage = 'An error occurs, please try again later';

					if (err.error === 'Username already taken') {
						errorMessage = err.error;
					}
					this.snackBar.open(errorMessage, '', {
						duration: 2000,
					});
					this.submit = false;
				});
		}
	}

	public checkUsernameValidity(event): void {
		let username = event.target.value.trim().toLowerCase();
		this.nameTaken = false;
		if (username) {
			this.daoService.findUser({username}, {verified: 0, createdAt: 0, token: 0})
				.subscribe(data => {
					if (data.length) {
						this.nameTaken = true;
					}
				});
		}
	}

	public preventChar(event) {
		let character = event.char || event.key;
		if (!character.match(/\w/)) {
			event.preventDefault();
		}
	}

	private buildForm(): FormGroup {
		return new FormGroup({
			username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]))
		})
	}
}
