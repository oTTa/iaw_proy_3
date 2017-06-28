export class Paquete {

	constructor(
		public fecha_salida: Date,
		public fecha_regreso: Date,
		public costo: Number,
		public descripcion: String,
		public url_video: String,
		public destino: String
	){}	

}