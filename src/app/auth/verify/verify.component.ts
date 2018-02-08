import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DaoService } from '../../shared/service/dao.service';
import { AppState } from '../../shared/service/app.service';
import { log } from '../../shared/utils/utils';
// import { NotificationsService } from 'angular2-notifications/dist';

@Component({
	selector: 'verify',
	templateUrl: './verify.component.html',
	styleUrls: ['./verify.component.css'],
	providers: [DaoService]
})

export class VerifyComponent implements OnInit {
	public verify;
	public submit = false;

	constructor(
		public appState: AppState,
		private daoService: DaoService,
		private route: ActivatedRoute,
		private router: Router,
		// private notify: NotificationsService
	) {
	}

	public ngOnInit() {
		this.route.params.subscribe(param => {
			this.daoService.verifyUser(param.hash)
			.then(user => {
				this.verify = !!user._id;
				if (this.verify) {
					log('', 'verify.component.ts:30', user);
					this.appState.set('userInfo', user.userInfos || {});
					this.appState.set('userId', user._id);
				}
			})
			.catch(err => {
				this.verify = false;
				log('err', 'verify.component.ts:19', err.text());
			});
		});
	}

	public submitUsername(event): void {
		log('setUsername', 'verify.component.ts:44', event);
		this.submit = true;
		let username = event.target.elements['username'];
		if (username.classList.contains('taken')) {
			// this.notify.error(
			// 	'Error',
			// 	'Username not available'
			// );
			this.submit = false;
		} else {
			if (!username.value) {
				// this.notify.error(
				// 	'Error',
				// 	'Fill out required fields'
				// );
				this.submit = false;
			} else {
				this.daoService.setUsername(username.value.trim().toLowerCase(), this.appState.get('userId'))
				.then(data => {
					log('submitSuccess', 'verify.component.ts:65', data);
					this.submit = false;
					this.appState.set('username', data);
					this.appState.set('connected', true);
					this.router.navigateByUrl(`/profile/${data}`);
				})
				.catch(err => {
					log('submitError', 'verify.component.ts:68', err);
					this.submit = false;
				});
			}
		}
	}

	public checkUsernameValidity(event): void {
		let username = event.target.value.trim().toLowerCase();
		if (username) {
			this.daoService.findUser({username}, {verified: 0, createdAt: 0, token: 0})
			.then(data => {
				if (data.length) {
					event.target.classList.add('taken');
					event.target.parentElement.classList.add('error', 'focused');
					// this.notify.error(
					// 	'Error',
					// 	'Username not available'
					// );
				} else {
					event.target.classList.remove('taken');
					event.target.parentElement.classList.remove('error');
				}
			})
			.catch(err => {
				log('don', 'verify.component.ts:67', err);
			});
		}
	}

	public preventChar(event) {
		log('preventChar', 'verify.component.ts:104', event.char || event.key);
		let character = event.char || event.key;
		if (!character.match(/\w/)) {
			event.preventDefault();
		}
	}
}
