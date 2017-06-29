import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { PaqueteService } from '../services/paquete.service';
import  {GLOBAL} from '../services/global';
import { Paquete } from '../models/paquete';
import { Paquete_destino } from '../models/paquete_destino';
import { Comentario } from '../models/comentario';
import { Destino } from '../models/destino';
import { DomSanitizer } from '@angular/platform-browser';
import { AgmCoreModule } from '@agm/core';
@Component({
  selector: 'app-ver-paquete',
  templateUrl: '../views/ver_paquete.html',
  styleUrls: ['../../assets/css/template/template.css','../../assets/css/template/formulario.css'],
  providers: [UsuarioService, PaqueteService]
})

export class VerPaqueteComponent implements OnInit{
  public identity;
  public token;
  public destino_paquetes;
  public url: string;
  public imagenes;
  public paquete;
  public loop1;
  public loop2;
  public id_imagen;
  public comentario : Comentario;
  public comentario_publicado;


  constructor (
  	private _usuarioService: UsuarioService,
    private _paqueteService: PaqueteService,
    private sanitizer: DomSanitizer

  ){
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._usuarioService.get_identity();
    this.token = this._usuarioService.get_token();
    this.destino_paquetes = JSON.parse(localStorage.getItem('destino_ver'));
    this.paquete = JSON.parse(localStorage.getItem('paquete_ver'));
    this.obtener_imagenes(this.paquete._id);
    this.loop1=0;
    this.comentario = new Comentario(null,"","","");
    this.comentario_publicado=false;
  }

  aumentar_loop1(){
    this.loop1 = (this.loop1+1) % this.imagenes.length;
    this.id_imagen=this.imagenes[this.loop1]._id;
  }

  get_video(){
    return this.sanitizer.bypassSecurityTrustUrl(this.paquete.url_video);
  }

  private obtener_imagenes (id_paquete){
    this._paqueteService.get_imagenes(id_paquete).subscribe(
      response => {
        this.imagenes = response.imagenes;
        this.loop1 = (this.loop1+1) % this.imagenes.length;
        this.id_imagen=this.imagenes[this.loop1]._id;
        console.log(this.imagenes);
      },
      error => {
        var error_message = <any>error;
        if (error_message != null){
          var body = JSON.parse(error._body);
          alert(body.message);
        }
      }
    )
  }

  comentar(){
      this._paqueteService.comentar(this.paquete._id,this.comentario).subscribe(
        response => {

          console.log(response.comentario);
        },
        error => {
          var error_message = <any>error;
          if (error_message != null){
            var body = JSON.parse(error._body);
            alert(body.message);
          }
        }
      )
    }
  

}