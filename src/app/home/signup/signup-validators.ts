import { AbstractControl } from '@angular/forms';

export class SignupValidator {
	static confirmPassword(c: AbstractControl) {
		if (!c.parent || !c) return;
		const pwd = c.parent.get('password');
		const cpwd = c.parent.get('confirm');
		if (!pwd || !cpwd) return;
		if (pwd.value !== cpwd.value) {
			return {invalid: true};
		}
	}
}
