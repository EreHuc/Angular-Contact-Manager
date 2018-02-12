import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../shared/service/app.service';
import { DaoService } from '../../shared/service/dao.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignupValidator } from './signup-validators';
import { MatSnackBar } from '@angular/material';

const emailRegexPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

@Component({
	selector: 'signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})

export class SignupComponent {
	public submit = false;
	signupForm: FormGroup;

	constructor(public appState: AppState,
				private daoService: DaoService,
				private router: Router,
				private snackBar: MatSnackBar) {
		this.signupForm = this.buildSignupForm();
	}

	public signupSubmit(signupFormValue) {
		this.submit = true;
		this.daoService.createNewUser(signupFormValue)
			.subscribe(
				() => {
					this.appState.set('userInfo', {
						firstname: signupFormValue.firstname,
						lastname: signupFormValue.lastname,
						email: signupFormValue.email
					});
					this.router.navigateByUrl('/congrat');
					this.submit = false;
				},
				err => {
					let errorMessage = 'An error occurs, please try again later';

					if (err.error === 'Email already taken') {
						errorMessage = err.error;
					}
					this.snackBar.open(errorMessage, '', {
						duration: 2000,
					});
					this.submit = false;
				}
			);
	}

	private buildSignupForm(): FormGroup {
		return new FormGroup({
			firstname: new FormControl('', Validators.required),
			lastname: new FormControl('', Validators.required),
			email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(emailRegexPattern)])),
			password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
			confirm: new FormControl('', Validators.compose([Validators.required, SignupValidator.confirmPassword])),
			terms: new FormControl('', Validators.required)
		});
	}
}
