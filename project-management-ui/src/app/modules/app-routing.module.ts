import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules, ActivatedRoute } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

import { AuthGuard } from '../gaurd/auth.guard';
import { LoginPageComponent } from '../pages/login-page/login-page.component';

const isIframe = window !== window.parent && !window.opener;

const routes: Routes = [
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LoginPageComponent,
    data: {
      title: 'Login'
    }      
  },
  {
    path: 'my-account',
    // canActivate: [AuthGuard],
    loadChildren: () => import('../pages/workspace/workspace.module').then(m => m.WorkspaceModule),
    data: {
      title: 'My Account'
    }      
  }, 
  {
    path: '**',
    redirectTo: '/',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    preloadingStrategy: PreloadAllModules,
    initialNavigation: !isIframe ? 'enabled' : 'disabled' // Don't perform initial navigation in iframes
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
