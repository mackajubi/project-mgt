import { NgModule } from '@angular/core';
import { DatePipe, CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from 'src/app/modules/material.module';
import { SharedModule } from 'src/app/modules/shared-module.module';
import { DashboardPageRoutingModule } from './workspace-routing.module';

import { WorkspaceComponent } from './workspace.component';
import { ResourceSanitizerPipe } from 'src/app/pipes/resource-sanitizer.pipe';
import { SidebarService } from 'src/app/services/sidebar.service';
import { SidebarComponent } from './_layout/sidebar/sidebar.component';
import { HeaderComponent } from './_layout/header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarItemComponent } from './_layout/sidebar/sidebar-item/sidebar-item.component';
import { BridgesDevelopmentComponent } from './bridges-development/bridges-development.component';
import { RoadDevelopmentComponent } from './road-development/road-development.component';
import { RoadRehabilitationComponent } from './road-rehabilitation/road-rehabilitation.component';
import { ProjectDialogComponent } from 'src/app/dialogs/project-dialog/project-dialog.component';

@NgModule({
    declarations: [
        WorkspaceComponent,
        SidebarComponent,
        SidebarItemComponent,
        HeaderComponent,
        DashboardComponent,
        BridgesDevelopmentComponent,
        RoadDevelopmentComponent,
        RoadRehabilitationComponent,
        ProjectDialogComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        DashboardPageRoutingModule,
    ],
    entryComponents: [
        ProjectDialogComponent
    ],
    providers: [
        SidebarService,
        DatePipe,
        ResourceSanitizerPipe,
        CurrencyPipe,
    ]
})
export class WorkspaceModule { }
