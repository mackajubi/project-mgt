import { Component, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, startWith } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ApiPayload, Employee } from 'src/app/services/api.model';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { trigger, query, style, transition, stagger, animate } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { SidebarService } from 'src/app/services/sidebar.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Project } from '../workspace.model';
import { ProjectDialogComponent } from 'src/app/dialogs/project-dialog/project-dialog.component';
import { LandAcquisitionDialogComponent } from 'src/app/dialogs/land-acquisition-dialog/land-acquisition-dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-road-rehabilitation',
  templateUrl: './road-rehabilitation.component.html',
  styleUrls: ['./road-rehabilitation.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', [
          style({
            opacity: 0,
            transform: 'translateY(100px)',
          }),
          stagger('20ms', [
            animate('330ms ease-in-out', style({
              opacity: 1,
              transform: 'translateY(0px)'
            }))
          ])
        ], { optional: true })
      ])
    ])
  ]    
})
export class RoadRehabilitationComponent implements OnInit, AfterViewInit, OnDestroy {

  dialogRef?: any;
  processing = true;
  displayedColumns: string[] = [
    'count',
    'ProjectNumber',
    'ProjectName',
    // 'RoadLength',
    // 'SurfaceType',
    'ProjectManager',
    'ProjectEngineer',
    'SupervisingConsultant',
    'WorksContractAmount',
    'WorksContractor',
    'ProjectFunderID',
    'Actions'
  ];
  dataSource: MatTableDataSource<Project>;
  selectedRow: Project | null;
  httpSub: Subscription;
  user: Employee | null;
  makeChanges = false;
  toggleTableActionIcon = true;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private dialog: MatDialog,
    private sidebarService: SidebarService,
    private router: Router,
  ) {
    this.user = this.service.getUser;

    // console.log('user:', this.user);
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {  
      this.onFetch();
    }, 500);
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  checkAccess(): void { 
    this.makeChanges = this.sidebarService.checkAccess(this.user, 'update.projects');
  }

  onFetch(): void {
    this.processing = true;
    this.service.processingBar.next(this.processing);

    this.httpSub = this.http.get<ApiPayload>(this.endpoints.projects, {
      params: {
        Project: '2'
      }
    })
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      const data: Project[] = response.data;

      this.dataSource = new MatTableDataSource(data);

      setTimeout(() => {
        this.checkAccess();
        
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // this.onMakeChanges(this.dataSource.data[0]);
      });

      this.processing = false;
      this.service.processingBar.next(this.processing);
    }, (error) => {
      this.processing = false;
      this.service.processingBar.next(this.processing);
      this.service.determineErrorResponse(error);
    });
  }

  onMakeChanges(row: Project): void {
    // console.log('view project details:', row);
    this.dialogRef = this.dialog.open(ProjectDialogComponent, {
      panelClass: ['project-dialog', 'dialogs'],
      disableClose: true,
      data: { row }
    });

    this.dialogRef.afterClosed().subscribe((result: { status: boolean, project: any }) => {
      if (result.status) {
        this.onFetch();
      }
    }); 
  }

  onManageLandAcquisitionData(row: Project, action: string): void {
    console.log('view project details:', row);
    console.log('action:', action);
    this.dialogRef = this.dialog.open(LandAcquisitionDialogComponent, {
      panelClass: ['land-acquisition-dialog', 'dialogs'],
      disableClose: true,
      data: { row, action },
    });

    this.dialogRef.afterClosed().subscribe((result: { status: boolean, row: any }) => {
      if (result.status) {
        this.onFetch();
      }
    });     
  }  

  onPhysicalProgress(row: Project): void {
    this.router.navigate(['my-account/road-rehabilitation/physical-progress/' + row.ProjectNumber]);
  }  

  onFinancialProgress(row: Project): void {
    this.router.navigate(['my-account/road-rehabilitation/financial-progress/' + row.ProjectNumber]);
  }  

  onLandAcquisition(row: Project): void {
    this.router.navigate(['my-account/road-rehabilitation/land-acquisition/' + row.ProjectNumber]); 
  }  

  onViewDetails(row: Project): void {
    this.router.navigate(['my-account/road-rehabilitation/project/' + row.ProjectNumber]);
  }

  onToggleTableActionIcon(): void {
    this.toggleTableActionIcon = this.toggleTableActionIcon ? false : true;
  }

  ngOnDestroy(): void {
    this.service.processingBar.next(false);

    if (this.dialogRef) { this.dialogRef.close(); }
    if (this.httpSub) { this.httpSub.unsubscribe(); }
  }
}
