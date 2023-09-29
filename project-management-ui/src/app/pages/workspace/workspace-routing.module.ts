import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkspaceComponent } from './workspace.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BridgesDevelopmentComponent } from './bridges-development/bridges-development.component';
import { RoadDevelopmentComponent } from './road-development/road-development.component';
import { RoadRehabilitationComponent } from './road-rehabilitation/road-rehabilitation.component';

const routes: Routes = [
  {
    path: '',
    component: WorkspaceComponent,
    children: [
      {
        path: '',
        redirectTo: 'bridges-development',
        pathMatch: 'full'
      },    
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: 'Submission Dashboard'
        }
      },      
      {
        path: 'bridges-development',
        component: BridgesDevelopmentComponent,
        data: {
          title: 'Bridges Development'
        }
      },      
      {
        path: 'road-development',
        component: RoadDevelopmentComponent,
        data: {
          title: 'Road Development'
        }
      },      
      {
        path: 'road-rehabilitation',
        component: RoadRehabilitationComponent,
        data: {
          title: 'Road Rehabilitation'
        }
      },      
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardPageRoutingModule { }
