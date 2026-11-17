import { Routes } from '@angular/router';
import { Elenco } from './elenco/elenco';
import { Dettaglio } from './dettaglio/dettaglio';

export const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  { path: 'todos', component: Elenco },
  { path: 'todos/:id', component: Dettaglio },
  { path: '**', redirectTo: 'todos' },
];
