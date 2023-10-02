import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LandAcquisition, Project } from 'src/app/pages/workspace/workspace.model';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiPayload, Employee } from 'src/app/services/api.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-land-acquisition-dialog',
  templateUrl: './land-acquisition-dialog.component.html',
  styleUrls: ['./land-acquisition-dialog.component.scss']
})
export class LandAcquisitionDialogComponent implements OnInit, OnDestroy, AfterViewInit {

  processing = false;
  form: FormGroup;
  status = false;
  httpSub: Subscription;
  LandID: number = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { row: Project, action: string },
    private dialogRef: MatDialogRef<LandAcquisitionDialogComponent>,
    private formBuilder: FormBuilder,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private http: HttpClient,
  ) {
    console.log('project:', data.row);
    console.log('action:', data.action);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({     
      LandValued: new FormControl('', [Validators.required, Validators.pattern(/^[0-9.,]+$/)]),
      LandAcquired: new FormControl('', [Validators.pattern(/^[0-9.,]+$/)]),
      PAPsValued: new FormControl('', [Validators.required, Validators.pattern(/^[0-9,]+$/)]),
      PAPsPaid: new FormControl('', [Validators.pattern(/^[0-9,]+$/)]),
      AmountApproved: new FormControl('', [Validators.required, Validators.pattern(/^(UGX. )[0-9,]+[.]?[0-9]{1,2}$/)]),
      AmountPaid: new FormControl('', [Validators.pattern(/^(UGX. )[0-9,]+[.]?[0-9]{1,2}$/)]),
      KMsAcquired: new FormControl('', [Validators.pattern(/^[0-9.,]+$/)]),
    });   
  } 

  ngAfterViewInit(): void {
    if (this.data.action === 'Edit') {
      this.onFetch();
    }
  }  
  
  private onFetch(): void {
    this.processing = true;

    this.httpSub = this.http.get<ApiPayload>(this.endpoints.landAcquisition, {
      params: {
        Project: this.data.row.ProjectID.toString()
      }
    })
    .pipe(catchError(this.service.handleError))
    .subscribe((response) => {
      console.log('response:', response);
      this.LandID = response.data[0].LandID;
      this.updateForm(response.data[0])

      this.processing = false;
    }, (error) => {
      this.processing = false;
      this.service.determineErrorResponse(error);
    });
  }

  onCloseDialog(): void {
    this.dialogRef.close({
      status: this.status,
      row: this.data ? this.data.row : null
    });
  }

  getErrorMessage(): string {
    return this.form.get('LandValued').hasError('required') 
    || this.form.get('LandAcquired').hasError('required') 
    || this.form.get('PAPsValued').hasError('required') 
    || this.form.get('PAPsPaid').hasError('required') 
    || this.form.get('AmountApproved').hasError('required') 
    || this.form.get('AmountPaid').hasError('required') 
    ? 'Please enter a value.' :
    this.form.get('LandValued').hasError('pattern') 
    || this.form.get('LandAcquired').hasError('pattern') 
    || this.form.get('PAPsValued').hasError('pattern') 
    || this.form.get('PAPsPaid').hasError('pattern') 
    || this.form.get('AmountApproved').hasError('pattern') 
    || this.form.get('AmountPaid').hasError('pattern') 
    || this.form.get('KMsAcquired').hasError('pattern') 
    ? 'Wrong entry. Please enter values only.' : '';
  } 

  private updateForm(data: LandAcquisition): void {   
    this.form.patchValue({
      LandValued: data.LandValued,
      LandAcquired: data.LandAcquired,
      PAPsValued: data.PAPsValued,
      PAPsPaid: data.PAPsPaid,
      AmountApproved: data.AmountApproved,
      AmountPaid: data.AmountPaid,
      KMsAcquired: data.KMsAcquired,
    }); 
  }

  private getFormData(): any {
    return {
      LandID: this.data.action === 'Edit' ? this.LandID : 0,
      ProjectID: this.data.row.ProjectID,
      LandValued: (this.form.get('LandValued').value).toString().replaceAll(',', ''),
      LandAcquired: this.form.get('LandAcquired').value ? (this.form.get('LandAcquired').value).toString().replaceAll(',', '') : '',
      PAPsValued: (this.form.get('PAPsValued').value).toString().replaceAll(',', ''),
      PAPsPaid: this.form.get('PAPsPaid').value ? (this.form.get('PAPsPaid').value).toString().replaceAll(',', '') : '',
      AmountApproved: (this.form.get('AmountApproved').value).replace('UGX. ', '').toString().replaceAll(',', ''),
      AmountPaid: this.form.get('AmountPaid').value ? (this.form.get('AmountPaid').value).toString().replace('UGX. ', '').replaceAll(',', '') : '',
      KMsAcquired: this.form.get('KMsAcquired').value ? (this.form.get('KMsAcquired').value).toString().replaceAll(',', '') : '',
    };
  }

  onSave(): void {
    this.processing = true;

    this.form.disable();

    this.httpSub = this.http.post<ApiPayload>(this.endpoints.landAcquisition, this.getFormData())
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

    this.httpSub = this.http.put<ApiPayload>(this.endpoints.landAcquisition, this.getFormData())
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

