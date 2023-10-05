import { Component, OnDestroy, ViewChild, AfterViewInit, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ApiPayload } from 'src/app/services/api.model';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { Subscription } from 'rxjs';
import { trigger, query, style, transition, stagger, animate } from '@angular/animations';
import { FinancialProgress, LandAcquisition, PhysicalProgress } from '../workspace.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FinancialProgressDialogComponent } from 'src/app/dialogs/financial-progress-dialog/financial-progress-dialog.component';
import { LandAcquisitionDialogComponent } from 'src/app/dialogs/land-acquisition-dialog/land-acquisition-dialog.component';


@Component({
  selector: 'app-project-land-acquisition',
  templateUrl: './project-land-acquisition.component.html',
  styleUrls: ['./project-land-acquisition.component.scss'],
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
export class ProjectLandAcquisitionComponent implements OnInit, AfterViewInit, OnDestroy {

  dialogRef?: any;
  processing = true;
  displayedColumns: string[] = [
    'count',
    'Duration',
    'LandValued',
    'LandAcquired',
    'PAPsValued',
    'PAPsPaid',
    'AmountApproved',
    'AmountPaid',
    'KMsAcquired',
    'Status',
    'ModifiedBy',
    'LastModified',
    'Actions'
  ];
  dataSource: MatTableDataSource<LandAcquisition>;
  selectedRow: LandAcquisition | null;
  httpSub: Subscription;
  toggleTableActionIcon = true;
  routeSub: Subscription;

  @Input() ProjectNumber: string = null;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private dialog: MatDialog,
  ) { }

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

    this.httpSub = this.http.get<ApiPayload>(this.endpoints.landAcquisition, {
      params: {
        Project: this.ProjectNumber
      }
    })
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      const data: LandAcquisition[] = response.data;

      this.dataSource = new MatTableDataSource(data);

      setTimeout(() => {        
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

      this.processing = false;
      this.service.processingBar.next(this.processing);
    }, (error) => {
      this.processing = false;
      this.service.processingBar.next(this.processing);
      this.service.determineErrorResponse(error);
    });
  }

  onAddLandAcquisition(): void {
    this.dialogRef = this.dialog.open(LandAcquisitionDialogComponent, {
      panelClass: ['land-acquisition-dialog', 'dialogs'],
      disableClose: true,
      data: { 
        ProjectNumber: this.ProjectNumber
      },
    });

    this.dialogRef.afterClosed().subscribe((result: { status: boolean, project: any }) => {
      if (result.status) {
        this.onFetch();
      }
    });     
  }

  onMakeChanges(row: PhysicalProgress): void {
    this.dialogRef = this.dialog.open(LandAcquisitionDialogComponent, {
      panelClass: ['land-acquisition-dialog', 'dialogs'],
      disableClose: true,
      data: { 
        row, 
        ProjectNumber: this.ProjectNumber 
      }
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
