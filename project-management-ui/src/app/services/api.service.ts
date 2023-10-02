import { Injectable } from '@angular/core';
import { Employee } from './api.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable, Subject, throwError } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { MsalService } from '@azure/msal-angular';
import { map } from 'rxjs/operators';
import { ApiEndpointsService } from './api-endpoints.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  processingBar = new Subject();
  toggleSidebar = new Subject();
  activeRoute = new Subject();
  signingOut = new Subject();
  overflow = new Subject();
  processingState = new Subject<{msg: string; complete: boolean}>();
  am4chartColors = ['#67b7dc', '#8067dc', '#dc67ce'];
  search = new Subject();
  employees: Employee[] = [];

  private tokenErrors = ['The access token has expired', 'The token is Missing'];
  private serverError = 'Sorry, please contact ICT for assistance or try again later';
  private user: Employee | null;

  constructor(
    private router: Router,
    private platform: Platform,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private pageTitle: Title,
    private number: DecimalPipe,
    private authService: MsalService,
    private http: HttpClient, 
    private sanitizer: DomSanitizer
  ) {
  }

  set onSignIn(payload: any) {
    const data = this.decodeApiPayload(payload);
    
    this.user = data;
    this.user.Salutation = this.user.Salutation.toLocaleLowerCase();
    
    // Get the user's profile picture.
    this.getUserPhoto()
    .subscribe((photo) => {
      this.user.image = photo
    }, (error) => { }); 

    environment.token = payload;
    environment.isLoggedIn = true;  
    
    // console.log('user:', this.user);
    
    this.router.navigate(['/my-account']);
  }

  onSignOut(): void {
    this.user = null;

    environment.isLoggedIn = false;
    environment.token = '';

    this.signingOut.next(false);
    this.router.navigate(['/login']);
  }

  get getUser(): Employee {
    return this.user;
  }

  isAndroidOrIOS(): boolean {
    return this.platform.ANDROID || this.platform.IOS || this.platform.WEBKIT ? true : false;
  }

  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ? true : false; 
  }

  createConfig(message: string): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'right';
    config.duration = 2000;
    config.panelClass = ['snackBar-cust'];
    config.data = message;
    return config;
  }

  createContributionsConfig(): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'right';
    config.duration = 4000;
    config.panelClass = ['snackBar-cust'];
    return config;
  }

  createErrorConfig(message: string): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'right';
    config.duration = 4000;
    config.panelClass = ['snackBar-err-cust'];
    config.data = message;
    return config;
  }

  createNuetralConfig(message: string): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.duration = 2000;
    config.horizontalPosition = 'right';
    config.panelClass = ['snackBar-nuet-cust'];
    config.data = message;
    return config;
  }

  createProcessingSnackbarConfig(): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'right';
    config.panelClass = ['mat-snack-bar-container-processing'];
    return config;
  }

  createConfigSucWithLong(message: string): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'right';
    config.panelClass = ['snackBar-cust'];
    config.duration = 20000;
    config.data = message;
    return config;
  }

  createConfigErrLong(message: string): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'right';
    config.panelClass = ['snackBar-err-cust'];
    config.duration = 20000;
    config.data = message;
    return config;
  }

  openSnackBar(message: string, type: string): void {
    let config: MatSnackBarConfig<any>;

    if (type === 'success') {
      config = this.createConfig(message);
    } else if (type === 'error') {
      config = this.createErrorConfig(message);
    } else if (type === 'nuetral') {
      config = this.createNuetralConfig(message);
    } else if (type === 'success-lg') {
      config = this.createConfigSucWithLong(message);
    } else if (type === 'error-lg') {
      config = this.createConfigErrLong(message);
    }

    this.snackBar.openFromComponent(SnackbarComponent, config);
  }

  handleError(error: HttpErrorResponse) {
    return throwError({
      error: error.status !== 0 ? error.error : 'Please ensure you have an internet connection and try again or contact ICT for assistance.'
    });
  }

  determineErrorResponse(error: {error?: any}, code?: number) {
    if (error === null || (this.tokenErrors.includes(error.error.message ? error.error.message : error.error))) {
      this.openSnackBar(environment.isLoggedIn ? (error !== null ? error.error : '') : '', 'error');
      this.onSignOut();
      this.router.navigate(['/']);
    } else if (this.user && environment.isLoggedIn) {
      this.openSnackBar(error.error.message ? error.error.message : error.error, 'error-lg');
    } else {
      this.openSnackBar(error.error.message ? error.error.message : error.error, 'error-lg');
    }
  }  

  decodeApiPayload(payload: any): any {
    const data: string = payload;
    
    const base64Url = data.split('.')[1];
    
    return JSON.parse(window.atob(base64Url)).identity;
  }

  scollToTop(top?: number): void {
    const pageWrapper = document.getElementById("main-content-wrapper") as HTMLElement;

    pageWrapper.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: top ? top : 0
    })
  }  

  getWeekStartDate() {
    const today = new Date();

    let year = parseInt(this.datePipe.transform(today, 'yyyy'));
    let month = today.getMonth() + 1;
    const weekDay = today.getDay();
    let dday = parseInt(this.datePipe.transform(today, 'dd'));

    if (weekDay === 0 || weekDay === 1) {
      const curDay = dday;
      dday = dday - 6;
      if (dday <= 0) {
        month--;
        if (month === 2) {
          dday = 28 - (6 - curDay);
        } else {
          dday = 31 - (6 - curDay);
          if (month === 0 && dday >= 26) {
            year--;
            month = 12;
          }
        }
      }
    }

    switch (weekDay) {
      case 2:
        dday = dday - 1 > 0 ? dday - 1 : 1;
        break;
      case 3:
        dday = dday - 2 > 0 ? dday - 2 : 1;
        break;
      case 4:
        dday = dday - 3 > 0 ? dday - 3 : 1;
        break;
      case 5:
        dday = dday - 4 > 0 ? dday - 4 : 1;
        break;
      case 6:
        dday = dday - 5 > 0 ? dday - 5 : 1;
        break;
    }
    const day = dday.toString();
    const newdate = month + '/' + day + '/' + year.toString();

    return {fromDate: new Date(newdate), toDate: new Date()};
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }  

  exportAsExcelFile(json: any[], excelFileName: string, mergeData: any[]): void {
    const workbook: XLSX.WorkBook = {
      Sheets: { },
      SheetNames: [],
    };

    json.filter((item) => {
      workbook.SheetNames.push(item.name);
      const ws_data = item.data;
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ws_data);

      if (mergeData.length) {
        ws['!merges'] = mergeData;        
      }

      workbook.Sheets[item.name] = ws;
    });

    workbook.Props = {
      Title: excelFileName,
      Subject: excelFileName,
      Author: this.user.FullName,
      CreatedDate: new Date(),
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  } 

  async downloadXLS(xlsExportObj: any): Promise<any> {

    // Sample Data
    xlsExportObj = {
      sheet1: [
        {
          TACtivity: '__EMPTY',
          'Subject Enrichment': 'TACtivity\r\n(50% weightage)',
          __EMPTY: 'Observation Worksheet\r\n(20% weightage)',
          __EMPTY_1: 'TACtivty Formative Assessment\r\n(30% weightage)',
          'Multiple Assessments': 'TACtivity Summative Assessment',
          Portfolio: 'Lab Record',
        },
        {
          TACtivity: 'DIY Battery',
          'Subject Enrichment': '25',
          __EMPTY: '10',
          __EMPTY_1: '15',
          'Multiple Assessments': '10',
          Portfolio: '5',
        },
        {
          TACtivity: 'System Generated',
          'Subject Enrichment': '4.42',
          'Multiple Assessments': '4.5',
          Portfolio: '5',
        },
        {
          TACtivity: 'Rounded Off',
          'Subject Enrichment': '5',
          'Multiple Assessments': '5',
          Portfolio: '5',
        },
        {
          TACtivity: 'Teacher Override',
          'Subject Enrichment': '4',
          'Multiple Assessments': '5',
          Portfolio: '5',
        },
      ],
    };
  
    const classroomId = 'Test';

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    for (const key of Object.getOwnPropertyNames(xlsExportObj)) {
      let ws: XLSX.WorkSheet;
      if (key === 'marksSummary') {
        ws = XLSX.utils.json_to_sheet(xlsExportObj[key]);
      } else {
        ws = XLSX.utils.json_to_sheet(xlsExportObj[key]);

        const merge = [
          { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } },
          { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
        ];
        ws['!merges'] = merge;
      }
      XLSX.utils.book_append_sheet(wb, ws, key);
    }
    XLSX.writeFile(wb, `${classroomId}.xlsx`);
  }  

  updatePageTitle(routes: string[]): void {
    // console.log('routes:', routes);

    if (routes.length) {
      const array: string[] = routes[routes.length - 1].split(' ');
      let title = '';
  
      array.forEach(item => {
        title += item[0].toUpperCase() + item.slice(1) + ' ';
      });

      this.pageTitle.setTitle((title) + ' - Uganda National Roads Authority');
      this.activeRoute.next(routes);
    }
  } 

  getDate(time_ms){
    // Remove the milliseconds
    time_ms = time_ms / 1000;

    // Seconds
    var seconds = Math.floor(time_ms % 60) 
    time_ms = time_ms / 60;

    // Minutes
    var minutes = Math.floor(time_ms % 60) 
    time_ms = time_ms / 60;

    // Hours
    var hours = Math.floor(time_ms % 24) 
    
    // Days
    var days = Math.floor(time_ms / 24)
    
    return {'seconds':seconds,'minutes':minutes,'hours':hours,'days':days}
  }

  computeDueDate(days: number): string {
    let daysDue = null;

    if (days) {

      if (days === 0 || days === 1) {
        daysDue = 'today';
      } else if (days < 0) {
        days = days * -1;
        daysDue = 'over due by ' + days.toString() + (days > 1 ? ' days' : ' day');
      } else {
        daysDue = days.toString() + ' days';
      }
      
    }

    return daysDue;
  }  

  computeKmsDue(kms: number): string {
    let kmsDue = null;

    if (kms === 0 || kms === 1) {
      kmsDue = 'today';
    } else if (kms < 0) {
      kms = kms * -1;
      kmsDue = 'over due by ' + this.number.transform(kms, '1.2-2') + (kms > 1 ? ' kms' : ' km');
    } else {
      kmsDue = this.number.transform(kms, '1.2-2') + ' kms';
    }
  
    return kmsDue;
  }  

  getDateSuperscript(date: Date): string {
    let day = parseInt(this.datePipe.transform(date, 'd'));

    if (day === 1 || day === 21) {
      return 'st';
    } else if (day === 2 || day === 22) {
      return 'nd';
    } else if (day === 3 || day === 23) {
      return 'rd';
    } else {
      return 'th';
    }
  }

  logout() { // Add log out function here
    this.authService.logoutRedirect({
      postLogoutRedirectUri: environment.azure.redirectUri
    }).subscribe((result) => {
      environment.isLoggedIn = false;
      environment.token = '';
      this.signingOut.next(false);      
    }, ((error) => { }))
  }  

  getUserPhoto(): Observable<SafeUrl> {
    let requestUrl =  environment.azure.graphEndPoint + `photo/$value`;

    return this.http.get(requestUrl, { responseType: "blob" })
    .pipe(map(result => {
      let url = window.URL;
      const image = this.sanitizer.bypassSecurityTrustUrl(url.createObjectURL(result));
      return image;
    }));
  }    

  getEquipmentPhoto(row: { url: string; Code:string; All: string }): Observable<any> {
    let requestUrl =  row.url;

    return this.http.get(requestUrl, 
      { 
        params: {
          'VehicleCode': row.Code,
          'All': row.All           
        },        
        responseType: "json",
      },
    )
    .pipe(map(result => {
      let url = window.URL;
      const image = result;
      return image;
    }));
  }    

}
