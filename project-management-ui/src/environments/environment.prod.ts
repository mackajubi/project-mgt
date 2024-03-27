export const environment = {
  production: true,
  pythonApi: 'https://eservices.unra.go.ug/projectmanagementapi/ProjectMgt/0.0.1/',
  // pythonApi: 'https://eservices.unra.go.ug/projectmanagementapitest/ProjectMgt/0.0.1/',
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
    // redirectUri: 'https://eservices.unra.go.ug/project-management-test',
    redirectUri: 'https://eservices.unra.go.ug/project-management',
    graphEndPoint: 'https://graph.microsoft.com/v1.0/me/'
  },  
  enableMsal: false
};
