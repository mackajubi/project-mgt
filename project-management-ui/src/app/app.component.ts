import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AccountInfo, InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil  } from 'rxjs/operators';
import { ApiEndpointsService } from './services/api-endpoints.service';
import { ApiPayload } from './services/api.model';
import { ApiService } from './services/api.service';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SwUpdate } from '@angular/service-worker';

interface AzureGraphProfile {
  "@odata.context": string;
  businessPhones: string[];
  displayName: string;
  mail: string;
  userPrincipalName: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isIframe = false;
  isLoggedIn = false;
  processing = true;

  private readonly _destroying$ = new Subject<void>();

  constructor(
    private broadcastService: MsalBroadcastService,
    private authService: MsalService,
    private service: ApiService,
    private endpoints: ApiEndpointsService,
    private http: HttpClient,   
    private swUpdate: SwUpdate, 
  ) {
    // this.swUpdate.available.subscribe(event => {
    //   console.log('current version is', event.current);
    //   console.log('available version is', event.available);

    //   if (event.available) {
    //     this.service.openSnackBar('We have an update available. Please wait while we install it shortly', 'success-lg');

    //     this.swUpdate.activateUpdate().then((resolved) => {
    //       setTimeout(() => {
    //         document.location.reload();
    //       }, 4000);
    //     });
    //   }
    // });    
  }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
    })    
  }

  setLoginDisplay() {
    this.processing = false;    
    this.isLoggedIn = this.authService.instance.getAllAccounts().length > 0;

    if (this.isLoggedIn) {
      environment.isSSOLoggedIn = true;
      this.onGetAccess(this.authService.instance.getAllAccounts()[0]);
    }
  }

  private onGetAccess(account: AccountInfo): void {
    this.processing = true;
    // console.log('profile: ', account);

    this.http.get(environment.azure.graphEndPoint)
    .pipe(catchError(this.service.handleError))
    .subscribe((profile: AzureGraphProfile) => {
      // console.log('profile: ', profile);

      const data = {
        HomeAccount: account.homeAccountId,
        Tenant: account.tenantId,
        Client: account.idTokenClaims.aud,
        UserName: account.username,
        WorkEmail: profile.mail
      };
      
      this.http.post<ApiPayload>(this.endpoints.SSOLogin, data)
      .pipe(catchError(this.service.handleError))
      .subscribe((response) => {
  
        this.service.onSignIn = response.data;
        
        this.processing = false;
        // this.service.openSnackBar(response.message + ' 🎉 ', 'success');
      }, (error) => {
        this.processing = false;
        this.service.openSnackBar('Sorry, You have no connection to the server. Please try again later or contact ICT for assistance.', 'error-lg');
      });         
    });     

    // const data = {
    //   HomeAccount: account.homeAccountId,
    //   Tenant: account.tenantId,
    //   Client: account.idTokenClaims.aud,
    //   UserName: account.username
    // };
    
    // this.http.post<ApiPayload>(this.endpoints.SSOLogin, data)
    // .pipe(catchError(this.service.handleError))
    // .subscribe((response) => {

    //   this.service.onSignIn = response.data;
      
    //   this.processing = false;
    //   this.service.openSnackBar(response.message + ' 🎉 ', 'success');
    // }, (error) => {
    //   this.processing = false;
    //   this.service.openSnackBar('Sorry, You have no connection to the server. Please try again later or contact ICT for assistance.', 'error-lg');
    // });    
  }  

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  } 
}
