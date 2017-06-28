import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import  {GLOBAL} from '../services/global';
import { Usuario } from '../models/usuario';


@Component({
  selector: 'barra-nav',
  templateUrl: '../views/barra.html',
  styleUrls: ['../../assets/css/template/navbar.css'],
  providers: [UsuarioService]

})

export class BarraComponent implements OnInit{
  public usuario : Usuario;
  public usuario_registar : Usuario;
  public identity;
  public token;
  public error_general;
  public url: string;


  constructor (
    private _usuarioService: UsuarioService,
  ){
    this.usuario = new Usuario('','','','','ROLE_USER','','');
    this.url = GLOBAL.url;
  }

  ngOnInit(){
      this.identity = this._usuarioService.get_identity();
      this.token = this._usuarioService.get_token();
  }

  public login(){
    this._usuarioService.signup(this.usuario).subscribe(
      response => {
        let identity = response.usuario;
        this.identity = identity;
        this.identity.nombre = this.identity.nombre.replace(/\b./g, function(m){ return m.toUpperCase(); });
        this.identity.apellido = this.identity.apellido.replace(/\b./g, function(m){ return m.toUpperCase(); });
        localStorage.setItem('identity',JSON.stringify(identity));

        if (!this.identity._id){
          alert("El usuario no está correctamente identificado");
        }
        else{
          let token = response.token;
          this.token = token;
          localStorage.setItem('token',token);
          this.usuario = new Usuario('','','','','ROLE_USER','','');
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

  public logout (){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
  }

}