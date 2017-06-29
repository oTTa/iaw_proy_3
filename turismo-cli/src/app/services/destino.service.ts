import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import  {GLOBAL} from './global';

@Injectable()
export class DestinoService {
	public url: string;
	constructor (private _http: Http){
		this.url = GLOBAL.url;
	}

	crear_destino (destino_nuevo){
		let params = JSON.stringify(destino_nuevo);
		let identity = JSON.parse(localStorage.getItem('identity'));

		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization': localStorage.getItem('token')
	});

		return this._http.post(this.url+'destinos',params, {headers: headers})
		.map(res => res.json());
	}

	get_destinos (page,nombre=null){
		if (!nombre)
			return this._http.get(this.url+'destinos?page='+page)
			.map(res => res.json());
		else
			return this._http.get(this.url+'destinos?page='+page+'&nombre='+nombre)
			.map(res => res.json());
	}



}

