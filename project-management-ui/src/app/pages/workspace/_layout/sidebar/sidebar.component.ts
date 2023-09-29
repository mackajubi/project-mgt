import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiPayload, Employee } from 'src/app/services/api.model';
import { ApiService } from 'src/app/services/api.service';
import { SidebarMenuItem, SidebarService } from 'src/app/services/sidebar.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  isMobile = false;
  dialogRef;
  processing = false;
  signOutState = false;
  processingSubscription: Subscription;
  signOutSubscription: Subscription;
  activeRouteSubscription: Subscription;
  httpSub: Subscription;
  user: Employee;
  currentYear = new Date().getFullYear();
  activePanel = null;
  sidebar: SidebarMenuItem[] = [];
  isOnLeave = false;

  @ViewChild(MatSlideToggle, {static: true}) onLeaveToggleBtn: MatSlideToggle;  

  constructor(
    private service: ApiService,
    private sidebarService: SidebarService,
    private endpoints: ApiEndpointsService,
    private dialog: MatDialog,
    private http: HttpClient
  ) {
    this.isMobile = this.service.isAndroidOrIOS();
    this.user = this.service.getUser;
    this.sidebar = this.sidebarService.UserMenu(this.user);
  }

  ngOnInit(): void {
    this.signOutSubscription = this.service.signingOut.subscribe((state: boolean) => {
      this.signOutState = state;
    });

    this.activeRouteSubscription = this.service.activeRoute.subscribe((routes: string[]) => {
      // Only consider the routes if they're more than one. 
      this.activePanel = routes.length > 1 ? routes[routes.length - 2] : null
      this.activePanel = '/' + this.activePanel;
    });
  }

  onSignOut(): void {
    this.processing = true;
    this.service.processingBar.next(this.processing);
    
    this.signOutState = true;
    this.service.signingOut.next(this.signOutState);
    
    if (environment.isSSOLoggedIn) {
      this.service.logout();    
    } else {
      this.service.onSignOut();      
    }
  }

  onPanelState(panel: string): void {
    this.activePanel = panel;
  }  

  onToggleAvailability(event: MatSlideToggle): void {
    // console.log('onValueChange event:', event);     
  }

  ngOnDestroy(): void {
    if (this.dialogRef) { this.dialogRef.close(); }
    if (this.processingSubscription) { this.processingSubscription.unsubscribe(); }
    if (this.signOutSubscription) { this.signOutSubscription.unsubscribe(); }
    if (this.activeRouteSubscription) { this.activeRouteSubscription.unsubscribe(); }
  }
}
