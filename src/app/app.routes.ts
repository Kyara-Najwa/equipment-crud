import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EquipmentComponent } from './pages/equipment/equipment.component';
import { AddEquipmentComponent } from './pages/add-equipment/add-equipment.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // ✅ Halaman login & register (tanpa layout)
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(m => m.RegisterComponent)
  },

  // ✅ Halaman dengan layout + butuh login
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
      }
    ]
  },

  // ✅ Redirect fallback jika path tidak ditemukan
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
