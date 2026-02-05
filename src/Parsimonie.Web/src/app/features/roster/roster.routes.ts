import { Routes } from '@angular/router';
import { authGuard, officerGuard } from '../../core/guards/auth.guard';

export const rosterRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./roster-list.component').then(m => m.RosterListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'new',
    loadComponent: () => import('./character-form.component').then(m => m.CharacterFormComponent),
    canActivate: [authGuard, officerGuard]
  },
  {
    path: ':id',
    loadComponent: () => import('./character-detail.component').then(m => m.CharacterDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./character-form.component').then(m => m.CharacterFormComponent),
    canActivate: [authGuard, officerGuard]
  }
];
