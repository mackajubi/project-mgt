import { Component, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ApiPayload, Employee } from 'src/app/services/api.model';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { Subscription } from 'rxjs';
import { trigger, query, style, transition, stagger, animate } from '@angular/animations';
import { SidebarService } from 'src/app/services/sidebar.service';
import { PhysicalProgress } from '../workspace.model';
import { ProjectDialogComponent } from 'src/app/dialogs/project-dialog/project-dialog.component';
import { LandAcquisitionDialogComponent } from 'src/app/dialogs/land-acquisition-dialog/land-acquisition-dialog.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PhysicalProgressDialogComponent } from 'src/app/dialogs/physical-progress-dialog/physical-progress-dialog.component';


@Component({
  selector: 'app-project-physical-progress',
  templateUrl: './project-physical-progress.component.html',
  styleUrls: ['./project-physical-progress.component.scss'],
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
export class ProjectPhysicalProgressComponent implements OnInit, AfterViewInit, OnDestroy {

  dialogRef?: any;
  processing = true;
  displayedColumns: string[] = [
    'count',
    'Duration',
    'PlannedProgress',
    'ActualProgress',
    'CummulativePlannedProgress',
    'CummulativeActualProgress',
    'PhysicalStatus',
    'ModifiedBy',
    'LastModified',
    'Actions'
  ];
  dataSource: MatTableDataSource<PhysicalProgress>;
  selectedRow: PhysicalProgress | null;
  httpSub: Subscription;
  makeChanges = false;
  toggleTableActionIcon = true;
  routeSub: Subscription;
  routeParams: { ProjectNumber: string } | null;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private dialog: MatDialog,
    private sidebarService: SidebarService,
    private route: ActivatedRoute,
  ) {
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      this.routeParams = {
        ProjectNumber: params.get('ProjectNumber'),
      };
    });      
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

  onFetch(): void {
    this.processing = true;
    this.service.processingBar.next(this.processing);

    this.httpSub = this.http.get<ApiPayload>(this.endpoints.physicalProgress, {
      params: {
        Project: this.routeParams.ProjectNumber
      }
    })
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      const data: PhysicalProgress[] = response.data;

      this.dataSource = new MatTableDataSource(data);

      setTimeout(() => {        
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

  onAddProgress(): void {
    console.log('show the add new progress dialog.');
    // console.log('view project details:', row);
    this.dialogRef = this.dialog.open(PhysicalProgressDialogComponent, {
      panelClass: ['physical-progress-dialog', 'dialogs'],
      disableClose: true,
      data: { ProjectNumber: this.routeParams.ProjectNumber }
    });

    this.dialogRef.afterClosed().subscribe((result: { status: boolean, project: any }) => {
      if (result.status) {
        this.onFetch();
      }
    });     
  }

  onMakeChanges(row: PhysicalProgress): void {
    // console.log('view project details:', row);
    this.dialogRef = this.dialog.open(PhysicalProgressDialogComponent, {
      panelClass: ['physical-progress-dialog', 'dialogs'],
      disableClose: true,
      data: { row, ProjectNumber: this.routeParams.ProjectNumber }
    });

    this.dialogRef.afterClosed().subscribe((result: { status: boolean, project: any }) => {
      if (result.status) {
        this.onFetch();
      }
    }); 
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
