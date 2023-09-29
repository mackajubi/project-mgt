import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

export interface Message {
  msg: string;
  complete?: boolean;
}

@Component({
  selector: 'app-snackbar-processing-request',
  templateUrl: './snackbar-processing-request.component.html',
  styleUrls: ['./snackbar-processing-request.component.scss']
})
export class SnackbarProcessingRequestComponent implements OnInit {
  message: Message = {
    msg: null,
    complete: null,
  };
  sub: Subscription;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private service: ApiService,
    private snackBarRef: MatSnackBarRef<SnackbarProcessingRequestComponent> ) {
      this.sub = this.service.processingState.subscribe((message: Message) => {
        this.message = message;
        this.changeDetector.markForCheck();

        if (this.message.complete) {
          setTimeout(() => {
            this.onClose();
          }, 2000);
        }
      });
  }

  ngOnInit() { }

  onClose() {
    if (this.sub) {this.sub.unsubscribe(); }
    this.snackBarRef.dismiss();
  }

}
