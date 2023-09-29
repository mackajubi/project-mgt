import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe, DecimalPipe, LocationStrategy, HashLocationStrategy } from '@angular/common';

import { MsalModule, MsalRedirectComponent, MsalGuard, MsalInterceptor, MsalService, MsalBroadcastService, MSAL_INSTANCE, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { FileSaverModule } from 'ngx-filesaver';

import { MaterialModule } from './modules/material.module';
import { SharedModule } from './modules/shared-module.module';
import { AppRoutingModule } from './modules/app-routing.module';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ApiService } from './services/api.service';
import { ApiEndpointsService } from './services/api-endpoints.service';
import { AuthGuard } from './gaurd/auth.guard';
import { TokenIntercepter } from './gaurd/token.interceptor';
import { MSALGuardConfigFactory, MSALInstanceFactory, MSALInterceptorConfigFactory } from './msal-sso';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: false
      // enabled: environment.production,
    }),
    MsalModule,   
    MaterialModule,
    SharedModule,    
    ReactiveFormsModule,
    HttpClientModule,
    FileSaverModule,
  ],
  providers: [
    ApiService,
    ApiEndpointsService,
    DatePipe,
    DecimalPipe,
    MsalGuard,
    MsalService,
    MsalBroadcastService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenIntercepter,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },   
    { // Used when deploying as a subdirectory in iis.
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }    
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
