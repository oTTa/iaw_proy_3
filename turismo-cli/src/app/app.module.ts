import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { AgmCoreModule } from '@agm/core';

import {routing, appRoutingProviders } from './app.routing';

import { AppComponent } from './app.component';
import { BarraComponent } from './components/barra.component';
import { RegistrarComponent } from './components/usuario-registrar.component';
import { PerfilComponent } from './components/perfil.component';
import { InicioComponent } from './components/inicio.component';
import { DestinoComponent } from './components/destino.component';



@NgModule({
  declarations: [
    AppComponent,
    BarraComponent,
    RegistrarComponent,
    PerfilComponent,
    InicioComponent,
    DestinoComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBhRS7SnEA8mE-K-viYjtKaj659G9hqSJA'
    })
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
