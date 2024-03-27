// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  pythonApi: 'http://localhost:1013/ProjectMgt/0.0.1/',
  // pythonApi: 'https://online.unra.go.ug/workloadanalysisproxy/WorkloadAnalysis/0.0.1/',
  unraGen: 'https://eservices.unra.go.ug/unramasterapi/',
  xApiKey: null,
  token: '',
  isLoggedIn: false,
  isSSOLoggedIn: false,
  defaultLanguage: 'en',
  defaultCountryCode: 'UG',
  defaultDisplayDateFormat: 'dd/MM/yyyy',
  defaultDisplayDateTimeFormat: 'dd/MM/yyyy HH:mm:ss',
  defaultLocale: 'en-UG',
  defaultServerDateFormat: 'yyyy-MM-dd',
  defaultServerDateTimeFormat: 'yyyy-MM-ddTHH:mm:ss',
  defaultDigitalInfo: '1.0-2',
  azure: {
    clientId: '51ac598c-f346-4537-b546-f601141b55fe',
    objectId: 'e3983849-0ce8-4f53-b7b4-e38b2e082bb5',
    tenantId: 'https://login.microsoftonline.com/333bcd16-df0a-455c-851c-7c9aae8b68f9',
    redirectUri: 'http://localhost:4200',
    graphEndPoint: 'https://graph.microsoft.com/v1.0/me/'
  },
  enableMsal: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
