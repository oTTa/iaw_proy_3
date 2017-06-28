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
  public url: string;
  public modificado;

  constructor (
  	private _usuarioService: UsuarioService,
  ){
    this.usuario_modificar = new Usuario('','','','','ROLE_USER','','');
    this.url = GLOBAL.url;
    this.modificado=false;
  }

  ngOnInit(){
    this.identity = this._usuarioService.get_identity();
    this.token = this._usuarioService.get_token();
  }

  public modificar(){
    this._usuarioService.modificar(this.usuario_modificar).subscribe(
      response => {
        let user = response.usuario;
        this.usuario_modificar = user;

        if (!user._id){
          alert('error al registrarse');
        }
        else{
          this.modificado = true;
          this.usuario_modificar = new Usuario('','','','','ROLE_USER','','');
          this.identity = user;
          this.identity.nombre = this.identity.nombre.replace(/\b./g, function(m){ return m.toUpperCase(); });
          this.identity.apellido = this.identity.apellido.replace(/\b./g, function(m){ return m.toUpperCase(); });
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

}