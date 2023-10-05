import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FinancialProgress, LandAcquisition, PhysicalProgress, Project } from 'src/app/pages/workspace/workspace.model';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiPayload } from 'src/app/services/api.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-financial-progress-dialog',
  templateUrl: './financial-progress-dialog.component.html',
  styleUrls: ['./financial-progress-dialog.component.scss']
})
export class FinancialProgressDialogComponent implements OnInit, OnDestroy {

  processing = false;
  form: FormGroup;
  status = false;
  httpSub: Subscription;
  today =  new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { row: FinancialProgress, ProjectNumber: string; },
    private dialogRef: MatDialogRef<FinancialProgressDialogComponent>,
    private formBuilder: FormBuilder,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private http: HttpClient,
    private datePipe: DatePipe,    
  ) {
    console.log('project:', data.row);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({     
      Duration: new FormControl({ value: '', disabled: true }, [Validators.required]),
      PlannedProgress: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+[.]?[0-9]{1,2}$/)]),
      ActualProgress: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+[.]?[0-9]{1,2}$/)]),
      CummulativePlannedProgress: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+[.]?[0-9]{1,2}$/)]),
      CummulativeActualProgress: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+[.]?[0-9]{1,2}$/)]),
    });  
    
    if (this.data.row) {
      this.updateForm();
    }
  } 

  onCloseDialog(): void {
    this.dialogRef.close({
      status: this.status,
      row: this.data ? this.data.row : null
    });
  }

  getDateErrorMessage() {
    return this.form.get('Duration').hasError('required') ? 'Please choose a date' : '';
  }

  getErrorMessage(): string {
    return this.form.get('PlannedProgress').hasError('required') 
    || this.form.get('ActualProgress').hasError('required') 
    || this.form.get('CummulativePlannedProgress').hasError('required') 
    || this.form.get('CummulativeActualProgress').hasError('required')
    ? 'Please enter a value.' :
    this.form.get('PlannedProgress').hasError('pattern') 
    || this.form.get('ActualProgress').hasError('pattern') 
    || this.form.get('CummulativePlannedProgress').hasError('pattern') 
    || this.form.get('CummulativeActualProgress').hasError('pattern')
    ? 'Wrong entry. Please enter values only.' : '';
  } 

  private updateForm(): void {   
    this.form.patchValue({
      Duration: new Date(this.data.row.Duration),
      PlannedProgress: this.data.row.FPlannedProgress,
      ActualProgress: this.data.row.FActualProgress,
      CummulativePlannedProgress: this.data.row.FCummulativePlannedProgress,
      CummulativeActualProgress: this.data.row.FCummulativeActualProgress,
    }); 
  }

  private getFormData(): any {
    return {
      FinancialID: this.data.row ? this.data.row.FinancialID : 0,
      ProjectNumber: this.data.ProjectNumber,
      Duration: this.datePipe.transform(this.form.get('Duration').value, 'yyyy-MM-dd'),
      PlannedProgress: this.form.get('PlannedProgress').value.toString().replaceAll(',', ''),
      ActualProgress: this.form.get('ActualProgress').value.toString().replaceAll(',', ''),
      CummulativePlannedProgress: this.form.get('CummulativePlannedProgress').value.toString().replaceAll(',', ''),
      CummulativeActualProgress: this.form.get('CummulativeActualProgress').value.toString().replaceAll(',', ''),
    };
  }

  onSave(): void {
    this.processing = true;

    this.form.disable();

    this.httpSub = this.http.post<ApiPayload>(this.endpoints.financialProgress, this.getFormData())
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      this.status = true;
      this.service.openSnackBar(response.message, 'success');
      
      if (this.data) {
        this.onCloseDialog();
      } else {
        this.form.enable();
      }

      this.form.reset();
      this.processing = false;

    }, (error) => {
      this.processing = false;
      this.form.enable();      
      this.service.determineErrorResponse(error);
    });   
  }

  onSaveChanges(): void {
    this.processing = true;

    this.form.disable();

    this.httpSub = this.http.put<ApiPayload>(this.endpoints.financialProgress, this.getFormData())
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {

      this.status = true;
      this.service.openSnackBar(response.message, 'success');
      this.onCloseDialog();
      this.processing = false;

    }, (error) => {
      this.processing = false;
      this.form.enable();      
      this.service.determineErrorResponse(error);
    });   
  }

  ngOnDestroy(): void {
    if (this.httpSub) { this.httpSub.unsubscribe(); }
  }  
}

