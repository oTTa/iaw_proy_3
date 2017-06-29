import { Destino } from './destino';

export class Paquete_destino {

	constructor(
		public fecha_salida: String,
		public fecha_regreso: String,
		public costo: Number,
		public descripcion: String,
		public url_video: String,
		public destino: Destino,
	){}	

}