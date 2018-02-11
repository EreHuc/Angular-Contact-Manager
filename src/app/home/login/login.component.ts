import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../shared/service/app.service';
import { DaoService } from '../../shared/service/dao.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// import { NotificationsService } from 'angular2-notifications/dist';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
	public submit = false;

	@ViewChild('overlay') private overlay: ElementRef;
	@ViewChild('fullPage') private page: ElementRef;
	@ViewChild('register') private register: ElementRef;

	loginForm: FormGroup;

	constructor(public appState: AppState,
				private router: Router,
				private daoService: DaoService,
				// private notif: NotificationsService
	) {
		this.loginForm = this.buildForm();
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

	public loginSubmit(loginInfos) {
		this.submit = true;
		this.daoService.loginUser(loginInfos.username.trim().toLowerCase(), loginInfos.password)
			.subscribe(response => {
				this.submit = false;
				this.appState.setConnectionState(response._id, response.username, response.userInfos);
				this.router.navigateByUrl(`/profile/${response.username}`);
				if (loginInfos.rememberme) {
					localStorage.setItem('username', response.username);
				}
				this.closeLoginPage({target: this.page.nativeElement});
				this.appState.saveState();
			}, err => {
				// todo debug error handler
				this.submit = false;
				if (err === 'Invalid password') {
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
			});
	}

	private buildForm(): FormGroup {
		return new FormGroup({
			username: new FormControl(localStorage.getItem('username') || '', Validators.required),
			password: new FormControl('', Validators.required),
			rememberme: new FormControl('')
		});
	}
}
