import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../shared/service/app.service';
import { DaoService } from '../../shared/service/dao.service';
import { autoSubmit } from '../../shared/utils/utils';
import { PushNotificationsService } from 'ng-push';

@Component({
	selector: 'signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})

export class SignupComponent {
	public submit = false;

	@ViewChild('spinnerBtn') private el: ElementRef;

	constructor(
		public appState: AppState,
		private daoService: DaoService,
		private notif: PushNotificationsService,
		private router: Router
	) {
	}

	public signupSubmit(event) {
		event.preventDefault();
		this.submit = true;
		autoSubmit(event)
		.then(data => {
			let newUser = {
				firstname: data.firstname,
				lastname: data.lastname,
				email: data.email,
				password: data.password
			};
			if (data.password !== data.confirm) {
				// TODO refaire les notifs
				// this.notif.error(
				// 	'Error',
				// 	'Password must be the same'
				// );
				let confirmEl = event.target.elements['confirm'];
				confirmEl.parentElement.classList.add('error', 'focused');
				this.submit = false;
			} else {
				this.daoService.createNewUser(newUser)
				.then(res => {
					this.appState.set('userInfo', {
						firstname: newUser.firstname,
						lastname: newUser.lastname,
						email: newUser.email
					});
					this.router.navigateByUrl('/congrat');
					this.submit = false;
				})
				.catch(err => {
					let errorMessage = 'An error occurs, please try again later';

					if (err.message === 'Email already taken') {
						errorMessage = err.message;
						event.target.elements['email'].parentElement.classList.add('error', 'focused');
					}
					// this.notif.error(
					// 	'Error',
					// 	errorMessage
					// );
					this.submit = false;
				});
			}
		})
		.catch(error => {
			// this.notif.error(
			// 	'Error',
			// 	'Please fill out required fields'
			// );
			this.submit = false;
		});
	}
}
