import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

export interface Message {
  title: string;
  text: string;
  saveLabel: string;
  noLabel: string;
  give_a_reason: { type: string };
}

export interface ConfirmYesNoResponse {
  status: boolean;
  password: string;
  reason: string;
}

@Component({
  selector: 'app-confirm-yes-no',
  templateUrl: './confirm-yes-no.component.html',
  styleUrls: ['./confirm-yes-no.component.scss']
})
export class ConfirmYesNoComponent implements OnInit {

  message: Message | null;
  hidePassword = true;

  password = new FormControl('', [
    Validators.required,
    Validators.maxLength(500)
  ]);

  reason = new FormControl('', [
    Validators.required,
    Validators.maxLength(500)
  ]);

  constructor(
    private dialogRef: MatDialogRef<ConfirmYesNoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Message) {
    if (data) {
      this.message = data;
    }

    if (this.message.give_a_reason === undefined) {
      this.message.give_a_reason = { type: ''};
    }
  }

  ngOnInit(): void { }

  getPasswordErrorMessage(): string {
    return this.password.hasError('required') ? 'Please enter your password.' :
    this.password.hasError('maxlength') ? 'The password is too long' : '';
  }

  getReasonErrorMessage(): string {
    return this.reason.hasError('required') ? 'Please enter a value.' :
    this.reason.hasError('maxlength') ? 'Too long' : '';
  }

  onCancel(): void {
    this.dialogRef.close({
      status: false,
      password: null,
      reason: null
    });
  }

  onSave(): void {
    this.dialogRef.close({
      status: true,
      password: this.password.value,
      reason: this.reason.value
    });
  }
}
