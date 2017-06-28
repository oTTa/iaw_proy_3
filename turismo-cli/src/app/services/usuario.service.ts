import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import  {GLOBAL} from './global';

@Injectable()
export class UsuarioService {
	public url: string;
	public identity;
	public token;
	constructor (private _http: Http){
		this.url = GLOBAL.url;
	}

	signup(user_login){
		let json = JSON.stringify(user_login);
		let params = json;

		let headers = new Headers({'Content-Type':'application/json'});

		return this._http.post(this.url+'usuarios/login',params, {headers: headers})
		.map(res => res.json());
	}

	registro (user_register){
		let params = JSON.stringify(user_register);

		let headers = new Headers({'Content-Type':'application/json'});

		return this._http.post(this.url+'usuarios',params, {headers: headers})
		.map(res => res.json());
	}

	modificar (user_changes){
		let params = JSON.stringify(user_changes);
		let identity = JSON.parse(localStorage.getItem('identity'));

		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization': localStorage.getItem('token')
	});

		return this._http.put(this.url+'usuarios/'+identity._id,params, {headers: headers})
		.map(res => res.json());
	}


	get_identity(){
		let identity = JSON.parse(localStorage.getItem('identity'));
		if (identity != "undefined"){
			this.identity = identity;
		}
		else{
			this.identity = null;
		}
		return this.identity;
	}

	get_token(){
		let token = localStorage.getItem('token');
		if (token != "undefined"){
			this.token = token;
		}
		else{
			this.token = null;
		}
		return this.token;
	}
}

