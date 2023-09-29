import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Employee } from 'src/app/services/api.model';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  processing = false;
  signOutState = false;
  toggleSidebarSubscription: Subscription;
  signOutSubscription: Subscription;
  user: Employee;
  settingsActive = false;
  onSmallScreen = false;
  interval = 0;
  tasksTotal = 0;

  @Input() toggleNav = true;

  @Output() toggleSidebar = new EventEmitter();

  constructor(
    private service: ApiService,
  ) {
    this.user = this.service.getUser;
    // console.log('User:', this.user);
  }

  ngOnInit(): void {
    this._checkDimensions();

    window.addEventListener('resize', (e) => {
      this._checkDimensions();
    });

    this.signOutSubscription = this.service.signingOut.subscribe((state: boolean) => {
      this.signOutState = state;
    });    
  }

  _checkDimensions(): void {
    if (window.innerWidth > 900) {
      this.toggleNav = true;
      this.toggleSidebar.next(this.toggleNav);
      this.service.toggleSidebar.next(this.toggleNav);
      this.onSmallScreen = false;
    } else if (window.innerWidth <= 900) {
      // // Set to true to open the sidebar automatically on login.
      // this.toggleNav = this.toggleNav ? this.toggleNav : false;

      this.onSmallScreen = true;
      this.toggleNav = false;
    }
  }

  onToggleSidebar(): void {
    this.toggleNav = !this.toggleNav;
    this.toggleSidebar.next(this.toggleNav);
    this.service.toggleSidebar.next(this.toggleNav);
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

  onRecieveTasksTotal(total: number): void {
    this.tasksTotal = total;
  }  

  ngOnDestroy(): void {
    if (this.toggleSidebarSubscription) { this.toggleSidebarSubscription.unsubscribe(); }
    if (this.signOutSubscription) { this.signOutSubscription.unsubscribe(); }
  }  
}
