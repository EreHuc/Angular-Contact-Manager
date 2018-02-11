import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../../user-info';
import { environment } from '../../../environments/environment';

const API_URL: string = environment.apiUrl;
@Injectable()
export class DaoService {

	private _url = `${API_URL}/api`;

	constructor(private http: HttpClient) {
	}

	public createNewUser(user: any): Observable<any> {
		return this.http
			.post(`${this._url}/users/insert`, user)
			.map(res => res)
			.catch(this.handleError);
	}

	public verifyUser(hash: string): Observable<any> {
		return this.http
			.put(`${this._url}/users/verify`, {query: {'token.verify': hash}})
			.map(res => res)
			.catch(this.handleError);
	}

	public loginUser(username: string, password: string): Observable<any> {
		return this.http
			.post(`${this._url}/users/login`, {query: {username, verified: true}, password})
			.map(res => res)
			.catch(this.handleError);
	}

	public findUser(query, projection?, options?): Observable<any> {
		return this.http
			.post(`${this._url}/users/find`, {query, projection, options})
			.map(res => res)
			.catch(this.handleError);
	}

	public setUsername(username:string, userId:string): Observable<any> {
		return this.http
			.post(`${this._url}/users/set-username`, {username, userId})
			.map(res => res)
			.catch(this.handleError);
	}

	public getContactList(userId: string): Observable<UserInfo[]> {
		return this.http
			.get(`${this._url}/users/contact-list/${userId}`)
			.map(res => res)
			.catch(this.handleError);
	}

	private handleError(error: any): Observable<any> {
		console.error(error);
		return Observable.throw(error.error || 'Server Error');
	}
}
