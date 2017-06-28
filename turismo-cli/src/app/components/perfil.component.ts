import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import  {GLOBAL} from '../services/global';
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: '../views/perfil.html',
  styleUrls: ['../../assets/css/template/template.css','../../assets/css/template/formulario.css'],
  providers: [UsuarioService]
})

export class PerfilComponent implements OnInit{
  public usuario_modificar : Usuario;
  public identity;
  public token;
  public error_general;
  public error_general_foto;
  public url: string;
  public modificado;
  public modificado_imagen;
  public filesToUpload: Array<File>;
  public error_foto;

  constructor (
  	private _usuarioService: UsuarioService,
  ){
    this.usuario_modificar = new Usuario(undefined,null,null,undefined,undefined,undefined,undefined);
    this.url = GLOBAL.url;
    this.modificado=false;
    this.modificado_imagen=false;
    this.error_general=false;
    this.error_general_foto=false;
    this.error_foto ="";
  }

  ngOnInit(){
    this.identity = this._usuarioService.get_identity();
    this.token = this._usuarioService.get_token();
  }

  modificar(){
    this._usuarioService.modificar(this.usuario_modificar).subscribe(
      response => {
        let user = response.usuario;
        this.usuario_modificar = user;

        if (!user._id){
          alert('error al registrarse');
        }
        else{
          this.modificado = true;
          this.identity = user;
          this.identity.nombre = this.identity.nombre.replace(/\b./g, function(m){ return m.toUpperCase(); });
          this.identity.apellido = this.identity.apellido.replace(/\b./g, function(m){ return m.toUpperCase(); });
          this.usuario_modificar = new Usuario(undefined,this.identity.nombre,this.identity.apellido,undefined,undefined,undefined,undefined);
          localStorage.setItem('identity',JSON.stringify(this.identity));
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

  cambio_foto_event(fileInput: any){
    this.filesToUpload = fileInput.target.files;
    this.error_general_foto=false;
    this.error_foto = '';
    console.log(this.filesToUpload);
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
          if(xhr.status==200){
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
      this.make_file_request(this.url+'usuarios/'+this.identity._id+'/subir_imagen',[],this.filesToUpload).then(
          (result: any) =>{
            this.identity = result.usuario;
            this.identity.nombre = this.identity.nombre.replace(/\b./g, function(m){ return m.toUpperCase(); });
            this.identity.apellido = this.identity.apellido.replace(/\b./g, function(m){ return m.toUpperCase(); });
            localStorage.setItem('identity',JSON.stringify(this.identity));
            this.modificado_imagen = false;
          }
        );
    }
  }


}