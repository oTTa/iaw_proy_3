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
  public destino_editar : Destino;
  public busqueda : Destino;
  public error_general=null;
  public destino_creado=null;
  public destinos: Array<Destino>;
  public ant;
  public sig;
  public info;
  public editar=false;

  constructor (
  	private _usuarioService: UsuarioService,
    private _destinoService: DestinoService,
  ){
    this.url = GLOBAL.url;
    this.destino = new Destino("","","","",this.lat,this.lng);
    this.destino_editar = new Destino("","","","",this.lat,this.lng);
    this.busqueda = new Destino("","","","",0,0);
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

        for (var i = 0; i < destinos.length; i++) {
            destinos[i].nombre = destinos[i].nombre.replace(/\b./g, function(m){ return m.toUpperCase(); })
            destinos[i].provincia = destinos[i].provincia.replace(/\b./g, function(m){ return m.toUpperCase(); })
            destinos[i].pais = destinos[i].pais.replace(/\b./g, function(m){ return m.toUpperCase(); })
        }

        if (destinos.length==0){
          this.info='No se encontraron destinos.';
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
          alert('error al crear destino');
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

  editar_destino(){
    this.error_general=null;
    this._destinoService.editar_destino(this.destino_editar).subscribe(
      response => {
        let destino = response.destino;
        this.destino = destino;

        if (!destino._id){
          alert('error al editar destino');
        }
        else{
          this.info = 'Destino ' + destino.nombre + ' editado correctamente.';
          let actual;
          if (this.ant==null)
            actual = this.sig-1;
          else if (this.sig==null)
              actual = this.ant+1;
          this.editar=false;
          this.destino = new Destino("","","","",this.lat,this.lng);
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

  preparar_editar(dest){
    this.destino_editar = new Destino(dest._id,dest.nombre,dest.provincia,dest.pais,this.lat,this.lng);
    this.editar=true;
  }

  quitar_editar(){
    this.editar=false;
    this.error_general=null;
  }

  borrar_destino(dest){
    let actual;
    if (this.ant==null)
      actual = this.sig-1;
    else if (this.sig==null)
        actual = this.ant+1;

    if (this.sig==null && this.ant==null)
      actual=1

    this._destinoService.borrar_destino(dest._id).subscribe(
      response => {

          this.info='Destino '+dest.nombre+' borrado correctametne.';
          this.obtener_destinos(actual);
      },
      error => {
        var error_message = <any>error;
        if (error_message != null){
          var body = JSON.parse(error._body);
           this.info = body.message;
        }
      }
    );

  }



}

