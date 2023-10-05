import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LandAcquisition } from 'src/app/pages/workspace/workspace.model';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiPayload } from 'src/app/services/api.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-land-acquisition-dialog',
  templateUrl: './land-acquisition-dialog.component.html',
  styleUrls: ['./land-acquisition-dialog.component.scss']
})
export class LandAcquisitionDialogComponent implements OnInit, OnDestroy {

  processing = false;
  form: FormGroup;
  status = false;
  httpSub: Subscription;
  today =  new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { row: LandAcquisition, ProjectNumber: string },
    private dialogRef: MatDialogRef<LandAcquisitionDialogComponent>,
    private formBuilder: FormBuilder,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private http: HttpClient,
    private datePipe: DatePipe,
    private number: DecimalPipe
  ) {  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({     
      Duration: new FormControl({ value: '', disabled: true }, [Validators.required]),
      LandValued: new FormControl('', [Validators.required, Validators.pattern(/^[0-9.,]+[.]?[0-9]{1,2}$/)]),
      LandAcquired: new FormControl('', [Validators.pattern(/^[0-9.,]+[.]?[0-9]{1,2}$/)]),
      PAPsValued: new FormControl('', [Validators.required, Validators.pattern(/^[0-9,]+$/)]),
      PAPsPaid: new FormControl('', [Validators.pattern(/^[0-9,]+$/)]),
      // AmountApproved: new FormControl('', [Validators.required, Validators.pattern(/^(UGX. )[0-9,]+[.]?[0-9]{1,2}$/)]),
      // AmountPaid: new FormControl('', [Validators.pattern(/^(UGX. )[0-9,]+[.]?[0-9]{1,2}$/)]),
      // AmountPaid: new FormControl('', [Validators.pattern(/^(UGX. )[0-9,]+$/)]),
      AmountApproved: new FormControl('', [Validators.pattern(/^[0-9.,]+[.]?[0-9]{1,2}$/)]),
      AmountPaid: new FormControl('', [Validators.pattern(/^[0-9.,]+[.]?[0-9]{1,2}$/)]),
      KMsAcquired: new FormControl('', [Validators.pattern(/^[0-9.,]+[.]?[0-9]{1,2}$/)]),
    });   

    if (this.data.row) {
      this.updateForm();      
    }
  } 
  
  onCloseDialog(): void {
    this.dialogRef.close({
      status: this.status,
      row: this.data?.row ? this.data.row : null
    });
  }

  getDateErrorMessage() {
    return this.form.get('Duration').hasError('required') ? 'Please choose a date' : '';
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

  private updateForm(): void {   
    this.form.patchValue({
      Duration: new Date(this.data.row.Duration),
      LandValued: this.number.transform(this.data.row.LandValued, '1.2-2'),
      LandAcquired: this.number.transform(this.data.row.LandAcquired, '1.2-2'),
      PAPsValued: this.number.transform(this.data.row.PAPsValued, '1.0-0'),
      PAPsPaid: this.number.transform(this.data.row.PAPsPaid, '1.0-0'),
      // AmountApproved: this.currency.transform(data.AmountApproved, 'UGX. ', 'symbol', '1.0-0'),
      // AmountPaid: this.currency.transform(data.AmountPaid, 'UGX. ', 'symbol', '1.0-0'),
      AmountApproved: this.number.transform(this.data.row.AmountApproved, '1.2-2'),
      AmountPaid: this.number.transform(this.data.row.AmountPaid, '1.2-2'),
      KMsAcquired: this.number.transform(this.data.row.KMsAcquired, '1.0-2'),
    }); 
  }

  private getFormData(): any {
    return {
      LandID: this.data?.row ? this.data.row.LandID : 0,
      Duration: this.datePipe.transform(this.form.get('Duration').value, 'yyyy-MM-dd'),
      ProjectNumber: this.data.ProjectNumber,
      LandValued: (this.form.get('LandValued').value).toString().replaceAll(',', ''),
      LandAcquired: this.form.get('LandAcquired').value ? (this.form.get('LandAcquired').value).toString().replaceAll(',', '') : '',
      PAPsValued: parseInt((this.form.get('PAPsValued').value).toString().replaceAll(',', ''), 10),
      PAPsPaid: this.form.get('PAPsPaid').value ? parseInt((this.form.get('PAPsPaid').value).toString().replaceAll(',', ''), 10) : 0,
      AmountApproved: (this.form.get('AmountApproved').value).toString().replaceAll(',', ''),
      AmountPaid: this.form.get('AmountPaid').value ? (this.form.get('AmountPaid').value).toString().replaceAll(',', '') : '',
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

