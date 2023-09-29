import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Employee } from 'src/app/services/api.model';
import { MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  currentYear = new Date().getFullYear();
  isLoggedIn = false;
  user: Employee;

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private service: ApiService,
    private authService: MsalService,  
    private router: Router  
  ) {
    this.user = this.service.getUser;
  }

  ngOnInit(): void { }

  onSSOLogin() {
    environment.enableMsal = true;

    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }
   
}
