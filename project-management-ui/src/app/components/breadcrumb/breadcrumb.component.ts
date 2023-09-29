import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  breadcrumbSubscription: Subscription;
  activeRoute: string[] | null;
  routerSub: Subscription;

  constructor(
    private service: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {

  }

  ngOnInit(): void {     
    this._getRoutes(this.router.url);  

    this.router.events.subscribe((event: Event) => {
      
      if (!this.activeRoute) {      
        this._getRoutes(this.router.url);
      }
      
      if (event instanceof NavigationEnd) {
        this._getRoutes(event.url);
      }
    });
  }

  private _getRoutes(url: string): void {
    const routes = url.split('/');

    this.activeRoute = routes.slice(2);
    let _activeRoute: string[] =  [];

    this.activeRoute.filter((item) => {
      // console.log('item:', item);
      _activeRoute.push(item.split('-').join(' ').replace('%', ' '));
    });

    this.activeRoute = _activeRoute;

    this.service.updatePageTitle(this.activeRoute);
  }

  ngOnDestroy(): void {
    if (this.breadcrumbSubscription) { this.breadcrumbSubscription.unsubscribe(); }
    if (this.routerSub) { this.routerSub.unsubscribe(); }
  }
}
