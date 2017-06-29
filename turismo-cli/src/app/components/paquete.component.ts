import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { PaqueteService } from '../services/paquete.service';
import  {GLOBAL} from '../services/global';
import { Paquete } from '../models/paquete';
import { Destino } from '../models/destino';
import { AgmCoreModule } from '@agm/core';
import { Router, ActivatedRoute } from '@angular/router';
import {IMyDpOptions, IMyDateModel} from 'mydatepicker';


@Component({
  selector: 'app-paquete',
  templateUrl: '../views/paquetes.html',
  styleUrls: ['../../assets/css/template/template.css','../../assets/css/template/formulario.css'],
  providers: [UsuarioService, PaqueteService]
})

export class PaqueteComponent implements OnInit{
  public identity;
  public token;
  public destino_paquetes;
  public url: string;
  public lat: number = -38.8009237;
  public lng: number = -62.343585;
  public paquete : Paquete;
  public paquete_editar : Paquete;
  public error_general=null;
  public paquete_creado=null;
  public paquetes: Array<Paquete>;
  public ant;
  public sig;
  public info;
  public editar=false;
  public fecha_salida: IMyDpOptions = {
        // other options...
        dateFormat: 'dd.mm.yyyy',
    };
  public fecha_regreso: IMyDpOptions = {
        // other options...
        dateFormat: 'dd.mm.yyyy',
    };
  private fecha_salida_aux;
  private fecha_regreso_aux;

  constructor (
  	private _usuarioService: UsuarioService,
    private _paqueteService: PaqueteService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.url = GLOBAL.url;
    this.paquete = new Paquete("","",null,"","","");
    this.paquete_editar = new Paquete(null,null,null,"","","");
  }

  ngOnInit(){
    this.identity = this._usuarioService.get_identity();
    this.token = this._usuarioService.get_token();
    this.destino_paquetes = JSON.parse(localStorage.getItem('destino'));

    this.obtener_paquetes(1);
  }

  private obtener_paquetes (page,nombre=null){
    this._paqueteService.get_paquetes(page,this.destino_paquetes._id).subscribe(
      response => {
        let paquetes = response.paquetes;
        this.paquetes = paquetes;
        console.log(paquetes);
        this.ant = response.header.anterior;
        this.sig = response.header.siguiente;
        if (paquetes.length==0){
          this.info='No se encontraron paquetes.';
        }
        for (var i = 0; i < paquetes.length; i++) {
            paquetes[i].fecha_salida = paquetes[i].fecha_salida.substring(0,10);
            paquetes[i].fecha_regreso = paquetes[i].fecha_regreso.substring(0,10);
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
    this.obtener_paquetes (this.sig);
  }

  pagina_anterior (){
    this.obtener_paquetes (this.ant);
  }


   mapClicked($event: any) {
      this.lat = parseFloat($event.coords.lat);
      this.lng = parseFloat($event.coords.lng);
   }

   crear_paquete(){
    this.paquete.destino = this.destino_paquetes._id;
    this.paquete.fecha_salida =this.fecha_salida_aux;
    this.paquete.fecha_regreso =this.fecha_regreso_aux;
    console.log(this.paquete);
    this.paquete_creado=null;
    this.error_general=null;
    this._paqueteService.crear_paquete(this.paquete).subscribe(
      response => {
        let paquete = response.paquete;
        this.paquete = paquete;

        if (!paquete._id){
          alert('error al crear paquete');
        }
        else{
          this.paquete_creado = 'Paquete  creado correctamente.';
          this.obtener_paquetes(1);
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

  editar_paquete(){
    this.error_general=null;
    this._paqueteService.editar_paquete(this.paquete_editar).subscribe(
      response => {
        let paquete = response.paquete;
        this.paquete = paquete;

        if (!paquete._id){
          alert('error al editar destino');
        }
        else{
          this.info = 'Paquete  editado correctamente.';
          let actual;
          if (this.ant==null)
            actual = this.sig-1;
          else if (this.sig==null)
              actual = this.ant+1;

          if (this.sig==null && this.ant==null)
            actual=1

          this.editar=false;
          this.paquete = new Paquete(null,null,0,"","",null);
          this.obtener_paquetes(1);
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

  preparar_editar(paq){
    this.paquete_editar = new Paquete(paq.fecha_salida,paq.fecha_regreso,paq.costo,paq.descripcion,paq.url_video,this.destino_paquetes._id);
    this.editar=true;
  }

  quitar_editar(){
    this.editar=false;
    this.error_general=null;
  }

  borrar_paquete(dest){
    let actual;
    if (this.ant==null)
      actual = this.sig-1;
    else if (this.sig==null)
        actual = this.ant+1;

    if (this.sig==null && this.ant==null)
      actual=1

    this._paqueteService.borrar_paquete(dest._id).subscribe(
      response => {

          this.info='Paquete borrado correctametne.';
          this.obtener_paquetes(actual);
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

  onDateChanged_salida(event: IMyDateModel){
    let mes;
    let dia;
    if (event.date.month<10)
      mes='0'+event.date.month;
    else
      mes=event.date.month;

    if (event.date.day<10)
      dia='0'+event.date.day;
    else
      dia=event.date.day;
    this.fecha_salida_aux = event.date.year+"-"+mes+"-"+dia;
  }

  onDateChanged_regreso(event: IMyDateModel){
    let mes;
    let dia;
    if (event.date.month<10)
      mes='0'+event.date.month;
    else
      mes=event.date.month;

    if (event.date.day<10)
      dia='0'+event.date.day;
    else
      dia=event.date.day;

    this.fecha_regreso_aux = event.date.year+"-"+mes+"-"+dia;
  }

  ver_imagenes(paq){
    localStorage.setItem('paquete',JSON.stringify(paq));
    this.router.navigateByUrl('paquetes/imagenes')
  }

}

