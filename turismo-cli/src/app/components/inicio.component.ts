
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { DestinoService } from '../services/destino.service';
import { PaqueteService } from '../services/paquete.service';
import  {GLOBAL} from '../services/global';
import { Destino } from '../models/destino';
import { AgmCoreModule } from '@agm/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: '../views/inicio.html',
  styleUrls: ['../../assets/css/template/template.css','../../assets/css/template/formulario.css'],
  providers: [UsuarioService, DestinoService, PaqueteService]
})

export class InicioComponent implements OnInit{
  public identity;
  public token;
  public url: string;
  public destino : Destino;
  public busqueda : Destino;
  public error_general=null;
  public destinos: Array<Destino>;
  public ant;
  public sig;
  public ant_paq;
  public sig_paq;
  public info;
  public destino_paquetes;
  public paquetes;


  constructor (
    private _usuarioService: UsuarioService,
    private _destinoService: DestinoService,
    private _paqueteService: PaqueteService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.url = GLOBAL.url;
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
        this.destinos = destinos;
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

   pagina_siguiente_paq (){
    this.obtener_destinos (this.sig_paq);
  }

  pagina_anterior_paq (){
    this.obtener_destinos (this.ant_paq);
  }

  buscar_destino(){
    this.obtener_destinos (1,this.busqueda.nombre);
  }

  ver_paquetes(dest){
    this.destino_paquetes=dest;
    this.obtener_paquetes(1);
  }

  ver_paquete(dest,paq){
      localStorage.setItem('destino_ver',JSON.stringify(dest));
      localStorage.setItem('paquete_ver',JSON.stringify(paq));
       this.router.navigateByUrl('verpaquete')
  }

  private obtener_paquetes (page,nombre=null){
    this._paqueteService.get_paquetes(page,this.destino_paquetes._id).subscribe(
      response => {
        let paquetes = response.paquetes;
        
        console.log(paquetes);
        this.ant_paq = response.header.anterior;
        this.sig_paq = response.header.siguiente;
        if (paquetes.length==0){
          this.info='No se encontraron paquetes.';
        }
        for (var i = 0; i < paquetes.length; i++) {
            paquetes[i].fecha_salida = paquetes[i].fecha_salida.substring(0,10);
            paquetes[i].fecha_regreso = paquetes[i].fecha_regreso.substring(0,10);
        }
        this.paquetes = paquetes;
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





}