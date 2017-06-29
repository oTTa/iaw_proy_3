import  {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

//usuarios
import { RegistrarComponent } from './components/usuario-registrar.component';
import { PerfilComponent } from './components/perfil.component';
import { InicioComponent } from './components/inicio.component';
import { DestinoComponent } from './components/destino.component';
import { PaqueteComponent } from './components/paquete.component';
import { PaqueteImagenesComponent } from './components/paquete-imagenes.component';
import { VerPaqueteComponent } from './components/ver-paquete.component';


const appRoutes: Routes = [
	{path:'registrarse', component: RegistrarComponent},
	{path:'perfil', component: PerfilComponent},
	{path:'destinos', component: DestinoComponent},
	{path:'paquetes', component: PaqueteComponent},
	{path:'verpaquete', component: VerPaqueteComponent},
	{path:'paquetes/imagenes', component: PaqueteImagenesComponent},
	{path:'**', component: InicioComponent},
	{path:'', component: InicioComponent}

]

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);