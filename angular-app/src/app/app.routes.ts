import { Routes } from '@angular/router';
import { AuthGuard } from './route-guard/auth.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/intro', pathMatch: 'full' },
  { path: 'intro', loadComponent: () => import('./features/introduction/introduction.component').then(m => m.IntroductionComponent) },
  {
    path: 'list',
    loadComponent: () => import('./features/todo/item-list/item-list.component').then(m => m.ItemListComponent),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },

  { path: 'bookmark', loadComponent: () => import('./features/todo/bookmark/bookmark.component').then(m => m.BookmarkComponent) },
  {
    path: 'add',
    loadComponent: () => import('./features/todo/add-item/add-item.component').then(m => m.AddItemComponent),
    canActivate: [AuthGuard],
    data:  { roles: ['ADMIN'] }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./features/todo/add-item/add-item.component').then(m => m.AddItemComponent),
    canActivate: [AuthGuard],
    data:  { roles: ['ADMIN'] }
  },
  { path: 'directives', loadComponent: () => import('./features/directives/directives.component').then(m => m.DirectivesComponent) },
  { path: 'data-binding', loadComponent: () => import('./features/data-binding/data-binding.component').then(m => m.DataBindingComponent) },
  { path: 'reactive-form', loadComponent: () => import('./features/reactive-form/reactive-form.component').then(m => m.ReactiveFormComponent) },
  { path: 'lifecycle', loadComponent: () => import('./components/lifecycle/lifecycle.component').then(m => m.LifecycleComponent) },
  { path: 'login', loadComponent: () => import('./features/todo/login/login.component').then(m => m.LoginComponent) },
  { path: 'navbar', loadComponent: () => import('./features/todo/navbar/navbar.component').then(m => m.NavbarComponent) },
  { path: 'profile', loadComponent: () => import('./features/todo/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'signup', loadComponent: () => import('./features/todo/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'custom-table', loadComponent: () => import('./features/custom-table/custom-table.component').then(m => m.CustomTableComponent) },
  { path: 'accounts', loadComponent: () => import('./features/accounts/accounts.component').then(m => m.AccountsComponent) },
  { path: 'audit', loadComponent: () => import('./features/audit/audit.component').then(m => m.AuditComponent) },
];
