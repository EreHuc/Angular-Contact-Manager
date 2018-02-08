import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AppState } from '../app.service';

@Injectable()
export class PublicRouterService implements CanActivate {

	constructor(
		private router: Router,
		private appState: AppState
	) {
	}

	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (!this.appState.get('connected')) {
			return true;
		} else {
			let username = this.appState.get('username');
			if (username) {
				this.router.navigateByUrl(`/dashboard/${username}`);
			} else {
				this.router.navigateByUrl('/');
			}
			return false;
		}
	}

}
