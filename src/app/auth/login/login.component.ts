import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../shared/service/app.service';
import { DaoService } from '../../shared/service/dao.service';
import { autoSubmit, log } from '../../shared/utils/utils';
// import { NotificationsService } from 'angular2-notifications/dist';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
	public submit = false;
	public username = localStorage.getItem('username');

	@ViewChild('overlay') private overlay: ElementRef;
	@ViewChild('fullPage') private page: ElementRef;
	@ViewChild('register') private register: ElementRef;

	constructor(
		public appState: AppState,
		private router: Router,
		private daoService: DaoService,
		// private notif: NotificationsService
	) {
	}

	public ngOnInit() {
		setTimeout(() => {
			this.overlay.nativeElement.classList.add('show');
			this.page.nativeElement.classList.add('show');
		}, 10);
	}

	public closeLoginPage(event) {
		if (event.target === this.page.nativeElement || event.target === this.register.nativeElement) {
			if (event.target === this.register.nativeElement) {
				this.router.navigateByUrl('/');
			}
			this.overlay.nativeElement.classList.remove('show');
			this.page.nativeElement.classList.remove('show');
			setTimeout(() => {
				this.appState.set('login', false);
			}, 400);
		}
	}

	public loginSubmit(event) {
		this.submit = true;
		autoSubmit(event)
		.then(data => {
			this.daoService.loginUser(data.username.trim().toLowerCase(), data.password)
			.then(response => {
				this.submit = false;
				this.appState.setConnectionState(response._id, response.username, response.userInfos);
				this.router.navigateByUrl(`/profile/${response.username}`);
				if (data.rememberme) {
					localStorage.setItem('username', response.username);
				}
				this.closeLoginPage({target: this.page.nativeElement});
			})
			.catch(err => {
				this.submit = false;
				let message = err.text();
				if (message === 'Invalid password') {
					// this.notif.error(
					// 	'Error',
					// 	message
					// );
				} else {
					// this.notif.error(
					// 	'Error',
					// 	'An error occurred, please try again'
					// );
				}
				log('errorLogin', 'login.component.ts:78', message);
			});
		})
		.catch(err => {
			this.submit = false;
			// this.notif.error(
			// 	'Error',
			// 	'Please fill out required fields'
			// );
		});
	}
}
