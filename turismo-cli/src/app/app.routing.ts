import  {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

//usuarios
import { RegistrarComponent } from './components/usuario-registrar.component';
import { PerfilComponent } from './components/perfil.component';

const appRoutes: Routes = [
	{path:'registrarse', component: RegistrarComponent},
	{path:'perfil', component: PerfilComponent},
	{path:'**', component: RegistrarComponent}

]

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);