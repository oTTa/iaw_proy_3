import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {routing, appRoutingProviders } from './app.routing';

import { AppComponent } from './app.component';
import { BarraComponent } from './components/barra.component';
import { RegistrarComponent } from './components/usuario-registrar.component';
import { PerfilComponent } from './components/perfil.component';



@NgModule({
  declarations: [
    AppComponent,
    BarraComponent,
    RegistrarComponent,
    PerfilComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
