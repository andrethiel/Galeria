import { Routes } from '@angular/router';
import { Index } from './pages/index/index';
import { Galeria } from './pages/galeria/galeria';

export const routes: Routes = [
  // Página principal sem credenciais.
  { path: '', component: Index },

  // A galeria só existe quando os dois parâmetros estão presentes.
  { path: ':senha/:token', component: Galeria },

  // Qualquer URL inválida volta para a página principal.
  { path: '**', redirectTo: '' },
];
