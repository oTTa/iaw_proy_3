import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import  {GLOBAL} from '../services/global';
import { Usuario } from '../models/usuario';


@Component({
  selector: 'app-register',
  templateUrl: '../views/registrar.html',
  styleUrls: ['../../assets/css/template/template.css','../../assets/css/template/formulario.css'],
  providers: [UsuarioService]
})

export class RegistrarComponent implements OnInit{
  public usuario_registar : Usuario;
  public identity;
  public token;
  public error_general;
  public url: string;
  public mostrar_formulario;

  constructor (
  	private _usuarioService: UsuarioService,
  ){
    this.usuario_registar = new Usuario('','','','','ROLE_USER','','');
    this.url = GLOBAL.url;
    this.mostrar_formulario=true;
  }

  ngOnInit(){
    this.identity = this._usuarioService.get_identity();
    this.token = this._usuarioService.get_token();
  }

  public registrarse(){
    this._usuarioService.registro(this.usuario_registar).subscribe(
      response => {
        let user = response.usuario;
        this.usuario_registar = user;

        if (!user._id){
          alert('error al registrarse');
        }
        else{
          this.mostrar_formulario = false;
          this.usuario_registar = new Usuario('','','','','ROLE_USER','','');
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