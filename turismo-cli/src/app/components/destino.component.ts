import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import  {GLOBAL} from '../services/global';


@Component({
  selector: 'app-inicio',
  templateUrl: '../views/destino/destinos.html',
  styleUrls: ['../../assets/css/template/template.css','../../assets/css/template/formulario.css'],
  providers: [UsuarioService]
})

export class DestinoComponent implements OnInit{
  public identity;
  public token;
  public url: string;

  constructor (
  	private _usuarioService: UsuarioService,
  ){
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._usuarioService.get_identity();
    this.token = this._usuarioService.get_token();
  }

  

}