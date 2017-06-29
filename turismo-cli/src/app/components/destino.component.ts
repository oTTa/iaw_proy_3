import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { DestinoService } from '../services/destino.service';
import  {GLOBAL} from '../services/global';
import { Destino } from '../models/destino';
import { AgmCoreModule } from '@agm/core';



@Component({
  selector: 'app-inicio',
  templateUrl: '../views/destino/destinos.html',
  styleUrls: ['../../assets/css/template/template.css','../../assets/css/template/formulario.css'],
  providers: [UsuarioService, DestinoService]
})

export class DestinoComponent implements OnInit{
  public identity;
  public token;
  public url: string;
  public lat: number = -38.8009237;
  public lng: number = -62.343585;
  public destino : Destino;
  public busqueda : Destino;
  public error_general=null;
  public destino_creado=null;
  public destinos: Array<Destino>;
  public ant;
  public sig;

  constructor (
  	private _usuarioService: UsuarioService,
    private _destinoService: DestinoService,
  ){
    this.url = GLOBAL.url;
    this.destino = new Destino("","","",this.lat,this.lng);
    this.busqueda = new Destino("","","",0,0);
  }

  ngOnInit(){
    this.identity = this._usuarioService.get_identity();
    this.token = this._usuarioService.get_token();

    this.obtener_destinos(1);
  }

  private obtener_destinos (page,nombre=null){
    this._destinoService.get_destinos(page,nombre).subscribe(
      response => {
        let destinos = response.destinos;
        this.destinos = destinos;
        this.ant = response.header.anterior;
        this.sig = response.header.siguiente;

        if (destinos.length==0){
          alert('No hay destinos en el sistema');
        }
      },
      error => {
        var error_message = <any>error;
        if (error_message != null){
          var body = JSON.parse(error._body);
          this.error_general = body.message;
        }
      }
    )
  }

  pagina_siguiente (){
    this.obtener_destinos (this.sig);
  }

  pagina_anterior (){
    this.obtener_destinos (this.ant);
  }

  buscar_destino(){
    this.obtener_destinos (1,this.busqueda.nombre);
  }

   mapClicked($event: any) {
      this.lat = parseFloat($event.coords.lat);
      this.lng = parseFloat($event.coords.lng);
   }

   crear_destino(){
     this.destino_creado=null;
      this.error_general=null;
    this._destinoService.crear_destino(this.destino).subscribe(
      response => {
        let destino = response.destino;
        this.destino = destino;

        if (!destino._id){
          alert('error al registrarse');
        }
        else{
          this.destino_creado = 'Destino ' + destino.nombre + ' creado correctamente.';
          this.obtener_destinos(1);
        }
      },
      error => {
        var error_message = <any>error;
        if (error_message != null){
          var body = JSON.parse(error._body);
          this.error_general = body.message;
        }
      }
    );
  }



}

