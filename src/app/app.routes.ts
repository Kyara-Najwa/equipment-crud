import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EquipmentComponent } from './pages/equipment/equipment.component';
import { AddEquipmentComponent } from './pages/add-equipment/add-equipment.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { RequestDetailComponent } from './pages/request-detail/request-detail.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'equipment', pathMatch: 'full' },
      { path: 'equipment', component: EquipmentComponent },
      { path: 'equipment/add', component: AddEquipmentComponent },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/user-list/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'request',
        loadComponent: () =>
          import('./pages/request/request.component').then(m => m.RequestComponent)
      },
      { path: 'request/:id', component: RequestDetailComponent },
      {
        path: 'request-form',
        loadComponent: () =>
          import('./pages/request-form/request-form.component').then(m => m.RequestFormComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
