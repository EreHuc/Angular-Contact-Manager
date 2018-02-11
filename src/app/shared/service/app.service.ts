import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { CookieService } from 'ngx-cookie-service';

export type InternalStateType = {
	[key: string]: any
};

const expireTime = 1;

@Injectable()
export class AppState {

	constructor(private utils: UtilsService, private cookie: CookieService) {
	}

	public _state: InternalStateType = {};

	/**
	 * Already return a clone of the current state.
	 */
	public get state() {
		return this._state = this._clone(this._state);
	}

	/**
	 * Never allow mutation
	 */
	public set state(value) {
		throw new Error('do not mutate the `.state` directly');
	}

	public get(prop?: any) {
		/**
		 * Use our state getter for the clone.
		 */
		const state = this.state;
		if (prop) {
			return state.hasOwnProperty(prop) ? state[prop] : null;
		} else {
			return state;
		}
	}

	public set(prop: string, value: any) {
		/**
		 * Internally mutate our state.
		 */
		this._state[prop] = value;
		this.saveState();
	}

	public initAppState(): void {
		let _stateMapHash = this.cookie.get('stateMap');
		let stateMap = {};
		if (_stateMapHash) {
			stateMap = this.utils.decrypt(_stateMapHash);
		} else {
			stateMap = {
				title: 'Angular - Contact Manager',
				version: '1.0',
			};
			this.resetUiState();
			this.resetConnectionState();
		}
		Object.keys(stateMap).forEach(key => {
			this.set(key, stateMap[key]);
		});
	}

	public resetUiState(): void {
		let stateMap = {
			searchBar: false,
			settingsBar: false,
			leftBar: false,
			login: false
		};
		Object.keys(stateMap).forEach(key => {
			this.set(key, stateMap[key]);
		});
	}

	public resetConnectionState(): void {
		let stateMap = {
			userInfo: {},
			connected: false,
			userId: null,
			username: null
		};
		Object.keys(stateMap).forEach(key => {
			this.set(key, stateMap[key]);
		});
		this.saveState();
	}

	public setConnectionState(userId, username, userInfo): void {
		let stateMap = {
			userInfo,
			userId,
			username,
			connected: true
		};
		Object.keys(stateMap).forEach(key => {
			this.set(key, stateMap[key]);
		});
	}

	private _clone(object: InternalStateType) {
		/**
		 * Simple object clone.
		 */
		return JSON.parse(JSON.stringify(object));
	}

	public saveState() {
		const expireDate = new Date().setDate(new Date().getDate() + expireTime);
		this.cookie.set('stateMap', this.utils.encrypt(this._state), expireDate);
	}
}
