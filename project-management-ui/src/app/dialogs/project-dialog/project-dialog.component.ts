import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { Project } from 'src/app/pages/workspace/workspace.model';
import { ApiPayload, Employee } from 'src/app/services/api.model';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit, AfterViewInit, OnDestroy {

  processing = false;
  isLinear = false;
  selectedIndex = 2;
  status = false;
  employees: Employee[];
  selectedProjectManager: Employee;
  filteredProjectManager: Observable<Employee[]>;  
  selectedProjectEngineer: Employee;
  filteredProjectEngineer: Observable<Employee[]>;  
  httpSub: Subscription;

  FormStepOne: FormGroup;
  FormStepTwo: FormGroup;
  FormStepThree: FormGroup;

  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { row: Project } | null,
    private dialogRef: MatDialogRef<ProjectDialogComponent>,    
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private http: HttpClient,
    private datePipe: DatePipe
  ) {
    
  }

  ngOnInit(): void {
    this.FormStepOne = this.formBuilder.group({     
      ProjectName: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(255),
      ]),
      RoadLength: new FormControl('', [Validators.required]),
      SurfaceType: new FormControl('', [Validators.required]),
      ProjectManager: new FormControl('', [Validators.required]),
      ProjectEngineer: new FormControl(''),     
    });

    this.FormStepTwo = this.formBuilder.group({     
      WorksSignatureDate: new FormControl('', [Validators.required]),
      CommencementDate: new FormControl('', [Validators.required]),
      WorksCompletionDate: new FormControl('', [Validators.required]),
      RevisedCompletionDate: new FormControl('', [Validators.required]),
      SupervisingConsultant: new FormControl('', []),
      SupervisionSignatureDate: new FormControl('', []),
      SupervisionCompletionDate: new FormControl('', []),
      SupervisingConsultantContractAmount: new FormControl('', []),
    });

    this.FormStepThree = this.formBuilder.group({    
      RevisedSCContractAmount: new FormControl('', []),       
      SupervisionProcurementNumber: new FormControl('', [Validators.required]),
      WorksContractAmount: new FormControl('', [Validators.required]),
      RevisedWorksContractAmount: new FormControl('', [Validators.required]),
      WorksContractor: new FormControl('', [Validators.required]),
      WorksProcurementNumber: new FormControl('', []),
      ProjectTypeID: new FormControl('', []),
      ProjectFunderID: new FormControl('', []),
    });
  }

  ngAfterViewInit(): void {
    this.httpSub = this.fetchMultiple()
    .pipe(catchError(this.service.handleError))
    .subscribe((responseList: ApiPayload[]) => {
      
      this.employees = responseList[0]['allstaff'];

      this.enableForms();

      this.Listeners();

      if (this.data) {
        this.updateForm();
      }      

      this.processing = false;

    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });
  }   
  
  private Listeners():void {
      // Employees
      this.filteredProjectManager = this.FormStepOne.get('ProjectManager').valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterEmployees(value))
      );   
      
      // Register Form Field Listeners
      this.FormStepOne.get('ProjectManager').valueChanges.subscribe((value) => {
        this.employees.filter((employee: Employee) => {
          if (value && (value === employee.FullName)) {
            this.selectedProjectManager = employee;
          }
        });
      });  

      this.FormStepOne.get('ProjectEngineer').valueChanges.subscribe((value) => {
        this.employees.filter((employee: Employee) => {
          if (value && (value === employee.FullName)) {
            this.selectedProjectEngineer = employee;
          }
        });
      });      
  }

  onCloseDialog(): void {
    this.dialogRef.close({
      status: this.status,
      project: this.data.row
    });
  }

  getTaskNameErrorMessage() {
    return this.FormStepOne.get('TaskName').hasError('required') ? 'This Field is required' :
    this.FormStepOne.get('TaskName').hasError('maxlength') ? 'You have reached the maximum' : 
    this.FormStepOne.get('TaskName').hasError('pattern') ? 'Wrong entry. Special characters are not allowed' : '';
  }  

  getErrorMessage() {
    return this.FormStepOne.get('UnitOfMeasure').hasError('required') 
    || this.FormStepOne.get('Output').hasError('required') 
    || this.FormStepOne.get('Frequency').hasError('required') 
    || this.FormStepOne.get('NatureOfTask').hasError('required')
    ? 'This Field is required': '';
  }

  getSelectErrorMessage() {
    return this.FormStepOne.get('ProjectTypeID').hasError('required')
    ? 'Please select from the dropdown' : '';
  }  

  getProjectManagerErrorMessage(): string {
    return this.FormStepOne.get('ProjectManager').hasError('required') ? 'Please choose one.' :
    this.FormStepOne.get('ProjectManager').hasError('maxlength') ? 'You have reached the maximum' : '';
  } 

  getDateErrorMessage() {
    return this.FormStepTwo.get('WorksSignatureDate').hasError('required') 
    || this.FormStepTwo.get('CommencementDate').hasError('required') 
    || this.FormStepTwo.get('WorksCompletionDate').hasError('required') 
    || this.FormStepTwo.get('RevisedCompletionDate').hasError('required') 
    || this.FormStepTwo.get('SupervisionSignatureDate').hasError('required') 
    || this.FormStepTwo.get('SupervisionCompletionDate').hasError('required') 
    ? 'Please choose a date' : '';
  }    

  private filterEmployees(value: string): Employee[] {
    const filterValue = value ? value.toLowerCase() : '';

    return this.employees.filter(option => option.FullName.toLowerCase().includes(filterValue));
  }   

  private fetchMultiple(): Observable<any[]> {
    this.processing = true;
    this.disableForms();

    const reqAllStaff = this.http.get(this.endpoints.getAllStaff);

    return forkJoin([reqAllStaff]);
  }    

  private updateForm(): void {
    // this.disableForms();
    this.processing = true;

    this.FormStepOne.patchValue({
      ProjectName: this.data.row.ProjectName,
      RoadLength: this.data.row.RoadLength,
      SurfaceType: this.data.row.SurfaceType,
      ProjectManager: this.data.row.ProjectManager,
      ProjectEngineer: this.data.row.ProjectEngineer,
    });

    this.FormStepTwo.patchValue({
      WorksSignatureDate: this.data.row.WorksSignatureDate ? new Date(this.data.row.WorksSignatureDate) : null,
      CommencementDate: this.data.row.CommencementDate ? new Date(this.data.row.CommencementDate) : null,
      WorksCompletionDate: this.data.row.WorksCompletionDate ? new Date(this.data.row.WorksCompletionDate) : null,
      RevisedCompletionDate: this.data.row.RevisedCompletionDate ? new Date(this.data.row.RevisedCompletionDate) : null,
      SupervisingConsultant: this.data.row.SupervisingConsultant,
      SupervisionSignatureDate: this.data.row.SupervisionSignatureDate ? new Date(this.data.row.SupervisionSignatureDate) : null,
      SupervisionCompletionDate: this.data.row.SupervisionCompletionDate ? new Date(this.data.row.SupervisionCompletionDate) : null,
      SupervisingConsultantContractAmount: this.data.row.SupervisingConsultantContractAmount,
    });

    this.FormStepThree.patchValue({
      RevisedSCContractAmount: this.data.row.RevisedSCContractAmount,
      SupervisionProcurementNumber: this.data.row.SupervisionProcurementNumber,
      WorksContractAmount: this.data.row.WorksContractAmount,
      RevisedWorksContractAmount: this.data.row.RevisedWorksContractAmount,
      WorksContractor: this.data.row.WorksContractor,
      WorksProcurementNumber: this.data.row.WorksProcurementNumber,
      ProjectTypeID: this.data.row.ProjectTypeID,
      ProjectFunderID: this.data.row.ProjectFunderID,
    });

    setTimeout(() => {
      this.enableForms();
      this.processing = false;
      this.changeDetector.detectChanges();
    });
  }

  private getFormData(): any {    
    const data = {
      ProjectID: this.data.row.ProjectID,
      ProjectNumber: this.data.row.ProjectNumber,
      ProjectName: this.FormStepOne.get('ProjectName').value,
      RoadLength: this.FormStepOne.get('RoadLength').value ? this.FormStepOne.get('RoadLength').value : 0,
      SurfaceType: this.FormStepOne.get('SurfaceType').value ? this.FormStepOne.get('SurfaceType').value : 'NA',
      ProjectManager: this.selectedProjectManager ? this.selectedProjectManager.FullName : '',
      ProjectEngineer: this.selectedProjectEngineer ? this.selectedProjectEngineer.FullName : '',
      WorksSignatureDate: this.FormStepTwo.get('WorksSignatureDate').value ? this.datePipe.transform(this.FormStepTwo.get('WorksSignatureDate').value, 'yyyy-MM-dd') : '',
      CommencementDate: this.FormStepTwo.get('CommencementDate').value ? this.datePipe.transform(this.FormStepTwo.get('CommencementDate').value, 'yyyy-MM-dd') : '',
      WorksCompletionDate: this.FormStepTwo.get('WorksCompletionDate').value ? this.datePipe.transform(this.FormStepTwo.get('WorksCompletionDate').value, 'yyyy-MM-dd') : '',
      RevisedCompletionDate: this.FormStepTwo.get('RevisedCompletionDate').value ? this.datePipe.transform(this.FormStepTwo.get('RevisedCompletionDate').value, 'yyyy-MM-dd') : '',
      SupervisingConsultant: this.FormStepTwo.get('SupervisingConsultant').value ? this.FormStepTwo.get('SupervisingConsultant').value : '',
      SupervisionSignatureDate: this.FormStepTwo.get('SupervisionSignatureDate').value ? this.datePipe.transform(this.FormStepTwo.get('SupervisionSignatureDate').value, 'yyyy-MM-dd') : '',
      SupervisionCompletionDate: this.FormStepTwo.get('SupervisionCompletionDate').value ? this.datePipe.transform(this.FormStepTwo.get('SupervisionCompletionDate').value, 'yyyy-MM-dd') : '',
      SupervisingConsultantContractAmount: this.FormStepTwo.get('SupervisingConsultantContractAmount').value ? this.FormStepTwo.get('SupervisingConsultantContractAmount').value : '',
      RevisedSCContractAmount: this.FormStepThree.get('RevisedSCContractAmount').value ? this.FormStepThree.get('RevisedSCContractAmount').value : '',
      SupervisionProcurementNumber: this.FormStepThree.get('SupervisionProcurementNumber').value ? this.FormStepThree.get('SupervisionProcurementNumber').value : '',
      WorksContractAmount: this.FormStepThree.get('WorksContractAmount').value ? this.FormStepThree.get('WorksContractAmount').value : '',
      RevisedWorksContractAmount: this.FormStepThree.get('RevisedWorksContractAmount').value ? this.FormStepThree.get('RevisedWorksContractAmount').value : '',
      WorksContractor: this.FormStepThree.get('WorksContractor').value ? this.FormStepThree.get('WorksContractor').value : '',
      WorksProcurementNumber: this.FormStepThree.get('WorksProcurementNumber').value ? this.FormStepThree.get('WorksProcurementNumber').value : '',
      ProjectTypeID: this.FormStepThree.get('ProjectTypeID').value,
      ProjectFunderID: this.FormStepThree.get('ProjectFunderID').value ? this.FormStepThree.get('ProjectFunderID').value : '',
    }

    return data;
  }

  private disableForms(): void {
    this.FormStepOne.disable();
    this.FormStepTwo.disable();
    this.FormStepThree.disable();
  }

  private enableForms(): void {
    // this.FormStepOne.enable();
    // this.FormStepTwo.enable();
  }

  onSaveChanges(): void {
    this.processing = true;

    this.disableForms();

    this.httpSub = this.http.post<ApiPayload>(this.endpoints.projects, this.getFormData())
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      this.status = true;

      this.service.openSnackBar(response.message, 'success');
      
      this.onCloseDialog();

      this.processing = false;

    }, (error) => {
      this.processing = false;
      this.enableForms();      
      this.service.determineErrorResponse(error);
    });       
  }

  ngOnDestroy(): void {
    if (this.httpSub) { this.httpSub.unsubscribe(); }
  }  
}

