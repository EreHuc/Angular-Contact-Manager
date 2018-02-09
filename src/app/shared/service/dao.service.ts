import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import { HttpClient, HttpParams } from '@angular/common/http';

const API_URL: string = '127.0.0.1';
const API_PORT: string = '3000';

@Injectable()
export class DaoService {

	private _url = `http://${API_URL}:${API_PORT}/api`;

	constructor(private http: HttpClient) {
	}

	public createNewUser(user: any): Promise<any> {
		return this.http.post(`${this._url}/users/insert`, user)
		.toPromise()
		.then(res => res)
		.catch(this.handleError);
	}

	public verifyUser(hash: string): Promise<any> {
		// todo get to post on server
        let httpParams = new HttpParams();
        httpParams.append('query', JSON.stringify({query: {'token.verify': hash}}));
        return this.http
		.get(`${this._url}/users/verify`, {params: httpParams})
		.toPromise()
		.then(res => res)
		.catch(this.handleError);
	}

	public loginUser(username: string, password: string): Promise<any> {
		// todo get to post on server
		let httpParams = new HttpParams();
		httpParams.append('query', JSON.stringify({username, verified: true}));
		httpParams.append('password', password);
		return this.http
		.get(`${this._url}/users/login`, {params: httpParams})
		.toPromise()
		.then(res => res)
		.catch(this.handleError);
	}

	public findUser(query, projection?, options?): Promise<any> {
		return this.http
		.get(`${this._url}/users/get`, {params: {query, projection, options}})
		.toPromise()
		.then(res => res)
		.catch(this.handleError);
	}

	public setUsername(username, userId): Promise<any> {
		return this.http
		.put(`${this._url}/users/set-username`, {username, userId})
		.toPromise()
		.then(res => res)
		.catch(this.handleError);
	}

	public getContactList(userId): Observable<Response> {
		return this.http.get(`${this._url}/users/contact-list`, {params: {userId}})
			.map(res => res)
			.catch((error: any) => Observable.throw(error.json() || 'Server Error'));
	}

	private handleError(error: any): Promise<any> {
		return Promise.reject(error);
	}
}
