import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiPayload, Employee } from 'src/app/services/api.model';
import { ApiService } from 'src/app/services/api.service';
import {
  trigger,
  query,
  style,
  transition,
  stagger,
  animate,
} from '@angular/animations';
import { ChartsData } from '../workspace.model';
import { FormControl, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { map, startWith } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

export interface WorkloadAnalysisBrief {
  EmployeeID: string;
  Employee: string;
  Email: string;
  Position: string;
  DutyStation: string;
  Department: string;
  Directorate: string;
  CreateDate: string;
  Imported: string;
}

export interface DepartmentData {
  DepartmentCode: string;
  DepartmentName: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(
          ':enter',
          [
            style({
              opacity: 0,
              transform: 'translateY(100px)',
            }),
            stagger('20ms', [
              animate(
                '330ms ease-in-out',
                style({
                  opacity: 1,
                  transform: 'translateY(0px)',
                })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  processing = false;
  fullscreen = false;
  init = true;
  update = 0;
  httpSub: Subscription;
  toggleSidebarSub: Subscription;
  // departments: ChartsData[] = [];
  directorates: ChartsData[] = [];
  summary: {
    TotalResponses: number;
    RemainingSubmissions: number;
    CompletionPercentage: number;
    ExcelUploads: number;
    OnlineSubmissions: number;
  } | null;
  noDataFound = false;
  displayedColumns: string[] = [
    'count',
    'CreateDate',
    'FullName',
    'StaffNo',
    'JobTitle',
    'Department',
    'Directorate',
  ];
  toggleTableActionIcon = true;
  dataSource: MatTableDataSource<WorkloadAnalysisBrief>;
  isSidebarShowing = true;

  directoratesData: string[] = [
    'DCS',
    'DHR',
    'DIA',
    'DLS',
    'DNPE',
    'DP',
    'DRBD',
    'DRIP',
    'DRM',
    'OED'
  ];
  departments:DepartmentData[] = [];
  jobTitles:string[] = [];
  filteredJobTitles:string[] = [];

  Directorate = new FormControl('', [Validators.required]);
  Department = new FormControl('', [Validators.required]);
  JobTitle = new FormControl('', [Validators.required]);

  @ViewChild(MatAccordion, { static: false }) private accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('jobTitleSelect', { static: false }) jobTitleSelect: MatSelect;

  constructor(
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.toggleSidebarSub = this.service.toggleSidebar.subscribe(
      (state: boolean) => {
        this.isSidebarShowing = state;
      }
    );  

    this.Directorate.valueChanges.subscribe((value) => {
      if (value === 'ALL') { this.departments.length = 0; }
    });

    this.Department.valueChanges.subscribe((value) => {
      let departments = [...value];
      this.filteredJobTitles.length = 0;

      this.jobTitles.filter((job) => {
        departments.filter(department => {
          if (department === job['department']) {
            this.filteredJobTitles.push(job['job']);
          }
        })
      });
    });     
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.accordion.openAll();
    });  
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  } 

  private disableFormFields(): void {
    this.Directorate.disable();
    this.Department.disable();
  }

  private enableFormFields(): void {
    this.Directorate.enable();
    this.Department.enable();
  }

  private resetDataObjects(): void {
    if (this.dataSource) {
      this.dataSource.data.length = 0;
    }

    this.directorates.length = 0;
    this.summary = null;
  }

  onFetchDepartments(directorate: string): void {   
    this.departments.length = 0;
    this.processing = true;
    this.service.processingBar.next(this.processing);

    this.httpSub = this.http.get<ApiPayload>(this.endpoints.getDepartments,{
      params: {
        Directorate: directorate
      }
    })
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      this.departments = response.data;
      this.jobTitles = response.jobs;

      this.processing = false;
      this.service.processingBar.next(this.processing);
      this.enableFormFields();
    }, (error) => {
      this.processing = false;
      this.service.processingBar.next(this.processing);
      this.service.determineErrorResponse(error);
      this.enableFormFields();
    });
  }  
  
  onSelectAll(): void {
    // console.log('select all the options');
    // console.log('this.jobTitleSelect:', this.jobTitleSelect);
    // console.log('this.jobTitleSelect.selected:', this.jobTitleSelect.selected);
    // this.jobTitleSelect.
  }

  onFetch(): void {
    this.processing = true;
    this.resetDataObjects();
    this.disableFormFields();

    this.service.processingBar.next(this.processing);

    let departmentsArray = [...this.Department.value];
    let departments = '';
    departmentsArray.filter((item) => {
      departments += (departments ? ',' : '') + "'" + item + "'";
    });

    let jobTitlesArray = [...this.JobTitle.value];
    let jobTitles = '';
    jobTitlesArray.filter((item) => {
      jobTitles += (jobTitles ? ',' : '') + "'" + item + "'";
    });

    this.httpSub = this.http
      .get<ApiPayload>(this.endpoints.dashboard,{
        params: {
          Directorate: this.Directorate.value,
          Departments: departments,
          JobTitles: jobTitles,
        }
      })
      .pipe(catchError(this.service.handleError))
      .subscribe(
        (response: ApiPayload) => {
          // console.log('response:', response.data);

          if (response.data) {
            this.directorates = response.data.directorates;
            this.summary = response.data.summary;

            this.dataSource = new MatTableDataSource(
              response.data.workload_analysis
            );

            setTimeout(() => {
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            });

            this.noDataFound = false;
          } else {
            this.noDataFound = true;
          }

          this.processing = false;
          this.service.processingBar.next(this.processing);
          ++this.update;
          this.accordion.closeAll();
          this.enableFormFields();
        },
        (error) => {
          this.processing = false;
          this.noDataFound = true;
          this.accordion.openAll();
          this.enableFormFields();          
          this.service.processingBar.next(this.processing);
          this.service.determineErrorResponse(error);
        }
      );
  }

  onExportToExcel(): void {
    let data = [];
    let mergeData = [];
    let currentRow = 0;

    this.dataSource.data.filter((item, index: number) => {
      let _mergeData = [];
      let _data = [];

      _data.push({
        No: index + 1,
        'Date Submitted': item['CreateDate'],
        'Staff Name': item['FullName'],
        'ID Number': item['StaffNo'],
        'Job Title': item['JobTitle'],
        'Salary Grade': item['SalaryGrade'],
        'Department': item['Department'],
        'Directorate': item['Directorate'],
        'Indicate if your workload has increased': item['HasWorkloadIncreased'],
        'Indicate the major causes of the change in the workload stated above':item['MajorCaseOfWorkloadChange'],
        'Indicate challenges you face in managing your workload effectively':item['ChallengesInManagingWorkload'],
        'Indicate how effective you are when working from home':item['EffectivenessWhenWorkingFromHome'],
        'Should UNRA, continue work from home':item['ShouldUNRAContinueWorkFromHome'],
        'Indicate your reasons for the recommendation above':item['ReasonsForRecommendation'],
        'Controls that can be put inplace to ensure high productivity of staff working from home':item['ControlsForWorkFromHomeEffectiveness'],
        'Other than the current job you hold, list other jobs that you would be interested to work in if there was an opportunity':item['OtherWorkStaffCanDo'],
      });

      // console.log('item Tasks:', item['Tasks']);
      if (!Array.isArray(item['Tasks'])) {
        item['Tasks'] = [];
      }

      item['Tasks'].filter((task) => {
        _data.push({
          'Task Name': task['TaskName'],
          'Volume': task['Volume'],
          'Unit Of Measure': task['UnitOfMeasure'],
          'Task Output': task['TaskOutput'],
          'Frequency': task['Frequency'],
          'Nature Of Task': task['NatureOfTask'],
          'No Of Projects': task['NoOfProjects'],
          'Time to complete a single Unit (Minutes)': task['TimeToComplete'],
          'Total Time to complete the task (Minutes)': task['TotalTimeToCompleteTask'],
          'Cognitive Demand': task['CognitiveDemand'],
          'Physical Demand': task['PhysicalDemand'],
          'Compliance Demand': task['ComplianceDemand'],
          'Collaborative Demand': task['CollaborativeDemand'],
          'Seasonal Demand': task['SeasonalDemand'],
          'Impact': task['Impact'],
          'Level Of Skill Required': task['LevelOfSkillRequired'],
          'RelevanceOf Task': task['RelevanceOfTask'],
          'Task Improvement': task['TaskImprovement'],
        });
      });

      _mergeData.push(
        {s: { r: currentRow + 1, c: 0 },e: { r: currentRow + _data.length, c: 0 },},
        {s: { r: currentRow + 1, c: 1 },e: { r: currentRow + _data.length, c: 1 },},
        {s: { r: currentRow + 1, c: 2 },e: { r: currentRow + _data.length, c: 2 },},
        {s: { r: currentRow + 1, c: 3 },e: { r: currentRow + _data.length, c: 3 },},
        {s: { r: currentRow + 1, c: 4 },e: { r: currentRow + _data.length, c: 4 },},
        {s: { r: currentRow + 1, c: 5 },e: { r: currentRow + _data.length, c: 5 },},
        {s: { r: currentRow + 1, c: 6 },e: { r: currentRow + _data.length, c: 6 },},
        {s: { r: currentRow + 1, c: 7 },e: { r: currentRow + _data.length, c: 7 },},
        {s: { r: currentRow + 1, c: 8 },e: { r: currentRow + _data.length, c: 8 },},
        {s: { r: currentRow + 1, c: 9 },e: { r: currentRow + _data.length, c: 9 },},
        {s: { r: currentRow + 1, c: 10 },e: { r: currentRow + _data.length, c: 10 },},
        {s: { r: currentRow + 1, c: 11 },e: { r: currentRow + _data.length, c: 11 },},
        {s: { r: currentRow + 1, c: 12 },e: { r: currentRow + _data.length, c: 12 },},
        {s: { r: currentRow + 1, c: 13 },e: { r: currentRow + _data.length, c: 13 },},
        {s: { r: currentRow + 1, c: 14 },e: { r: currentRow + _data.length, c: 14 },},
        {s: { r: currentRow + 1, c: 15 },e: { r: currentRow + _data.length, c: 15 },},
      );

      currentRow += _data.length;
      data.push(..._data);
      mergeData.push(..._mergeData);
    });

    this.service.exportAsExcelFile(
      [
        {
          name: 'Workload Analysis Data',
          data: data,
        },
      ],
      'Workload Analysis Data',
      // []
      mergeData
    );
  }

  onToggleTableActionIcon(): void {
    this.toggleTableActionIcon = this.toggleTableActionIcon ? false : true;
  }

  onFullscreen(event): void {
    this.fullscreen = event;
  }

  ngOnDestroy(): void {
    this.service.processingBar.next(false);

    if (this.httpSub) {
      this.httpSub.unsubscribe();
    }
    if (this.toggleSidebarSub) {
      this.toggleSidebarSub.unsubscribe();
    }
  }
}
