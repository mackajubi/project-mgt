import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Employee } from 'src/app/services/api.model';
import { MatDrawer } from '@angular/material/sidenav';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit, OnDestroy, AfterViewInit {

  isMobile = false;
  user: Employee;
  processingBarSubscription: Subscription;
  processing = false;
  hasBackdrop = false;
  mode = 'push';
  loaded = false;
  currentRoute = null;

  @ViewChild(MatDrawer, { static: false }) drawer: MatDrawer;

  constructor(
    private apiService: ApiService,
  ) {
    this.isMobile = this.apiService.isAndroidOrIOS();
    this.user = this.apiService.getUser; 
  }

  ngOnInit(): void {
    this._checkDimensions();

    setTimeout(() => {
      this.loaded = true;
    }, 250);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (window.innerWidth > 900) {
        this.drawer.open();
      }

      window.addEventListener('resize', (e) => {
        this._checkDimensions();
      });
  
      this.processingBarSubscription = this.apiService.processingBar.subscribe((state: boolean) => {
        setTimeout(() => {
          this.processing = state;
        });
      });     
    });
  }

  _checkDimensions(): void {
    if (window.innerWidth <= 900) {
      this.hasBackdrop = true;
      this.mode = 'over';
    } else if (window.innerWidth > 900) {
      this.hasBackdrop = false;
      this.mode = 'push';
    }
  }

  onToggleSidebar(state: boolean): void {
    setTimeout(() => {
      if (state) {
        this.drawer.open();
      } else {
        this.drawer.close();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.processingBarSubscription) { this.processingBarSubscription.unsubscribe(); }
  }
}
