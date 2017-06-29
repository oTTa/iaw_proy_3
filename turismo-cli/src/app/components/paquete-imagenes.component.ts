import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { PaqueteService } from '../services/paquete.service';
import  {GLOBAL} from '../services/global';
import { Paquete } from '../models/paquete';
import { Destino } from '../models/destino';


@Component({
  selector: 'app-paquetes-imagenes',
  templateUrl: '../views/paquetes_imagenes.html',
  styleUrls: ['../../assets/css/template/template.css','../../assets/css/template/formulario.css'],
  providers: [UsuarioService, PaqueteService]
})

export class PaqueteImagenesComponent implements OnInit{
  public identity;
  public token;
  public destino_paquetes;
  public url: string;
  public filesToUpload: Array<File>;
  public error_foto;
  public error_general_foto;
  public modificado_imagen;
  public imagenes;
  public paquete;


  constructor (
  	private _usuarioService: UsuarioService,
    private _paqueteService: PaqueteService,
  ){
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._usuarioService.get_identity();
    this.token = this._usuarioService.get_token();
    this.destino_paquetes = JSON.parse(localStorage.getItem('destino'));
    this.paquete = JSON.parse(localStorage.getItem('paquete'));
    this.obtener_imagenes();
  }

  private obtener_imagenes (){
    this._paqueteService.get_imagenes(this.paquete._id).subscribe(
      response => {
        this.imagenes = response.imagenes;
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

    cambio_foto_event(fileInput: any){
    this.filesToUpload = fileInput.target.files;
    this.error_general_foto=false;
    this.error_foto = '';
  }

  make_file_request(url: string, params: Array<string>, files: Array<File>){
    var token = this.token;
    return new Promise(function (resolve,reject){
      var formData:any = new FormData();
      var xhr =new XMLHttpRequest();

      for(var i=0; i<files.length; i++){
        formData.append('image',files[i],files[i].name);
      }

      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
          if(xhr.status==201){
            resolve(JSON.parse(xhr.response));
          }
          else{
            reject(xhr.response);
          }
        }
      }

      xhr.open('POST',url, true);
      xhr.setRequestHeader('Authorization',token);
      xhr.send(formData);
    });
    
  }

  subir_imagen(){
    if (!this.filesToUpload){
      this.error_general_foto=true;
      this.error_foto = 'Seleccione una foto';
    }
    else{
      this.modificado_imagen = true;
      this.make_file_request(this.url+'paquetes/'+this.paquete._id+'/subir_imagen',[],this.filesToUpload).then(
          (result: any) =>{
            this.modificado_imagen = false;
            this.obtener_imagenes();
          }
        );
    }
  }

  borrar_imagen(id_imagen){
    this._paqueteService.borrar_imagen(this.paquete._id,id_imagen).subscribe(
      response => {
          this.obtener_imagenes();
      },
      error => {
        var error_message = <any>error;
        if (error_message != null){
          var body = JSON.parse(error._body);
           alert( body.message);
        }
      }
    );

  }


}