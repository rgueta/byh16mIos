import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    redirectTo:'/login',
    pathMatch:'full'
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'codes',
    loadChildren: () => import('./pages/codes/codes.module').then( m => m.CodesPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'pwd-reset',
    loadChildren: () => import('./pages/pwd-reset/pwd-reset.module').then( m => m.PwdResetPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'store',
    loadChildren: () => import('./pages/store/store.module').then( m => m.StorePageModule)
  },
  {
    path: 'contacts',
    loadChildren: () => import('./modals/contacts/contacts.module').then( m => m.ContactsPageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./modals/info/info.module').then( m => m.InfoPageModule)
  },
  {
    path: 'upd-codes-modal',
    loadChildren: () => import('./modals/upd-codes-modal/upd-codes-modal.module').then( m => m.UpdCodesModalPageModule)
  },
  {
    path: 'upd-cores',
    loadChildren: () => import('./modals/upd-cores/upd-cores.module').then( m => m.UpdCoresPageModule)
  },
  {
    path: 'upd-users',
    loadChildren: () => import('./modals/upd-users/upd-users.module').then( m => m.UpdUsersPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./modals/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'visitors',
    loadChildren: () => import('./modals/visitors/visitors.module').then( m => m.VisitorsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
