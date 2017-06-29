import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import  {GLOBAL} from './global';

@Injectable()
export class PaqueteService {
	public url: string;
	constructor (private _http: Http){
		this.url = GLOBAL.url;
	}

	crear_paquete(paquete_nuevo){
		let params = JSON.stringify(paquete_nuevo);

		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization': localStorage.getItem('token')
	});

		return this._http.post(this.url+'paquetes',params, {headers: headers})
		.map(res => res.json());
	}

	editar_paquete (paquete_editar){
		let params = JSON.stringify(paquete_editar);

		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization': localStorage.getItem('token')
	});

		return this._http.put(this.url+'paquete/'+paquete_editar._id,params, {headers: headers})
		.map(res => res.json());
	}

	borrar_paquete (id){
		let headers = new Headers({
			'Authorization': localStorage.getItem('token')
		});

		return this._http.delete(this.url+'paquetes/'+id, {headers: headers})
		.map(res => res.json());
	}

	get_paquetes (page,id_destino){
			return this._http.get(this.url+'destinos/'+id_destino+'/paquetes?page='+page)
			.map(res => res.json());
	}

	get_imagenes (id_paq){
			return this._http.get(this.url+'paquetes/'+id_paq+'/imagenes')
			.map(res => res.json());
	}

	borrar_imagen (id_paquete, id_imagen){
		let headers = new Headers({
			'Authorization': localStorage.getItem('token')
		});

		return this._http.delete(this.url+'paquetes/'+id_paquete+'/imagenes/'+id_imagen, {headers: headers})
		.map(res => res.json());
	}

	comentar (id_paquete,comentario){
		let params = JSON.stringify(comentario);

		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization': localStorage.getItem('token')
		});

		return this._http.post(this.url+'paquetes/'+id_paquete+'/comentarios',params, {headers: headers})
		.map(res => res.json());
	}

	get_comentarios (id_paq){
			return this._http.get(this.url+'paquetes/'+id_paq+'/comentarios')
			.map(res => res.json());
	}


}

