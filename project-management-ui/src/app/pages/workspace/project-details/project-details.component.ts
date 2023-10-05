import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiPayload } from 'src/app/services/api.model';
import { ApiService } from 'src/app/services/api.service';
import { Project } from '../workspace.model';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  processing = true;
  project: Project;
  routeSub: Subscription;
  routeParams: { ProjectNumber: string } | null;
  form: FormGroup;
  httpSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private service: ApiService,
    private endpoints: ApiEndpointsService,    
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private number: DecimalPipe
  ) {
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      this.routeParams = {
        ProjectNumber: params.get('ProjectNumber'),
      };
    });        
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({     
      ProjectNumber: new FormControl({ value: '', disabled: true }),
      ProjectName: new FormControl({ value: '', disabled: true }),
      RoadLength: new FormControl({ value: '', disabled: true }),
      SurfaceType: new FormControl({ value: '', disabled: true }),
      ProjectManager: new FormControl({ value: '', disabled: true }),
      ProjectEngineer: new FormControl({ value: '', disabled: true }),    
      WorksSignatureDate: new FormControl({ value: '', disabled: true }),
      CommencementDate: new FormControl({ value: '', disabled: true }),
      WorksCompletionDate: new FormControl({ value: '', disabled: true }),
      RevisedCompletionDate: new FormControl({ value: '', disabled: true }),
      SupervisionSignatureDate: new FormControl({ value: '', disabled: true }),
      SupervisionCompletionDate: new FormControl({ value: '', disabled: true }),  
      SupervisingConsultantContractAmount: new FormControl({ value: '', disabled: true }),
      RevisedSCContractAmount: new FormControl({ value: '', disabled: true }),
      SupervisingConsultant: new FormControl({ value: '', disabled: true }),
      SupervisionProcurementNumber: new FormControl({ value: '', disabled: true }),
      WorksContractAmount: new FormControl({ value: '', disabled: true }),
      RevisedWorksContractAmount: new FormControl({ value: '', disabled: true }),
      WorksContractor: new FormControl({ value: '', disabled: true }),
      WorksProcurementNumber: new FormControl({ value: '', disabled: true }),
      ProjectType: new FormControl({ value: '', disabled: true }),
      ProjectFunderID: new FormControl({ value: '', disabled: true }),
      ProjectStatus: new FormControl({ value: '', disabled: true }),
    });    
  }

  ngAfterViewInit(): void {
    this.service.processingBar.next(this.processing);
    
    setTimeout(() => {
      this.Fetch();
    }, 200);
  }

  private UpdateForm(): void {
    this.form.patchValue({
      ProjectNumber: this.project.ProjectNumber,
      ProjectName: this.project.ProjectName,
      RoadLength: this.project.RoadLength,
      SurfaceType: this.project.SurfaceType,
      ProjectManager: this.project.ProjectManager ? this.project.ProjectManager : 'empty',
      ProjectEngineer: this.project.ProjectEngineer ? this.project.ProjectEngineer : 'empty',    
      WorksSignatureDate: this.project.WorksSignatureDate ? this.datePipe.transform(this.project.WorksSignatureDate, 'EEE, MMM dd y') : 'empty',
      CommencementDate: this.project.CommencementDate ? this.datePipe.transform(this.project.CommencementDate, 'EEE, MMM dd y') : 'empty',
      WorksCompletionDate: this.project.WorksCompletionDate ? this.datePipe.transform(this.project.WorksCompletionDate, 'EEE, MMM dd y') : 'empty',
      RevisedCompletionDate: this.project.RevisedCompletionDate ? this.datePipe.transform(this.project.RevisedCompletionDate, 'EEE, MMM dd y') : 'empty',
      SupervisionSignatureDate: this.project.SupervisionSignatureDate ? this.datePipe.transform(this.project.SupervisionSignatureDate, 'EEE, MMM dd y'): 'empty',
      SupervisionCompletionDate: this.project.SupervisionCompletionDate ? this.datePipe.transform(this.project.SupervisionCompletionDate, 'EEE, MMM dd y') : 'empty',
      SupervisingConsultantContractAmount: this.project.SupervisingConsultantContractAmount ? this.project.SupervisingConsultantContractAmount : 'empty',
      RevisedSCContractAmount: this.project.RevisedSCContractAmount ? this.project.RevisedSCContractAmount : 'empty',
      SupervisingConsultant: this.project.SupervisingConsultant ? this.project.SupervisingConsultant : 'empty',
      SupervisionProcurementNumber: this.project.SupervisionProcurementNumber ? this.project.SupervisionProcurementNumber : 'empty',
      WorksContractAmount: this.project.WorksContractAmount ? this.project.WorksContractAmount : 'empty',
      RevisedWorksContractAmount: this.project.RevisedWorksContractAmount ? this.project.RevisedWorksContractAmount : 'empty',
      WorksContractor: this.project.WorksContractor ? this.project.WorksContractor : 'empty',
      WorksProcurementNumber: this.project.WorksProcurementNumber ? this.project.WorksProcurementNumber : 'empty',
      ProjectType: this.project.ProjectType ? this.project.ProjectType : 'empty',
      ProjectFunderID: this.project.ProjectFunderID ? this.project.ProjectFunderID : 'empty',
      ProjectStatus: this.project.ProjectStatus,
    });       
  }

  private Fetch(): void {
    this.processing = true;
    this.service.processingBar.next(this.processing);    

    this.httpSub = this.http.get<ApiPayload>(this.endpoints.getProject, {
      params: {
        Project: this.routeParams.ProjectNumber
      }
    })
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      console.log('response:', response);
      
      this.project = response.data[0];

      this.UpdateForm();

      this.processing = false;
      this.service.processingBar.next(this.processing);
    }, (error) => {
      this.processing = false;
      this.service.processingBar.next(this.processing);
      this.service.determineErrorResponse(error);
    });
  }

  ngOnDestroy(): void {
    this.service.processingBar.next(false);

    if (this.httpSub) { this.httpSub.unsubscribe(); }
  }
}
