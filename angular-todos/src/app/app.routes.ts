import { Routes } from '@angular/router';
import { Elenco } from './elenco/elenco';
import { Dettaglio } from './dettaglio/dettaglio';

// Definizione delle rotte dell'applicazione
export const routes: Routes = [
  // La pagina iniziale reindirizza all'elenco
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  // Pagina con la lista dei todo
  { path: 'todos', component: Elenco },
  // Pagina di dettaglio con parametro dinamico :id
  { path: 'todos/:id', component: Dettaglio },
  // Qualsiasi altro percorso torna all'elenco
  { path: '**', redirectTo: 'todos' },
];
